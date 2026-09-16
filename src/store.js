// Load initial session from storage if available
const savedSession = (() => {
  try {
    const raw = localStorage.getItem('ecodrive_auth_session') || sessionStorage.getItem('ecodrive_auth_session')
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
})()

export const store = reactive({
  // Active User / Branch Session
  currentUser: savedSession || {
    isAuthenticated: false,
    branchCode: '',
    branchName: '',
    role: '',
    name: '',
    email: '',
    isSuperAdmin: false
  },

  // Set authenticated branch session
  setSession(sessionData, remember = true) {
    this.currentUser = {
      ...sessionData,
      isAuthenticated: true
    }
    try {
      const serialized = JSON.stringify(this.currentUser)
      if (remember) {
        localStorage.setItem('ecodrive_auth_session', serialized)
      } else {
        sessionStorage.setItem('ecodrive_auth_session', serialized)
      }
    } catch (e) {
      console.error('Failed to persist session:', e)
    }
  },

  // Logout and clear active branch session
  logout() {
    this.currentUser = {
      isAuthenticated: false,
      branchCode: '',
      branchName: '',
      role: '',
      name: '',
      email: '',
      isSuperAdmin: false
    }
    try {
      localStorage.removeItem('ecodrive_auth_session')
      sessionStorage.removeItem('ecodrive_auth_session')
      localStorage.removeItem('auth_user')
    } catch (e) {
      console.error('Failed to clear session:', e)
    }
  },

  // Check if current user is locked to a specific branch
  isBranchUser() {
    return this.currentUser.isAuthenticated && !this.currentUser.isSuperAdmin
  },

  // Get active branch name for data filtering
  getActiveBranch() {
    if (!this.currentUser.isAuthenticated) return 'All Branches'
    if (this.currentUser.isSuperAdmin) return 'All Branches'
    return this.currentUser.branchName || 'All Branches'
  },

  // Security check: Verify if a record belongs to the current user's branch
  isBranchAllowed(recordBranch) {
    if (!this.currentUser.isAuthenticated || this.currentUser.isSuperAdmin) return true
    if (!recordBranch) return true
    const userBranch = (this.currentUser.branchName || '').toLowerCase()
    const targetBranch = String(recordBranch).toLowerCase()
    return targetBranch.includes(userBranch) || userBranch.includes(targetBranch)
  },

  // Get allowed branch options for dropdowns based on user role
  getBranchOptions(defaultList = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']) {
    if (this.isBranchUser()) {
      return [this.currentUser.branchName]
    }
    return defaultList
  },

  // References to the original items being edited
  originalEditProduct: null,
  originalEditSupplier: null,
  originalEditBranch: null,
  originalEditUser: null,
  originalEditCustomer: null,
  originalEditLead: null,
  originalEditCustomOrder: null,
  originalEditReturn: null,
  originalEditPriceRule: null,
  originalEditQuotation: null,
  originalEditOrder: null,
  originalEditCase: null,
  
  // Expenses Data
  expenses: [
    { 
      id: 'EXP-8831', 
      branch: 'Islamabad', 
      category: 'Logistics', 
      vendor: 'Pak Logistics', 
      amount: 'PKR 95K', 
      rawAmount: '95,000',
      date: 'Aug 27', 
      approval: 'Pending', 
      approvalClass: 'bg-[#fff7ed] text-[#ea580c]', 
      payment: 'Unpaid', 
      paymentClass: 'text-gray-900 font-medium',
      branchLimit: 'PKR 75K',
      decision: 'Super Admin approval required',
      paymentMethod: 'Bank',
      description: 'Monthly logistics transport charges for inventory transfer.',
      receiptFile: 'logistics_invoice.pdf',
      receiptType: 'Receipt'
    },
    { 
      id: 'EXP-8821', 
      branch: 'Peshawar', 
      category: 'Maintenance', 
      vendor: 'City Workshop', 
      amount: 'PKR 42K', 
      rawAmount: '42,000',
      date: 'Aug 28', 
      approval: 'Approved', 
      approvalClass: 'bg-[#eefcf2] text-[#165A31]', 
      payment: 'Paid', 
      paymentClass: 'text-[#165A31] font-bold',
      branchLimit: 'PKR 100K',
      decision: 'Within manager policy',
      paymentMethod: 'Bank',
      description: 'Showroom gate repair.',
      receiptFile: 'repair_receipt_8821.pdf',
      receiptType: 'Receipt'
    }
  ],

  selectedExpense: null,

  selectExpense(expenseItem) {
    this.selectedExpense = expenseItem
  },

  addExpense(newExpense) {
    this.expenses.unshift(newExpense)
    this.selectedExpense = newExpense
  },

  // Communications Data
  conversations: [
    { 
      id: 'SR-1048', 
      title: 'Stock Request · SR-1048', 
      subtitle: 'Peshawar Branch · 5 x BRG DS11', 
      thread: 'Stock request discussion', 
      branch: 'Peshawar', 
      linked: 'SR-1048', 
      linkedType: 'Stock Request',
      from: 'Ahsan Khan', 
      lastMsg: 'Need confirmation before campaign.', 
      priority: 'High', 
      priorityClass: 'bg-[#fff7ed] text-[#ea580c]', 
      unread: 2, 
      status: 'Under Review',
      messages: [
        { sender: 'Ahsan Khan', text: 'Need 5 units before the month-end campaign.', time: '10:14' },
        { sender: 'Super Admin', text: 'Checking Islamabad availability now.', time: '10:28' },
        { sender: 'Ahsan Khan', text: 'Thanks. Campaign launches Aug 31.', time: '10:31' }
      ]
    },
    { 
      id: 'EXP-8831', 
      title: 'Expense · EXP-8831', 
      subtitle: 'Islamabad Branch · Logistics · PKR 95K', 
      thread: 'Expense correction', 
      branch: 'Islamabad', 
      linked: 'EXP-8831', 
      linkedType: 'Expense',
      from: 'Hassan Ali', 
      lastMsg: 'Receipt uploaded.', 
      priority: 'Medium', 
      priorityClass: 'bg-blue-50 text-blue-700', 
      unread: 1, 
      status: 'Pending Approval',
      messages: [
        { sender: 'Hassan Ali', text: 'Attached updated freight invoice.', time: '09:40' },
        { sender: 'Super Admin', text: 'Received. Reviewing against branch allowance.', time: '10:05' }
      ]
    },
    { 
      id: 'WAR-438', 
      title: 'Warranty Case · WAR-438', 
      subtitle: 'Rawalpindi Branch · Controller issue', 
      thread: 'Warranty escalation', 
      branch: 'Rawalpindi', 
      linked: 'WAR-438', 
      linkedType: 'Warranty Case',
      from: 'Usman Tariq', 
      lastMsg: 'Customer requesting update.', 
      priority: 'High', 
      priorityClass: 'bg-[#fff7ed] text-[#ea580c]', 
      unread: 0, 
      status: 'In Progress',
      messages: [
        { sender: 'Usman Tariq', text: 'Customer requesting update on replacement parts timeline.', time: 'Yesterday' }
      ]
    }
  ],

  selectedConversation: null,

  selectConversation(conv) {
    this.selectedConversation = conv
  },

  addMessageToConversation(convId, message) {
    const conv = this.conversations.find(c => c.id === convId || c.linked === convId)
    if (conv) {
      conv.messages.push(message)
      conv.lastMsg = message.text
    }
  },

  // Notifications Data
  notifications: [
    { time: '2 min', category: 'Inventory', notification: 'GR-991 posted with 16 units', branch: 'Peshawar', read: 'No', readClass: 'text-gray-900 font-bold', action: 'Open >', actionClass: 'text-gray-400 hover:text-gray-700' },
    { time: '9 min', category: 'Sales', notification: 'SO-7731 completed', branch: 'Islamabad', read: 'No', readClass: 'text-gray-900 font-bold', action: 'Open >', actionClass: 'text-gray-400 hover:text-gray-700' },
    { time: '22 min', category: 'Finance', notification: 'Payment PAY-3318 posted', branch: 'Peshawar', read: 'Yes', readClass: 'text-gray-500', action: 'Open >', actionClass: 'text-gray-400 hover:text-gray-700' },
    { time: '41 min', category: 'Security', notification: 'New login from Chrome / Windows', branch: 'Peshawar', read: 'Yes', readClass: 'text-gray-500', action: 'Review', actionClass: 'text-[#165A31] font-bold hover:underline' }
  ],
  
  // Method to apply changes from a clone back to the original
  applyEdit(original, updated) {
    if (original && updated) {
      Object.assign(original, updated)
    }
  },

  // After-sales Cases Data
  cases: [
    {
      caseId: 'WAR-442',
      branch: 'Peshawar',
      customer: 'Faisal Khan',
      customerPhone: '+92 300 1234567',
      customerEmail: 'faisal.khan@example.com',
      customerAddress: 'House 42, Street 8, Hayatabad Phase 3, Peshawar',
      unit: 'EV5-00322 - BRG EV-5',
      unitSerial: 'EV5-00322',
      unitModel: 'BRG EV-5 (2025 Long Range Edition)',
      vin: 'BRG-EV5-2025-00322',
      motorNo: 'MOT-72V-3000W-8821',
      batterySerial: 'BAT-72V-50AH-9982-EV',
      odometer: '4,820 km',
      purchaseDate: 'Jan 12, 2025',
      warrantyStart: 'Jan 12, 2025',
      warrantyEnd: 'Jan 12, 2028',
      type: 'Warranty',
      opened: 'Aug 25',
      warranty: 'Active',
      status: 'Diagnosis',
      age: '2d',
      priority: 'High',
      eligibility: 'Active (Under Warranty)',
      batteryCoverage: 'Standard 3-Year Battery Warranty',
      issue: 'Battery range reduced',
      notes: 'Range dropped after recent charge cycles. Vehicle struggles beyond 35 km on single charge compared to normal 85 km range.',
      owner: 'Peshawar Service Team',
      assignedTech: 'Hamza Farooq (Senior EV Specialist)',
      diagnosisSummary: 'Cell group 4 voltage delta exceeds 120mV under 20A discharge load. Recommended replacement of BMS sensor harness and cell balancing cycle.',
      estimatedCompletion: 'Aug 28, 2026',
      totalCost: 'PKR 18,500',
      coveredByWarranty: '100% (PKR 18,500 covered by BRG OEM)',
      customerPayable: 'PKR 0'
    },
    {
      caseId: 'SRV-441',
      branch: 'Lahore',
      customer: 'M. Bilal',
      customerPhone: '+92 321 9876543',
      customerEmail: 'm.bilal@example.com',
      customerAddress: 'Plaza 14, Main Boulevard, Gulberg III, Lahore',
      unit: 'CARGO-00318 - Cargo Pro',
      unitSerial: 'CARGO-00318',
      unitModel: 'BRG Cargo Pro High-Torque',
      vin: 'BRG-CGP-2024-00318',
      motorNo: 'MOT-72V-4000W-1204',
      batterySerial: 'BAT-72V-60AH-1102-CP',
      odometer: '12,450 km',
      purchaseDate: 'Sep 05, 2024',
      warrantyStart: 'Sep 05, 2024',
      warrantyEnd: 'Sep 05, 2025',
      type: 'Service',
      opened: 'Aug 24',
      warranty: 'Paid',
      status: 'In Progress',
      age: '3d',
      priority: 'Medium',
      eligibility: 'Standard Paid Periodic Maintenance',
      batteryCoverage: 'Expired (Routine maintenance fee applies)',
      issue: 'Periodic 10,000 km general service & brake inspection',
      notes: 'Periodic maintenance, front and rear brake pads replacement, suspension lubrication.',
      owner: 'Lahore Service Team',
      assignedTech: 'Sami Ullah (Lead Mechanic)',
      diagnosisSummary: 'Front brake pads worn down to 15%. Rear hydraulic oil requires flushing.',
      estimatedCompletion: 'Aug 26, 2026',
      totalCost: 'PKR 6,800',
      coveredByWarranty: '0%',
      customerPayable: 'PKR 6,800'
    },
    {
      caseId: 'WAR-440',
      branch: 'Islamabad',
      customer: 'Saad Ahmad',
      customerPhone: '+92 333 4567890',
      customerEmail: 'saad.ahmad@example.com',
      customerAddress: 'Sector F-8/2, Street 19, Islamabad',
      unit: 'DS11-00888 - BRG DS11',
      unitSerial: 'DS11-00888',
      unitModel: 'BRG DS11 Urban Cruiser',
      vin: 'BRG-DS1-2025-00888',
      motorNo: 'MOT-60V-2000W-4401',
      batterySerial: 'BAT-60V-35AH-8812-DS',
      odometer: '2,100 km',
      purchaseDate: 'Mar 18, 2025',
      warrantyStart: 'Mar 18, 2025',
      warrantyEnd: 'Mar 18, 2027',
      type: 'Warranty',
      opened: 'Aug 22',
      warranty: 'Active',
      status: 'Parts Waiting',
      age: '4d',
      priority: 'High',
      eligibility: 'Active (Under Warranty)',
      batteryCoverage: 'Full System 2-Year OEM Warranty',
      issue: 'Controller communication error code E-07',
      notes: 'Digital console displays E-07 throttle cutoff intermittently during steep acceleration.',
      owner: 'Islamabad Service Team',
      assignedTech: 'Ali Raza (Electronics Tech)',
      diagnosisSummary: 'Main controller throttle input line showing micro-fracture on PCB connector. Replacement controller ordered from central inventory.',
      estimatedCompletion: 'Aug 29, 2026',
      totalCost: 'PKR 14,200',
      coveredByWarranty: '100% (PKR 14,200 covered)',
      customerPayable: 'PKR 0'
    },
    {
      caseId: 'SRV-439',
      branch: 'Rawalpindi',
      customer: 'Usman Tariq',
      customerPhone: '+92 345 6789012',
      customerEmail: 'usman.tariq@example.com',
      customerAddress: 'Saddar Bazar, Commercial Block, Rawalpindi',
      unit: 'EV5-00192 - BRG EV-5',
      unitSerial: 'EV5-00192',
      unitModel: 'BRG EV-5 Standard',
      vin: 'BRG-EV5-2024-00192',
      motorNo: 'MOT-72V-3000W-3310',
      batterySerial: 'BAT-72V-45AH-5521-EV',
      odometer: '18,900 km',
      purchaseDate: 'Feb 10, 2024',
      warrantyStart: 'Feb 10, 2024',
      warrantyEnd: 'Feb 10, 2025',
      type: 'Service',
      opened: 'Aug 20',
      warranty: 'Expired',
      status: 'Ready',
      age: '6d',
      priority: 'Low',
      eligibility: 'Expired / Customer Paid',
      batteryCoverage: 'Out of Warranty Period',
      issue: 'Tire replacement & wheel rim alignment',
      notes: 'Customer requested tubeless puncture-resistant tire upgrade.',
      owner: 'Rawalpindi Service Team',
      assignedTech: 'Kashif Mehmood',
      diagnosisSummary: 'Installed 2x heavy-duty puncture-resistant tires. Rim balanced.',
      estimatedCompletion: 'Aug 21, 2026',
      totalCost: 'PKR 9,500',
      coveredByWarranty: '0%',
      customerPayable: 'PKR 9,500'
    }
  ],

  // Selected case for Case Detail view
  selectedCase: null,

  // Set selected case
  selectCase(caseItem) {
    this.selectedCase = caseItem
  },

  // Add new case
  addCase(newCase) {
    this.cases.unshift(newCase)
    this.selectedCase = newCase
  },

  // Selected repair job
  selectedRepair: null,

  selectRepair(repairItem) {
    this.selectedRepair = repairItem
  },

  addRepairJob(newJob) {
    this.repairs.unshift(newJob)
    this.selectedRepair = newJob
  },

  // Repair Jobs Data
  repairs: [
    {
      repairId: 'REP-721',
      caseRef: 'WAR-442',
      branch: 'Peshawar',
      customer: 'Faisal Khan',
      customerPhone: '+92 300 1234567',
      unit: 'EV5-00322',
      unitModel: 'BRG EV-5 (2025 Long Range)',
      diagnosis: 'Battery replacement',
      fault: 'Battery capacity below warranty threshold',
      decision: 'Replace battery',
      partsName: 'Battery',
      status: 'Approved',
      readyDate: 'Aug 30',
      technician: 'Usman',
      workPlan: [
        { task: 'Remove battery', technician: 'Usman', status: 'Pending' },
        { task: 'Install replacement', technician: 'Usman', status: 'Pending' },
        { task: 'Road test', technician: 'Usman', status: 'Pending' }
      ],
      partsList: [
        { part: '72V Battery Pack', qty: 1, cost: '68K', source: 'Service Stock', status: 'Reserved' }
      ],
      labourList: [
        { work: 'Battery replacement', hours: 1.5, rate: '2,500/hr', amount: '3,750' },
        { work: 'Road test', hours: 0.5, rate: '500/hr', amount: '250' }
      ],
      costSummary: {
        partsTotal: 'PKR 68,000',
        labourTotal: 'PKR 4,000',
        tax: 'PKR 0',
        total: 'PKR 72,000',
        warrantyCoverage: '100% Covered (OEM Claim)',
        customerPayable: 'PKR 0'
      },
      warrantyCoverage: {
        status: '100% OEM Warranty Claim',
        policy: 'Standard 3-Year Battery Warranty',
        approvalId: 'OEM-CLM-9921',
        payable: 'PKR 0'
      },
      customerApproval: {
        status: 'Approved',
        approvedBy: 'Faisal Khan',
        approvedDate: 'Aug 25, 2026 · 02:40 PM',
        method: 'Digital SMS OTP Verification',
        notes: 'Customer approved full battery replacement schedule under warranty.'
      },
      timeline: [
        { title: 'Parts Reserved from Service Stock', time: 'Aug 25, 2026 · 03:00 PM', actor: 'Store Manager' },
        { title: 'Customer Approved Repair Schedule', time: 'Aug 25, 2026 · 02:40 PM', actor: 'Faisal Khan' },
        { title: 'Technical Diagnosis & Battery Decision', time: 'Aug 25, 2026 · 01:15 PM', actor: 'Usman (Tech Lead)' },
        { title: 'Repair Job REP-721 Created', time: 'Aug 25, 2026 · 11:30 AM', actor: 'Peshawar Workshop' }
      ]
    },
    {
      repairId: 'REP-718',
      caseRef: 'WAR-440',
      branch: 'Islamabad',
      customer: 'Saad Ahmad',
      customerPhone: '+92 333 4567890',
      unit: 'DS11-00888',
      unitModel: 'BRG DS11 Urban Cruiser',
      diagnosis: 'Controller fault',
      fault: 'Main controller throttle input line showing micro-fracture PCB error E-07',
      decision: 'Replace motor controller board',
      partsName: 'Controller',
      status: 'Parts Waiting',
      readyDate: 'Sep 01',
      technician: 'Ali Raza',
      workPlan: [
        { task: 'Remove damaged controller module', technician: 'Ali Raza', status: 'Pending' },
        { task: 'Install OEM 60V Controller', technician: 'Ali Raza', status: 'Pending' },
        { task: 'Recalibrate throttle response curve', technician: 'Ali Raza', status: 'Pending' }
      ],
      partsList: [
        { part: '60V Intelligent BLDC Controller', qty: 1, cost: '12.5K', source: 'Central Warehouse', status: 'In Transit' }
      ],
      labourList: [
        { work: 'Controller replacement & harness rewiring', hours: 1.0, rate: '2,000/hr', amount: '2,000' },
        { work: 'Electronic throttle calibration & bench test', hours: 0.5, rate: '1,000/hr', amount: '500' }
      ],
      costSummary: {
        partsTotal: 'PKR 12,500',
        labourTotal: 'PKR 2,500',
        tax: 'PKR 0',
        total: 'PKR 15,000',
        warrantyCoverage: '100% Covered (OEM Claim)',
        customerPayable: 'PKR 0'
      },
      warrantyCoverage: {
        status: '100% OEM Warranty Claim',
        policy: '2-Year Electrical Component Warranty',
        approvalId: 'OEM-CLM-8834',
        payable: 'PKR 0'
      },
      customerApproval: {
        status: 'Approved',
        approvedBy: 'Saad Ahmad',
        approvedDate: 'Aug 23, 2026',
        method: 'WhatsApp Confirmation',
        notes: 'Awaiting controller delivery from central hub.'
      },
      timeline: [
        { title: 'Parts Dispatch Requested from Central WH', time: 'Aug 23, 2026', actor: 'Ali Raza' },
        { title: 'Repair Job REP-718 Created', time: 'Aug 22, 2026', actor: 'Islamabad Workshop' }
      ]
    }
  ]
})
