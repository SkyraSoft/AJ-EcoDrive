import { query, getDbStatus, connectDB, disconnectDB } from '../config/db.js'
import bcrypt from 'bcryptjs'


export const CREATE_CUSTOMERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`customers\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`code\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`first_name\` VARCHAR(128) NULL,
  \`last_name\` VARCHAR(128) NULL,
  \`phone\` VARCHAR(64) NOT NULL,
  \`email\` VARCHAR(191) NULL,
  \`cnic\` VARCHAR(32) NULL,
  \`address\` TEXT NULL,
  \`city\` VARCHAR(128) NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`type\` VARCHAR(64) NOT NULL DEFAULT 'Individual',
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Active',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#dcfce7] text-[#165A31]',
  \`spent\` VARCHAR(64) NOT NULL DEFAULT 'PKR 0',
  \`total_purchases\` VARCHAR(64) NOT NULL DEFAULT 'PKR 0',
  \`balance\` VARCHAR(64) NOT NULL DEFAULT '0',
  \`outstanding\` VARCHAR(64) NOT NULL DEFAULT 'PKR 0',
  \`ltv\` VARCHAR(64) NOT NULL DEFAULT '0',
  \`units\` INT NOT NULL DEFAULT 0,
  \`orders\` INT NOT NULL DEFAULT 0,
  \`orders_count\` INT NOT NULL DEFAULT 0,
  \`activity\` VARCHAR(128) NOT NULL DEFAULT 'Just now',
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_customer_code\` (\`code\`),
  KEY \`idx_customer_branch\` (\`branch_id\`),
  KEY \`idx_customer_phone\` (\`phone\`),
  KEY \`idx_customer_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_QUOTATIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`quotations\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`quote_number\` VARCHAR(64) NOT NULL,
  \`customer_id\` VARCHAR(64) NOT NULL,
  \`customer_name\` VARCHAR(255) NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`product_id\` VARCHAR(64) NULL,
  \`product\` VARCHAR(255) NULL,
  \`quantity\` VARCHAR(64) NULL DEFAULT '1 unit',
  \`subtotal\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`discount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`total\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Draft',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#eff6ff] text-[#2563eb]',
  \`validity\` VARCHAR(64) NULL,
  \`payment_terms\` VARCHAR(255) NULL DEFAULT '100% Advance / Bank Transfer',
  \`tax_reg_fees\` VARCHAR(255) NULL DEFAULT 'Included in Quote',
  \`delivery_lead_time\` VARCHAR(255) NULL,
  \`notes\` TEXT NULL,
  \`owner\` VARCHAR(128) NULL DEFAULT 'Hamza Ali',
  \`sales_order_id\` VARCHAR(64) NULL,
  \`date\` VARCHAR(64) NULL DEFAULT 'Today',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_quote_number\` (\`quote_number\`),
  KEY \`idx_quote_customer\` (\`customer_id\`),
  KEY \`idx_quote_branch\` (\`branch_id\`),
  KEY \`idx_quote_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_QUOTATION_ITEMS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`quotation_items\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`quotation_id\` VARCHAR(64) NOT NULL,
  \`product_id\` VARCHAR(64) NULL,
  \`product\` VARCHAR(255) NOT NULL,
  \`quantity\` INT NOT NULL DEFAULT 1,
  \`selling_price\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`subtotal\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`warranty\` VARCHAR(255) NULL DEFAULT '1-Year Standard Service',
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_item_quotation_id\` (\`quotation_id\`),
  CONSTRAINT \`fk_quotation_items_quotation\` FOREIGN KEY (\`quotation_id\`) REFERENCES \`quotations\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_ORDERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`orders\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`order_number\` VARCHAR(64) NOT NULL,
  \`quotation_id\` VARCHAR(64) NULL,
  \`customer_id\` VARCHAR(64) NOT NULL,
  \`customer_name\` VARCHAR(255) NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`product_id\` VARCHAR(64) NULL,
  \`product\` VARCHAR(255) NULL,
  \`unit_id\` VARCHAR(64) NULL,
  \`unit\` VARCHAR(128) NULL DEFAULT 'To be allocated',
  \`subtotal\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`discount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`total\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`paid\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`balance\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`payment_method\` VARCHAR(64) NULL DEFAULT 'Bank Transfer',
  \`transaction_id\` VARCHAR(128) NULL,
  \`bank_account\` VARCHAR(255) NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Processing',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#eff6ff] text-[#2563eb]',
  \`delivery\` VARCHAR(64) NULL DEFAULT 'Pending',
  \`salesperson\` VARCHAR(128) NULL DEFAULT 'Hamza Ali',
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_order_number\` (\`order_number\`),
  UNIQUE KEY \`uniq_order_quotation_id\` (\`quotation_id\`),
  KEY \`idx_order_customer\` (\`customer_id\`),
  KEY \`idx_order_branch\` (\`branch_id\`),
  KEY \`idx_order_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_ORDER_ITEMS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`order_items\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`order_id\` VARCHAR(64) NOT NULL,
  \`product_id\` VARCHAR(64) NULL,
  \`product\` VARCHAR(255) NOT NULL,
  \`quantity\` INT NOT NULL DEFAULT 1,
  \`unit_price\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`subtotal\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`warranty\` VARCHAR(255) NULL DEFAULT '1-Year Standard Service',
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_item_order_id\` (\`order_id\`),
  CONSTRAINT \`fk_order_items_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_INVOICES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`invoices\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`invoice_number\` VARCHAR(64) NOT NULL,
  \`order_id\` VARCHAR(64) NULL,
  \`order_number\` VARCHAR(64) NULL,
  \`customer_id\` VARCHAR(64) NOT NULL,
  \`customer_name\` VARCHAR(255) NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`subtotal\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`discount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`tax\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`total\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`paid_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`outstanding_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Unpaid',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#eff6ff] text-[#2563eb]',
  \`issued_date\` DATE NULL,
  \`due_date\` DATE NULL,
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_invoice_number\` (\`invoice_number\`),
  KEY \`idx_invoice_order\` (\`order_id\`),
  KEY \`idx_invoice_customer\` (\`customer_id\`),
  KEY \`idx_invoice_branch\` (\`branch_id\`),
  KEY \`idx_invoice_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_INVOICE_ITEMS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`invoice_items\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`invoice_id\` VARCHAR(64) NOT NULL,
  \`product_id\` VARCHAR(64) NULL,
  \`description\` VARCHAR(255) NOT NULL,
  \`quantity\` INT NOT NULL DEFAULT 1,
  \`unit_price\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`subtotal\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_item_invoice_id\` (\`invoice_id\`),
  CONSTRAINT \`fk_invoice_items_invoice\` FOREIGN KEY (\`invoice_id\`) REFERENCES \`invoices\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_PAYMENTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`payments\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`payment_number\` VARCHAR(64) NOT NULL,
  \`invoice_id\` VARCHAR(64) NOT NULL,
  \`order_id\` VARCHAR(64) NULL,
  \`customer_id\` VARCHAR(64) NOT NULL,
  \`customer_name\` VARCHAR(255) NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`payment_method\` VARCHAR(64) NOT NULL DEFAULT 'Bank Transfer',
  \`amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`transaction_ref\` VARCHAR(128) NULL,
  \`bank_account\` VARCHAR(255) NULL,
  \`payment_date\` DATE NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Reconciled',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#dcfce7] text-[#165A31]',
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_payment_number\` (\`payment_number\`),
  UNIQUE KEY \`uniq_payment_transaction_ref\` (\`transaction_ref\`),
  KEY \`idx_payment_invoice\` (\`invoice_id\`),
  KEY \`idx_payment_order\` (\`order_id\`),
  KEY \`idx_payment_customer\` (\`customer_id\`),
  KEY \`idx_payment_branch\` (\`branch_id\`),
  KEY \`idx_payment_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_CATEGORIES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`code\` VARCHAR(64) NOT NULL,
  \`description\` TEXT NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Active',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_category_code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_PRODUCTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`products\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`model_name\` VARCHAR(255) NULL,
  \`sku\` VARCHAR(128) NOT NULL,
  \`category_id\` VARCHAR(64) NOT NULL,
  \`category\` VARCHAR(255) NOT NULL,
  \`specs\` TEXT NULL,
  \`selling_price\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`cost_price\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`dealer_price\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`warranty\` VARCHAR(128) NULL,
  \`warranty_months\` INT NOT NULL DEFAULT 12,
  \`is_serialized\` TINYINT(1) NOT NULL DEFAULT 1,
  \`reorder_level\` INT NOT NULL DEFAULT 5,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Active',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#dcfce7] text-[#165A31]',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_product_sku\` (\`sku\`),
  KEY \`idx_product_category\` (\`category_id\`),
  KEY \`idx_product_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_INVENTORY_STOCK_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`inventory_stock\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`product_id\` VARCHAR(64) NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`on_hand\` INT NOT NULL DEFAULT 0,
  \`reserved\` INT NOT NULL DEFAULT 0,
  \`available\` INT NOT NULL DEFAULT 0,
  \`reorder_level\` INT NOT NULL DEFAULT 5,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_stock_prod_branch\` (\`product_id\`, \`branch_id\`),
  KEY \`idx_stock_branch\` (\`branch_id\`),
  KEY \`idx_stock_product\` (\`product_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_SERIALIZED_UNITS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`serialized_units\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`unit_id\` VARCHAR(64) NOT NULL,
  \`serial_number\` VARCHAR(128) NOT NULL,
  \`chassis_number\` VARCHAR(128) NULL,
  \`vin\` VARCHAR(128) NULL,
  \`motor_number\` VARCHAR(128) NULL,
  \`battery_number\` VARCHAR(128) NULL,
  \`product_id\` VARCHAR(64) NOT NULL,
  \`product_name\` VARCHAR(255) NOT NULL,
  \`sku\` VARCHAR(128) NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`location\` VARCHAR(128) NOT NULL DEFAULT 'Showroom Floor',
  \`landed_cost\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`selling_price\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Available',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#dcfce7] text-[#165A31]',
  \`condition_status\` VARCHAR(64) NOT NULL DEFAULT 'Good',
  \`source_po\` VARCHAR(64) NULL,
  \`receipt_id\` VARCHAR(64) NULL,
  \`order_id\` VARCHAR(64) NULL,
  \`customer_id\` VARCHAR(64) NULL,
  \`warranty_expiry\` DATE NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_unit_id\` (\`unit_id\`),
  UNIQUE KEY \`uniq_unit_serial\` (\`serial_number\`),
  KEY \`idx_unit_product\` (\`product_id\`),
  KEY \`idx_unit_branch\` (\`branch_id\`),
  KEY \`idx_unit_status\` (\`status\`),
  KEY \`idx_unit_order\` (\`order_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_STOCK_MOVEMENTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`stock_movements\` (
  \`id\` BIGINT AUTO_INCREMENT NOT NULL,
  \`movement_number\` VARCHAR(64) NOT NULL,
  \`reference_type\` VARCHAR(64) NOT NULL,
  \`reference_id\` VARCHAR(128) NOT NULL,
  \`product_id\` VARCHAR(64) NOT NULL,
  \`product_name\` VARCHAR(255) NOT NULL,
  \`unit_id\` VARCHAR(64) NULL,
  \`branch_id\` VARCHAR(64) NOT NULL,
  \`branch\` VARCHAR(128) NOT NULL,
  \`quantity\` INT NOT NULL,
  \`on_hand_before\` INT NOT NULL DEFAULT 0,
  \`on_hand_after\` INT NOT NULL DEFAULT 0,
  \`user\` VARCHAR(128) NOT NULL DEFAULT 'System',
  \`reason\` VARCHAR(255) NOT NULL,
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_movement_num\` (\`movement_number\`),
  KEY \`idx_mov_product\` (\`product_id\`),
  KEY \`idx_mov_branch\` (\`branch_id\`),
  KEY \`idx_mov_ref\` (\`reference_type\`, \`reference_id\`),
  KEY \`idx_mov_created\` (\`created_at\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_STOCK_ADJUSTMENTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`stock_adjustments\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`adjustment_number\` VARCHAR(64) NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`product_id\` VARCHAR(64) NOT NULL,
  \`product_name\` VARCHAR(255) NOT NULL,
  \`unit_id\` VARCHAR(64) NULL,
  \`adjustment_type\` VARCHAR(64) NOT NULL DEFAULT 'Quantity',
  \`old_quantity\` INT NOT NULL DEFAULT 0,
  \`new_quantity\` INT NOT NULL DEFAULT 0,
  \`difference\` INT NOT NULL DEFAULT 0,
  \`reason\` VARCHAR(255) NOT NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Pending',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#fef3c7] text-[#b45309]',
  \`requested_by\` VARCHAR(128) NOT NULL,
  \`approved_by\` VARCHAR(128) NULL,
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_adj_num\` (\`adjustment_number\`),
  KEY \`idx_adj_product\` (\`product_id\`),
  KEY \`idx_adj_branch\` (\`branch_id\`),
  KEY \`idx_adj_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_STOCK_TRANSFERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`stock_transfers\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`transfer_number\` VARCHAR(64) NOT NULL,
  \`from_branch_id\` VARCHAR(64) NOT NULL,
  \`from_branch\` VARCHAR(128) NOT NULL,
  \`to_branch_id\` VARCHAR(64) NOT NULL,
  \`to_branch\` VARCHAR(128) NOT NULL,
  \`total_units\` INT NOT NULL DEFAULT 1,
  \`carrier\` VARCHAR(255) NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Pending',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#fef3c7] text-[#b45309]',
  \`requested_by\` VARCHAR(128) NOT NULL,
  \`approved_by\` VARCHAR(128) NULL,
  \`dispatched_by\` VARCHAR(128) NULL,
  \`received_by\` VARCHAR(128) NULL,
  \`notes\` TEXT NULL,
  \`dispatched_at\` TIMESTAMP NULL,
  \`received_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_trans_num\` (\`transfer_number\`),
  KEY \`idx_trans_from\` (\`from_branch_id\`),
  KEY \`idx_trans_to\` (\`to_branch_id\`),
  KEY \`idx_trans_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_STOCK_TRANSFER_ITEMS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`stock_transfer_items\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`transfer_id\` VARCHAR(64) NOT NULL,
  \`product_id\` VARCHAR(64) NOT NULL,
  \`product_name\` VARCHAR(255) NOT NULL,
  \`sku\` VARCHAR(128) NULL,
  \`quantity\` INT NOT NULL DEFAULT 1,
  \`dispatched_qty\` INT NOT NULL DEFAULT 0,
  \`received_qty\` INT NOT NULL DEFAULT 0,
  \`unit_ids\` JSON NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_trans_item_transfer\` (\`transfer_id\`),
  CONSTRAINT \`fk_trans_items_transfer\` FOREIGN KEY (\`transfer_id\`) REFERENCES \`stock_transfers\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_SUPPLIERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`suppliers\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`code\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`contact\` VARCHAR(128) NOT NULL,
  \`phone\` VARCHAR(64) NOT NULL,
  \`email\` VARCHAR(191) NULL,
  \`address\` TEXT NULL,
  \`city\` VARCHAR(128) NULL,
  \`country\` VARCHAR(128) NOT NULL DEFAULT 'Pakistan',
  \`tax_id\` VARCHAR(64) NULL,
  \`terms\` VARCHAR(64) NOT NULL DEFAULT 'Net 30',
  \`currency\` VARCHAR(32) NOT NULL DEFAULT 'PKR',
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Active',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#dcfce7] text-[#165A31]',
  \`on_time\` VARCHAR(32) NOT NULL DEFAULT '100%',
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_supplier_code\` (\`code\`),
  UNIQUE KEY \`uniq_supplier_name\` (\`name\`),
  KEY \`idx_supplier_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_PURCHASE_ORDERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`purchase_orders\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`po_number\` VARCHAR(64) NOT NULL,
  \`supplier_id\` VARCHAR(64) NOT NULL,
  \`supplier\` VARCHAR(255) NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`destination\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`total_ordered\` INT NOT NULL DEFAULT 0,
  \`total_received\` INT NOT NULL DEFAULT 0,
  \`remaining_units\` INT NOT NULL DEFAULT 0,
  \`subtotal\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`tax\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`order_date\` DATE NOT NULL,
  \`expected_date\` DATE NULL,
  \`carrier\` VARCHAR(128) NULL,
  \`tracking\` VARCHAR(128) NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Draft',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-gray-100 text-gray-700',
  \`match_status\` VARCHAR(64) NOT NULL DEFAULT '—',
  \`requested_by\` VARCHAR(128) NULL,
  \`approved_by\` VARCHAR(128) NULL,
  \`approved_at\` TIMESTAMP NULL,
  \`cancelled_by\` VARCHAR(128) NULL,
  \`cancelled_at\` TIMESTAMP NULL,
  \`cancellation_reason\` TEXT NULL,
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_po_number\` (\`po_number\`),
  KEY \`idx_po_supplier\` (\`supplier_id\`),
  KEY \`idx_po_branch\` (\`branch_id\`),
  KEY \`idx_po_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_PURCHASE_ORDER_ITEMS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`purchase_order_items\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`po_id\` VARCHAR(64) NOT NULL,
  \`product_id\` VARCHAR(64) NOT NULL,
  \`product\` VARCHAR(255) NOT NULL,
  \`sku\` VARCHAR(128) NULL,
  \`ordered_quantity\` INT NOT NULL DEFAULT 1,
  \`received_quantity\` INT NOT NULL DEFAULT 0,
  \`unit_cost\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`subtotal\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`is_serialized\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_po_item_po\` (\`po_id\`),
  KEY \`idx_po_item_product\` (\`product_id\`),
  CONSTRAINT \`fk_po_items_po\` FOREIGN KEY (\`po_id\`) REFERENCES \`purchase_orders\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_GOODS_RECEIPTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`goods_receipts\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`receipt_number\` VARCHAR(64) NOT NULL,
  \`po_id\` VARCHAR(64) NOT NULL,
  \`po_number\` VARCHAR(64) NOT NULL,
  \`supplier_id\` VARCHAR(64) NOT NULL,
  \`supplier\` VARCHAR(255) NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`delivery_note\` VARCHAR(128) NULL,
  \`receipt_date\` DATE NOT NULL,
  \`received_by\` VARCHAR(128) NOT NULL,
  \`location\` VARCHAR(128) NULL,
  \`total_received_units\` INT NOT NULL DEFAULT 0,
  \`total_accepted_units\` INT NOT NULL DEFAULT 0,
  \`total_damaged_units\` INT NOT NULL DEFAULT 0,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Posted',
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_receipt_number\` (\`receipt_number\`),
  KEY \`idx_receipt_po\` (\`po_id\`),
  KEY \`idx_receipt_branch\` (\`branch_id\`),
  KEY \`idx_receipt_supplier\` (\`supplier_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_GOODS_RECEIPT_ITEMS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`goods_receipt_items\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`receipt_id\` VARCHAR(64) NOT NULL,
  \`product_id\` VARCHAR(64) NOT NULL,
  \`product\` VARCHAR(255) NOT NULL,
  \`sku\` VARCHAR(128) NULL,
  \`ordered_quantity\` INT NOT NULL DEFAULT 0,
  \`previously_received_quantity\` INT NOT NULL DEFAULT 0,
  \`current_received_quantity\` INT NOT NULL DEFAULT 0,
  \`accepted_quantity\` INT NOT NULL DEFAULT 0,
  \`damaged_quantity\` INT NOT NULL DEFAULT 0,
  \`short_quantity\` INT NOT NULL DEFAULT 0,
  \`excess_quantity\` INT NOT NULL DEFAULT 0,
  \`discrepancy_reason\` TEXT NULL,
  \`unit_cost\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_receipt_item_receipt\` (\`receipt_id\`),
  KEY \`idx_receipt_item_product\` (\`product_id\`),
  CONSTRAINT \`fk_receipt_items_receipt\` FOREIGN KEY (\`receipt_id\`) REFERENCES \`goods_receipts\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_VENDOR_BILLS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`vendor_bills\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`bill_number\` VARCHAR(64) NOT NULL,
  \`po_id\` VARCHAR(64) NULL,
  \`po_number\` VARCHAR(64) NULL,
  \`receipt_id\` VARCHAR(64) NULL,
  \`supplier_id\` VARCHAR(64) NOT NULL,
  \`supplier\` VARCHAR(255) NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`paid_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`outstanding_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`due_date\` DATE NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Open',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#eff6ff] text-[#2563eb]',
  \`match_status\` VARCHAR(64) NOT NULL DEFAULT 'Matched',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_bill_number\` (\`bill_number\`),
  KEY \`idx_bill_po\` (\`po_id\`),
  KEY \`idx_bill_supplier\` (\`supplier_id\`),
  KEY \`idx_bill_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_PURCHASE_RETURNS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`purchase_returns\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`return_number\` VARCHAR(64) NOT NULL,
  \`supplier_id\` VARCHAR(64) NOT NULL,
  \`supplier\` VARCHAR(255) NOT NULL,
  \`po_id\` VARCHAR(64) NULL,
  \`po_number\` VARCHAR(64) NULL,
  \`receipt_id\` VARCHAR(64) NULL,
  \`receipt_number\` VARCHAR(64) NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`total_units\` INT NOT NULL DEFAULT 0,
  \`total_credit_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`reason\` VARCHAR(255) NOT NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Draft',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-gray-100 text-gray-700',
  \`created_by\` VARCHAR(128) NOT NULL DEFAULT 'Store Lead',
  \`approved_by\` VARCHAR(128) NULL,
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_pr_number\` (\`return_number\`),
  KEY \`idx_pr_po\` (\`po_id\`),
  KEY \`idx_pr_receipt\` (\`receipt_id\`),
  KEY \`idx_pr_supplier\` (\`supplier_id\`),
  KEY \`idx_pr_branch\` (\`branch_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_PURCHASE_RETURN_ITEMS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`purchase_return_items\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`return_id\` VARCHAR(64) NOT NULL,
  \`product_id\` VARCHAR(64) NOT NULL,
  \`product\` VARCHAR(255) NOT NULL,
  \`sku\` VARCHAR(128) NULL,
  \`unit_id\` VARCHAR(128) NULL,
  \`serial_number\` VARCHAR(128) NULL,
  \`quantity\` INT NOT NULL DEFAULT 1,
  \`unit_cost\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`subtotal\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`condition\` VARCHAR(64) NOT NULL DEFAULT 'Defective',
  \`is_from_qc_hold\` BOOLEAN NOT NULL DEFAULT FALSE,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_pri_return\` (\`return_id\`),
  KEY \`idx_pri_product\` (\`product_id\`),
  CONSTRAINT \`fk_pri_return\` FOREIGN KEY (\`return_id\`) REFERENCES \`purchase_returns\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_VENDOR_DEBIT_NOTES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`vendor_debit_notes\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`debit_note_number\` VARCHAR(64) NOT NULL,
  \`return_id\` VARCHAR(64) NOT NULL,
  \`return_number\` VARCHAR(64) NOT NULL,
  \`supplier_id\` VARCHAR(64) NOT NULL,
  \`supplier\` VARCHAR(255) NOT NULL,
  \`vendor_bill_id\` VARCHAR(64) NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`applied_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`remaining_credit\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Applied',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#eff6ff] text-[#2563eb]',
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_vdn_number\` (\`debit_note_number\`),
  KEY \`idx_vdn_return\` (\`return_id\`),
  KEY \`idx_vdn_bill\` (\`vendor_bill_id\`),
  KEY \`idx_vdn_supplier\` (\`supplier_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_BRANCHES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`branches\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`code\` VARCHAR(32) NOT NULL,
  \`name\` VARCHAR(128) NOT NULL,
  \`city\` VARCHAR(128) NULL,
  \`address\` TEXT NULL,
  \`phone\` VARCHAR(64) NULL,
  \`email\` VARCHAR(191) NULL,
  \`status\` VARCHAR(32) NOT NULL DEFAULT 'Active',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_branch_code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_ROLES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`roles\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(64) NOT NULL,
  \`description\` TEXT NULL,
  \`is_system\` BOOLEAN NOT NULL DEFAULT FALSE,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_role_name\` (\`name\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_PERMISSIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`permissions\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`code\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(128) NOT NULL,
  \`module\` VARCHAR(64) NOT NULL,
  \`description\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_permission_code\` (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_ROLE_PERMISSIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`role_permissions\` (
  \`role_id\` VARCHAR(64) NOT NULL,
  \`permission_id\` VARCHAR(64) NOT NULL,
  PRIMARY KEY (\`role_id\`, \`permission_id\`),
  KEY \`idx_rp_role\` (\`role_id\`),
  KEY \`idx_rp_perm\` (\`permission_id\`),
  CONSTRAINT \`fk_rp_role\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_rp_perm\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_USERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`username\` VARCHAR(64) NOT NULL,
  \`email\` VARCHAR(191) NOT NULL,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`name\` VARCHAR(128) NOT NULL,
  \`role_id\` VARCHAR(64) NOT NULL,
  \`branch_id\` VARCHAR(64) NULL,
  \`status\` VARCHAR(32) NOT NULL DEFAULT 'Active',
  \`phone\` VARCHAR(64) NULL,
  \`last_login_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_user_username\` (\`username\`),
  UNIQUE KEY \`uniq_user_email\` (\`email\`),
  KEY \`idx_users_role\` (\`role_id\`),
  KEY \`idx_users_branch\` (\`branch_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_EXPENSE_CATEGORIES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`expense_categories\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`code\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(128) NOT NULL,
  \`description\` VARCHAR(255) NULL,
  \`gl_account_code\` VARCHAR(64) NOT NULL DEFAULT '5000',
  \`status\` VARCHAR(32) NOT NULL DEFAULT 'Active',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_exp_cat_code\` (\`code\`),
  UNIQUE KEY \`uniq_exp_cat_name\` (\`name\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_EXPENSES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`expenses\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`expense_number\` VARCHAR(64) NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`category_id\` VARCHAR(64) NULL,
  \`category\` VARCHAR(128) NOT NULL,
  \`vendor_id\` VARCHAR(64) NULL,
  \`vendor\` VARCHAR(255) NOT NULL,
  \`amount\` VARCHAR(64) NOT NULL,
  \`raw_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`date\` VARCHAR(64) NOT NULL,
  \`full_date\` DATE NOT NULL,
  \`approval\` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
  \`approval_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#fef3c7] text-[#92400e]',
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Pending Approval',
  \`payment\` ENUM('Unpaid', 'Paid', 'Partial') NOT NULL DEFAULT 'Unpaid',
  \`payment_class\` VARCHAR(128) NOT NULL DEFAULT 'text-gray-900 font-medium',
  \`branch_limit\` VARCHAR(64) NOT NULL DEFAULT 'PKR 15,000',
  \`decision\` VARCHAR(255) NULL,
  \`payment_method\` VARCHAR(64) NOT NULL DEFAULT 'Bank Transfer',
  \`transaction_id\` VARCHAR(128) NULL,
  \`description\` TEXT NULL,
  \`receipt_file\` VARCHAR(255) NULL,
  \`receipt_type\` VARCHAR(64) NOT NULL DEFAULT 'PDF Document',
  \`submitted_by\` VARCHAR(128) NULL,
  \`approved_by\` VARCHAR(128) NULL,
  \`approved_date\` DATE NULL,
  \`rejected_by\` VARCHAR(128) NULL,
  \`rejection_reason\` TEXT NULL,
  \`notes\` TEXT NULL,
  \`last_update\` VARCHAR(64) NULL DEFAULT 'Today 08:20',
  \`gl_posted\` TINYINT(1) NOT NULL DEFAULT 0,
  \`gl_entry_id\` VARCHAR(64) NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_expense_number\` (\`expense_number\`),
  KEY \`idx_expense_branch\` (\`branch_id\`),
  KEY \`idx_expense_approval\` (\`approval\`),
  KEY \`idx_expense_payment\` (\`payment\`),
  KEY \`idx_expense_category\` (\`category\`),
  KEY \`idx_expense_date\` (\`full_date\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_CASH_BANK_ACCOUNTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`cash_bank_accounts\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`code\` VARCHAR(64) NOT NULL,
  \`account_name\` VARCHAR(128) NOT NULL,
  \`account_type\` ENUM('Bank', 'Cash') NOT NULL DEFAULT 'Bank',
  \`bank_name\` VARCHAR(128) NULL,
  \`account_number\` VARCHAR(64) NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-HQ',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'All Branches',
  \`gl_account_code\` VARCHAR(64) NOT NULL DEFAULT '1000',
  \`currency\` VARCHAR(16) NOT NULL DEFAULT 'PKR',
  \`opening_balance\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`current_balance\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`status\` VARCHAR(32) NOT NULL DEFAULT 'Active',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_cba_code\` (\`code\`),
  KEY \`idx_cba_branch\` (\`branch_id\`),
  KEY \`idx_cba_type\` (\`account_type\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_FINANCIAL_TRANSACTIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`financial_transactions\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`transaction_number\` VARCHAR(64) NOT NULL,
  \`account_id\` VARCHAR(64) NOT NULL,
  \`account_name\` VARCHAR(128) NOT NULL DEFAULT 'Bank',
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`date\` VARCHAR(64) NOT NULL DEFAULT 'Aug 27',
  \`full_date\` DATE NOT NULL,
  \`type\` ENUM('Deposit', 'Disbursement', 'Transfer', 'Reconciliation') NOT NULL DEFAULT 'Disbursement',
  \`category\` VARCHAR(64) NOT NULL DEFAULT 'Operational',
  \`reference\` VARCHAR(128) NOT NULL,
  \`reference_type\` VARCHAR(64) NULL,
  \`reference_id\` VARCHAR(64) NULL,
  \`recorded\` VARCHAR(64) NOT NULL,
  \`raw_recorded\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`statement\` VARCHAR(64) NULL DEFAULT '—',
  \`raw_statement\` DECIMAL(15, 2) NULL,
  \`difference\` VARCHAR(64) NOT NULL DEFAULT '0',
  \`raw_difference\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`status\` ENUM('Matched', 'Review', 'Unreconciled') NOT NULL DEFAULT 'Matched',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#eefcf2] text-[#165A31]',
  \`action\` VARCHAR(64) NOT NULL DEFAULT 'Open',
  \`action_class\` VARCHAR(128) NOT NULL DEFAULT 'text-gray-500 hover:text-gray-900',
  \`description\` VARCHAR(255) NULL,
  \`is_reversed\` TINYINT(1) NOT NULL DEFAULT 0,
  \`reversal_reason\` TEXT NULL,
  \`reversed_by\` VARCHAR(128) NULL,
  \`reversed_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_fin_trx_number\` (\`transaction_number\`),
  KEY \`idx_fin_trx_account\` (\`account_id\`),
  KEY \`idx_fin_trx_branch\` (\`branch_id\`),
  KEY \`idx_fin_trx_status\` (\`status\`),
  KEY \`idx_fin_trx_reference\` (\`reference\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_GENERAL_LEDGER_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`general_ledger\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`entry_number\` VARCHAR(64) NOT NULL,
  \`entry_date\` DATE NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`gl_account_code\` VARCHAR(64) NOT NULL,
  \`gl_account_name\` VARCHAR(128) NOT NULL,
  \`debit\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`credit\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`source_module\` VARCHAR(64) NOT NULL DEFAULT 'Finance',
  \`source_type\` VARCHAR(64) NOT NULL,
  \`source_id\` VARCHAR(64) NOT NULL,
  \`description\` VARCHAR(255) NULL,
  \`is_reversed\` TINYINT(1) NOT NULL DEFAULT 0,
  \`reversal_entry_id\` VARCHAR(64) NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_gl_account\` (\`gl_account_code\`),
  KEY \`idx_gl_branch\` (\`branch_id\`),
  KEY \`idx_gl_source\` (\`source_type\`, \`source_id\`),
  KEY \`idx_gl_date\` (\`entry_date\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_SERVICE_CASES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`service_cases\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`case_number\` VARCHAR(64) NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`customer_id\` VARCHAR(64) NOT NULL,
  \`customer_name\` VARCHAR(255) NOT NULL,
  \`customer_phone\` VARCHAR(64) NULL,
  \`customer_email\` VARCHAR(191) NULL,
  \`customer_address\` TEXT NULL,
  \`unit_id\` VARCHAR(64) NULL,
  \`vin\` VARCHAR(128) NULL,
  \`unit_serial\` VARCHAR(128) NULL,
  \`unit_model\` VARCHAR(128) NULL,
  \`motor_number\` VARCHAR(128) NULL,
  \`battery_serial\` VARCHAR(128) NULL,
  \`odometer\` VARCHAR(64) NULL,
  \`warranty_id\` VARCHAR(64) NULL,
  \`warranty_status\` VARCHAR(64) NOT NULL DEFAULT 'Active',
  \`warranty_expiry\` DATE NULL,
  \`category\` VARCHAR(64) NOT NULL DEFAULT 'Electrical',
  \`issue\` TEXT NOT NULL,
  \`priority\` VARCHAR(32) NOT NULL DEFAULT 'Medium',
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Diagnosis',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#fef3c7] text-[#b45309]',
  \`owner\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar Service Team',
  \`assigned_tech\` VARCHAR(128) NULL,
  \`diagnosis_summary\` TEXT NULL,
  \`estimated_completion\` VARCHAR(64) NULL,
  \`total_cost\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`covered_by_warranty\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`customer_payable\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_case_number\` (\`case_number\`),
  KEY \`idx_case_customer\` (\`customer_id\`),
  KEY \`idx_case_unit\` (\`unit_id\`),
  KEY \`idx_case_vin\` (\`vin\`),
  KEY \`idx_case_branch\` (\`branch_id\`),
  KEY \`idx_case_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_REPAIR_JOBS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`repair_jobs\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`job_number\` VARCHAR(64) NOT NULL,
  \`case_id\` VARCHAR(64) NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`customer_id\` VARCHAR(64) NOT NULL,
  \`customer_name\` VARCHAR(255) NOT NULL,
  \`customer_phone\` VARCHAR(64) NULL,
  \`unit_id\` VARCHAR(64) NULL,
  \`unit_serial\` VARCHAR(128) NULL,
  \`unit_model\` VARCHAR(128) NULL,
  \`vin\` VARCHAR(128) NULL,
  \`warranty_id\` VARCHAR(64) NULL,
  \`warranty_status\` VARCHAR(64) NOT NULL DEFAULT 'Pending Verification',
  \`technician\` VARCHAR(128) NULL,
  \`diagnosis\` TEXT NOT NULL,
  \`fault\` TEXT NULL,
  \`decision\` TEXT NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'In Progress',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-blue-50 text-blue-700',
  \`customer_approval_status\` VARCHAR(64) NOT NULL DEFAULT 'Pending',
  \`ready_date\` VARCHAR(64) NULL,
  \`promised_date\` VARCHAR(64) NULL,
  \`parts_cost\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`labour_cost\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`total_cost\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`warranty_coverage\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`customer_payable\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`posted_to_finance\` TINYINT(1) NOT NULL DEFAULT 0,
  \`invoice_id\` VARCHAR(64) NULL,
  \`work_plan\` JSON NULL,
  \`notes\` TEXT NULL,
  \`completed_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_job_number\` (\`job_number\`),
  KEY \`idx_job_case\` (\`case_id\`),
  KEY \`idx_job_customer\` (\`customer_id\`),
  KEY \`idx_job_unit\` (\`unit_id\`),
  KEY \`idx_job_branch\` (\`branch_id\`),
  KEY \`idx_job_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_REPAIR_JOB_ITEMS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`repair_job_items\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`repair_job_id\` VARCHAR(64) NOT NULL,
  \`item_type\` ENUM('part', 'labour') NOT NULL DEFAULT 'part',
  \`product_id\` VARCHAR(64) NULL,
  \`item_name\` VARCHAR(255) NOT NULL,
  \`sku\` VARCHAR(128) NULL,
  \`quantity\` DECIMAL(10, 2) NOT NULL DEFAULT 1.00,
  \`unit_price\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`subtotal\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`is_warranty_covered\` TINYINT(1) NOT NULL DEFAULT 0,
  \`coverage_status\` VARCHAR(64) NOT NULL DEFAULT 'Paid',
  \`source\` VARCHAR(128) NOT NULL DEFAULT 'Service Stock',
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Allocated',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_repair_job_item\` (\`repair_job_id\`),
  KEY \`idx_repair_job_product\` (\`product_id\`),
  CONSTRAINT \`fk_repair_items_job\` FOREIGN KEY (\`repair_job_id\`) REFERENCES \`repair_jobs\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_WARRANTY_CLAIMS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`warranty_claims\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`claim_number\` VARCHAR(64) NOT NULL,
  \`case_id\` VARCHAR(64) NULL,
  \`repair_job_id\` VARCHAR(64) NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`unit_id\` VARCHAR(64) NULL,
  \`vin\` VARCHAR(128) NULL,
  \`customer_id\` VARCHAR(64) NOT NULL,
  \`customer_name\` VARCHAR(255) NOT NULL,
  \`claim_date\` DATE NOT NULL,
  \`claim_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`coverage_policy\` VARCHAR(255) NOT NULL DEFAULT 'Full System 2-Year OEM Warranty',
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Pending',
  \`decision\` VARCHAR(255) NULL,
  \`authorized_by\` VARCHAR(128) NULL,
  \`rejection_reason\` TEXT NULL,
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_claim_number\` (\`claim_number\`),
  KEY \`idx_claim_case\` (\`case_id\`),
  KEY \`idx_claim_repair\` (\`repair_job_id\`),
  KEY \`idx_claim_customer\` (\`customer_id\`),
  KEY \`idx_claim_branch\` (\`branch_id\`),
  KEY \`idx_claim_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_LEADS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`leads\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`lead_number\` VARCHAR(64) NOT NULL,
  \`customer_name\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(64) NOT NULL,
  \`email\` VARCHAR(191) NULL,
  \`city\` VARCHAR(128) NULL,
  \`source\` VARCHAR(64) NOT NULL DEFAULT 'Walk-in',
  \`owner\` VARCHAR(128) NOT NULL DEFAULT 'Hamza',
  \`product_id\` VARCHAR(64) NULL,
  \`product_name\` VARCHAR(255) NULL,
  \`budget\` VARCHAR(64) NULL DEFAULT 'PKR 0',
  \`budget_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`stage\` VARCHAR(64) NOT NULL DEFAULT 'New',
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'New',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#eff6ff] text-[#2563eb]',
  \`customer_id\` VARCHAR(64) NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`next_follow_up\` VARCHAR(64) NULL,
  \`notes\` TEXT NULL,
  \`created_by\` VARCHAR(64) NULL DEFAULT 'System',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uniq_lead_number\` (\`lead_number\`),
  UNIQUE KEY \`uniq_lead_branch_phone\` (\`branch_id\`, \`phone\`),
  KEY \`idx_lead_branch\` (\`branch_id\`),
  KEY \`idx_lead_phone\` (\`phone\`),
  KEY \`idx_lead_customer\` (\`customer_id\`),
  KEY \`idx_lead_stage\` (\`stage\`),
  CONSTRAINT \`fk_leads_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_FOLLOW_UPS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`follow_ups\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`lead_id\` VARCHAR(64) NULL,
  \`customer_id\` VARCHAR(64) NULL,
  \`customer_name\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(64) NULL,
  \`linked_record_type\` VARCHAR(64) NOT NULL DEFAULT 'Lead',
  \`linked_record_id\` VARCHAR(64) NULL,
  \`task_type\` VARCHAR(64) NOT NULL DEFAULT 'Lead follow-up',
  \`channel\` VARCHAR(64) NOT NULL DEFAULT 'Phone Call',
  \`priority\` VARCHAR(64) NOT NULL DEFAULT 'Medium',
  \`priority_color\` VARCHAR(128) NOT NULL DEFAULT 'bg-blue-50 text-blue-700',
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Due Today',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#fef3c7] text-[#b45309]',
  \`due_date\` DATE NULL,
  \`due_time\` VARCHAR(32) NOT NULL DEFAULT '12:00',
  \`owner\` VARCHAR(128) NOT NULL DEFAULT 'Hamza',
  \`notes\` TEXT NULL,
  \`completed_at\` TIMESTAMP NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_followup_branch\` (\`branch_id\`),
  KEY \`idx_followup_lead\` (\`lead_id\`),
  KEY \`idx_followup_customer\` (\`customer_id\`),
  KEY \`idx_followup_status\` (\`status\`),
  KEY \`idx_followup_due\` (\`due_date\`),
  CONSTRAINT \`fk_followup_lead\` FOREIGN KEY (\`lead_id\`) REFERENCES \`leads\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_CUSTOM_ORDERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`custom_orders\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`order_no\` VARCHAR(64) NOT NULL,
  \`customer\` VARCHAR(255) NOT NULL,
  \`customer_id\` VARCHAR(64) NULL,
  \`product\` VARCHAR(255) NOT NULL,
  \`requirement\` TEXT NULL,
  \`budget\` VARCHAR(64) NULL,
  \`total\` VARCHAR(64) NULL,
  \`deposit\` VARCHAR(64) NULL,
  \`payment_method\` VARCHAR(64) NOT NULL DEFAULT 'Bank Transfer',
  \`transaction_id\` VARCHAR(128) NULL,
  \`desired_date\` VARCHAR(64) NULL,
  \`eta\` VARCHAR(64) NULL,
  \`reservation\` VARCHAR(128) NOT NULL DEFAULT 'On arrival',
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Sourcing',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#fef3c7] text-[#b45309]',
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_custom_order_branch\` (\`branch_id\`),
  KEY \`idx_custom_order_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_DELIVERY_HANDOVERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`delivery_handovers\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`delivery_id\` VARCHAR(64) NOT NULL,
  \`order_id\` VARCHAR(64) NOT NULL,
  \`customer\` VARCHAR(255) NOT NULL,
  \`customer_id\` VARCHAR(64) NULL,
  \`unit\` VARCHAR(128) NOT NULL,
  \`unit_id\` VARCHAR(128) NULL,
  \`scheduled\` VARCHAR(64) NULL,
  \`scheduled_time\` VARCHAR(64) NULL,
  \`officer\` VARCHAR(128) NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Ready',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#dcfce7] text-[#165A31]',
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`identity_verified\` TINYINT(1) NOT NULL DEFAULT 0,
  \`payment_complete\` TINYINT(1) NOT NULL DEFAULT 0,
  \`chassis_verified\` TINYINT(1) NOT NULL DEFAULT 0,
  \`accessories_included\` TINYINT(1) NOT NULL DEFAULT 0,
  \`warranty_briefed\` TINYINT(1) NOT NULL DEFAULT 0,
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_delivery_branch\` (\`branch_id\`),
  KEY \`idx_delivery_order\` (\`order_id\`),
  KEY \`idx_delivery_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_SALES_RETURNS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`sales_returns\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`return_no\` VARCHAR(64) NOT NULL,
  \`order_no\` VARCHAR(64) NOT NULL,
  \`customer\` VARCHAR(255) NOT NULL,
  \`customer_id\` VARCHAR(64) NULL,
  \`unit\` VARCHAR(128) NOT NULL,
  \`unit_id\` VARCHAR(128) NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`reason\` VARCHAR(255) NULL,
  \`requested\` VARCHAR(64) NOT NULL DEFAULT 'Exchange',
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Inspection',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-orange-50 text-orange-700',
  \`status_color\` VARCHAR(128) NOT NULL DEFAULT 'bg-orange-50 text-orange-700',
  \`refund_amount\` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  \`notes\` TEXT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_sales_return_branch\` (\`branch_id\`),
  KEY \`idx_sales_return_order\` (\`order_no\`),
  KEY \`idx_sales_return_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_PRICE_RULES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`price_rules\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`rule_name\` VARCHAR(255) NULL,
  \`product\` VARCHAR(255) NOT NULL,
  \`product_id\` VARCHAR(64) NULL,
  \`selling_price\` VARCHAR(64) NOT NULL,
  \`minimum\` VARCHAR(64) NOT NULL,
  \`landed_cost_ref\` VARCHAR(64) NULL,
  \`markup\` VARCHAR(64) NULL,
  \`margin\` VARCHAR(64) NULL,
  \`branch_override\` VARCHAR(128) NOT NULL DEFAULT 'None',
  \`effective\` VARCHAR(64) NULL,
  \`discount_percent\` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  \`start_date\` VARCHAR(64) NULL,
  \`end_date\` VARCHAR(64) NULL,
  \`rule_type\` VARCHAR(64) NOT NULL DEFAULT 'standard',
  \`reason\` TEXT NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Active',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_price_rule_product\` (\`product\`),
  KEY \`idx_price_rule_branch\` (\`branch_override\`),
  KEY \`idx_price_rule_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_PRODUCT_REQUESTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`product_requests\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`product_name\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(128) NOT NULL,
  \`specifications\` TEXT NULL,
  \`reference\` VARCHAR(255) NULL,
  \`customer_demand\` VARCHAR(255) NULL,
  \`quantity\` INT NOT NULL DEFAULT 1,
  \`urgency\` VARCHAR(64) NOT NULL DEFAULT 'Medium',
  \`images\` TEXT NULL,
  \`reason\` TEXT NOT NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Submitted',
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`requested_by\` VARCHAR(128) NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_prod_req_branch\` (\`branch_id\`),
  KEY \`idx_prod_req_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_CYCLE_COUNTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`cycle_counts\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`session\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`scope\` VARCHAR(128) NOT NULL,
  \`category\` VARCHAR(128) NULL,
  \`assigned_to\` VARCHAR(128) NULL,
  \`scheduled_date\` VARCHAR(64) NOT NULL DEFAULT 'Today',
  \`expected\` VARCHAR(64) NOT NULL DEFAULT '0 units',
  \`counted\` VARCHAR(64) NOT NULL DEFAULT '0 units',
  \`variance\` VARCHAR(64) NOT NULL DEFAULT '0',
  \`location\` VARCHAR(128) NULL,
  \`notes\` TEXT NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'In Progress',
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_cycle_count_branch\` (\`branch_id\`),
  KEY \`idx_cycle_count_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_QUARANTINE_RECORDS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`quarantine_records\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`unit\` VARCHAR(128) NOT NULL,
  \`product\` VARCHAR(255) NOT NULL,
  \`defect_type\` VARCHAR(128) NULL,
  \`severity\` VARCHAR(64) NULL,
  \`source\` VARCHAR(128) NULL,
  \`inspector\` VARCHAR(128) NULL,
  \`condition_desc\` TEXT NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Quarantine',
  \`notes\` TEXT NULL,
  \`evidence\` TEXT NULL,
  \`decision\` VARCHAR(128) NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_quarantine_branch\` (\`branch_id\`),
  KEY \`idx_quarantine_unit\` (\`unit\`),
  KEY \`idx_quarantine_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_STOCK_REQUESTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`stock_requests\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`request_no\` VARCHAR(64) NOT NULL,
  \`product\` VARCHAR(255) NOT NULL,
  \`product_id\` VARCHAR(64) NULL,
  \`current_stock\` VARCHAR(64) NULL,
  \`qty\` INT NOT NULL DEFAULT 1,
  \`units\` VARCHAR(64) NULL,
  \`urgency\` VARCHAR(64) NOT NULL DEFAULT 'Medium',
  \`expected_demand\` VARCHAR(255) NULL,
  \`order_link\` VARCHAR(128) NULL,
  \`reason\` TEXT NOT NULL,
  \`notes\` TEXT NULL,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Pending',
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_stock_request_branch\` (\`branch_id\`),
  KEY \`idx_stock_request_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_CONVERSATIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`conversations\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`subtitle\` VARCHAR(255) NULL,
  \`thread\` VARCHAR(255) NULL,
  \`subject\` VARCHAR(255) NULL,
  \`branch_id\` VARCHAR(64) NOT NULL DEFAULT 'BR-01',
  \`branch\` VARCHAR(128) NOT NULL DEFAULT 'Peshawar',
  \`linked\` VARCHAR(128) NOT NULL DEFAULT 'General',
  \`linked_type\` VARCHAR(128) NOT NULL DEFAULT 'Stock Request',
  \`from_user\` VARCHAR(128) NULL,
  \`recipient\` VARCHAR(128) NULL,
  \`last_msg\` TEXT NULL,
  \`priority\` VARCHAR(64) NOT NULL DEFAULT 'Medium',
  \`priority_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-blue-50 text-blue-700',
  \`unread\` INT NOT NULL DEFAULT 0,
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'Open',
  \`status_class\` VARCHAR(128) NOT NULL DEFAULT 'bg-[#dcfce7] text-[#15803d]',
  \`participants\` VARCHAR(255) NULL,
  \`last_reply\` VARCHAR(128) NULL,
  \`owner\` VARCHAR(128) NULL,
  \`replies\` INT NOT NULL DEFAULT 1,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_conv_branch\` (\`branch_id\`),
  KEY \`idx_conv_status\` (\`status\`),
  KEY \`idx_conv_linked\` (\`linked\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_CONVERSATION_MESSAGES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`conversation_messages\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`conversation_id\` VARCHAR(64) NOT NULL,
  \`sender\` VARCHAR(128) NOT NULL,
  \`role\` VARCHAR(128) NULL,
  \`branch\` VARCHAR(128) NULL,
  \`text\` TEXT NOT NULL,
  \`attachment\` VARCHAR(255) NULL,
  \`time\` VARCHAR(64) NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_conv_msg_conv_id\` (\`conversation_id\`),
  CONSTRAINT \`fk_conversation_messages_parent\` FOREIGN KEY (\`conversation_id\`) REFERENCES \`conversations\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export const CREATE_CUSTOM_REPORTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`custom_reports\` (
  \`id\` VARCHAR(64) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`report\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(128) NOT NULL DEFAULT 'Sales Reports',
  \`scope\` VARCHAR(128) NOT NULL DEFAULT 'All Branches',
  \`date_range\` VARCHAR(128) NOT NULL DEFAULT 'This Month',
  \`comparison\` VARCHAR(128) NOT NULL DEFAULT 'Previous Period',
  \`status\` VARCHAR(64) NOT NULL DEFAULT 'All Active',
  \`schedule\` VARCHAR(64) NOT NULL DEFAULT 'Monthly',
  \`format\` VARCHAR(64) NOT NULL DEFAULT 'PDF Summary',
  \`email\` VARCHAR(191) NULL,
  \`metrics\` TEXT NULL,
  \`owner\` VARCHAR(128) NOT NULL DEFAULT 'Super Admin',
  \`last_run\` VARCHAR(64) NOT NULL DEFAULT 'Just now',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_custom_report_category\` (\`category\`),
  KEY \`idx_custom_report_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

export async function runMigrations() {
  const dbStatus = getDbStatus()
  if (!dbStatus.isConnected) {
    console.warn('[Migrations] Database is not connected. Skipping migrations.')
    return false
  }

  try {
    console.log('[Migrations] Checking and running schema migrations for ecodrive...')
    await query(CREATE_CUSTOMERS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "customers" is ready.')

    await query(CREATE_QUOTATIONS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "quotations" is ready.')

    await query(CREATE_QUOTATION_ITEMS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "quotation_items" is ready.')

    await query(CREATE_ORDERS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "orders" is ready.')

    await query(CREATE_ORDER_ITEMS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "order_items" is ready.')

    await query(CREATE_INVOICES_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "invoices" is ready.')

    await query(CREATE_INVOICE_ITEMS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "invoice_items" is ready.')

    await query(CREATE_PAYMENTS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "payments" is ready.')

    await query(CREATE_CATEGORIES_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "categories" is ready.')

    await query(CREATE_PRODUCTS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "products" is ready.')

    await query(CREATE_INVENTORY_STOCK_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "inventory_stock" is ready.')

    await query(CREATE_SERIALIZED_UNITS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "serialized_units" is ready.')

    await query(CREATE_STOCK_MOVEMENTS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "stock_movements" is ready.')

    await query(CREATE_STOCK_ADJUSTMENTS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "stock_adjustments" is ready.')

    await query(CREATE_STOCK_TRANSFERS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "stock_transfers" is ready.')

    await query(CREATE_STOCK_TRANSFER_ITEMS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "stock_transfer_items" is ready.')

    await query(CREATE_SUPPLIERS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "suppliers" is ready.')

    await query(CREATE_PURCHASE_ORDERS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "purchase_orders" is ready.')

    await query(CREATE_PURCHASE_ORDER_ITEMS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "purchase_order_items" is ready.')

    await query(CREATE_GOODS_RECEIPTS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "goods_receipts" is ready.')

    await query(CREATE_GOODS_RECEIPT_ITEMS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "goods_receipt_items" is ready.')

    await query(CREATE_VENDOR_BILLS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "vendor_bills" is ready.')

    await query(CREATE_PURCHASE_RETURNS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "purchase_returns" is ready.')

    await query(CREATE_PURCHASE_RETURN_ITEMS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "purchase_return_items" is ready.')

    await query(CREATE_VENDOR_DEBIT_NOTES_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "vendor_debit_notes" is ready.')

    await query(CREATE_BRANCHES_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "branches" is ready.')

    await query(CREATE_ROLES_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "roles" is ready.')

    await query(CREATE_PERMISSIONS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "permissions" is ready.')

    await query(CREATE_ROLE_PERMISSIONS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "role_permissions" is ready.')

    await query(CREATE_USERS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "users" is ready.')

    await query(CREATE_EXPENSE_CATEGORIES_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "expense_categories" is ready.')

    await query(CREATE_EXPENSES_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "expenses" is ready.')

    await query(CREATE_CASH_BANK_ACCOUNTS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "cash_bank_accounts" is ready.')

    await query(CREATE_FINANCIAL_TRANSACTIONS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "financial_transactions" is ready.')

    await query(CREATE_GENERAL_LEDGER_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "general_ledger" is ready.')

    await query(CREATE_SERVICE_CASES_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "service_cases" is ready.')

    await query(CREATE_REPAIR_JOBS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "repair_jobs" is ready.')

    await query(CREATE_REPAIR_JOB_ITEMS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "repair_job_items" is ready.')

    await query(CREATE_WARRANTY_CLAIMS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "warranty_claims" is ready.')

    await query(CREATE_LEADS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "leads" is ready.')

    await query(CREATE_FOLLOW_UPS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "follow_ups" is ready.')

    await query(CREATE_CUSTOM_ORDERS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "custom_orders" is ready.')

    await query(CREATE_DELIVERY_HANDOVERS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "delivery_handovers" is ready.')

    await query(CREATE_SALES_RETURNS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "sales_returns" is ready.')

    await query(CREATE_PRICE_RULES_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "price_rules" is ready.')

    await query(CREATE_PRODUCT_REQUESTS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "product_requests" is ready.')

    await query(CREATE_CYCLE_COUNTS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "cycle_counts" is ready.')

    await query(CREATE_QUARANTINE_RECORDS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "quarantine_records" is ready.')

    await query(CREATE_STOCK_REQUESTS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "stock_requests" is ready.')

    await query(CREATE_CONVERSATIONS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "conversations" is ready.')

    await query(CREATE_CONVERSATION_MESSAGES_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "conversation_messages" is ready.')

    await query(CREATE_CUSTOM_REPORTS_TABLE_SQL)
    console.log('[Migrations] Schema verification: table "custom_reports" is ready.')

    // Safe baseline categories seeding
    await query(`
      INSERT IGNORE INTO \`categories\` (\`id\`, \`name\`, \`code\`, \`description\`, \`status\`) VALUES
      ('CAT-01', 'Electric Scooters', 'SCOOT', 'Electric Scooters & Mopeds', 'Active'),
      ('CAT-02', 'Electric Bikes', 'BIKE', 'Electric Bicycles & Commuters', 'Active'),
      ('CAT-03', 'Commercial & Cargo', 'CARGO', 'Commercial Cargo & Delivery EVs', 'Active'),
      ('CAT-04', 'Batteries & Chargers', 'BATT', 'Lithium & Graphene Battery Packs', 'Active'),
      ('CAT-05', 'Spare Parts & Accessories', 'PARTS', 'Genuine Spare Parts & Accessories', 'Active')
    `)

    // Safe baseline products seeding
    await query(`
      INSERT IGNORE INTO \`products\` (
        \`id\`, \`name\`, \`model_name\`, \`sku\`, \`category_id\`, \`category\`, \`specs\`,
        \`selling_price\`, \`cost_price\`, \`dealer_price\`, \`warranty\`, \`warranty_months\`,
        \`is_serialized\`, \`reorder_level\`, \`status\`, \`status_class\`
      ) VALUES
      ('PROD-001', 'BRG E-125', 'BRG E-125', 'SKU-E125-RED', 'CAT-01', 'Electric Scooters', '72V 30Ah · 1200W · 85km Range', 280000.00, 210000.00, 250000.00, '2 Years / 20,000 km', 24, 1, 2, 'Active', 'bg-[#dcfce7] text-[#165A31]'),
      ('PROD-002', 'BRG X7', 'BRG X7', 'SKU-X7-BLK', 'CAT-01', 'Electric Scooters', '72V 35Ah · 1500W · 95km Range', 340000.00, 260000.00, 310000.00, '2 Years / 20,000 km', 24, 1, 2, 'Active', 'bg-[#dcfce7] text-[#165A31]'),
      ('PROD-003', 'BRG DS11', 'BRG DS11', 'SKU-DS11-BLU', 'CAT-01', 'Electric Scooters', '60V 26Ah · 1000W · 70km Range', 240000.00, 180000.00, 215000.00, '2 Years / 20,000 km', 24, 1, 3, 'Active', 'bg-[#dcfce7] text-[#165A31]'),
      ('PROD-004', 'BRG E9 Pro', 'BRG E9 Pro', 'SKU-E9P-WHT', 'CAT-01', 'Electric Scooters', '72V 40Ah · 2000W · 110km Range', 390000.00, 300000.00, 355000.00, '3 Years / 30,000 km', 36, 1, 2, 'Active', 'bg-[#dcfce7] text-[#165A31]'),
      ('PROD-005', 'BRG City Pro', 'BRG City Pro', 'SKU-CP-GRY', 'CAT-02', 'Electric Bikes', '60V 24Ah · 800W · 65km Range', 220000.00, 165000.00, 195000.00, '2 Years / 20,000 km', 24, 1, 2, 'Active', 'bg-[#dcfce7] text-[#165A31]'),
      ('PROD-006', 'Cargo Pro EV', 'Cargo Pro EV', 'SKU-CPRO-YEL', 'CAT-03', 'Commercial & Cargo', '72V 60Ah · 2500W · Heavy Load Carrier', 450000.00, 350000.00, 410000.00, '2 Years / 20,000 km', 24, 1, 1, 'Active', 'bg-[#dcfce7] text-[#165A31]'),
      ('PROD-007', 'PowerCell 72V 30Ah', 'PowerCell 72V 30Ah Battery', 'SKU-BAT-7230', 'CAT-04', 'Batteries & Chargers', 'Graphene Lithium LFP Battery Pack', 115000.00, 85000.00, 102000.00, '3 Years Replacement', 36, 0, 10, 'Active', 'bg-[#dcfce7] text-[#165A31]'),
      ('PROD-008', 'Ceramic Disc Brake Pads', 'Ceramic Disc Brake Pads Set', 'SKU-BRK-01', 'CAT-05', 'Spare Parts & Accessories', 'High Heat Resistance Ceramic Composite Pads', 3600.00, 2100.00, 2800.00, '6 Months', 6, 0, 15, 'Active', 'bg-[#dcfce7] text-[#165A31]'),
      ('PROD-009', 'Intelligent EV Controller 72V', 'Intelligent EV Controller 72V 45A', 'SKU-CTRL-72V', 'CAT-05', 'Spare Parts & Accessories', 'Sine Wave Vector BLDC Motor Controller', 18500.00, 12000.00, 15000.00, '1 Year Replacement', 12, 0, 5, 'Active', 'bg-[#dcfce7] text-[#165A31]'),
      ('PROD-010', 'Smart Fast Charger 72V', 'Smart Fast Charger 72V 5A', 'SKU-CHG-72V', 'CAT-04', 'Batteries & Chargers', 'Auto Cutoff Aluminum Alloy Case Charger', 8500.00, 5500.00, 7000.00, '1 Year Replacement', 12, 0, 8, 'Active', 'bg-[#dcfce7] text-[#165A31]')
    `)

    // Safe baseline inventory stock seeding across branches (available = on_hand - reserved)
    await query(`
      INSERT IGNORE INTO \`inventory_stock\` (
        \`product_id\`, \`branch_id\`, \`branch\`, \`on_hand\`, \`reserved\`, \`available\`, \`reorder_level\`
      ) VALUES
      ('PROD-001', 'BR-01', 'Peshawar', 3, 1, 2, 2),
      ('PROD-002', 'BR-01', 'Peshawar', 2, 0, 2, 2),
      ('PROD-003', 'BR-01', 'Peshawar', 3, 1, 2, 3),
      ('PROD-004', 'BR-01', 'Peshawar', 1, 0, 1, 2),
      ('PROD-005', 'BR-01', 'Peshawar', 2, 0, 2, 2),
      ('PROD-006', 'BR-01', 'Peshawar', 1, 0, 1, 1),
      ('PROD-007', 'BR-01', 'Peshawar', 23, 0, 23, 10),
      ('PROD-008', 'BR-01', 'Peshawar', 30, 0, 30, 15),
      ('PROD-009', 'BR-01', 'Peshawar', 10, 0, 10, 5),
      ('PROD-010', 'BR-01', 'Peshawar', 20, 0, 20, 8),
      ('PROD-001', 'BR-02', 'Islamabad', 2, 0, 2, 2),
      ('PROD-002', 'BR-02', 'Islamabad', 1, 0, 1, 2),
      ('PROD-003', 'BR-02', 'Islamabad', 2, 0, 2, 3),
      ('PROD-004', 'BR-02', 'Islamabad', 3, 0, 3, 2),
      ('PROD-007', 'BR-02', 'Islamabad', 8, 0, 8, 5),
      ('PROD-008', 'BR-02', 'Islamabad', 12, 0, 12, 5),
      ('PROD-009', 'BR-02', 'Islamabad', 6, 0, 6, 3),
      ('PROD-010', 'BR-02', 'Islamabad', 8, 0, 8, 4),
      ('PROD-001', 'BR-03', 'Lahore', 2, 0, 2, 2),
      ('PROD-002', 'BR-03', 'Lahore', 1, 0, 1, 2),
      ('PROD-005', 'BR-03', 'Lahore', 2, 0, 2, 2),
      ('PROD-007', 'BR-03', 'Lahore', 8, 0, 8, 5),
      ('PROD-008', 'BR-03', 'Lahore', 8, 0, 8, 5),
      ('PROD-009', 'BR-03', 'Lahore', 4, 0, 4, 2),
      ('PROD-010', 'BR-03', 'Lahore', 7, 0, 7, 3)
    `)

    // Safe baseline serialized units seeding
    await query(`
      INSERT IGNORE INTO \`serialized_units\` (
        \`id\`, \`unit_id\`, \`serial_number\`, \`chassis_number\`, \`vin\`, \`motor_number\`, \`battery_number\`,
        \`product_id\`, \`product_name\`, \`sku\`, \`branch_id\`, \`branch\`, \`location\`,
        \`landed_cost\`, \`selling_price\`, \`status\`, \`status_class\`, \`condition_status\`,
        \`source_po\`, \`receipt_id\`, \`order_id\`, \`customer_id\`, \`warranty_expiry\`
      ) VALUES
      ('UNIT-101', 'DS11-00997', 'DS11-00997', 'CH-89991', 'VIN-PK-BRG-2026-00997', 'MTR-72V-1200-881', 'BAT-7230-04421', 'PROD-003', 'BRG DS11', 'SKU-DS11-BLU', 'BR-01', 'Peshawar', 'Showroom Floor', 145800.00, 240000.00, 'Available', 'bg-[#dcfce7] text-[#165A31]', 'Good', 'PO-2015', 'GR-991', NULL, NULL, '2028-08-20'),
      ('UNIT-102', 'DS11-01001', 'DS11-01001', 'CH-90111', 'VIN-PK-BRG-2026-01001', 'MTR-72V-1200-889', 'BAT-7230-04455', 'PROD-003', 'BRG DS11', 'SKU-DS11-BLU', 'BR-01', 'Peshawar', 'QC Inspection Bay', 163400.00, 240000.00, 'QC Hold', 'bg-amber-50 text-amber-700', 'Inspection Pending', 'PO-2015', 'GR-991', NULL, NULL, '2028-08-20'),
      ('UNIT-103', 'E125-00192', 'E125-00192', 'CH-78811', 'VIN-PK-BRG-2026-00192', 'MTR-72V-1200-441', 'BAT-7230-01123', 'PROD-001', 'BRG E-125', 'SKU-E125-RED', 'BR-03', 'Lahore', 'Showroom Floor', 170000.00, 280000.00, 'Available', 'bg-[#dcfce7] text-[#165A31]', 'Good', 'PO-2010', 'GR-980', NULL, NULL, '2028-08-15'),
      ('UNIT-104', 'X7-CH-00455', 'X7-CH-00455', 'CH-X7-00455', 'VIN-PK-BRG-2026-00455', 'MTR-72V-1500-201', 'BAT-7235-09912', 'PROD-002', 'BRG X7', 'SKU-X7-BLK', 'BR-01', 'Peshawar', 'Customer Allocation Bay', 260000.00, 340000.00, 'Reserved', 'bg-blue-50 text-blue-700', 'Good', 'PO-2012', 'GR-985', 'ORD-2238', 'CUST-102', '2028-08-25')
    `)

    // Safe baseline stock adjustments seeding
    await query(`
      INSERT IGNORE INTO \`stock_adjustments\` (
        \`id\`, \`adjustment_number\`, \`branch_id\`, \`branch\`, \`product_id\`, \`product_name\`,
        \`unit_id\`, \`adjustment_type\`, \`old_quantity\`, \`new_quantity\`, \`difference\`,
        \`reason\`, \`status\`, \`status_class\`, \`requested_by\`, \`approved_by\`, \`notes\`, \`created_at\`
      ) VALUES
      ('ADJ-018', 'ADJ-018', 'BR-01', 'Peshawar', 'PROD-007', 'PowerCell 72V 30Ah', NULL, 'Quantity', 25, 23, -2, 'Physical Count Correction', 'Pending', 'bg-[#fef3c7] text-[#b45309]', 'Ahsan Khan', NULL, 'Variance detected during quarterly physical stock cycle count.', '2026-08-28 10:15:00'),
      ('ADJ-016', 'ADJ-016', 'BR-01', 'Peshawar', 'PROD-003', 'BRG DS11', 'DS11-01001', 'Status', 1, 1, 0, 'QC Reclassification', 'Approved', 'bg-[#dcfce7] text-[#165A31]', 'Ahsan Khan', 'Branch Manager & HQ', 'Shifted to QC zone due to minor transit scratch on body panel.', '2026-08-27 14:00:00'),
      ('ADJ-021', 'ADJ-021', 'BR-02', 'Islamabad', 'PROD-004', 'BRG E9 Pro', NULL, 'Quantity', 14, 15, 1, 'Found Stock', 'Pending', 'bg-[#fef3c7] text-[#b45309]', 'Bilal Shah', NULL, 'One unrecorded unit identified during bay reorganization.', '2026-08-28 16:30:00')
    `)

    // Safe baseline stock transfers seeding
    await query(`
      INSERT IGNORE INTO \`stock_transfers\` (
        \`id\`, \`transfer_number\`, \`from_branch_id\`, \`from_branch\`, \`to_branch_id\`, \`to_branch\`,
        \`total_units\`, \`carrier\`, \`status\`, \`status_class\`, \`requested_by\`, \`approved_by\`,
        \`dispatched_by\`, \`received_by\`, \`notes\`, \`dispatched_at\`, \`received_at\`, \`created_at\`
      ) VALUES
      ('TR-221', 'TR-221', 'BR-02', 'Islamabad', 'BR-01', 'Peshawar', 4, 'Internal logistics / AJ Logistics Truck #4', 'In Transit', 'bg-blue-50 text-blue-700', 'Ahsan Khan', 'Central Logistics Lead', 'Islamabad Depot', NULL, 'Urgent showroom replenishment for customer test rides', '2026-08-27 17:40:00', NULL, '2026-08-27 10:00:00'),
      ('TR-219', 'TR-219', 'BR-01', 'Peshawar', 'BR-03', 'Lahore', 2, 'Pak Logistics Express', 'Received', 'bg-[#dcfce7] text-[#165A31]', 'Ali Raza', 'Central Inventory Lead', 'Peshawar Depot', 'Ali Raza', 'Showroom display unit reallocation', '2026-08-20 11:15:00', '2026-08-22 14:00:00', '2026-08-20 09:00:00'),
      ('TR-224', 'TR-224', 'BR-01', 'Peshawar', 'BR-02', 'Islamabad', 10, 'BRG Dedicated Fleet', 'Approved', 'bg-[#e0e7ff] text-[#3730a3]', 'Bilal Shah', 'Central Logistics Lead', NULL, NULL, 'Replenishment for spare battery stock', NULL, NULL, '2026-08-28 11:00:00')
    `)

    // Seed transfer line items if not present
    const existingTransItems = await query('SELECT COUNT(*) as count FROM `stock_transfer_items` WHERE `transfer_id` IN (?, ?, ?)', ['TR-221', 'TR-219', 'TR-224'])
    if (existingTransItems[0]?.count === 0) {
      await query(`
        INSERT INTO \`stock_transfer_items\` (
          \`transfer_id\`, \`product_id\`, \`product_name\`, \`sku\`, \`quantity\`,
          \`dispatched_qty\`, \`received_qty\`, \`unit_ids\`
        ) VALUES
        ('TR-221', 'PROD-003', 'BRG DS11', 'SKU-DS11-BLU', 4, 4, 0, '["DS11-01004", "DS11-01005", "DS11-01006", "DS11-01007"]'),
        ('TR-219', 'PROD-001', 'BRG E-125', 'SKU-E125-RED', 2, 2, 2, '["E125-00192", "E125-00193"]'),
        ('TR-224', 'PROD-007', 'PowerCell 72V 30Ah', 'SKU-BAT-7230', 10, 0, 0, '[]')
      `)
    }

    // Safe baseline stock movements ledger seeding
    await query(`
      INSERT IGNORE INTO \`stock_movements\` (
        \`movement_number\`, \`reference_type\`, \`reference_id\`, \`product_id\`, \`product_name\`,
        \`unit_id\`, \`branch_id\`, \`branch\`, \`quantity\`, \`on_hand_before\`, \`on_hand_after\`,
        \`user\`, \`reason\`, \`notes\`, \`created_at\`
      ) VALUES
      ('MOV-1001', 'RECEIPT', 'GR-991', 'PROD-003', 'BRG DS11', 'DS11-01001', 'BR-01', 'Peshawar', 1, 0, 1, 'Ahsan Khan', 'Supplier Inward Receipt', 'Inward delivery from vendor PowerCell under PO-2015', '2026-08-20 14:32:00'),
      ('MOV-1002', 'ADJUSTMENT', 'ADJ-104', 'PROD-003', 'BRG DS11', 'DS11-01001', 'BR-01', 'Peshawar', 0, 1, 1, 'Ahsan Khan', 'QC Reclassification', 'Shifted from QC Bay to Showroom Floor', '2026-08-20 15:15:00'),
      ('MOV-1003', 'TRANSFER_DISPATCH', 'TR-219', 'PROD-001', 'BRG E-125', 'E125-00192', 'BR-01', 'Peshawar', -2, 5, 3, 'Bilal Khan', 'Branch Transfer Dispatch', 'Dispatched to Lahore via Pak Logistics Express', '2026-08-20 11:15:00'),
      ('MOV-1004', 'TRANSFER_RECEIVE', 'TR-219', 'PROD-001', 'BRG E-125', 'E125-00192', 'BR-03', 'Lahore', 2, 0, 2, 'Ali Raza', 'Branch Transfer Receipt', 'Received 2 units at Lahore showroom', '2026-08-22 14:00:00'),
      ('MOV-1005', 'TRANSFER_DISPATCH', 'TR-221', 'PROD-003', 'BRG DS11', 'DS11-01004', 'BR-02', 'Islamabad', -4, 6, 2, 'Sami', 'Branch Transfer Dispatch', 'Dispatched to Peshawar showroom', '2026-08-27 17:40:00'),
      ('MOV-1006', 'SALE_RESERVATION', 'ORD-2241', 'PROD-001', 'BRG E-125', 'CH 8-BRG-26-01731', 'BR-01', 'Peshawar', 1, 3, 3, 'Hamza Ali', 'Sales Order Stock Reservation', 'Reserved for Ahsan Khan Order ORD-2241', '2026-08-27 10:00:00'),
      ('MOV-1007', 'SALE_RESERVATION', 'ORD-2238', 'PROD-002', 'BRG X7', 'X7-CH-00455', 'BR-01', 'Peshawar', 1, 2, 2, 'Hamza Ali', 'Sales Order Stock Reservation', 'Reserved for Bilal Shah Order ORD-2238', '2026-08-26 14:30:00')
    `)

    // Safe baseline customer seeding with INSERT IGNORE (preserves all existing data)
    await query(`
      INSERT IGNORE INTO \`customers\` (
        \`id\`, \`code\`, \`name\`, \`first_name\`, \`last_name\`, \`phone\`, \`email\`,
        \`cnic\`, \`address\`, \`city\`, \`branch_id\`, \`branch\`, \`orders\`,
        \`total_purchases\`, \`balance\`, \`status\`, \`status_class\`
      ) VALUES
      ('CUST-101', 'CUS-0812', 'Ahsan Khan', 'Ahsan', 'Khan', '+92 300 555 0188', 'ahsan.khan@example.com', '17301-4491023-1', 'University Road, Phase 3', 'Peshawar', 'BR-01', 'Peshawar', 3, 'PKR 840,000', '0', 'Active', 'bg-[#dcfce7] text-[#165A31]'),
      ('CUST-102', 'CUS-0744', 'Bilal Shah', 'Bilal', 'Shah', '+92 333 118 2011', 'bilal.shah@example.com', '17301-8891024-5', 'Sector F-7/2', 'Islamabad', 'BR-02', 'Islamabad', 2, 'PKR 540,000', '215,000', 'Active', 'bg-[#dcfce7] text-[#165A31]'),
      ('CUST-103', 'CUS-0519', 'Faisal Khan', 'Faisal', 'Khan', '+92 345 9988776', 'faisal.khan@example.com', '17301-7788990-1', 'Saddar Road', 'Peshawar', 'BR-01', 'Peshawar', 1, 'PKR 240,000', '0', 'Active', 'bg-[#dcfce7] text-[#165A31]')
    `)

    await query(`
      INSERT IGNORE INTO \`quotations\` (
        \`id\`, \`quote_number\`, \`customer_id\`, \`customer_name\`, \`branch_id\`, \`branch\`,
        \`product_id\`, \`product\`, \`quantity\`, \`subtotal\`, \`discount\`, \`total\`,
        \`status\`, \`status_class\`, \`validity\`, \`payment_terms\`, \`tax_reg_fees\`,
        \`delivery_lead_time\`, \`sales_order_id\`, \`date\`
      ) VALUES
      ('QT-1882', 'QT-1882', 'CUST-101', 'Ahsan Khan', 'BR-01', 'Peshawar', 'PROD-001', 'BRG E-125', '1 unit', 280000.00, 0.00, 280000.00, 'Accepted', 'bg-[#dcfce7] text-[#165A31]', '05 Sep 2026', '100% Advance / Bank Transfer', 'Included in Quote', 'Within 3 business days', 'ORD-2241', 'Today'),
      ('QT-1879', 'QT-1879', 'CUST-102', 'Bilal Shah', 'BR-01', 'Peshawar', 'PROD-002', 'BRG X7', '1 unit', 340000.00, 10000.00, 330000.00, 'Accepted', 'bg-[#dcfce7] text-[#165A31]', '02 Sep 2026', '100% Advance / Bank Transfer', 'Included in Quote', 'Within 5 business days', 'ORD-2238', 'Yesterday')
    `)

    // Seed line items for baseline quotations if not already present
    const existingItems = await query('SELECT COUNT(*) as count FROM `quotation_items` WHERE `quotation_id` IN (?, ?)', ['QT-1882', 'QT-1879'])
    if (existingItems[0]?.count === 0) {
      await query(`
        INSERT INTO \`quotation_items\` (\`quotation_id\`, \`product_id\`, \`product\`, \`quantity\`, \`selling_price\`, \`subtotal\`, \`warranty\`) VALUES
        ('QT-1882', 'PROD-001', 'BRG E-125', 1, 280000.00, 280000.00, '1-Year Standard Service'),
        ('QT-1879', 'PROD-002', 'BRG X7', 1, 340000.00, 340000.00, '1-Year Standard Service')
      `)
    }

    // Safe baseline order seeding with INSERT IGNORE
    await query(`
      INSERT IGNORE INTO \`orders\` (
        \`id\`, \`order_number\`, \`quotation_id\`, \`customer_id\`, \`customer_name\`, \`branch_id\`, \`branch\`,
        \`product_id\`, \`product\`, \`unit_id\`, \`unit\`, \`subtotal\`, \`discount\`, \`total\`, \`paid\`, \`balance\`,
        \`status\`, \`status_class\`, \`delivery\`, \`salesperson\`, \`created_at\`
      ) VALUES
      ('ORD-2241', 'ORD-2241', 'QT-1882', 'CUST-101', 'Ahsan Khan', 'BR-01', 'Peshawar', 'PROD-001', 'BRG E-125', 'CH 8-BRG-26-01731', 'CH 8-BRG-26-01731', 280000.00, 0.00, 280000.00, 280000.00, 0.00, 'Ready', 'bg-[#dcfce7] text-[#165A31]', 'Ready', 'Hamza Ali', '2026-08-27 10:00:00'),
      ('ORD-2238', 'ORD-2238', 'QT-1879', 'CUST-102', 'Bilal Shah', 'BR-01', 'Peshawar', 'PROD-002', 'BRG X7', 'X7-CH-00455', 'X7-CH-00455', 340000.00, 0.00, 340000.00, 125000.00, 215000.00, 'Processing', 'bg-[#eff6ff] text-[#2563eb]', 'Pending', 'Hamza Ali', '2026-08-26 14:30:00'),
      ('ORD-2235', 'ORD-2235', NULL, 'CUST-103', 'Faisal Khan', 'BR-01', 'Peshawar', 'PROD-003', 'BRG DS11', 'DS11-01001', 'DS11-01001', 240000.00, 0.00, 240000.00, 240000.00, 0.00, 'Delivered', 'bg-gray-100 text-gray-700', 'Delivered', 'Hamza Ali', '2026-08-25 11:15:00'),
      ('ORD-8812', 'ORD-8812', 'QT-5501', 'CUST-101', 'Ahsan Khan', 'BR-01', 'Peshawar', 'PROD-002', 'BRG X7', NULL, 'To be allocated', 356000.00, 20000.00, 336000.00, 0.00, 336000.00, 'Accepted', 'bg-[#dcfce7] text-[#165A31]', 'Processing', 'Hamza Ali', '2026-10-26 18:21:48')
    `)

    // Seed line items for baseline orders if not present
    const existingOrderItems = await query('SELECT COUNT(*) as count FROM `order_items` WHERE `order_id` IN (?, ?, ?)', ['ORD-2241', 'ORD-2238', 'ORD-2235'])
    if (existingOrderItems[0]?.count === 0) {
      await query(`
        INSERT INTO \`order_items\` (\`order_id\`, \`product_id\`, \`product\`, \`quantity\`, \`unit_price\`, \`subtotal\`, \`warranty\`) VALUES
        ('ORD-2241', 'PROD-001', 'BRG E-125', 1, 280000.00, 280000.00, '1-Year Standard Service'),
        ('ORD-2238', 'PROD-002', 'BRG X7', 1, 340000.00, 340000.00, '1-Year Standard Service'),
        ('ORD-2235', 'PROD-003', 'BRG DS11', 1, 240000.00, 240000.00, '1-Year Standard Service')
      `)
    }

    // Safe baseline invoice seeding with INSERT IGNORE
    await query(`
      INSERT IGNORE INTO \`invoices\` (
        \`id\`, \`invoice_number\`, \`order_id\`, \`order_number\`, \`customer_id\`, \`customer_name\`,
        \`branch_id\`, \`branch\`, \`subtotal\`, \`discount\`, \`tax\`, \`total\`, \`paid_amount\`, \`outstanding_amount\`,
        \`status\`, \`status_class\`, \`issued_date\`, \`due_date\`, \`notes\`
      ) VALUES
      ('INV-2241', 'INV-2241', 'ORD-2241', 'ORD-2241', 'CUST-101', 'Ahsan Khan', 'BR-01', 'Peshawar', 280000.00, 0.00, 0.00, 280000.00, 280000.00, 0.00, 'Paid', 'bg-[#dcfce7] text-[#165A31]', '2026-08-27', '2026-09-10', 'Commercial Sales Invoice for Order ORD-2241'),
      ('INV-2238', 'INV-2238', 'ORD-2238', 'ORD-2238', 'CUST-102', 'Bilal Shah', 'BR-01', 'Peshawar', 340000.00, 0.00, 0.00, 340000.00, 125000.00, 215000.00, 'Partial', 'bg-[#fef3c7] text-[#b45309]', '2026-08-26', '2026-09-08', 'Commercial Sales Invoice for Order ORD-2238')
    `)

    // Seed line items for baseline invoices if not present
    const existingInvoiceItems = await query('SELECT COUNT(*) as count FROM `invoice_items` WHERE `invoice_id` IN (?, ?)', ['INV-2241', 'INV-2238'])
    if (existingInvoiceItems[0]?.count === 0) {
      await query(`
        INSERT INTO \`invoice_items\` (\`invoice_id\`, \`product_id\`, \`description\`, \`quantity\`, \`unit_price\`, \`subtotal\`) VALUES
        ('INV-2241', 'PROD-001', 'BRG E-125 (2026 Edition)', 1, 280000.00, 280000.00),
        ('INV-2238', 'PROD-002', 'BRG X7 (Lithium 72V)', 1, 340000.00, 340000.00)
      `)
    }

    // Safe baseline payments seeding with INSERT IGNORE
    await query(`
      INSERT IGNORE INTO \`payments\` (
        \`id\`, \`payment_number\`, \`invoice_id\`, \`order_id\`, \`customer_id\`, \`customer_name\`,
        \`branch_id\`, \`branch\`, \`payment_method\`, \`amount\`, \`transaction_ref\`, \`bank_account\`,
        \`payment_date\`, \`status\`, \`status_class\`, \`notes\`
      ) VALUES
      ('PAY-7791', 'PAY-7791', 'INV-2241', 'ORD-2241', 'CUST-101', 'Ahsan Khan', 'BR-01', 'Peshawar', 'Bank Transfer', 280000.00, 'TXN-2241-BANK-01', 'Meezan Bank', '2026-08-27', 'Reconciled', 'bg-[#dcfce7] text-[#165A31]', 'Full advance settlement for invoice INV-2241'),
      ('PAY-7788', 'PAY-7788', 'INV-2238', 'ORD-2238', 'CUST-102', 'Bilal Shah', 'BR-01', 'Peshawar', 'Cash', 125000.00, 'TXN-2238-CASH-01', 'Showroom Cash Drawer', '2026-08-26', 'Reconciled', 'bg-[#dcfce7] text-[#165A31]', 'Partial initial deposit for invoice INV-2238')
    `)

    // Safe baseline suppliers seeding with INSERT IGNORE
    await query(`
      INSERT IGNORE INTO \`suppliers\` (
        \`id\`, \`code\`, \`name\`, \`contact\`, \`phone\`, \`email\`, \`address\`, \`city\`, \`country\`,
        \`tax_id\`, \`terms\`, \`currency\`, \`status\`, \`status_class\`, \`on_time\`, \`notes\`
      ) VALUES
      ('SUP-01', 'SUP-01', 'BRG Factory', 'Li Wei', '+86 21 8839 0112', 'sales@brgfactory.cn', 'Industrial Zone B-4, Shenzhen', 'Shenzhen', 'China', 'NTN-CN-88991', 'Net 30', 'PKR', 'Active', 'bg-[#dcfce7] text-[#165A31]', '92%', 'Primary OEM assembly and CKD kit manufacturer for Falcon and CityPro lines.'),
      ('SUP-02', 'SUP-02', 'Pak Logistics', 'Usman Shah', '+92 51 4455667', 'contact@paklogistics.pk', 'Sector I-9/3 Industrial Area', 'Islamabad', 'Pakistan', 'NTN-PK-44556', 'Net 15', 'PKR', 'Active', 'bg-[#dcfce7] text-[#165A31]', '88%', 'Inland freight, container transport, and inter-city warehouse haulage partner.'),
      ('SUP-03', 'SUP-03', 'PowerCell Co.', 'Zhang Min', '+86 755 2233 4455', 'orders@powercell.com', 'High-Tech Science Park, Shenzhen', 'Shenzhen', 'China', 'NTN-CN-22334', 'Net 30', 'PKR', 'Active', 'bg-[#dcfce7] text-[#165A31]', '95%', 'OEM LFP and Graphene battery pack supplier with 3-year cell life warranty.'),
      ('SUP-04', 'SUP-04', 'VoltTech Ltd', 'Asad Malik', '+92 42 3778899', 'support@volttech.pk', 'Sundar Industrial Estate', 'Lahore', 'Pakistan', 'NTN-PK-37788', 'Net 30', 'PKR', 'Active', 'bg-[#dcfce7] text-[#165A31]', '90%', 'Local electric motor harness, smart display gauges, and lighting assemblies.')
    `)

    // Safe baseline purchase orders seeding with INSERT IGNORE
    await query(`
      INSERT IGNORE INTO \`purchase_orders\` (
        \`id\`, \`po_number\`, \`supplier_id\`, \`supplier\`, \`branch_id\`, \`branch\`, \`destination\`,
        \`total_ordered\`, \`total_received\`, \`remaining_units\`, \`subtotal\`, \`tax\`, \`amount\`,
        \`order_date\`, \`expected_date\`, \`carrier\`, \`tracking\`, \`status\`, \`status_class\`,
        \`match_status\`, \`requested_by\`, \`approved_by\`, \`notes\`
      ) VALUES
      ('PO-2048', 'PO-2048', 'SUP-01', 'BRG Factory', 'BR-01', 'Peshawar', 'Peshawar', 16, 0, 16, 2650000.00, 150000.00, 2800000.00, '2026-08-11', '2026-08-29', 'Pak Logistics', 'PL-88-2048', 'In Transit', 'bg-blue-50 text-blue-700', 'Matched', 'Ahsan Khan', 'Hamza Ali', 'CKD assembly kits for Peshawar showroom stock replenishment.'),
      ('PO-2049', 'PO-2049', 'SUP-01', 'BRG Factory', 'BR-01', 'Peshawar', 'All Branches', 28, 0, 28, 4800000.00, 0.00, 4800000.00, '2026-09-01', '2026-09-18', 'Pak Logistics', 'PL-99-2049', 'Pending Approval', 'bg-amber-50 text-amber-700', '—', 'Ahsan Khan', NULL, 'Quarterly national inventory stock intake order across all 4 branch hubs.'),
      ('PO-2022', 'PO-2022', 'SUP-01', 'BRG Factory', 'BR-02', 'Islamabad', 'Islamabad', 12, 6, 6, 2196000.00, 4000.00, 2200000.00, '2026-08-05', '2026-08-24', 'Pak Logistics', 'PL-77-2022', 'Partially Received', 'bg-orange-50 text-orange-700', '6/12', 'Bilal Shah', 'Hamza Ali', 'Fast-moving urban commuter units for Islamabad capital territory.'),
      ('PO-2015', 'PO-2015', 'SUP-03', 'PowerCell Co.', 'BR-03', 'Lahore', 'Lahore', 8, 8, 0, 1500000.00, 0.00, 1500000.00, '2026-08-01', '2026-08-20', 'Swift Express', 'SE-33-2015', 'Fully Received', 'bg-[#dcfce7] text-[#165A31]', '8/8', 'Ali Raza', 'Hamza Ali', 'High-capacity 72V replacement battery cells for Lahore service center.'),
      ('PO-2010', 'PO-2010', 'SUP-01', 'BRG Factory', 'BR-01', 'Peshawar', 'Peshawar', 20, 0, 20, 3100000.00, 0.00, 3100000.00, '2026-09-10', '2026-09-25', 'Pak Logistics', 'PL-10-2010', 'Draft', 'bg-gray-100 text-gray-700', '—', 'Ahsan Khan', NULL, 'Draft procurement requisition under review for winter campaign launch.'),
      ('PO-2008', 'PO-2008', 'SUP-02', 'Pak Logistics', 'BR-02', 'Islamabad', 'Islamabad', 10, 0, 10, 400000.00, 0.00, 400000.00, '2026-08-25', '2026-09-05', 'Pak Logistics', 'PL-08-2008', 'Approved', 'bg-[#dcfce7] text-[#165A31]', '—', 'Bilal Shah', 'Hamza Ali', 'Consignment logistics packaging and regional transit buffer stock.')
    `)

    // Seed baseline purchase order items if not present
    const existingPoItems = await query('SELECT COUNT(*) as count FROM `purchase_order_items` WHERE `po_id` IN (?, ?, ?, ?)', ['PO-2048', 'PO-2049', 'PO-2022', 'PO-2015'])
    if (existingPoItems[0]?.count === 0) {
      await query(`
        INSERT INTO \`purchase_order_items\` (
          \`po_id\`, \`product_id\`, \`product\`, \`sku\`, \`ordered_quantity\`, \`received_quantity\`,
          \`unit_cost\`, \`subtotal\`, \`is_serialized\`
        ) VALUES
        ('PO-2048', 'PROD-003', 'BRG DS11', 'SKU-DS11-BLU', 8, 0, 146000.00, 1168000.00, 1),
        ('PO-2048', 'PROD-004', 'BRG E9 Pro', 'SKU-E9P-WHT', 5, 0, 168000.00, 840000.00, 1),
        ('PO-2048', 'PROD-006', 'Cargo Pro EV', 'SKU-CPRO-YEL', 3, 0, 214000.00, 642000.00, 1),
        ('PO-2049', 'PROD-001', 'BRG E-125', 'SKU-E125-RED', 14, 0, 170000.00, 2380000.00, 1),
        ('PO-2049', 'PROD-002', 'BRG X7', 'SKU-X7-BLK', 14, 0, 172000.00, 2420000.00, 1),
        ('PO-2022', 'PROD-003', 'BRG DS11', 'SKU-DS11-BLU', 6, 4, 146000.00, 876000.00, 1),
        ('PO-2022', 'PROD-004', 'BRG E9 Pro', 'SKU-E9P-WHT', 6, 2, 220000.00, 1320000.00, 1),
        ('PO-2015', 'PROD-007', 'PowerCell 72V 30Ah', 'SKU-BAT-7230', 8, 8, 85000.00, 680000.00, 0),
        ('PO-2010', 'PROD-001', 'BRG E-125', 'SKU-E125-RED', 10, 0, 155000.00, 1550000.00, 1),
        ('PO-2010', 'PROD-002', 'BRG X7', 'SKU-X7-BLK', 10, 0, 155000.00, 1550000.00, 1),
        ('PO-2008', 'PROD-005', 'BRG City Pro', 'SKU-CP-GRY', 10, 0, 40000.00, 400000.00, 1)
      `)
    }

    // Safe baseline goods receipts seeding with INSERT IGNORE
    await query(`
      INSERT IGNORE INTO \`goods_receipts\` (
        \`id\`, \`receipt_number\`, \`po_id\`, \`po_number\`, \`supplier_id\`, \`supplier\`,
        \`branch_id\`, \`branch\`, \`delivery_note\`, \`receipt_date\`, \`received_by\`, \`location\`,
        \`total_received_units\`, \`total_accepted_units\`, \`total_damaged_units\`, \`status\`, \`notes\`
      ) VALUES
      ('GR-982', 'GR-982', 'PO-2015', 'PO-2015', 'SUP-03', 'PowerCell Co.', 'BR-03', 'Lahore', 'DN-PWR-881', '2026-08-20', 'Ali Raza', 'Lahore Service Center Bay 2', 8, 8, 0, 'Posted', 'Full consignment of 8 PowerCell batteries tested and received in good order.'),
      ('GR-974', 'GR-974', 'PO-2022', 'PO-2022', 'SUP-01', 'BRG Factory', 'BR-02', 'Islamabad', 'DN-BRG-774', '2026-08-10', 'Bilal Shah', 'Islamabad Depot Bay 1', 6, 5, 1, 'Posted', 'Partial receipt: 5 units accepted into stock, 1 unit with transit cosmetic defect placed on QC hold.'),
      ('GR-991', 'GR-991', 'PO-2015', 'PO-2015', 'SUP-03', 'PowerCell Co.', 'BR-01', 'Peshawar', 'DN-PWR-991', '2026-08-20', 'Ahsan Khan', 'Peshawar Bay 1', 2, 2, 0, 'Posted', 'Battery safety and voltage validation verified.')
    `)

    // Seed baseline goods receipt items if not present
    const existingGrItems = await query('SELECT COUNT(*) as count FROM `goods_receipt_items` WHERE `receipt_id` IN (?, ?)', ['GR-982', 'GR-974'])
    if (existingGrItems[0]?.count === 0) {
      await query(`
        INSERT INTO \`goods_receipt_items\` (
          \`receipt_id\`, \`product_id\`, \`product\`, \`sku\`, \`ordered_quantity\`,
          \`previously_received_quantity\`, \`current_received_quantity\`, \`accepted_quantity\`,
          \`damaged_quantity\`, \`short_quantity\`, \`excess_quantity\`, \`unit_cost\`
        ) VALUES
        ('GR-982', 'PROD-007', 'PowerCell 72V 30Ah', 'SKU-BAT-7230', 8, 0, 8, 8, 0, 0, 0, 85000.00),
        ('GR-974', 'PROD-003', 'BRG DS11', 'SKU-DS11-BLU', 6, 0, 4, 4, 0, 2, 0, 146000.00),
        ('GR-974', 'PROD-004', 'BRG E9 Pro', 'SKU-E9P-WHT', 6, 0, 2, 1, 1, 4, 0, 220000.00)
      `)
    }

    // Safe baseline vendor bills seeding with INSERT IGNORE
    await query(`
      INSERT IGNORE INTO \`vendor_bills\` (
        \`id\`, \`bill_number\`, \`po_id\`, \`po_number\`, \`receipt_id\`, \`supplier_id\`, \`supplier\`,
        \`branch_id\`, \`branch\`, \`amount\`, \`paid_amount\`, \`outstanding_amount\`, \`due_date\`,
        \`status\`, \`status_class\`, \`match_status\`
      ) VALUES
      ('BILL-791', 'BILL-791', 'PO-2048', 'PO-2048', 'GR-991', 'SUP-01', 'BRG Factory', 'BR-01', 'Peshawar', 2650000.00, 0.00, 2650000.00, '2026-09-28', 'Open', 'bg-[#eff6ff] text-[#2563eb]', 'Matched'),
      ('BILL-784', 'BILL-784', 'PO-2022', 'PO-2022', 'GR-974', 'SUP-01', 'BRG Factory', 'BR-02', 'Islamabad', 2200000.00, 0.00, 2200000.00, '2026-09-10', 'Open', 'bg-[#eff6ff] text-[#2563eb]', 'Review'),
      ('BILL-771', 'BILL-771', 'PO-2015', 'PO-2015', 'GR-982', 'SUP-03', 'PowerCell Co.', 'BR-03', 'Lahore', 1500000.00, 1500000.00, 0.00, '2026-08-17', 'Paid', 'bg-[#dcfce7] text-[#165A31]', 'Matched')
    `)

    // Safe baseline branches seeding with INSERT IGNORE
    await query(`
      INSERT IGNORE INTO \`branches\` (\`id\`, \`code\`, \`name\`, \`city\`, \`address\`, \`phone\`, \`email\`, \`status\`) VALUES
      ('BR-01', 'PEW-01', 'Peshawar', 'Peshawar', 'Peshawar Industrial Estate, Ring Road, Peshawar', '+92 91 5812345', 'pew@ajecodrive.com', 'Active'),
      ('BR-02', 'ISB-01', 'Islamabad', 'Islamabad', 'Plot 14, Blue Area, Jinnah Avenue, Islamabad', '+92 51 2812345', 'isb@ajecodrive.com', 'Active'),
      ('BR-03', 'LHE-01', 'Lahore', 'Lahore', 'Main Boulevard, Gulberg III, Lahore', '+92 42 35812345', 'lhe@ajecodrive.com', 'Active'),
      ('BR-04', 'RWP-01', 'Rawalpindi', 'Rawalpindi', 'Peshawar Road, Saddar, Rawalpindi', '+92 51 5123456', 'rwp@ajecodrive.com', 'Active'),
      ('BR-HQ', 'ADMIN', 'Head Office', 'Islamabad', 'Floor 8, EcoTower, Blue Area, Islamabad', '+92 51 2999999', 'admin@ajecodrive.com', 'Active')
    `)

    // Safe baseline roles seeding with INSERT IGNORE
    await query(`
      INSERT IGNORE INTO \`roles\` (\`id\`, \`name\`, \`description\`, \`is_system\`) VALUES
      ('ROLE-ADMIN', 'Super Admin', 'Full unrestricted enterprise-wide administrative access', 1),
      ('ROLE-BM', 'Branch Manager', 'Full management access scoped strictly to assigned branch', 1),
      ('ROLE-SALES', 'Sales Executive', 'Sales and customer operations scoped to branch', 1),
      ('ROLE-TECH', 'Technician', 'Workshop repair and maintenance technician', 1)
    `)

    // Safe baseline permissions seeding with INSERT IGNORE
    await query(`
      INSERT IGNORE INTO \`permissions\` (\`id\`, \`code\`, \`name\`, \`module\`, \`description\`) VALUES
      ('PERM-01', 'customers.read', 'Read Customers', 'customers', 'View customer details and history'),
      ('PERM-02', 'customers.write', 'Write Customers', 'customers', 'Create and modify customer profiles'),
      ('PERM-03', 'quotations.read', 'Read Quotations', 'quotations', 'View quotations and pricing'),
      ('PERM-04', 'quotations.write', 'Write Quotations', 'quotations', 'Create and modify quotations'),
      ('PERM-05', 'orders.read', 'Read Orders', 'orders', 'View sales orders and fulfillment'),
      ('PERM-06', 'orders.write', 'Write Orders', 'orders', 'Create and modify sales orders'),
      ('PERM-07', 'invoices.read', 'Read Invoices', 'invoices', 'View invoices and payment tracking'),
      ('PERM-08', 'invoices.write', 'Write Invoices', 'invoices', 'Issue invoices and record payments'),
      ('PERM-09', 'inventory.read', 'Read Inventory', 'inventory', 'View stock levels and movements'),
      ('PERM-10', 'inventory.write', 'Write Inventory', 'inventory', 'Adjust stock and record transfers'),
      ('PERM-11', 'procurement.read', 'Read Procurement', 'procurement', 'View purchase orders and suppliers'),
      ('PERM-12', 'procurement.write', 'Write Procurement', 'procurement', 'Create POs and receive goods'),
      ('PERM-13', 'admin.all', 'Enterprise Administration', 'system', 'Full enterprise-level administrative rights'),
      ('PERM-14', 'finance.read', 'Read Finance', 'finance', 'View expenses, cash/bank accounts, and financial reports'),
      ('PERM-15', 'finance.write', 'Write Finance', 'finance', 'Submit expenses, record disbursements, and reconcile transactions'),
      ('PERM-16', 'finance.approve', 'Approve Finance', 'finance', 'Approve or reject branch operational expenses'),
      ('PERM-17', 'after_sales.read', 'Read After-Sales', 'after_sales', 'View service cases, repair jobs, and warranty claims'),
      ('PERM-18', 'after_sales.write', 'Write After-Sales', 'after_sales', 'Create and modify service cases, repair jobs, and diagnostic details'),
      ('PERM-19', 'after_sales.warranty_approve', 'Approve Warranty Claims', 'after_sales', 'Approve or reject after-sales warranty claims'),
      ('PERM-20', 'leads.read', 'Read Leads & CRM', 'sales', 'View sales leads, inquiries, and follow-up activities'),
      ('PERM-21', 'leads.write', 'Write Leads & CRM', 'sales', 'Create, update, and manage sales leads and scheduled follow-ups'),
      ('PERM-22', 'leads.convert', 'Convert Leads', 'sales', 'Convert qualified sales leads into registered customer profiles')
    `)

    // Safe baseline role-permissions mapping
    await query(`
      INSERT IGNORE INTO \`role_permissions\` (\`role_id\`, \`permission_id\`) VALUES
      ('ROLE-ADMIN', 'PERM-01'), ('ROLE-ADMIN', 'PERM-02'), ('ROLE-ADMIN', 'PERM-03'), ('ROLE-ADMIN', 'PERM-04'),
      ('ROLE-ADMIN', 'PERM-05'), ('ROLE-ADMIN', 'PERM-06'), ('ROLE-ADMIN', 'PERM-07'), ('ROLE-ADMIN', 'PERM-08'),
      ('ROLE-ADMIN', 'PERM-09'), ('ROLE-ADMIN', 'PERM-10'), ('ROLE-ADMIN', 'PERM-11'), ('ROLE-ADMIN', 'PERM-12'),
      ('ROLE-ADMIN', 'PERM-13'), ('ROLE-ADMIN', 'PERM-14'), ('ROLE-ADMIN', 'PERM-15'), ('ROLE-ADMIN', 'PERM-16'),
      ('ROLE-ADMIN', 'PERM-17'), ('ROLE-ADMIN', 'PERM-18'), ('ROLE-ADMIN', 'PERM-19'),
      ('ROLE-ADMIN', 'PERM-20'), ('ROLE-ADMIN', 'PERM-21'), ('ROLE-ADMIN', 'PERM-22'),
      ('ROLE-BM', 'PERM-01'), ('ROLE-BM', 'PERM-02'), ('ROLE-BM', 'PERM-03'), ('ROLE-BM', 'PERM-04'),
      ('ROLE-BM', 'PERM-05'), ('ROLE-BM', 'PERM-06'), ('ROLE-BM', 'PERM-07'), ('ROLE-BM', 'PERM-08'),
      ('ROLE-BM', 'PERM-09'), ('ROLE-BM', 'PERM-10'), ('ROLE-BM', 'PERM-11'), ('ROLE-BM', 'PERM-12'),
      ('ROLE-BM', 'PERM-14'), ('ROLE-BM', 'PERM-15'),
      ('ROLE-BM', 'PERM-17'), ('ROLE-BM', 'PERM-18'), ('ROLE-BM', 'PERM-19'),
      ('ROLE-BM', 'PERM-20'), ('ROLE-BM', 'PERM-21'), ('ROLE-BM', 'PERM-22'),
      ('ROLE-TECH', 'PERM-17'), ('ROLE-TECH', 'PERM-18')
    `)

    // Safe baseline users seeding with bcrypt password hashing
    // Production Safety: Default demo credentials ('password123') are strictly prohibited in production.
    const isProduction = process.env.NODE_ENV === 'production'
    const adminInitialPassword = isProduction ? (process.env.INITIAL_ADMIN_PASSWORD || null) : 'password123'

    if (!isProduction || adminInitialPassword) {
      const defaultPasswordHash = bcrypt.hashSync(adminInitialPassword || 'password123', 10)
      if (isProduction) {
        // In production, only seed the initial admin with secure credentials
        await query(`
          INSERT IGNORE INTO \`users\` (
            \`id\`, \`username\`, \`email\`, \`password_hash\`, \`name\`, \`role_id\`, \`branch_id\`, \`status\`, \`phone\`
          ) VALUES
          ('USR-ADMIN', 'admin', 'admin@ajecodrive.com', ?, 'Super Admin', 'ROLE-ADMIN', NULL, 'Active', '+92 51 2999999')
        `, [defaultPasswordHash])
      } else {
        // Development / Test demo accounts
        await query(`
          INSERT IGNORE INTO \`users\` (
            \`id\`, \`username\`, \`email\`, \`password_hash\`, \`name\`, \`role_id\`, \`branch_id\`, \`status\`, \`phone\`
          ) VALUES
          ('USR-ADMIN', 'admin', 'admin@ajecodrive.com', ?, 'Super Admin', 'ROLE-ADMIN', NULL, 'Active', '+92 51 2999999'),
          ('USR-PEW', 'pew-01', 'pew@ajecodrive.com', ?, 'Ahsan Khan', 'ROLE-BM', 'BR-01', 'Active', '+92 91 5812345'),
          ('USR-ISB', 'isb-01', 'isb@ajecodrive.com', ?, 'Hassan Ali', 'ROLE-BM', 'BR-02', 'Active', '+92 51 2812345'),
          ('USR-LHE', 'lhe-01', 'lhe@ajecodrive.com', ?, 'Sami Ullah', 'ROLE-BM', 'BR-03', 'Active', '+92 42 35812345'),
          ('USR-RWP', 'rwp-01', 'rwp@ajecodrive.com', ?, 'Usman Tariq', 'ROLE-BM', 'BR-04', 'Active', '+92 51 5123456')
        `, [defaultPasswordHash, defaultPasswordHash, defaultPasswordHash, defaultPasswordHash, defaultPasswordHash])
      }
    }

    // Safe baseline expense categories seeding
    await query(`
      INSERT IGNORE INTO \`expense_categories\` (\`id\`, \`code\`, \`name\`, \`description\`, \`gl_account_code\`, \`status\`) VALUES
      ('CAT-EXP-01', 'UTL', 'Utilities', 'Electricity, water, gas, internet and municipal utility services', '5010', 'Active'),
      ('CAT-EXP-02', 'MAINT', 'Maintenance', 'Showroom maintenance, repair, electrical work and facilities', '5020', 'Active'),
      ('CAT-EXP-03', 'WELFARE', 'Staff Welfare', 'Staff refreshments, tea, lunch, and workplace health and safety', '5030', 'Active'),
      ('CAT-EXP-04', 'LOG', 'Logistics', 'Local delivery, transport charges, courier, and intra-city freight', '5040', 'Active'),
      ('CAT-EXP-05', 'MKT', 'Marketing', 'Showroom branding, banners, promotional materials and signage', '5050', 'Active'),
      ('CAT-EXP-06', 'OFFICE', 'Office Supplies', 'Stationery, printer consumables, documentation, and small tools', '5060', 'Active'),
      ('CAT-EXP-07', 'SEC', 'Security & Municipal', 'Showroom security guard services and municipal regulatory dues', '5070', 'Active'),
      ('CAT-EXP-08', 'CONSUME', 'Consumables', 'Workshop consumables, lubricants, chemical agents and cleaning', '5080', 'Active'),
      ('CAT-EXP-09', 'OTHER', 'Other Operating Expense', 'General petty operational disbursements under showroom policy', '5090', 'Active')
    `)

    // Safe baseline cash and bank accounts seeding
    await query(`
      INSERT IGNORE INTO \`cash_bank_accounts\` (
        \`id\`, \`code\`, \`account_name\`, \`account_type\`, \`bank_name\`, \`account_number\`,
        \`branch_id\`, \`branch\`, \`gl_account_code\`, \`currency\`, \`opening_balance\`, \`current_balance\`, \`status\`
      ) VALUES
      ('ACC-BANK-01', 'MEEZAN-OP', 'Meezan Bank - Main Operations', 'Bank', 'Meezan Bank', '02010108992011', 'BR-HQ', 'Head Office', '1001', 'PKR', 15000000.00, 18600000.00, 'Active'),
      ('ACC-BANK-02', 'ALFALAH-COLL', 'Bank Alfalah - Collections', 'Bank', 'Bank Alfalah', '55019283719001', 'BR-HQ', 'Head Office', '1002', 'PKR', 5000000.00, 6900000.00, 'Active'),
      ('ACC-CASH-PEW', 'CASH-PEW', 'Peshawar Cash on Hand', 'Cash', NULL, NULL, 'BR-01', 'Peshawar', '1010', 'PKR', 500000.00, 1200000.00, 'Active'),
      ('ACC-CASH-ISB', 'CASH-ISB', 'Islamabad Cash on Hand', 'Cash', NULL, NULL, 'BR-02', 'Islamabad', '1020', 'PKR', 400000.00, 400000.00, 'Active'),
      ('ACC-CASH-LHE', 'CASH-LHE', 'Lahore Cash on Hand', 'Cash', NULL, NULL, 'BR-03', 'Lahore', '1030', 'PKR', 300000.00, 300000.00, 'Active'),
      ('ACC-CASH-RWP', 'CASH-RWP', 'Rawalpindi Cash on Hand', 'Cash', NULL, NULL, 'BR-04', 'Rawalpindi', '1040', 'PKR', 250000.00, 250000.00, 'Active')
    `)

    // Safe baseline expenses seeding
    await query(`
      INSERT IGNORE INTO \`expenses\` (
        \`id\`, \`expense_number\`, \`branch_id\`, \`branch\`, \`category_id\`, \`category\`,
        \`vendor_id\`, \`vendor\`,\`amount\`, \`raw_amount\`, \`date\`, \`full_date\`,
        \`approval\`, \`approval_class\`, \`status\`, \`payment\`, \`payment_class\`,
        \`branch_limit\`, \`decision\`, \`payment_method\`, \`description\`, \`receipt_file\`,
        \`receipt_type\`, \`submitted_by\`, \`last_update\`, \`notes\`, \`gl_posted\`
      ) VALUES
      ('EXP-402', 'EXP-402', 'BR-01', 'Peshawar', 'CAT-EXP-01', 'Utilities', 'PESCO', 'PESCO', 'PKR 48,500', 48500.00, '27 Aug', '2026-08-27', 'Pending', 'bg-[#fef3c7] text-[#92400e]', 'Pending Approval', 'Unpaid', 'text-gray-900 font-medium', 'PKR 100K', 'Awaiting management', 'Bank', 'Branch electricity bill', 'pescobill_aug.pdf', 'PDF Document', 'Branch Manager', 'Today 08:20', 'Submit for approval', 0),
      ('EXP-398', 'EXP-398', 'BR-01', 'Peshawar', 'CAT-EXP-04', 'Transport', 'SUP-02', 'Pak Logistics', 'PKR 18,000', 18000.00, '25 Aug', '2026-08-25', 'Approved', 'bg-[#dcfce7] text-[#15803d]', 'Approved', 'Paid', 'text-[#165A31] font-bold', 'PKR 100K', 'Approved by Branch Policy', 'Bank', 'Local showroom delivery transport charges', 'transport_receipt_398.pdf', 'PDF Document', 'Branch Manager', '25 Aug 16:40', 'Standard transport expense', 1),
      ('EXP-8831', 'EXP-8831', 'BR-02', 'Islamabad', 'CAT-EXP-04', 'Logistics', 'SUP-02', 'Pak Logistics', 'PKR 95K', 95000.00, 'Aug 27', '2026-08-27', 'Pending', 'bg-[#fff7ed] text-[#ea580c]', 'Pending Approval', 'Unpaid', 'text-gray-900 font-medium', 'PKR 75K', 'Super Admin approval required', 'Bank', 'Monthly logistics transport charges for inventory transfer.', 'logistics_invoice.pdf', 'Receipt', 'Branch Manager', 'Today 08:20', NULL, 0),
      ('EXP-8821', 'EXP-8821', 'BR-01', 'Peshawar', 'CAT-EXP-02', 'Maintenance', 'City Workshop', 'City Workshop', 'PKR 42K', 42000.00, 'Aug 28', '2026-08-28', 'Approved', 'bg-[#eefcf2] text-[#165A31]', 'Approved', 'Paid', 'text-[#165A31] font-bold', 'PKR 100K', 'Within manager policy', 'Bank', 'Showroom gate repair.', 'repair_receipt_8821.pdf', 'Receipt', 'Branch Manager', 'Today 08:20', NULL, 1)
    `)

    // Safe baseline financial transactions seeding
    await query(`
      INSERT IGNORE INTO \`financial_transactions\` (
        \`id\`, \`transaction_number\`, \`account_id\`, \`account_name\`, \`branch_id\`, \`branch\`,
        \`date\`, \`full_date\`, \`type\`, \`category\`, \`reference\`, \`reference_type\`, \`reference_id\`,
        \`recorded\`, \`raw_recorded\`, \`statement\`, \`raw_statement\`, \`difference\`, \`raw_difference\`,
        \`status\`, \`status_class\`, \`action\`, \`action_class\`, \`description\`
      ) VALUES
      ('TRX-CB-01', 'TRX-CB-01', 'ACC-BANK-01', 'Bank', 'BR-01', 'Peshawar', 'Aug 27', '2026-08-27', 'Deposit', 'Customer Payment', 'PAY-3318', 'payment', 'PAY-3318', '100K', 100000.00, '100K', 100000.00, '0', 0.00, 'Matched', 'bg-[#eefcf2] text-[#165A31]', 'Open', 'text-gray-500 hover:text-gray-900', 'Customer partial sales order settlement'),
      ('TRX-CB-02', 'TRX-CB-02', 'ACC-BANK-01', 'Bank', 'BR-01', 'Peshawar', 'Aug 27', '2026-08-27', 'Disbursement', 'Expense', 'EXP-8821', 'expense', 'EXP-8821', '42K', 42000.00, '42K', 42000.00, '0', 0.00, 'Matched', 'bg-[#eefcf2] text-[#165A31]', 'Open', 'text-gray-500 hover:text-gray-900', 'Showroom gate repair disbursement'),
      ('TRX-CB-03', 'TRX-CB-03', 'ACC-CASH-PEW', 'Cash', 'BR-01', 'Peshawar', 'Aug 27', '2026-08-27', 'Disbursement', 'Petty Cash', 'CASH-1182', 'expense', 'CASH-1182', '28K', 28000.00, '—', NULL, '28K', 28000.00, 'Review', 'bg-[#fff7ed] text-[#ea580c]', 'Match', 'text-[#165A31] font-bold hover:underline', 'Unmatched petty cash workshop consumables payout'),
      ('TRX-CB-04', 'TRX-CB-04', 'ACC-BANK-01', 'Bank', 'BR-01', 'Peshawar', 'Aug 26', '2026-08-26', 'Deposit', 'Customer Payment', 'PAY-3310', 'payment', 'PAY-3310', '250K', 250000.00, '250K', 250000.00, '0', 0.00, 'Matched', 'bg-[#eefcf2] text-[#165A31]', 'Open', 'text-gray-500 hover:text-gray-900', 'Bank wire advance booking payment')
    `)

    // Safe baseline general ledger seeding
    await query(`
      INSERT IGNORE INTO \`general_ledger\` (
        \`id\`, \`entry_number\`, \`entry_date\`, \`branch_id\`, \`branch\`,
        \`gl_account_code\`, \`gl_account_name\`, \`debit\`, \`credit\`,
        \`source_module\`, \`source_type\`, \`source_id\`, \`description\`
      ) VALUES
      ('GL-001', 'GL-2026-0001', '2026-08-25', 'BR-01', 'Peshawar', '5040', 'Operating Expenses - Logistics', 18000.00, 0.00, 'Finance', 'expense', 'EXP-398', 'Local showroom delivery transport charges'),
      ('GL-002', 'GL-2026-0001', '2026-08-25', 'BR-01', 'Peshawar', '1001', 'Cash & Bank - Meezan Bank OP', 0.00, 18000.00, 'Finance', 'expense', 'EXP-398', 'Disbursement for EXP-398'),
      ('GL-003', 'GL-2026-0002', '2026-08-28', 'BR-01', 'Peshawar', '5020', 'Operating Expenses - Maintenance', 42000.00, 0.00, 'Finance', 'expense', 'EXP-8821', 'Showroom gate repair'),
      ('GL-004', 'GL-2026-0002', '2026-08-28', 'BR-01', 'Peshawar', '1001', 'Cash & Bank - Meezan Bank OP', 0.00, 42000.00, 'Finance', 'expense', 'EXP-8821', 'Disbursement for EXP-8821')
    `)

    // Safe baseline service cases seeding
    await query(`
      INSERT IGNORE INTO \`service_cases\` (
        \`id\`, \`case_number\`, \`branch_id\`, \`branch\`, \`customer_id\`, \`customer_name\`,
        \`customer_phone\`, \`customer_email\`, \`customer_address\`, \`unit_id\`, \`vin\`,
        \`unit_serial\`, \`unit_model\`, \`motor_number\`, \`battery_serial\`, \`odometer\`,
        \`warranty_id\`, \`warranty_status\`, \`warranty_expiry\`, \`category\`, \`issue\`,
        \`priority\`, \`status\`, \`status_class\`, \`owner\`, \`assigned_tech\`,
        \`diagnosis_summary\`, \`estimated_completion\`, \`total_cost\`, \`covered_by_warranty\`,
        \`customer_payable\`, \`notes\`
      ) VALUES
      (
        'SC-229', 'SC-229', 'BR-01', 'Peshawar', 'CUST-101', 'Ahsan Khan',
        '+92 312 5538198', 'ahsan.khan@example.com', 'University Town, Peshawar', 'UNIT-101', 'VIN-PK-BRG-2026-00997',
        'CH 8-BRG-26-01731', 'BRG E-125 (2025)', 'MOT-72V-3500W-9912', 'BAT-7230-04421', '1,420 km',
        'WAR-101', 'Active', '2028-09-21', 'Warranty Claim', 'Customer reported battery draining unexpectedly fast below 40% and occasional display flickering when accelerating on inclines.',
        'High', 'Diagnosis', 'bg-[#fef3c7] text-[#b45309]', 'Peshawar Service Team', 'Tariq Mehmood',
        'Diagnosis initiated for battery draining. Technical inspection assigned to Tariq Mehmood.', '2026-08-30',
        13950.00, 13950.00, 0.00, 'Under OEM Warranty 100% coverage.'
      ),
      (
        'SC-227', 'SC-227', 'BR-01', 'Peshawar', 'CUST-102', 'Noman Ali',
        '+92 300 7711223', 'noman.ali@example.com', 'Hayatabad Phase 5, Peshawar', 'UNIT-102', 'VIN-PK-BRG-2026-01001',
        'CH-90111', 'BRG DS11', 'MTR-72V-1200-889', 'BAT-7230-04455', '3,850 km',
        'WAR-102', 'Paid', '2027-08-25', 'Paid Repair', 'Scheduled 3,000 km periodic inspection and brake pads replacement.',
        'Normal', 'In Progress', 'bg-blue-50 text-blue-700', 'Peshawar Service Team', 'Imran Shah',
        'Periodic brake overhaul and diagnostic routine.', '2026-08-29',
        5850.00, 0.00, 5850.00, 'Customer approved standard brake pad overhaul.'
      )
    `)

    // Safe baseline repair jobs seeding
    await query(`
      INSERT IGNORE INTO \`repair_jobs\` (
        \`id\`, \`job_number\`, \`case_id\`, \`branch_id\`, \`branch\`, \`customer_id\`, \`customer_name\`,
        \`customer_phone\`, \`unit_id\`, \`unit_serial\`, \`unit_model\`, \`vin\`,
        \`warranty_id\`, \`warranty_status\`, \`technician\`, \`diagnosis\`, \`fault\`,
        \`decision\`, \`status\`, \`status_class\`, \`customer_approval_status\`,
        \`ready_date\`, \`promised_date\`, \`parts_cost\`, \`labour_cost\`, \`total_cost\`,
        \`warranty_coverage\`, \`customer_payable\`, \`posted_to_finance\`, \`invoice_id\`
      ) VALUES
      (
        'RJ-188', 'RJ-188', 'SC-229', 'BR-01', 'Peshawar', 'CUST-101', 'Ahsan Khan',
        '+92 312 5538198', 'UNIT-101', 'CH 8-BRG-26-01731', 'BRG E-125 (2025)', 'VIN-PK-BRG-2026-00997',
        'WAR-101', 'Active', 'Tariq Mehmood', 'BMS module 3 voltage imbalance and throttle connector degradation', 'Loose pin & uneven discharge',
        'Replace battery terminal harness and re-balance cell stack', 'In Progress', 'bg-blue-50 text-blue-700', 'Approved',
        '30 Aug', '30 Aug', 8700.00, 5250.00, 13950.00, 13950.00, 0.00, 0, NULL
      ),
      (
        'RJ-186', 'RJ-186', 'SC-227', 'BR-01', 'Peshawar', 'CUST-102', 'Noman Ali',
        '+92 300 7711223', 'UNIT-102', 'CH-90111', 'BRG DS11', 'VIN-PK-BRG-2026-01001',
        'WAR-102', 'Paid', 'Imran Shah', 'Brake pads worn to 20% thickness. Discs in good condition.', 'Pad friction wear',
        'Replace front and rear pads with ceramic replacements', 'Completed', 'bg-[#dcfce7] text-[#165A31]', 'Approved',
        'Yesterday', 'Yesterday', 3600.00, 2250.00, 5850.00, 0.00, 5850.00, 0, NULL
      )
    `)

    // Safe baseline repair job items seeding
    const existingRjItems = await query('SELECT COUNT(*) as count FROM `repair_job_items` WHERE `repair_job_id` IN (?, ?)', ['RJ-188', 'RJ-186'])
    if (existingRjItems[0]?.count === 0) {
      await query(`
        INSERT INTO \`repair_job_items\` (
          \`repair_job_id\`, \`item_type\`, \`product_id\`, \`item_name\`, \`sku\`,
          \`quantity\`, \`unit_price\`, \`subtotal\`, \`is_warranty_covered\`, \`coverage_status\`, \`source\`, \`status\`
        ) VALUES
        ('RJ-188', 'part', 'PROD-007', 'Wiring Harness Terminal Kit & Connector', 'SKU-WIR-01', 1.00, 8700.00, 8700.00, 1, 'Warranty', 'Service Stock', 'Allocated'),
        ('RJ-188', 'labour', NULL, 'EV Electrical Diagnostics & Scanning', NULL, 1.50, 3500.00, 5250.00, 1, 'Warranty', 'Service Bay', 'Allocated'),
        ('RJ-186', 'part', 'PROD-005', 'Ceramic Disc Brake Pads Set', 'SKU-BRK-01', 2.00, 1800.00, 3600.00, 0, 'Paid', 'Service Stock', 'Installed'),
        ('RJ-186', 'labour', NULL, 'Periodic Service & Brake Overhaul', NULL, 1.50, 1500.00, 2250.00, 0, 'Paid', 'Service Bay', 'Installed')
      `)
    }

    // Safe baseline warranty claims seeding
    await query(`
      INSERT IGNORE INTO \`warranty_claims\` (
        \`id\`, \`claim_number\`, \`case_id\`, \`repair_job_id\`, \`branch_id\`, \`branch\`,
        \`unit_id\`, \`vin\`, \`customer_id\`, \`customer_name\`, \`claim_date\`, \`claim_amount\`,
        \`coverage_policy\`, \`status\`, \`decision\`, \`authorized_by\`
      ) VALUES
      (
        'CLM-881', 'CLM-881', 'SC-229', 'RJ-188', 'BR-01', 'Peshawar',
        'UNIT-101', 'VIN-PK-BRG-2026-00997', 'CUST-101', 'Ahsan Khan', '2026-08-27', 13950.00,
        'Full System 2-Year OEM Warranty', 'Approved', 'OEM Warranty Battery Diagnostic Coverage', 'Super Admin'
      )
    `)

    // Safe baseline leads seeding
    await query(`
      INSERT IGNORE INTO \`leads\` (
        \`id\`, \`lead_number\`, \`branch_id\`, \`branch\`, \`customer_name\`,
        \`phone\`, \`email\`, \`city\`, \`source\`, \`owner\`,
        \`product_id\`, \`product_name\`, \`budget\`, \`budget_amount\`,
        \`stage\`, \`status\`, \`status_class\`, \`customer_id\`,
        \`next_follow_up\`, \`notes\`, \`created_by\`
      ) VALUES
      (
        'LD-551', 'LD-551', 'BR-01', 'Peshawar', 'Sajid Khan',
        '+92 313 5544332', 'sajid.khan@example.com', 'Peshawar', 'Website', 'Hamza',
        'PROD-002', 'BRG X7', 'PKR 220K', 220000.00,
        'New', 'New', 'bg-[#eff6ff] text-[#2563eb]', NULL,
        'Today', 'Interested in BRG X7 lithium 72V version for personal commute.', 'USR-PEW'
      ),
      (
        'LD-548', 'LD-548', 'BR-01', 'Peshawar', 'Ali Raza',
        '+92 321 9988771', 'ali.raza@example.com', 'Peshawar', 'Walk-in', 'Ahsan Khan',
        'PROD-001', 'BRG E-125', 'PKR 280K', 280000.00,
        'Contacted', 'Contacted', 'bg-[#fef3c7] text-[#b45309]', NULL,
        'Tomorrow', 'Showroom walk-in inquiry for BRG E-125. Follow up scheduled.', 'USR-PEW'
      )
    `)

    // Safe baseline follow-ups seeding
    await query(`
      INSERT IGNORE INTO \`follow_ups\` (
        \`id\`, \`branch_id\`, \`branch\`, \`lead_id\`, \`customer_id\`, \`customer_name\`,
        \`phone\`, \`linked_record_type\`, \`linked_record_id\`, \`task_type\`,
        \`channel\`, \`priority\`, \`priority_color\`, \`status\`, \`status_class\`,
        \`due_date\`, \`due_time\`, \`owner\`, \`notes\`
      ) VALUES
      (
        'FU-101', 'BR-01', 'Peshawar', 'LD-551', NULL, 'Sajid Khan',
        '+92 313 5544332', 'Lead', 'LD-551', 'Lead follow-up',
        'Phone Call', 'High', 'bg-orange-50 text-orange-700', 'Due Today', 'bg-[#fef3c7] text-[#b45309]',
        CURRENT_DATE, '14:00', 'Hamza', 'Discuss financing options and battery warranty for BRG X7.'
      ),
      (
        'FU-102', 'BR-01', 'Peshawar', 'LD-548', NULL, 'Ali Raza',
        '+92 321 9988771', 'Lead', 'LD-548', 'Lead follow-up',
        'Phone Call', 'Medium', 'bg-blue-50 text-blue-700', 'Upcoming', 'bg-blue-50 text-blue-600',
        DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), '11:00', 'Ahsan Khan', 'Schedule showroom test drive.'
      )
    `)

    console.log('[Migrations] All migrations completed successfully.')
    return true
  } catch (err) {
    console.error('[Migrations] Migration failed:', err.message)
    throw err
  }
}

// Direct execution support: node src/db/migrations.js
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('src/db/migrations.js')) {
  (async () => {
    try {
      const connected = await connectDB()
      if (!connected) {
        console.error('[Migrations] Failed to connect to database. Aborting.')
        process.exit(1)
      }
      await runMigrations()
      console.log('[Migrations] Database migration completed.')
      await disconnectDB()
      process.exit(0)
    } catch (err) {
      console.error('[Migrations] Fatal error executing migrations:', err)
      await disconnectDB()
      process.exit(1)
    }
  })()
}


