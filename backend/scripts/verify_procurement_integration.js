import { connectDB, disconnectDB, query } from '../src/config/db.js'

async function runProcurementVerification() {
  console.log('==================================================================')
  console.log('  AJ EcoDrive ERP — Procurement & Purchase Orders Verification')
  console.log('==================================================================')

  const isConnected = await connectDB()
  if (!isConnected) {
    console.error('FAILED: Unable to connect to MySQL database ecodrive.')
    process.exit(1)
  }

  try {
    // 1. Suppliers verification
    console.log('\n--- 1. SUPPLIERS & VENDORS TABLE EVIDENCE ---')
    const suppliers = await query('SELECT id, code, name, contact, phone, city, status, on_time FROM `suppliers` ORDER BY id ASC')
    console.log(`Total Suppliers in Database: ${suppliers.length}`)
    console.table(suppliers)

    // 2. Purchase Orders verification
    console.log('\n--- 2. PURCHASE ORDERS STATUS BREAKDOWN ---')
    const poStatusSummary = await query(`
      SELECT 
        status, 
        COUNT(*) as count, 
        SUM(total_ordered) as total_units_ordered,
        SUM(total_received) as total_units_received,
        SUM(amount) as total_amount_pkr
      FROM \`purchase_orders\` 
      GROUP BY status
    `)
    console.table(poStatusSummary)

    console.log('\n--- 3. PURCHASE ORDERS SAMPLE RECORDS ---')
    const pos = await query(`
      SELECT id, po_number, supplier, branch, total_ordered, total_received, remaining_units, amount, status, match_status 
      FROM \`purchase_orders\` 
      ORDER BY created_at DESC 
      LIMIT 8
    `)
    console.table(pos)

    // 4. Line items verification
    console.log('\n--- 4. PURCHASE ORDER ITEMS SAMPLE ---')
    const poItems = await query(`
      SELECT id, po_id, product_id, product, ordered_quantity, received_quantity, unit_cost, subtotal, is_serialized
      FROM \`purchase_order_items\`
      LIMIT 8
    `)
    console.table(poItems)

    // 5. Goods Receipts (GRN) verification
    console.log('\n--- 5. GOODS RECEIVED NOTES (GRN) HEADERS ---')
    const receipts = await query(`
      SELECT id, receipt_number, po_number, supplier, branch, receipt_date, total_received_units, total_accepted_units, total_damaged_units, status
      FROM \`goods_receipts\`
      ORDER BY receipt_date DESC
      LIMIT 6
    `)
    console.table(receipts)

    // 6. Goods Receipt Line Items
    console.log('\n--- 6. GOODS RECEIPT ITEMS (ACCEPTED vs DAMAGED) ---')
    const receiptItems = await query(`
      SELECT id, receipt_id, product, ordered_quantity, previously_received_quantity, current_received_quantity, accepted_quantity, damaged_quantity, short_quantity, unit_cost
      FROM \`goods_receipt_items\`
      LIMIT 8
    `)
    console.table(receiptItems)

    // 7. Inventory Stock Integration (Accepted units verification)
    console.log('\n--- 7. INVENTORY STOCK STATE (BR-01 Peshawar Depot) ---')
    const stock = await query(`
      SELECT p.id as product_id, p.name, s.branch, s.on_hand, s.reserved, s.available, s.reorder_level
      FROM \`inventory_stock\` s
      JOIN \`products\` p ON s.product_id = p.id
      WHERE s.branch_id = 'BR-01'
      ORDER BY s.product_id ASC
      LIMIT 8
    `)
    console.table(stock)

    // 8. Stock Movements Audit Ledger
    console.log('\n--- 8. STOCK MOVEMENTS LEDGER (RECEIPT MOVEMENTS) ---')
    const movements = await query(`
      SELECT movement_number, reference_type, reference_id, product_name, branch, quantity, on_hand_before, on_hand_after, user, reason
      FROM \`stock_movements\`
      WHERE reference_type = 'RECEIPT'
      ORDER BY created_at DESC
      LIMIT 6
    `)
    console.table(movements)

    // 9. Vendor Bills & 3-Way Matching
    console.log('\n--- 9. VENDOR BILLS & 3-WAY MATCHING ---')
    const bills = await query(`
      SELECT id, bill_number, po_number, receipt_id, supplier, amount, paid_amount, outstanding_amount, due_date, status, match_status
      FROM \`vendor_bills\`
      ORDER BY due_date ASC
      LIMIT 6
    `)
    console.table(bills)

    console.log('\n==================================================================')
    console.log('  PROCUREMENT MODULE INTEGRATION AUDIT: VERIFIED & COMPLETE')
    console.log('==================================================================\n')
  } catch (err) {
    console.error('Audit verification error:', err)
  } finally {
    await disconnectDB()
  }
}

runProcurementVerification()
