# Practical Pakistan EV Showroom System Requirements

## Purpose

This document records the practical improvements recommended for the AJ EcoDrive EV showroom management system.

The system already contains the major modules required for a multi-branch EV-bike dealership. The goal is not to add unnecessary complexity, but to make the existing modules easier for Pakistani showroom staff—especially paper-dependent teams—to use, print, understand, and customize over time.

## Guiding principles

- Keep the system simple and familiar.
- Support existing paper-based showroom processes instead of forcing an immediate digital-only transition.
- Keep advanced fields optional and hide them from ordinary staff.
- Use clear English and simple labels; allow future Urdu-friendly wording where useful.
- Every important record should be searchable, printable, editable with permission, and traceable.
- Do not create a new module when an existing module can support the requirement.

## Existing system coverage

The current system already provides the following major areas:

- Home: Dashboard, Branch Performance, Business Performance, Action Centre
- Organisation: Branches, Users & Access, Roles & Permissions
- Catalogue: Categories, Products, Pricing, Product Requests
- Procurement: Suppliers, Purchase Orders, Receipts, Landed Costs, Vendor Bills, Purchase Returns
- Inventory: Inventory Dashboard, Stock by Product, Serialized Units, Transfers, Stock Requests, Stock Adjustments, Cycle Counts, Stock Movement Ledger, Damaged/Quarantine/Scrap
- Sales & CRM: Sales Dashboard, Quotations, Orders, Invoices, Payments, Customers, Leads & Inquiries, Follow-ups, Custom Orders/Reservations, Returns & Refunds, Delivery/Handover
- After-sales: After-sales Dashboard, Warranty & Service, Repair Jobs
- Finance: Expenses, Finance Overview, Receivables, Payables, Cash/Bank
- Communication: Management Inbox, Notifications
- Analytics: Reports Hub, Sales, Inventory, Procurement, Expense, Profitability, CRM, and Branch Reports
- System: Audit Log, Settings, Account, Security & Sessions, Preferences, Logout

## Common header requirements

The existing shared header should remain simple and consistent across modules.

### Existing controls

- Branch selector
- Date/period selector
- Quick Create
- Alerts counter
- User/profile menu
- Global search where applicable

### Recommended refinements

- Quick Create should focus on common actions:
  - New customer
  - New quotation
  - New order
  - New payment
  - New expense
  - New stock request
  - New service job
- Alerts should open actionable records, not only general notifications.
- Branch and date filters should apply consistently to cards, tables, and reports.
- The profile menu should clearly expose Account, Security, Preferences, and Logout.

## Home

### Dashboard

The Dashboard already provides the correct management view:

- Sales
- Units sold
- Purchases
- Expenses
- Gross profit
- Operating profit
- Inventory value
- Receivables
- Sales performance
- Branch performance
- Inventory overview
- Expense summary
- Action-required items
- Management communication
- Recent activity

Recommended refinements:

- Action-required cards should open the exact filtered record list that generated the alert.
- Display whether figures are month-to-date, year-to-date, or for a selected period.
- Keep the page focused on management decisions rather than adding more charts.

### Branch Performance

The page should continue to show branch sales, inventory, expenses, profitability, and management status.

Useful row actions:

- View branch
- View inventory
- View sales
- View expenses
- View manager tasks

### Business Performance

The company-level view should combine sales, purchases, gross profit, expenses, net operating profit, branch contribution, inventory value, receivables, and payables.

No new module is required.

### Action Centre

The Action Centre should collect operational work such as:

- Low stock
- Pending approvals
- Overdue receivables
- Pending transfers
- Pending purchase orders
- Warranty/service cases
- Expense corrections
- Branch requests

Each item should clearly show:

- What needs attention
- Branch
- Related record
- Responsible person
- Due date
- One clear action button

## Organisation

### Branches

The existing page already covers branch code, city, manager, sales, inventory, expenses, net profit, status, searching, filtering, adding, editing, viewing, and archiving.

Recommended refinements:

- Provide a printable branch summary.
- Make branch code searchable throughout the system.
- Ensure archiving never deletes historical transactions.

### Users & Access

Keep access understandable through simple role templates:

- Super Admin
- Branch Manager
- Sales Staff
- Inventory Staff
- Accounts Staff
- Service Staff

