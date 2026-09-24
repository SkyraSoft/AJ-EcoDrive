import { reactive } from 'vue'

// Load initial session from storage if available
const savedSession = (() => {
  try {
    const raw = localStorage.getItem('ecodrive_auth_session') || sessionStorage.getItem('ecodrive_auth_session')
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
})()

// Load initial theme from storage if available
const savedTheme = (() => {
  try {
    return localStorage.getItem('ecodrive_theme') || 'Light'
  } catch (e) {
    return 'Light'
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
        if (typeof localStorage !== 'undefined') localStorage.setItem('ecodrive_auth_session', serialized)
      } else {
        if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('ecodrive_auth_session', serialized)
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
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('ecodrive_auth_session')
        localStorage.removeItem('auth_user')
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('ecodrive_auth_session')
      }
    } catch (e) {
      console.error('Failed to clear session:', e)
    }
  },

  // Helper to check if current user is a Branch Manager / branch-scoped user
  isBranchUser() {
    return !!(this.currentUser && this.currentUser.isAuthenticated && !this.currentUser.isSuperAdmin)
  },

  // Helper to get active branch name
  getActiveBranch() {
    return this.currentUser?.branchName || 'Peshawar'
  },

  // Helper to check if record matches current user's branch
  isBranchAllowed(recordBranch) {
    if (!this.isBranchUser()) return true
    if (!recordBranch) return true
    const userBranch = this.getActiveBranch().toLowerCase()
    return recordBranch.toLowerCase() === userBranch || recordBranch.toLowerCase() === 'all branches' || recordBranch.toLowerCase() === 'all'
  },

  // Dynamic Branch List helper
  getBranchOptions(defaultList = ['All Branches', 'Peshawar', 'Islamabad', 'Lahore', 'Rawalpindi']) {
    if (this.isBranchUser()) {
      return [this.getActiveBranch()]
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
  originalEditHandover: null,
  originalEditPayment: null,
  originalEditRepair: null,

  // ==========================================
  // 0. CANONICAL SYSTEM SETTINGS & CONFIGURATION
  // ==========================================
  settings: {
    company: {
      name: 'AJ EcoDrive Ltd',
      brand: 'BRG Electric Vehicles',
      email: 'info@ajecodrive.com',
      phone: '+92 91 588 4000',
      website: 'https://ecodrive.com.pk',
      address: 'University Road, Phase 3, Peshawar, Khyber Pakhtunkhwa',
      taxNumber: 'NTN-7489201-3',
      registrationNumber: 'SEC-PK-2024-8891'
    },
    finance: {
      currency: 'PKR',
      currencySymbol: 'PKR',
      taxRate: 18,
      defaultPaymentMethod: 'Bank Transfer',
      paymentMethods: [
        { method: 'Cash', active: true, requiresReference: false },
        { method: 'Bank Transfer', active: true, requiresReference: true },
        { method: 'Card / POS', active: true, requiresReference: true }
      ],
      expenseCategories: [
        { category: 'Salaries', active: true, approvalRule: 'Super Admin' },
        { category: 'Rent', active: true, approvalRule: 'Super Admin' },
        { category: 'Utilities', active: true, approvalRule: 'Within branch limit' },
        { category: 'Marketing', active: true, approvalRule: 'Threshold based' }
      ]
    },
    branchDefaults: {
      openingHours: '09:00 AM - 06:00 PM',
      expenseLimit: 'PKR 100,000',
      discountLimit: '10%'
    },
    productMasterData: {
      tracking: 'Serialized where applicable',
      skuFormat: 'BRG-[CAT]-[MODEL]-[YEAR]',
      warrantyDefault: '3-Year Battery & Controller'
    },
    pricingRules: {
      pricingMode: 'Fixed Selling Price · Cost + Markup',
      minMargin: '15%',
      discountThreshold: '8%'
    },
    approvalRules: [
      { workflow: 'Expense', branchLimit: '100K', aboveLimit: 'Required', superAdmin: 'Approve/Reject' },
      { workflow: 'Discount', branchLimit: '5%', aboveLimit: 'Required', superAdmin: 'Approve/Reject' },
      { workflow: 'Stock Adjustment', branchLimit: '0', aboveLimit: 'Always', superAdmin: 'Approve/Reject' },
      { workflow: 'Refund', branchLimit: '0', aboveLimit: 'Always', superAdmin: 'Approve/Reject' }
    ],
    numbering: {
      orderPrefix: 'SO-',
      quotationPrefix: 'QT-',
      poPrefix: 'PO-',
      receiptPrefix: 'GRN-',
      invoicePrefix: 'INV-',
      paymentPrefix: 'PAY-',
      casePrefix: 'SC-',
      repairPrefix: 'RJ-',
      expensePrefix: 'EXP-',
      transferPrefix: 'TR-',
      stockRequestPrefix: 'SR-',
      warrantyPrefix: 'WAR-',
      deliveryPrefix: 'DEL-'
    },
    system: {
      timezone: 'Asia/Karachi',
      dateFormat: 'DD MMM YYYY',
      tableDensity: 'Comfortable',
      theme: savedTheme,
      language: 'English',
      inventoryAlerts: 'Enabled',
      salesAlerts: 'Enabled',
      serviceAlerts: 'Enabled',
      managementMessages: 'Enabled'
    },
    notifications: {
      poApproval: { inApp: true, email: true, actionCentre: true },
      lowStock: { inApp: true, email: false, actionCentre: true },
      paymentPosted: { inApp: true, email: false, actionCentre: false },
      securityLogin: { inApp: true, email: true, actionCentre: false }
    },
    security: {
      mfaPolicy: 'Mandatory for Super Admin · Policy-enforceable for Branch Managers',
      sessionTimeout: '60 minutes',
      passwordPolicy: 'Minimum 8 characters with alphanumeric and special characters'
    }
  },

  // Document Numbering Generator
  generateDocumentId(type) {
    const numbering = this.settings?.numbering || {}
    const prefixMap = {
      order: numbering.orderPrefix || 'SO-',
      quotation: numbering.quotationPrefix || 'QT-',
      invoice: numbering.invoicePrefix || 'INV-',
      po: numbering.poPrefix || 'PO-',
      receipt: numbering.receiptPrefix || 'GRN-',
      payment: numbering.paymentPrefix || 'PAY-',
      case: numbering.casePrefix || 'SC-',
      repair: numbering.repairPrefix || 'RJ-',
      expense: numbering.expensePrefix || 'EXP-',
      transfer: numbering.transferPrefix || 'TR-',
      stock_request: numbering.stockRequestPrefix || 'SR-',
      warranty: numbering.warrantyPrefix || 'WAR-',
      delivery: numbering.deliveryPrefix || 'DEL-'
    }
    const prefix = prefixMap[type] || `${type.toUpperCase()}-`
    return `${prefix}${Math.floor(1000 + Math.random() * 9000)}`
  },

  // Settings Mutation Method
  updateSettings(section, updatedValues) {
    if (!section) return { success: false, error: 'Section is required' }
    if (!this.settings[section]) {
      this.settings[section] = {}
    }

    // Validation
    if (section === 'company' && updatedValues) {
      if (typeof updatedValues.name === 'string' && !updatedValues.name.trim()) {
        throw new Error('Company name cannot be empty')
      }
    }
    if (section === 'finance' && updatedValues) {
      if (typeof updatedValues.taxRate !== 'undefined') {
        const rate = parseFloat(updatedValues.taxRate)
        if (isNaN(rate) || rate < 0) throw new Error('Tax rate must be a non-negative number')
      }
    }

    // Deep / Shallow merge
    if (Array.isArray(updatedValues)) {
      this.settings[section] = [...updatedValues]
    } else {
      this.settings[section] = {
        ...this.settings[section],
        ...updatedValues
      }
    }

    if (section === 'system' && updatedValues && updatedValues.theme) {
      this.applyTheme(updatedValues.theme)
    }

    // Audit log
    if (typeof this.addAuditLog === 'function') {
      this.addAuditLog({
        action: 'Configured',
        event_type: 'SETTINGS_UPDATED',
        entity_type: 'settings',
        entity_id: section,
        module: 'System',
        description: `Settings section [${section}] updated.`,
        metadata: { section, updatedKeys: Array.isArray(updatedValues) ? 'list' : Object.keys(updatedValues) }
      })
    }

    return { success: true, settings: this.settings[section] }
  },

  // Theme Management Methods
  applyTheme(theme) {
    const activeTheme = theme || this.settings?.system?.theme || 'Light'
    let isDark = false
    if (activeTheme === 'Dark') {
      isDark = true
    } else if (activeTheme === 'System') {
      isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDark = false
    }

    if (typeof document !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ecodrive_theme', activeTheme)
      }
    } catch (e) {
      console.error('Failed to persist theme:', e)
    }

    if (this.settings?.system) {
      this.settings.system.theme = activeTheme
    }

    return isDark
  },

  toggleTheme() {
    const current = this.settings?.system?.theme || 'Light'
    const nextTheme = current === 'Dark' ? 'Light' : 'Dark'
    this.applyTheme(nextTheme)
    return nextTheme
  },

  isDarkMode() {
    const current = this.settings?.system?.theme || 'Light'
    if (current === 'Dark') return true
    if (current === 'System') {
      return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  },

  // Settings Reset Method (does NOT touch transactional business data)
  resetSettingsToDefault(section = null) {
    const defaults = {
      company: {
        name: 'AJ EcoDrive Ltd',
        brand: 'BRG Electric Vehicles',
        email: 'info@ajecodrive.com',
        phone: '+92 91 588 4000',
        website: 'https://ecodrive.com.pk',
        address: 'University Road, Phase 3, Peshawar, Khyber Pakhtunkhwa',
        taxNumber: 'NTN-7489201-3',
        registrationNumber: 'SEC-PK-2024-8891'
      },
      finance: {
        currency: 'PKR',
        currencySymbol: 'PKR',
        taxRate: 18,
        defaultPaymentMethod: 'Bank Transfer',
        paymentMethods: [
          { method: 'Cash', active: true, requiresReference: false },
          { method: 'Bank Transfer', active: true, requiresReference: true },
          { method: 'Card / POS', active: true, requiresReference: true }
        ],
        expenseCategories: [
          { category: 'Salaries', active: true, approvalRule: 'Super Admin' },
          { category: 'Rent', active: true, approvalRule: 'Super Admin' },
          { category: 'Utilities', active: true, approvalRule: 'Within branch limit' },
          { category: 'Marketing', active: true, approvalRule: 'Threshold based' }
        ]
      },
      branchDefaults: {
        openingHours: '09:00 AM - 06:00 PM',
        expenseLimit: 'PKR 100,000',
        discountLimit: '10%'
      },
      productMasterData: {
        tracking: 'Serialized where applicable',
        skuFormat: 'BRG-[CAT]-[MODEL]-[YEAR]',
        warrantyDefault: '3-Year Battery & Controller'
      },
      pricingRules: {
        pricingMode: 'Fixed Selling Price · Cost + Markup',
        minMargin: '15%',
        discountThreshold: '8%'
      },
      approvalRules: [
        { workflow: 'Expense', branchLimit: '100K', aboveLimit: 'Required', superAdmin: 'Approve/Reject' },
        { workflow: 'Discount', branchLimit: '5%', aboveLimit: 'Required', superAdmin: 'Approve/Reject' },
        { workflow: 'Stock Adjustment', branchLimit: '0', aboveLimit: 'Always', superAdmin: 'Approve/Reject' },
        { workflow: 'Refund', branchLimit: '0', aboveLimit: 'Always', superAdmin: 'Approve/Reject' }
      ],
      numbering: {
        orderPrefix: 'SO-',
        quotationPrefix: 'QT-',
        poPrefix: 'PO-',
        receiptPrefix: 'GRN-',
        invoicePrefix: 'INV-',
        paymentPrefix: 'PAY-',
        casePrefix: 'SC-',
        repairPrefix: 'RJ-',
        expensePrefix: 'EXP-',
        transferPrefix: 'TR-',
        stockRequestPrefix: 'SR-',
        warrantyPrefix: 'WAR-',
        deliveryPrefix: 'DEL-'
      },
      system: {
        timezone: 'Asia/Karachi',
        dateFormat: 'DD MMM YYYY',
        tableDensity: 'Comfortable',
        theme: 'Light',
        language: 'English',
        inventoryAlerts: 'Enabled',
        salesAlerts: 'Enabled',
        serviceAlerts: 'Enabled',
        managementMessages: 'Enabled'
      },
      notifications: {
        poApproval: { inApp: true, email: true, actionCentre: true },
        lowStock: { inApp: true, email: false, actionCentre: true },
        paymentPosted: { inApp: true, email: false, actionCentre: false },
        securityLogin: { inApp: true, email: true, actionCentre: false }
      },
      security: {
        mfaPolicy: 'Mandatory for Super Admin · Policy-enforceable for Branch Managers',
        sessionTimeout: '60 minutes',
        passwordPolicy: 'Minimum 8 characters with alphanumeric and special characters'
      }
    }

    if (section && defaults[section]) {
      this.settings[section] = JSON.parse(JSON.stringify(defaults[section]))
    } else {
      this.settings = JSON.parse(JSON.stringify(defaults))
    }

    if (typeof this.addAuditLog === 'function') {
      this.addAuditLog({
        action: 'Reset',
        event_type: 'SETTINGS_RESET',
        entity_type: 'settings',
        entity_id: section || 'all',
        module: 'System',
        description: `Settings reset to default for [${section || 'all'}].`,
        metadata: { section: section || 'all' }
      })
    }

    return { success: true }
  },

  // User Profile Update Method
  updateUserProfile(profileData) {
    if (!profileData) return null
    if (!profileData.name || !profileData.name.trim()) {
      throw new Error('User name is required')
    }
    if (!profileData.email || !profileData.email.trim()) {
      throw new Error('User email is required')
    }

    // Protect role & permissions from unauthorized elevation
    const safeData = {
      name: profileData.name.trim(),
      email: profileData.email.trim(),
      phone: profileData.phone || profileData.mobile || '',
      mobile: profileData.phone || profileData.mobile || '',
      contactPreference: profileData.contactPreference || 'Email + in-app'
    }

    // Update currentUser session
    this.currentUser = {
      ...this.currentUser,
      ...safeData
    }

    // Sync with canonical users list
    if (Array.isArray(this.users)) {
      const idx = this.users.findIndex(u => 
        u.id === this.currentUser.id || 
        u.user_id === this.currentUser.id || 
        u.email === safeData.email
      )
      if (idx !== -1) {
        this.users[idx] = {
          ...this.users[idx],
          ...safeData
        }
      }
    }

    if (typeof this.addAuditLog === 'function') {
      this.addAuditLog({
        action: 'Updated',
        event_type: 'USER_PROFILE_UPDATED',
        entity_type: 'user',
        entity_id: this.currentUser.id || 'USR-01',
        module: 'Organisation',
        description: `User profile updated for ${this.currentUser.name}.`,
        metadata: safeData
      })
    }

    return this.currentUser
  },

  // ==========================================
  // ACTION CENTRE ENTERPRISE WORKFLOW ENGINE
  // ==========================================
  actionQueue: [
    {
      id: 'ACT-PRC-1082',
      flowType: 'commercial_pricing',
      typeLabel: 'Commercial & Pricing Exception',
      title: 'Special Fleet Discount for Khyber Courier Service (5x BRG Cargo)',
      priority: 'Critical',
      priorityClass: 'bg-[#fee2e2] text-[#dc2626]',
      status: 'Pending',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      branch: 'Peshawar',
      originBranch: null,
      initiator: 'Asad Khan (Branch Manager)',
      assignedTo: 'Super Admin',
      createdAt: '24 Sep 2026, 09:30 AM',
      due: 'Today',
      recordRef: 'SO-8821',
      summary: '12% discount waiver requested on 5 BRG Cargo units (gross margin drops from 24.5% to 14.2%)',
      pricingData: {
        customerName: 'Khyber Courier & Logistics Ltd',
        customerContact: '0301-8829104',
        quotationRef: 'QT-8421',
        orderRef: 'SO-8821',
        modelName: 'BRG Cargo Delivery Electric Trike (72V 100Ah)',
        unitCount: 5,
        listPricePerUnit: 490000,
        totalListPrice: 2450000,
        requestedDiscountPercent: 12,
        requestedDiscountAmount: 294000,
        proposedDealValue: 2156000,
        standardMarginPercent: 24.5,
        projectedMarginPercent: 14.2,
        competitorContext: 'RoadPrince EV offered competitor trike at 10% discount. Key fleet trial order with 20 unit potential in Q4.',
        branchMaxAllowedDiscount: 8
      },
      resolution: null
    },
    {
      id: 'ACT-STK-2041',
      flowType: 'stock_reallocation',
      typeLabel: 'Inter-Branch Stock Reallocation',
      title: 'Emergency Reallocation of 2x BRG E-125 (Gloss Emerald Green)',
      priority: 'Critical',
      priorityClass: 'bg-[#fee2e2] text-[#dc2626]',
      status: 'Pending',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      branch: 'Islamabad',
      originBranch: 'Lahore',
      initiator: 'Bilal Ahmed (Branch Manager)',
      assignedTo: 'Super Admin',
      createdAt: '24 Sep 2026, 10:15 AM',
      due: 'Today',
      recordRef: 'TR-221',
      summary: 'Urgent pull of 2 BRG E-125 units from Lahore to Islamabad for diplomat delivery booking',
      stockData: {
        originBranch: 'Lahore Central Hub',
        destinationBranch: 'Islamabad Branch',
        modelSku: 'BRG-EV-E125-GRN',
        modelName: 'BRG E-125 Urban High-Speed Scooter',
        requestedQty: 2,
        chassisVins: 'VIN-LHE-2026-00411, VIN-LHE-2026-00412',
        linkedBookingRef: 'SO-7910',
        requiredByDate: '25 Sep 2026, 05:00 PM',
        logisticsCarrier: 'TCS Dedicated Inter-Branch Van',
        urgencyReason: 'Customer deposit received; customer departing on foreign diplomatic mission on Friday. Islamabad showroom has 0 green units in stock.',
        freightCostEstimate: 36000
      },
      resolution: null
    },
    {
      id: 'ACT-EXP-3095',
      flowType: 'operational_expense',
      typeLabel: 'Emergency Operational Expenditure',
      title: 'Showroom Emergency Grid Inverter & Generator Fuel Requisition',
      priority: 'High',
      priorityClass: 'bg-[#fee2e2] text-[#dc2626]',
      status: 'Pending',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      branch: 'Rawalpindi',
      originBranch: null,
      initiator: 'Tariq Mehmood (Branch Manager)',
      assignedTo: 'Super Admin',
      createdAt: '24 Sep 2026, 08:45 AM',
      due: 'Today',
      recordRef: 'EXP-221',
      summary: 'PKR 148,500 emergency backup power diesel & inverter replacement following grid transformer explosion',
      expenseData: {
        expenseCategory: 'Utilities & Power Backup',
        amountPkr: 148500,
        payeeVendor: 'Rawalpindi Solar & Heavy Generators Ltd',
        vendorNtn: 'NTN-8812740-2',
        paymentMethod: 'Direct Vendor Bank Transfer',
        invoiceRef: 'INV-GEN-9921',
        operationalEmergencyJustification: 'Grid transformer explosion on Peshawar Road caused complete power blackout. High-voltage showroom chargers and customer delivery bay offline during 40°C heatwave.',
        delayImpact: 'Showroom unable to charge delivery bikes; customer test rides suspended.'
      },
      resolution: null
    },
    {
      id: 'ACT-WAR-4018',
      flowType: 'warranty_escalation',
      typeLabel: 'Critical Warranty Claim',
      title: 'High-Voltage Traction Battery Pack Replacement (72V 52Ah Lithium NMC)',
      priority: 'Critical',
      priorityClass: 'bg-[#fee2e2] text-[#dc2626]',
      status: 'Pending',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      branch: 'Peshawar',
      originBranch: null,
      initiator: 'Farhan Ullah (Lead Diagnostic Technician)',
      assignedTo: 'Super Admin',
      createdAt: '24 Sep 2026, 09:10 AM',
      due: 'Today',
      recordRef: 'RJ-109',
      summary: 'Battery cell thermal imbalance (>450mV drift) on Dr. Imran Shah\'s BRG E-125 under 3-year warranty',
      warrantyData: {
        customerName: 'Dr. Imran Shah',
        customerPhone: '0300-5918274',
        vehicleVin: 'VIN-PK-BRG-2025-00192',
        modelName: 'BRG E-125 (Purchased Dec 2025)',
        odometerKm: 6420,
        defectComponent: 'Main Traction Battery Module 72V 52Ah',
        diagnosticCode: 'BMS-ERR-042: Cell Bank 4 Voltage Imbalance (>450mV drift)',
        technicianFindings: 'Battery drops from 80% to 15% under acceleration load. Thermal sensor triggered 62°C safe shutdown. No casing damage or water ingress. Genuine internal cell degradation.',
        replacementSkuNeeded: 'PART-BAT-7252-NMC',
        estimatedPartCost: 185000,
        safetyRiskLevel: 'High (Vehicle shut down on highway; risk of thermal runaway if continued)'
      },
      resolution: null
    },
    {
      id: 'ACT-GOV-5034',
      flowType: 'inventory_governance',
      typeLabel: 'Inventory Governance & Quarantine',
      title: 'Transit Discrepancy & Quarantine Sign-Off for 3 Inbound BRG DS-11 Units',
      priority: 'Medium',
      priorityClass: 'bg-[#fef3c7] text-[#b45309]',
      status: 'Pending',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      branch: 'Lahore',
      originBranch: null,
      initiator: 'Kamran Rafiq (Warehouse Supervisor)',
      assignedTo: 'Super Admin',
      createdAt: '23 Sep 2026, 04:30 PM',
      due: 'Tomorrow',
      recordRef: 'QA-102',
      summary: '3 units arrived from port with ruptured transit straps and cracked fairings; quarantined in Bay Q-3 pending insurance write-down',
      governanceData: {
        auditDate: '22 Sep 2026',
        affectedVinOrSku: 'VIN-PK-BRG-2026-00941, 00942, 00943',
        modelName: 'BRG DS-11 Sports Commuter',
        systemRecordedQty: 3,
        physicalFoundQty: 3,
        discrepancyUnitCount: 3,
        estimatedVariancePkr: 72000,
        rootCauseClassification: 'Transit Mishandling by Karachi Port Logistics Transporter',
        recommendedAction: 'Quarantine Segregation in Bay Q-3 & Insurance Recovery Claim against Port Carrier',
        incidentDescription: 'Container cargo straps severed during rough transit. Crates tipped over inside container, cracking ABS front fairings and bending right mirrors on 3 units.',
        managerCertification: 'Certified by Haris Siddiqui (BM Lahore) and Kamran Rafiq (QC Officer)'
      },
      resolution: null
    },
    {
      id: 'ACT-PRC-1079',
      flowType: 'commercial_pricing',
      typeLabel: 'Commercial & Pricing Exception',
      title: 'Government Employee Promotional Rebate (KPK Police Welfare Order)',
      priority: 'Medium',
      priorityClass: 'bg-[#fef3c7] text-[#b45309]',
      status: 'Approved',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch: 'Peshawar',
      originBranch: null,
      initiator: 'Asad Khan (Branch Manager)',
      assignedTo: 'Super Admin',
      createdAt: '22 Sep 2026, 11:20 AM',
      due: 'Resolved',
      recordRef: 'SO-8790',
      summary: 'PKR 85,000 corporate rebate approved by Super Admin for KPK Police Welfare Foundation',
      pricingData: {
        customerName: 'KPK Police Welfare Foundation',
        customerContact: '091-9212000',
        quotationRef: 'QT-8380',
        orderRef: 'SO-8790',
        modelName: 'BRG E-125 Urban High-Speed Scooter',
        unitCount: 2,
        listPricePerUnit: 340000,
        totalListPrice: 680000,
        requestedDiscountPercent: 12.5,
        requestedDiscountAmount: 85000,
        proposedDealValue: 595000,
        standardMarginPercent: 22.0,
        projectedMarginPercent: 15.5,
        competitorContext: 'Institutional fleet MOU agreement',
        branchMaxAllowedDiscount: 8
      },
      resolution: {
        decision: 'Approved',
        decisionNotes: 'Approved under Institutional Welfare Program MoU. Margin remains within acceptable 15% threshold.',
        decidedBy: 'Super Admin',
        decidedAt: '22 Sep 2026, 02:40 PM',
        treatmentResult: { discountGranted: '12.5%', effectivePkr: 595000 }
      }
    },
    {
      id: 'ACT-EXP-3088',
      flowType: 'operational_expense',
      typeLabel: 'Emergency Operational Expenditure',
      title: 'Showroom Glass Facade Structural Repair Voucher',
      priority: 'Low',
      priorityClass: 'bg-gray-100 text-gray-700',
      status: 'Resolved',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch: 'Peshawar',
      originBranch: null,
      initiator: 'Asad Khan (Branch Manager)',
      assignedTo: 'Super Admin',
      createdAt: '20 Sep 2026, 03:15 PM',
      due: 'Resolved',
      recordRef: 'EXP-198',
      summary: 'PKR 45,000 paid to Al-Rehman Glass Works for cracked tempered glass replacement',
      expenseData: {
        expenseCategory: 'Facilities Repair',
        amountPkr: 45000,
        payeeVendor: 'Al-Rehman Glass Works Peshawar',
        vendorNtn: 'NTN-7391820-1',
        paymentMethod: 'Cash Petty Reimbursement',
        invoiceRef: 'INV-GLS-401',
        operationalEmergencyJustification: 'Tempered glass door cracked during windstorm, posing customer safety hazard.',
        delayImpact: 'Immediate hazard rectified.'
      },
      resolution: {
        decision: 'Approved & Disbursed',
        decisionNotes: 'Safety urgent work approved and disbursed from Head Office imprest fund.',
        decidedBy: 'Super Admin',
        decidedAt: '20 Sep 2026, 04:30 PM',
        treatmentResult: { voucherNumber: 'VOUCH-EXP-198', paymentStatus: 'Disbursed' }
      }
    }
  ],

  getActionQueue(branch = null) {
    if (!branch || branch === 'All Branches') return this.actionQueue
    return this.actionQueue.filter(item => 
      item.branch?.toLowerCase() === branch.toLowerCase() || 
      item.originBranch?.toLowerCase() === branch.toLowerCase() ||
      item.branch === 'All Branches'
    )
  },

  getActionById(id) {
    if (!id) return null
    return this.actionQueue.find(a => a.id === id || a.recordRef === id) || null
  },

  createActionItem(itemData) {
    const typePrefixMap = {
      commercial_pricing: 'ACT-PRC-',
      stock_reallocation: 'ACT-STK-',
      operational_expense: 'ACT-EXP-',
      warranty_escalation: 'ACT-WAR-',
      inventory_governance: 'ACT-GOV-'
    }
    const prefix = typePrefixMap[itemData.flowType] || 'ACT-GEN-'
    const newId = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`
    
    const newItem = {
      id: newId,
      status: 'Pending',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      priorityClass: itemData.priority === 'Critical' ? 'bg-[#fee2e2] text-[#dc2626]' : 
                     itemData.priority === 'High' ? 'bg-[#fee2e2] text-[#dc2626]' : 
                     itemData.priority === 'Medium' ? 'bg-[#fef3c7] text-[#b45309]' : 'bg-gray-100 text-gray-700',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      due: itemData.due || 'Today',
      resolution: null,
      ...itemData
    }

    this.actionQueue.unshift(newItem)

    if (typeof this.addAuditLog === 'function') {
      this.addAuditLog({
        action: 'Created',
        event_type: 'ACTION_ITEM_CREATED',
        entity_type: 'action_item',
        entity_id: newId,
        module: 'Action Centre',
        description: `Action [${newItem.title}] raised under [${newItem.typeLabel}].`,
        metadata: { flowType: newItem.flowType, priority: newItem.priority, branch: newItem.branch }
      })
    }

    return newItem
  },

  resolveActionItem(id, decisionData) {
    const item = this.getActionById(id)
    if (!item) throw new Error('Action item not found')

    item.status = decisionData.status || 'Resolved'
    if (item.status === 'Approved' || item.status === 'Resolved' || item.status === 'Dispatched') {
      item.statusClass = 'bg-[#dcfce7] text-[#165A31]'
    } else if (item.status === 'Countered') {
      item.statusClass = 'bg-blue-50 text-blue-700'
    } else if (item.status === 'Rejected' || item.status === 'Declined') {
      item.statusClass = 'bg-[#fee2e2] text-[#dc2626]'
    } else {
      item.statusClass = 'bg-[#fef3c7] text-[#b45309]'
    }

    item.due = 'Resolved'
    item.resolution = {
      decision: decisionData.status,
      decisionNotes: decisionData.decisionNotes || '',
      decidedBy: this.currentUser?.name || (this.isBranchUser() ? 'Branch Manager' : 'Super Admin'),
      decidedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      treatmentResult: decisionData.treatmentResult || {}
    }

    // Apply side-effects to linked entities if applicable
    if (item.flowType === 'commercial_pricing' && item.recordRef) {
      const order = this.orders?.find(o => o.id === item.recordRef)
      if (order && (decisionData.status === 'Approved' || decisionData.status === 'Countered')) {
        order.approvalStatus = 'Approved'
        order.specialDiscountApproved = true
      }
    }

    if (typeof this.addAuditLog === 'function') {
      this.addAuditLog({
        action: 'Resolved',
        event_type: 'ACTION_ITEM_RESOLVED',
        entity_type: 'action_item',
        entity_id: item.id,
        module: 'Action Centre',
        description: `Action [${item.id}] marked as [${item.status}]: ${decisionData.decisionNotes || 'Treatment applied'}.`,
        metadata: { id: item.id, status: item.status, flowType: item.flowType }
      })
    }

    return item
  },

  formatCurrency(amount) {
    const val = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]/g, ''))
    if (isNaN(val)) return 'PKR 0'
    const curr = this.settings?.finance?.currency || 'PKR'
    return `${curr} ${Math.round(val).toLocaleString()}`
  },

  formatDate(dateStr) {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return String(dateStr)
    return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`
  },

  // ==========================================
  // 1. CANONICAL CUSTOMER MASTER
  // ==========================================
  customers: [
    {
      id: 'CUST-101',
      customer_id: 'CUST-101',
      code: 'CUS-0812',
      name: 'Ahsan Khan',
      firstName: 'Ahsan',
      lastName: 'Khan',
      phone: '+92 300 555 0188',
      email: 'ahsan.khan@example.com',
      cnic: '17301-4491023-1',
      address: 'University Road, Phase 3',
      city: 'Peshawar',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      orders: 3,
      ordersCount: 3,
      outstanding: 'PKR 0',
      totalPurchases: 'PKR 840,000',
      balance: '0',
      ltv: '840K',
      units: 3,
      activity: 'Today',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      createdAt: '2026-01-15'
    },
    {
      id: 'CUST-102',
      customer_id: 'CUST-102',
      code: 'CUS-0744',
      name: 'Bilal Shah',
      firstName: 'Bilal',
      lastName: 'Shah',
      phone: '+92 333 118 2011',
      email: 'bilal.shah@example.com',
      cnic: '17301-8891024-5',
      address: 'Sector F-7/2',
      city: 'Islamabad',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      orders: 2,
      ordersCount: 2,
      outstanding: 'PKR 215,000',
      totalPurchases: 'PKR 540,000',
      balance: '215,000',
      ltv: '540K',
      units: 2,
      activity: 'Yesterday',
      status: 'Follow-up',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      createdAt: '2026-02-10'
    },
    {
      id: 'CUST-103',
      customer_id: 'CUST-103',
      code: 'CUS-0691',
      name: 'Faisal Khan',
      firstName: 'Faisal',
      lastName: 'Khan',
      phone: '+92 300 1234567',
      email: 'faisal.khan@example.com',
      cnic: '17301-1123456-7',
      address: 'House 42, Street 8, Hayatabad Phase 3',
      city: 'Peshawar',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      orders: 1,
      ordersCount: 1,
      outstanding: 'PKR 0',
      totalPurchases: 'PKR 280,000',
      balance: '0',
      ltv: '280K',
      units: 1,
      activity: '3 days ago',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      createdAt: '2026-03-01'
    },
    {
      id: 'CUST-104',
      customer_id: 'CUST-104',
      code: 'CUS-0655',
      name: 'Ali Raza',
      firstName: 'Ali',
      lastName: 'Raza',
      phone: '+92 321 4455667',
      email: 'ali.raza@example.com',
      cnic: '35201-9988776-3',
      address: 'Gulberg III, Main Boulevard',
      city: 'Lahore',
      branch_id: 'BR-03',
      branch: 'Lahore',
      orders: 4,
      ordersCount: 4,
      outstanding: 'PKR 50,000',
      totalPurchases: 'PKR 1,120,000',
      balance: '50,000',
      ltv: '1.12M',
      units: 4,
      activity: '1 week ago',
      status: 'VIP',
      statusClass: 'bg-[#e0e7ff] text-[#3730a3]',
      createdAt: '2025-11-20'
    },
    {
      id: 'CUST-105',
      customer_id: 'CUST-105',
      code: 'CUS-0580',
      name: 'Tariq Mehmood',
      firstName: 'Tariq',
      lastName: 'Mehmood',
      phone: '+92 345 8877665',
      email: 'tariq.m@example.com',
      cnic: '37405-2233445-9',
      address: 'Saddar Bazar',
      city: 'Rawalpindi',
      branch_id: 'BR-04',
      branch: 'Rawalpindi',
      orders: 1,
      ordersCount: 1,
      outstanding: 'PKR 0',
      totalPurchases: 'PKR 240,000',
      balance: '0',
      ltv: '240K',
      units: 1,
      activity: '2 weeks ago',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      createdAt: '2026-04-05'
    },
    {
      id: 'CUST-106',
      customer_id: 'CUST-106',
      code: 'CUS-0512',
      name: 'Jawad Khan',
      firstName: 'Jawad',
      lastName: 'Khan',
      phone: '+92 312 9988112',
      email: 'jawad.k@example.com',
      cnic: '17301-7766554-1',
      address: 'Warsak Road',
      city: 'Peshawar',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      orders: 1,
      ordersCount: 1,
      outstanding: 'PKR 260,000',
      totalPurchases: 'PKR 360,000',
      balance: '260,000',
      ltv: '360K',
      units: 1,
      activity: '4 days ago',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      createdAt: '2026-04-12'
    },
    {
      id: 'CUST-107',
      customer_id: 'CUST-107',
      code: 'CUS-0490',
      name: 'Noman Ali',
      firstName: 'Noman',
      lastName: 'Ali',
      phone: '+92 300 7711223',
      email: 'noman.ali@example.com',
      cnic: '17301-3344556-9',
      address: 'Hayatabad Phase 5',
      city: 'Peshawar',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      orders: 2,
      ordersCount: 2,
      outstanding: 'PKR 0',
      totalPurchases: 'PKR 560,000',
      balance: '0',
      ltv: '560K',
      units: 2,
      activity: '5 days ago',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      createdAt: '2026-02-18'
    },
    {
      id: 'CUST-108',
      customer_id: 'CUST-108',
      code: 'CUS-0430',
      name: 'Sajid Khan',
      firstName: 'Sajid',
      lastName: 'Khan',
      phone: '+92 313 5544332',
      email: 'sajid.khan@example.com',
      cnic: '17301-6677889-1',
      address: 'Gulbahar No 2',
      city: 'Peshawar',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      orders: 0,
      ordersCount: 0,
      outstanding: 'PKR 0',
      totalPurchases: 'PKR 0',
      balance: '0',
      ltv: '0',
      units: 0,
      activity: 'Today',
      status: 'Lead',
      statusClass: 'bg-[#eff6ff] text-[#2563eb]',
      createdAt: '2026-08-20'
    }
  ],

  addCustomer(newCustomer) {
    const id = newCustomer.id || newCustomer.customer_id || `CUST-${Math.floor(100 + Math.random() * 900)}`
    const customerObj = {
      ...newCustomer,
      id,
      customer_id: id,
      code: newCustomer.code || `CUS-${Math.floor(1000 + Math.random() * 9000)}`,
      branch_id: newCustomer.branch_id || (newCustomer.branch === 'Islamabad' ? 'BR-02' : newCustomer.branch === 'Lahore' ? 'BR-03' : newCustomer.branch === 'Rawalpindi' ? 'BR-04' : 'BR-01'),
      status: newCustomer.status || 'Active',
      statusClass: newCustomer.statusClass || 'bg-[#dcfce7] text-[#165A31]',
      createdAt: newCustomer.createdAt || new Date().toISOString().split('T')[0]
    }
    this.customers.unshift(customerObj)

    this.addAuditLog({
      action: 'Created',
      entity_type: 'customer',
      entity_id: customerObj.id,
      module: 'Sales',
      branch: customerObj.branch || 'Peshawar',
      branch_id: customerObj.branch_id,
      description: `Customer ${customerObj.name} (${customerObj.id}) registered.`,
      metadata: { name: customerObj.name, phone: customerObj.phone, email: customerObj.email }
    })

    return customerObj
  },

  updateCustomer(id, updatedData) {
    const index = this.customers.findIndex(c => c.id === id || c.customer_id === id || c.code === id)
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...updatedData }

      this.addAuditLog({
        action: 'Updated',
        entity_type: 'customer',
        entity_id: this.customers[index].id,
        module: 'Sales',
        branch: this.customers[index].branch || 'Peshawar',
        description: `Customer profile for ${this.customers[index].name} (${this.customers[index].id}) updated.`,
        metadata: { updatedFields: Object.keys(updatedData) }
      })

      return this.customers[index]
    }
    return null
  },

  getCustomerById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.customers.find(c => 
      (c.id && c.id.toLowerCase() === target) ||
      (c.customer_id && c.customer_id.toLowerCase() === target) ||
      (c.code && c.code.toLowerCase() === target) ||
      (c.name && c.name.toLowerCase() === target)
    ) || null
  },

  canDeleteCustomer(customerId) {
    if (!customerId) return { canDelete: false, reasons: ['Invalid customer ID'] }
    const cId = String(customerId).toLowerCase().trim()
    const cust = this.getCustomerById(customerId)
    const custName = cust ? cust.name.toLowerCase().trim() : ''
    const reasons = []

    if (this.quotations && this.quotations.some(q => (q.customer_id && q.customer_id.toLowerCase() === cId) || (q.customer && q.customer.toLowerCase() === custName))) {
      reasons.push('Customer has associated Quotations.')
    }
    if (this.orders && this.orders.some(o => (o.customer_id && o.customer_id.toLowerCase() === cId) || (o.customer && o.customer.toLowerCase() === custName))) {
      reasons.push('Customer has linked Sales Orders.')
    }
    if (this.invoices && this.invoices.some(i => (i.customer_id && i.customer_id.toLowerCase() === cId) || (i.customer && i.customer.toLowerCase() === custName))) {
      reasons.push('Customer has active Invoices.')
    }
    if (this.payments && this.payments.some(p => (p.customer_id && p.customer_id.toLowerCase() === cId) || (p.customer && p.customer.toLowerCase() === custName))) {
      reasons.push('Customer has historical Payments.')
    }
    if (this.deliveries && this.deliveries.some(d => (d.customer_id && d.customer_id.toLowerCase() === cId) || (d.customer && d.customer.toLowerCase() === custName))) {
      reasons.push('Customer has scheduled or completed Deliveries.')
    }
    if (this.warranties && this.warranties.some(w => (w.customer_id && w.customer_id.toLowerCase() === cId) || (w.customer && w.customer.toLowerCase() === custName))) {
      reasons.push('Customer has registered Warranties.')
    }
    if (this.cases && this.cases.some(c => (c.customer_id && c.customer_id.toLowerCase() === cId) || (c.customerName && c.customerName.toLowerCase() === custName) || (c.customer && c.customer.toLowerCase() === custName))) {
      reasons.push('Customer has linked Service Cases.')
    }

    return {
      canDelete: reasons.length === 0,
      reasons
    }
  },

  deleteCustomer(customerId) {
    const check = this.canDeleteCustomer(customerId)
    if (!check.canDelete) {
      throw new Error(`Cannot delete customer: ${check.reasons.join(' ')}`)
    }
    const idx = this.customers.findIndex(c => c.id === customerId || c.customer_id === customerId || c.code === customerId)
    if (idx !== -1) {
      this.customers.splice(idx, 1)
      return true
    }
    return false
  },

  // ==========================================
  // 2. CANONICAL PRODUCT MASTER & CATEGORIES
  // ==========================================
  categories: [
    { id: 'CAT-01', categoryId: 'CAT-01', name: 'Electric Scooters', code: 'SCOOT', productCount: 4, status: 'Active' },
    { id: 'CAT-02', categoryId: 'CAT-02', name: 'Electric Bikes', code: 'BIKE', productCount: 3, status: 'Active' },
    { id: 'CAT-03', categoryId: 'CAT-03', name: 'Commercial & Cargo', code: 'CARGO', productCount: 2, status: 'Active' },
    { id: 'CAT-04', categoryId: 'CAT-04', name: 'Batteries & Chargers', code: 'BATT', productCount: 5, status: 'Active' },
    { id: 'CAT-05', categoryId: 'CAT-05', name: 'Spare Parts & Accessories', code: 'PARTS', productCount: 18, status: 'Active' }
  ],

  products: [
    {
      id: 'PROD-001',
      product_id: 'PROD-001',
      name: 'BRG E-125',
      modelName: 'BRG E-125',
      sku: 'SKU-E125-RED',
      category: 'Electric Scooters',
      categoryId: 'CAT-01',
      specs: '72V 30Ah · 1200W · 85km Range',
      price: 'PKR 280,000',
      sellingPrice: 280000,
      costPrice: 210000,
      dealerPrice: 250000,
      warranty: '2 Years / 20,000 km',
      warrantyMonths: 24,
      isSerialized: true,
      total: 3,
      available: 2,
      reserved: 0,
      inTransit: 0,
      qcHold: 0,
      reorderLevel: 2,
      peshawar: 1,
      islamabad: 0,
      lahore: 2,
      rawalpindi: 0,
      stock: '3 units',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch: 'Peshawar'
    },
    {
      id: 'PROD-002',
      product_id: 'PROD-002',
      name: 'BRG X7',
      modelName: 'BRG X7',
      sku: 'SKU-X7-BLK',
      category: 'Electric Scooters',
      categoryId: 'CAT-01',
      specs: '72V 35Ah · 1500W · 95km Range',
      price: 'PKR 340,000',
      sellingPrice: 340000,
      costPrice: 260000,
      dealerPrice: 310000,
      warranty: '2 Years / 20,000 km',
      warrantyMonths: 24,
      isSerialized: true,
      total: 2,
      available: 2,
      reserved: 0,
      inTransit: 0,
      qcHold: 0,
      reorderLevel: 2,
      peshawar: 1,
      islamabad: 1,
      lahore: 0,
      rawalpindi: 0,
      stock: '2 units',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch: 'Peshawar'
    },
    {
      id: 'PROD-003',
      product_id: 'PROD-003',
      name: 'BRG DS11',
      modelName: 'BRG DS11',
      sku: 'SKU-DS11-BLU',
      category: 'Electric Scooters',
      categoryId: 'CAT-01',
      specs: '60V 26Ah · 1000W · 70km Range',
      price: 'PKR 240,000',
      sellingPrice: 240000,
      costPrice: 180000,
      dealerPrice: 215000,
      warranty: '2 Years / 20,000 km',
      warrantyMonths: 24,
      isSerialized: true,
      total: 7,
      available: 1,
      reserved: 1,
      inTransit: 4,
      qcHold: 1,
      reorderLevel: 3,
      peshawar: 3,
      islamabad: 0,
      lahore: 0,
      rawalpindi: 0,
      stock: '7 units',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch: 'Peshawar'
    },
    {
      id: 'PROD-004',
      product_id: 'PROD-004',
      name: 'BRG E9 Pro',
      modelName: 'BRG E9 Pro',
      sku: 'SKU-E9P-WHT',
      category: 'Electric Scooters',
      categoryId: 'CAT-01',
      specs: '72V 40Ah · 2000W · 110km Range',
      price: 'PKR 390,000',
      sellingPrice: 390000,
      costPrice: 300000,
      dealerPrice: 355000,
      warranty: '3 Years / 30,000 km',
      warrantyMonths: 36,
      isSerialized: true,
      total: 2,
      available: 2,
      reserved: 0,
      inTransit: 0,
      qcHold: 0,
      reorderLevel: 2,
      peshawar: 1,
      islamabad: 1,
      lahore: 0,
      rawalpindi: 0,
      stock: '2 units',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch: 'Islamabad'
    },
    {
      id: 'PROD-005',
      product_id: 'PROD-005',
      name: 'BRG City Pro',
      modelName: 'BRG City Pro',
      sku: 'SKU-CP-GRY',
      category: 'Electric Bikes',
      categoryId: 'CAT-02',
      specs: '60V 24Ah · 800W · 65km Range',
      price: 'PKR 220,000',
      sellingPrice: 220000,
      costPrice: 165000,
      dealerPrice: 195000,
      warranty: '2 Years / 20,000 km',
      warrantyMonths: 24,
      isSerialized: true,
      total: 2,
      available: 2,
      reserved: 0,
      inTransit: 0,
      qcHold: 0,
      reorderLevel: 2,
      peshawar: 0,
      islamabad: 0,
      lahore: 2,
      rawalpindi: 0,
      stock: '2 units',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch: 'Lahore'
    },
    {
      id: 'PROD-006',
      product_id: 'PROD-006',
      name: 'Cargo Pro EV',
      modelName: 'Cargo Pro EV',
      sku: 'SKU-CPRO-YEL',
      category: 'Commercial & Cargo',
      categoryId: 'CAT-03',
      specs: '72V 60Ah · 2500W · Heavy Load Carrier',
      price: 'PKR 450,000',
      sellingPrice: 450000,
      costPrice: 350000,
      dealerPrice: 410000,
      warranty: '2 Years / 20,000 km',
      warrantyMonths: 24,
      isSerialized: true,
      total: 1,
      available: 1,
      reserved: 0,
      inTransit: 0,
      qcHold: 0,
      reorderLevel: 1,
      peshawar: 1,
      islamabad: 0,
      lahore: 0,
      rawalpindi: 0,
      stock: '1 units',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch: 'Peshawar'
    },
    {
      id: 'PROD-007',
      product_id: 'PROD-007',
      name: 'PowerCell 72V 30Ah',
      modelName: 'PowerCell 72V 30Ah Battery',
      sku: 'SKU-BAT-7230',
      category: 'Batteries & Chargers',
      categoryId: 'CAT-04',
      specs: 'Graphene Lithium LFP Battery Pack',
      price: 'PKR 115,000',
      sellingPrice: 115000,
      costPrice: 85000,
      dealerPrice: 102000,
      warranty: '3 Years Replacement',
      warrantyMonths: 36,
      isSerialized: false,
      total: 43,
      available: 43,
      reserved: 0,
      inTransit: 0,
      qcHold: 0,
      reorderLevel: 10,
      peshawar: 23,
      islamabad: 8,
      lahore: 8,
      rawalpindi: 4,
      stock: '43 units',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch: 'Peshawar'
    },
    {
      id: 'PROD-008',
      product_id: 'PROD-008',
      name: 'Ceramic Disc Brake Pads',
      modelName: 'Ceramic Disc Brake Pads Set',
      sku: 'SKU-BRK-01',
      category: 'Spare Parts & Accessories',
      categoryId: 'CAT-05',
      specs: 'High Heat Resistance Ceramic Composite Pads',
      price: 'PKR 3,600',
      sellingPrice: 3600,
      costPrice: 2100,
      dealerPrice: 2800,
      warranty: '6 Months',
      warrantyMonths: 6,
      isSerialized: false,
      total: 50,
      available: 50,
      reserved: 0,
      inTransit: 0,
      qcHold: 0,
      reorderLevel: 15,
      peshawar: 30,
      islamabad: 12,
      lahore: 8,
      rawalpindi: 0,
      stock: '50 units',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch: 'Peshawar'
    },
    {
      id: 'PROD-009',
      product_id: 'PROD-009',
      name: 'Intelligent EV Controller 72V',
      modelName: 'Intelligent EV Controller 72V 45A',
      sku: 'SKU-CTRL-72V',
      category: 'Spare Parts & Accessories',
      categoryId: 'CAT-05',
      specs: 'Sine Wave Vector BLDC Motor Controller',
      price: 'PKR 18,500',
      sellingPrice: 18500,
      costPrice: 12000,
      dealerPrice: 15000,
      warranty: '1 Year Replacement',
      warrantyMonths: 12,
      isSerialized: false,
      total: 20,
      available: 20,
      reserved: 0,
      inTransit: 0,
      qcHold: 0,
      reorderLevel: 5,
      peshawar: 10,
      islamabad: 6,
      lahore: 4,
      rawalpindi: 0,
      stock: '20 units',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch: 'Peshawar'
    },
    {
      id: 'PROD-010',
      product_id: 'PROD-010',
      name: 'Smart Fast Charger 72V',
      modelName: 'Smart Fast Charger 72V 5A',
      sku: 'SKU-CHG-72V',
      category: 'Batteries & Chargers',
      categoryId: 'CAT-04',
      specs: 'Auto Cutoff Aluminum Alloy Case Charger',
      price: 'PKR 8,500',
      sellingPrice: 8500,
      costPrice: 5500,
      dealerPrice: 7000,
      warranty: '1 Year Replacement',
      warrantyMonths: 12,
      isSerialized: false,
      total: 35,
      available: 35,
      reserved: 0,
      inTransit: 0,
      qcHold: 0,
      reorderLevel: 8,
      peshawar: 20,
      islamabad: 8,
      lahore: 7,
      rawalpindi: 0,
      stock: '35 units',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch: 'Peshawar'
    }
  ],

  addProduct(newProduct) {
    const id = newProduct.id || newProduct.product_id || `PROD-${String(this.products.length + 1).padStart(3, '0')}`
    const productObj = {
      ...newProduct,
      id,
      product_id: id,
      modelName: newProduct.modelName || newProduct.name,
      status: newProduct.status || 'Active',
      statusClass: newProduct.statusClass || 'bg-[#dcfce7] text-[#165A31]'
    }
    this.products.unshift(productObj)
    return productObj
  },

  updateProduct(id, updatedData) {
    const index = this.products.findIndex(p => p.id === id || p.product_id === id || p.modelName === id || p.name === id)
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedData }
      return this.products[index]
    }
    return null
  },

  getProductById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.products.find(p => 
      (p.id && p.id.toLowerCase() === target) ||
      (p.product_id && p.product_id.toLowerCase() === target) ||
      (p.name && p.name.toLowerCase() === target) ||
      (p.modelName && p.modelName.toLowerCase() === target) ||
      (p.sku && p.sku.toLowerCase() === target)
    ) || null
  },

  addCategory(category) {
    const id = category.id || category.categoryId || `CAT-${String(this.categories.length + 1).padStart(2, '0')}`
    const catObj = { ...category, id, categoryId: id, status: 'Active' }
    this.categories.push(catObj)
    return catObj
  },

  getCategoryById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.categories.find(c => 
      (c.id && c.id.toLowerCase() === target) ||
      (c.categoryId && c.categoryId.toLowerCase() === target) ||
      (c.name && c.name.toLowerCase() === target)
    ) || null
  },

  // ==========================================
  // 3. CANONICAL SERIALIZED UNIT MASTER
  // ==========================================
  serializedUnits: [
    {
      id: 'UNIT-101',
      unit_id: 'DS11-00997',
      serial: 'DS11-00997',
      chassisNumber: 'CH-89991',
      chassis: 'CH-89991',
      chassisNo: 'CH-89991',
      vin: 'VIN-PK-BRG-2026-00997',
      motorNumber: 'MTR-72V-1200-881',
      batteryNumber: 'BAT-7230-04421',
      product_id: 'PROD-003',
      product: 'BRG DS11',
      modelName: 'BRG DS11',
      sku: 'SKU-DS11-BLU',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      location: 'Showroom Floor',
      landedCost: '145.8K',
      sellingPrice: 'PKR 240,000',
      status: 'Available',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      condition: 'Good',
      source: 'PO-2015',
      sourcePo: 'PO-2015',
      receipt_id: 'GR-991',
      ownership_status: 'Inventory',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-08-20',
      timeline: [
        { date: '2026-08-20 14:32', title: 'Goods Received (GRN)', desc: 'Received via GR-991 from PowerCell Co. under PO-2015.', user: 'Store Officer' },
        { date: '2026-08-20 15:15', title: 'PDI / QC Passed', desc: 'Pre-delivery inspection passed 100%. Shifted to Showroom Floor.', user: 'Peshawar Lead Tech' }
      ]
    },
    {
      id: 'UNIT-102',
      unit_id: 'DS11-01001',
      serial: 'DS11-01001',
      chassisNumber: 'CH-90111',
      chassis: 'CH-90111',
      chassisNo: 'CH-90111',
      vin: 'VIN-PK-BRG-2026-01001',
      motorNumber: 'MTR-72V-1200-889',
      batteryNumber: 'BAT-7230-04455',
      product_id: 'PROD-003',
      product: 'BRG DS11',
      modelName: 'BRG DS11',
      sku: 'SKU-DS11-BLU',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      location: 'QC Inspection Bay',
      landedCost: '163.4K',
      sellingPrice: 'PKR 240,000',
      status: 'QC Hold',
      statusClass: 'bg-amber-50 text-amber-700',
      condition: 'Minor body panel scratch',
      source: 'PO-2048',
      sourcePo: 'PO-2048',
      receipt_id: 'GR-991',
      ownership_status: 'Inventory (QC Hold)',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-08-25',
      timeline: [
        { date: '2026-08-22 11:00', title: 'Received at Branch', desc: 'Received under PO-2048.', user: 'Store Officer' },
        { date: '2026-08-27 10:15', title: 'Status Adjustment ADJ-016', desc: 'Reclassified from Available to QC Hold due to handling mark.', user: 'Ahsan Khan' }
      ]
    },
    {
      id: 'UNIT-103',
      unit_id: 'CH 8-BRG-26-01731',
      serial: 'CH 8-BRG-26-01731',
      chassisNumber: 'CH 8-BRG-26-01731',
      chassis: 'CH 8-BRG-26-01731',
      chassisNo: 'CH 8-BRG-26-01731',
      vin: 'VIN-PK-BRG-2026-01731',
      motorNumber: 'MTR-72V-1500-112',
      batteryNumber: 'BAT-7235-09912',
      product_id: 'PROD-001',
      product: 'BRG E-125',
      modelName: 'BRG E-125',
      sku: 'SKU-E125-RED',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      location: 'Workshop Bay 1',
      landedCost: '185.0K',
      sellingPrice: 'PKR 280,000',
      status: 'Maintenance',
      statusClass: 'bg-[#e0e7ff] text-[#3730a3]',
      condition: 'Under Repair',
      source: 'PO-1961',
      sourcePo: 'PO-1961',
      receipt_id: 'GR-882',
      ownership_status: 'Service Custody',
      customer_id: 'CUST-101',
      customer: 'Ahsan Khan',
      warrantyExpiry: '2028-05-15',
      timeline: [
        { date: '2026-05-15 10:00', title: 'Sold & Delivered', desc: 'Sold to Ahsan Khan under SO-6102.', user: 'Peshawar Sales' },
        { date: '2026-08-28 09:30', title: 'Service Intake (SC-229)', desc: 'Checked in for warranty battery balancing check.', user: 'Ahsan Khan' }
      ]
    },
    {
      id: 'UNIT-104',
      unit_id: 'E9P-CH-00891',
      serial: 'E9P-CH-00891',
      chassisNumber: 'CH-77812',
      chassis: 'CH-77812',
      chassisNo: 'CH-77812',
      vin: 'VIN-PK-BRG-2026-00891',
      motorNumber: 'MTR-72V-2000-551',
      batteryNumber: 'BAT-7240-01124',
      product_id: 'PROD-004',
      product: 'BRG E9 Pro',
      modelName: 'BRG E9 Pro',
      sku: 'SKU-E9P-WHT',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      location: 'Showroom Floor',
      landedCost: '260.0K',
      sellingPrice: 'PKR 390,000',
      status: 'Available',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      condition: 'Brand New',
      source: 'PO-2022',
      sourcePo: 'PO-2022',
      receipt_id: 'GR-910',
      ownership_status: 'Inventory',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2029-01-10',
      timeline: [
        { date: '2026-08-10 12:00', title: 'Goods Receipt', desc: 'Inwarded from BRG Factory via PO-2022.', user: 'Peshawar Store' },
        { date: '2026-08-10 14:30', title: 'Floor Display', desc: 'Pre-delivery inspection passed, placed on floor.', user: 'Peshawar Store' }
      ]
    },
    {
      id: 'UNIT-105',
      unit_id: 'CHS-01882',
      serial: 'CHS-01882',
      chassisNumber: 'CHS-01882',
      chassis: 'CHS-01882',
      chassisNo: 'CHS-01882',
      vin: 'VIN-PK-BRG-2026-00455',
      motorNumber: 'MTR-72V-1500-994',
      batteryNumber: 'BAT-7235-08812',
      product_id: 'PROD-002',
      product: 'BRG X7',
      modelName: 'BRG X7',
      sku: 'SKU-X7-BLK',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      location: 'Customer Custody',
      landedCost: '220.0K',
      sellingPrice: 'PKR 340,000',
      status: 'Sold',
      statusClass: 'bg-gray-100 text-gray-700',
      condition: 'Active in Use',
      source: 'PO-1945',
      sourcePo: 'PO-1945',
      receipt_id: 'GR-780',
      ownership_status: 'Customer Owned',
      customer_id: 'CUST-106',
      customer: 'Jawad Khan',
      warrantyExpiry: '2028-04-12',
      timeline: [
        { date: '2026-04-12 11:30', title: 'Sold & Delivered', desc: 'Sold to Jawad Khan via SO-5512.', user: 'Peshawar Sales' }
      ]
    },
    {
      id: 'UNIT-106',
      unit_id: 'DS11-01004',
      serial: 'DS11-01004',
      chassisNumber: 'CH-90114',
      chassis: 'CH-90114',
      chassisNo: 'CH-90114',
      vin: 'VIN-PK-BRG-2026-01004',
      motorNumber: 'MTR-72V-1200-901',
      batteryNumber: 'BAT-7230-04470',
      product_id: 'PROD-003',
      product: 'BRG DS11',
      modelName: 'BRG DS11',
      sku: 'SKU-DS11-BLU',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      location: 'Transfer in Transit',
      landedCost: '163.4K',
      sellingPrice: 'PKR 240,000',
      status: 'In Transit',
      statusClass: 'bg-blue-50 text-blue-700',
      condition: 'Good',
      source: 'Transfer TR-221',
      sourcePo: 'PO-2048',
      receipt_id: null,
      ownership_status: 'In Transit',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-08-25',
      timeline: [
        { date: '2026-08-27 17:40', title: 'Dispatched from Islamabad', desc: 'Dispatched to Peshawar under Transfer TR-221.', user: 'Islamabad Depot' }
      ]
    },
    {
      id: 'UNIT-107',
      unit_id: 'DS11-01005',
      serial: 'DS11-01005',
      chassisNumber: 'CH-90115',
      chassis: 'CH-90115',
      chassisNo: 'CH-90115',
      vin: 'VIN-PK-BRG-2026-01005',
      motorNumber: 'MTR-72V-1200-902',
      batteryNumber: 'BAT-7230-04471',
      product_id: 'PROD-003',
      product: 'BRG DS11',
      modelName: 'BRG DS11',
      sku: 'SKU-DS11-BLU',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      location: 'Transfer in Transit',
      landedCost: '163.4K',
      sellingPrice: 'PKR 240,000',
      status: 'In Transit',
      statusClass: 'bg-blue-50 text-blue-700',
      condition: 'Good',
      source: 'Transfer TR-221',
      sourcePo: 'PO-2048',
      receipt_id: null,
      ownership_status: 'In Transit',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-08-25',
      timeline: [
        { date: '2026-08-27 17:40', title: 'Dispatched from Islamabad', desc: 'Dispatched to Peshawar under Transfer TR-221.', user: 'Islamabad Depot' }
      ]
    },
    {
      id: 'UNIT-108',
      unit_id: 'DS11-01006',
      serial: 'DS11-01006',
      chassisNumber: 'CH-90116',
      chassis: 'CH-90116',
      chassisNo: 'CH-90116',
      vin: 'VIN-PK-BRG-2026-01006',
      motorNumber: 'MTR-72V-1200-903',
      batteryNumber: 'BAT-7230-04472',
      product_id: 'PROD-003',
      product: 'BRG DS11',
      modelName: 'BRG DS11',
      sku: 'SKU-DS11-BLU',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      location: 'Transfer in Transit',
      landedCost: '163.4K',
      sellingPrice: 'PKR 240,000',
      status: 'In Transit',
      statusClass: 'bg-blue-50 text-blue-700',
      condition: 'Good',
      source: 'Transfer TR-221',
      sourcePo: 'PO-2048',
      receipt_id: null,
      ownership_status: 'In Transit',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-08-25',
      timeline: [
        { date: '2026-08-27 17:40', title: 'Dispatched from Islamabad', desc: 'Dispatched to Peshawar under Transfer TR-221.', user: 'Islamabad Depot' }
      ]
    },
    {
      id: 'UNIT-109',
      unit_id: 'DS11-01007',
      serial: 'DS11-01007',
      chassisNumber: 'CH-90117',
      chassis: 'CH-90117',
      chassisNo: 'CH-90117',
      vin: 'VIN-PK-BRG-2026-01007',
      motorNumber: 'MTR-72V-1200-904',
      batteryNumber: 'BAT-7230-04473',
      product_id: 'PROD-003',
      product: 'BRG DS11',
      modelName: 'BRG DS11',
      sku: 'SKU-DS11-BLU',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      location: 'Transfer in Transit',
      landedCost: '163.4K',
      sellingPrice: 'PKR 240,000',
      status: 'In Transit',
      statusClass: 'bg-blue-50 text-blue-700',
      condition: 'Good',
      source: 'Transfer TR-221',
      sourcePo: 'PO-2048',
      receipt_id: null,
      ownership_status: 'In Transit',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-08-25',
      timeline: [
        { date: '2026-08-27 17:40', title: 'Dispatched from Islamabad', desc: 'Dispatched to Peshawar under Transfer TR-221.', user: 'Islamabad Depot' }
      ]
    },
    {
      id: 'UNIT-110',
      unit_id: 'E125-00192',
      serial: 'E125-00192',
      chassisNumber: 'CH-88210',
      chassis: 'CH-88210',
      chassisNo: 'CH-88210',
      vin: 'VIN-PK-BRG-2026-00192',
      motorNumber: 'MTR-72V-1500-210',
      batteryNumber: 'BAT-7235-10210',
      product_id: 'PROD-001',
      product: 'BRG E-125',
      modelName: 'BRG E-125',
      sku: 'SKU-E125-RED',
      branch_id: 'BR-03',
      branch: 'Lahore',
      location: 'Showroom Floor',
      landedCost: '185.0K',
      sellingPrice: 'PKR 280,000',
      status: 'Available',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      condition: 'Good',
      source: 'Transfer TR-219',
      sourcePo: 'PO-1961',
      receipt_id: 'GR-882',
      ownership_status: 'Inventory',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-06-10',
      timeline: [
        { date: '2026-08-20 11:15', title: 'Dispatched from Peshawar', desc: 'Dispatched under Transfer TR-219.', user: 'Ahsan Khan' },
        { date: '2026-08-22 14:00', title: 'Received at Lahore', desc: 'Received & inspected at Lahore Showroom.', user: 'Ali Raza' }
      ]
    },
    {
      id: 'UNIT-111',
      unit_id: 'E125-00193',
      serial: 'E125-00193',
      chassisNumber: 'CH-88211',
      chassis: 'CH-88211',
      chassisNo: 'CH-88211',
      vin: 'VIN-PK-BRG-2026-00193',
      motorNumber: 'MTR-72V-1500-211',
      batteryNumber: 'BAT-7235-10211',
      product_id: 'PROD-001',
      product: 'BRG E-125',
      modelName: 'BRG E-125',
      sku: 'SKU-E125-RED',
      branch_id: 'BR-03',
      branch: 'Lahore',
      location: 'Showroom Floor',
      landedCost: '185.0K',
      sellingPrice: 'PKR 280,000',
      status: 'Available',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      condition: 'Good',
      source: 'Transfer TR-219',
      sourcePo: 'PO-1961',
      receipt_id: 'GR-882',
      ownership_status: 'Inventory',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-06-10',
      timeline: [
        { date: '2026-08-20 11:15', title: 'Dispatched from Peshawar', desc: 'Dispatched under Transfer TR-219.', user: 'Ahsan Khan' },
        { date: '2026-08-22 14:00', title: 'Received at Lahore', desc: 'Received & inspected at Lahore Showroom.', user: 'Ali Raza' }
      ]
    },
    {
      id: 'UNIT-112',
      unit_id: 'E9P-00872',
      serial: 'E9P-00872',
      chassisNumber: 'CH-00872',
      chassis: 'CH-00872',
      chassisNo: 'CH-00872',
      vin: 'VIN-PK-BRG-2026-00872',
      motorNumber: 'MTR-72V-2000-612',
      batteryNumber: 'BAT-7240-02210',
      product_id: 'PROD-004',
      product: 'BRG E9 Pro',
      modelName: 'BRG E9 Pro',
      sku: 'SKU-E9P-WHT',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      location: 'Showroom Floor',
      landedCost: '260.0K',
      sellingPrice: 'PKR 390,000',
      status: 'Available',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      condition: 'Brand New',
      source: 'PO-2022',
      sourcePo: 'PO-2022',
      receipt_id: 'GR-910',
      ownership_status: 'Inventory',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2029-02-15',
      timeline: [
        { date: '2026-08-15 11:00', title: 'Received at Islamabad', desc: 'Inwarded and prepped for showroom.', user: 'Bilal Shah' }
      ]
    },
    {
      id: 'UNIT-113',
      unit_id: 'CP-00321',
      serial: 'CP-00321',
      chassisNumber: 'CH-32101',
      chassis: 'CH-32101',
      chassisNo: 'CH-32101',
      vin: 'VIN-PK-BRG-2026-00321',
      motorNumber: 'MTR-60V-800-441',
      batteryNumber: 'BAT-6024-03310',
      product_id: 'PROD-005',
      product: 'BRG City Pro',
      modelName: 'BRG City Pro',
      sku: 'SKU-CP-GRY',
      branch_id: 'BR-03',
      branch: 'Lahore',
      location: 'Showroom Floor',
      landedCost: '165.0K',
      sellingPrice: 'PKR 220,000',
      status: 'Available',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      condition: 'Good',
      source: 'PO-1990',
      sourcePo: 'PO-1990',
      receipt_id: 'GR-850',
      ownership_status: 'Inventory',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-07-10',
      timeline: [
        { date: '2026-07-10 10:00', title: 'Received at Lahore', desc: 'Received under PO-1990.', user: 'Lahore Lead' }
      ]
    },
    {
      id: 'UNIT-114',
      unit_id: 'CP-00322',
      serial: 'CP-00322',
      chassisNumber: 'CH-32102',
      chassis: 'CH-32102',
      chassisNo: 'CH-32102',
      vin: 'VIN-PK-BRG-2026-00322',
      motorNumber: 'MTR-60V-800-442',
      batteryNumber: 'BAT-6024-03311',
      product_id: 'PROD-005',
      product: 'BRG City Pro',
      modelName: 'BRG City Pro',
      sku: 'SKU-CP-GRY',
      branch_id: 'BR-03',
      branch: 'Lahore',
      location: 'Showroom Floor',
      landedCost: '165.0K',
      sellingPrice: 'PKR 220,000',
      status: 'Available',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      condition: 'Good',
      source: 'PO-1990',
      sourcePo: 'PO-1990',
      receipt_id: 'GR-850',
      ownership_status: 'Inventory',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-07-10',
      timeline: [
        { date: '2026-07-10 10:00', title: 'Received at Lahore', desc: 'Received under PO-1990.', user: 'Lahore Lead' }
      ]
    },
    {
      id: 'UNIT-115',
      unit_id: 'CPRO-00101',
      serial: 'CPRO-00101',
      chassisNumber: 'CH-55101',
      chassis: 'CH-55101',
      chassisNo: 'CH-55101',
      vin: 'VIN-PK-BRG-2026-00101',
      motorNumber: 'MTR-72V-2500-101',
      batteryNumber: 'BAT-7260-01101',
      product_id: 'PROD-006',
      product: 'Cargo Pro EV',
      modelName: 'Cargo Pro EV',
      sku: 'SKU-CPRO-YEL',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      location: 'Warehouse Bay 3',
      landedCost: '350.0K',
      sellingPrice: 'PKR 450,000',
      status: 'Available',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      condition: 'Good',
      source: 'PO-2010',
      sourcePo: 'PO-2010',
      receipt_id: 'GR-890',
      ownership_status: 'Inventory',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-09-01',
      timeline: [
        { date: '2026-08-01 10:00', title: 'Received at Peshawar', desc: 'Cargo unit inwarded.', user: 'Peshawar Store' }
      ]
    },
    {
      id: 'UNIT-116',
      unit_id: 'X7-00911',
      serial: 'X7-00911',
      chassisNumber: 'CH-91101',
      chassis: 'CH-91101',
      chassisNo: 'CH-91101',
      vin: 'VIN-PK-BRG-2026-00911',
      motorNumber: 'MTR-72V-1500-911',
      batteryNumber: 'BAT-7235-09110',
      product_id: 'PROD-002',
      product: 'BRG X7',
      modelName: 'BRG X7',
      sku: 'SKU-X7-BLK',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      location: 'Showroom Floor',
      landedCost: '220.0K',
      sellingPrice: 'PKR 340,000',
      status: 'Available',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      condition: 'Good',
      source: 'PO-2015',
      sourcePo: 'PO-2015',
      receipt_id: 'GR-991',
      ownership_status: 'Inventory',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-08-30',
      timeline: [
        { date: '2026-08-20 14:32', title: 'Received at Peshawar', desc: 'Inwarded via GR-991.', user: 'Store Officer' }
      ]
    },
    {
      id: 'UNIT-117',
      unit_id: 'X7-00912',
      serial: 'X7-00912',
      chassisNumber: 'CH-91102',
      chassis: 'CH-91102',
      chassisNo: 'CH-91102',
      vin: 'VIN-PK-BRG-2026-00912',
      motorNumber: 'MTR-72V-1500-912',
      batteryNumber: 'BAT-7235-09111',
      product_id: 'PROD-002',
      product: 'BRG X7',
      modelName: 'BRG X7',
      sku: 'SKU-X7-BLK',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      location: 'Showroom Floor',
      landedCost: '220.0K',
      sellingPrice: 'PKR 340,000',
      status: 'Available',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      condition: 'Good',
      source: 'PO-2015',
      sourcePo: 'PO-2015',
      receipt_id: 'GR-991',
      ownership_status: 'Inventory',
      customer_id: null,
      customer: '—',
      warrantyExpiry: '2028-08-30',
      timeline: [
        { date: '2026-08-20 14:32', title: 'Received at Islamabad', desc: 'Inwarded via GR-991.', user: 'Store Officer' }
      ]
    },
    {
      id: 'UNIT-118',
      unit_id: 'DS11-00844',
      serial: 'DS11-00844',
      chassisNumber: 'CH-84401',
      chassis: 'CH-84401',
      chassisNo: 'CH-84401',
      vin: 'VIN-PK-BRG-2026-00844',
      motorNumber: 'MTR-72V-1200-844',
      batteryNumber: 'BAT-7230-03844',
      product_id: 'PROD-003',
      product: 'BRG DS11',
      modelName: 'BRG DS11',
      sku: 'SKU-DS11-BLU',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      location: 'Showroom Floor',
      landedCost: '145.8K',
      sellingPrice: 'PKR 240,000',
      status: 'Reserved',
      statusClass: 'bg-[#e0e7ff] text-[#3730a3]',
      condition: 'Good',
      source: 'PO-2015',
      sourcePo: 'PO-2015',
      receipt_id: 'GR-991',
      ownership_status: 'Reserved',
      customer_id: 'CUST-102',
      customer: 'Bilal Shah',
      warrantyExpiry: '2028-08-20',
      timeline: [
        { date: '2026-08-20 14:32', title: 'Goods Receipt', desc: 'Received via GR-991.', user: 'Store Officer' },
        { date: '2026-08-26 15:00', title: 'Customer Reservation', desc: 'Reserved for customer quotation QT-1882.', user: 'Peshawar Sales' }
      ]
    }
  ],

  // Serial duplicate detection across VIN, chassis, motor, and battery serials
  isSerialDuplicate(identifier, field = null, excludeUnitId = null) {
    if (!identifier) return false
    const target = String(identifier).trim().toLowerCase()
    if (!target || target === '—') return false
    
    return this.serializedUnits.some(u => {
      if (excludeUnitId && (u.id === excludeUnitId || u.unit_id === excludeUnitId || u.serial === excludeUnitId)) {
        return false
      }
      if (field) {
        let fieldList = [field]
        if (field === 'motorSerial' || field === 'motorNumber') fieldList = ['motorSerial', 'motorNumber']
        if (field === 'batterySerial' || field === 'batteryNumber') fieldList = ['batterySerial', 'batteryNumber']
        if (field === 'chassis' || field === 'chassisNo' || field === 'chassisNumber') fieldList = ['chassis', 'chassisNo', 'chassisNumber']
        if (field === 'vin') fieldList = ['vin', 'vinNumber']
        return fieldList.some(f => {
          const val = u[f] ? String(u[f]).trim().toLowerCase() : ''
          return val === target
        })
      }
      const checkFields = ['vin', 'chassisNumber', 'chassis', 'chassisNo', 'motorNumber', 'motorSerial', 'batteryNumber', 'batterySerial', 'serial', 'unit_id']
      return checkFields.some(f => {
        const val = u[f] ? String(u[f]).trim().toLowerCase() : ''
        return val && val !== '—' && val === target
      })
    })
  },

  // Status Lifecycle rules
  canTransitionUnitStatus(currentStatus, targetStatus) {
    if (!currentStatus || !targetStatus) return false
    if (currentStatus === targetStatus) return true

    const validTransitions = {
      'Available': ['Reserved', 'In Transit', 'QC Hold', 'Maintenance'],
      'Reserved': ['Available', 'Sold'],
      'In Transit': ['Available', 'QC Hold'],
      'QC Hold': ['Available', 'Maintenance'],
      'Maintenance': ['Available', 'QC Hold', 'Delivered'],
      'Sold': ['Delivered', 'Returned'],
      'Delivered': ['Maintenance', 'Returned'],
      'Returned': ['QC Hold', 'Maintenance', 'Available']
    }

    const allowed = validTransitions[currentStatus] || []
    return allowed.includes(targetStatus)
  },

  // Transition status with audit entry
  transitionUnitStatus(id, newStatus, reason = '', user = '') {
    const unit = this.getUnitById(id)
    if (!unit) throw new Error(`Unit ${id} not found.`)
    
    if (newStatus === 'Sold') {
      throw new Error('Direct status change to "Sold" is not permitted outside of the Sales module. Use completeUnitSale instead.')
    }
    
    if (!this.canTransitionUnitStatus(unit.status, newStatus)) {
      throw new Error(`Invalid status transition from "${unit.status}" to "${newStatus}".`)
    }

    const oldStatus = unit.status
    unit.status = newStatus
    unit.updated_at = new Date().toISOString()
    
    // Update status class
    const statusClasses = {
      'Available': 'bg-[#dcfce7] text-[#165A31]',
      'Reserved': 'bg-[#e0e7ff] text-[#3730a3]',
      'In Transit': 'bg-blue-50 text-blue-700',
      'QC Hold': 'bg-amber-50 text-amber-700',
      'Maintenance': 'bg-orange-50 text-orange-700',
      'Sold': 'bg-gray-100 text-gray-700',
      'Delivered': 'bg-[#165A31] text-white',
      'Returned': 'bg-purple-50 text-purple-700'
    }
    unit.statusClass = statusClasses[newStatus] || 'bg-gray-100 text-gray-700'

    if (!unit.timeline) unit.timeline = []
    unit.timeline.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: `Status Changed: ${newStatus}`,
      user: user || this.currentUser?.name || 'Branch Manager'
    })

    this.reconcileInventoryTotals()

    this.addAuditLog({
      action: 'Status Transition',
      event_type: 'UNIT_STATUS_TRANSITION',
      entity_type: 'serialized_unit',
      entity_id: unit.serial || unit.unit_id || id,
      module: 'Inventory',
      branch: unit.branch || this.getActiveBranch(),
      branch_id: unit.branch_id,
      description: `Unit ${unit.serial || unit.unit_id} transitioned from "${oldStatus}" to "${newStatus}". Reason: ${reason || 'Operational update'}.`,
      metadata: { oldStatus, newStatus, reason, actor: user || this.currentUser?.name }
    })

    return unit
  },

  reserveUnit(unitId, orderIdOrOptions = {}, custId) {
    const unit = this.getUnitById(unitId)
    if (!unit) throw new Error(`Unit ${unitId} not found.`)
    if (unit.status === 'Sold' || unit.status === 'Delivered' || unit.status === 'Maintenance') {
      throw new Error(`Unit ${unit.serial || unit.unit_id} cannot be reserved while in status '${unit.status}'.`)
    }

    let orderId, customerId, customerName, reason
    if (typeof orderIdOrOptions === 'object' && orderIdOrOptions !== null) {
      ({ orderId, customerId, customerName, reason = 'Reserved for sales order' } = orderIdOrOptions)
    } else {
      orderId = orderIdOrOptions
      customerId = custId
      reason = 'Reserved for sales order'
    }

    if (unit.status === 'Reserved' && unit.order_id && orderId && unit.order_id !== orderId) {
      throw new Error(`Unit ${unit.serial || unit.unit_id} is already reserved for order ${unit.order_id}.`)
    }
    if (unit.status === 'QC Hold') {
      throw new Error(`Unit ${unit.serial || unit.unit_id} is on QC Hold and cannot be reserved.`)
    }

    unit.status = 'Reserved'
    unit.statusClass = 'bg-[#e0e7ff] text-[#3730a3]'
    unit.ownership_status = 'Reserved'
    unit.order_id = orderId || unit.order_id
    unit.reserved_for_order = orderId || unit.order_id
    unit.customer_id = customerId || unit.customer_id
    unit.customer = customerName || unit.customer
    if (!unit.timeline) unit.timeline = []
    unit.timeline.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: 'Unit Reserved',
      desc: `${reason} for customer ${unit.customer} (${orderId || 'Order'}).`,
      user: this.currentUser?.name || 'Sales Officer'
    })
    this.reconcileInventoryTotals()
    unit.success = true

    this.addAuditLog({
      action: 'Reserved',
      event_type: 'UNIT_RESERVED',
      entity_type: 'serialized_unit',
      entity_id: unit.serial || unit.unit_id || unitId,
      module: 'Inventory',
      branch: unit.branch || this.getActiveBranch(),
      description: `Unit ${unit.serial || unit.unit_id} reserved for order ${unit.order_id || orderId} (Customer: ${unit.customer}).`,
      metadata: { orderId: unit.order_id, customerId: unit.customer_id, customerName: unit.customer, reason }
    })

    return unit
  },

  releaseUnitReservation(unitId, reason = 'Reservation released') {
    const unit = this.getUnitById(unitId)
    if (!unit) return null
    if (unit.status !== 'Reserved') return unit
    
    unit.status = 'Available'
    unit.statusClass = 'bg-[#dcfce7] text-[#165A31]'
    unit.ownership_status = 'Inventory'
    const prevOrder = unit.order_id
    unit.order_id = null
    unit.reserved_for_order = null
    unit.customer_id = null
    unit.customer = '—'
    if (!unit.timeline) unit.timeline = []
    unit.timeline.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: 'Reservation Released',
      desc: `${reason}. Released from ${prevOrder || 'order'}.`,
      user: this.currentUser?.name || 'Sales Officer'
    })
    this.reconcileInventoryTotals()

    this.addAuditLog({
      action: 'Reservation Released',
      event_type: 'UNIT_RESERVATION_RELEASED',
      entity_type: 'serialized_unit',
      entity_id: unit.serial || unit.unit_id || unitId,
      module: 'Inventory',
      branch: unit.branch || this.getActiveBranch(),
      description: `Reservation released for unit ${unit.serial || unit.unit_id}. Reason: ${reason}`,
      metadata: { releasedFromOrder: prevOrder, reason }
    })

    return unit
  },

  completeUnitSale(unitId, orderIdOrOptions = {}, custId, custName) {
    const unit = this.getUnitById(unitId)
    if (!unit) return { success: false, error: `Unit ${unitId} not found.` }
    if (unit.status === 'Sold' || unit.status === 'Delivered' || unit.status === 'Maintenance') {
      return { success: false, error: `Unit ${unit.serial || unit.unit_id} cannot be sold while in status '${unit.status}'.` }
    }
    if (unit.status === 'QC Hold') {
      return { success: false, error: `Unit ${unit.serial || unit.unit_id} is on QC Hold and cannot be sold.` }
    }

    let orderId, saleId, customerId, customerName
    if (typeof orderIdOrOptions === 'object' && orderIdOrOptions !== null) {
      ({ orderId, saleId, customerId, customerName } = orderIdOrOptions)
    } else {
      customerId = orderIdOrOptions
      orderId = custId
      customerName = custName
    }

    if (unit.status === 'Reserved' && unit.order_id && orderId && unit.order_id !== orderId) {
      return { success: false, error: `Unit ${unit.serial || unit.unit_id} is reserved for another order (${unit.order_id}).` }
    }

    unit.status = 'Sold'
    unit.statusClass = 'bg-gray-100 text-gray-700'
    unit.ownership_status = 'Sold / Pre-Delivery'
    unit.order_id = orderId || unit.order_id
    unit.customer_id = customerId || unit.customer_id
    unit.customer = customerName || unit.customer
    if (!unit.timeline) unit.timeline = []
    unit.timeline.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: 'Sale Completed',
      desc: `Sale completed for customer ${unit.customer} under order ${orderId || saleId || 'POS'}.`,
      user: this.currentUser?.name || 'Sales Officer'
    })
    this.reconcileInventoryTotals()
    unit.success = true

    this.addAuditLog({
      action: 'Sold',
      event_type: 'UNIT_SOLD',
      entity_type: 'serialized_unit',
      entity_id: unit.serial || unit.unit_id || unitId,
      module: 'Sales',
      branch: unit.branch || this.getActiveBranch(),
      description: `Unit ${unit.serial || unit.unit_id} marked as Sold to ${unit.customer} (Order: ${unit.order_id}).`,
      metadata: { orderId: unit.order_id, customer: unit.customer }
    })

    return { success: true, unit }
  },

  completeSale(unitId, orderIdOrOptions, custId, custName) {
    return this.completeUnitSale(unitId, orderIdOrOptions, custId, custName)
  },

  addSerializedUnit(newUnit) {
    // Validate uniqueness of identifiers
    const chassis = newUnit.chassisNumber || newUnit.chassis || newUnit.chassisNo || ''
    const vin = newUnit.vin || ''
    const motor = newUnit.motorNumber || ''
    const battery = newUnit.batteryNumber || ''

    if (chassis && this.isSerialDuplicate(chassis)) {
      throw new Error(`Chassis number ${chassis} already exists in inventory.`)
    }
    if (vin && this.isSerialDuplicate(vin)) {
      throw new Error(`VIN ${vin} already exists in inventory.`)
    }
    if (motor && this.isSerialDuplicate(motor)) {
      throw new Error(`Motor serial ${motor} already exists in inventory.`)
    }
    if (battery && this.isSerialDuplicate(battery)) {
      throw new Error(`Battery serial ${battery} already exists in inventory.`)
    }

    const id = newUnit.id || `UNIT-${Math.floor(100 + Math.random() * 900)}`
    const unit_id = newUnit.unit_id || newUnit.serial || chassis || id
    const unitObj = {
      ...newUnit,
      id,
      unit_id,
      serial: newUnit.serial || unit_id,
      chassisNumber: chassis || unit_id,
      chassis: chassis || unit_id,
      chassisNo: chassis || unit_id,
      vin: vin || chassis || unit_id,
      motorNumber: motor || '—',
      batteryNumber: battery || '—',
      status: newUnit.status || 'Available',
      statusClass: newUnit.statusClass || (newUnit.status === 'QC Hold' ? 'bg-amber-50 text-amber-700' : 'bg-[#dcfce7] text-[#165A31]'),
      location: newUnit.location || (newUnit.status === 'QC Hold' ? 'QC Inspection Bay' : 'Showroom Floor'),
      condition: newUnit.condition || 'Good',
      timeline: newUnit.timeline || [
        { date: new Date().toISOString().replace('T', ' ').slice(0, 16), title: 'Unit Created', desc: 'Unit registered in inventory.', user: this.currentUser?.name || 'System' }
      ]
    }
    this.serializedUnits.unshift(unitObj)
    this.reconcileInventoryTotals()

    this.addAuditLog({
      action: 'Created',
      event_type: 'UNIT_REGISTERED',
      entity_type: 'serialized_unit',
      entity_id: unitObj.serial || unitObj.unit_id || unitObj.id,
      module: 'Inventory',
      branch: unitObj.branch || this.getActiveBranch(),
      description: `Serialized unit ${unitObj.serial || unitObj.unit_id} (${unitObj.product || 'Vehicle'}) registered in inventory.`,
      metadata: { vin: unitObj.vin, chassis: unitObj.chassis, motor: unitObj.motorNumber, battery: unitObj.batteryNumber, status: unitObj.status }
    })

    return unitObj
  },

  updateSerializedUnit(id, updatedData) {
    const index = this.serializedUnits.findIndex(u => 
      u.id === id || u.unit_id === id || u.serial === id || u.chassisNumber === id || u.chassis === id || u.chassisNo === id
    )
    if (index !== -1) {
      // Disallow manual Sold update
      if (updatedData.status === 'Sold' && this.serializedUnits[index].status !== 'Sold') {
        throw new Error('Direct status update to "Sold" is blocked outside of Sales.')
      }

      this.serializedUnits[index] = { ...this.serializedUnits[index], ...updatedData }
      this.reconcileInventoryTotals()
      return this.serializedUnits[index]
    }
    return null
  },

  getUnitById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.serializedUnits.find(u => 
      (u.id && u.id.toLowerCase() === target) ||
      (u.unit_id && u.unit_id.toLowerCase() === target) ||
      (u.serial && u.serial.toLowerCase() === target) ||
      (u.chassisNumber && u.chassisNumber.toLowerCase() === target) ||
      (u.chassis && u.chassis.toLowerCase() === target) ||
      (u.chassisNo && u.chassisNo.toLowerCase() === target) ||
      (u.vin && u.vin.toLowerCase() === target)
    ) || null
  },

  // Dynamic inventory reconciliation method
  reconcileInventoryTotals() {
    this.products.forEach(prod => {
      // Check if product is serialized vehicle
      const isVehicle = prod.isSerialized !== false && prod.categoryId !== 'CAT-04' && prod.categoryId !== 'CAT-05'
      if (isVehicle) {
        const matchingUnits = this.serializedUnits.filter(u => 
          (u.product_id && u.product_id === prod.id) ||
          (u.product && u.product.toLowerCase() === (prod.name || '').toLowerCase()) ||
          (u.modelName && u.modelName.toLowerCase() === (prod.modelName || '').toLowerCase())
        )
        const nonSoldUnits = matchingUnits.filter(u => u.status !== 'Sold')
        
        prod.total = nonSoldUnits.length
        prod.available = nonSoldUnits.filter(u => u.status === 'Available').length
        prod.reserved = nonSoldUnits.filter(u => u.status === 'Reserved').length
        prod.inTransit = nonSoldUnits.filter(u => u.status === 'In Transit').length
        prod.qcHold = nonSoldUnits.filter(u => u.status === 'QC Hold').length
        
        prod.peshawar = nonSoldUnits.filter(u => (u.branch || '').toLowerCase() === 'peshawar').length
        prod.islamabad = nonSoldUnits.filter(u => (u.branch || '').toLowerCase() === 'islamabad').length
        prod.lahore = nonSoldUnits.filter(u => (u.branch || '').toLowerCase() === 'lahore').length
        prod.rawalpindi = nonSoldUnits.filter(u => (u.branch || '').toLowerCase() === 'rawalpindi').length
        
        prod.stock = `${prod.total} units`
        if (prod.total === 0) {
          prod.status = 'Out of Stock'
          prod.statusClass = 'bg-red-50 text-red-700'
        } else if (prod.available < (prod.reorderLevel || 4)) {
          prod.status = 'Low Stock'
          prod.statusClass = 'bg-[#fef3c7] text-[#b45309]'
        } else {
          prod.status = 'Active'
          prod.statusClass = 'bg-[#dcfce7] text-[#165A31]'
        }
      } else {
        // Bulk parts / batteries
        const bPeshawar = prod.peshawar ?? 23
        const bIslamabad = prod.islamabad ?? 8
        const bLahore = prod.lahore ?? 8
        const bRawalpindi = prod.rawalpindi ?? 4
        const inTransit = prod.inTransit ?? 0
        const total = bPeshawar + bIslamabad + bLahore + bRawalpindi + inTransit
        
        prod.total = total
        prod.available = Math.max(0, total - (prod.reserved || 0) - (prod.qcHold || 0))
        prod.stock = `${total} units`
      }
    })
  },

  // Global & Branch inventory KPI stats helper
  getInventoryStats(branchName = null) {
    const effectiveBranch = branchName && branchName !== 'All Branches' ? branchName.toLowerCase() : null
    
    const units = this.serializedUnits.filter(u => {
      if (!effectiveBranch) return true
      return (u.branch || '').toLowerCase() === effectiveBranch
    })

    const totalUnits = units.filter(u => u.status !== 'Sold').length
    const available = units.filter(u => u.status === 'Available').length
    const reserved = units.filter(u => u.status === 'Reserved').length
    const inTransit = units.filter(u => u.status === 'In Transit').length
    const qcHold = units.filter(u => u.status === 'QC Hold').length
    const maintenance = units.filter(u => u.status === 'Maintenance' || u.status === 'In Service').length
    const sold = units.filter(u => u.status === 'Sold').length
    const returned = units.filter(u => u.status === 'Returned').length

    return {
      total: totalUnits,
      totalUnits,
      serialized: totalUnits,
      available,
      reserved,
      inTransit,
      qcHold,
      maintenance,
      sold,
      returned
    }
  },

  // ==========================================
  // 4. CANONICAL BRANCH MASTER
  // ==========================================
  branches: [
    {
      id: 'BR-01',
      branch_id: 'BR-01',
      name: 'Peshawar',
      code: 'PEW',
      city: 'Peshawar',
      address: 'Main University Road, Phase 3, Peshawar',
      phone: '+92 91 5849921',
      manager_id: 'USR-01',
      manager: 'Ahsan Khan',
      staffCount: 14,
      unitsCount: 61,
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]'
    },
    {
      id: 'BR-02',
      branch_id: 'BR-02',
      name: 'Islamabad',
      code: 'ISB',
      city: 'Islamabad',
      address: 'Plot 18, Blue Area, Sector F-6, Islamabad',
      phone: '+92 51 2891044',
      manager_id: 'USR-02',
      manager: 'Hassan Ali',
      staffCount: 18,
      unitsCount: 78,
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]'
    },
    {
      id: 'BR-03',
      branch_id: 'BR-03',
      name: 'Lahore',
      code: 'LHR',
      city: 'Lahore',
      address: 'Main Boulevard, Gulberg III, Lahore',
      phone: '+92 42 3577881',
      manager_id: 'USR-03',
      manager: 'Hamza Ali',
      staffCount: 22,
      unitsCount: 94,
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]'
    },
    {
      id: 'BR-04',
      branch_id: 'BR-04',
      name: 'Rawalpindi',
      code: 'RWP',
      city: 'Rawalpindi',
      address: 'Mall Road, Saddar, Rawalpindi',
      phone: '+92 51 5566778',
      manager_id: 'USR-04',
      manager: 'Bilal Ahmad',
      staffCount: 12,
      unitsCount: 45,
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]'
    }
  ],

  addBranch(newBranch) {
    const id = newBranch.id || newBranch.branch_id || `BR-${String(this.branches.length + 1).padStart(2, '0')}`
    const branchObj = {
      ...newBranch,
      id,
      branch_id: id,
      status: newBranch.status || 'Active',
      statusClass: newBranch.statusClass || 'bg-[#dcfce7] text-[#165A31]'
    }
    this.branches.push(branchObj)

    this.addAuditLog({
      action: 'Created',
      event_type: 'BRANCH_CREATED',
      entity_type: 'branch',
      entity_id: branchObj.id,
      module: 'Organisation',
      branch: branchObj.name,
      branch_id: branchObj.id,
      description: `Branch ${branchObj.name} (${branchObj.id}) registered in organisation master.`,
      metadata: { name: branchObj.name, city: branchObj.city, manager: branchObj.manager }
    })

    return branchObj
  },

  updateBranch(id, updatedData) {
    const index = this.branches.findIndex(b => b.id === id || b.branch_id === id || b.name === id)
    if (index !== -1) {
      const oldBranch = this.branches[index]
      const oldStatus = oldBranch.status

      this.branches[index] = { ...this.branches[index], ...updatedData }

      let action = 'Updated'
      let eventType = 'BRANCH_UPDATED'
      let description = `Branch configuration for ${this.branches[index].name} (${this.branches[index].id}) updated.`

      if (updatedData.status && updatedData.status !== oldStatus) {
        action = updatedData.status === 'Active' ? 'Activated' : 'Deactivated'
        eventType = updatedData.status === 'Active' ? 'BRANCH_ACTIVATED' : 'BRANCH_DEACTIVATED'
        description = `Branch ${this.branches[index].name} (${this.branches[index].id}) ${action.toLowerCase()}.`
      }

      this.addAuditLog({
        action,
        event_type: eventType,
        entity_type: 'branch',
        entity_id: this.branches[index].id,
        module: 'Organisation',
        branch: this.branches[index].name,
        branch_id: this.branches[index].id,
        description,
        metadata: { 
          updatedFields: Object.keys(updatedData),
          previous_status: oldStatus,
          new_status: updatedData.status || oldStatus
        }
      })

      return this.branches[index]
    }
    return null
  },

  getBranchById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.branches.find(b => 
      (b.id && b.id.toLowerCase() === target) ||
      (b.branch_id && b.branch_id.toLowerCase() === target) ||
      (b.name && b.name.toLowerCase() === target) ||
      (b.code && b.code.toLowerCase() === target)
    ) || null
  },

  // ==========================================
  // 5. CANONICAL USER / STAFF / TECHNICIAN MASTER
  // ==========================================
  users: [
    {
      id: 'USR-01',
      user_id: 'USR-01',
      name: 'Ahsan Khan',
      email: 'ahsan@ajecodrive.com',
      mobile: '+92 300 555 0191',
      role: 'Branch Manager',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      isTechnician: false,
      mfa: 'On',
      lastLogin: 'Today 22:01',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      invitation: 'Accepted',
      sessionPolicy: 'Standard'
    },
    {
      id: 'USR-02',
      user_id: 'USR-02',
      name: 'Hassan Ali',
      email: 'hassan@ajecodrive.com',
      mobile: '+92 321 555 0142',
      role: 'Branch Manager',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      isTechnician: false,
      mfa: 'On',
      lastLogin: 'Today 21:40',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      invitation: 'Accepted',
      sessionPolicy: 'Standard'
    },
    {
      id: 'USR-03',
      user_id: 'USR-03',
      name: 'Hamza Ali',
      email: 'hamza@ajecodrive.com',
      mobile: '+92 333 555 0177',
      role: 'Sales Executive',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      isTechnician: false,
      mfa: 'Off',
      lastLogin: 'Today 19:15',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      invitation: 'Accepted',
      sessionPolicy: 'Standard'
    },
    {
      id: 'USR-04',
      user_id: 'USR-04',
      name: 'Bilal Ahmad',
      email: 'bilal@ajecodrive.com',
      mobile: '+92 345 555 0188',
      role: 'Branch Manager',
      branch_id: 'BR-04',
      branch: 'Rawalpindi',
      isTechnician: false,
      mfa: 'On',
      lastLogin: 'Yesterday 17:30',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      invitation: 'Accepted',
      sessionPolicy: 'Standard'
    },
    {
      id: 'USR-05',
      user_id: 'USR-05',
      name: 'Tariq Mehmood',
      email: 'tariq.tech@ajecodrive.com',
      mobile: '+92 300 8899112',
      role: 'Senior Technician',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      isTechnician: true,
      mfa: 'Off',
      lastLogin: 'Today 08:30',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      invitation: 'Accepted',
      sessionPolicy: 'Standard'
    },
    {
      id: 'USR-06',
      user_id: 'USR-06',
      name: 'Imran Shah',
      email: 'imran.tech@ajecodrive.com',
      mobile: '+92 312 7766554',
      role: 'EV Technician',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      isTechnician: true,
      mfa: 'Off',
      lastLogin: 'Today 09:10',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      invitation: 'Accepted',
      sessionPolicy: 'Standard'
    },
    {
      id: 'USR-07',
      user_id: 'USR-07',
      name: 'Usman Ghani',
      email: 'usman.lead@ajecodrive.com',
      mobile: '+92 334 1122334',
      role: 'Workshop Supervisor',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      isTechnician: true,
      mfa: 'On',
      lastLogin: 'Today 08:00',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      invitation: 'Accepted',
      sessionPolicy: 'Standard'
    },
    {
      id: 'USR-08',
      user_id: 'USR-08',
      name: 'Ali Raza',
      email: 'ali.admin@ajecodrive.com',
      mobile: '+92 300 0000001',
      role: 'Super Admin',
      branch_id: 'BR-01',
      branch: 'Head Office',
      isTechnician: false,
      mfa: 'On',
      lastLogin: 'Now',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      invitation: 'Accepted',
      sessionPolicy: 'Strict'
    }
  ],

  createUser(newUser) {
    return this.addUser(newUser)
  },

  addUser(newUser) {
    const id = newUser.id || newUser.user_id || `USR-${String(this.users.length + 1).padStart(2, '0')}`
    const isTech = newUser.isTechnician || (newUser.role && (
      newUser.role.toLowerCase().includes('technician') || 
      newUser.role.toLowerCase().includes('supervisor') ||
      newUser.role.toLowerCase().includes('service')
    ))
    const userObj = {
      ...newUser,
      id,
      user_id: id,
      isTechnician: !!isTech,
      status: newUser.status || 'Active',
      statusClass: newUser.statusClass || 'bg-[#dcfce7] text-[#165A31]',
      lastLogin: newUser.lastLogin || 'Just now'
    }
    this.users.unshift(userObj)

    this.addAuditLog({
      action: 'Created',
      event_type: 'USER_CREATED',
      entity_type: 'user',
      entity_id: userObj.id,
      module: 'Organisation',
      branch: userObj.branch || 'Head Office',
      target_user_id: userObj.id,
      description: `User account created for ${userObj.name} (${userObj.role || 'Staff'}).`,
      metadata: { name: userObj.name, email: userObj.email, role: userObj.role, branch: userObj.branch }
    })

    return userObj
  },

  updateUser(id, updatedData) {
    const index = this.users.findIndex(u => u.id === id || u.user_id === id || u.email === id)
    if (index !== -1) {
      const oldUser = this.users[index]
      const oldRole = oldUser.role
      const oldBranch = oldUser.branch
      const oldStatus = oldUser.status

      this.users[index] = { ...this.users[index], ...updatedData }

      const safeData = { ...updatedData }
      delete safeData.password
      delete safeData.token

      let action = 'Updated'
      let eventType = 'USER_UPDATED'
      let description = `User ${this.users[index].name} profile updated.`

      if (updatedData.role && updatedData.role !== oldRole) {
        action = 'Role Changed'
        eventType = 'USER_ROLE_CHANGED'
        description = `User ${this.users[index].name} role changed from ${oldRole} to ${updatedData.role}.`
      } else if (updatedData.status && updatedData.status !== oldStatus) {
        action = updatedData.status === 'Active' ? 'Activated' : 'Deactivated'
        eventType = updatedData.status === 'Active' ? 'USER_ACTIVATED' : 'USER_DEACTIVATED'
        description = `User ${this.users[index].name} status changed from ${oldStatus} to ${updatedData.status}.`
      } else if (updatedData.branch && updatedData.branch !== oldBranch) {
        action = 'Branch Assignment'
        eventType = 'USER_BRANCH_CHANGED'
        description = `User ${this.users[index].name} assigned to branch ${updatedData.branch}.`
      }

      this.addAuditLog({
        action,
        event_type: eventType,
        entity_type: 'user',
        entity_id: this.users[index].id,
        module: 'Organisation',
        branch: this.users[index].branch || 'Head Office',
        actor_user_id: this.currentUser?.id || 'USR-01',
        target_user_id: this.users[index].id,
        description,
        metadata: { 
          updatedFields: Object.keys(safeData),
          old_role: oldRole,
          new_role: updatedData.role || oldRole,
          old_branch: oldBranch,
          new_branch: updatedData.branch || oldBranch,
          previous_status: oldStatus,
          new_status: updatedData.status || oldStatus
        }
      })

      return this.users[index]
    }
    return null
  },

  getUserById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.users.find(u => 
      (u.id && u.id.toLowerCase() === target) ||
      (u.user_id && u.user_id.toLowerCase() === target) ||
      (u.name && u.name.toLowerCase() === target) ||
      (u.email && u.email.toLowerCase() === target)
    ) || null
  },

  getTechnicians(branch = null) {
    return this.users.filter(u => {
      const matchRole = u.isTechnician || (u.role && (
        u.role.toLowerCase().includes('technician') || 
        u.role.toLowerCase().includes('supervisor') || 
        u.role.toLowerCase().includes('service')
      ))
      if (!matchRole) return false
      if (!branch || branch === 'All Branches' || branch === 'All') return true
      return u.branch && u.branch.toLowerCase() === branch.toLowerCase()
    })
  },

  createRole(newRole) {
    this.addAuditLog({
      action: 'Created',
      event_type: 'ROLE_CREATED',
      entity_type: 'role',
      entity_id: newRole.name || 'ROLE-NEW',
      module: 'Organisation',
      description: `Role ${newRole.name} created with scope "${newRole.scope || 'Assigned Branch'}".`,
      metadata: { name: newRole.name, scope: newRole.scope, status: newRole.status || 'Active' }
    })
    return newRole
  },

  updateRolePermissions(roleName, permissions, notes = '') {
    this.addAuditLog({
      action: 'Configured',
      event_type: 'ROLE_PERMISSIONS_UPDATED',
      entity_type: 'role',
      entity_id: roleName,
      module: 'Organisation',
      description: `Role permissions updated for "${roleName}".`,
      metadata: { 
        role: roleName, 
        modulesConfigured: permissions ? permissions.map(p => p.module) : [], 
        notes 
      }
    })
  },

  // ==========================================
  // 6. CANONICAL SUPPLIER MASTER
  // ==========================================
  suppliers: [
    {
      id: 'SUP-01',
      supplier_id: 'SUP-01',
      name: 'BRG Factory',
      contact: 'Li Wei',
      email: 'sales@brgfactory.cn',
      phone: '+86 21 8839 0112',
      products: '48',
      openPos: '5',
      purchases: '38.4M',
      payable: '4.2M',
      onTime: '92%',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]'
    },
    {
      id: 'SUP-02',
      supplier_id: 'SUP-02',
      name: 'Pak Logistics',
      contact: 'Usman Shah',
      email: 'contact@paklogistics.pk',
      phone: '+92 51 4455667',
      products: '—',
      openPos: '2',
      purchases: '3.8M',
      payable: '0.7M',
      onTime: '88%',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]'
    },
    {
      id: 'SUP-03',
      supplier_id: 'SUP-03',
      name: 'PowerCell Co.',
      contact: 'Zhang Min',
      email: 'orders@powercell.com',
      phone: '+86 755 2233 4455',
      products: '14',
      openPos: '3',
      purchases: '12.6M',
      payable: '1.2M',
      onTime: '95%',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]'
    },
    {
      id: 'SUP-04',
      supplier_id: 'SUP-04',
      name: 'VoltTech Ltd',
      contact: 'Asad Malik',
      email: 'support@volttech.pk',
      phone: '+92 42 3778899',
      products: '8',
      openPos: '1',
      purchases: '4.5M',
      payable: '0.4M',
      onTime: '90%',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]'
    }
  ],

  addSupplier(newSupplier) {
    const id = newSupplier.id || newSupplier.supplier_id || `SUP-${String(this.suppliers.length + 1).padStart(2, '0')}`
    const supplierObj = {
      ...newSupplier,
      id,
      supplier_id: id,
      status: newSupplier.status || 'Active',
      statusClass: newSupplier.statusClass || 'bg-[#dcfce7] text-[#165A31]'
    }
    this.suppliers.unshift(supplierObj)
    return supplierObj
  },

  updateSupplier(id, updatedData) {
    const index = this.suppliers.findIndex(s => s.id === id || s.supplier_id === id || s.name === id)
    if (index !== -1) {
      this.suppliers[index] = { ...this.suppliers[index], ...updatedData }
      return this.suppliers[index]
    }
    return null
  },

  getSupplierById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.suppliers.find(s => 
      (s.id && s.id.toLowerCase() === target) ||
      (s.supplier_id && s.supplier_id.toLowerCase() === target) ||
      (s.name && s.name.toLowerCase() === target)
    ) || null
  },

  // ==========================================
  // 7. CANONICAL SALES ORDERS & QUOTATIONS
  // ==========================================
  orders: [
    {
      id: 'ORD-2241',
      order: 'ORD-2241',
      order_id: 'ORD-2241',
      orderNo: 'ORD-2241',
      quotation_id: 'QT-1882',
      customer_id: 'CUST-101',
      customer: 'Ahsan Khan',
      product_id: 'PROD-001',
      product: 'BRG E-125',
      unit_id: 'CH 8-BRG-26-01731',
      unit: 'CH 8-BRG-26-01731',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      total: 'PKR 280,000',
      rawTotal: 280000,
      paid: 'PKR 280,000',
      rawPaid: 280000,
      balance: 'PKR 0',
      status: 'Ready',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      createdAt: '2026-08-27'
    },
    {
      id: 'ORD-2238',
      order: 'ORD-2238',
      order_id: 'ORD-2238',
      orderNo: 'ORD-2238',
      quotation_id: 'QT-1879',
      customer_id: 'CUST-102',
      customer: 'Bilal Shah',
      product_id: 'PROD-002',
      product: 'BRG X7',
      unit_id: 'X7-CH-00455',
      unit: 'X7-CH-00455',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      total: 'PKR 340,000',
      rawTotal: 340000,
      paid: 'PKR 125,000',
      rawPaid: 125000,
      balance: 'PKR 215,000',
      status: 'Processing',
      statusClass: 'bg-[#eff6ff] text-[#2563eb]',
      createdAt: '2026-08-26'
    },
    {
      id: 'ORD-2235',
      order: 'ORD-2235',
      order_id: 'ORD-2235',
      orderNo: 'ORD-2235',
      customer_id: 'CUST-103',
      customer: 'Faisal Khan',
      product_id: 'PROD-003',
      product: 'BRG DS11',
      unit_id: 'DS11-01001',
      unit: 'DS11-01001',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      total: 'PKR 240,000',
      rawTotal: 240000,
      paid: 'PKR 240,000',
      rawPaid: 240000,
      balance: 'PKR 0',
      status: 'Delivered',
      statusClass: 'bg-gray-100 text-gray-700',
      createdAt: '2026-08-25'
    }
  ],

  addOrder(newOrder) {
    const id = newOrder.id || newOrder.order_id || newOrder.order || this.generateDocumentId('order')
    const orderObj = {
      ...newOrder,
      id,
      order: id,
      order_id: id,
      orderNo: id,
      status: newOrder.status || 'Ready',
      statusClass: newOrder.statusClass || 'bg-[#dcfce7] text-[#165A31]',
      createdAt: newOrder.createdAt || new Date().toISOString().split('T')[0]
    }
    this.orders.unshift(orderObj)

    // Automatically synchronize customer profile metrics
    if (orderObj.customer_id || orderObj.customer) {
      const cust = this.getCustomerById(orderObj.customer_id || orderObj.customer)
      if (cust) {
        cust.orders = (cust.orders || 0) + 1
        cust.ordersCount = (cust.ordersCount || 0) + 1
        const orderAmt = parseFloat(String(orderObj.total || orderObj.grand_total || orderObj.amount || '0').replace(/[^0-9.]/g, '')) || 0
        const currentPurchases = parseFloat(String(cust.totalPurchases || cust.ltv || '0').replace(/[^0-9.]/g, '')) || 0
        const newPurchases = currentPurchases + orderAmt
        cust.totalPurchases = `PKR ${newPurchases.toLocaleString()}`
        cust.ltv = `${Math.round(newPurchases / 1000)}K`
        if (orderObj.balance) {
          const balAmt = parseFloat(String(orderObj.balance || '0').replace(/[^0-9.]/g, '')) || 0
          const currentBal = parseFloat(String(cust.balance || cust.outstanding || '0').replace(/[^0-9.]/g, '')) || 0
          const newBal = currentBal + balAmt
          cust.balance = String(newBal)
          cust.outstanding = `PKR ${newBal.toLocaleString()}`
        }
      }
    }

    this.addNotification({
      title: 'Sales Order Confirmed',
      message: `Sales Order ${id} confirmed for ${orderObj.customer || 'Customer'} (${orderObj.grand_total || orderObj.amount || orderObj.total || 'PKR 0'}).`,
      type: 'success',
      priority: 'High',
      category: 'Sales',
      source_type: 'sales_order',
      source_id: id,
      event_type: 'CONFIRMED',
      recipient_role: 'Branch Manager',
      branch: orderObj.branch || 'Peshawar',
      link: `/sales/orders/detail?id=${id}`
    })

    this.addAuditLog({
      action: 'Created',
      event_type: 'ORDER_CONFIRMED',
      entity_type: 'sales_order',
      entity_id: id,
      module: 'Sales',
      branch: orderObj.branch || 'Peshawar',
      description: `Sales Order ${id} created for ${orderObj.customer || 'Customer'} (${orderObj.total || orderObj.grand_total || 'PKR 0'}).`,
      metadata: { customer: orderObj.customer, total: orderObj.total || orderObj.grand_total, unit: orderObj.unit, status: orderObj.status }
    })

    return orderObj
  },

  updateOrder(id, updatedData) {
    const index = this.orders.findIndex(o => o.id === id || o.order_id === id || o.order === id)
    if (index !== -1) {
      this.orders[index] = { ...this.orders[index], ...updatedData }

      this.addAuditLog({
        action: 'Updated',
        event_type: 'ORDER_UPDATED',
        entity_type: 'sales_order',
        entity_id: this.orders[index].id,
        module: 'Sales',
        branch: this.orders[index].branch || 'Peshawar',
        description: `Sales Order ${this.orders[index].id} updated.`,
        metadata: { updatedFields: Object.keys(updatedData) }
      })

      return this.orders[index]
    }
    return null
  },

  getOrderById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.orders.find(o => 
      (o.id && o.id.toLowerCase() === target) || 
      (o.order_id && o.order_id.toLowerCase() === target) ||
      (o.order && o.order.toLowerCase() === target) ||
      (o.orderNo && o.orderNo.toLowerCase() === target)
    ) || null
  },

  quotations: [
    {
      id: 'QT-1882',
      quote: 'QT-1882',
      quote_id: 'QT-1882',
      customer_id: 'CUST-101',
      customer: 'Ahsan Khan',
      product_id: 'PROD-001',
      product: 'BRG E-125',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      availability: '3 available / 1 reserved',
      quantity: '1 unit',
      sellingPrice: 'PKR 280,000',
      total: 'PKR 280,000',
      value: 'PKR 280,000',
      discount: 'PKR 0',
      status: 'Accepted',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      sales_order_id: 'ORD-2241',
      validTill: '05 Sep 2026',
      date: 'Today'
    },
    {
      id: 'QT-1879',
      quote: 'QT-1879',
      quote_id: 'QT-1879',
      customer_id: 'CUST-102',
      customer: 'Bilal Shah',
      product_id: 'PROD-002',
      product: 'BRG X7',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      availability: '2 available',
      quantity: '1 unit',
      sellingPrice: 'PKR 340,000',
      total: 'PKR 330,000',
      value: 'PKR 330,000',
      discount: 'PKR 10,000',
      status: 'Accepted',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      sales_order_id: 'ORD-2238',
      validTill: '02 Sep 2026',
      date: 'Yesterday'
    }
  ],

  createQuotation(newQuote) {
    return this.addQuotation(newQuote)
  },

  addQuotation(newQuote) {
    const id = newQuote.id || newQuote.quote_id || newQuote.quote || this.generateDocumentId('quotation')
    const rawSelling = parseFloat(String(newQuote.sellingPrice || newQuote.total || newQuote.value || '0').replace(/[^0-9.]/g, '')) || 0
    const rawDiscount = parseFloat(String(newQuote.discount || '0').replace(/[^0-9.]/g, '')) || 0
    const finalTotal = Math.max(0, rawSelling - rawDiscount)
    const quoteObj = {
      ...newQuote,
      id,
      quote: id,
      quote_id: id,
      total: newQuote.total || `PKR ${finalTotal.toLocaleString()}`,
      value: newQuote.value || `PKR ${finalTotal.toLocaleString()}`,
      status: newQuote.status || 'Draft',
      statusClass: newQuote.statusClass || 'bg-[#eff6ff] text-[#2563eb]',
      date: newQuote.date || 'Today'
    }
    this.quotations.unshift(quoteObj)

    this.addNotification({
      title: 'New Quotation Generated',
      message: `Quotation ${id} generated for ${quoteObj.customer || 'Customer'} (${quoteObj.total || quoteObj.value}).`,
      type: 'info',
      priority: 'Normal',
      category: 'Sales',
      source_type: 'quotation',
      source_id: id,
      event_type: 'CREATED',
      recipient_role: 'Branch Manager',
      branch: quoteObj.branch || 'Peshawar',
      link: `/sales/quotations/detail?id=${id}`
    })

    this.addAuditLog({
      action: 'Created',
      event_type: 'QUOTATION_CREATED',
      entity_type: 'quotation',
      entity_id: id,
      module: 'Sales',
      branch: quoteObj.branch || 'Peshawar',
      description: `Quotation ${id} generated for ${quoteObj.customer || 'Customer'} (${quoteObj.total || quoteObj.value}).`,
      metadata: { customer: quoteObj.customer, product: quoteObj.product, total: quoteObj.total || quoteObj.value }
    })

    return quoteObj
  },

  updateQuotation(id, updatedData) {
    const index = this.quotations.findIndex(q => q.id === id || q.quote_id === id || q.quote === id)
    if (index !== -1) {
      this.quotations[index] = { ...this.quotations[index], ...updatedData }
      return this.quotations[index]
    }
    return null
  },

  getQuotationById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.quotations.find(q => 
      (q.id && q.id.toLowerCase() === target) ||
      (q.quote_id && q.quote_id.toLowerCase() === target) ||
      (q.quote && q.quote.toLowerCase() === target)
    ) || null
  },

  convertQuotationToOrder(quotationId, { unitId = null, assignedSalesperson = 'Hamza Ali' } = {}) {
    const quote = this.getQuotationById(quotationId)
    if (!quote) throw new Error(`Quotation ${quotationId} not found.`)
    
    const rawTotal = parseFloat(String(quote.total || quote.sellingPrice || quote.value || '0').replace(/[^0-9.]/g, '')) || 0
    const orderId = this.generateDocumentId('order')
    
    if (unitId) {
      this.reserveUnit(unitId, { orderId, customerId: quote.customer_id, customerName: quote.customer })
    }

    const newOrder = {
      id: orderId,
      order: orderId,
      order_id: orderId,
      orderNo: orderId,
      quotation_id: quote.id,
      customer_id: quote.customer_id,
      customer: quote.customer,
      product_id: quote.product_id,
      product: quote.product,
      unit_id: unitId || null,
      unit: unitId || 'To be allocated',
      branch_id: quote.branch_id || 'BR-01',
      branch: quote.branch || 'Peshawar',
      total: quote.total || `PKR ${rawTotal.toLocaleString()}`,
      rawTotal,
      paid: 'PKR 0',
      rawPaid: 0,
      balance: quote.total || `PKR ${rawTotal.toLocaleString()}`,
      status: 'Processing',
      statusClass: 'bg-[#eff6ff] text-[#2563eb]',
      createdAt: new Date().toISOString().split('T')[0],
      salesperson: assignedSalesperson
    }

    this.orders.unshift(newOrder)
    quote.status = 'Accepted'
    quote.statusClass = 'bg-[#dcfce7] text-[#165A31]'
    quote.sales_order_id = orderId

    this.addAuditLog({
      action: 'Converted',
      event_type: 'QUOTATION_CONVERTED',
      entity_type: 'quotation',
      entity_id: quote.id,
      module: 'Sales',
      branch: quote.branch || 'Peshawar',
      description: `Quotation ${quote.id} converted into Sales Order ${orderId} for ${quote.customer}.`,
      metadata: { quotationId: quote.id, salesOrderId: orderId, customer: quote.customer, unitId }
    })

    return { success: true, order: newOrder, quotation: quote }
  },

  // ==========================================
  // 9. CANONICAL LEADS, INVOICES, PAYMENTS, CUSTOM ORDERS
  // ==========================================
  leads: [
    {
      id: 'LD-551',
      leadNo: 'LD-551',
      lead_id: 'LD-551',
      customer_id: 'CUST-108',
      customer: 'Sajid Khan',
      name: 'Sajid Khan',
      phone: '+92 313 5544332',
      source: 'Website',
      product_id: 'PROD-002',
      product: 'BRG X7',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      owner: 'Hamza',
      budget: 'PKR 220K',
      stage: 'New',
      status: 'New',
      statusClass: 'bg-[#eff6ff] text-[#2563eb]',
      date: 'Today'
    },
    {
      id: 'LD-548',
      leadNo: 'LD-548',
      lead_id: 'LD-548',
      customer_id: 'CUST-104',
      customer: 'Ali Raza',
      name: 'Ali Raza',
      phone: '+92 321 9988771',
      source: 'Walk-in',
      product_id: 'PROD-001',
      product: 'BRG E-125',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      owner: 'Ahsan',
      budget: 'PKR 280K',
      stage: 'Contacted',
      status: 'Contacted',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      date: 'Yesterday'
    }
  ],

  addLead(newLead) {
    const id = newLead.id || newLead.lead_id || newLead.leadNo || `LD-${Math.floor(552 + Math.random() * 100)}`
    const leadName = newLead.name || newLead.customer || newLead.customerName || 'Prospect'
    const leadObj = {
      ...newLead,
      id,
      lead_id: id,
      leadNo: id,
      name: leadName,
      customer: leadName,
      customerName: leadName,
      status: newLead.status || 'New',
      statusClass: newLead.statusClass || 'bg-[#eff6ff] text-[#2563eb]',
      date: newLead.date || 'Today'
    }
    this.leads.unshift(leadObj)

    this.addAuditLog({
      action: 'Created',
      event_type: 'LEAD_CREATED',
      entity_type: 'lead',
      entity_id: id,
      module: 'Marketing',
      branch: leadObj.branch || 'Peshawar',
      description: `Lead ${id} created for ${leadObj.name || leadObj.customer || 'Prospect'}.`,
      metadata: { name: leadObj.name || leadObj.customer, source: leadObj.source, phone: leadObj.phone }
    })

    return leadObj
  },

  updateLead(id, updatedData) {
    const index = this.leads.findIndex(l => l.id === id || l.lead_id === id || l.leadNo === id)
    if (index !== -1) {
      this.leads[index] = { ...this.leads[index], ...updatedData }

      this.addAuditLog({
        action: 'Updated',
        event_type: 'LEAD_UPDATED',
        entity_type: 'lead',
        entity_id: this.leads[index].id,
        module: 'Marketing',
        branch: this.leads[index].branch || 'Peshawar',
        description: `Lead ${this.leads[index].id} updated.`,
        metadata: { updatedFields: Object.keys(updatedData) }
      })

      return this.leads[index]
    }
    return null
  },

  getLeadById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.leads.find(l => 
      (l.id && l.id.toLowerCase() === target) ||
      (l.lead_id && l.lead_id.toLowerCase() === target) ||
      (l.leadNo && l.leadNo.toLowerCase() === target)
    ) || null
  },

  convertLeadToCustomer(leadId, additionalData = {}) {
    const lead = this.getLeadById(leadId)
    if (!lead) throw new Error(`Lead ${leadId} not found.`)
    if (lead.stage === 'Converted' || lead.status === 'Converted') {
      const existing = lead.customer_id ? this.getCustomerById(lead.customer_id) : null
      return { success: true, customer: existing, lead, alreadyConverted: true }
    }
    
    // Check if customer with this ID or phone already exists
    let existingCust = lead.customer_id ? this.getCustomerById(lead.customer_id) : null
    if (!existingCust && lead.phone) {
      existingCust = this.customers.find(c => c.phone === lead.phone)
    }

    if (existingCust) {
      lead.customer_id = existingCust.id
      lead.stage = 'Converted'
      lead.status = 'Converted'
      lead.statusClass = 'bg-[#dcfce7] text-[#165A31]'

      this.addAuditLog({
        action: 'Converted',
        event_type: 'LEAD_CONVERTED',
        entity_type: 'lead',
        entity_id: lead.id,
        module: 'Marketing',
        branch: lead.branch || 'Peshawar',
        description: `Lead ${lead.id} linked to existing customer ${existingCust.id} (${existingCust.name}).`,
        metadata: { leadId: lead.id, customerId: existingCust.id, name: existingCust.name }
      })

      return { success: true, customer: existingCust, lead, alreadyConverted: true }
    }

    const custId = `CUST-${Math.floor(110 + Math.random() * 890)}`
    const leadName = (lead.name || lead.customer || lead.customerName || 'New Customer').trim()
    const nameParts = leadName.split(' ')
    const firstName = nameParts[0] || 'Customer'
    const lastName = nameParts.slice(1).join(' ') || ''

    const newCust = {
      id: custId,
      customer_id: custId,
      code: `CUS-${Math.floor(1000 + Math.random() * 9000)}`,
      name: leadName,
      firstName,
      lastName,
      phone: lead.phone || '+92 300 0000000',
      email: lead.email || `${leadName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      cnic: additionalData.cnic || '17301-0000000-1',
      address: additionalData.address || `${lead.branch || 'Peshawar'} City`,
      city: lead.branch || 'Peshawar',
      branch_id: lead.branch_id || 'BR-01',
      branch: lead.branch || 'Peshawar',
      orders: 0,
      ordersCount: 0,
      outstanding: 'PKR 0',
      totalPurchases: 'PKR 0',
      balance: '0',
      ltv: '0',
      units: 0,
      activity: 'Today',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      createdAt: new Date().toISOString().split('T')[0],
      sourceLeadId: lead.id
    }

    this.addCustomer(newCust)
    lead.customer_id = custId
    lead.stage = 'Converted'
    lead.status = 'Converted'
    lead.statusClass = 'bg-[#dcfce7] text-[#165A31]'

    this.addAuditLog({
      action: 'Converted',
      event_type: 'LEAD_CONVERTED',
      entity_type: 'lead',
      entity_id: lead.id,
      module: 'Marketing',
      branch: lead.branch || 'Peshawar',
      description: `Lead ${lead.id} converted into customer ${custId} (${leadName}).`,
      metadata: { leadId: lead.id, customerId: custId, name: leadName }
    })

    return { success: true, customer: newCust, lead }
  },

  invoices: [
    {
      id: 'INV-2241',
      invoice: 'INV-2241',
      invoice_id: 'INV-2241',
      invoiceNo: 'INV-2241',
      order_id: 'ORD-2241',
      order: 'ORD-2241',
      orderNo: 'ORD-2241',
      customer_id: 'CUST-101',
      customer: 'Ahsan Khan',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      subtotal: 280000,
      discount: 0,
      tax: 0,
      total: 280000,
      amount: 'PKR 280,000',
      paidAmount: 280000,
      outstandingAmount: 0,
      status: 'Paid',
      paymentStatus: 'Paid',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      date: 'Today',
      issued: 'Today',
      dueDate: '2026-09-10',
      items: [
        { description: 'BRG E-125 (2026 Edition)', quantity: 1, unitPrice: 280000, total: 280000 }
      ]
    },
    {
      id: 'INV-2238',
      invoice: 'INV-2238',
      invoice_id: 'INV-2238',
      invoiceNo: 'INV-2238',
      order_id: 'ORD-2238',
      order: 'ORD-2238',
      orderNo: 'ORD-2238',
      customer_id: 'CUST-102',
      customer: 'Bilal Shah',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      subtotal: 340000,
      discount: 0,
      tax: 0,
      total: 340000,
      amount: 'PKR 340,000',
      paidAmount: 125000,
      outstandingAmount: 215000,
      status: 'Partial',
      paymentStatus: 'Partial',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      date: 'Yesterday',
      issued: 'Yesterday',
      dueDate: '2026-09-08',
      items: [
        { description: 'BRG X7 (Lithium 72V)', quantity: 1, unitPrice: 340000, total: 340000 }
      ]
    }
  ],

  addInvoice(newInvoice) {
    const id = newInvoice.id || newInvoice.invoice_id || newInvoice.invoice || this.generateDocumentId('invoice')
    const subtotal = newInvoice.subtotal !== undefined ? Number(newInvoice.subtotal) : (
      newInvoice.total !== undefined ? Number(newInvoice.total) : (
        newInvoice.items && newInvoice.items.length ? newInvoice.items.reduce((s, i) => s + (Number(i.unitPrice || i.price || i.rate || 0) * Number(i.quantity || i.qty || 1)), 0) : (parseFloat(String(newInvoice.amount || '0').replace(/[^0-9.]/g, '')) || 0)
      )
    )
    const discount = Number(newInvoice.discount || 0)
    const tax = Number(newInvoice.tax || 0)
    const total = newInvoice.total !== undefined ? Number(newInvoice.total) : Math.max(0, subtotal - discount + tax)
    const paidAmount = Number(newInvoice.paidAmount || 0)
    const outstandingAmount = newInvoice.outstandingAmount !== undefined ? Number(newInvoice.outstandingAmount) : Math.max(0, total - paidAmount)
    const status = newInvoice.status || (outstandingAmount === 0 ? 'Paid' : (paidAmount > 0 ? 'Partial' : 'Unpaid'))

    const invObj = {
      ...newInvoice,
      id,
      invoice: id,
      invoice_id: id,
      invoiceNo: id,
      subtotal,
      discount,
      tax,
      total,
      amount: newInvoice.amount || `PKR ${total.toLocaleString()}`,
      paidAmount,
      outstandingAmount,
      status,
      paymentStatus: status,
      statusClass: status === 'Paid' ? 'bg-[#dcfce7] text-[#165A31]' : (status === 'Partial' ? 'bg-[#fef3c7] text-[#b45309]' : 'bg-[#eff6ff] text-[#2563eb]'),
      date: newInvoice.date || newInvoice.issued || 'Today',
      issued: newInvoice.issued || newInvoice.date || 'Today',
      dueDate: newInvoice.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: newInvoice.items || [{ description: 'Vehicle / Service Invoice', quantity: 1, unitPrice: total, total }]
    }
    this.invoices.unshift(invObj)
    return invObj
  },

  updateInvoice(idOrPayload, updatedData) {
    const id = typeof idOrPayload === 'string' ? idOrPayload : (idOrPayload?.id || idOrPayload?.invoice || idOrPayload?.invoice_id || idOrPayload?.invoiceNo)
    const data = typeof idOrPayload === 'object' && !updatedData ? idOrPayload : (updatedData || {})
    const index = this.invoices.findIndex(i => i.id === id || i.invoice_id === id || i.invoice === id || i.invoiceNo === id)
    if (index !== -1) {
      this.invoices[index] = { ...this.invoices[index], ...data }
      return this.invoices[index]
    }
    return null
  },

  getInvoiceById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.invoices.find(i => 
      (i.id && i.id.toLowerCase() === target) ||
      (i.invoice_id && i.invoice_id.toLowerCase() === target) ||
      (i.invoice && i.invoice.toLowerCase() === target) ||
      (i.invoiceNo && i.invoiceNo.toLowerCase() === target)
    ) || null
  },

  payments: [
    {
      id: 'PAY-7791',
      payment: 'PAY-7791',
      payment_id: 'PAY-7791',
      paymentNo: 'PAY-7791',
      invoice_id: 'INV-2241',
      customer_id: 'CUST-101',
      customer: 'Ahsan Khan',
      order_id: 'ORD-2241',
      order: 'ORD-2241',
      method: 'Bank Transfer',
      amount: 'PKR 280,000',
      rawAmount: 280000,
      transactionRef: 'TXN-2241-BANK-01',
      ref: 'TXN-2241-BANK-01',
      date: 'Today',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      status: 'Reconciled',
      statusClass: 'bg-[#dcfce7] text-[#165A31]'
    },
    {
      id: 'PAY-7788',
      payment: 'PAY-7788',
      payment_id: 'PAY-7788',
      paymentNo: 'PAY-7788',
      invoice_id: 'INV-2238',
      customer_id: 'CUST-102',
      customer: 'Bilal Shah',
      order_id: 'ORD-2238',
      order: 'ORD-2238',
      method: 'Cash',
      amount: 'PKR 125,000',
      rawAmount: 125000,
      transactionRef: 'TXN-2238-CASH-01',
      ref: 'TXN-2238-CASH-01',
      date: 'Yesterday',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      status: 'Reconciled',
      statusClass: 'bg-[#dcfce7] text-[#165A31]'
    }
  ],

  addPayment(newPayment) {
    const id = newPayment.id || newPayment.payment_id || newPayment.payment || this.generateDocumentId('payment')
    const rawAmt = typeof newPayment.amount === 'number' ? newPayment.amount : (parseFloat(String(newPayment.amount || '0').replace(/[^0-9.]/g, '')) || 0)
    const payObj = {
      ...newPayment,
      id,
      payment: id,
      payment_id: id,
      paymentNo: id,
      rawAmount: newPayment.rawAmount || rawAmt,
      status: newPayment.status || 'Reconciled',
      statusClass: newPayment.statusClass || 'bg-[#dcfce7] text-[#165A31]',
      date: newPayment.date || 'Today'
    }
    this.payments.unshift(payObj)

    if (payObj.customer_id || payObj.customer) {
      const cust = this.getCustomerById(payObj.customer_id || payObj.customer)
      if (cust) {
        const currentBal = parseFloat(String(cust.balance || cust.outstanding || '0').replace(/[^0-9.]/g, '')) || 0
        const newBal = Math.max(0, currentBal - (payObj.rawAmount || rawAmt))
        cust.balance = String(newBal)
        cust.outstanding = `PKR ${newBal.toLocaleString()}`
      }
    }

    return payObj
  },

  updatePayment(idOrPayload, updatedData) {
    const id = typeof idOrPayload === 'string' ? idOrPayload : (idOrPayload?.id || idOrPayload?.payment || idOrPayload?.payment_id || idOrPayload?.paymentNo)
    const data = typeof idOrPayload === 'object' && !updatedData ? idOrPayload : (updatedData || {})
    const index = this.payments.findIndex(p => p.id === id || p.payment_id === id || p.payment === id || p.paymentNo === id)
    if (index !== -1) {
      this.payments[index] = { ...this.payments[index], ...data }
      return this.payments[index]
    }
    return null
  },

  getPaymentById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.payments.find(p => 
      (p.id && p.id.toLowerCase() === target) ||
      (p.payment_id && p.payment_id.toLowerCase() === target) ||
      (p.payment && p.payment.toLowerCase() === target) ||
      (p.paymentNo && p.paymentNo.toLowerCase() === target)
    ) || null
  },

  recordInvoicePayment({ invoiceId, invoice_id, amount, method = 'Bank Transfer', transactionRef = '', bankAccount = 'Meezan Bank', date = 'Today', notes = '' }) {
    const targetInvoiceId = invoiceId || invoice_id
    const inv = this.getInvoiceById(targetInvoiceId)
    if (!inv) throw new Error(`Invoice ${targetInvoiceId} not found.`)
    if (inv.status === 'Cancelled') throw new Error(`Cannot record payment against cancelled invoice ${targetInvoiceId}.`)

    const numAmount = typeof amount === 'number' ? amount : (parseFloat(String(amount || '0').replace(/[^0-9.]/g, '')) || 0)
    if (numAmount <= 0) throw new Error('Payment amount must be greater than zero.')

    const currentOutstanding = inv.outstandingAmount !== undefined ? inv.outstandingAmount : (
      (typeof inv.total === 'number' ? inv.total : parseFloat(String(inv.amount || '0').replace(/[^0-9.]/g, ''))) - (inv.paidAmount || 0)
    )

    if (numAmount > currentOutstanding) {
      throw new Error(`Payment amount (PKR ${numAmount.toLocaleString()}) cannot exceed invoice outstanding balance (PKR ${currentOutstanding.toLocaleString()}).`)
    }

    const payId = this.generateDocumentId('payment')
    const paymentObj = {
      id: payId,
      payment: payId,
      payment_id: payId,
      paymentNo: payId,
      invoice_id: inv.id,
      order_id: inv.order_id || inv.order,
      order: inv.order_id || inv.order,
      customer_id: inv.customer_id,
      customer: inv.customer,
      method,
      amount: `PKR ${numAmount.toLocaleString()}`,
      rawAmount: numAmount,
      transactionRef: transactionRef || `TXN-${payId}`,
      ref: transactionRef || `TXN-${payId}`,
      date: date || 'Today',
      bankAccount,
      notes,
      branch_id: inv.branch_id || 'BR-01',
      branch: inv.branch || 'Peshawar',
      status: 'Reconciled',
      statusClass: 'bg-[#dcfce7] text-[#165A31]'
    }

    this.payments.unshift(paymentObj)

    // Update invoice counters
    inv.paidAmount = (inv.paidAmount || 0) + numAmount
    inv.outstandingAmount = Math.max(0, currentOutstanding - numAmount)
    const isPaid = inv.outstandingAmount === 0
    inv.status = isPaid ? 'Paid' : 'Partial'
    inv.paymentStatus = inv.status
    inv.statusClass = isPaid ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#fef3c7] text-[#b45309]'

    // Update order counters if linked
    if (inv.order_id) {
      const order = this.getOrderById(inv.order_id)
      if (order) {
        const orderPaidNum = (order.rawPaid || parseFloat(String(order.paid || '0').replace(/[^0-9.]/g, '')) || 0) + numAmount
        order.paid = `PKR ${orderPaidNum.toLocaleString()}`
        order.rawPaid = orderPaidNum
        const orderTotalNum = order.rawTotal || parseFloat(String(order.total || '0').replace(/[^0-9.]/g, '')) || 0
        const orderBalance = Math.max(0, orderTotalNum - orderPaidNum)
        order.balance = `PKR ${orderBalance.toLocaleString()}`
        if (orderBalance === 0 && order.status === 'Processing') {
          order.status = 'Ready'
          order.statusClass = 'bg-[#dcfce7] text-[#165A31]'
        }
      }
    }

    // Update customer outstanding
    if (inv.customer_id) {
      const cust = this.getCustomerById(inv.customer_id)
      if (cust) {
        const currentCustBal = parseFloat(String(cust.balance || cust.outstanding || '0').replace(/[^0-9.]/g, '')) || 0
        const newCustBal = Math.max(0, currentCustBal - numAmount)
        cust.balance = String(newCustBal)
        cust.outstanding = `PKR ${newCustBal.toLocaleString()}`
      }
    }

    this.addNotification({
      title: 'Payment Recorded',
      message: `Payment of PKR ${numAmount.toLocaleString()} recorded for invoice ${inv.id} (${inv.customer}). Outstanding balance: PKR ${(inv.outstandingAmount || 0).toLocaleString()}.`,
      type: 'success',
      priority: 'Normal',
      category: 'Finance',
      source_type: 'payment',
      source_id: inv.id,
      event_type: 'PAYMENT_RECORDED',
      recipient_role: 'Branch Manager',
      branch: inv.branch || 'Peshawar',
      link: `/sales/invoices/detail?id=${inv.id}`
    })

    this.addAuditLog({
      action: 'Payment Recorded',
      event_type: 'PAYMENT_RECORDED',
      entity_type: 'payment',
      entity_id: payId,
      module: 'Finance',
      branch: inv.branch || 'Peshawar',
      description: `Payment ${payId} of PKR ${numAmount.toLocaleString()} received via ${method} for invoice ${inv.id} (${inv.customer}).`,
      metadata: { paymentId: payId, invoiceId: inv.id, orderId: inv.order_id, amount: numAmount, method, remainingBalance: inv.outstandingAmount }
    })

    return { success: true, payment: paymentObj, invoice: inv }
  },

  // ==========================================
  // 9B. CANONICAL DELIVERIES & HANDOVER MASTER
  // ==========================================
  deliveries: [
    {
      id: 'DEL-2241',
      delivery_id: 'DEL-2241',
      order: 'ORD-2241',
      order_id: 'ORD-2241',
      invoice_id: 'INV-2241',
      customer_id: 'CUST-101',
      customer: 'Ahsan Khan',
      unit_id: 'CH 8-BRG-26-01731',
      unit: 'CH 8-BRG-26-01731',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      scheduled: 'Today 16:00',
      scheduledTime: 'Today 16:00',
      status: 'Ready',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      officer: 'Hamza',
      pdiStatus: 'Passed (100%)',
      identityVerified: true,
      paymentComplete: true,
      chassisVerified: true,
      accessoriesIncluded: true,
      warrantyBriefed: true,
      notes: 'Vehicle cleaned, charged and prepared for customer handover.',
      timeline: [
        { time: 'Today 10:30', title: 'PDI Checklist Completed', desc: 'Pre-delivery inspection passed 100%.', user: 'Technician Ali' },
        { time: 'Today 09:15', title: 'Payment Cleared', desc: 'Full payment verified and cleared.', user: 'Cashier' },
        { time: 'Today 09:00', title: 'Delivery Scheduled', desc: 'Scheduled delivery for Ahsan Khan.', user: 'Hamza' }
      ]
    },
    {
      id: 'DEL-2235',
      delivery_id: 'DEL-2235',
      order: 'ORD-2235',
      order_id: 'ORD-2235',
      invoice_id: 'INV-2235',
      customer_id: 'CUST-103',
      customer: 'Faisal Khan',
      unit_id: 'DS11-01001',
      unit: 'DS11-01001',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      scheduled: 'Tomorrow 11:00',
      scheduledTime: 'Tomorrow 11:00',
      status: 'Delivered',
      statusClass: 'bg-[#165A31] text-white',
      officer: 'Hamza',
      pdiStatus: 'Passed (100%)',
      identityVerified: true,
      paymentComplete: true,
      chassisVerified: true,
      accessoriesIncluded: true,
      warrantyBriefed: true,
      notes: 'Handover complete and warranty briefed.',
      deliveredDate: '2026-08-25',
      timeline: [
        { time: '2026-08-25 11:30', title: 'Unit Handed Over', desc: 'Customer signed delivery note and collected vehicle.', user: 'Hamza' }
      ]
    }
  ],

  getDeliveryById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.deliveries.find(d => 
      (d.id && d.id.toLowerCase() === target) ||
      (d.delivery_id && d.delivery_id.toLowerCase() === target) ||
      (d.order && d.order.toLowerCase() === target) ||
      (d.order_id && d.order_id.toLowerCase() === target) ||
      (target === 'del-101' && d.id === 'DEL-2241')
    ) || null
  },

  addDelivery(deliveryData) {
    const id = deliveryData.id || deliveryData.delivery_id || this.generateDocumentId('delivery')
    const delivObj = {
      ...deliveryData,
      id,
      delivery_id: id,
      status: deliveryData.status || 'Ready',
      statusClass: deliveryData.status === 'Delivered' ? 'bg-[#165A31] text-white' : 'bg-[#dcfce7] text-[#165A31]',
      timeline: deliveryData.timeline || [
        { time: 'Just now', title: 'Delivery Scheduled', desc: `Handover scheduled for ${deliveryData.customer}.`, user: this.currentUser?.name || 'Hamza' }
      ]
    }
    this.deliveries.unshift(delivObj)
    return delivObj
  },

  updateDelivery(idOrPayload, updatedData) {
    const id = typeof idOrPayload === 'string' ? idOrPayload : (idOrPayload?.id || idOrPayload?.delivery_id || idOrPayload?.order)
    const data = typeof idOrPayload === 'object' && !updatedData ? idOrPayload : (updatedData || {})
    const index = this.deliveries.findIndex(d => d.id === id || d.delivery_id === id || d.order === id)
    if (index !== -1) {
      this.deliveries[index] = { ...this.deliveries[index], ...data }
      return this.deliveries[index]
    }
    return null
  },

  completeDelivery(deliveryId, details = {}) {
    const d = this.getDeliveryById(deliveryId)
    if (!d) throw new Error(`Delivery ${deliveryId} not found.`)
    if (d.status === 'Delivered') throw new Error(`Delivery ${deliveryId} has already been completed.`)

    const unit = this.getUnitById(d.unit_id || d.unit)
    if (!unit) throw new Error(`Unit ${d.unit_id || d.unit} not found in inventory.`)

    d.status = 'Delivered'
    d.statusClass = 'bg-[#165A31] text-white'
    d.deliveredDate = details.deliveredDate || new Date().toISOString().split('T')[0]
    d.officer = details.officer || d.officer || this.currentUser?.name || 'Hamza'
    d.notes = details.notes || d.notes

    if (!d.timeline) d.timeline = []
    d.timeline.unshift({
      time: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: 'Handover Completed',
      desc: `Unit ${unit.serial || unit.unit_id} successfully handed over to customer ${d.customer}.`,
      user: d.officer
    })

    // Atomically transition unit to Delivered with Customer Owned ownership
    unit.status = 'Delivered'
    unit.statusClass = 'bg-[#165A31] text-white'
    unit.ownership_status = 'Customer Owned'
    unit.customer_id = d.customer_id
    unit.customer = d.customer
    unit.location = 'Customer Custody'
    if (!unit.timeline) unit.timeline = []
    unit.timeline.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: 'Delivered to Customer',
      desc: `Vehicle officially handed over under delivery ${d.id}. Ownership transferred to ${d.customer}.`,
      user: d.officer
    })

    // Update order status if linked
    if (d.order_id || d.order) {
      const order = this.getOrderById(d.order_id || d.order)
      if (order) {
        order.status = 'Delivered'
        order.statusClass = 'bg-gray-100 text-gray-700'
        order.delivery = 'Delivered'
      }
    }

    // Register Ownership
    const ownId = `OWN-${Math.floor(100 + Math.random() * 900)}`
    const ownershipObj = {
      id: ownId,
      ownership_id: ownId,
      unit_id: unit.unit_id || unit.serial,
      customer_id: d.customer_id,
      customer: d.customer,
      order_id: d.order_id || d.order,
      delivery_id: d.id,
      branch_id: d.branch_id || 'BR-01',
      branch: d.branch || 'Peshawar',
      registeredDate: d.deliveredDate,
      status: 'Active'
    }
    this.addOwnership(ownershipObj)

    // Register & Activate official 2-Year OEM Warranty
    const warId = this.generateDocumentId('warranty')
    const startDate = d.deliveredDate
    const expiryDateObj = new Date(startDate)
    expiryDateObj.setFullYear(expiryDateObj.getFullYear() + 2)
    const expiryDate = expiryDateObj.toISOString().split('T')[0]

    const warrantyObj = {
      id: warId,
      warranty_id: warId,
      unit_id: unit.unit_id || unit.serial,
      customer_id: d.customer_id,
      customer: d.customer,
      product_id: unit.product_id,
      product: unit.product || unit.modelName,
      order_id: d.order_id || d.order,
      ownership_id: ownId,
      policy: '2-Year Electrical & Mechanical OEM Warranty',
      tier: 'Full Comprehensive',
      startDate,
      expiryDate,
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      claimCount: 0,
      coverageNotes: 'Covers battery cells, BMS, controller, and electric motor (100% parts & labour).'
    }
    this.addWarranty(warrantyObj)

    this.addNotification({
      title: 'Delivery Handover Completed',
      message: `Delivery ${d.id} completed. Unit ${unit.serial || unit.unit_id} handed over to ${d.customer}. 2-Year warranty activated.`,
      type: 'success',
      priority: 'High',
      category: 'Sales',
      source_type: 'delivery',
      source_id: d.id,
      event_type: 'DELIVERED',
      recipient_role: 'Branch Manager',
      branch: d.branch || 'Peshawar',
      link: `/sales/delivery-handover/detail?id=${d.id}`
    })

    this.addAuditLog({
      action: 'Handover Completed',
      event_type: 'DELIVERY_COMPLETED',
      entity_type: 'delivery',
      entity_id: d.id,
      module: 'Sales',
      branch: d.branch || 'Peshawar',
      description: `Delivery ${d.id} completed. Vehicle ${unit.serial || unit.unit_id} handed over to ${d.customer}. Ownership ${ownId} & Warranty ${warId} activated.`,
      metadata: { deliveryId: d.id, unitId: unit.unit_id || unit.serial, customer: d.customer, ownershipId: ownId, warrantyId: warId }
    })

    this.reconcileInventoryTotals()
    return {
      success: true,
      delivery: d,
      unit,
      ownership: ownershipObj,
      warranty: warrantyObj
    }
  },

  // ==========================================
  // 9C. CANONICAL OWNERSHIPS MASTER
  // ==========================================
  ownerships: [
    {
      id: 'OWN-101',
      ownership_id: 'OWN-101',
      unit_id: 'CH 8-BRG-26-01731',
      customer_id: 'CUST-101',
      customer: 'Ahsan Khan',
      order_id: 'ORD-2241',
      delivery_id: 'DEL-2241',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      registeredDate: '2026-08-27',
      status: 'Active'
    },
    {
      id: 'OWN-102',
      ownership_id: 'OWN-102',
      unit_id: 'DS11-01001',
      customer_id: 'CUST-103',
      customer: 'Faisal Khan',
      order_id: 'ORD-2235',
      delivery_id: 'DEL-2235',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      registeredDate: '2026-08-25',
      status: 'Active'
    }
  ],

  getOwnershipByUnitId(unitId) {
    if (!unitId) return null
    const target = String(unitId).toLowerCase().trim()
    return this.ownerships.find(o => o.unit_id && o.unit_id.toLowerCase() === target) || null
  },

  getOwnershipsByCustomerId(customerId) {
    if (!customerId) return []
    const target = String(customerId).toLowerCase().trim()
    return this.ownerships.filter(o => 
      (o.customer_id && o.customer_id.toLowerCase() === target) ||
      (o.customer && o.customer.toLowerCase() === target)
    )
  },

  addOwnership(ownershipData) {
    const id = ownershipData.id || ownershipData.ownership_id || `OWN-${Math.floor(100 + Math.random() * 900)}`
    const ownObj = {
      ...ownershipData,
      id,
      ownership_id: id,
      status: ownershipData.status || 'Active',
      registeredDate: ownershipData.registeredDate || new Date().toISOString().split('T')[0]
    }
    this.ownerships.unshift(ownObj)
    return ownObj
  },

  // ==========================================
  // 9D. CANONICAL WARRANTIES MASTER
  // ==========================================
  warranties: [
    {
      id: 'WAR-101',
      warranty_id: 'WAR-101',
      unit_id: 'CH 8-BRG-26-01731',
      customer_id: 'CUST-101',
      customer: 'Ahsan Khan',
      product_id: 'PROD-001',
      product: 'BRG E-125',
      order_id: 'ORD-2241',
      ownership_id: 'OWN-101',
      policy: '2-Year Electrical & Mechanical OEM Warranty',
      tier: 'Full Comprehensive',
      startDate: '2026-08-27',
      expiryDate: '2028-08-27',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      claimCount: 1,
      coverageNotes: 'Covers battery cells, BMS, controller, and electric motor (100% parts & labour).'
    },
    {
      id: 'WAR-102',
      warranty_id: 'WAR-102',
      unit_id: 'DS11-01001',
      customer_id: 'CUST-103',
      customer: 'Faisal Khan',
      product_id: 'PROD-003',
      product: 'BRG DS11',
      order_id: 'ORD-2235',
      ownership_id: 'OWN-102',
      policy: '2-Year Electrical Component Warranty',
      tier: 'Standard Electrical',
      startDate: '2026-08-25',
      expiryDate: '2028-08-25',
      status: 'Active',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      claimCount: 0,
      coverageNotes: 'Standard 2-year warranty on powertrain.'
    }
  ],

  getWarrantyById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.warranties.find(w => 
      (w.id && w.id.toLowerCase() === target) ||
      (w.warranty_id && w.warranty_id.toLowerCase() === target)
    ) || null
  },

  getWarrantyByUnitId(unitId) {
    if (!unitId) return null
    const target = String(unitId).toLowerCase().trim()
    return this.warranties.find(w => w.unit_id && w.unit_id.toLowerCase() === target) || null
  },

  getWarrantiesByCustomerId(customerId) {
    if (!customerId) return []
    const target = String(customerId).toLowerCase().trim()
    return this.warranties.filter(w => 
      (w.customer_id && w.customer_id.toLowerCase() === target) ||
      (w.customer && w.customer.toLowerCase() === target)
    )
  },

  addWarranty(warrantyData) {
    const unit = this.getUnitById(warrantyData.unit_id)
    if (unit && (unit.status === 'Available' || unit.ownership_status === 'Inventory')) {
      throw new Error(`Cannot register warranty for unsold inventory unit ${warrantyData.unit_id}.`)
    }

    const id = warrantyData.id || warrantyData.warranty_id || `WAR-${Math.floor(100 + Math.random() * 900)}`
    const warObj = {
      ...warrantyData,
      id,
      warranty_id: id,
      status: warrantyData.status || 'Active',
      statusClass: warrantyData.status === 'Active' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-gray-100 text-gray-700',
      claimCount: warrantyData.claimCount || 0
    }
    this.warranties.unshift(warObj)
    return warObj
  },

  activateWarranty(warrantyData) {
    return this.addWarranty({ ...warrantyData, status: 'Active' })
  },

  customOrders: [
    {
      id: 'CO-118',
      orderNo: 'CO-118',
      customer_id: 'CUST-106',
      customer: 'Jawad Khan',
      phone: '+92 300 9876543',
      cnic: '17301-8899221-3',
      city: 'Peshawar',
      requirement: 'BRG X7 / Black',
      product_id: 'PROD-002',
      product: 'BRG X7 / Black',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      deposit: 'PKR 100,000',
      budget: 'PKR 360,000',
      total: 'PKR 360,000',
      balance: 'PKR 260,000',
      desiredDate: '15 Sep 2026',
      eta: '15 Sep 2026',
      productRequest: 'PR-088',
      stockRequest: 'SR-122',
      reservation: 'Pending arrival',
      owner: 'Hamza',
      paymentMethod: 'Bank Transfer',
      notes: 'Customer accepts equivalent trim if approved',
      status: 'Sourcing',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      statusColor: 'bg-yellow-50 text-yellow-700'
    },
    {
      id: 'CO-113',
      orderNo: 'CO-113',
      customer_id: 'CUST-105',
      customer: 'Adil Shah',
      phone: '+92 321 5551234',
      cnic: '17301-1122334-1',
      city: 'Peshawar',
      requirement: 'BRG E-125 / White',
      product_id: 'PROD-001',
      product: 'BRG E-125 / White',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      deposit: 'PKR 80,000',
      budget: 'PKR 280,000',
      total: 'PKR 280,000',
      balance: 'PKR 200,000',
      desiredDate: '20 Sep 2026',
      eta: '20 Sep 2026',
      productRequest: 'PR-082',
      stockRequest: 'SR-118',
      reservation: 'Unit reserved CHS-01882',
      owner: 'Hamza',
      paymentMethod: 'Cash',
      notes: 'Unit arrived from central warehouse and reserved for customer.',
      status: 'Arrived',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      statusColor: 'bg-emerald-50 text-emerald-700'
    },
    {
      id: 'CO-119',
      orderNo: 'CO-119',
      customer_id: 'CUST-104',
      customer: 'Zain Khan',
      phone: '+92 333 4455667',
      cnic: '37405-9988776-5',
      city: 'Islamabad',
      requirement: 'Cargo Pro - Red',
      product_id: 'PROD-004',
      product: 'Cargo Pro - Red',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      deposit: 'PKR 75,000',
      budget: 'PKR 280,000',
      total: 'PKR 280,000',
      balance: 'PKR 205,000',
      desiredDate: '18 Sep 2026',
      eta: '18 Sep 2026',
      productRequest: 'PR-091',
      stockRequest: 'SR-130',
      reservation: 'On receipt',
      owner: 'Hassan Ali',
      paymentMethod: 'Bank Transfer',
      notes: 'Commercial delivery use',
      status: 'Procurement',
      statusClass: 'bg-[#eefcf2] text-[#165A31]',
      statusColor: 'bg-[#eefcf2] text-[#165A31]'
    },
    {
      id: 'CO-115',
      orderNo: 'CO-115',
      customer_id: 'CUST-102',
      customer: 'M. Bilal',
      phone: '+92 301 9876543',
      cnic: '35202-1234567-1',
      city: 'Lahore',
      requirement: 'EV-5 Extended Range',
      product_id: 'PROD-005',
      product: 'EV-5 Extended Range',
      branch_id: 'BR-03',
      branch: 'Lahore',
      deposit: 'PKR 100,000',
      budget: 'PKR 340,000',
      total: 'PKR 340,000',
      balance: 'PKR 240,000',
      desiredDate: '25 Sep 2026',
      eta: '25 Sep 2026',
      productRequest: 'PR-085',
      stockRequest: 'SR-125',
      reservation: 'On assembly completion',
      owner: 'Hamza Ali',
      paymentMethod: 'Cheque',
      notes: 'Special extended range pack requested',
      status: 'In Assembly',
      statusClass: 'bg-blue-50 text-blue-700',
      statusColor: 'bg-blue-50 text-blue-700'
    }
  ],

  addCustomOrder(newCO) {
    const id = newCO.id || newCO.orderNo || `CO-${Math.floor(119 + Math.random() * 100)}`
    const coObj = {
      ...newCO,
      id,
      orderNo: id,
      status: newCO.status || 'Sourcing',
      statusClass: newCO.statusClass || 'bg-[#fef3c7] text-[#b45309]'
    }
    this.customOrders.unshift(coObj)
    return coObj
  },

  updateCustomOrder(id, updatedData) {
    const index = this.customOrders.findIndex(c => c.id === id || c.orderNo === id)
    if (index !== -1) {
      this.customOrders[index] = { ...this.customOrders[index], ...updatedData }
      return this.customOrders[index]
    }
    return null
  },

  getCustomOrderById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.customOrders.find(c => 
      (c.id && c.id.toLowerCase() === target) ||
      (c.orderNo && c.orderNo.toLowerCase() === target)
    ) || null
  },

  // ==========================================
  // 11. CANONICAL STOCK REQUESTS MASTER
  // ==========================================
  stockRequests: [
    {
      id: 'SR-104',
      requestId: 'SR-104',
      requestNo: 'SR-104',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      requestedBy: 'Ahsan Khan',
      priority: 'High',
      needBy: '2026-08-31',
      expected: '31 Aug',
      reason: 'Below reorder',
      status: 'Pending Approval', // Pending Approval, Approved, Rejected, Fulfilled
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      notes: 'Showroom stock below minimum threshold for high-demand season.',
      product: 'BRG X5',
      qty: 4,
      items: [
        {
          product_id: 'PROD-003',
          product: 'BRG DS11',
          sku: 'SKU-DS11-BLU',
          requestedQty: 4,
          approvedQty: 0,
          currentStock: 1,
          unitOfMeasure: 'units'
        }
      ],
      timeline: [
        { date: '2026-08-26 14:10', title: 'Requested', desc: 'Stock request created by Ahsan Khan', user: 'Ahsan Khan' },
        { date: '2026-08-27 09:00', title: 'Acknowledged', desc: 'Acknowledged by Central Inventory Lead', user: 'Central Inventory Lead' }
      ]
    },
    {
      id: 'SR-102',
      requestId: 'SR-102',
      requestNo: 'SR-102',
      branch_id: 'BR-03',
      branch: 'Lahore',
      requestedBy: 'Ali Raza',
      priority: 'Medium',
      needBy: '2026-08-28',
      expected: '28 Aug',
      reason: 'High demand',
      status: 'Approved',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      approvedBy: 'Central Inventory Lead',
      approvedDate: '2026-08-26',
      linkedTransferId: 'TR-219',
      notes: 'Approved 2 units to be dispatched from Peshawar.',
      product: 'BRG E-125',
      qty: 2,
      items: [
        {
          product_id: 'PROD-001',
          product: 'BRG E-125',
          sku: 'SKU-E125-RED',
          requestedQty: 2,
          approvedQty: 2,
          currentStock: 0,
          unitOfMeasure: 'units'
        }
      ],
      timeline: [
        { date: '2026-08-25 10:00', title: 'Requested', desc: 'Stock request submitted by Ali Raza', user: 'Ali Raza' },
        { date: '2026-08-26 11:30', title: 'Approved', desc: 'Approved 2 units. Transfer TR-219 scheduled.', user: 'Central Inventory Lead' }
      ]
    },
    {
      id: 'SR-098',
      requestId: 'SR-098',
      requestNo: 'SR-098',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      requestedBy: 'Bilal Shah',
      priority: 'Low',
      needBy: '2026-08-20',
      expected: '20 Aug',
      reason: 'Event display',
      status: 'Rejected',
      statusClass: 'bg-red-50 text-red-700',
      rejectedBy: 'Central Logistics Lead',
      rejectionReason: 'Islamabad branch already has sufficient floor demo units.',
      notes: 'Requested units for upcoming local EV showcase.',
      product: 'BRG E9 Pro',
      qty: 3,
      items: [
        {
          product_id: 'PROD-004',
          product: 'BRG E9 Pro',
          sku: 'SKU-E9P-WHT',
          requestedQty: 3,
          approvedQty: 0,
          currentStock: 2,
          unitOfMeasure: 'units'
        }
      ],
      timeline: [
        { date: '2026-08-18 15:00', title: 'Requested', desc: 'Requested by Bilal Shah', user: 'Bilal Shah' },
        { date: '2026-08-19 10:00', title: 'Rejected', desc: 'Rejected: Existing floor stock sufficient.', user: 'Central Logistics Lead' }
      ]
    },
    {
      id: 'SR-301',
      requestId: 'SR-301',
      requestNo: 'SR-301',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      requestedBy: 'Ahsan Khan',
      priority: 'Standard',
      needBy: '2026-09-05',
      expected: '05 Sep',
      reason: 'Low showroom stock for expected weekend rush',
      status: 'Pending Approval',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      notes: 'Advance booking replenishment',
      product: 'BRG E-125',
      qty: 5,
      items: [
        {
          product_id: 'PROD-001',
          product: 'BRG E-125',
          sku: 'SKU-E125-RED',
          requestedQty: 5,
          approvedQty: 0,
          currentStock: 1,
          unitOfMeasure: 'units'
        }
      ],
      timeline: [
        { date: '2026-08-28 16:00', title: 'Requested', desc: 'Stock request created by Ahsan Khan', user: 'Ahsan Khan' }
      ]
    }
  ],

  addStockRequest(newSR) {
    const id = newSR.id || newSR.requestId || this.generateDocumentId('stock_request')
    
    // Prevent duplicate lines
    const rawItems = newSR.items || (newSR.product ? [{
      product_id: newSR.product_id || (this.getProductById(newSR.product)?.id) || 'PROD-001',
      product: newSR.product,
      requestedQty: parseInt(newSR.qty || newSR.quantity || 1),
      approvedQty: 0
    }] : [])

    const seenProducts = new Set()
    const deduplicatedItems = []
    for (const item of rawItems) {
      const prodKey = (item.product_id || item.product || '').toLowerCase().trim()
      if (prodKey && !seenProducts.has(prodKey)) {
        seenProducts.add(prodKey)
        deduplicatedItems.push({
          ...item,
          requestedQty: parseInt(item.requestedQty || item.quantity || 1),
          approvedQty: 0
        })
      }
    }

    const srObj = {
      ...newSR,
      id,
      requestId: id,
      requestNo: id,
      branch_id: newSR.branch_id || (this.branches.find(b => b.name === newSR.branch)?.id) || 'BR-01',
      branch: newSR.branch || this.getActiveBranch(),
      requestedBy: newSR.requestedBy || this.currentUser?.name || 'Branch Manager',
      priority: newSR.priority || 'Medium',
      needBy: newSR.needBy || newSR.expected || '31 Aug',
      expected: newSR.expected || newSR.needBy || '31 Aug',
      reason: newSR.reason || 'Replenishment',
      status: newSR.status || 'Pending Approval',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      items: deduplicatedItems,
      product: deduplicatedItems[0]?.product || newSR.product || 'BRG EV',
      qty: deduplicatedItems.reduce((s, it) => s + (it.requestedQty || 0), 0),
      timeline: [
        { date: new Date().toISOString().replace('T', ' ').slice(0, 16), title: 'Request Submitted', desc: `Stock request submitted by ${this.currentUser?.name || 'Branch Manager'}.`, user: this.currentUser?.name || 'Branch Manager' }
      ]
    }
    this.stockRequests.unshift(srObj)

    this.addNotification({
      title: 'New Stock Request Submitted',
      message: `Stock request ${id} (${srObj.qty || 1} units) submitted by ${srObj.branch} branch.`,
      type: 'info',
      priority: 'Normal',
      category: 'Inventory',
      source_type: 'stock_request',
      source_id: id,
      event_type: 'SUBMITTED',
      recipient_role: 'Super Admin',
      branch: srObj.branch,
      link: `/inventory/stock-requests/detail?id=${id}`
    })

    this.addAuditLog({
      action: 'Submitted',
      event_type: 'STOCK_REQUEST_SUBMITTED',
      entity_type: 'stock_request',
      entity_id: id,
      module: 'Inventory',
      branch: srObj.branch,
      description: `Stock request ${id} (${srObj.qty || 1} units) submitted by ${srObj.requestedBy}.`,
      metadata: { requestId: id, branch: srObj.branch, qty: srObj.qty, reason: srObj.reason }
    })

    return srObj
  },

  updateStockRequest(id, updatedData) {
    const index = this.stockRequests.findIndex(s => s.id === id || s.requestId === id)
    if (index !== -1) {
      this.stockRequests[index] = { ...this.stockRequests[index], ...updatedData }
      return this.stockRequests[index]
    }
    return null
  },

  getStockRequestById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.stockRequests.find(s => 
      (s.id && s.id.toLowerCase() === target) ||
      (s.requestId && s.requestId.toLowerCase() === target) ||
      (s.requestNo && s.requestNo.toLowerCase() === target)
    ) || null
  },

  approveStockRequest(id, approvalData = {}) {
    const req = this.getStockRequestById(id)
    if (!req) throw new Error(`Stock Request ${id} not found.`)
    
    req.status = 'Approved'
    req.statusClass = 'bg-[#dcfce7] text-[#165A31]'
    req.approvedBy = approvalData.approvedBy || this.currentUser?.name || 'Central Inventory Lead'
    req.approvedDate = new Date().toISOString().split('T')[0]
    
    if (req.items && req.items.length > 0) {
      req.items.forEach(it => {
        it.approvedQty = it.requestedQty
      })
    }

    if (!req.timeline) req.timeline = []
    req.timeline.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: 'Request Approved',
      desc: approvalData.notes || `Stock request approved by ${req.approvedBy}. Transfer order can now be initiated.`,
      user: req.approvedBy
    })

    this.addNotification({
      title: 'Stock Request Approved',
      message: `Stock request ${req.id} approved by ${req.approvedBy}. Transfer order can now be initiated.`,
      type: 'success',
      priority: 'High',
      category: 'Inventory',
      source_type: 'stock_request',
      source_id: req.id,
      event_type: 'APPROVED',
      recipient_role: 'Branch Manager',
      branch: req.branch,
      link: `/inventory/stock-requests/detail?id=${req.id}`
    })

    this.addAuditLog({
      action: 'Approved',
      event_type: 'STOCK_REQUEST_APPROVED',
      entity_type: 'stock_request',
      entity_id: req.id,
      module: 'Inventory',
      branch: req.branch,
      description: `Stock request ${req.id} approved by ${req.approvedBy}.`,
      metadata: { requestId: req.id, approvedBy: req.approvedBy }
    })

    return req
  },

  rejectStockRequest(id, rejectionReason = '') {
    const req = this.getStockRequestById(id)
    if (!req) throw new Error(`Stock Request ${id} not found.`)
    
    req.status = 'Rejected'
    req.statusClass = 'bg-red-50 text-red-700'
    req.rejectedBy = this.currentUser?.name || 'Central Logistics Lead'
    req.rejectionReason = rejectionReason || 'Request rejected based on regional stock balance review.'
    
    if (!req.timeline) req.timeline = []
    req.timeline.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: 'Request Rejected',
      desc: req.rejectionReason,
      user: req.rejectedBy
    })

    this.addNotification({
      title: 'Stock Request Rejected',
      message: `Stock request ${req.id} rejected: ${req.rejectionReason}`,
      type: 'danger',
      priority: 'High',
      category: 'Inventory',
      source_type: 'stock_request',
      source_id: req.id,
      event_type: 'REJECTED',
      recipient_role: 'Branch Manager',
      branch: req.branch,
      link: `/inventory/stock-requests/detail?id=${req.id}`
    })

    this.addAuditLog({
      action: 'Rejected',
      event_type: 'STOCK_REQUEST_REJECTED',
      entity_type: 'stock_request',
      entity_id: req.id,
      module: 'Inventory',
      branch: req.branch,
      description: `Stock request ${req.id} rejected by ${req.rejectedBy}. Reason: ${req.rejectionReason}`,
      metadata: { requestId: req.id, rejectedBy: req.rejectedBy, reason: req.rejectionReason }
    })

    return req
  },

  // ==========================================
  // 12. CANONICAL PURCHASE ORDER MASTER
  // ==========================================
  purchaseOrders: [
    {
      id: 'PO-2048',
      po: 'PO-2048',
      po_id: 'PO-2048',
      supplier_id: 'SUP-01',
      supplier: 'BRG Factory',
      destination: 'Peshawar',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      amount: 'PKR 2.8M',
      units: '16',
      totalOrdered: 16,
      totalReceived: 0,
      remainingUnits: 16,
      orderDate: '2026-08-11',
      expected: 'Aug 29',
      expectedDate: '2026-08-29',
      carrier: 'Pak Logistics',
      tracking: 'PL-88-2048',
      status: 'In Transit',
      match: 'Matched',
      action: 'Open · Receive',
      items: [
        { product_id: 'PROD-003', product: 'BRG DS11', sku: 'SKU-DS11-BLU', ordered: 8, previouslyReceived: 0, received: 0, cost: 'PKR 146,000', subtotal: 'PKR 1.168M', isSerialized: true },
        { product_id: 'PROD-004', product: 'BRG EV-5', sku: 'SKU-EV5-01', ordered: 5, previouslyReceived: 0, received: 0, cost: 'PKR 168,000', subtotal: 'PKR 840,000', isSerialized: true },
        { product_id: 'PROD-006', product: 'Cargo Pro', sku: 'SKU-CPRO-YEL', ordered: 3, previouslyReceived: 0, received: 0, cost: 'PKR 214,000', subtotal: 'PKR 642,000', isSerialized: true }
      ],
      documents: [
        { name: 'PO-2048.pdf', type: 'Purchase Order', uploaded: 'Aug 12' },
        { name: 'Proforma.pdf', type: 'Supplier', uploaded: 'Aug 10' },
        { name: 'Shipping_Doc.pdf', type: 'Shipment', uploaded: 'Aug 18' }
      ],
      activities: [
        { text: 'Shipment marked In Transit', date: 'Aug 18' },
        { text: 'PO approved', date: 'Aug 12' },
        { text: 'PO submitted', date: 'Aug 11' }
      ]
    },
    {
      id: 'PO-2049',
      po: 'PO-2049',
      po_id: 'PO-2049',
      supplier_id: 'SUP-01',
      supplier: 'BRG Factory',
      destination: 'All Branches',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      amount: 'PKR 4.8M',
      units: '28',
      totalOrdered: 28,
      totalReceived: 0,
      remainingUnits: 28,
      orderDate: '2026-09-01',
      expected: 'Sep 18',
      expectedDate: '2026-09-18',
      carrier: 'Pak Logistics',
      tracking: 'PL-99-2049',
      status: 'Pending Approval',
      match: '—',
      action: 'Open · Approve',
      items: [
        { product_id: 'PROD-001', product: 'BRG E-125', sku: 'SKU-E125-RED', ordered: 14, previouslyReceived: 0, received: 0, cost: 'PKR 170,000', subtotal: 'PKR 2.38M', isSerialized: true },
        { product_id: 'PROD-002', product: 'BRG X7', sku: 'SKU-X7-BLK', ordered: 14, previouslyReceived: 0, received: 0, cost: 'PKR 172,000', subtotal: 'PKR 2.42M', isSerialized: true }
      ]
    },
    {
      id: 'PO-2022',
      po: 'PO-2022',
      po_id: 'PO-2022',
      supplier_id: 'SUP-01',
      supplier: 'BRG Factory',
      destination: 'Islamabad',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      amount: 'PKR 2.2M',
      units: '12',
      totalOrdered: 12,
      totalReceived: 6,
      remainingUnits: 6,
      orderDate: '2026-08-05',
      expected: 'Aug 24',
      expectedDate: '2026-08-24',
      carrier: 'Pak Logistics',
      tracking: 'PL-77-2022',
      status: 'Partially Received',
      match: '6/12',
      action: 'Open · Receive',
      items: [
        { product_id: 'PROD-003', product: 'BRG DS11', sku: 'SKU-DS11-BLU', ordered: 6, previouslyReceived: 4, received: 4, cost: 'PKR 146,000', subtotal: 'PKR 876,000', isSerialized: true },
        { product_id: 'PROD-004', product: 'BRG E9 Pro', sku: 'SKU-E9P-WHT', ordered: 6, previouslyReceived: 2, received: 2, cost: 'PKR 220,000', subtotal: 'PKR 1.32M', isSerialized: true }
      ]
    },
    {
      id: 'PO-2015',
      po: 'PO-2015',
      po_id: 'PO-2015',
      supplier_id: 'SUP-03',
      supplier: 'PowerCell Co.',
      destination: 'Lahore',
      branch_id: 'BR-03',
      branch: 'Lahore',
      amount: 'PKR 1.5M',
      units: '8',
      totalOrdered: 8,
      totalReceived: 8,
      remainingUnits: 0,
      orderDate: '2026-08-01',
      expected: 'Aug 20',
      expectedDate: '2026-08-20',
      carrier: 'Swift Express',
      tracking: 'SE-33-2015',
      status: 'Fully Received',
      match: '8/8',
      action: 'Open',
      items: [
        { product_id: 'PROD-007', product: 'PowerCell 72V 30Ah', sku: 'SKU-BAT-7230', ordered: 8, previouslyReceived: 8, received: 8, cost: 'PKR 85,000', subtotal: 'PKR 680,000', isSerialized: false }
      ]
    },
    {
      id: 'PO-2010',
      po: 'PO-2010',
      po_id: 'PO-2010',
      supplier_id: 'SUP-01',
      supplier: 'BRG Factory',
      destination: 'Peshawar',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      amount: 'PKR 3.1M',
      units: '20',
      totalOrdered: 20,
      totalReceived: 0,
      remainingUnits: 20,
      orderDate: '2026-09-10',
      expected: 'Sep 25',
      expectedDate: '2026-09-25',
      carrier: 'Pak Logistics',
      tracking: 'PL-10-2010',
      status: 'Draft',
      match: '—',
      action: 'Open',
      items: [
        { product_id: 'PROD-001', product: 'BRG E-125', sku: 'SKU-E125-RED', ordered: 10, previouslyReceived: 0, received: 0, cost: 'PKR 155,000', subtotal: 'PKR 1.55M', isSerialized: true },
        { product_id: 'PROD-002', product: 'BRG X7', sku: 'SKU-X7-BLK', ordered: 10, previouslyReceived: 0, received: 0, cost: 'PKR 155,000', subtotal: 'PKR 1.55M', isSerialized: true }
      ]
    },
    {
      id: 'PO-2008',
      po: 'PO-2008',
      po_id: 'PO-2008',
      supplier_id: 'SUP-02',
      supplier: 'Pak Logistics',
      destination: 'Islamabad',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      amount: 'PKR 0.4M',
      units: '10',
      totalOrdered: 10,
      totalReceived: 0,
      remainingUnits: 10,
      orderDate: '2026-08-25',
      expected: 'Sep 05',
      expectedDate: '2026-09-05',
      carrier: 'Pak Logistics',
      tracking: 'PL-08-2008',
      status: 'Approved',
      match: '—',
      action: 'Open',
      items: [
        { product_id: 'PROD-005', product: 'BRG City Pro', sku: 'SKU-CP-GRY', ordered: 10, previouslyReceived: 0, received: 0, cost: 'PKR 40,000', subtotal: 'PKR 400,000', isSerialized: true }
      ]
    }
  ],

  addPurchaseOrder(newPO) {
    const id = newPO.id || newPO.po_id || newPO.po || this.generateDocumentId('po')
    const totalOrdered = newPO.totalOrdered || (newPO.items ? newPO.items.reduce((s, i) => s + (parseInt(i.ordered || i.qty || 0) || 0), 0) : (parseInt(newPO.units) || 0))
    const poObj = {
      ...newPO,
      id,
      po: id,
      po_id: id,
      units: String(totalOrdered || newPO.units || 0),
      totalOrdered: totalOrdered || 0,
      totalReceived: newPO.totalReceived || 0,
      remainingUnits: totalOrdered || 0,
      items: newPO.items || [],
      status: newPO.status || 'Pending Approval'
    }
    this.purchaseOrders.unshift(poObj)

    this.addNotification({
      title: 'New Purchase Order Created',
      message: `Purchase Order ${id} (${poObj.units} units) created for supplier ${poObj.supplier || 'Supplier'}.`,
      type: 'info',
      priority: 'Normal',
      category: 'Procurement',
      source_type: 'purchase_order',
      source_id: id,
      event_type: 'CREATED',
      recipient_role: 'Super Admin',
      branch: poObj.destination || poObj.branch || 'Peshawar',
      link: `/procurement/purchase-orders/detail?id=${id}`
    })

    this.addAuditLog({
      action: 'Created',
      event_type: 'PO_CREATED',
      entity_type: 'purchase_order',
      entity_id: id,
      module: 'Procurement',
      branch: poObj.destination || poObj.branch || 'Peshawar',
      description: `Purchase order ${id} created for supplier ${poObj.supplier || 'Supplier'} (${poObj.units} units).`,
      metadata: { poId: id, supplier: poObj.supplier, units: poObj.units, total: poObj.total }
    })

    return poObj
  },

  updatePurchaseOrder(id, updatedData) {
    const index = this.purchaseOrders.findIndex(p => p.id === id || p.po_id === id || p.po === id)
    if (index !== -1) {
      this.purchaseOrders[index] = { ...this.purchaseOrders[index], ...updatedData }
      return this.purchaseOrders[index]
    }
    return null
  },

  approvePurchaseOrder(id) {
    const po = this.getPurchaseOrderById(id)
    if (!po) return null
    po.status = 'Approved'
    po.approvedBy = this.currentUser?.name || 'Super Admin'
    po.approvedDate = new Date().toISOString().split('T')[0]
    this.addNotification({
      title: 'Purchase Order Approved',
      message: `Purchase Order ${po.id} has been approved by ${po.approvedBy}.`,
      type: 'success',
      priority: 'High',
      category: 'Procurement',
      source_type: 'purchase_order',
      source_id: po.id,
      event_type: 'APPROVED',
      recipient_role: 'Branch Manager',
      branch: po.destination || po.branch || 'Peshawar',
      link: `/procurement/purchase-orders/detail?id=${po.id}`
    })

    this.addAuditLog({
      action: 'Approved',
      event_type: 'PO_APPROVED',
      entity_type: 'purchase_order',
      entity_id: po.id,
      module: 'Procurement',
      branch: po.destination || po.branch || 'Peshawar',
      description: `Purchase order ${po.id} approved by ${po.approvedBy}.`,
      metadata: { poId: po.id, approvedBy: po.approvedBy }
    })

    return po
  },

  rejectPurchaseOrder(id, reason = 'Price or lead time unacceptable') {
    const po = this.getPurchaseOrderById(id)
    if (!po) return null
    po.status = 'Rejected'
    po.rejectedBy = this.currentUser?.name || 'Super Admin'
    po.rejectionReason = reason
    this.addNotification({
      title: 'Purchase Order Rejected',
      message: `Purchase Order ${po.id} was rejected: ${reason}`,
      type: 'danger',
      priority: 'High',
      category: 'Procurement',
      source_type: 'purchase_order',
      source_id: po.id,
      event_type: 'REJECTED',
      recipient_role: 'Branch Manager',
      branch: po.destination || po.branch || 'Peshawar',
      link: `/procurement/purchase-orders/detail?id=${po.id}`
    })

    this.addAuditLog({
      action: 'Rejected',
      event_type: 'PO_REJECTED',
      entity_type: 'purchase_order',
      entity_id: po.id,
      module: 'Procurement',
      branch: po.destination || po.branch || 'Peshawar',
      description: `Purchase order ${po.id} rejected by ${po.rejectedBy}. Reason: ${reason}`,
      metadata: { poId: po.id, rejectedBy: po.rejectedBy, reason }
    })

    return po
  },

  getPurchaseOrderById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.purchaseOrders.find(p => 
      (p.id && p.id.toLowerCase() === target) || 
      (p.po_id && p.po_id.toLowerCase() === target) ||
      (p.po && p.po.toLowerCase() === target)
    ) || null
  },

  // ==========================================
  // 13. CANONICAL GOODS RECEIPT / GRN MASTER
  // ==========================================
  receipts: [
    {
      id: 'GR-991',
      receipt_id: 'GR-991',
      receiptNumber: 'GR-991',
      po_id: 'PO-2015',
      po: 'PO-2015',
      supplier_id: 'SUP-03',
      supplier: 'PowerCell Co.',
      branch_id: 'BR-03',
      branch: 'Lahore',
      receipt_date: '2026-08-20',
      received_by: 'Ali Raza',
      receiver: 'Ali Raza',
      status: 'Posted',
      notes: 'Received complete consignment in warehouse bay 3. Tested battery cells voltage.',
      lines: [
        {
          product_id: 'PROD-007',
          product: 'PowerCell 72V 30Ah',
          sku: 'SKU-BAT-7230',
          ordered_quantity: 8,
          previously_received_quantity: 0,
          current_received_quantity: 8,
          short_quantity: 0,
          excess_quantity: 0,
          damaged_quantity: 0,
          accepted_quantity: 8,
          unit_of_measure: 'units',
          status: 'Complete'
        }
      ],
      serializedUnits: [],
      qcRecords: [
        { serial: 'BATCH-LFP-88', check: 'Voltage & internal resistance check', finding: 'Pass (3.32V/cell balanced)', decision: 'Pass', inspector: 'Ali Raza' }
      ],
      created_at: '2026-08-20T14:32:00Z'
    }
  ],

  getReceiptById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.receipts.find(r => 
      (r.id && r.id.toLowerCase() === target) ||
      (r.receipt_id && r.receipt_id.toLowerCase() === target) ||
      (r.receiptNumber && r.receiptNumber.toLowerCase() === target)
    ) || null
  },

  getReceiptsByPoId(poId) {
    if (!poId) return []
    const target = String(poId).toLowerCase().trim()
    return this.receipts.filter(r => 
      (r.po_id && r.po_id.toLowerCase() === target) ||
      (r.po && r.po.toLowerCase() === target)
    )
  },

  saveReceiptDraft(receiptData) {
    const id = receiptData.id || receiptData.receipt_id || receiptData.receiptNumber || this.generateDocumentId('receipt')
    const existingIndex = this.receipts.findIndex(r => r.id === id || r.receipt_id === id)
    const draftObj = {
      ...receiptData,
      id,
      receipt_id: id,
      receiptNumber: id,
      status: 'Draft',
      created_at: receiptData.created_at || new Date().toISOString()
    }
    if (existingIndex !== -1) {
      this.receipts[existingIndex] = draftObj
    } else {
      this.receipts.unshift(draftObj)
    }
    return { success: true, receipt: draftObj }
  },

  postReceipt({ receiptData, updateInventory = true }) {
    // 1. Validate PO exists
    const po = this.getPurchaseOrderById(receiptData.po_id || receiptData.po)
    if (!po) {
      throw new Error(`Purchase order ${receiptData.po_id || receiptData.po} not found.`)
    }

    // 2. Validate branch authorization
    if (!this.isBranchAllowed(po.destination || po.branch)) {
      throw new Error(`Unauthorized branch: User is not authorized to receive PO for ${po.destination || po.branch}.`)
    }

    // 3. Validate PO is not already fully received
    if ((po.status === 'Fully Received' || po.status === 'Received') && po.remainingUnits <= 0) {
      throw new Error(`Purchase order ${po.po} is already fully received.`)
    }

    // 4. Validate lines
    const lines = receiptData.lines || []
    if (lines.length === 0) {
      throw new Error('Receipt must contain at least one line item.')
    }

    // 5. Validate serial units & prevent duplicate VINs / Chassis
    const serializedUnitsPayload = receiptData.serializedUnits || []
    const seenSerials = new Set()
    for (const unit of serializedUnitsPayload) {
      const serialKey = (unit.chassis || unit.serial || unit.vin || '').trim().toLowerCase()
      if (serialKey) {
        if (seenSerials.has(serialKey)) {
          throw new Error(`Duplicate identifier in receipt: ${unit.chassis || unit.serial || unit.vin}`)
        }
        seenSerials.add(serialKey)

        // Check against existing units in store
        const existingUnit = this.getUnitById(unit.chassis || unit.serial || unit.vin)
        if (existingUnit) {
          throw new Error(`Serialized unit identifier already exists in system: ${unit.chassis || unit.serial || unit.vin}`)
        }
      }
    }

    // 6. Create GRN / Receipt Record
    const receiptId = receiptData.id || receiptData.receipt_id || receiptData.receiptNumber || this.generateDocumentId('receipt')
    const receiptObj = {
      ...receiptData,
      id: receiptId,
      receipt_id: receiptId,
      receiptNumber: receiptId,
      po_id: po.po_id || po.po,
      po: po.po_id || po.po,
      supplier_id: po.supplier_id,
      supplier: po.supplier,
      branch_id: po.branch_id || 'BR-01',
      branch: po.destination || po.branch || 'Peshawar',
      receipt_date: receiptData.receipt_date || new Date().toISOString().split('T')[0],
      received_by: receiptData.received_by || this.currentUser?.name || 'Store Officer',
      receiver: receiptData.received_by || this.currentUser?.name || 'Store Officer',
      status: 'Posted',
      notes: receiptData.notes || 'Goods receipt verified and posted into branch inventory.',
      lines: lines.map(line => {
        const ordered = parseInt(line.ordered_quantity ?? line.ordered ?? line.orderedQty ?? 0)
        const prev = parseInt(line.previously_received_quantity ?? line.previouslyReceived ?? line.previouslyReceivedQty ?? 0)
        const outstanding = Math.max(0, ordered - prev)
        const currentRec = parseInt(line.current_received_quantity ?? line.currentReceived ?? line.receivedQty ?? line.received ?? 0)
        const damaged = parseInt(line.damaged_quantity ?? line.damaged ?? line.damagedQty ?? 0)
        const accepted = line.accepted_quantity !== undefined ? parseInt(line.accepted_quantity) : (line.acceptedQty !== undefined ? parseInt(line.acceptedQty) : Math.max(0, currentRec - damaged))
        const shortQty = Math.max(0, outstanding - currentRec)
        const excessQty = Math.max(0, currentRec - outstanding)
        return {
          product_id: line.product_id,
          product: line.product,
          sku: line.sku,
          ordered_quantity: ordered,
          previously_received_quantity: prev,
          current_received_quantity: currentRec,
          short_quantity: shortQty,
          excess_quantity: excessQty,
          damaged_quantity: damaged,
          accepted_quantity: accepted,
          unit_of_measure: line.unit_of_measure || 'units',
          status: shortQty === 0 && excessQty === 0 && damaged === 0 ? 'Complete' : (damaged > 0 ? 'QC Hold' : (shortQty > 0 ? 'Short' : 'Excess')),
          discrepancy_reason: line.discrepancy_reason || ''
        }
      }),
      serializedUnits: serializedUnitsPayload,
      qcRecords: receiptData.qcRecords || [],
      created_at: new Date().toISOString()
    }

    // 7. Update PO Line Quantities and Total Received / Remaining
    let poTotalReceived = 0
    let poTotalOrdered = 0
    
    if (po.items && po.items.length > 0) {
      po.items.forEach(item => {
        const matchingLine = receiptObj.lines.find(l => l.product_id === item.product_id || l.product === item.product || l.sku === item.sku)
        if (matchingLine) {
          item.previouslyReceived = (item.previouslyReceived || 0) + matchingLine.current_received_quantity
          item.received = item.previouslyReceived
        }
        poTotalReceived += (item.received || item.previouslyReceived || 0)
        poTotalOrdered += (item.ordered || 0)
      })
    } else {
      const receiptTotal = receiptObj.lines.reduce((s, l) => s + l.current_received_quantity, 0)
      poTotalReceived = (po.totalReceived || 0) + receiptTotal
      poTotalOrdered = po.totalOrdered || parseInt(po.units) || receiptTotal
    }

    po.totalReceived = poTotalReceived
    po.totalOrdered = poTotalOrdered || po.totalOrdered
    po.remainingUnits = Math.max(0, po.totalOrdered - po.totalReceived)

    // Update PO Status
    if (po.remainingUnits === 0) {
      po.status = 'Fully Received'
      po.match = 'Matched'
      po.action = 'Open'
    } else if (po.totalReceived > 0) {
      po.status = 'Partially Received'
      po.match = `${po.totalReceived}/${po.totalOrdered}`
      po.action = 'Open · Receive'
    }

    // 8. Update Inventory & Serialized Units
    if (updateInventory) {
      // (a) Quantity-based products stock increment
      receiptObj.lines.forEach(line => {
        const prod = this.getProductById(line.product_id) || this.getProductById(line.product)
        if (prod && line.accepted_quantity > 0) {
          const currentStockNum = parseInt(String(prod.stock || '0').replace(/[^\d]/g, '')) || 0
          const newStock = currentStockNum + line.accepted_quantity
          prod.stock = `${newStock} units`
          if (prod.available !== undefined) {
            prod.available += line.accepted_quantity
          } else {
            prod.available = currentStockNum + line.accepted_quantity
          }
          if (prod.total !== undefined) {
            prod.total += line.accepted_quantity
          } else {
            prod.total = prod.available + (prod.reserved || 0)
          }
          const branchKey = (po.destination || po.branch || 'peshawar').toLowerCase().replace(/\s+/g, '')
          if (prod[branchKey] !== undefined) {
            prod[branchKey] += line.accepted_quantity
          } else {
            prod[branchKey] = line.accepted_quantity
          }
        }
      })

      // (b) Create Serialized Units in store
      serializedUnitsPayload.forEach(unit => {
        const isQcHold = unit.qc === 'QC Hold' || unit.condition === 'Damaged' || unit.condition === 'Scratch' || unit.condition === 'Defect'
        const unitId = unit.chassis || unit.serial || unit.vin || `UNIT-${Math.floor(100 + Math.random() * 900)}`
        const newUnitRecord = {
          id: `UNIT-${Math.floor(100 + Math.random() * 900)}`,
          unit_id: unitId,
          serial: unit.serial || unitId,
          chassis: unit.chassis || unitId,
          chassisNumber: unit.chassis || unitId,
          chassisNo: unit.chassis || unitId,
          vin: unit.vin || unit.chassis || unitId,
          motorNumber: unit.motorNumber || '—',
          batteryNumber: unit.batteryNumber || '—',
          product_id: unit.product_id || (this.getProductById(unit.product)?.id) || 'PROD-001',
          product: unit.product || 'BRG EV',
          modelName: unit.product || 'BRG EV',
          branch_id: po.branch_id || 'BR-01',
          branch: po.destination || po.branch || 'Peshawar',
          location: unit.location || (isQcHold ? 'QC Inspection Bay' : 'Showroom Floor'),
          status: isQcHold ? 'QC Hold' : 'Available',
          statusClass: isQcHold ? 'bg-amber-50 text-amber-700' : 'bg-[#dcfce7] text-[#165A31]',
          source: `PO ${po.po}`,
          sourcePo: po.po,
          receipt_id: receiptId,
          condition: unit.condition || 'Good',
          qc: unit.qc || (isQcHold ? 'QC Hold' : 'Pass'),
          receivedDate: receiptObj.receipt_date,
          warrantyExpiry: '2028-08-30'
        }
        this.serializedUnits.unshift(newUnitRecord)
      })
    }

    // Save to receipts array
    this.receipts.unshift(receiptObj)
    this.reconcileInventoryTotals()

    this.addNotification({
      title: 'Goods Receipt Posted',
      message: `Goods receipt ${receiptObj.id} posted for PO ${po.id || po.po} (${po.totalReceived}/${po.totalOrdered} units received).`,
      type: 'info',
      priority: 'Normal',
      category: 'Procurement',
      source_type: 'purchase_order',
      source_id: po.id || po.po,
      event_type: 'GOODS_RECEIVED',
      recipient_role: 'Super Admin',
      branch: receiptObj.branch,
      link: `/procurement/receipts/detail?id=${receiptObj.id}`
    })

    this.addAuditLog({
      action: 'Goods Received',
      event_type: 'GRN_POSTED',
      entity_type: 'goods_receipt',
      entity_id: receiptObj.id,
      module: 'Procurement',
      branch: receiptObj.branch,
      description: `Goods receipt ${receiptObj.id} posted for PO ${po.id || po.po} (${po.totalReceived}/${po.totalOrdered} units received).`,
      metadata: { receiptId: receiptObj.id, poId: po.id || po.po, supplier: po.supplier, linesCount: receiptObj.lines.length }
    })

    return {
      success: true,
      receipt: receiptObj,
      po
    }
  },

  // ==========================================
  // 14. CANONICAL TRANSFERS MASTER
  // ==========================================
  transfers: [
    {
      id: 'TR-221',
      transfer_id: 'TR-221',
      transferNumber: 'TR-221',
      fromBranch_id: 'BR-02',
      from: 'Islamabad',
      toBranch_id: 'BR-01',
      to: 'Peshawar',
      units: '4',
      totalUnits: 4,
      requestedBy: 'Ahsan Khan',
      approvedBy: 'Central Logistics Lead',
      dispatchedBy: 'Islamabad Depot',
      carrier: 'Internal logistics / AJ Logistics Truck #4',
      dispatched: '2026-08-27',
      expectedArrival: '2026-08-29',
      status: 'In Transit',
      statusClass: 'bg-blue-50 text-blue-700',
      notes: 'Urgent showroom replenishment for customer test rides',
      product: 'BRG DS11',
      items: [
        {
          product_id: 'PROD-003',
          product: 'BRG DS11',
          sku: 'SKU-DS11-BLU',
          requestedQty: 4,
          dispatchedQty: 4,
          receivedQty: 0,
          damagedQty: 0,
          shortQty: 0,
          isSerialized: true,
          serials: ['DS11-01004', 'DS11-01005', 'DS11-01006', 'DS11-01007']
        }
      ],
      timeline: [
        { date: '2026-08-27 10:00', title: 'Transfer Requested', desc: 'Transfer requested by Ahsan Khan (Peshawar)', user: 'Ahsan Khan' },
        { date: '2026-08-27 12:30', title: 'Transfer Approved', desc: 'Approved by Central Logistics Lead', user: 'Central Logistics Lead' },
        { date: '2026-08-27 17:40', title: 'Dispatched', desc: 'Dispatched 4 units via AJ Logistics Truck #4 (Tracking: TRK-88219)', user: 'Islamabad Depot' }
      ]
    },
    {
      id: 'TR-219',
      transfer_id: 'TR-219',
      transferNumber: 'TR-219',
      fromBranch_id: 'BR-01',
      from: 'Peshawar',
      toBranch_id: 'BR-03',
      to: 'Lahore',
      units: '2',
      totalUnits: 2,
      requestedBy: 'Ali Raza',
      approvedBy: 'Central Inventory Lead',
      dispatchedBy: 'Peshawar Depot',
      carrier: 'Pak Logistics Express',
      dispatched: '2026-08-20',
      expectedArrival: '2026-08-22',
      receivedDate: '2026-08-22',
      status: 'Received',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      notes: 'Showroom display unit reallocation',
      product: 'BRG E-125',
      items: [
        {
          product_id: 'PROD-001',
          product: 'BRG E-125',
          sku: 'SKU-E125-RED',
          requestedQty: 2,
          dispatchedQty: 2,
          receivedQty: 2,
          damagedQty: 0,
          shortQty: 0,
          isSerialized: true,
          serials: ['E125-00192', 'E125-00193']
        }
      ],
      timeline: [
        { date: '2026-08-20 09:00', title: 'Transfer Requested', desc: 'Requested by Ali Raza', user: 'Ali Raza' },
        { date: '2026-08-20 11:15', title: 'Approved & Dispatched', desc: 'Dispatched from Peshawar Depot', user: 'Ahsan Khan' },
        { date: '2026-08-22 14:00', title: 'Received & Inspected', desc: 'Received in full at Lahore Showroom', user: 'Ali Raza' }
      ]
    },
    {
      id: 'TR-224',
      transfer_id: 'TR-224',
      transferNumber: 'TR-224',
      fromBranch_id: 'BR-01',
      from: 'Peshawar',
      toBranch_id: 'BR-02',
      to: 'Islamabad',
      units: '10',
      totalUnits: 10,
      requestedBy: 'Bilal Shah',
      approvedBy: 'Central Logistics Lead',
      carrier: 'BRG Dedicated Fleet',
      dispatched: '2026-08-28',
      expectedArrival: '2026-08-30',
      status: 'Approved',
      statusClass: 'bg-[#e0e7ff] text-[#3730a3]',
      notes: 'Replenishment for spare battery stock',
      product: 'PowerCell 72V 30Ah',
      items: [
        {
          product_id: 'PROD-007',
          product: 'PowerCell 72V 30Ah',
          sku: 'SKU-BAT-7230',
          requestedQty: 10,
          dispatchedQty: 10,
          receivedQty: 0,
          damagedQty: 0,
          shortQty: 0,
          isSerialized: false,
          serials: []
        }
      ],
      timeline: [
        { date: '2026-08-28 11:00', title: 'Transfer Requested', desc: 'Requested by Bilal Shah', user: 'Bilal Shah' },
        { date: '2026-08-28 14:30', title: 'Transfer Approved', desc: 'Approved for dispatch by Central Logistics Lead', user: 'Central Logistics Lead' }
      ]
    }
  ],

  getTransferById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.transfers.find(t => 
      (t.id && t.id.toLowerCase() === target) ||
      (t.transfer_id && t.transfer_id.toLowerCase() === target) ||
      (t.transferNumber && t.transferNumber.toLowerCase() === target)
    ) || null
  },

  createTransfer(transferData) {
    return this.addTransfer(transferData)
  },

  addTransfer(transferData) {
    // 1. Source != Destination
    const fromBranch = (transferData.from || transferData.fromBranch || '').trim()
    const toBranch = (transferData.to || transferData.toBranch || '').trim()
    if (!fromBranch || !toBranch) {
      throw new Error('Both origin and destination branches are required.')
    }
    if (fromBranch.toLowerCase() === toBranch.toLowerCase()) {
      throw new Error('Origin and destination branch cannot be the same.')
    }

    // 2. Branch Manager authorization: can only transfer OUT from their branch
    if (this.isBranchUser()) {
      const activeBranch = this.getActiveBranch().toLowerCase()
      if (fromBranch.toLowerCase() !== activeBranch) {
        throw new Error(`Branch Manager is only authorized to initiate transfers from ${this.getActiveBranch()}.`)
      }
    }

    // 3. Process items and validate transferable availability
    const rawItems = transferData.items || []
    if (rawItems.length === 0) {
      // Default from units input if modal only provided units
      const count = parseInt(transferData.units || 1)
      rawItems.push({
        product_id: transferData.product_id || 'PROD-003',
        product: transferData.product || 'BRG DS11',
        sku: transferData.sku || 'SKU-DS11-BLU',
        requestedQty: count,
        dispatchedQty: count,
        receivedQty: 0,
        damagedQty: 0,
        shortQty: 0,
        isSerialized: transferData.isSerialized !== false,
        serials: transferData.serials || []
      })
    }

    // Validate items
    for (const item of rawItems) {
      if (item.isSerialized !== false) {
        if ((!item.serials || item.serials.length === 0) && (transferData.serials || transferData.serializedUnits)) {
          item.serials = [...(transferData.serials || transferData.serializedUnits)]
        }
        // If serials specified, validate each unit exists, belongs to source branch, and is Available
        if (item.serials && item.serials.length > 0) {
          for (const s of item.serials) {
            const unit = this.getUnitById(s)
            if (!unit) {
              throw new Error(`Unit ${s} not found in inventory.`)
            }
            if ((unit.branch || '').toLowerCase() !== fromBranch.toLowerCase()) {
              throw new Error(`Unit ${s} does not belong to origin branch ${fromBranch}. Current branch: ${unit.branch}.`)
            }
            if (unit.status !== 'Available') {
              throw new Error(`Unit ${s} cannot be transferred. Current status: ${unit.status}.`)
            }
          }
        } else {
          // Auto-pick available units from source branch if not manually specified
          const availUnits = this.serializedUnits.filter(u => 
            ((u.product_id && u.product_id === item.product_id) || (u.product && u.product.toLowerCase() === (item.product || '').toLowerCase())) &&
            (u.branch || '').toLowerCase() === fromBranch.toLowerCase() &&
            u.status === 'Available'
          )
          if (availUnits.length < item.requestedQty) {
            throw new Error(`Insufficient available units for ${item.product} at ${fromBranch}. Available: ${availUnits.length}, Requested: ${item.requestedQty}.`)
          }
          item.serials = availUnits.slice(0, item.requestedQty).map(u => u.serial || u.unit_id || u.id)
        }
      } else {
        // Bulk product validation
        const prod = this.getProductById(item.product_id) || this.getProductById(item.product)
        const branchKey = fromBranch.toLowerCase().replace(/\s+/g, '')
        const availCount = prod ? (prod[branchKey] ?? prod.available ?? 0) : 0
        if (availCount < item.requestedQty) {
          throw new Error(`Insufficient bulk quantity for ${item.product} at ${fromBranch}. Available: ${availCount}, Requested: ${item.requestedQty}.`)
        }
      }
    }

    const id = transferData.id || transferData.transfer_id || this.generateDocumentId('transfer')
    const fromBranchObj = this.branches.find(b => b.name.toLowerCase() === fromBranch.toLowerCase())
    const toBranchObj = this.branches.find(b => b.name.toLowerCase() === toBranch.toLowerCase())
    
    const totalUnits = rawItems.reduce((s, it) => s + (it.requestedQty || parseInt(it.count) || 1), 0)

    const transferObj = {
      id,
      transfer_id: id,
      transferNumber: id,
      fromBranch_id: fromBranchObj?.id || 'BR-01',
      from: fromBranch,
      toBranch_id: toBranchObj?.id || 'BR-02',
      to: toBranch,
      units: String(totalUnits),
      totalUnits,
      requestedBy: transferData.requestedBy || this.currentUser?.name || 'Branch Manager',
      approvedBy: transferData.approvedBy || (this.currentUser?.isSuperAdmin ? this.currentUser.name : 'Pending Approval'),
      dispatchedBy: '—',
      carrier: transferData.carrier || 'Internal logistics',
      dispatched: transferData.dispatched || 'Today',
      expectedArrival: transferData.expectedArrival || 'Tomorrow',
      status: transferData.status || (this.currentUser?.isSuperAdmin ? 'Approved' : 'Pending Approval'),
      statusClass: transferData.status === 'In Transit' ? 'bg-blue-50 text-blue-700' : 'bg-[#fef3c7] text-[#b45309]',
      notes: transferData.notes || 'Inter-branch inventory transfer',
      product: rawItems[0]?.product || 'BRG EV',
      items: rawItems,
      timeline: [
        { date: new Date().toISOString().replace('T', ' ').slice(0, 16), title: 'Transfer Created', desc: `Transfer ${id} initiated from ${fromBranch} to ${toBranch}.`, user: this.currentUser?.name || 'Branch Manager' }
      ]
    }

    this.transfers.unshift(transferObj)

    this.addNotification({
      title: 'Inventory Transfer Initiated',
      message: `Transfer ${id} (${totalUnits} units) scheduled from ${fromBranch} to ${toBranch}.`,
      type: 'info',
      priority: 'Normal',
      category: 'Inventory',
      source_type: 'transfer',
      source_id: id,
      event_type: 'CREATED',
      recipient_role: 'Branch Manager',
      branch: toBranch,
      link: `/inventory/transfers/detail?id=${id}`
    })

    this.addAuditLog({
      action: 'Created',
      event_type: 'TRANSFER_CREATED',
      entity_type: 'transfer',
      entity_id: id,
      module: 'Inventory',
      branch: fromBranch,
      description: `Transfer ${id} (${totalUnits} units) scheduled from ${fromBranch} to ${toBranch}.`,
      metadata: { transferId: id, from: fromBranch, to: toBranch, units: totalUnits }
    })

    return transferObj
  },

  updateTransfer(id, updatedData) {
    const index = this.transfers.findIndex(t => t.id === id || t.transfer_id === id)
    if (index !== -1) {
      this.transfers[index] = { ...this.transfers[index], ...updatedData }
      return this.transfers[index]
    }
    return null
  },

  dispatchTransfer(id, dispatchData = {}) {
    const t = this.getTransferById(id)
    if (!t) throw new Error(`Transfer ${id} not found.`)
    if (t.status === 'In Transit') throw new Error(`Transfer ${id} is already dispatched and in transit.`)
    if (t.status === 'Received') throw new Error(`Transfer ${id} has already been completed.`)

    // Branch manager check
    if (this.isBranchUser()) {
      const userBranch = this.getActiveBranch().toLowerCase()
      if (t.from.toLowerCase() !== userBranch) {
        throw new Error(`Only ${t.from} branch manager can dispatch this transfer.`)
      }
    }

    // Mark items in transit
    t.items.forEach(item => {
      if (item.isSerialized) {
        const serials = item.serials || []
        serials.forEach(s => {
          const unit = this.getUnitById(s)
          if (unit) {
            unit.status = 'In Transit'
            unit.statusClass = 'bg-blue-50 text-blue-700'
            unit.location = 'Transfer in Transit'
            unit.updated_at = new Date().toISOString()
            if (!unit.timeline) unit.timeline = []
            unit.timeline.unshift({
              date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              title: 'Dispatched via Transfer',
              desc: `Dispatched in ${t.id} from ${t.from} to ${t.to}.`,
              user: this.currentUser?.name || 'Dispatcher'
            })
          }
        })
      } else {
        // Bulk item: deduct from source branch, add to inTransit
        const prod = this.getProductById(item.product_id) || this.getProductById(item.product)
        if (prod) {
          const fromKey = t.from.toLowerCase().replace(/\s+/g, '')
          const moveQty = item.dispatchedQty || item.requestedQty || 0
          if (prod[fromKey] !== undefined) {
            prod[fromKey] = Math.max(0, prod[fromKey] - moveQty)
          }
          prod.inTransit = (prod.inTransit || 0) + moveQty
        }
      }
    })

    t.status = 'In Transit'
    t.statusClass = 'bg-blue-50 text-blue-700'
    t.dispatched = dispatchData.dispatched || new Date().toISOString().split('T')[0]
    t.carrier = dispatchData.carrier || t.carrier
    t.expectedArrival = dispatchData.expectedArrival || t.expectedArrival
    t.dispatchedBy = this.currentUser?.name || 'Origin Dispatcher'

    if (!t.timeline) t.timeline = []
    t.timeline.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: 'Dispatched',
      desc: `Dispatched from ${t.from} to ${t.to} via ${t.carrier}.`,
      user: t.dispatchedBy
    })

    this.addNotification({
      title: 'Transfer Dispatched',
      message: `Transfer ${t.id} dispatched from ${t.from} to ${t.to} via ${t.carrier}.`,
      type: 'info',
      priority: 'High',
      category: 'Inventory',
      source_type: 'transfer',
      source_id: t.id,
      event_type: 'DISPATCHED',
      recipient_role: 'Branch Manager',
      branch: t.to,
      link: `/inventory/transfers/detail?id=${t.id}`
    })

    this.addAuditLog({
      action: 'Dispatched',
      event_type: 'TRANSFER_DISPATCHED',
      entity_type: 'transfer',
      entity_id: t.id,
      module: 'Inventory',
      branch: t.from,
      description: `Transfer ${t.id} dispatched from ${t.from} to ${t.to} via ${t.carrier}.`,
      metadata: { transferId: t.id, from: t.from, to: t.to, carrier: t.carrier }
    })

    this.reconcileInventoryTotals()
    return t
  },

  receiveTransfer(transferIdOrPayload, options = {}) {
    let transferId, receivedItems, receiverNotes, receiverName
    if (typeof transferIdOrPayload === 'string') {
      transferId = transferIdOrPayload
      receivedItems = options.receivedItems || options.receivedUnits || []
      receiverNotes = options.receiverNotes || options.notes || ''
      receiverName = options.receiverName || ''
    } else {
      ({ transferId, receivedItems = [], receiverNotes = '', receiverName = '' } = (transferIdOrPayload || {}))
    }
    const t = this.getTransferById(transferId)
    if (!t) throw new Error(`Transfer ${transferId} not found.`)
    if (t.status === 'Received') throw new Error(`Transfer ${transferId} is already fully received.`)

    // Branch authorization check
    if (!this.isBranchAllowed(t.to)) {
      throw new Error(`Unauthorized branch: User is not authorized to receive transfers for ${t.to}.`)
    }

    let totalDispatched = 0
    let totalAccumReceived = 0

    t.items.forEach((item, idx) => {
      const userRec = receivedItems.find(r => r.product_id === item.product_id || r.product === item.product) || receivedItems[idx]
      const currRecQty = userRec ? parseInt(userRec.receivedQty ?? userRec.received ?? item.dispatchedQty ?? item.requestedQty) : (item.dispatchedQty || item.requestedQty)
      const damagedQty = userRec ? parseInt(userRec.damagedQty ?? userRec.damaged ?? 0) : 0
      const shortQty = Math.max(0, (item.dispatchedQty || item.requestedQty) - currRecQty)

      // Prevent excess receipt beyond dispatched
      if (currRecQty > (item.dispatchedQty || item.requestedQty)) {
        throw new Error(`Cannot receive ${currRecQty} units for ${item.product}. Maximum dispatched was ${item.dispatchedQty || item.requestedQty}.`)
      }

      item.receivedQty = (item.receivedQty || 0) + currRecQty
      item.damagedQty = (item.damagedQty || 0) + damagedQty
      item.shortQty = shortQty

      totalDispatched += (item.dispatchedQty || item.requestedQty || 0)
      totalAccumReceived += item.receivedQty

      const acceptedQty = Math.max(0, currRecQty - damagedQty)

      // Process serialized units
      if (item.isSerialized) {
        const serials = item.serials || []
        // Apply receipt to the corresponding number of serials
        serials.slice(0, currRecQty).forEach((s, sIdx) => {
          const unit = this.getUnitById(s)
          if (unit) {
            // Prevent receiving same unit twice if already at destination and available
            if ((unit.branch || '').toLowerCase() === t.to.toLowerCase() && unit.status === 'Available') {
              return
            }

            const isThisUnitDamaged = sIdx < damagedQty
            unit.branch = t.to
            unit.branch_id = t.toBranch_id || (this.branches.find(b => b.name === t.to)?.id) || 'BR-01'
            unit.status = isThisUnitDamaged ? 'QC Hold' : 'Available'
            unit.statusClass = isThisUnitDamaged ? 'bg-amber-50 text-amber-700' : 'bg-[#dcfce7] text-[#165A31]'
            unit.location = isThisUnitDamaged ? 'QC Inspection Bay' : 'Showroom Floor'
            unit.condition = isThisUnitDamaged ? 'Damaged in transit' : 'Good'
            unit.updated_at = new Date().toISOString()

            if (!unit.timeline) unit.timeline = []
            unit.timeline.unshift({
              date: new Date().toISOString().replace('T', ' ').slice(0, 16),
              title: `Received at ${t.to}`,
              desc: `Received via Transfer ${t.id}. Status: ${unit.status}.`,
              user: receiverName || this.currentUser?.name || 'Receiver'
            })
          }
        })
      } else {
        // Bulk products update: increase destination branch quantity, deduct from inTransit
        const prod = this.getProductById(item.product_id) || this.getProductById(item.product)
        if (prod) {
          const toKey = t.to.toLowerCase().replace(/\s+/g, '')
          prod[toKey] = (prod[toKey] || 0) + acceptedQty
          if (damagedQty > 0) {
            prod.qcHold = (prod.qcHold || 0) + damagedQty
          }
          prod.inTransit = Math.max(0, (prod.inTransit || 0) - currRecQty)
        }
      }
    })

    const isFullyReceived = totalAccumReceived >= totalDispatched
    t.status = isFullyReceived ? 'Received' : 'Partially Received'
    t.statusClass = isFullyReceived ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#fef3c7] text-[#b45309]'
    t.receivedDate = new Date().toISOString().split('T')[0]
    t.receiverNotes = receiverNotes || t.notes

    if (!t.timeline) t.timeline = []
    t.timeline.unshift({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: isFullyReceived ? 'Transfer Received (Complete)' : 'Partial Transfer Receipt',
      desc: `Received ${totalAccumReceived} of ${totalDispatched} units at ${t.to}.${receiverNotes ? ' Note: ' + receiverNotes : ''}`,
      user: receiverName || this.currentUser?.name || 'Receiver'
    })

    this.addNotification({
      title: isFullyReceived ? 'Transfer Received' : 'Partial Transfer Received',
      message: `Transfer ${t.id} received at ${t.to} (${totalAccumReceived}/${totalDispatched} units).`,
      type: 'success',
      priority: 'Normal',
      category: 'Inventory',
      source_type: 'transfer',
      source_id: t.id,
      event_type: 'RECEIVED',
      recipient_role: 'Super Admin',
      branch: t.to,
      link: `/inventory/transfers/detail?id=${t.id}`
    })

    this.addAuditLog({
      action: isFullyReceived ? 'Received' : 'Partially Received',
      event_type: 'TRANSFER_RECEIVED',
      entity_type: 'transfer',
      entity_id: t.id,
      module: 'Inventory',
      branch: t.to,
      description: `Transfer ${t.id} received at ${t.to} (${totalAccumReceived}/${totalDispatched} units).`,
      metadata: { transferId: t.id, from: t.from, to: t.to, totalReceived: totalAccumReceived, totalDispatched }
    })

    this.reconcileInventoryTotals()
    return t
  },

  // ==========================================
  // 15. CANONICAL STOCK ADJUSTMENTS MASTER
  // ==========================================
  stockAdjustments: [
    {
      id: 'ADJ-018',
      adjustment_id: 'ADJ-018',
      adjustmentNo: 'ADJ-018',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      type: 'Quantity', // Quantity or Status
      product_id: 'PROD-007',
      product: 'PowerCell 72V 30Ah',
      productUnit: 'PowerCell 72V 30Ah',
      unit_id: null,
      old_quantity: 25,
      new_quantity: 23,
      existingState: '25 available',
      correctedState: '23 available',
      difference: -2,
      qtyEffect: '-2',
      reason: 'Physical Count Correction',
      evidence: 'Count_Sheet_Attached.pdf',
      notes: 'Variance detected during quarterly physical stock cycle count.',
      status: 'Pending', // Pending, Approved, Rejected
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      adjusted_by: 'Ahsan Khan',
      requestedBy: 'Ahsan Khan',
      date: '2026-08-28',
      actionText: 'Review'
    },
    {
      id: 'ADJ-016',
      adjustment_id: 'ADJ-016',
      adjustmentNo: 'ADJ-016',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      type: 'Status',
      product_id: 'PROD-003',
      product: 'BRG DS11',
      productUnit: 'DS11-01001',
      unit_id: 'DS11-01001',
      old_quantity: 'Available',
      new_quantity: 'QC Hold',
      existingState: 'Available',
      correctedState: 'QC Hold',
      difference: 0,
      qtyEffect: '0',
      reason: 'QC Reclassification',
      evidence: 'QC_Defect_Form.pdf',
      notes: 'Shifted to QC zone due to minor transit scratch on body panel.',
      status: 'Approved',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      adjusted_by: 'Ahsan Khan',
      approvedBy: 'Branch Manager & HQ',
      requestedBy: 'Ahsan Khan',
      date: '2026-08-27',
      actionText: 'Open'
    },
    {
      id: 'ADJ-021',
      adjustment_id: 'ADJ-021',
      adjustmentNo: 'ADJ-021',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      type: 'Quantity',
      product_id: 'PROD-004',
      product: 'BRG E9 Pro',
      productUnit: 'BRG E9 Pro',
      unit_id: null,
      old_quantity: 14,
      new_quantity: 15,
      existingState: '14 available',
      correctedState: '15 available',
      difference: 1,
      qtyEffect: '+1',
      reason: 'Found Stock',
      evidence: 'Unpack_Manifest.pdf',
      notes: 'One unrecorded unit identified during bay reorganization.',
      status: 'Pending',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      adjusted_by: 'Bilal Shah',
      requestedBy: 'Bilal Shah',
      date: '2026-08-28',
      actionText: 'Review'
    }
  ],

  getAdjustmentById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.stockAdjustments.find(a => 
      (a.id && a.id.toLowerCase() === target) ||
      (a.adjustment_id && a.adjustment_id.toLowerCase() === target) ||
      (a.adjustmentNo && a.adjustmentNo.toLowerCase() === target)
    ) || null
  },

  addStockAdjustment(data) {
    // Reason validation
    const validReasons = [
      'Physical Count Correction',
      'Damage',
      'Loss',
      'Found Stock',
      'Data Correction',
      'QC Reclassification'
    ]
    const reason = (data.reason || '').trim()
    if (!reason) {
      throw new Error('Adjustment reason is required.')
    }

    const id = data.id || data.adjustment_id || `ADJ-${Math.floor(222 + Math.random() * 100)}`
    const type = data.type || (data.unit_id ? 'Status' : 'Quantity')
    
    let difference = 0
    if (type === 'Quantity') {
      const oldQ = parseInt(data.old_quantity ?? data.existingState ?? data.before ?? 0)
      const newQ = parseInt(data.new_quantity ?? data.correctedState ?? data.after ?? 0)
      difference = data.difference !== undefined ? Number(data.difference) : (newQ - oldQ)
    }

    const adjObj = {
      ...data,
      id,
      adjustment_id: id,
      adjustmentNo: id,
      branch_id: data.branch_id || (this.branches.find(b => b.name === data.branch)?.id) || 'BR-01',
      branch: data.branch || this.getActiveBranch(),
      type,
      product_id: data.product_id || data.productId || '',
      product: data.product || data.productUnit || 'BRG EV',
      productUnit: data.productUnit || data.product || 'BRG EV',
      unit_id: data.unit_id || null,
      old_quantity: data.old_quantity ?? data.existingState ?? data.before ?? 0,
      new_quantity: data.new_quantity ?? data.correctedState ?? data.after ?? 0,
      existingState: String(data.existingState ?? data.old_quantity ?? data.before ?? ''),
      correctedState: String(data.correctedState ?? data.new_quantity ?? data.after ?? ''),
      difference,
      qtyEffect: difference > 0 ? `+${difference}` : String(difference),
      reason,
      evidence: data.evidence || 'Document attached',
      notes: data.notes || '',
      status: data.status || 'Pending',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      adjusted_by: this.currentUser?.name || 'Branch Manager',
      requestedBy: this.currentUser?.name || 'Branch Manager',
      date: new Date().toISOString().split('T')[0]
    }

    this.stockAdjustments.unshift(adjObj)
    return adjObj
  },

  approveStockAdjustment(id) {
    const adj = this.getAdjustmentById(id)
    if (!adj) throw new Error(`Stock Adjustment ${id} not found.`)
    if (adj.status === 'Approved') throw new Error(`Stock Adjustment ${id} is already approved and posted.`)

    // Apply ledger impact to canonical inventory
    if (adj.type === 'Quantity') {
      const prod = this.getProductById(adj.product_id) || this.getProductById(adj.product)
      if (prod) {
        const branchKey = (adj.branch || 'peshawar').toLowerCase().replace(/\s+/g, '')
        const diff = parseInt(adj.difference || 0)
        if (prod[branchKey] !== undefined) {
          prod[branchKey] = Math.max(0, prod[branchKey] + diff)
        }
        prod.total = Math.max(0, (prod.total || 0) + diff)
        prod.available = Math.max(0, (prod.available || 0) + diff)
        prod.stock = `${prod.total} units`
      }
    } else if (adj.type === 'Status') {
      const targetUnitId = adj.unit_id || adj.productUnit
      const unit = this.getUnitById(targetUnitId)
      if (unit) {
        const targetStatus = adj.new_quantity || adj.correctedState || 'QC Hold'
        // Direct Sold adjustment is rejected
        if (targetStatus === 'Sold') {
          throw new Error('Stock adjustment cannot directly mark a unit as Sold.')
        }
        unit.status = targetStatus
        unit.statusClass = targetStatus === 'QC Hold' ? 'bg-amber-50 text-amber-700' : (targetStatus === 'Available' ? 'bg-[#dcfce7] text-[#165A31]' : 'bg-[#e0e7ff] text-[#3730a3]')
        unit.location = targetStatus === 'QC Hold' ? 'QC Inspection Bay' : 'Showroom Floor'
        unit.updated_at = new Date().toISOString()
        if (!unit.timeline) unit.timeline = []
        unit.timeline.unshift({
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          title: `Status Adjusted (${adj.id})`,
          desc: `Reclassified to ${targetStatus}. Reason: ${adj.reason}.`,
          user: this.currentUser?.name || 'Branch Manager & HQ'
        })
      }
    }

    adj.status = 'Approved'
    adj.statusClass = 'bg-[#dcfce7] text-[#165A31]'
    adj.approvedBy = this.currentUser?.name || 'Branch Manager & HQ'

    this.reconcileInventoryTotals()
    return adj
  },

  rejectStockAdjustment(id, reason = '') {
    const adj = this.getAdjustmentById(id)
    if (!adj) throw new Error(`Stock Adjustment ${id} not found.`)
    
    adj.status = 'Rejected'
    adj.statusClass = 'bg-red-50 text-red-700'
    adj.rejectionReason = reason || 'Physical recount requested.'
    return adj
  },

  salesReturns: [
    {
      id: 'RET-104',
      returnNo: 'RET-104',
      order_id: 'ORD-2188',
      order: 'ORD-2188',
      orderNo: 'ORD-2188',
      customer_id: 'CUST-107',
      customer: 'Noman Ali',
      unit_id: 'CH 8-BRG-26-01731',
      unit: 'CH 8-BRG-26-01731',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      reason: 'Battery Issue',
      requested: 'Exchange',
      status: 'Inspection',
      statusClass: 'bg-orange-50 text-orange-700',
      statusColor: 'bg-orange-50 text-orange-700'
    },
    {
      id: 'RET-102',
      returnNo: 'RET-102',
      order_id: 'ORD-2140',
      order: 'ORD-2140',
      orderNo: 'ORD-2140',
      customer_id: 'CUST-108',
      customer: 'Kamran Tariq',
      unit_id: 'EV5-00398',
      unit: 'EV5-00398',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      reason: 'Performance Issue',
      requested: 'Refund',
      status: 'Approval',
      statusClass: 'bg-blue-50 text-blue-700',
      statusColor: 'bg-blue-50 text-blue-700'
    },
    {
      id: 'RET-098',
      returnNo: 'RET-098',
      order_id: 'ORD-2095',
      order: 'ORD-2095',
      orderNo: 'ORD-2095',
      customer_id: 'CUST-109',
      customer: 'Usman Ghani',
      unit_id: 'DS11-00844',
      unit: 'DS11-00844',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      reason: 'Wrong Specification',
      requested: 'Exchange',
      status: 'Completed',
      statusClass: 'bg-[#eefcf2] text-[#165A31]',
      statusColor: 'bg-[#eefcf2] text-[#165A31]'
    },
    {
      id: 'RET-311',
      returnNo: 'RET-311',
      order_id: 'SO-7702',
      order: 'SO-7702',
      orderNo: 'SO-7702',
      customer_id: 'CUST-102',
      customer: 'M. Bilal',
      unit_id: 'EV5-00398',
      unit: 'EV5-00398',
      branch_id: 'BR-03',
      branch: 'Lahore',
      reason: 'Performance Issue',
      requested: 'Inspection',
      status: 'Inspection',
      statusClass: 'bg-orange-50 text-orange-700',
      statusColor: 'bg-orange-50 text-orange-700'
    },
    {
      id: 'RET-304',
      returnNo: 'RET-304',
      order_id: 'SO-7655',
      order: 'SO-7655',
      orderNo: 'SO-7655',
      customer_id: 'CUST-103',
      customer: 'Faisal Khan',
      unit_id: 'DS11-00911',
      unit: 'DS11-00911',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      reason: 'Exchange',
      requested: 'Exchange',
      status: 'Completed',
      statusClass: 'bg-[#eefcf2] text-[#165A31]',
      statusColor: 'bg-[#eefcf2] text-[#165A31]'
    },
    {
      id: 'RET-299',
      returnNo: 'RET-299',
      order_id: 'SO-7612',
      order: 'SO-7612',
      orderNo: 'SO-7612',
      customer_id: 'CUST-110',
      customer: 'Saad Ahmad',
      unit_id: 'DS11-00844',
      unit: 'DS11-00844',
      branch_id: 'BR-02',
      branch: 'Islamabad',
      reason: 'Wrong Specification',
      requested: 'Refund',
      status: 'Refund Approved',
      statusClass: 'bg-blue-50 text-blue-700',
      statusColor: 'bg-blue-50 text-blue-700'
    }
  ],

  addSalesReturn(newRet) {
    const id = newRet.id || newRet.returnNo || `RET-${Math.floor(105 + Math.random() * 100)}`
    const retObj = {
      ...newRet,
      id,
      returnNo: id,
      status: newRet.status || 'Inspection',
      statusClass: newRet.statusClass || 'bg-orange-50 text-orange-700'
    }
    this.salesReturns.unshift(retObj)
    return retObj
  },

  updateSalesReturn(id, updatedData) {
    const index = this.salesReturns.findIndex(r => r.id === id || r.returnNo === id)
    if (index !== -1) {
      this.salesReturns[index] = { ...this.salesReturns[index], ...updatedData }
      return this.salesReturns[index]
    }
    return null
  },

  getSalesReturnById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.salesReturns.find(r => 
      (r.id && r.id.toLowerCase() === target) ||
      (r.returnNo && r.returnNo.toLowerCase() === target)
    ) || null
  },

  purchaseReturns: [
    {
      id: 'PRTN-041',
      returnNo: 'PRTN-041',
      supplier_id: 'SUP-01',
      supplier: 'BRG Factory',
      po_id: 'PO-1961',
      po: 'PO-1961',
      units: '1',
      reason: 'Transit damage',
      credit: '152K',
      status: 'Closed'
    },
    {
      id: 'PRTN-044',
      returnNo: 'PRTN-044',
      supplier_id: 'SUP-01',
      supplier: 'BRG Factory',
      po_id: 'PO-2022',
      po: 'PO-2022',
      units: '2',
      reason: 'QC failure',
      credit: '336K',
      status: 'Approved'
    },
    {
      id: 'PRTN-045',
      returnNo: 'PRTN-045',
      supplier_id: 'SUP-03',
      supplier: 'PowerCell Co.',
      po_id: 'PO-1980',
      po: 'PO-1980',
      units: '4',
      reason: 'Battery voltage defect',
      credit: '240K',
      status: 'Shipped'
    },
    {
      id: 'PRTN-046',
      returnNo: 'PRTN-046',
      supplier_id: 'SUP-02',
      supplier: 'Pak Logistics',
      po_id: 'PO-1990',
      po: 'PO-1990',
      units: '1',
      reason: 'Wrong packaging',
      credit: '50K',
      status: 'Draft'
    }
  ],

  addPurchaseReturn(newPR) {
    const id = newPR.id || newPR.returnNo || `PRTN-${Math.floor(45 + Math.random() * 100)}`
    const prObj = {
      ...newPR,
      id,
      returnNo: id,
      status: newPR.status || 'Approved'
    }
    this.purchaseReturns.unshift(prObj)
    return prObj
  },

  updatePurchaseReturn(id, updatedData) {
    const index = this.purchaseReturns.findIndex(r => r.id === id || r.returnNo === id)
    if (index !== -1) {
      this.purchaseReturns[index] = { ...this.purchaseReturns[index], ...updatedData }
      return this.purchaseReturns[index]
    }
    return null
  },

  getPurchaseReturnById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.purchaseReturns.find(r => 
      (r.id && r.id.toLowerCase() === target) ||
      (r.returnNo && r.returnNo.toLowerCase() === target)
    ) || null
  },

  // ==========================================
  // 10. EXPENSES DATA & MUTATORS
  // ==========================================
  expenses: [
    { 
      id: 'EXP-402', 
      branch_id: 'BR-01',
      branch: 'Peshawar', 
      category: 'Utilities', 
      vendor_id: 'PESCO',
      vendor: 'PESCO', 
      amount: 'PKR 48,500', 
      rawAmount: '48,500',
      date: '27 Aug', 
      fullDate: '27 Aug 2026',
      approval: 'Pending', 
      approvalClass: 'bg-[#fef3c7] text-[#92400e]', 
      payment: 'Unpaid', 
      paymentClass: 'text-gray-900 font-medium',
      branchLimit: 'PKR 100K',
      decision: 'Awaiting management',
      paymentMethod: 'Bank',
      description: 'Branch electricity bill',
      receiptFile: 'pescobill_aug.pdf',
      receiptType: 'PDF Document',
      submittedBy: 'Branch Manager',
      lastUpdate: 'Today 08:20',
      notes: 'Submit for approval'
    },
    { 
      id: 'EXP-398', 
      branch_id: 'BR-01',
      branch: 'Peshawar', 
      category: 'Transport', 
      vendor_id: 'SUP-02',
      vendor: 'Pak Logistics', 
      amount: 'PKR 18,000', 
      rawAmount: '18,000',
      date: '25 Aug', 
      fullDate: '25 Aug 2026',
      approval: 'Approved', 
      approvalClass: 'bg-[#dcfce7] text-[#15803d]', 
      payment: 'Paid', 
      paymentClass: 'text-[#165A31] font-bold',
      branchLimit: 'PKR 100K',
      decision: 'Approved by Branch Policy',
      paymentMethod: 'Bank',
      description: 'Local showroom delivery transport charges',
      receiptFile: 'transport_receipt_398.pdf',
      receiptType: 'PDF Document',
      submittedBy: 'Branch Manager',
      lastUpdate: '25 Aug 16:40',
      notes: 'Standard transport expense'
    },
    { 
      id: 'EXP-8831', 
      branch_id: 'BR-02',
      branch: 'Islamabad', 
      category: 'Logistics', 
      vendor_id: 'SUP-02',
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
      branch_id: 'BR-01',
      branch: 'Peshawar', 
      category: 'Maintenance', 
      vendor_id: 'City Workshop',
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
    const id = newExpense.id || newExpense.expense_id || this.generateDocumentId('expense')
    const expObj = {
      ...newExpense,
      id,
      expense_id: id,
      branch: newExpense.branch || this.getActiveBranch(),
      status: newExpense.status || 'Pending Approval'
    }
    this.expenses.unshift(expObj)
    this.selectedExpense = expObj

    this.addNotification({
      title: 'New Expense Submitted',
      message: `Expense ${id} (${expObj.category || 'General'} - PKR ${expObj.amount || '0'}) submitted for ${expObj.branch} showroom.`,
      type: 'info',
      priority: 'Normal',
      category: 'Finance',
      source_type: 'expense',
      source_id: id,
      event_type: 'SUBMITTED',
      recipient_role: 'Super Admin',
      branch: expObj.branch,
      link: `/finance/expenses/detail?id=${id}`
    })

    this.addAuditLog({
      action: 'Submitted',
      event_type: 'EXPENSE_SUBMITTED',
      entity_type: 'expense',
      entity_id: id,
      module: 'Finance',
      branch: expObj.branch,
      description: `Expense ${id} (${expObj.category || 'General'} - PKR ${expObj.amount || '0'}) submitted for ${expObj.branch}.`,
      metadata: { expenseId: id, category: expObj.category, amount: expObj.amount, branch: expObj.branch }
    })

    return expObj
  },

  updateExpense(id, updatedData) {
    const index = this.expenses.findIndex(e => e.id === id)
    if (index !== -1) {
      this.expenses[index] = { ...this.expenses[index], ...updatedData }
      return this.expenses[index]
    }
    return null
  },

  approveExpense(id) {
    const exp = this.getExpenseById(id)
    if (!exp) return null
    exp.status = 'Approved'
    exp.approvedBy = this.currentUser?.name || 'Super Admin'
    exp.approvedDate = new Date().toISOString().split('T')[0]
    this.addNotification({
      title: 'Expense Approved',
      message: `Expense ${exp.id} (${exp.category} - PKR ${exp.amount}) approved by ${exp.approvedBy}.`,
      type: 'success',
      priority: 'Normal',
      category: 'Finance',
      source_type: 'expense',
      source_id: exp.id,
      event_type: 'APPROVED',
      recipient_role: 'Branch Manager',
      branch: exp.branch || 'Peshawar',
      link: `/finance/expenses/detail?id=${exp.id}`
    })

    this.addAuditLog({
      action: 'Approved',
      event_type: 'EXPENSE_APPROVED',
      entity_type: 'expense',
      entity_id: exp.id,
      module: 'Finance',
      branch: exp.branch || 'Peshawar',
      description: `Expense ${exp.id} (${exp.category} - PKR ${exp.amount}) approved by ${exp.approvedBy}.`,
      metadata: { expenseId: exp.id, approvedBy: exp.approvedBy, amount: exp.amount }
    })

    return exp
  },

  rejectExpense(id, reason = 'Exceeds monthly branch allocation') {
    const exp = this.getExpenseById(id)
    if (!exp) return null
    exp.status = 'Rejected'
    exp.rejectedBy = this.currentUser?.name || 'Super Admin'
    exp.rejectionReason = reason
    this.addNotification({
      title: 'Expense Rejected',
      message: `Expense ${exp.id} was rejected: ${reason}`,
      type: 'danger',
      priority: 'High',
      category: 'Finance',
      source_type: 'expense',
      source_id: exp.id,
      event_type: 'REJECTED',
      recipient_role: 'Branch Manager',
      branch: exp.branch || 'Peshawar',
      link: `/finance/expenses/detail?id=${exp.id}`
    })

    this.addAuditLog({
      action: 'Rejected',
      event_type: 'EXPENSE_REJECTED',
      entity_type: 'expense',
      entity_id: exp.id,
      module: 'Finance',
      branch: exp.branch || 'Peshawar',
      description: `Expense ${exp.id} rejected. Reason: ${reason}`,
      metadata: { expenseId: exp.id, rejectedBy: exp.rejectedBy, reason }
    })

    return exp
  },

  getExpenseById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.expenses.find(e => e.id && e.id.toLowerCase() === target) || null
  },

  // ==========================================
  // 11. COMMUNICATIONS & NOTIFICATIONS
  // ==========================================
  conversations: [
    { 
      id: 'SR-122', 
      title: 'Inter-Branch Stock Transfer Coordination', 
      subtitle: 'Conversation — Stock Request SR-122 (Peshawar & Lahore)', 
      thread: 'Inter-Branch Stock Transfer Coordination', 
      branch_id: 'BR-01',
      branch: 'Peshawar', 
      customer_id: null,
      customer: null,
      linked: 'SR-122', 
      linkedType: 'Stock Request',
      from: 'Super Admin', 
      lastMsg: 'Lahore dispatch authorized for 5x BRG E-125 units via Carrier TR-401.', 
      priority: 'High', 
      priorityClass: 'bg-[#fff7ed] text-[#ea580c]', 
      unread: 1, 
      status: 'Open',
      statusClass: 'bg-emerald-50 text-emerald-700 font-bold',
      date: 'Today 11:42',
      participants: 'Ahsan Khan (Peshawar), Sami Ullah (Lahore), Super Admin (Head Office)',
      owner: 'Branch Manager (Peshawar)',
      created: 'Yesterday',
      replies: 4,
      participantsList: [
        { name: 'Ahsan Khan', role: 'Branch Manager', branch: 'Peshawar', branch_id: 'BR-01', scope: 'Requesting Showroom' },
        { name: 'Sami Ullah', role: 'Branch Manager', branch: 'Lahore', branch_id: 'BR-03', scope: 'Supplying Showroom' },
        { name: 'Super Admin', role: 'Head Office Executive', branch: 'All Branches', branch_id: 'HQ', scope: 'Authorizing Authority' },
        { name: 'Tariq Mehmood', role: 'Logistics Lead', branch: 'Central Warehouse', branch_id: 'CWH', scope: 'Carrier Fleet Dispatch' }
      ],
      attachments: [
        {
          id: 'att-101',
          name: 'customer_requirement_sr122.pdf',
          size: '245 KB',
          type: 'Adobe PDF Document',
          uploadedBy: 'Ahsan Khan (Branch Manager — Peshawar)',
          branch: 'Peshawar',
          date: 'Yesterday 09:30 AM',
          scope: 'Customer Booking Evidence'
        },
        {
          id: 'att-102',
          name: 'signed_sales_order_ORD2241.pdf',
          size: '512 KB',
          type: 'Adobe PDF Document',
          uploadedBy: 'Ahsan Khan (Branch Manager — Peshawar)',
          branch: 'Peshawar',
          date: 'Yesterday 10:15 AM',
          scope: 'Advance Deposit Clearance'
        },
        {
          id: 'att-103',
          name: 'lahore_transfer_dispatch_slip.pdf',
          size: '380 KB',
          type: 'Adobe PDF Document',
          uploadedBy: 'Sami Ullah (Branch Manager — Lahore)',
          branch: 'Lahore',
          date: 'Today 10:45 AM',
          scope: 'Inter-Branch Stock Dispatch Slip'
        },
        {
          id: 'att-104',
          name: 'hq_allocation_approval_memo.pdf',
          size: '185 KB',
          type: 'Adobe PDF Document',
          uploadedBy: 'Super Admin (Head Office)',
          branch: 'All Branches',
          date: 'Today 11:30 AM',
          scope: 'Executive Transfer Authorization'
        }
      ],
      messages: [
        { 
          id: 'msg-1', 
          from: 'Ahsan Khan', 
          sender: 'Ahsan Khan (Branch Manager — Peshawar)', 
          role: 'Peshawar Branch', 
          branch: 'Peshawar', 
          time: 'Yesterday 09:30 AM', 
          date: 'Yesterday 09:30', 
          body: 'Stock request SR-122 submitted for 5 units of BRG E-125 to fulfill urgent customer booking deposits.', 
          text: 'Stock request SR-122 submitted for 5 units of BRG E-125 to fulfill urgent customer booking deposits.', 
          type: 'sent', 
          read: true 
        },
        { 
          id: 'msg-2', 
          from: 'Super Admin', 
          sender: 'Super Admin (Head Office)', 
          role: 'Head Office', 
          branch: 'Head Office', 
          time: 'Yesterday 02:15 PM', 
          date: 'Yesterday 14:15', 
          body: 'Peshawar request received. Central Warehouse is awaiting container import, but Lahore Showroom currently holds 8 surplus units. Looping in Lahore branch to arrange regional transfer.', 
          text: 'Peshawar request received. Central Warehouse is awaiting container import, but Lahore Showroom currently holds 8 surplus units. Looping in Lahore branch to arrange regional transfer.', 
          type: 'received', 
          read: true 
        },
        { 
          id: 'msg-3', 
          from: 'Sami Ullah', 
          sender: 'Sami Ullah (Branch Manager — Lahore)', 
          role: 'Lahore Branch', 
          branch: 'Lahore', 
          time: 'Today 10:45 AM', 
          date: 'Today 10:45', 
          body: 'Lahore showroom confirms availability of 8 units. We can immediately dispatch 5 units (Chassis VIN-PK-BRG-2026-00911 through 00915) via carrier truck TR-401 tomorrow morning.', 
          text: 'Lahore showroom confirms availability of 8 units. We can immediately dispatch 5 units (Chassis VIN-PK-BRG-2026-00911 through 00915) via carrier truck TR-401 tomorrow morning.', 
          type: 'received', 
          read: true 
        },
        { 
          id: 'msg-4', 
          from: 'Super Admin', 
          sender: 'Super Admin (Head Office)', 
          role: 'Head Office', 
          branch: 'Head Office', 
          time: 'Today 11:30 AM', 
          date: 'Today 11:30', 
          body: 'Lahore dispatch authorized for 5x BRG E-125 units via Carrier TR-401. Attached formal HQ approval memo.', 
          text: 'Lahore dispatch authorized for 5x BRG E-125 units via Carrier TR-401. Attached formal HQ approval memo.', 
          type: 'received', 
          read: false 
        }
      ]
    },
    { 
      id: 'EXP-402', 
      title: 'Utility bill approval note', 
      subtitle: 'Conversation — Utility bill approval note', 
      thread: 'Utility bill approval note', 
      branch_id: 'BR-01',
      branch: 'Peshawar', 
      customer_id: null,
      customer: null,
      linked: 'EXP-402', 
      linkedType: 'Expense',
      from: 'Finance Lead', 
      lastMsg: 'Receipt verified. Releasing payment.', 
      priority: 'Low', 
      priorityClass: 'bg-gray-100 text-gray-700', 
      unread: 0, 
      status: 'Read',
      statusClass: 'text-gray-400',
      date: 'Yesterday 16:05',
      participants: 'Ahsan Khan (Peshawar), Finance Operations Lead',
      owner: 'Branch Manager (Peshawar)',
      created: 'Yesterday',
      replies: 2,
      participantsList: [
        { name: 'Ahsan Khan', role: 'Branch Manager', branch: 'Peshawar', branch_id: 'BR-01', scope: 'Expense Submitter' },
        { name: 'Finance Lead', role: 'Head Office Finance', branch: 'All Branches', branch_id: 'HQ', scope: 'Approving Officer' }
      ],
      attachments: [
        {
          id: 'att-201',
          name: 'pesco_electricity_bill_aug26.pdf',
          size: '310 KB',
          type: 'Adobe PDF Document',
          uploadedBy: 'Ahsan Khan (Branch Manager — Peshawar)',
          branch: 'Peshawar',
          date: 'Yesterday 04:05 PM',
          scope: 'Verified Utility Receipt'
        }
      ],
      messages: [
        { id: 'msg-1', from: 'Finance Lead', sender: 'Finance Lead (Head Office)', role: 'Head Office', branch: 'Head Office', time: '04:00 PM', date: 'Yesterday 16:00', body: 'Please attach the verified payment receipt for EXP-402 before release.', text: 'Please attach the verified payment receipt for EXP-402 before release.', type: 'received', read: true },
        { id: 'msg-2', from: 'Ahsan Khan', sender: 'Ahsan Khan (Branch Manager — Peshawar)', role: 'Peshawar Branch', branch: 'Peshawar', time: '04:05 PM', date: 'Yesterday 16:05', body: 'Attached verified PESCO electricity invoice. Clearance confirmed.', text: 'Attached verified PESCO electricity invoice. Clearance confirmed.', type: 'sent', read: true }
      ]
    },
    { 
      id: 'SC-229-CONV', 
      title: 'Warranty throttle replacement inquiry', 
      subtitle: 'Conversation — Warranty throttle replacement inquiry', 
      thread: 'Warranty throttle replacement inquiry', 
      branch_id: 'BR-01',
      branch: 'Peshawar', 
      customer_id: 'CUST-101',
      customer: 'Ahsan Khan',
      linked: 'SC-229', 
      linkedType: 'Warranty Case',
      from: 'Service Advisor', 
      lastMsg: 'OEM replacement confirmed under warranty.', 
      priority: 'High', 
      priorityClass: 'bg-[#fff7ed] text-[#ea580c]', 
      unread: 1, 
      status: 'Unread',
      statusClass: 'bg-blue-50 text-blue-700 font-bold',
      date: 'Today 14:10',
      participants: 'Ahsan Khan (Customer), Service Advisor (Peshawar), Technical Lead (Islamabad)',
      owner: 'Service Advisor',
      created: 'Today',
      replies: 2,
      participantsList: [
        { name: 'Ahsan Khan', role: 'Customer / Owner', branch: 'Peshawar', branch_id: 'BR-01', scope: 'Claimant' },
        { name: 'Usman Tariq', role: 'Service Advisor', branch: 'Peshawar', branch_id: 'BR-01', scope: 'Workshop Intake' },
        { name: 'Hamza Khan', role: 'Technical Warranty Lead', branch: 'Islamabad', branch_id: 'BR-02', scope: 'Regional Technical QA' }
      ],
      attachments: [
        {
          id: 'att-301',
          name: 'diagnostic_fault_code_throttle.pdf',
          size: '190 KB',
          type: 'Adobe PDF Document',
          uploadedBy: 'Usman Tariq (Service Advisor — Peshawar)',
          branch: 'Peshawar',
          date: 'Today 01:55 PM',
          scope: 'Diagnostic Sensor Log'
        },
        {
          id: 'att-302',
          name: 'oem_warranty_part_dispatch_approval.pdf',
          size: '220 KB',
          type: 'Adobe PDF Document',
          uploadedBy: 'Hamza Khan (Regional Technical QA — Islamabad)',
          branch: 'Islamabad',
          date: 'Today 02:05 PM',
          scope: 'Free OEM Part Replacement Clearance'
        }
      ],
      messages: [
        { id: 'msg-1', from: 'Ahsan Khan', sender: 'Ahsan Khan (Customer)', role: 'Customer', branch: 'Peshawar', time: '01:50 PM', date: 'Today 13:50', body: 'Hi, inquiring about the estimated time for my DS11 throttle sensor fix under claim SC-229.', text: 'Hi, inquiring about the estimated time for my DS11 throttle sensor fix under claim SC-229.', type: 'received', read: false },
        { id: 'msg-2', from: 'Service Lead', sender: 'Service Lead (Peshawar Workshop)', role: 'Peshawar Workshop', branch: 'Peshawar', time: '02:10 PM', date: 'Today 14:10', body: 'OEM replacement confirmed under warranty. Regional QA approved parts dispatch. Scheduled for completion today by 5 PM.', text: 'OEM replacement confirmed under warranty. Regional QA approved parts dispatch. Scheduled for completion today by 5 PM.', type: 'sent', read: true }
      ]
    }
  ],

  selectedConversation: null,

  selectConversation(conv) {
    this.selectedConversation = conv
  },

  addAttachmentToConversation(convId, attachment) {
    const conv = this.getConversationById(convId)
    if (!conv) throw new Error(`Conversation ${convId} not found.`)
    if (!conv.attachments) conv.attachments = []
    const newAtt = {
      id: `att-${Date.now()}`,
      name: attachment.name || 'document.pdf',
      size: attachment.size || '280 KB',
      type: attachment.type || 'Adobe PDF Document',
      uploadedBy: attachment.uploadedBy || (this.isBranchUser() ? `${this.currentUser?.name || 'Branch Manager'} (${this.currentUser?.branchName || 'Peshawar'})` : 'Super Admin (Head Office)'),
      branch: attachment.branch || (this.isBranchUser() ? (this.currentUser?.branchName || 'Peshawar') : 'Head Office'),
      date: attachment.date || 'Just now',
      scope: attachment.scope || 'Operational Document'
    }
    conv.attachments.unshift(newAtt)
    this.addAuditLog({
      action: 'Attachment Uploaded',
      entity_type: 'conversation',
      entity_id: conv.id,
      module: 'Communications',
      branch: conv.branch || 'Peshawar',
      description: `Attachment ${newAtt.name} added to conversation ${conv.id} by ${newAtt.uploadedBy}.`,
      metadata: { file: newAtt.name, size: newAtt.size }
    })
    return newAtt
  },

  addConversation(newConv) {
    const id = newConv.id || (newConv.linked ? `${newConv.linked}-CONV` : `CONV-${Math.floor(100 + Math.random() * 900)}`)
    const branch = newConv.branch || this.getActiveBranch()
    const convObj = {
      ...newConv,
      id,
      title: newConv.title || 'New Conversation',
      subtitle: newConv.subtitle || `Conversation — ${newConv.title || 'General'}`,
      thread: newConv.title || 'New Conversation',
      branch,
      branch_id: newConv.branch_id || (branch === 'Peshawar' ? 'BR-01' : branch === 'Islamabad' ? 'BR-02' : branch === 'Lahore' ? 'BR-03' : 'BR-04'),
      customer_id: newConv.customer_id || null,
      customer: newConv.customer || null,
      linked: newConv.linked || 'General',
      linkedType: newConv.linkedType || 'General Inquiry',
      from: newConv.from || newConv.recipient || (this.isBranchUser() ? 'Super Admin' : 'Branch Manager'),
      lastMsg: newConv.lastMsg || newConv.message || 'Conversation initiated',
      priority: newConv.priority || 'Medium',
      priorityClass: newConv.priority === 'High' ? 'bg-[#fff7ed] text-[#ea580c]' : 'bg-blue-50 text-blue-700',
      unread: 0,
      status: 'Open',
      statusClass: 'bg-[#dcfce7] text-[#15803d]',
      participants: newConv.participants || `Branch Manager, ${newConv.recipient || 'Super Admin'}`,
      owner: newConv.owner || 'Branch Manager',
      messages: newConv.messages ? [...newConv.messages] : (newConv.message ? [
        {
          id: `msg-${Date.now()}`,
          sender: newConv.owner || (this.isBranchUser() ? 'Branch Manager' : 'Super Admin'),
          from: newConv.owner || (this.isBranchUser() ? 'Branch Manager' : 'Super Admin'),
          text: newConv.message,
          body: newConv.message,
          time: 'Just now'
        }
      ] : [])
    }
    this.conversations.unshift(convObj)
    return convObj
  },

  addMessageToConversation(convId, message) {
    const text = (message.body || message.text || '').trim()
    if (!text) {
      throw new Error('Message cannot be empty or whitespace only.')
    }
    const conv = this.getConversationById(convId)
    if (!conv) {
      throw new Error(`Conversation ${convId} not found.`)
    }
    if (!conv.messages) conv.messages = []
    
    const now = new Date()
    const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`
    
    const msgObj = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      from: message.from || message.sender || (this.isBranchUser() ? 'Branch Manager' : 'Super Admin'),
      sender: message.sender || (this.isBranchUser() ? 'Branch Manager' : 'Super Admin'),
      sender_user_id: message.sender_user_id || this.currentUser?.id || null,
      role: message.role || (this.isBranchUser() ? 'Peshawar Branch' : 'Head Office'),
      time: message.time || `Today ${timeStr}`,
      date: message.date || `Today ${timeStr}`,
      body: text,
      text: text,
      type: message.type || 'sent',
      read: true
    }
    conv.messages.push(msgObj)
    conv.lastMsg = text
    conv.lastReply = `Today ${timeStr}`
    conv.date = 'Just now'
    conv.replies = conv.messages.length

    // Move conversation to top
    const idx = this.conversations.findIndex(c => c.id === conv.id)
    if (idx > 0) {
      const [item] = this.conversations.splice(idx, 1)
      this.conversations.unshift(item)
    }

    return msgObj
  },

  markConversationRead(convId) {
    const conv = this.getConversationById(convId)
    if (conv) {
      conv.unread = 0
      if (conv.status === 'Unread') {
        conv.status = 'Open'
        conv.statusClass = 'bg-[#dcfce7] text-[#15803d]'
      }
      if (conv.messages) {
        conv.messages.forEach(m => { m.read = true })
      }
    }
  },

  getConversationById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.conversations.find(c => 
      (c.id && c.id.toLowerCase() === target) || 
      (c.linked && c.linked.toLowerCase() === target) ||
      (c.id && c.id.toLowerCase().replace(/-conv$/, '') === target)
    ) || null
  },

  getUnreadConversationCount(user) {
    const list = this.conversations.filter(c => !c.branch || this.isBranchAllowed(c.branch))
    return list.reduce((sum, c) => sum + (c.unread || 0), 0)
  },

  // Deterministic deduplication key registry to avoid duplicate notifications on re-renders
  _notificationDedupeKeys: new Set([
    'inventory_BRG-E125_LOW_STOCK_BR-01',
    'transfer_TR-221_DISPATCHED_BR-01',
    'quotation_QT-1882_CREATED_BR-01',
    'service_case_SC-229_CREATED_BR-01'
  ]),

  notifications: [
    {
      id: 'NOTIF-001',
      title: 'Low Stock Alert',
      message: 'BRG E-125 stock has reached threshold (3 units left) at Peshawar showroom.',
      notification: 'Low Stock Alert: BRG E-125 stock has reached threshold (3 units left) at Peshawar showroom.',
      time: '10m ago',
      created_at: '2026-09-21T09:50:00Z',
      read: 'No',
      status: 'Unread',
      isRead: false,
      type: 'warning',
      priority: 'High',
      category: 'Inventory',
      recipient_role: 'Branch Manager',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      source_type: 'inventory',
      source_id: 'BRG-E125',
      record: 'BRG-E125',
      link: '/inventory/serialized-units',
      action: 'View',
      actionClass: 'text-[#165A31] font-bold hover:underline cursor-pointer'
    },
    {
      id: 'NOTIF-002',
      title: 'Transfer Dispatched',
      message: 'Transfer TR-221 (4 units) dispatched from Islamabad to Peshawar.',
      notification: 'Transfer Dispatched: Transfer TR-221 (4 units) dispatched from Islamabad to Peshawar.',
      time: '1h ago',
      created_at: '2026-09-21T09:00:00Z',
      read: 'No',
      status: 'Unread',
      isRead: false,
      type: 'info',
      priority: 'Normal',
      category: 'Inventory',
      recipient_role: 'Branch Manager',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      source_type: 'transfer',
      source_id: 'TR-221',
      record: 'TR-221',
      link: '/inventory/transfers/detail?id=TR-221',
      action: 'View',
      actionClass: 'text-[#165A31] font-bold hover:underline cursor-pointer'
    },
    {
      id: 'NOTIF-003',
      title: 'New Quotation Request',
      message: 'Quotation QT-1882 generated for customer Ahsan Khan (PKR 280,000).',
      notification: 'New Quotation Request: Quotation QT-1882 generated for customer Ahsan Khan (PKR 280,000).',
      time: '3h ago',
      created_at: '2026-09-21T07:00:00Z',
      read: 'Yes',
      status: 'Read',
      isRead: true,
      read_at: '2026-09-21T08:00:00Z',
      type: 'success',
      priority: 'Normal',
      category: 'Sales',
      recipient_role: 'Branch Manager',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      source_type: 'quotation',
      source_id: 'QT-1882',
      record: 'QT-1882',
      link: '/sales/quotations/detail?id=QT-1882',
      action: 'View',
      actionClass: 'text-[#165A31] font-bold hover:underline cursor-pointer'
    },
    {
      id: 'NOTIF-004',
      title: 'Service Case Logged',
      message: 'Warranty Claim SC-229 logged for Ahsan Khan (Unit DS11-00997).',
      notification: 'Service Case Logged: Warranty Claim SC-229 logged for Ahsan Khan (Unit DS11-00997).',
      time: '5h ago',
      created_at: '2026-09-21T05:00:00Z',
      read: 'Yes',
      status: 'Read',
      isRead: true,
      read_at: '2026-09-21T06:00:00Z',
      type: 'warning',
      priority: 'High',
      category: 'Service',
      recipient_role: 'Branch Manager',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      source_type: 'service_case',
      source_id: 'SC-229',
      record: 'SC-229',
      link: '/after-sales/repairs/detail?id=SC-229',
      action: 'View',
      actionClass: 'text-[#165A31] font-bold hover:underline cursor-pointer'
    }
  ],

  addNotification(newNotif) {
    if (!newNotif) return null
    
    // Deduplication check
    const sourceType = newNotif.source_type || newNotif.sourceType || 'system'
    const sourceId = newNotif.source_id || newNotif.sourceId || newNotif.record || newNotif.id || 'GEN'
    const eventType = newNotif.event_type || newNotif.eventType || newNotif.type || 'GENERAL'
    const targetRecipient = newNotif.recipient || newNotif.recipient_user_id || newNotif.recipient_role || newNotif.branch_id || newNotif.branch || 'ALL'
    const dedupeKey = `${sourceType}_${sourceId}_${eventType}_${targetRecipient}`

    if (this._notificationDedupeKeys.has(dedupeKey)) {
      const existing = this.notifications.find(n => (n.source_type === sourceType && n.source_id === sourceId) || n.id === newNotif.id)
      return existing || { deduplicated: true, dedupeKey }
    }
    this._notificationDedupeKeys.add(dedupeKey)

    const id = newNotif.id || `NOTIF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`
    const title = newNotif.title || 'System Notification'
    const message = newNotif.message || newNotif.notification || ''
    const fullText = newNotif.notification || `${title}: ${message}`

    // Resolve default route link based on source_type and source_id
    let link = newNotif.link
    if (!link && sourceId && sourceId !== 'GEN') {
      const typeLower = String(sourceType).toLowerCase()
      if (typeLower.includes('purchase') || typeLower === 'po') {
        link = `/procurement/purchase-orders/detail?id=${sourceId}`
      } else if (typeLower.includes('stock_req') || typeLower.includes('stock request') || String(sourceId).startsWith('SR-')) {
        link = `/inventory/stock-requests/detail?id=${sourceId}`
      } else if (typeLower.includes('transfer') || String(sourceId).startsWith('TR-')) {
        link = `/inventory/transfers/detail?id=${sourceId}`
      } else if (typeLower.includes('quote') || typeLower.includes('quotation') || String(sourceId).startsWith('QT-')) {
        link = `/sales/quotations/detail?id=${sourceId}`
      } else if (typeLower.includes('order') || typeLower.includes('so') || String(sourceId).startsWith('ORD-') || String(sourceId).startsWith('SO-')) {
        link = `/sales/orders/detail?id=${sourceId}`
      } else if (typeLower.includes('invoice') || typeLower.includes('payment') || String(sourceId).startsWith('INV-')) {
        link = `/sales/invoices/detail?id=${sourceId}`
      } else if (typeLower.includes('delivery') || typeLower.includes('handover') || String(sourceId).startsWith('DEL-') || String(sourceId).startsWith('DH-')) {
        link = `/sales/delivery-handover/detail?id=${sourceId}`
      } else if (typeLower.includes('service') || typeLower.includes('case') || typeLower.includes('repair') || String(sourceId).startsWith('SC-') || String(sourceId).startsWith('RJ-')) {
        link = `/after-sales/repairs/detail?id=${sourceId}`
      } else if (typeLower.includes('expense') || String(sourceId).startsWith('EXP-')) {
        link = `/finance/expenses/detail?id=${sourceId}`
      }
    }

    const notifObj = {
      id,
      title,
      message,
      notification: fullText,
      type: newNotif.type || 'info',
      priority: newNotif.priority || 'Normal',
      category: newNotif.category || 'System',
      recipient_user_id: newNotif.recipient_user_id || null,
      recipient_role: newNotif.recipient_role || (newNotif.branch ? 'Branch Manager' : 'Super Admin'),
      branch_id: newNotif.branch_id || (newNotif.branch === 'Peshawar' ? 'BR-01' : newNotif.branch === 'Islamabad' ? 'BR-02' : newNotif.branch === 'Lahore' ? 'BR-03' : newNotif.branch === 'Rawalpindi' ? 'BR-04' : null),
      branch: newNotif.branch || (newNotif.branch_id === 'BR-01' ? 'Peshawar' : newNotif.branch_id === 'BR-02' ? 'Islamabad' : newNotif.branch_id === 'BR-03' ? 'Lahore' : newNotif.branch_id === 'BR-04' ? 'Rawalpindi' : 'All Branches'),
      source_type: sourceType,
      source_id: sourceId,
      record: sourceId,
      status: 'Unread',
      read: 'No',
      isRead: false,
      created_at: new Date().toISOString(),
      time: 'Just now',
      read_at: null,
      link: link || '/communication/notifications',
      action: 'View',
      actionClass: 'text-[#165A31] font-bold hover:underline cursor-pointer'
    }

    this.notifications.unshift(notifObj)
    return notifObj
  },

  markNotificationRead(id) {
    const notif = this.notifications.find(n => n.id === id || n.source_id === id)
    if (notif) {
      notif.read = 'Yes'
      notif.status = 'Read'
      notif.isRead = true
      notif.read_at = new Date().toISOString()
    }
  },

  markNotificationUnread(id) {
    const notif = this.notifications.find(n => n.id === id || n.source_id === id)
    if (notif) {
      notif.read = 'No'
      notif.status = 'Unread'
      notif.isRead = false
      notif.read_at = null
    }
  },

  markAllNotificationsRead(user) {
    const scoped = this.getNotificationsForUser(user)
    scoped.forEach(notif => {
      notif.read = 'Yes'
      notif.status = 'Read'
      notif.isRead = true
      notif.read_at = new Date().toISOString()
    })
  },

  getNotificationsForUser(user) {
    const currentUser = user || this.currentUser
    if (!currentUser || currentUser.isSuperAdmin) {
      return this.notifications
    }
    const userBranch = (currentUser.branchName || 'Peshawar').toLowerCase()
    const userId = currentUser.id || currentUser.user_id
    const userRole = currentUser.role || 'Branch Manager'

    return this.notifications.filter(n => {
      // Specifically targeted to this user ID
      if (n.recipient_user_id && userId && n.recipient_user_id === userId) return true
      // Branch check
      if (n.branch && n.branch.toLowerCase() !== 'all branches' && n.branch.toLowerCase() !== 'all') {
        if (n.branch.toLowerCase() !== userBranch) return false
      }
      if (n.branch_id && currentUser.branch_id) {
        if (n.branch_id !== currentUser.branch_id && n.branch_id !== 'ALL') return false
      }
      // Role check if targeted specifically to a different role
      if (n.recipient_role && n.recipient_role !== userRole && n.recipient_role !== 'All') {
        if (n.recipient_role === 'Super Admin') return false
      }
      return true
    })
  },

  getUnreadNotificationCount(user) {
    const list = this.getNotificationsForUser(user)
    return list.filter(n => n.status === 'Unread' || n.read === 'No' || !n.isRead).length
  },

  // Canonical Follow-ups / Reminders Store
  followUps: [
    {
      id: 1,
      customer_id: 'CUST-102',
      customer: 'Bilal Shah',
      linkedRecord: 'ORD-2238',
      linkedType: 'Sales Order',
      owner_user_id: 'USR-03',
      owner: 'Hamza Ali',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      due: 'Today 11:30',
      dueDate: 'Today',
      dueTime: '11:30',
      taskType: 'Payment Reminder',
      type: 'Payment Reminder',
      priority: 'High',
      priorityColor: 'bg-orange-50 text-orange-700',
      channel: 'Phone Call',
      status: 'Overdue',
      statusClass: 'bg-[#fee2e2] text-[#b91c1c]',
      statusColor: 'bg-red-50 text-red-600',
      action: 'Complete',
      notes: 'Customer promised partial settlement by noon.'
    },
    {
      id: 2,
      customer_id: 'CUST-103',
      customer: 'Sajid Khan',
      linkedRecord: 'LD-551',
      linkedType: 'Lead',
      owner_user_id: 'USR-03',
      owner: 'Hamza Ali',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      due: 'Today 14:00',
      dueDate: 'Today',
      dueTime: '14:00',
      taskType: 'Lead Inquiry Check',
      type: 'Lead Inquiry Check',
      priority: 'Medium',
      priorityColor: 'bg-yellow-50 text-yellow-700',
      channel: 'WhatsApp',
      status: 'Due Today',
      statusClass: 'bg-[#fef3c7] text-[#b45309]',
      statusColor: 'bg-yellow-50 text-yellow-700',
      action: 'Complete',
      notes: 'Follow up on battery warranty questions.'
    },
    {
      id: 3,
      customer_id: 'CUST-101',
      customer: 'Ahsan Khan',
      linkedRecord: 'SC-229',
      linkedType: 'Service Case',
      owner_user_id: 'USR-01',
      owner: 'Ahsan Khan',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      due: 'Tomorrow 10:00',
      dueDate: 'Tomorrow',
      dueTime: '10:00',
      taskType: 'Service Post-Delivery Check',
      type: 'Service Post-Delivery Check',
      priority: 'Normal',
      priorityColor: 'bg-blue-50 text-blue-700',
      channel: 'Phone Call',
      status: 'Upcoming',
      statusClass: 'bg-blue-50 text-blue-700',
      statusColor: 'bg-blue-50 text-blue-600',
      action: 'Complete',
      notes: 'Verify throttle controller replacement satisfaction.'
    },
    {
      id: 4,
      customer_id: 'CUST-104',
      customer: 'Usman Ali',
      linkedRecord: 'LD-548',
      linkedType: 'Lead follow-up',
      owner_user_id: 'USR-03',
      owner: 'Sana Noor',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      due: 'Today 11:00',
      dueDate: 'Today',
      dueTime: '11:00',
      taskType: 'Lead follow-up',
      type: 'Lead follow-up',
      priority: 'High',
      priorityColor: 'bg-orange-50 text-orange-700',
      channel: 'Phone Call',
      status: 'Open',
      statusClass: 'bg-blue-50 text-blue-600',
      statusColor: 'bg-blue-50 text-blue-600',
      action: 'Complete',
      notes: 'Discuss fleet discount requirement.'
    }
  ],

  addFollowUp(newFollowUp) {
    const id = newFollowUp.id || Date.now()
    const branch = newFollowUp.branch || this.getActiveBranch()
    const record = {
      ...newFollowUp,
      id,
      branch,
      branch_id: newFollowUp.branch_id || (branch === 'Peshawar' ? 'BR-01' : branch === 'Islamabad' ? 'BR-02' : branch === 'Lahore' ? 'BR-03' : 'BR-04'),
      status: newFollowUp.status || 'Due Today',
      statusClass: newFollowUp.statusClass || 'bg-[#fef3c7] text-[#b45309]',
      priority: newFollowUp.priority || 'Medium',
      channel: newFollowUp.channel || 'Phone Call',
      action: 'Complete'
    }
    this.followUps.unshift(record)
    return record
  },

  updateFollowUp(id, updatedData) {
    const index = this.followUps.findIndex(f => f.id === id)
    if (index !== -1) {
      this.followUps[index] = { ...this.followUps[index], ...updatedData }
      return this.followUps[index]
    }
    return null
  },

  completeFollowUp(id) {
    const item = this.followUps.find(f => f.id === id)
    if (item) {
      item.status = 'Completed'
      item.statusClass = 'bg-[#dcfce7] text-[#165A31]'
      item.statusColor = 'bg-emerald-50 text-emerald-700'
      item.completedAt = new Date().toISOString()
      return true
    }
    return false
  },

  dismissFollowUp(id) {
    const item = this.followUps.find(f => f.id === id)
    if (item) {
      item.status = 'Dismissed'
      item.statusClass = 'bg-gray-100 text-gray-500'
      return true
    }
    return false
  },

  getFollowUpsForUser(user) {
    const currentUser = user || this.currentUser
    if (!currentUser || currentUser.isSuperAdmin) {
      return this.followUps
    }
    const branchName = (currentUser.branchName || 'Peshawar').toLowerCase()
    return this.followUps.filter(f => !f.branch || f.branch.toLowerCase() === branchName || f.branch.toLowerCase() === 'all branches')
  },

  // Canonical Announcements Master
  announcements: [
    {
      id: 'ANN-001',
      title: 'Q3 BRG Electric Fleet Drive',
      content: 'Branch target incentives active. Super Admin team visits scheduled for next week.',
      target_role: 'Branch Manager',
      branch_id: null,
      branch: 'All Branches',
      author: 'Super Admin',
      created_at: '2026-09-20',
      status: 'Active'
    }
  ],

  createAnnouncement(announcementData) {
    const id = announcementData.id || `ANN-${Math.floor(100 + Math.random() * 900)}`
    const annObj = {
      ...announcementData,
      id,
      author: announcementData.author || this.currentUser?.name || 'Super Admin',
      created_at: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
    this.announcements.unshift(annObj)

    // Automatically emit notification to target audience without duplication
    this.addNotification({
      title: `Announcement: ${annObj.title}`,
      message: annObj.content,
      type: 'info',
      category: 'System',
      source_type: 'announcement',
      source_id: id,
      event_type: 'PUBLISHED',
      recipient_role: annObj.target_role || 'All',
      branch_id: annObj.branch_id || null,
      branch: annObj.branch || 'All Branches',
      link: '/communication/inbox'
    })

    return annObj
  },

  // ==========================================
  // 12. CANONICAL SERVICE CASES & REPAIR JOBS
  // ==========================================
  cases: [
    {
      id: 'SC-229',
      caseId: 'SC-229',
      case_id: 'SC-229',
      customer_id: 'CUST-101',
      customerName: 'Ahsan Khan',
      customer: 'Ahsan Khan',
      customerPhone: '+92 312 5538198',
      customerEmail: 'ahsan.khan@example.com',
      customerAddress: 'University Town, Peshawar',
      unit_id: 'DS11-00997',
      unitSerial: 'CH 8-BRG-26-01731',
      unit: 'CH 8-BRG-26-01731',
      unitShort: '01731',
      vehicle: 'BRG E-125 (2025)',
      unitModel: 'BRG E-125 (2025)',
      product_id: 'PROD-001',
      chassisNo: 'CH 8-BRG-26-01731',
      vin: 'VIN-PK-BRG-2026-00997',
      motorNo: 'MOT-72V-3500W-9912',
      batteryNo: 'BAT-7230-04421',
      batterySerial: 'BAT-7230-04421',
      odometer: '1,420 km',
      purchaseDate: '21 Sep 2026',
      warranty_id: 'WAR-101',
      warrantyExpiry: '21 Sep 2028',
      warrantyEnd: '21 Sep 2028',
      warrantyStatus: 'Active',
      warranty: 'Active',
      caseType: 'Warranty Claim',
      category: 'Warranty Claim',
      type: 'Warranty',
      priority: 'High',
      priorityClass: 'bg-red-50 text-red-700',
      status: 'Open',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      owner: 'Peshawar Service Team',
      assignedTech: 'Tariq Mehmood',
      loggedDate: 'Today 09:30',
      opened: 'Today',
      description: 'Customer reported battery draining unexpectedly fast below 40% and occasional display flickering when accelerating on inclines.',
      issue: 'Customer reported battery draining unexpectedly fast below 40% and occasional display flickering when accelerating on inclines.',
      issueDescription: 'Customer reported battery draining unexpectedly fast below 40% and occasional display flickering when accelerating on inclines.',
      resolutionNotes: 'Preliminary multimeter test confirms irregular cell balance on module 3. Controller throttle harness showed loose contact pin.',
      timeline: [
        { time: 'Today 09:30 AM', title: 'Case Created', desc: 'Case logged by Ahsan Khan at Peshawar Branch.', user: 'Ahsan Khan' },
        { time: 'Today 10:15 AM', title: 'Physical Inspection', desc: 'Technician completed initial intake inspection.', user: 'Tariq Mehmood' },
        { time: 'Today 11:30 AM', title: 'Repair Job Assigned', desc: 'Repair Job RJ-188 created and linked to this case.', user: 'Ahsan Khan' }
      ]
    },
    {
      id: 'SC-227',
      caseId: 'SC-227',
      case_id: 'SC-227',
      customer_id: 'CUST-107',
      customerName: 'Noman Ali',
      customer: 'Noman Ali',
      customerPhone: '+92 300 7711223',
      customerEmail: 'noman.ali@example.com',
      customerAddress: 'Hayatabad Phase 5, Peshawar',
      unit_id: 'DS11-01001',
      unitSerial: 'CH-90111',
      unit: 'CH-90111',
      vehicle: 'BRG DS11',
      unitModel: 'BRG DS11',
      product_id: 'PROD-003',
      chassisNo: 'CH-90111',
      vin: 'VIN-PK-BRG-2026-01001',
      batteryNo: 'BAT-7230-04455',
      odometer: '3,850 km',
      warrantyExpiry: '25 Aug 2027',
      warrantyEnd: '25 Aug 2027',
      warrantyStatus: 'Valid',
      warranty: 'Valid',
      caseType: 'Scheduled Service',
      category: 'Paid Repair',
      type: 'Service',
      priority: 'Normal',
      priorityClass: 'bg-blue-50 text-blue-700',
      status: 'In Progress',
      statusClass: 'bg-[#e0e7ff] text-[#3730a3]',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      owner: 'Peshawar Service Team',
      assignedTech: 'Imran Shah',
      loggedDate: 'Yesterday 14:15',
      opened: 'Yesterday',
      description: 'Scheduled 3,000 km periodic inspection and brake pads replacement.',
      issue: 'Scheduled 3,000 km periodic inspection and brake pads replacement.',
      issueDescription: 'Scheduled 3,000 km periodic inspection and brake pads replacement.',
      resolutionNotes: 'Brake fluid topped up and front pads replaced.',
      timeline: [
        { time: 'Yesterday 02:15 PM', title: 'Case Created', desc: 'Case logged for periodic maintenance.', user: 'Ahsan Khan' }
      ]
    }
  ],

  selectedCase: null,

  selectCase(caseItem) {
    this.selectedCase = caseItem
  },

  addCase(newCase) {
    const id = newCase.id || newCase.caseId || this.generateDocumentId('case')
    const caseObj = {
      ...newCase,
      id,
      caseId: id,
      case_id: id,
      customer_id: newCase.customer_id || (newCase.customer ? this.customers.find(c => c.name === newCase.customer)?.id : null) || 'CUST-101',
      customerName: newCase.customerName || newCase.customer || 'Customer',
      customer: newCase.customer || newCase.customerName || 'Customer',
      timeline: newCase.timeline || [
        { time: 'Just now', title: 'Case Created', desc: `Case logged by ${this.currentUser?.name || 'Branch Manager'}.`, user: this.currentUser?.name || 'Branch Manager' }
      ]
    }

    const unitId = newCase.unit_id || newCase.unit || newCase.unitSerial
    if (unitId) {
      const unit = this.getUnitById(unitId)
      if (unit) {
        unit.status = 'Maintenance'
        unit.statusClass = 'bg-[#fef3c7] text-[#b45309]'
        if (!unit.timeline) unit.timeline = []
        unit.timeline.unshift({
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          title: 'Case Logged',
          desc: `Service case ${id} opened (${caseObj.issue || 'Inspection'}). Status moved to Maintenance.`,
          user: this.currentUser?.name || 'Branch Manager'
        })
        this.reconcileInventoryTotals()
      }
    }

    this.cases.unshift(caseObj)
    this.selectedCase = caseObj

    this.addNotification({
      title: 'Service Case Logged',
      message: `Service case ${id} opened for ${caseObj.customer} (Unit: ${caseObj.unitSerial || caseObj.unit_id || 'Unit'}).`,
      type: 'warning',
      priority: 'High',
      category: 'Service',
      source_type: 'service_case',
      source_id: id,
      event_type: 'LOGGED',
      recipient_role: 'Branch Manager',
      branch: caseObj.branch || 'Peshawar',
      link: `/after-sales/repairs/detail?id=${id}`
    })

    this.addAuditLog({
      action: 'Logged',
      event_type: 'CASE_LOGGED',
      entity_type: 'service_case',
      entity_id: id,
      module: 'After-Sales',
      branch: caseObj.branch || this.getActiveBranch(),
      description: `Service Case ${id} logged for ${caseObj.customer} (Unit: ${caseObj.unitSerial || caseObj.unit_id || 'Unit'}).`,
      metadata: { caseId: id, customer: caseObj.customer, unitId, issue: caseObj.issue }
    })

    return caseObj
  },

  updateCase(id, updatedData) {
    const index = this.cases.findIndex(c => c.id === id || c.caseId === id || c.case_id === id)
    if (index !== -1) {
      this.cases[index] = { ...this.cases[index], ...updatedData }
      return this.cases[index]
    }
    return null
  },

  getCaseById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.cases.find(c => 
      (c.id && c.id.toLowerCase() === target) ||
      (c.caseId && c.caseId.toLowerCase() === target) ||
      (c.case_id && c.case_id.toLowerCase() === target)
    ) || null
  },

  getCasesByCustomerId(customerId) {
    if (!customerId) return []
    const target = String(customerId).toLowerCase().trim()
    return this.cases.filter(c => 
      c.customer_id && c.customer_id.toLowerCase() === target
    )
  },

  getCasesByUnitId(unitId) {
    if (!unitId) return []
    const target = String(unitId).toLowerCase().trim()
    return this.cases.filter(c => 
      (c.unit_id && c.unit_id.toLowerCase() === target) ||
      (c.unitSerial && c.unitSerial.toLowerCase() === target) ||
      (c.chassisNo && c.chassisNo.toLowerCase() === target)
    )
  },

  repairs: [
    {
      id: 'RJ-188',
      jobId: 'RJ-188',
      repair_id: 'RJ-188',
      case_id: 'SC-229',
      caseId: 'SC-229',
      title: 'Battery Controller Diagnostics & Terminal Repair',
      jobType: 'Warranty Repair',
      priority: 'High',
      priorityClass: 'bg-red-50 text-red-700',
      status: 'In Progress',
      statusClass: 'bg-[#e0e7ff] text-[#3730a3]',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      bay: 'Bay 1',
      technician_id: 'USR-05',
      assignedTech: 'Tariq Mehmood',
      leadTech: 'Tariq Mehmood (Senior EV Tech)',
      customer_id: 'CUST-101',
      customer: 'Ahsan Khan',
      customerName: 'Ahsan Khan',
      customerPhone: '+92 312 5538198',
      unit_id: 'DS11-00997',
      unitSerial: 'CH 8-BRG-26-01731',
      vehicle: 'BRG E-125 (2025)',
      chassisNo: 'CH 8-BRG-26-01731',
      odometer: '1,420 km',
      warranty_id: 'WAR-101',
      warrantyStatus: 'Under Warranty',
      intakeDate: 'Today 09:30',
      estimatedCompletion: 'Today 04:30 PM',
      progress: 65,
      description: 'Customer reported battery draining unexpectedly fast below 40% and occasional display flickering when accelerating on inclines.',
      issueReported: 'Customer reported battery draining unexpectedly fast below 40% and occasional display flickering when accelerating on inclines.',
      diagnosisFindings: 'BMS cell group 3 internal resistance elevated. Controller throttle harness terminal pin 4 oxidized causing intermittent voltage drop.',
      workPlan: [
        { id: 1, task: 'Intake inspection & diagnostic scan', status: 'Completed', time: '09:45 AM', completed: true },
        { id: 2, task: 'BMS cell voltage variance analysis', status: 'Completed', time: '10:30 AM', completed: true },
        { id: 3, task: 'Clean & resolder controller harness pins', status: 'In Progress', time: '11:15 AM', completed: false },
        { id: 4, task: 'Replace battery balancing lead harness', status: 'Pending', time: '—', completed: false },
        { id: 5, task: 'Post-repair road test & fast-charge cycle', status: 'Pending', time: '—', completed: false },
        { id: 6, task: 'Quality control handover check', status: 'Pending', time: '—', completed: false }
      ],
      partsList: [
        { id: 1, partNo: 'EC-HAR-72V-01', name: '72V Controller Wiring Harness Terminal Kit', sku: 'SKU-HAR-01', qty: 1, unitPrice: 'PKR 3,500', rawUnitPrice: 3500, total: 'PKR 3,500', rawTotal: 3500, covered: 'Warranty (100%)', status: 'Issued' },
        { id: 2, partNo: 'BMS-BAL-8S-04', name: 'Lithium BMS Balancing Lead Assembly', sku: 'SKU-BMS-04', qty: 1, unitPrice: 'PKR 5,200', rawUnitPrice: 5200, total: 'PKR 5,200', rawTotal: 5200, covered: 'Warranty (100%)', status: 'Issued' }
      ],
      labourList: [
        { id: 1, description: 'EV Electrical Diagnostics & Scanning', hours: '1.5 hrs', rawHours: 1.5, rate: 'PKR 1,500/hr', rawRate: 1500, total: 'PKR 2,250', rawTotal: 2250, covered: 'Warranty' },
        { id: 2, description: 'Wiring Harness Repair & Terminal Soldering', hours: '2.0 hrs', rawHours: 2.0, rate: 'PKR 1,500/hr', rawRate: 1500, total: 'PKR 3,000', rawTotal: 3000, covered: 'Warranty' }
      ],
      costSummary: {
        rawPartsTotal: 8700,
        partsTotal: 'PKR 8,700',
        rawLabourTotal: 5250,
        labourTotal: 'PKR 5,250',
        rawSubtotal: 13950,
        subtotal: 'PKR 13,950',
        rawWarrantyCoverage: 13950,
        warrantyCoverage: 'PKR 13,950',
        rawCustomerPayable: 0,
        customerPayable: 'PKR 0'
      },
      posted_to_finance: false,
      timeline: [
        { time: 'Today 09:30 AM', title: 'Vehicle Intake', desc: 'Vehicle received at Peshawar workshop bay 1.', user: 'Ahsan Khan' },
        { time: 'Today 10:15 AM', title: 'Diagnostic Scan Completed', desc: 'BMS diagnostic log recorded. Error code E-04 detected.', user: 'Tariq Mehmood' },
        { time: 'Today 11:30 AM', title: 'Parts Requisition Approved', desc: 'Wiring harness terminal kit issued from branch stock.', user: 'Tariq Mehmood' }
      ]
    },
    {
      id: 'RJ-186',
      jobId: 'RJ-186',
      repair_id: 'RJ-186',
      case_id: 'SC-227',
      caseId: 'SC-227',
      title: 'Periodic Brake Overhaul & Controller Inspection',
      jobType: 'Paid Service',
      priority: 'Normal',
      priorityClass: 'bg-blue-50 text-blue-700',
      status: 'Completed',
      statusClass: 'bg-[#dcfce7] text-[#165A31]',
      branch_id: 'BR-01',
      branch: 'Peshawar',
      bay: 'Bay 2',
      technician_id: 'USR-06',
      assignedTech: 'Imran Shah',
      leadTech: 'Imran Shah (EV Technician)',
      customer_id: 'CUST-107',
      customer: 'Noman Ali',
      customerName: 'Noman Ali',
      customerPhone: '+92 300 7711223',
      unit_id: 'DS11-01001',
      vehicle: 'BRG DS11',
      chassisNo: 'CH-90111',
      odometer: '3,850 km',
      warrantyStatus: 'Paid',
      intakeDate: 'Yesterday 14:15',
      estimatedCompletion: 'Yesterday 05:00 PM',
      progress: 100,
      description: 'Scheduled periodic maintenance and brake pad replacement.',
      issueReported: 'Scheduled periodic maintenance and brake pad replacement.',
      diagnosisFindings: 'Brake pads worn to 20% thickness. Discs in good condition.',
      workPlan: [
        { id: 1, task: 'Front and rear brake pads replacement', status: 'Completed', time: '02:30 PM', completed: true },
        { id: 2, task: 'Brake fluid flush and bleed', status: 'Completed', time: '03:15 PM', completed: true },
        { id: 3, task: 'Test drive and quality sign-off', status: 'Completed', time: '04:00 PM', completed: true }
      ],
      partsList: [
        { id: 1, partNo: 'BRK-PAD-DS11', name: 'Ceramic Disc Brake Pads Set', sku: 'SKU-BRK-01', qty: 2, unitPrice: 'PKR 1,800', rawUnitPrice: 1800, total: 'PKR 3,600', rawTotal: 3600, covered: 'Paid', status: 'Installed' }
      ],
      labourList: [
        { id: 1, description: 'Periodic Service & Brake Overhaul', hours: '1.5 hrs', rawHours: 1.5, rate: 'PKR 1,500/hr', rawRate: 1500, total: 'PKR 2,250', rawTotal: 2250, covered: 'Paid' }
      ],
      costSummary: {
        rawPartsTotal: 3600,
        partsTotal: 'PKR 3,600',
        rawLabourTotal: 2250,
        labourTotal: 'PKR 2,250',
        rawSubtotal: 5850,
        subtotal: 'PKR 5,850',
        rawWarrantyCoverage: 0,
        warrantyCoverage: 'PKR 0',
        rawCustomerPayable: 5850,
        customerPayable: 'PKR 5,850'
      },
      posted_to_finance: false,
      timeline: [
        { time: 'Yesterday 02:15 PM', title: 'Vehicle Intake', desc: 'Vehicle checked in for periodic maintenance.', user: 'Ahsan Khan' },
        { time: 'Yesterday 04:30 PM', title: 'Quality Sign-off', desc: 'All checklist items verified. Ready for customer pickup.', user: 'Usman Ghani' }
      ]
    }
  ],

  selectedRepair: null,

  selectRepair(repairItem) {
    this.selectedRepair = repairItem
  },

  calculateRepairCostSummary({ partsList = [], labourList = [], warrantyCoverageType = 'full', customCoverageAmount = null }) {
    const parseNum = (val) => {
      if (typeof val === 'number') return val
      if (!val) return 0
      const clean = String(val).replace(/[^0-9.-]+/g, '')
      return parseFloat(clean) || 0
    }

    let partsTotal = 0
    partsList.forEach(p => {
      const qty = parseNum(p.qty || p.quantity) || 1
      const unitPrice = p.rawUnitPrice !== undefined ? p.rawUnitPrice : parseNum(p.unitPrice ?? p.unitCost ?? p.cost)
      const lineTotal = p.rawTotal !== undefined ? p.rawTotal : (p.totalCost !== undefined ? parseNum(p.totalCost) : (p.total !== undefined ? parseNum(p.total) : (unitPrice * qty)))
      partsTotal += lineTotal
    })

    let labourTotal = 0
    labourList.forEach(l => {
      const hours = l.rawHours !== undefined ? l.rawHours : parseNum(l.hours) || 1
      const rate = l.rawRate !== undefined ? l.rawRate : parseNum(l.rate ?? l.hourlyRate ?? l.cost)
      const lineTotal = l.rawTotal !== undefined ? l.rawTotal : (l.totalCost !== undefined ? parseNum(l.totalCost) : (l.total !== undefined ? parseNum(l.total) : (hours * rate)))
      labourTotal += lineTotal
    })

    const subtotal = partsTotal + labourTotal

    let warrantyCoverage = 0
    const covLower = String(warrantyCoverageType || '').toLowerCase()
    if (covLower === 'full' || covLower.includes('100%') || covLower.includes('oem') || covLower === 'warranty') {
      warrantyCoverage = subtotal
    } else if (covLower === 'none' || covLower.includes('0%') || covLower === 'paid') {
      warrantyCoverage = 0
    } else if (customCoverageAmount !== null && customCoverageAmount !== undefined) {
      warrantyCoverage = Math.min(subtotal, Math.max(0, parseNum(customCoverageAmount)))
    } else {
      let coveredSum = 0
      partsList.forEach(p => {
        if (p.covered && (p.covered.includes('Warranty') || p.covered.includes('100%'))) {
          const qty = parseNum(p.qty) || 1
          const unitPrice = p.rawUnitPrice !== undefined ? p.rawUnitPrice : parseNum(p.unitPrice)
          coveredSum += (p.rawTotal !== undefined ? p.rawTotal : (unitPrice * qty))
        }
      })
      labourList.forEach(l => {
        if (l.covered && (l.covered.includes('Warranty') || l.covered.includes('100%'))) {
          const hours = l.rawHours !== undefined ? l.rawHours : parseNum(l.hours) || 1
          const rate = l.rawRate !== undefined ? l.rawRate : parseNum(l.rate)
          coveredSum += (l.rawTotal !== undefined ? l.rawTotal : (hours * rate))
        }
      })
      warrantyCoverage = Math.min(subtotal, coveredSum)
    }

    const customerPayable = Math.max(0, subtotal - warrantyCoverage)
    const formatPKR = (num) => `PKR ${Number(num).toLocaleString()}`

    return {
      rawPartsTotal: partsTotal,
      partsTotal: formatPKR(partsTotal),
      rawLabourTotal: labourTotal,
      labourTotal: formatPKR(labourTotal),
      rawSubtotal: subtotal,
      subtotal: formatPKR(subtotal),
      rawWarrantyCoverage: warrantyCoverage,
      warrantyCoverage: formatPKR(warrantyCoverage),
      rawCustomerPayable: customerPayable,
      customerPayable: formatPKR(customerPayable)
    }
  },

  addRepairJob(newJob) {
    const id = newJob.id || newJob.jobId || this.generateDocumentId('repair')
    const calculatedCost = this.calculateRepairCostSummary({
      partsList: newJob.partsList || [],
      labourList: newJob.labourList || [],
      warrantyCoverageType: newJob.warrantyCoverageType || (newJob.jobType?.includes('Warranty') ? 'full' : 'none')
    })

    const jobObj = {
      ...newJob,
      id,
      jobId: id,
      repair_id: id,
      customer_id: newJob.customer_id || (newJob.customer ? this.customers.find(c => c.name === newJob.customer)?.id : null) || 'CUST-101',
      customer: newJob.customer || newJob.customerName || 'Customer',
      customerName: newJob.customerName || newJob.customer || 'Customer',
      progress: newJob.progress || 0,
      workPlan: newJob.workPlan || [
        { id: 1, task: 'Intake scan & diagnostic verification', status: 'In Progress', time: 'Just now', completed: false }
      ],
      partsList: newJob.partsList || [],
      labourList: newJob.labourList || [],
      costSummary: newJob.costSummary || calculatedCost,
      posted_to_finance: false,
      timeline: newJob.timeline || [
        { time: 'Just now', title: 'Job Created', desc: `Job opened by ${this.currentUser?.name || 'Branch Manager'}.`, user: this.currentUser?.name || 'Branch Manager' }
      ]
    }
    this.repairs.unshift(jobObj)
    this.selectedRepair = jobObj
    return jobObj
  },

  updateRepairJob(id, updatedData) {
    const index = this.repairs.findIndex(r => r.id === id || r.jobId === id || r.repair_id === id)
    if (index !== -1) {
      this.repairs[index] = { ...this.repairs[index], ...updatedData }
      return this.repairs[index]
    }
    return null
  },

  completeRepair(id) {
    const job = this.getRepairById(id)
    if (!job) return null
    job.status = 'Completed'
    job.progress = 100
    if (job.timeline) {
      job.timeline.unshift({
        time: new Date().toISOString().replace('T', ' ').slice(0, 16),
        title: 'Repair Completed',
        desc: `All repair operations completed and verified by ${this.currentUser?.name || 'Technician'}.`,
        user: this.currentUser?.name || 'Technician'
      })
    }
    this.addNotification({
      title: 'Repair Job Completed',
      message: `Repair job ${job.id} for unit ${job.unitSerial || job.unit_id || ''} has been completed and quality inspected.`,
      type: 'success',
      priority: 'Normal',
      category: 'Service',
      source_type: 'repair',
      source_id: job.id,
      event_type: 'COMPLETED',
      recipient_role: 'Branch Manager',
      branch: job.branch || 'Peshawar',
      link: `/after-sales/repairs/detail?id=${job.id}`
    })

    this.addAuditLog({
      action: 'Completed',
      event_type: 'REPAIR_COMPLETED',
      entity_type: 'repair_job',
      entity_id: job.id,
      module: 'After-Sales',
      branch: job.branch || 'Peshawar',
      description: `Repair job ${job.id} for unit ${job.unitSerial || job.unit_id || ''} completed.`,
      metadata: { repairId: job.id, caseId: job.case_id, unitId: job.unit_id, technician: this.currentUser?.name }
    })

    return job
  },

  updateRepairStatus(id, status) {
    if (status === 'Completed') return this.completeRepair(id)
    return this.updateRepairJob(id, { status })
  },

  getRepairById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    return this.repairs.find(r => 
      (r.id && r.id.toLowerCase() === target) ||
      (r.jobId && r.jobId.toLowerCase() === target) ||
      (r.repair_id && r.repair_id.toLowerCase() === target)
    ) || null
  },

  getRepairsByCaseId(caseId) {
    if (!caseId) return []
    const target = String(caseId).toLowerCase().trim()
    return this.repairs.filter(r => 
      (r.case_id && r.case_id.toLowerCase() === target) ||
      (r.caseId && r.caseId.toLowerCase() === target)
    )
  },

  getRepairsByCustomerId(customerId) {
    if (!customerId) return []
    const target = String(customerId).toLowerCase().trim()
    return this.repairs.filter(r => 
      r.customer_id && r.customer_id.toLowerCase() === target
    )
  },

  getRepairsByUnitId(unitId) {
    if (!unitId) return []
    const target = String(unitId).toLowerCase().trim()
    return this.repairs.filter(r => 
      (r.unit_id && r.unit_id.toLowerCase() === target) ||
      (r.unitSerial && r.unitSerial.toLowerCase() === target) ||
      (r.chassisNo && r.chassisNo.toLowerCase() === target)
    )
  },

  postRepairToFinance(repairId) {
    const job = this.getRepairById(repairId)
    if (!job) {
      return { success: false, error: `Repair job ${repairId} not found` }
    }
    if (job.posted_to_finance) {
      return { success: false, error: `Repair job ${repairId} has already been posted to finance.` }
    }

    const summary = job.costSummary || this.calculateRepairCostSummary({
      partsList: job.partsList || [],
      labourList: job.labourList || []
    })

    const customerPayable = summary.rawCustomerPayable !== undefined ? summary.rawCustomerPayable : 0
    const rawSubtotal = summary.rawSubtotal !== undefined ? summary.rawSubtotal : customerPayable
    const invoiceNumber = 'INV-REP-' + (job.id || job.jobId).replace(/^RJ-/, '')
    const formatPKR = (num) => `PKR ${Number(num).toLocaleString()}`

    const repairInvoice = {
      id: invoiceNumber,
      invoiceNumber: invoiceNumber,
      orderId: job.id || job.jobId,
      customer: job.customer || job.customerName || 'Customer',
      customerId: job.customer_id || 'CUST-101',
      date: 'Today',
      amount: formatPKR(customerPayable),
      rawAmount: customerPayable,
      subtotal: formatPKR(rawSubtotal),
      rawSubtotal: rawSubtotal,
      discount: 'PKR 0',
      rawDiscount: 0,
      tax: 'PKR 0',
      rawTax: 0,
      total: formatPKR(customerPayable),
      rawTotal: customerPayable,
      paidAmount: 0,
      outstandingAmount: customerPayable,
      status: customerPayable === 0 ? 'Settled' : 'Unpaid',
      branch: job.branch || 'Peshawar',
      type: 'Repair Service',
      source_type: 'Repair Job',
      source_id: job.id || job.jobId,
      unit_id: job.unit_id,
      unitSerial: job.chassisNo || job.unitSerial,
      items: [
        ...(job.partsList || []).map(p => ({
          id: p.id,
          item: p.name || p.partNo,
          description: `Part: ${p.partNo}`,
          qty: p.qty || 1,
          rate: p.unitPrice,
          total: p.total
        })),
        ...(job.labourList || []).map(l => ({
          id: (l.id || 1) + 100,
          item: l.description,
          description: `Labour: ${l.hours}`,
          qty: 1,
          rate: l.rate,
          total: l.total
        }))
      ]
    }

    this.invoices.unshift(repairInvoice)
    job.posted_to_finance = true
    job.finance_invoice_id = invoiceNumber

    this.addNotification({
      title: 'Repair Posted to Finance',
      message: `Repair job ${job.id} posted to finance as invoice ${invoiceNumber} (Payable: ${formatPKR(customerPayable)}).`,
      type: 'success',
      priority: 'High',
      category: 'Finance',
      source_type: 'repair',
      source_id: job.id,
      event_type: 'POSTED_TO_FINANCE',
      recipient_role: 'Super Admin',
      branch: job.branch || 'Peshawar',
      link: `/sales/invoices/detail?id=${invoiceNumber}`
    })

    this.addAuditLog({
      action: 'Posted to Finance',
      event_type: 'REPAIR_POSTED_TO_FINANCE',
      entity_type: 'repair_job',
      entity_id: job.id || job.jobId,
      module: 'Finance',
      branch: job.branch || 'Peshawar',
      description: `Repair job ${job.id} posted to finance as invoice ${invoiceNumber} (Payable: ${formatPKR(customerPayable)}).`,
      metadata: { repairId: job.id, invoiceId: invoiceNumber, payable: customerPayable }
    })

    return { success: true, invoice: repairInvoice }
  },

  // ==========================================
  // 13. AUDIT LOGS, ACTIVITY HISTORY & TRACEABILITY
  // ==========================================
  _auditDedupeKeys: new Set([
    'security_USR-01_LOGIN_2026-09-20',
    'sales_order_ORD-2241_CONFIRMED_2026-09-21',
    'inventory_TR-221_DISPATCHED_2026-09-20',
    'procurement_PO-2048_APPROVED_2026-09-20',
    'payment_INV-2241_PAYMENT_RECORDED_2026-09-21',
    'service_case_SC-229_LOGGED_2026-09-21',
    'repair_job_RJ-188_COMPLETED_2026-09-21'
  ]),

  auditLogs: [
    {
      id: 'AUD-001',
      event_type: 'LOGIN',
      action: 'Login',
      operation: 'Login',
      entity_type: 'security',
      entity_id: 'USR-01',
      record: 'USR-01',
      user_id: 'USR-01',
      user: 'Ahsan Khan',
      actor_name: 'Ahsan Khan',
      role: 'Branch Manager',
      actor_role: 'Branch Manager',
      target_user_id: null,
      branch_id: 'BR-01',
      branch: 'Peshawar',
      module: 'Security',
      description: 'User logged in to Peshawar Showroom terminal.',
      result: 'Session established',
      metadata: { method: 'MFA_VERIFIED', ip: '192.168.1.45' },
      created_at: '2026-09-21T09:01:00.000Z',
      timestamp: 'Today 09:01',
      link: '/organisation/users/detail?id=USR-01'
    },
    {
      id: 'AUD-002',
      event_type: 'ORDER_CONFIRMED',
      action: 'Confirmed',
      operation: 'Confirm Order',
      entity_type: 'sales_order',
      entity_id: 'ORD-2241',
      record: 'ORD-2241',
      user_id: 'USR-03',
      user: 'Hamza Ali',
      actor_name: 'Hamza Ali',
      role: 'Sales Executive',
      actor_role: 'Sales Executive',
      target_user_id: null,
      branch_id: 'BR-01',
      branch: 'Peshawar',
      module: 'Sales',
      description: 'Sales Order ORD-2241 confirmed for Ahsan Khan (PKR 280,000).',
      result: 'Unit CH 8-BRG-26-01731 allocated',
      metadata: { previous_status: 'Quotation', new_status: 'Ready', total: 'PKR 280,000' },
      created_at: '2026-09-21T09:15:00.000Z',
      timestamp: 'Today 09:15',
      link: '/sales/orders/detail?id=ORD-2241'
    },
    {
      id: 'AUD-003',
      event_type: 'PAYMENT_RECORDED',
      action: 'Recorded',
      operation: 'Record Payment',
      entity_type: 'invoice',
      entity_id: 'INV-2241',
      record: 'INV-2241',
      user_id: 'USR-01',
      user: 'Ahsan Khan',
      actor_name: 'Ahsan Khan',
      role: 'Branch Manager',
      actor_role: 'Branch Manager',
      target_user_id: null,
      branch_id: 'BR-01',
      branch: 'Peshawar',
      module: 'Finance',
      description: 'Payment PAY-7791 of PKR 280,000 recorded against invoice INV-2241.',
      result: 'Invoice fully settled',
      metadata: { previous_status: 'Unpaid', new_status: 'Paid', amount: 280000, method: 'Direct Bank Transfer' },
      created_at: '2026-09-21T09:20:00.000Z',
      timestamp: 'Today 09:20',
      link: '/sales/invoices/detail?id=INV-2241'
    },
    {
      id: 'AUD-004',
      event_type: 'PO_APPROVED',
      action: 'Approved',
      operation: 'Approve PO',
      entity_type: 'purchase_order',
      entity_id: 'PO-2048',
      record: 'PO-2048',
      user_id: 'USR-01',
      user: 'Ahsan Khan',
      actor_name: 'Ahsan Khan',
      role: 'Super Admin',
      actor_role: 'Super Admin',
      target_user_id: null,
      branch_id: 'BR-01',
      branch: 'Peshawar',
      module: 'Procurement',
      description: 'Purchase Order PO-2048 approved for Pak Logistics dispatch.',
      result: 'Status moved to Approved',
      metadata: { previous_status: 'Submitted', new_status: 'Approved', supplier: 'BRG Power China' },
      created_at: '2026-09-20T14:32:00.000Z',
      timestamp: 'Yesterday 14:32',
      link: '/procurement/purchase-orders/detail?id=PO-2048'
    },
    {
      id: 'AUD-005',
      event_type: 'TRANSFER_DISPATCHED',
      action: 'Dispatched',
      operation: 'Dispatch Transfer',
      entity_type: 'transfer',
      entity_id: 'TR-221',
      record: 'TR-221',
      user_id: 'USR-02',
      user: 'Hassan Ali',
      actor_name: 'Hassan Ali',
      role: 'Branch Manager',
      actor_role: 'Branch Manager',
      target_user_id: null,
      branch_id: 'BR-02',
      branch: 'Islamabad',
      module: 'Inventory',
      description: 'Transfer TR-221 dispatched: 4 units from Islamabad to Peshawar.',
      result: '4 units moved to In Transit',
      metadata: { from_branch: 'Islamabad', to_branch: 'Peshawar', units: 4 },
      created_at: '2026-09-20T16:20:00.000Z',
      timestamp: 'Yesterday 16:20',
      link: '/inventory/transfers/detail?id=TR-221'
    },
    {
      id: 'AUD-006',
      event_type: 'CASE_LOGGED',
      action: 'Logged',
      operation: 'Log Service Case',
      entity_type: 'service_case',
      entity_id: 'SC-229',
      record: 'SC-229',
      user_id: 'USR-01',
      user: 'Ahsan Khan',
      actor_name: 'Ahsan Khan',
      role: 'Branch Manager',
      actor_role: 'Branch Manager',
      target_user_id: null,
      branch_id: 'BR-01',
      branch: 'Peshawar',
      module: 'Service',
      description: 'Service case SC-229 opened for Ahsan Khan (Unit CH 8-BRG-26-01731).',
      result: 'Unit moved to Maintenance',
      metadata: { issue: 'Battery drain and throttle flicker', unit: 'CH 8-BRG-26-01731' },
      created_at: '2026-09-21T09:30:00.000Z',
      timestamp: 'Today 09:30',
      link: '/after-sales/repairs/detail?id=SC-229'
    }
  ],

  resolveEntityModule(entityType) {
    const type = String(entityType).toLowerCase()
    if (type.includes('purchase') || type.includes('receipt') || type.includes('supplier')) return 'Procurement'
    if (type.includes('stock') || type.includes('transfer') || type.includes('unit') || type.includes('adjust') || type.includes('inventory')) return 'Inventory'
    if (type.includes('quote') || type.includes('lead') || type.includes('order') || type.includes('customer') || type.includes('sale') || type.includes('delivery')) return 'Sales'
    if (type.includes('invoice') || type.includes('payment') || type.includes('expense') || type.includes('receivable')) return 'Finance'
    if (type.includes('case') || type.includes('repair') || type.includes('warranty')) return 'Service'
    if (type.includes('user') || type.includes('role') || type.includes('branch') || type.includes('permission')) return 'Organisation'
    if (type.includes('product') || type.includes('category') || type.includes('catalogue')) return 'Catalogue'
    return 'System'
  },

  resolveEntityRoute(entityType, entityId) {
    if (!entityId || entityId === 'GEN') return '/system/audit-log'
    const type = String(entityType).toLowerCase()
    const id = String(entityId).trim()

    if (type.includes('purchase') || id.startsWith('PO-')) return `/procurement/purchase-orders/detail?id=${encodeURIComponent(id)}`
    if (type.includes('receipt') || id.startsWith('GR-') || id.startsWith('REC-')) return `/procurement/receipts/detail?id=${encodeURIComponent(id)}`
    if (type.includes('stock_req') || id.startsWith('SR-')) return `/inventory/stock-requests/detail?id=${encodeURIComponent(id)}`
    if (type.includes('transfer') || id.startsWith('TR-')) return `/inventory/transfers/detail?id=${encodeURIComponent(id)}`
    if (type.includes('adjust') || id.startsWith('ADJ-')) return `/inventory/adjustments/detail?id=${encodeURIComponent(id)}`
    if (type.includes('unit') || id.startsWith('UNIT-') || id.startsWith('CH') || id.startsWith('DS11-') || id.startsWith('E125-')) return `/inventory/units/detail?id=${encodeURIComponent(id)}`
    if (type.includes('quote') || id.startsWith('QT-')) return `/sales/quotations/detail?id=${encodeURIComponent(id)}`
    if (type.includes('lead') || id.startsWith('LD-')) return `/sales/leads/detail?id=${encodeURIComponent(id)}`
    if (type.includes('customer') || id.startsWith('CUST-') || id.startsWith('C-')) return `/sales/customers/detail?id=${encodeURIComponent(id)}`
    if (type.includes('order') || id.startsWith('ORD-') || id.startsWith('SO-') || id.startsWith('CO-')) return `/sales/orders/detail?id=${encodeURIComponent(id)}`
    if (type.includes('invoice') || id.startsWith('INV-')) return `/sales/invoices/detail?id=${encodeURIComponent(id)}`
    if (type.includes('payment') || id.startsWith('PAY-')) return `/sales/invoices`
    if (type.includes('delivery') || id.startsWith('DEL-') || id.startsWith('DH-')) return `/sales/delivery-handover/detail?id=${encodeURIComponent(id)}`
    if (type.includes('case') || id.startsWith('SC-')) return `/after-sales/repairs/detail?id=${encodeURIComponent(id)}`
    if (type.includes('repair') || id.startsWith('RJ-')) return `/after-sales/repairs/detail?id=${encodeURIComponent(id)}`
    if (type.includes('warranty') || id.startsWith('WAR-')) return `/after-sales/repairs`
    if (type.includes('expense') || id.startsWith('EXP-')) return `/finance/expenses/detail?id=${encodeURIComponent(id)}`
    if (type.includes('user') || id.startsWith('USR-')) return `/organisation/users/detail?id=${encodeURIComponent(id)}`
    if (type.includes('branch') || id.startsWith('BR-')) return `/organisation/branches/detail?id=${encodeURIComponent(id)}`
    if (type.includes('role') || id.startsWith('ROL-')) return `/organisation/roles`
    if (type.includes('product') || id.startsWith('PRD-')) return `/catalogue/products/detail?id=${encodeURIComponent(id)}`

    return '/system/audit-log'
  },

  addAuditLog(entry) {
    if (!entry) return null

    const currentUser = this.currentUser || { id: 'USR-01', name: 'Super Admin', role: 'Super Admin', branchName: 'All Branches' }
    const userId = entry.user_id || currentUser.id || 'USR-01'
    const actorName = entry.actor_name || entry.user || currentUser.name || 'System'
    const actorRole = entry.actor_role || entry.role || currentUser.role || 'Super Admin'

    const branchName = entry.branch || currentUser.branchName || this.getActiveBranch() || 'Peshawar'
    const branchId = entry.branch_id || (
      branchName === 'Peshawar' ? 'BR-01' : 
      branchName === 'Islamabad' ? 'BR-02' : 
      branchName === 'Lahore' ? 'BR-03' : 
      branchName === 'Rawalpindi' ? 'BR-04' : 'ALL'
    )

    const entityType = String(entry.entity_type || entry.module || 'system').toLowerCase()
    const entityId = String(entry.entity_id || entry.record || 'GEN').trim()
    const action = entry.action || entry.operation || 'Updated'
    const eventType = entry.event_type || `${entityType.toUpperCase()}_${action.toUpperCase().replace(/\s+/g, '_')}`

    // Deduplication check
    const dedupeKey = `${entityType}_${entityId}_${eventType}_${entry.created_at ? entry.created_at.slice(0, 16) : new Date().toISOString().slice(0, 16)}`
    if (this._auditDedupeKeys && this._auditDedupeKeys.has(dedupeKey)) {
      return this.auditLogs.find(a => a.entity_type === entityType && a.entity_id === entityId)
    }
    if (!this._auditDedupeKeys) this._auditDedupeKeys = new Set()
    this._auditDedupeKeys.add(dedupeKey)

    const now = new Date()
    const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`
    const dateStr = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}`

    const link = entry.link || this.resolveEntityRoute(entityType, entityId)
    const moduleName = entry.module || this.resolveEntityModule(entityType)

    const auditObj = {
      id: entry.id || `AUD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      event_type: eventType,
      action,
      operation: action,
      entity_type: entityType,
      entity_id: entityId,
      record: entityId,
      user_id: userId,
      user: actorName,
      actor_name: actorName,
      role: actorRole,
      actor_role: actorRole,
      target_user_id: entry.target_user_id || null,
      branch_id: branchId,
      branch: branchName,
      module: moduleName,
      description: entry.description || `${action} on ${entityType} ${entityId}.`,
      result: entry.result || entry.description || `${action} completed`,
      metadata: entry.metadata || {},
      created_at: entry.created_at || now.toISOString(),
      timestamp: entry.timestamp || `${dateStr} ${timeStr}`,
      link
    }

    this.auditLogs.unshift(auditObj)
    return auditObj
  },

  getAuditLogsForUser(user) {
    const currentUser = user || this.currentUser
    if (!currentUser || currentUser.isSuperAdmin) {
      return this.auditLogs
    }
    const branchName = (currentUser.branchName || 'Peshawar').toLowerCase()
    const branchId = currentUser.branch_id || 'BR-01'

    return this.auditLogs.filter(a => {
      if (a.branch_id === 'ALL' || !a.branch || a.branch.toLowerCase() === 'all branches' || a.branch.toLowerCase() === 'all') return true
      if (a.branch_id && a.branch_id === branchId) return true
      if (a.branch && a.branch.toLowerCase() === branchName) return true
      return false
    })
  },

  getAuditLogsForEntity(entityType, entityId) {
    if (!entityId) return []
    const targetType = String(entityType).toLowerCase().replace(/[-_\s]/g, '')
    const targetId = String(entityId).toLowerCase().trim()

    return this.auditLogs.filter(a => {
      const aType = String(a.entity_type || '').toLowerCase().replace(/[-_\s]/g, '')
      const aId = String(a.entity_id || a.record || '').toLowerCase().trim()
      
      const typeMatch = !targetType || aType === targetType || aType.includes(targetType) || targetType.includes(aType)
      const idMatch = aId === targetId || 
                      aId.replace(/^(ord|po|sc|rj|inv|cust|ld|tr|sr)-/, '') === targetId.replace(/^(ord|po|sc|rj|inv|cust|ld|tr|sr)-/, '') ||
                      targetId.includes(aId) || aId.includes(targetId)

      return typeMatch && idMatch
    })
  },

  getAuditLogById(id) {
    if (!id) return null
    const target = String(id).toLowerCase().trim()
    const exact = this.auditLogs.find(a => a.id && a.id.toLowerCase() === target)
    if (exact) return exact
    return this.auditLogs.find(a => 
      (a.entity_id && a.entity_id.toLowerCase() === target) ||
      (a.record && a.record.toLowerCase() === target)
    ) || null
  },

  // Generic Edit Applier helper
  applyEdit(original, updated) {
    if (!original || !updated) return
    Object.keys(updated).forEach(key => {
      original[key] = updated[key]
    })
  }
})

// Initialize inventory reconciliation on prototype load
store.reconcileInventoryTotals()

// Initialize theme on prototype load
store.applyTheme(savedTheme)

// Watch for system color scheme changes if set to System
if (typeof window !== 'undefined' && window.matchMedia) {
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (store.settings?.system?.theme === 'System') {
        store.applyTheme('System')
      }
    })
  } catch (e) {}
}
