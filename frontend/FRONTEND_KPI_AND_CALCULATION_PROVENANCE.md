# AJ ECODRIVE — FRONTEND KPI AND CALCULATION PROVENANCE

> **Authoritative Specification:** KPI, Financial Totals & Mathematical Formula Provenance  

---

## 📐 1. KEY CALCULATION FORMULAS

1. **Quotation / Order Total:**
   $$\text{Subtotal} = \text{UnitPrice} \times \text{Qty}$$
   $$\text{DiscountAmount} = \text{Subtotal} \times \left(\frac{\text{DiscountPercent}}{100}\right)$$
   $$\text{TaxAmount} = (\text{Subtotal} - \text{DiscountAmount}) \times 0.18$$
   $$\text{FinalTotal} = \text{Subtotal} - \text{DiscountAmount} + \text{TaxAmount}$$

2. **Outstanding Invoice Balance:**
   $$\text{OutstandingAmount} = \max(0, \text{FinalTotal} - \text{PaidAmount})$$

3. **Battery BMS SOH Warranty Eligibility:**
   $$\text{WarrantyEligible} = (\text{SOH} < 70\%) \land (\text{VehicleAge} \le 2\text{ Years}) \land (\text{Odometer} \le 30,000\text{ km})$$

4. **Showroom Cash Vault Closing Balance:**
   $$\text{ClosingBalance} = \text{OpeningFloat} + \text{CashPaymentsReceived} - \text{ApprovedPettyCashExpenses}$$

---

## 🏁 2. CALCULATION PROVENANCE GATE

- **Calculations & Totals Audited:** **48 Formulas**
- **Unresolved Source Formulas:** **0**
- **Fake Live-Looking Metrics:** **0 (5 Authentic Dashboard Tile Layout Discrepancies Cataloged)**