Users should be assignable to one or more branches without requiring technical permission knowledge.

### Roles & Permissions

Permissions should be described in plain language, such as:

- Can view all branches
- Can create orders
- Can approve purchase orders
- Can receive stock
- Can edit payments
- Can view profit reports
- Can archive records

## Catalogue

### Categories

Existing category management is sufficient. It should support bikes, scooters, batteries, chargers, spare parts, accessories, and service items.

### Products

Products should continue to hold model, brand, variant, cost, price, warranty, and stock-tracking information.

Optional EV specifications may include:

- Motor power
- Battery type
- Range
- Charging time
- Colour or variant

These should remain simple product details, not a complex engineering database.

### Pricing

Pricing should retain:

- Standard price
- Branch price
- Effective date
- Discount
- Promotional price
- Approval requirement
- Price history

Price history should show the old price, new price, user, date, and reason.

### Product Requests

Branches should be able to request new models, colours, accessories, spare parts, or catalogue entries.

No new module is required.

## Procurement

### Suppliers

The existing supplier page is appropriate.

Useful practical fields:

- Paper supplier file number
- NTN/tax number where applicable
- Bank/payment details
- Phone or WhatsApp contact
- Supplier documents
- Notes

### Purchase Orders

The existing lifecycle is suitable:

`Draft → Pending Approval → Approved → In Transit → Partially Received → Fully Received`

Add or confirm a printable purchase-order and approval sheet containing the PO, supplier quotation, approval signature, delivery note, and receiving record.

### Receipts

Receiving should remain linked to the purchase order and create or update stock.

Provide a printable receiving sheet containing:

- PO number
- Supplier
- Date
- Quantity
- Chassis/serial numbers
- Damaged or missing items
- Received by
- Signature

### Landed Costs

The existing landed-cost allocation is appropriate:

- By base cost
- By quantity
- Manual

Add a printable landed-cost worksheet for the physical procurement file.

### Vendor Bills

Vendor bills should remain linked to purchase orders, receipts, payables, and payments. Duplicate supplier bills should be easy to identify.

### Purchase Returns

Returns should preserve the original receipt, unit/product, reason, supplier acknowledgement, credit note or adjustment, stock movement, and financial effect.

## Inventory

### Inventory Dashboard

The existing overview of available, reserved, supplier in transit, transfer in transit, QC/quarantine, and inventory value is sufficient.

### Stock by Product

The page should clearly show quantities by model and branch, including available, reserved, damaged, and inspection stock.

### Serialized Units

This is a core strength of the system. Each unit should retain its full history:

`Received → QC → Transfer → Reservation → Sale → Delivery → Service`

The existing serial, chassis, product, branch, location, source PO, landed cost, status, customer, and order information should remain central.

### Transfers

Transfers should show the requesting branch, sending branch, approver, dispatch date, receiving date, units, status, and receiving confirmation.

Provide a printable transfer form.

### Stock Requests

Branches should be able to request stock from head office or another branch. Provide a printable request form and clear approval status.

### Stock Adjustments

Adjustments should require a reason, supporting note, user, and approval when material. Every adjustment should be recorded in the audit log.

### Cycle Counts

Keep cycle counts simple:

- Count sheet
- Expected quantity
- Actual quantity
- Difference
- Reason
- Approval

Provide a printable count sheet for physical counting.

### Stock Movement Ledger

The ledger should show date, unit/product, from location, to location, user, reason, and reference document.

### Damaged / Quarantine / Scrap

Keep the existing section and distinguish between damaged, QC hold, customer return, warranty hold, scrap, and awaiting supplier decision.

Provide notes and a printable inspection form.

## Sales & CRM

### Sales Dashboard

The existing dashboard should summarize leads, quotations, orders, payments, pending deliveries, sales by branch, and sales by model.

### Quotations

Quotations should remain printable and include customer, model, price, discount, validity date, salesperson, and notes.

### Orders

Orders already connect customers, branches, units, amounts, paid amounts, balances, statuses, and delivery.

Recommended small addition:

- Customer/Paper File Number

### Invoices

Invoices should remain printable and connected to the customer, order, payments, vehicle/chassis, warranty reference, and applicable pricing/tax details.

### Payments

Payment methods should include:

- Cash
- Bank transfer
- Cheque
- Financing
- Other

Provide a printable payment receipt and customer balance statement.

### Customers

The existing customer module should include, where relevant:

- Name
- CNIC
- Mobile
- Address
- Paper file number
- Purchase history
- Payment balance
- Service history

### Leads & Inquiries

Useful simple statuses are:

- New
- Contacted
- Interested
- Test ride
- Quotation sent
- Booking
- Won
- Lost

Test rides can remain a field or activity inside the lead; a separate module is not required.

### Follow-ups

Follow-ups should show the customer, assigned salesperson, next follow-up date, purpose, notes, and result.

### Custom Orders / Reservations

Reservations should track the model, advance payment, expected arrival, reserved unit, cancellation, and refund status.

### Returns & Refunds

Returns should link to the original order, customer, unit, reason, refund amount, restocking status, and approval.

### Delivery / Handover

The existing module should include a printable checklist for:

- Bike
- Chassis
- Keys
- Charger
- Warranty card
- Invoice
- Manual
- Registration documents
- Customer signature
- Delivery staff signature

## After-sales

### After-sales Dashboard

The existing view of open warranty, open repairs, overdue service, ready-for-customer cases, branch workload, priority cases, and response time is sufficient.

### Warranty & Service

Each case should include:

- Customer
- Unit/chassis
- Complaint
- Warranty status
- Component
- Decision
- Notes
- Responsible employee
- Customer acknowledgement

This is an enhancement inside the existing module, not a new module.

### Repair Jobs

Provide a printable job card containing:

- Customer
- Unit
- Complaint
- Date received
- Technician
- Parts used
- Estimated cost
- Status
- Delivery date
- Customer signature

## Finance

### Expenses

Expenses should retain category, branch, amount, date, paid by, receipt/reference, approval, and notes.

### Finance Overview

The existing management summary is appropriate.

### Receivables

Receivables should show customer, invoice/order, total, paid, balance, due date, and follow-up status.

### Payables

Payables should connect supplier, vendor bill, purchase order, due date, paid amount, and balance.

### Cash / Bank

Keep this simple and support:

- Cash received
- Cash paid
- Bank received
- Bank paid
- Cheques pending
- Daily closing
- Difference/variance
- Branch

Provide a printable daily cash sheet.

## Communication

### Management Inbox

Use the inbox for internal work such as stock requests, approvals, expense corrections, customer issues, and service escalations.

### Notifications

Group notifications into urgent, approval required, informational, and completed. No separate communication platform is required.

## Analytics

The existing reports are sufficient:

- Sales
- Inventory
- Procurement
- Expenses
- Profitability
- CRM
- Branch

The main practical requirement is reliable filtering and export/printing to PDF or Excel.

## System

### Audit Log

Keep the audit log as the record of who changed or performed important actions.

### Settings

Use Settings for configuration rather than daily operational work.

### Account

Show name, role, branch, email/mobile, and basic account details.

### Security & Sessions

Keep login and session controls understandable to administrators.

### Preferences

Allow simple personal preferences such as language, default branch, default period, and notification settings.

### Logout

Keep Logout clearly accessible from the user menu.

## Final recommended changes only

The system does not need a large expansion. The practical improvement list is:

1. Add or confirm a paper-file number in Customers, Orders, Invoices, and Delivery.
2. Add print/print-to-PDF actions to quotations, invoices, receipts, purchase orders, receiving, transfers, service jobs, delivery, and cash closing.
3. Add a simple delivery checklist inside Delivery/Handover.
4. Add a simple document/status checklist inside the existing sales and delivery flow.
5. Ensure every major record has a clear Notes field.
6. Ensure every important table row has one obvious action: View, Edit, Print, Approve, Receive, Pay, Deliver, or Close.
7. Keep advanced fields optional and hidden from ordinary users.
8. Preserve paper-first workflows while using the system as the searchable and auditable digital record.

## What should not be added now

Do not add these unless the business later requests them:

- Complex battery state-of-health calculations
- Automatic Excise integration
- Full bank API integrations
- Advanced tax automation
- IoT vehicle tracking
- Customer mobile application
- Complicated workshop scheduling
- Automated subsidy verification
- Large technical dashboards
- Mandatory barcode scanning everywhere

## Final direction

The correct direction is not to make the system larger. It is to make the existing system easier for Pakistani showroom staff to use, print, understand, and customize over time.
