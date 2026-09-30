/**
 * AJ EcoDrive — Branch Manager DAP Machine-Readable Coverage Registry
 * Auto-generated from BRANCH_MANAGER_AND_SYSTEM_FULL_UI_TREE_MAPPING.md
 * Total BM Accessible Routes: 155
 * Total Mapped Training Checkpoints: 3394
 */

export const branchManagerCoverageRegistry = [
  {
    "route": "//",
    "routeName": "/",
    "component": "src/layouts/AuthLayout.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.1",
    "chapterTitle": "Authentication & Identity Security",
    "checkpointsCount": 2,
    "checkpoints": [
      {
        "checkpointId": "M1-R1-H1",
        "elementCategory": "header",
        "label": "AJ ECODRIVE",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R1-H2",
        "elementCategory": "header",
        "label": "One secure gateway to AJ ECODRIVE operations.",
        "trainingType": "observe",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "//",
    "routeName": "/",
    "component": "src/layouts/MainLayout.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.1",
    "chapterTitle": "Authentication & Identity Security",
    "checkpointsCount": 3,
    "checkpoints": [
      {
        "checkpointId": "M1-R2-H1",
        "elementCategory": "header",
        "label": "WORKSPACE",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R2-H2",
        "elementCategory": "header",
        "label": "Branch Manager",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R2-H3",
        "elementCategory": "header",
        "label": "SIGNED IN AS",
        "trainingType": "observe",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/login",
    "routeName": "login",
    "component": "src/views/auth/Login.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.1",
    "chapterTitle": "Authentication & Identity Security",
    "checkpointsCount": 5,
    "checkpoints": [
      {
        "checkpointId": "M1-R3-H1",
        "elementCategory": "header",
        "label": "password123",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R3-H2",
        "elementCategory": "header",
        "label": "(or ",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R3-H3",
        "elementCategory": "header",
        "label": "View Interactive Client Operations Guide (400+ Q&As)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R3-F1",
        "elementCategory": "field",
        "fieldName": "branchCode",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R3-F2",
        "elementCategory": "field",
        "fieldName": "password",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/forgot-password",
    "routeName": "forgot-password",
    "component": "src/views/auth/ForgotPassword.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.1",
    "chapterTitle": "Authentication & Identity Security",
    "checkpointsCount": 2,
    "checkpoints": [
      {
        "checkpointId": "M1-R4-F1",
        "elementCategory": "field",
        "fieldName": "email",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R4-B1",
        "elementCategory": "button",
        "actionName": "Back to Login",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/verify-identity",
    "routeName": "verify-identity",
    "component": "src/views/auth/VerifyIdentity.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.1",
    "chapterTitle": "Authentication & Identity Security",
    "checkpointsCount": 1,
    "checkpoints": [
      {
        "checkpointId": "M1-R5-H1",
        "elementCategory": "header",
        "label": "Code expires in 10 minutes",
        "trainingType": "observe",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/create-new-password",
    "routeName": "create-new-password",
    "component": "src/views/auth/CreateNewPassword.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.1",
    "chapterTitle": "Authentication & Identity Security",
    "checkpointsCount": 2,
    "checkpoints": [
      {
        "checkpointId": "M1-R6-F1",
        "elementCategory": "field",
        "fieldName": "newPassword",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R6-F2",
        "elementCategory": "field",
        "fieldName": "confirmPassword",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/password-updated",
    "routeName": "password-updated",
    "component": "src/views/auth/PasswordUpdated.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.1",
    "chapterTitle": "Authentication & Identity Security",
    "checkpointsCount": 1,
    "checkpoints": [
      {
        "checkpointId": "M1-R7-B1",
        "elementCategory": "button",
        "actionName": "Continue to Login",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/dashboard",
    "routeName": "dashboard",
    "component": "src/views/dashboard/SuperAdminDashboard.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.2",
    "chapterTitle": "Showroom Command Hub & Overview",
    "checkpointsCount": 36,
    "checkpoints": [
      {
        "checkpointId": "M1-R8-H1",
        "elementCategory": "header",
        "label": "Branch Manager Dashboard",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-H2",
        "elementCategory": "header",
        "label": "· Click to view &rsaquo;",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-H3",
        "elementCategory": "header",
        "label": "Sales Trend",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-H4",
        "elementCategory": "header",
        "label": "Branch Snapshot",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-H5",
        "elementCategory": "header",
        "label": "Click tile to open module",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K1",
        "elementCategory": "kpi",
        "label": "Units Sold",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K2",
        "elementCategory": "kpi",
        "label": "Payments Collected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K3",
        "elementCategory": "kpi",
        "label": "Expenses",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K4",
        "elementCategory": "kpi",
        "label": "Open Orders",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K5",
        "elementCategory": "kpi",
        "label": "Available Stock",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K6",
        "elementCategory": "kpi",
        "label": "Reserved",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K7",
        "elementCategory": "kpi",
        "label": "Incoming",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K8",
        "elementCategory": "kpi",
        "label": "Low Stock",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K9",
        "elementCategory": "kpi",
        "label": "Service Cases",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K10",
        "elementCategory": "kpi",
        "label": "Net Sales",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K11",
        "elementCategory": "kpi",
        "label": "Purchases",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K12",
        "elementCategory": "kpi",
        "label": "Operating Expenses",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K13",
        "elementCategory": "kpi",
        "label": "Gross Profit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K14",
        "elementCategory": "kpi",
        "label": "Net Operating Profit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K15",
        "elementCategory": "kpi",
        "label": "Inventory Value",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K16",
        "elementCategory": "kpi",
        "label": "Receivables",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K17",
        "elementCategory": "kpi",
        "label": "Peshawar",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K18",
        "elementCategory": "kpi",
        "label": "Islamabad",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K19",
        "elementCategory": "kpi",
        "label": "Lahore",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K20",
        "elementCategory": "kpi",
        "label": "Rawalpindi",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K21",
        "elementCategory": "kpi",
        "label": "Salaries",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K22",
        "elementCategory": "kpi",
        "label": "Rent",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K23",
        "elementCategory": "kpi",
        "label": "Utilities",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K24",
        "elementCategory": "kpi",
        "label": "Marketing",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-K25",
        "elementCategory": "kpi",
        "label": "Logistics",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-TBL1",
        "elementCategory": "table",
        "columns": [
          "Priority",
          "Item",
          "Record",
          "Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-B1",
        "elementCategory": "button",
        "actionName": "View Full Action Centre &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-B2",
        "elementCategory": "button",
        "actionName": "Open",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-B3",
        "elementCategory": "button",
        "actionName": "View All &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-B4",
        "elementCategory": "button",
        "actionName": "Action Centre &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R8-B5",
        "elementCategory": "button",
        "actionName": "Open Tasks &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/dashboard/action-centre",
    "routeName": "action-centre",
    "component": "src/views/dashboard/ActionCentre.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.1",
    "chapterTitle": "Action Centre 5-Flow Escalation Triage",
    "checkpointsCount": 48,
    "checkpoints": [
      {
        "checkpointId": "M8-R9-H1",
        "elementCategory": "header",
        "label": "Action Centre",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-H2",
        "elementCategory": "header",
        "label": "Pending Actions",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-H3",
        "elementCategory": "header",
        "label": "Action Required",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-H4",
        "elementCategory": "header",
        "label": "Critical Priority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-H5",
        "elementCategory": "header",
        "label": "High Severity",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-T1",
        "elementCategory": "tab",
        "label": "Reset",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-T2",
        "elementCategory": "tab",
        "label": "Clear all filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-TBL1",
        "elementCategory": "table",
        "columns": [
          "Priority",
          "Type",
          "Action Description",
          "Branch / Source",
          "Linked Ref",
          "Due",
          "Status",
          "Treatment"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F2",
        "elementCategory": "field",
        "fieldName": "actionForm.title",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F3",
        "elementCategory": "field",
        "fieldName": "actionForm.priority",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F4",
        "elementCategory": "field",
        "fieldName": "actionForm.pricing.customerName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F5",
        "elementCategory": "field",
        "fieldName": "actionForm.pricing.customerContact",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F6",
        "elementCategory": "field",
        "fieldName": "actionForm.pricing.modelName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F7",
        "elementCategory": "field",
        "fieldName": "actionForm.pricing.orderRef",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F8",
        "elementCategory": "field",
        "fieldName": "actionForm.pricing.competitorContext",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F9",
        "elementCategory": "field",
        "fieldName": "actionForm.stock.originBranch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F10",
        "elementCategory": "field",
        "fieldName": "actionForm.stock.destinationBranch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F11",
        "elementCategory": "field",
        "fieldName": "actionForm.stock.modelName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F12",
        "elementCategory": "field",
        "fieldName": "actionForm.stock.chassisVins",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F13",
        "elementCategory": "field",
        "fieldName": "actionForm.stock.linkedBookingRef",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F14",
        "elementCategory": "field",
        "fieldName": "actionForm.stock.logisticsCarrier",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F15",
        "elementCategory": "field",
        "fieldName": "actionForm.stock.urgencyReason",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F16",
        "elementCategory": "field",
        "fieldName": "actionForm.expense.expenseCategory",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F17",
        "elementCategory": "field",
        "fieldName": "actionForm.expense.payeeVendor",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F18",
        "elementCategory": "field",
        "fieldName": "actionForm.expense.vendorNtn",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F19",
        "elementCategory": "field",
        "fieldName": "actionForm.expense.paymentMethod",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F20",
        "elementCategory": "field",
        "fieldName": "actionForm.expense.invoiceRef",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F21",
        "elementCategory": "field",
        "fieldName": "actionForm.expense.operationalEmergencyJustification",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F22",
        "elementCategory": "field",
        "fieldName": "actionForm.warranty.customerName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F23",
        "elementCategory": "field",
        "fieldName": "actionForm.warranty.vehicleVin",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F24",
        "elementCategory": "field",
        "fieldName": "actionForm.warranty.defectComponent",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F25",
        "elementCategory": "field",
        "fieldName": "actionForm.warranty.diagnosticCode",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F26",
        "elementCategory": "field",
        "fieldName": "actionForm.warranty.replacementSkuNeeded",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F27",
        "elementCategory": "field",
        "fieldName": "actionForm.warranty.technicianFindings",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F28",
        "elementCategory": "field",
        "fieldName": "actionForm.governance.affectedVinOrSku",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F29",
        "elementCategory": "field",
        "fieldName": "actionForm.governance.modelName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-F30",
        "elementCategory": "field",
        "fieldName": "actionForm.governance.rootCauseClassification",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-B1",
        "elementCategory": "button",
        "actionName": "Export Queue",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-B2",
        "elementCategory": "button",
        "actionName": "Treat / Inspect &rarr;",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-B3",
        "elementCategory": "button",
        "actionName": "&larr; Back to Categories",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-B4",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-B5",
        "elementCategory": "button",
        "actionName": "Submit Action Request",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-B6",
        "elementCategory": "button",
        "actionName": "Apply Cap",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-B7",
        "elementCategory": "button",
        "actionName": "Open Source Document",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-B8",
        "elementCategory": "button",
        "actionName": "Counter-Offer / Cap",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-B9",
        "elementCategory": "button",
        "actionName": "Reject Waiver",
        "trainingType": "decision",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R9-B10",
        "elementCategory": "button",
        "actionName": "Approve Full Discount",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/dashboard/quick-actions",
    "routeName": "quick-actions",
    "component": "src/views/dashboard/QuickActions.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.3",
    "chapterTitle": "Managerial Quick Actions Palette",
    "checkpointsCount": 5,
    "checkpoints": [
      {
        "checkpointId": "M1-R10-H1",
        "elementCategory": "header",
        "label": "Quick Actions",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R10-H2",
        "elementCategory": "header",
        "label": "Showroom Quick Actions",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R10-H3",
        "elementCategory": "header",
        "label": "Commercial & Sales Actions",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R10-H4",
        "elementCategory": "header",
        "label": "5 Actions",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R10-H5",
        "elementCategory": "header",
        "label": "Instant",
        "trainingType": "observe",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/organisation/branches",
    "routeName": "organisation-branches",
    "component": "src/views/organisation/Branches.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.4",
    "chapterTitle": "Branch Profile & Parameters",
    "checkpointsCount": 14,
    "checkpoints": [
      {
        "checkpointId": "M1-R11-H1",
        "elementCategory": "header",
        "label": "Branches",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-H2",
        "elementCategory": "header",
        "label": "Add Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-H3",
        "elementCategory": "header",
        "label": "Archive branch?",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-T1",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-K1",
        "elementCategory": "kpi",
        "label": "Total Branches",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-K2",
        "elementCategory": "kpi",
        "label": "Active",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-K3",
        "elementCategory": "kpi",
        "label": "Inactive",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-K4",
        "elementCategory": "kpi",
        "label": "This Month Sales",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-TBL1",
        "elementCategory": "table",
        "columns": [
          "Branch",
          "Code",
          "City",
          "Manager",
          "Sales",
          "Inventory",
          "Expenses",
          "Net Profit",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-B1",
        "elementCategory": "button",
        "actionName": "Add Branch",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-B2",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R11-B3",
        "elementCategory": "button",
        "actionName": "Archive branch",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/organisation/branches/detail",
    "routeName": "organisation-branch-detail-legacy",
    "component": "src/views/organisation/BranchDetail.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.4",
    "chapterTitle": "Branch Profile & Parameters",
    "checkpointsCount": 18,
    "checkpoints": [
      {
        "checkpointId": "M1-R12-H1",
        "elementCategory": "header",
        "label": "Peshawar Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-H2",
        "elementCategory": "header",
        "label": "Net Sales",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-H3",
        "elementCategory": "header",
        "label": "PKR 9.8M",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-H4",
        "elementCategory": "header",
        "label": "+14.2%",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-H5",
        "elementCategory": "header",
        "label": "Units Sold",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-T2",
        "elementCategory": "tab",
        "label": "Performance",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-T3",
        "elementCategory": "tab",
        "label": "Inventory",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-T4",
        "elementCategory": "tab",
        "label": "Sales",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-T5",
        "elementCategory": "tab",
        "label": "Procurement & Inbound",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-T6",
        "elementCategory": "tab",
        "label": "Expenses",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-T7",
        "elementCategory": "tab",
        "label": "Customers",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-T8",
        "elementCategory": "tab",
        "label": "Team",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-T9",
        "elementCategory": "tab",
        "label": "Communication",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-T10",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-T11",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-B1",
        "elementCategory": "button",
        "actionName": "Edit Branch",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R12-B2",
        "elementCategory": "button",
        "actionName": "More",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/organisation/branches/:id",
    "routeName": "organisation-branch-detail",
    "component": "src/views/organisation/BranchDetail.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.4",
    "chapterTitle": "Branch Profile & Parameters",
    "checkpointsCount": 18,
    "checkpoints": [
      {
        "checkpointId": "M1-R13-H1",
        "elementCategory": "header",
        "label": "Peshawar Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-H2",
        "elementCategory": "header",
        "label": "Net Sales",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-H3",
        "elementCategory": "header",
        "label": "PKR 9.8M",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-H4",
        "elementCategory": "header",
        "label": "+14.2%",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-H5",
        "elementCategory": "header",
        "label": "Units Sold",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-T2",
        "elementCategory": "tab",
        "label": "Performance",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-T3",
        "elementCategory": "tab",
        "label": "Inventory",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-T4",
        "elementCategory": "tab",
        "label": "Sales",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-T5",
        "elementCategory": "tab",
        "label": "Procurement & Inbound",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-T6",
        "elementCategory": "tab",
        "label": "Expenses",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-T7",
        "elementCategory": "tab",
        "label": "Customers",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-T8",
        "elementCategory": "tab",
        "label": "Team",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-T9",
        "elementCategory": "tab",
        "label": "Communication",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-T10",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-T11",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-B1",
        "elementCategory": "button",
        "actionName": "Edit Branch",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R13-B2",
        "elementCategory": "button",
        "actionName": "More",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/organisation/users",
    "routeName": "organisation-users",
    "component": "src/views/organisation/UsersAccess.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.5",
    "chapterTitle": "Staff Attendance & Access Roles",
    "checkpointsCount": 11,
    "checkpoints": [
      {
        "checkpointId": "M1-R14-H1",
        "elementCategory": "header",
        "label": "Users & Access",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R14-H2",
        "elementCategory": "header",
        "label": "Add User",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R14-T1",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R14-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R14-K1",
        "elementCategory": "kpi",
        "label": "Users",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R14-K2",
        "elementCategory": "kpi",
        "label": "Active",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R14-K3",
        "elementCategory": "kpi",
        "label": "Pending Invite",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R14-K4",
        "elementCategory": "kpi",
        "label": "MFA Enabled",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R14-TBL1",
        "elementCategory": "table",
        "columns": [
          "User",
          "Role",
          "Branch",
          "MFA",
          "Last Login",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R14-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R14-B1",
        "elementCategory": "button",
        "actionName": "Add User",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/organisation/users/detail",
    "routeName": "organisation-user-detail-legacy",
    "component": "src/views/organisation/UserDetail.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.5",
    "chapterTitle": "Staff Attendance & Access Roles",
    "checkpointsCount": 13,
    "checkpoints": [
      {
        "checkpointId": "M1-R15-H1",
        "elementCategory": "header",
        "label": "Ahsan Khan",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R15-H2",
        "elementCategory": "header",
        "label": "Profile",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R15-H3",
        "elementCategory": "header",
        "label": "Full Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R15-H4",
        "elementCategory": "header",
        "label": "Email",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R15-H5",
        "elementCategory": "header",
        "label": "ahsan@ajecodrive.com",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R15-T1",
        "elementCategory": "tab",
        "label": "Profile",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R15-T2",
        "elementCategory": "tab",
        "label": "Role & Permissions",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R15-T3",
        "elementCategory": "tab",
        "label": "Assigned Branch",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R15-T4",
        "elementCategory": "tab",
        "label": "Sessions",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R15-T5",
        "elementCategory": "tab",
        "label": "Security",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R15-T6",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R15-B1",
        "elementCategory": "button",
        "actionName": "Edit User",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R15-B2",
        "elementCategory": "button",
        "actionName": "More",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/organisation/users/:id",
    "routeName": "organisation-user-detail",
    "component": "src/views/organisation/UserDetail.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.5",
    "chapterTitle": "Staff Attendance & Access Roles",
    "checkpointsCount": 13,
    "checkpoints": [
      {
        "checkpointId": "M1-R16-H1",
        "elementCategory": "header",
        "label": "Ahsan Khan",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R16-H2",
        "elementCategory": "header",
        "label": "Profile",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R16-H3",
        "elementCategory": "header",
        "label": "Full Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R16-H4",
        "elementCategory": "header",
        "label": "Email",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R16-H5",
        "elementCategory": "header",
        "label": "ahsan@ajecodrive.com",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R16-T1",
        "elementCategory": "tab",
        "label": "Profile",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R16-T2",
        "elementCategory": "tab",
        "label": "Role & Permissions",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R16-T3",
        "elementCategory": "tab",
        "label": "Assigned Branch",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R16-T4",
        "elementCategory": "tab",
        "label": "Sessions",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R16-T5",
        "elementCategory": "tab",
        "label": "Security",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R16-T6",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R16-B1",
        "elementCategory": "button",
        "actionName": "Edit User",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R16-B2",
        "elementCategory": "button",
        "actionName": "More",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/catalogue/categories",
    "routeName": "catalogue-categories",
    "component": "src/views/catalogue/Categories.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.1",
    "chapterTitle": "EV Model Catalog & Specifications",
    "checkpointsCount": 13,
    "checkpoints": [
      {
        "checkpointId": "M3-R17-H1",
        "elementCategory": "header",
        "label": "Categories",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R17-H2",
        "elementCategory": "header",
        "label": "Add Category",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R17-H3",
        "elementCategory": "header",
        "label": "Category Hierarchy",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R17-H4",
        "elementCategory": "header",
        "label": "Specification Templates",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R17-T1",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R17-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R17-K1",
        "elementCategory": "kpi",
        "label": "Categories",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R17-K2",
        "elementCategory": "kpi",
        "label": "Subcategories",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R17-K3",
        "elementCategory": "kpi",
        "label": "Active Products",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R17-K4",
        "elementCategory": "kpi",
        "label": "Archived",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R17-TBL1",
        "elementCategory": "table",
        "columns": [
          "Category",
          "Subcategories",
          "Products",
          "Template",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R17-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R17-B1",
        "elementCategory": "button",
        "actionName": "Add Category",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/catalogue/products",
    "routeName": "catalogue-products",
    "component": "src/views/catalogue/Products.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.1",
    "chapterTitle": "EV Model Catalog & Specifications",
    "checkpointsCount": 32,
    "checkpoints": [
      {
        "checkpointId": "M3-R18-H1",
        "elementCategory": "header",
        "label": "Products",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-H2",
        "elementCategory": "header",
        "label": "Columns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-H3",
        "elementCategory": "header",
        "label": "Export",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-H4",
        "elementCategory": "header",
        "label": "Branch Product Catalogue",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-H5",
        "elementCategory": "header",
        "label": "Create Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-T2",
        "elementCategory": "tab",
        "label": "Clear all filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-T3",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-T4",
        "elementCategory": "tab",
        "label": "Clear filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-T5",
        "elementCategory": "tab",
        "label": "All Categories",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-T6",
        "elementCategory": "tab",
        "label": "Electric Bikes",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-T7",
        "elementCategory": "tab",
        "label": "Cargo",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-T8",
        "elementCategory": "tab",
        "label": "Scooters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-K1",
        "elementCategory": "kpi",
        "label": "Active Products",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-K2",
        "elementCategory": "kpi",
        "label": "Available Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-K3",
        "elementCategory": "kpi",
        "label": "Reserved",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-K4",
        "elementCategory": "kpi",
        "label": "Low Stock",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-K5",
        "elementCategory": "kpi",
        "label": "Products",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-K6",
        "elementCategory": "kpi",
        "label": "Active",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-K7",
        "elementCategory": "kpi",
        "label": "Draft",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product",
          "SKU",
          "Category",
          "Selling Price",
          "Available",
          "Reserved",
          "Incoming",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-TBL2",
        "elementCategory": "table",
        "columns": [
          "Product",
          "SKU",
          "Category",
          "Selling Price",
          "Total",
          "Available",
          "Reserved",
          "Incoming",
          "Low Stock",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-B1",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-B2",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-B3",
        "elementCategory": "button",
        "actionName": "View Details",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-B4",
        "elementCategory": "button",
        "actionName": "Mark as Low Stock",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-B5",
        "elementCategory": "button",
        "actionName": "Mark as Poor Stock",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-B6",
        "elementCategory": "button",
        "actionName": "Create Product",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-B7",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R18-B8",
        "elementCategory": "button",
        "actionName": "Archive product",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/catalogue/products/detail",
    "routeName": "catalogue-product-detail-legacy",
    "component": "src/views/catalogue/ProductDetail.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.1",
    "chapterTitle": "EV Model Catalog & Specifications",
    "checkpointsCount": 48,
    "checkpoints": [
      {
        "checkpointId": "M3-R19-H1",
        "elementCategory": "header",
        "label": "Product Detail — BRG E9 Pro",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-H2",
        "elementCategory": "header",
        "label": "Warranty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-H3",
        "elementCategory": "header",
        "label": "24 months",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-H4",
        "elementCategory": "header",
        "label": "Category",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-H5",
        "elementCategory": "header",
        "label": "Electric Scooter",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-T2",
        "elementCategory": "tab",
        "label": "Specifications",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-T3",
        "elementCategory": "tab",
        "label": "Variants",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-T4",
        "elementCategory": "tab",
        "label": "Pricing",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-T5",
        "elementCategory": "tab",
        "label": "Stock by Branch",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-T6",
        "elementCategory": "tab",
        "label": "Serialized Units",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-T7",
        "elementCategory": "tab",
        "label": "Procurement",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-T8",
        "elementCategory": "tab",
        "label": "Sales",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-T9",
        "elementCategory": "tab",
        "label": "Warranty",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-T10",
        "elementCategory": "tab",
        "label": "Media & Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-T11",
        "elementCategory": "tab",
        "label": "Audit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K1",
        "elementCategory": "kpi",
        "label": "Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K2",
        "elementCategory": "kpi",
        "label": "SKU",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K3",
        "elementCategory": "kpi",
        "label": "Selling Price",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K4",
        "elementCategory": "kpi",
        "label": "Available",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K5",
        "elementCategory": "kpi",
        "label": "Reserved",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K6",
        "elementCategory": "kpi",
        "label": "Incoming",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K7",
        "elementCategory": "kpi",
        "label": "Motor",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K8",
        "elementCategory": "kpi",
        "label": "Battery",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K9",
        "elementCategory": "kpi",
        "label": "Range",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K10",
        "elementCategory": "kpi",
        "label": "Charging Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K11",
        "elementCategory": "kpi",
        "label": "Top Speed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K12",
        "elementCategory": "kpi",
        "label": "Dimensions / Weight",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K13",
        "elementCategory": "kpi",
        "label": "Approved Selling Price",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K14",
        "elementCategory": "kpi",
        "label": "Branch Override",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K15",
        "elementCategory": "kpi",
        "label": "Discount Authority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K16",
        "elementCategory": "kpi",
        "label": "Cost / Landed Cost",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K17",
        "elementCategory": "kpi",
        "label": "Price Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K18",
        "elementCategory": "kpi",
        "label": "Effective Scope",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K19",
        "elementCategory": "kpi",
        "label": "QC / Hold",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K20",
        "elementCategory": "kpi",
        "label": "Stock Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K21",
        "elementCategory": "kpi",
        "label": "Stock Action",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K22",
        "elementCategory": "kpi",
        "label": "Serial / Chassis",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K23",
        "elementCategory": "kpi",
        "label": "Unit Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K24",
        "elementCategory": "kpi",
        "label": "Current Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-K25",
        "elementCategory": "kpi",
        "label": "Reservation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-TBL1",
        "elementCategory": "table",
        "columns": [
          "Specification",
          "Value"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-TBL2",
        "elementCategory": "table",
        "columns": [
          "Variant",
          "Code",
          "Selling Price",
          "Active",
          "Stock"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-TBL3",
        "elementCategory": "table",
        "columns": [
          "Effective",
          "Price",
          "Reason",
          "Changed By"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-TBL4",
        "elementCategory": "table",
        "columns": [
          "Branch",
          "Available",
          "Reserved",
          "Incoming",
          "QC",
          "Total",
          "Value"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-TBL5",
        "elementCategory": "table",
        "columns": [
          "Serial",
          "Chassis",
          "Branch",
          "Status",
          "Landed Cost",
          "Customer",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-B1",
        "elementCategory": "button",
        "actionName": "Edit Product",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R19-B2",
        "elementCategory": "button",
        "actionName": "More ▼",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/catalogue/products/:id",
    "routeName": "catalogue-product-detail",
    "component": "src/views/catalogue/ProductDetail.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.1",
    "chapterTitle": "EV Model Catalog & Specifications",
    "checkpointsCount": 48,
    "checkpoints": [
      {
        "checkpointId": "M3-R20-H1",
        "elementCategory": "header",
        "label": "Product Detail — BRG E9 Pro",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-H2",
        "elementCategory": "header",
        "label": "Warranty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-H3",
        "elementCategory": "header",
        "label": "24 months",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-H4",
        "elementCategory": "header",
        "label": "Category",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-H5",
        "elementCategory": "header",
        "label": "Electric Scooter",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-T2",
        "elementCategory": "tab",
        "label": "Specifications",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-T3",
        "elementCategory": "tab",
        "label": "Variants",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-T4",
        "elementCategory": "tab",
        "label": "Pricing",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-T5",
        "elementCategory": "tab",
        "label": "Stock by Branch",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-T6",
        "elementCategory": "tab",
        "label": "Serialized Units",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-T7",
        "elementCategory": "tab",
        "label": "Procurement",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-T8",
        "elementCategory": "tab",
        "label": "Sales",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-T9",
        "elementCategory": "tab",
        "label": "Warranty",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-T10",
        "elementCategory": "tab",
        "label": "Media & Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-T11",
        "elementCategory": "tab",
        "label": "Audit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K1",
        "elementCategory": "kpi",
        "label": "Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K2",
        "elementCategory": "kpi",
        "label": "SKU",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K3",
        "elementCategory": "kpi",
        "label": "Selling Price",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K4",
        "elementCategory": "kpi",
        "label": "Available",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K5",
        "elementCategory": "kpi",
        "label": "Reserved",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K6",
        "elementCategory": "kpi",
        "label": "Incoming",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K7",
        "elementCategory": "kpi",
        "label": "Motor",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K8",
        "elementCategory": "kpi",
        "label": "Battery",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K9",
        "elementCategory": "kpi",
        "label": "Range",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K10",
        "elementCategory": "kpi",
        "label": "Charging Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K11",
        "elementCategory": "kpi",
        "label": "Top Speed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K12",
        "elementCategory": "kpi",
        "label": "Dimensions / Weight",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K13",
        "elementCategory": "kpi",
        "label": "Approved Selling Price",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K14",
        "elementCategory": "kpi",
        "label": "Branch Override",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K15",
        "elementCategory": "kpi",
        "label": "Discount Authority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K16",
        "elementCategory": "kpi",
        "label": "Cost / Landed Cost",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K17",
        "elementCategory": "kpi",
        "label": "Price Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K18",
        "elementCategory": "kpi",
        "label": "Effective Scope",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K19",
        "elementCategory": "kpi",
        "label": "QC / Hold",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K20",
        "elementCategory": "kpi",
        "label": "Stock Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K21",
        "elementCategory": "kpi",
        "label": "Stock Action",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K22",
        "elementCategory": "kpi",
        "label": "Serial / Chassis",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K23",
        "elementCategory": "kpi",
        "label": "Unit Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K24",
        "elementCategory": "kpi",
        "label": "Current Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-K25",
        "elementCategory": "kpi",
        "label": "Reservation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-TBL1",
        "elementCategory": "table",
        "columns": [
          "Specification",
          "Value"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-TBL2",
        "elementCategory": "table",
        "columns": [
          "Variant",
          "Code",
          "Selling Price",
          "Active",
          "Stock"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-TBL3",
        "elementCategory": "table",
        "columns": [
          "Effective",
          "Price",
          "Reason",
          "Changed By"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-TBL4",
        "elementCategory": "table",
        "columns": [
          "Branch",
          "Available",
          "Reserved",
          "Incoming",
          "QC",
          "Total",
          "Value"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-TBL5",
        "elementCategory": "table",
        "columns": [
          "Serial",
          "Chassis",
          "Branch",
          "Status",
          "Landed Cost",
          "Customer",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-B1",
        "elementCategory": "button",
        "actionName": "Edit Product",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R20-B2",
        "elementCategory": "button",
        "actionName": "More ▼",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/catalogue/requests",
    "routeName": "catalogue-requests",
    "component": "src/views/catalogue/ProductRequests.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.8",
    "chapterTitle": "Special Catalogue Requests",
    "checkpointsCount": 18,
    "checkpoints": [
      {
        "checkpointId": "M5-R21-H1",
        "elementCategory": "header",
        "label": "Product Requests",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-H2",
        "elementCategory": "header",
        "label": "New Product Request",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-H3",
        "elementCategory": "header",
        "label": "Requests",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-T3",
        "elementCategory": "tab",
        "label": "All",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-T4",
        "elementCategory": "tab",
        "label": "Pending",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-T5",
        "elementCategory": "tab",
        "label": "Approved",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-T6",
        "elementCategory": "tab",
        "label": "Rejected",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-K1",
        "elementCategory": "kpi",
        "label": "Open",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-K2",
        "elementCategory": "kpi",
        "label": "Submitted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-K3",
        "elementCategory": "kpi",
        "label": "Approved",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-K4",
        "elementCategory": "kpi",
        "label": "Rejected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-TBL1",
        "elementCategory": "table",
        "columns": [
          "Request",
          "Requested Product",
          "Reason",
          "Submitted",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-TBL2",
        "elementCategory": "table",
        "columns": [
          "Request",
          "Branch",
          "Requested Product",
          "Reason",
          "Submitted",
          "Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R21-B1",
        "elementCategory": "button",
        "actionName": "New Product Request",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/catalogue/requests/create",
    "routeName": "catalogue-create-request",
    "component": "src/views/catalogue/CreateProductRequest.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.8",
    "chapterTitle": "Special Catalogue Requests",
    "checkpointsCount": 13,
    "checkpoints": [
      {
        "checkpointId": "M5-R22-H1",
        "elementCategory": "header",
        "label": "Requested Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R22-H2",
        "elementCategory": "header",
        "label": "Existing Categories",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R22-H3",
        "elementCategory": "header",
        "label": "Custom",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R22-H4",
        "elementCategory": "header",
        "label": "Demand & Evidence",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R22-F1",
        "elementCategory": "field",
        "fieldName": "form.productName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R22-F2",
        "elementCategory": "field",
        "fieldName": "form.category",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R22-F3",
        "elementCategory": "field",
        "fieldName": "form.specifications",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R22-F4",
        "elementCategory": "field",
        "fieldName": "form.reference",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R22-F5",
        "elementCategory": "field",
        "fieldName": "form.customerDemand",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R22-F6",
        "elementCategory": "field",
        "fieldName": "form.urgency",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R22-F7",
        "elementCategory": "field",
        "fieldName": "form.images",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R22-F8",
        "elementCategory": "field",
        "fieldName": "form.reason",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R22-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/catalogue/create-request",
    "routeName": "catalogue-create-request-alias",
    "component": "src/views/catalogue/CreateProductRequest.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.8",
    "chapterTitle": "Special Catalogue Requests",
    "checkpointsCount": 13,
    "checkpoints": [
      {
        "checkpointId": "M5-R23-H1",
        "elementCategory": "header",
        "label": "Requested Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R23-H2",
        "elementCategory": "header",
        "label": "Existing Categories",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R23-H3",
        "elementCategory": "header",
        "label": "Custom",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R23-H4",
        "elementCategory": "header",
        "label": "Demand & Evidence",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R23-F1",
        "elementCategory": "field",
        "fieldName": "form.productName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R23-F2",
        "elementCategory": "field",
        "fieldName": "form.category",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R23-F3",
        "elementCategory": "field",
        "fieldName": "form.specifications",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R23-F4",
        "elementCategory": "field",
        "fieldName": "form.reference",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R23-F5",
        "elementCategory": "field",
        "fieldName": "form.customerDemand",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R23-F6",
        "elementCategory": "field",
        "fieldName": "form.urgency",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R23-F7",
        "elementCategory": "field",
        "fieldName": "form.images",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R23-F8",
        "elementCategory": "field",
        "fieldName": "form.reason",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R23-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/catalogue/requests/detail",
    "routeName": "catalogue-request-detail-legacy",
    "component": "src/views/catalogue/ProductRequestDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.8",
    "chapterTitle": "Special Catalogue Requests",
    "checkpointsCount": 35,
    "checkpoints": [
      {
        "checkpointId": "M5-R24-H1",
        "elementCategory": "header",
        "label": "Product Request PR-028",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-H2",
        "elementCategory": "header",
        "label": "Branch context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-H3",
        "elementCategory": "header",
        "label": "Super Admin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-H4",
        "elementCategory": "header",
        "label": "Catalogue Team",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-H5",
        "elementCategory": "header",
        "label": "Linked Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K1",
        "elementCategory": "kpi",
        "label": "Requested Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K2",
        "elementCategory": "kpi",
        "label": "Category",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K3",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K4",
        "elementCategory": "kpi",
        "label": "Requested Qty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K5",
        "elementCategory": "kpi",
        "label": "Reason",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K6",
        "elementCategory": "kpi",
        "label": "Urgency",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K7",
        "elementCategory": "kpi",
        "label": "Review Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K8",
        "elementCategory": "kpi",
        "label": "Assigned Reviewer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K9",
        "elementCategory": "kpi",
        "label": "Feasibility",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K10",
        "elementCategory": "kpi",
        "label": "Estimated Decision",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K11",
        "elementCategory": "kpi",
        "label": "Feedback Notes",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K12",
        "elementCategory": "kpi",
        "label": "Action Needed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K13",
        "elementCategory": "kpi",
        "label": "Master Product ID",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K14",
        "elementCategory": "kpi",
        "label": "SKU Assigned",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K15",
        "elementCategory": "kpi",
        "label": "Catalogue Category",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K16",
        "elementCategory": "kpi",
        "label": "Target Launch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K17",
        "elementCategory": "kpi",
        "label": "Target Price",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K18",
        "elementCategory": "kpi",
        "label": "Availability Scope",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K19",
        "elementCategory": "kpi",
        "label": "Latest Message",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K20",
        "elementCategory": "kpi",
        "label": "Sender",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K21",
        "elementCategory": "kpi",
        "label": "Timestamp",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K22",
        "elementCategory": "kpi",
        "label": "Total Messages",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K23",
        "elementCategory": "kpi",
        "label": "Branch Sender",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K24",
        "elementCategory": "kpi",
        "label": "Channel",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-K25",
        "elementCategory": "kpi",
        "label": "Created",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-B1",
        "elementCategory": "button",
        "actionName": "Review Request",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-B2",
        "elementCategory": "button",
        "actionName": "More ▼",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-B3",
        "elementCategory": "button",
        "actionName": "Reject",
        "trainingType": "decision",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-B4",
        "elementCategory": "button",
        "actionName": "Request Information",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R24-B5",
        "elementCategory": "button",
        "actionName": "Approve & Convert to Product",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/catalogue/requests/:id",
    "routeName": "catalogue-request-detail",
    "component": "src/views/catalogue/ProductRequestDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.8",
    "chapterTitle": "Special Catalogue Requests",
    "checkpointsCount": 35,
    "checkpoints": [
      {
        "checkpointId": "M5-R25-H1",
        "elementCategory": "header",
        "label": "Product Request PR-028",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-H2",
        "elementCategory": "header",
        "label": "Branch context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-H3",
        "elementCategory": "header",
        "label": "Super Admin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-H4",
        "elementCategory": "header",
        "label": "Catalogue Team",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-H5",
        "elementCategory": "header",
        "label": "Linked Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K1",
        "elementCategory": "kpi",
        "label": "Requested Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K2",
        "elementCategory": "kpi",
        "label": "Category",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K3",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K4",
        "elementCategory": "kpi",
        "label": "Requested Qty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K5",
        "elementCategory": "kpi",
        "label": "Reason",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K6",
        "elementCategory": "kpi",
        "label": "Urgency",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K7",
        "elementCategory": "kpi",
        "label": "Review Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K8",
        "elementCategory": "kpi",
        "label": "Assigned Reviewer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K9",
        "elementCategory": "kpi",
        "label": "Feasibility",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K10",
        "elementCategory": "kpi",
        "label": "Estimated Decision",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K11",
        "elementCategory": "kpi",
        "label": "Feedback Notes",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K12",
        "elementCategory": "kpi",
        "label": "Action Needed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K13",
        "elementCategory": "kpi",
        "label": "Master Product ID",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K14",
        "elementCategory": "kpi",
        "label": "SKU Assigned",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K15",
        "elementCategory": "kpi",
        "label": "Catalogue Category",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K16",
        "elementCategory": "kpi",
        "label": "Target Launch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K17",
        "elementCategory": "kpi",
        "label": "Target Price",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K18",
        "elementCategory": "kpi",
        "label": "Availability Scope",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K19",
        "elementCategory": "kpi",
        "label": "Latest Message",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K20",
        "elementCategory": "kpi",
        "label": "Sender",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K21",
        "elementCategory": "kpi",
        "label": "Timestamp",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K22",
        "elementCategory": "kpi",
        "label": "Total Messages",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K23",
        "elementCategory": "kpi",
        "label": "Branch Sender",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K24",
        "elementCategory": "kpi",
        "label": "Channel",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-K25",
        "elementCategory": "kpi",
        "label": "Created",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-B1",
        "elementCategory": "button",
        "actionName": "Review Request",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-B2",
        "elementCategory": "button",
        "actionName": "More ▼",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-B3",
        "elementCategory": "button",
        "actionName": "Reject",
        "trainingType": "decision",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-B4",
        "elementCategory": "button",
        "actionName": "Request Information",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R25-B5",
        "elementCategory": "button",
        "actionName": "Approve & Convert to Product",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/suppliers",
    "routeName": "procurement-suppliers",
    "component": "src/views/procurement/Suppliers.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 11,
    "checkpoints": [
      {
        "checkpointId": "M5-R26-H1",
        "elementCategory": "header",
        "label": "Suppliers",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R26-H2",
        "elementCategory": "header",
        "label": "Add Supplier",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R26-T1",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R26-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R26-K1",
        "elementCategory": "kpi",
        "label": "Suppliers",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R26-K2",
        "elementCategory": "kpi",
        "label": "Active",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R26-K3",
        "elementCategory": "kpi",
        "label": "Open POs",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R26-K4",
        "elementCategory": "kpi",
        "label": "Payables",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R26-TBL1",
        "elementCategory": "table",
        "columns": [
          "Supplier",
          "Contact",
          "Products",
          "Open POs",
          "Purchases YTD",
          "Payable",
          "On-Time",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R26-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R26-B1",
        "elementCategory": "button",
        "actionName": "Add Supplier",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/suppliers/detail",
    "routeName": "procurement-supplier-detail-legacy",
    "component": "src/views/procurement/SupplierDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 22,
    "checkpoints": [
      {
        "checkpointId": "M5-R27-H1",
        "elementCategory": "header",
        "label": "BRG Factory",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-H2",
        "elementCategory": "header",
        "label": "SUP-BRG-001 &middot; Shenzhen, China",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-H3",
        "elementCategory": "header",
        "label": "Purchases YTD",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-H4",
        "elementCategory": "header",
        "label": "PKR 38.4M",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-H5",
        "elementCategory": "header",
        "label": "Open POs",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-T2",
        "elementCategory": "tab",
        "label": "Contacts",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-T3",
        "elementCategory": "tab",
        "label": "Products",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-T4",
        "elementCategory": "tab",
        "label": "Purchase Orders",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-T5",
        "elementCategory": "tab",
        "label": "Receipts",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-T6",
        "elementCategory": "tab",
        "label": "Bills & Payments",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-T7",
        "elementCategory": "tab",
        "label": "Returns",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-T8",
        "elementCategory": "tab",
        "label": "Performance",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-T9",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-T10",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-TBL1",
        "elementCategory": "table",
        "columns": [
          "Name",
          "Role",
          "Email",
          "Phone",
          "Primary"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-TBL2",
        "elementCategory": "table",
        "columns": [
          "Product",
          "SKU",
          "Last Cost",
          "Lead Time",
          "MOQ",
          "Active"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-TBL3",
        "elementCategory": "table",
        "columns": [
          "PO",
          "Destination",
          "Amount",
          "Status",
          "ETA",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-TBL4",
        "elementCategory": "table",
        "columns": [
          "Receipt",
          "PO",
          "Location",
          "Units",
          "Discrepancy",
          "Date",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-TBL5",
        "elementCategory": "table",
        "columns": [
          "Bill",
          "PO",
          "Amount",
          "Due",
          "Paid",
          "Outstanding",
          "Match"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-B1",
        "elementCategory": "button",
        "actionName": "Edit Supplier",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R27-B2",
        "elementCategory": "button",
        "actionName": "More ▼",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/suppliers/:id",
    "routeName": "procurement-supplier-detail",
    "component": "src/views/procurement/SupplierDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 22,
    "checkpoints": [
      {
        "checkpointId": "M5-R28-H1",
        "elementCategory": "header",
        "label": "BRG Factory",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-H2",
        "elementCategory": "header",
        "label": "SUP-BRG-001 &middot; Shenzhen, China",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-H3",
        "elementCategory": "header",
        "label": "Purchases YTD",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-H4",
        "elementCategory": "header",
        "label": "PKR 38.4M",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-H5",
        "elementCategory": "header",
        "label": "Open POs",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-T2",
        "elementCategory": "tab",
        "label": "Contacts",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-T3",
        "elementCategory": "tab",
        "label": "Products",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-T4",
        "elementCategory": "tab",
        "label": "Purchase Orders",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-T5",
        "elementCategory": "tab",
        "label": "Receipts",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-T6",
        "elementCategory": "tab",
        "label": "Bills & Payments",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-T7",
        "elementCategory": "tab",
        "label": "Returns",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-T8",
        "elementCategory": "tab",
        "label": "Performance",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-T9",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-T10",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-TBL1",
        "elementCategory": "table",
        "columns": [
          "Name",
          "Role",
          "Email",
          "Phone",
          "Primary"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-TBL2",
        "elementCategory": "table",
        "columns": [
          "Product",
          "SKU",
          "Last Cost",
          "Lead Time",
          "MOQ",
          "Active"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-TBL3",
        "elementCategory": "table",
        "columns": [
          "PO",
          "Destination",
          "Amount",
          "Status",
          "ETA",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-TBL4",
        "elementCategory": "table",
        "columns": [
          "Receipt",
          "PO",
          "Location",
          "Units",
          "Discrepancy",
          "Date",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-TBL5",
        "elementCategory": "table",
        "columns": [
          "Bill",
          "PO",
          "Amount",
          "Due",
          "Paid",
          "Outstanding",
          "Match"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-B1",
        "elementCategory": "button",
        "actionName": "Edit Supplier",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R28-B2",
        "elementCategory": "button",
        "actionName": "More ▼",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/purchase-orders",
    "routeName": "procurement-purchase-orders",
    "component": "src/views/procurement/PurchaseOrders.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 7,
    "checkpoints": [
      {
        "checkpointId": "M5-R29-H1",
        "elementCategory": "header",
        "label": "Purchase Orders",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R29-H2",
        "elementCategory": "header",
        "label": "Create Purchase Order",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R29-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R29-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R29-TBL1",
        "elementCategory": "table",
        "columns": [
          "PO",
          "Supplier",
          "Destination",
          "Amount",
          "Units",
          "Expected",
          "Status",
          "Match",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R29-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R29-B1",
        "elementCategory": "button",
        "actionName": "Create Purchase Order",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/purchase-orders/create",
    "routeName": "procurement-create-purchase-order",
    "component": "src/views/procurement/CreatePurchaseOrder.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 17,
    "checkpoints": [
      {
        "checkpointId": "M5-R30-H1",
        "elementCategory": "header",
        "label": "Create Purchase Order",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-H2",
        "elementCategory": "header",
        "label": "1. Supplier & Destination",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-H3",
        "elementCategory": "header",
        "label": "2. Products",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-H4",
        "elementCategory": "header",
        "label": "3. Costs & Shipment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-H5",
        "elementCategory": "header",
        "label": "4. Terms & Review",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-F1",
        "elementCategory": "field",
        "fieldName": "form.supplier",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-F2",
        "elementCategory": "field",
        "fieldName": "form.destination",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-F3",
        "elementCategory": "field",
        "fieldName": "form.expectedArrival",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-F4",
        "elementCategory": "field",
        "fieldName": "form.expectedCost",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-F5",
        "elementCategory": "field",
        "fieldName": "form.estimatedFreight",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-F6",
        "elementCategory": "field",
        "fieldName": "form.shipmentMethod",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-F7",
        "elementCategory": "field",
        "fieldName": "form.paymentTerms",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-F8",
        "elementCategory": "field",
        "fieldName": "form.documents",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-F9",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-B2",
        "elementCategory": "button",
        "actionName": "Save Draft",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R30-B3",
        "elementCategory": "button",
        "actionName": "Submit for Approval",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/create-po",
    "routeName": "procurement-create-po-alias",
    "component": "src/views/procurement/CreatePurchaseOrder.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 17,
    "checkpoints": [
      {
        "checkpointId": "M5-R31-H1",
        "elementCategory": "header",
        "label": "Create Purchase Order",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-H2",
        "elementCategory": "header",
        "label": "1. Supplier & Destination",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-H3",
        "elementCategory": "header",
        "label": "2. Products",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-H4",
        "elementCategory": "header",
        "label": "3. Costs & Shipment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-H5",
        "elementCategory": "header",
        "label": "4. Terms & Review",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-F1",
        "elementCategory": "field",
        "fieldName": "form.supplier",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-F2",
        "elementCategory": "field",
        "fieldName": "form.destination",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-F3",
        "elementCategory": "field",
        "fieldName": "form.expectedArrival",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-F4",
        "elementCategory": "field",
        "fieldName": "form.expectedCost",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-F5",
        "elementCategory": "field",
        "fieldName": "form.estimatedFreight",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-F6",
        "elementCategory": "field",
        "fieldName": "form.shipmentMethod",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-F7",
        "elementCategory": "field",
        "fieldName": "form.paymentTerms",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-F8",
        "elementCategory": "field",
        "fieldName": "form.documents",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-F9",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-B2",
        "elementCategory": "button",
        "actionName": "Save Draft",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R31-B3",
        "elementCategory": "button",
        "actionName": "Submit for Approval",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/purchase-orders/detail",
    "routeName": "procurement-purchase-order-detail-legacy",
    "component": "src/views/procurement/PurchaseOrderDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 21,
    "checkpoints": [
      {
        "checkpointId": "M5-R32-H1",
        "elementCategory": "header",
        "label": "Actions",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-H2",
        "elementCategory": "header",
        "label": "Cancel Purchase Order",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-H3",
        "elementCategory": "header",
        "label": "PO Value",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-H4",
        "elementCategory": "header",
        "label": "Ordered Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-H5",
        "elementCategory": "header",
        "label": "Received Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-T2",
        "elementCategory": "tab",
        "label": "Items",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-T3",
        "elementCategory": "tab",
        "label": "Shipment",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-T4",
        "elementCategory": "tab",
        "label": "Receipts",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-T5",
        "elementCategory": "tab",
        "label": "Landed Costs",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-T6",
        "elementCategory": "tab",
        "label": "Vendor Bills",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-T7",
        "elementCategory": "tab",
        "label": "Payments",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-T8",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-T9",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-B1",
        "elementCategory": "button",
        "actionName": "Back to Orders",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-B2",
        "elementCategory": "button",
        "actionName": "More ▼",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-B3",
        "elementCategory": "button",
        "actionName": "Receive goods",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-B4",
        "elementCategory": "button",
        "actionName": "Duplicate PO",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-B5",
        "elementCategory": "button",
        "actionName": "Cancel PO",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-B6",
        "elementCategory": "button",
        "actionName": "Keep PO",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R32-B7",
        "elementCategory": "button",
        "actionName": "Confirm Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/purchase-orders/:id",
    "routeName": "procurement-purchase-order-detail",
    "component": "src/views/procurement/PurchaseOrderDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 21,
    "checkpoints": [
      {
        "checkpointId": "M5-R33-H1",
        "elementCategory": "header",
        "label": "Actions",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-H2",
        "elementCategory": "header",
        "label": "Cancel Purchase Order",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-H3",
        "elementCategory": "header",
        "label": "PO Value",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-H4",
        "elementCategory": "header",
        "label": "Ordered Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-H5",
        "elementCategory": "header",
        "label": "Received Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-T2",
        "elementCategory": "tab",
        "label": "Items",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-T3",
        "elementCategory": "tab",
        "label": "Shipment",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-T4",
        "elementCategory": "tab",
        "label": "Receipts",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-T5",
        "elementCategory": "tab",
        "label": "Landed Costs",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-T6",
        "elementCategory": "tab",
        "label": "Vendor Bills",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-T7",
        "elementCategory": "tab",
        "label": "Payments",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-T8",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-T9",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-B1",
        "elementCategory": "button",
        "actionName": "Back to Orders",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-B2",
        "elementCategory": "button",
        "actionName": "More ▼",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-B3",
        "elementCategory": "button",
        "actionName": "Receive goods",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-B4",
        "elementCategory": "button",
        "actionName": "Duplicate PO",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-B5",
        "elementCategory": "button",
        "actionName": "Cancel PO",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-B6",
        "elementCategory": "button",
        "actionName": "Keep PO",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R33-B7",
        "elementCategory": "button",
        "actionName": "Confirm Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/purchase-orders/:id/receive",
    "routeName": "procurement-receive-purchase-order",
    "component": "src/views/procurement/ReceivePurchase.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 28,
    "checkpoints": [
      {
        "checkpointId": "M5-R34-H1",
        "elementCategory": "header",
        "label": "Receive Purchase (GRN)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-H2",
        "elementCategory": "header",
        "label": "Goods Receipt & Inwarding",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-H3",
        "elementCategory": "header",
        "label": "Purchase Order Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-H4",
        "elementCategory": "header",
        "label": "Unauthorized Branch Access",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-H5",
        "elementCategory": "header",
        "label": "Please correct the following errors before proceeding:",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-T1",
        "elementCategory": "tab",
        "label": "Review GRN &rarr;",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product / SKU",
          "Ordered",
          "Prev. Received",
          "Outstanding",
          "Current Received",
          "Damaged",
          "Accepted",
          "Short",
          "Excess",
          "Discrepancy Reason"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-TBL2",
        "elementCategory": "table",
        "columns": [
          "#",
          "Product",
          "Chassis / VIN",
          "Motor Serial",
          "Battery Serial",
          "Condition",
          "QC Decision"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-TBL3",
        "elementCategory": "table",
        "columns": [
          "Product",
          "Ordered",
          "Prev. Rec",
          "Current Rec",
          "Accepted",
          "Short",
          "Excess",
          "Damaged",
          "Discrepancy Notes"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-F1",
        "elementCategory": "field",
        "fieldName": "receivingForm.location",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-F2",
        "elementCategory": "field",
        "fieldName": "receivingForm.receiver",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-F3",
        "elementCategory": "field",
        "fieldName": "receivingForm.receiptDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-F4",
        "elementCategory": "field",
        "fieldName": "receivingForm.deliveryNote",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-F5",
        "elementCategory": "field",
        "fieldName": "unit.chassis",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-F6",
        "elementCategory": "field",
        "fieldName": "unit.motorNumber",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-F7",
        "elementCategory": "field",
        "fieldName": "unit.batteryNumber",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-F8",
        "elementCategory": "field",
        "fieldName": "unit.condition",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-F9",
        "elementCategory": "field",
        "fieldName": "unit.qc",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-F10",
        "elementCategory": "field",
        "fieldName": "receivingForm.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-B1",
        "elementCategory": "button",
        "actionName": "Back to PO",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-B2",
        "elementCategory": "button",
        "actionName": "Save Draft",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-B3",
        "elementCategory": "button",
        "actionName": "Edit Quantities",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-B4",
        "elementCategory": "button",
        "actionName": "Re-scan / Generate IDs",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-B5",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-B6",
        "elementCategory": "button",
        "actionName": "&larr; Make Changes",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-B7",
        "elementCategory": "button",
        "actionName": "&larr; Back to Quantity Entry",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-B8",
        "elementCategory": "button",
        "actionName": "Confirm & Post Receipt",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R34-B9",
        "elementCategory": "button",
        "actionName": "Post Receipt Now",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/receipts",
    "routeName": "procurement-receipts",
    "component": "src/views/procurement/ReceivePurchase.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 28,
    "checkpoints": [
      {
        "checkpointId": "M5-R35-H1",
        "elementCategory": "header",
        "label": "Receive Purchase (GRN)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-H2",
        "elementCategory": "header",
        "label": "Goods Receipt & Inwarding",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-H3",
        "elementCategory": "header",
        "label": "Purchase Order Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-H4",
        "elementCategory": "header",
        "label": "Unauthorized Branch Access",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-H5",
        "elementCategory": "header",
        "label": "Please correct the following errors before proceeding:",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-T1",
        "elementCategory": "tab",
        "label": "Review GRN &rarr;",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product / SKU",
          "Ordered",
          "Prev. Received",
          "Outstanding",
          "Current Received",
          "Damaged",
          "Accepted",
          "Short",
          "Excess",
          "Discrepancy Reason"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-TBL2",
        "elementCategory": "table",
        "columns": [
          "#",
          "Product",
          "Chassis / VIN",
          "Motor Serial",
          "Battery Serial",
          "Condition",
          "QC Decision"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-TBL3",
        "elementCategory": "table",
        "columns": [
          "Product",
          "Ordered",
          "Prev. Rec",
          "Current Rec",
          "Accepted",
          "Short",
          "Excess",
          "Damaged",
          "Discrepancy Notes"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-F1",
        "elementCategory": "field",
        "fieldName": "receivingForm.location",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-F2",
        "elementCategory": "field",
        "fieldName": "receivingForm.receiver",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-F3",
        "elementCategory": "field",
        "fieldName": "receivingForm.receiptDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-F4",
        "elementCategory": "field",
        "fieldName": "receivingForm.deliveryNote",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-F5",
        "elementCategory": "field",
        "fieldName": "unit.chassis",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-F6",
        "elementCategory": "field",
        "fieldName": "unit.motorNumber",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-F7",
        "elementCategory": "field",
        "fieldName": "unit.batteryNumber",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-F8",
        "elementCategory": "field",
        "fieldName": "unit.condition",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-F9",
        "elementCategory": "field",
        "fieldName": "unit.qc",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-F10",
        "elementCategory": "field",
        "fieldName": "receivingForm.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-B1",
        "elementCategory": "button",
        "actionName": "Back to PO",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-B2",
        "elementCategory": "button",
        "actionName": "Save Draft",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-B3",
        "elementCategory": "button",
        "actionName": "Edit Quantities",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-B4",
        "elementCategory": "button",
        "actionName": "Re-scan / Generate IDs",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-B5",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-B6",
        "elementCategory": "button",
        "actionName": "&larr; Make Changes",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-B7",
        "elementCategory": "button",
        "actionName": "&larr; Back to Quantity Entry",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-B8",
        "elementCategory": "button",
        "actionName": "Confirm & Post Receipt",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R35-B9",
        "elementCategory": "button",
        "actionName": "Post Receipt Now",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/receive-purchase",
    "routeName": "procurement-receive-purchase-alias",
    "component": "src/views/procurement/ReceivePurchase.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 28,
    "checkpoints": [
      {
        "checkpointId": "M5-R36-H1",
        "elementCategory": "header",
        "label": "Receive Purchase (GRN)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-H2",
        "elementCategory": "header",
        "label": "Goods Receipt & Inwarding",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-H3",
        "elementCategory": "header",
        "label": "Purchase Order Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-H4",
        "elementCategory": "header",
        "label": "Unauthorized Branch Access",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-H5",
        "elementCategory": "header",
        "label": "Please correct the following errors before proceeding:",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-T1",
        "elementCategory": "tab",
        "label": "Review GRN &rarr;",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product / SKU",
          "Ordered",
          "Prev. Received",
          "Outstanding",
          "Current Received",
          "Damaged",
          "Accepted",
          "Short",
          "Excess",
          "Discrepancy Reason"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-TBL2",
        "elementCategory": "table",
        "columns": [
          "#",
          "Product",
          "Chassis / VIN",
          "Motor Serial",
          "Battery Serial",
          "Condition",
          "QC Decision"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-TBL3",
        "elementCategory": "table",
        "columns": [
          "Product",
          "Ordered",
          "Prev. Rec",
          "Current Rec",
          "Accepted",
          "Short",
          "Excess",
          "Damaged",
          "Discrepancy Notes"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-F1",
        "elementCategory": "field",
        "fieldName": "receivingForm.location",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-F2",
        "elementCategory": "field",
        "fieldName": "receivingForm.receiver",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-F3",
        "elementCategory": "field",
        "fieldName": "receivingForm.receiptDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-F4",
        "elementCategory": "field",
        "fieldName": "receivingForm.deliveryNote",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-F5",
        "elementCategory": "field",
        "fieldName": "unit.chassis",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-F6",
        "elementCategory": "field",
        "fieldName": "unit.motorNumber",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-F7",
        "elementCategory": "field",
        "fieldName": "unit.batteryNumber",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-F8",
        "elementCategory": "field",
        "fieldName": "unit.condition",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-F9",
        "elementCategory": "field",
        "fieldName": "unit.qc",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-F10",
        "elementCategory": "field",
        "fieldName": "receivingForm.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-B1",
        "elementCategory": "button",
        "actionName": "Back to PO",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-B2",
        "elementCategory": "button",
        "actionName": "Save Draft",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-B3",
        "elementCategory": "button",
        "actionName": "Edit Quantities",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-B4",
        "elementCategory": "button",
        "actionName": "Re-scan / Generate IDs",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-B5",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-B6",
        "elementCategory": "button",
        "actionName": "&larr; Make Changes",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-B7",
        "elementCategory": "button",
        "actionName": "&larr; Back to Quantity Entry",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-B8",
        "elementCategory": "button",
        "actionName": "Confirm & Post Receipt",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R36-B9",
        "elementCategory": "button",
        "actionName": "Post Receipt Now",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/receipts/detail",
    "routeName": "procurement-receipt-detail-legacy",
    "component": "src/views/procurement/ReceiptDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 15,
    "checkpoints": [
      {
        "checkpointId": "M5-R37-H1",
        "elementCategory": "header",
        "label": "Total Received",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-H2",
        "elementCategory": "header",
        "label": "Accepted into Stock",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-H3",
        "elementCategory": "header",
        "label": "Damaged / QC Hold",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-H4",
        "elementCategory": "header",
        "label": "Discrepancy Items",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-H5",
        "elementCategory": "header",
        "label": "Receipt Metadata",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-T2",
        "elementCategory": "tab",
        "label": "Received Lines",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-T3",
        "elementCategory": "tab",
        "label": "Serial & Chassis Units",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-T4",
        "elementCategory": "tab",
        "label": "Discrepancies",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-T5",
        "elementCategory": "tab",
        "label": "QC",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-T6",
        "elementCategory": "tab",
        "label": "Costs",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-T7",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-T8",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-B1",
        "elementCategory": "button",
        "actionName": "Back to PO",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R37-B2",
        "elementCategory": "button",
        "actionName": "Open PO",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/receipts/:id",
    "routeName": "procurement-receipt-detail",
    "component": "src/views/procurement/ReceiptDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 15,
    "checkpoints": [
      {
        "checkpointId": "M5-R38-H1",
        "elementCategory": "header",
        "label": "Total Received",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-H2",
        "elementCategory": "header",
        "label": "Accepted into Stock",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-H3",
        "elementCategory": "header",
        "label": "Damaged / QC Hold",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-H4",
        "elementCategory": "header",
        "label": "Discrepancy Items",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-H5",
        "elementCategory": "header",
        "label": "Receipt Metadata",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-T2",
        "elementCategory": "tab",
        "label": "Received Lines",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-T3",
        "elementCategory": "tab",
        "label": "Serial & Chassis Units",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-T4",
        "elementCategory": "tab",
        "label": "Discrepancies",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-T5",
        "elementCategory": "tab",
        "label": "QC",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-T6",
        "elementCategory": "tab",
        "label": "Costs",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-T7",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-T8",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-B1",
        "elementCategory": "button",
        "actionName": "Back to PO",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R38-B2",
        "elementCategory": "button",
        "actionName": "Open PO",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/purchase-returns",
    "routeName": "procurement-purchase-returns",
    "component": "src/views/procurement/PurchaseReturns.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 10,
    "checkpoints": [
      {
        "checkpointId": "M5-R39-H1",
        "elementCategory": "header",
        "label": "Purchase Returns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R39-H2",
        "elementCategory": "header",
        "label": "Create Purchase Return",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R39-H3",
        "elementCategory": "header",
        "label": "Closed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R39-H4",
        "elementCategory": "header",
        "label": "Approved",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R39-H5",
        "elementCategory": "header",
        "label": "Shipped",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R39-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R39-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R39-TBL1",
        "elementCategory": "table",
        "columns": [
          "Return",
          "Supplier",
          "PO",
          "Units",
          "Reason",
          "Credit",
          "Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R39-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R39-B1",
        "elementCategory": "button",
        "actionName": "Create Purchase Return",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/purchase-returns/create",
    "routeName": "procurement-create-purchase-return",
    "component": "src/views/procurement/CreatePurchaseReturn.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 14,
    "checkpoints": [
      {
        "checkpointId": "M5-R40-H1",
        "elementCategory": "header",
        "label": "Create",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-H2",
        "elementCategory": "header",
        "label": "Create Purchase Return",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-H3",
        "elementCategory": "header",
        "label": "Return Details",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-H4",
        "elementCategory": "header",
        "label": "Units to Return",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-H5",
        "elementCategory": "header",
        "label": "Summary",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product / Serial",
          "Credit Value"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-F1",
        "elementCategory": "field",
        "fieldName": "e.g. Transit damage, QC failure",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-F2",
        "elementCategory": "field",
        "fieldName": "Select product or scan serial",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-F3",
        "elementCategory": "field",
        "fieldName": "PKR",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-B1",
        "elementCategory": "button",
        "actionName": "Save Draft",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-B2",
        "elementCategory": "button",
        "actionName": "+ Add Item",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-B3",
        "elementCategory": "button",
        "actionName": "&times;",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-B4",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R40-B5",
        "elementCategory": "button",
        "actionName": "Submit Return",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/purchase-returns/detail",
    "routeName": "procurement-purchase-return-detail-legacy",
    "component": "src/views/procurement/PurchaseReturnDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 14,
    "checkpoints": [
      {
        "checkpointId": "M5-R41-H1",
        "elementCategory": "header",
        "label": "PRTN-044",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-H2",
        "elementCategory": "header",
        "label": "Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-H3",
        "elementCategory": "header",
        "label": "Expected Credit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-H4",
        "elementCategory": "header",
        "label": "PKR 336K",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-H5",
        "elementCategory": "header",
        "label": "Shipped",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-T2",
        "elementCategory": "tab",
        "label": "Units",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-T3",
        "elementCategory": "tab",
        "label": "Shipment Back",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-T4",
        "elementCategory": "tab",
        "label": "Supplier Credit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-T5",
        "elementCategory": "tab",
        "label": "Financial Effect",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-T6",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-T7",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-B1",
        "elementCategory": "button",
        "actionName": "Update Return",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R41-B2",
        "elementCategory": "button",
        "actionName": "More ▼",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/procurement/purchase-returns/:id",
    "routeName": "procurement-purchase-return-detail",
    "component": "src/views/procurement/PurchaseReturnDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.9",
    "chapterTitle": "Procurement Orders & Receiving",
    "checkpointsCount": 14,
    "checkpoints": [
      {
        "checkpointId": "M5-R42-H1",
        "elementCategory": "header",
        "label": "PRTN-044",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-H2",
        "elementCategory": "header",
        "label": "Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-H3",
        "elementCategory": "header",
        "label": "Expected Credit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-H4",
        "elementCategory": "header",
        "label": "PKR 336K",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-H5",
        "elementCategory": "header",
        "label": "Shipped",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-T2",
        "elementCategory": "tab",
        "label": "Units",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-T3",
        "elementCategory": "tab",
        "label": "Shipment Back",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-T4",
        "elementCategory": "tab",
        "label": "Supplier Credit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-T5",
        "elementCategory": "tab",
        "label": "Financial Effect",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-T6",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-T7",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-B1",
        "elementCategory": "button",
        "actionName": "Update Return",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R42-B2",
        "elementCategory": "button",
        "actionName": "More ▼",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/dashboard",
    "routeName": "inventory-dashboard",
    "component": "src/views/inventory/InventoryDashboard.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.10",
    "chapterTitle": "Inventory Dashboard & Valuations",
    "checkpointsCount": 23,
    "checkpoints": [
      {
        "checkpointId": "M5-R43-H1",
        "elementCategory": "header",
        "label": "Branch Inventory Dashboard",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-H2",
        "elementCategory": "header",
        "label": "Inventory Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-H3",
        "elementCategory": "header",
        "label": "Branch Inventory Value",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-H4",
        "elementCategory": "header",
        "label": "Visibility",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-H5",
        "elementCategory": "header",
        "label": "Shown only if authorised",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K1",
        "elementCategory": "kpi",
        "label": "Available",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K2",
        "elementCategory": "kpi",
        "label": "Reserved",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K3",
        "elementCategory": "kpi",
        "label": "Transfer In Transit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K4",
        "elementCategory": "kpi",
        "label": "Supplier In Transit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K5",
        "elementCategory": "kpi",
        "label": "QC Hold",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K6",
        "elementCategory": "kpi",
        "label": "Returned",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K7",
        "elementCategory": "kpi",
        "label": "Service / Maint.",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K8",
        "elementCategory": "kpi",
        "label": "Serialized Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K9",
        "elementCategory": "kpi",
        "label": "Low Stock Alert",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K10",
        "elementCategory": "kpi",
        "label": "Total Catalog",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K11",
        "elementCategory": "kpi",
        "label": "Peshawar",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K12",
        "elementCategory": "kpi",
        "label": "Islamabad",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K13",
        "elementCategory": "kpi",
        "label": "Lahore",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K14",
        "elementCategory": "kpi",
        "label": "Rawalpindi",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K15",
        "elementCategory": "kpi",
        "label": "Healthy",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K16",
        "elementCategory": "kpi",
        "label": "Low",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-K17",
        "elementCategory": "kpi",
        "label": "Critical",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R43-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product",
          "Branch",
          "Available",
          "Reorder",
          "Age",
          "Alert",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/stock-by-product",
    "routeName": "inventory-stock-by-product",
    "component": "src/views/inventory/StockByProduct.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.1",
    "chapterTitle": "Product Stock & Movement Ledger",
    "checkpointsCount": 18,
    "checkpoints": [
      {
        "checkpointId": "M5-R44-H1",
        "elementCategory": "header",
        "label": "Stock by Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-H2",
        "elementCategory": "header",
        "label": "Columns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-H3",
        "elementCategory": "header",
        "label": "Export",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-T2",
        "elementCategory": "tab",
        "label": "Clear all filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-T3",
        "elementCategory": "tab",
        "label": "Reset Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-T4",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-K1",
        "elementCategory": "kpi",
        "label": "Products",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-K2",
        "elementCategory": "kpi",
        "label": "Low Stock",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-K3",
        "elementCategory": "kpi",
        "label": "Incoming",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-K4",
        "elementCategory": "kpi",
        "label": "Out of Stock",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product",
          "SKU",
          "Category",
          "Available",
          "Reserved",
          "Incoming",
          "Reorder Level"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-TBL2",
        "elementCategory": "table",
        "columns": [
          "Product",
          "SKU",
          "Category",
          "Total",
          "Available",
          "Reserved",
          "Peshawar",
          "Islamabad",
          "Incoming",
          "Reorder",
          "Value"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-B1",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-B2",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R44-B3",
        "elementCategory": "button",
        "actionName": "Request Stock",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/serialized-units",
    "routeName": "inventory-serialized-units",
    "component": "src/views/inventory/SerializedUnits.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.1",
    "chapterTitle": "Chassis VIN & Battery Barcode Ledger",
    "checkpointsCount": 19,
    "checkpoints": [
      {
        "checkpointId": "M5-R45-H1",
        "elementCategory": "header",
        "label": "Serialized Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-H2",
        "elementCategory": "header",
        "label": "Columns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-H3",
        "elementCategory": "header",
        "label": "Export",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-H4",
        "elementCategory": "header",
        "label": "Serialized Unit Register",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-T2",
        "elementCategory": "tab",
        "label": "Clear all filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-T3",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-T4",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-K1",
        "elementCategory": "kpi",
        "label": "Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-K2",
        "elementCategory": "kpi",
        "label": "Available",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-K3",
        "elementCategory": "kpi",
        "label": "Reserved",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-K4",
        "elementCategory": "kpi",
        "label": "QC / Service",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-TBL1",
        "elementCategory": "table",
        "columns": [
          "Serial / Chassis",
          "Product",
          "Location",
          "Status",
          "Order / Customer",
          "Source",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-TBL2",
        "elementCategory": "table",
        "columns": [
          "Serial",
          "Chassis",
          "Product",
          "Branch",
          "Location",
          "Source PO",
          "Landed Cost",
          "Status",
          "Customer",
          "Order"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-B1",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-B2",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R45-B3",
        "elementCategory": "button",
        "actionName": "Open &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/serialized-units/detail",
    "routeName": "inventory-unit-detail-legacy",
    "component": "src/views/inventory/UnitDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.1",
    "chapterTitle": "Chassis VIN & Battery Barcode Ledger",
    "checkpointsCount": 38,
    "checkpoints": [
      {
        "checkpointId": "M5-R46-H1",
        "elementCategory": "header",
        "label": "Serialized Unit Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-H2",
        "elementCategory": "header",
        "label": "Branch Context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-H3",
        "elementCategory": "header",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-H4",
        "elementCategory": "header",
        "label": "Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-H5",
        "elementCategory": "header",
        "label": "Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-T2",
        "elementCategory": "tab",
        "label": "Identification",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-T3",
        "elementCategory": "tab",
        "label": "Cost",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-T4",
        "elementCategory": "tab",
        "label": "Location",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-T5",
        "elementCategory": "tab",
        "label": "Purchase Source",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-T6",
        "elementCategory": "tab",
        "label": "Timeline",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K1",
        "elementCategory": "kpi",
        "label": "Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K2",
        "elementCategory": "kpi",
        "label": "Serial Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K3",
        "elementCategory": "kpi",
        "label": "Chassis Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K4",
        "elementCategory": "kpi",
        "label": "VIN",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K5",
        "elementCategory": "kpi",
        "label": "Current Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K6",
        "elementCategory": "kpi",
        "label": "Branch / Bay",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K7",
        "elementCategory": "kpi",
        "label": "Chassis No.",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K8",
        "elementCategory": "kpi",
        "label": "Motor Serial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K9",
        "elementCategory": "kpi",
        "label": "Battery Serial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K10",
        "elementCategory": "kpi",
        "label": "Color / Variant",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K11",
        "elementCategory": "kpi",
        "label": "Product Model",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K12",
        "elementCategory": "kpi",
        "label": "Assigned Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K13",
        "elementCategory": "kpi",
        "label": "Current Bay",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K14",
        "elementCategory": "kpi",
        "label": "Storage Sub-zone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K15",
        "elementCategory": "kpi",
        "label": "Status at Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K16",
        "elementCategory": "kpi",
        "label": "Last Inspected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K17",
        "elementCategory": "kpi",
        "label": "Assigned Handler",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K18",
        "elementCategory": "kpi",
        "label": "Latest Movement",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K19",
        "elementCategory": "kpi",
        "label": "Source Inwarding",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K20",
        "elementCategory": "kpi",
        "label": "Current Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K21",
        "elementCategory": "kpi",
        "label": "Physical Transfer State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K22",
        "elementCategory": "kpi",
        "label": "Sale Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K23",
        "elementCategory": "kpi",
        "label": "Reservation State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K24",
        "elementCategory": "kpi",
        "label": "Customer Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-K25",
        "elementCategory": "kpi",
        "label": "Linked Order",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-B1",
        "elementCategory": "button",
        "actionName": "&larr; Back to Serialized Units",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R46-B2",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/serialized-units/:id",
    "routeName": "inventory-unit-detail",
    "component": "src/views/inventory/UnitDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.1",
    "chapterTitle": "Chassis VIN & Battery Barcode Ledger",
    "checkpointsCount": 38,
    "checkpoints": [
      {
        "checkpointId": "M5-R47-H1",
        "elementCategory": "header",
        "label": "Serialized Unit Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-H2",
        "elementCategory": "header",
        "label": "Branch Context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-H3",
        "elementCategory": "header",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-H4",
        "elementCategory": "header",
        "label": "Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-H5",
        "elementCategory": "header",
        "label": "Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-T2",
        "elementCategory": "tab",
        "label": "Identification",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-T3",
        "elementCategory": "tab",
        "label": "Cost",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-T4",
        "elementCategory": "tab",
        "label": "Location",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-T5",
        "elementCategory": "tab",
        "label": "Purchase Source",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-T6",
        "elementCategory": "tab",
        "label": "Timeline",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K1",
        "elementCategory": "kpi",
        "label": "Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K2",
        "elementCategory": "kpi",
        "label": "Serial Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K3",
        "elementCategory": "kpi",
        "label": "Chassis Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K4",
        "elementCategory": "kpi",
        "label": "VIN",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K5",
        "elementCategory": "kpi",
        "label": "Current Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K6",
        "elementCategory": "kpi",
        "label": "Branch / Bay",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K7",
        "elementCategory": "kpi",
        "label": "Chassis No.",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K8",
        "elementCategory": "kpi",
        "label": "Motor Serial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K9",
        "elementCategory": "kpi",
        "label": "Battery Serial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K10",
        "elementCategory": "kpi",
        "label": "Color / Variant",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K11",
        "elementCategory": "kpi",
        "label": "Product Model",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K12",
        "elementCategory": "kpi",
        "label": "Assigned Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K13",
        "elementCategory": "kpi",
        "label": "Current Bay",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K14",
        "elementCategory": "kpi",
        "label": "Storage Sub-zone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K15",
        "elementCategory": "kpi",
        "label": "Status at Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K16",
        "elementCategory": "kpi",
        "label": "Last Inspected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K17",
        "elementCategory": "kpi",
        "label": "Assigned Handler",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K18",
        "elementCategory": "kpi",
        "label": "Latest Movement",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K19",
        "elementCategory": "kpi",
        "label": "Source Inwarding",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K20",
        "elementCategory": "kpi",
        "label": "Current Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K21",
        "elementCategory": "kpi",
        "label": "Physical Transfer State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K22",
        "elementCategory": "kpi",
        "label": "Sale Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K23",
        "elementCategory": "kpi",
        "label": "Reservation State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K24",
        "elementCategory": "kpi",
        "label": "Customer Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-K25",
        "elementCategory": "kpi",
        "label": "Linked Order",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-B1",
        "elementCategory": "button",
        "actionName": "&larr; Back to Serialized Units",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R47-B2",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/units/:id",
    "routeName": "inventory-unit-detail-alias",
    "component": "src/views/inventory/UnitDetail.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 38,
    "checkpoints": [
      {
        "checkpointId": "M8-R48-H1",
        "elementCategory": "header",
        "label": "Serialized Unit Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-H2",
        "elementCategory": "header",
        "label": "Branch Context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-H3",
        "elementCategory": "header",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-H4",
        "elementCategory": "header",
        "label": "Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-H5",
        "elementCategory": "header",
        "label": "Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-T2",
        "elementCategory": "tab",
        "label": "Identification",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-T3",
        "elementCategory": "tab",
        "label": "Cost",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-T4",
        "elementCategory": "tab",
        "label": "Location",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-T5",
        "elementCategory": "tab",
        "label": "Purchase Source",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-T6",
        "elementCategory": "tab",
        "label": "Timeline",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K1",
        "elementCategory": "kpi",
        "label": "Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K2",
        "elementCategory": "kpi",
        "label": "Serial Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K3",
        "elementCategory": "kpi",
        "label": "Chassis Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K4",
        "elementCategory": "kpi",
        "label": "VIN",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K5",
        "elementCategory": "kpi",
        "label": "Current Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K6",
        "elementCategory": "kpi",
        "label": "Branch / Bay",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K7",
        "elementCategory": "kpi",
        "label": "Chassis No.",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K8",
        "elementCategory": "kpi",
        "label": "Motor Serial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K9",
        "elementCategory": "kpi",
        "label": "Battery Serial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K10",
        "elementCategory": "kpi",
        "label": "Color / Variant",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K11",
        "elementCategory": "kpi",
        "label": "Product Model",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K12",
        "elementCategory": "kpi",
        "label": "Assigned Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K13",
        "elementCategory": "kpi",
        "label": "Current Bay",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K14",
        "elementCategory": "kpi",
        "label": "Storage Sub-zone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K15",
        "elementCategory": "kpi",
        "label": "Status at Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K16",
        "elementCategory": "kpi",
        "label": "Last Inspected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K17",
        "elementCategory": "kpi",
        "label": "Assigned Handler",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K18",
        "elementCategory": "kpi",
        "label": "Latest Movement",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K19",
        "elementCategory": "kpi",
        "label": "Source Inwarding",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K20",
        "elementCategory": "kpi",
        "label": "Current Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K21",
        "elementCategory": "kpi",
        "label": "Physical Transfer State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K22",
        "elementCategory": "kpi",
        "label": "Sale Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K23",
        "elementCategory": "kpi",
        "label": "Reservation State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K24",
        "elementCategory": "kpi",
        "label": "Customer Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-K25",
        "elementCategory": "kpi",
        "label": "Linked Order",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-B1",
        "elementCategory": "button",
        "actionName": "&larr; Back to Serialized Units",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R48-B2",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/transfers",
    "routeName": "inventory-transfers",
    "component": "src/views/inventory/Transfers.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.4",
    "chapterTitle": "Inter-Branch Stock Transfers",
    "checkpointsCount": 18,
    "checkpoints": [
      {
        "checkpointId": "M5-R49-H1",
        "elementCategory": "header",
        "label": "Transfers",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-H2",
        "elementCategory": "header",
        "label": "Create Transfer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-H3",
        "elementCategory": "header",
        "label": "Branch Transfers",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-H4",
        "elementCategory": "header",
        "label": "Transfer Contents",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-T1",
        "elementCategory": "tab",
        "label": "All",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-T2",
        "elementCategory": "tab",
        "label": "Requested",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-T3",
        "elementCategory": "tab",
        "label": "Approved",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-T4",
        "elementCategory": "tab",
        "label": "Picking",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-T5",
        "elementCategory": "tab",
        "label": "In Transit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-T6",
        "elementCategory": "tab",
        "label": "Received",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-K1",
        "elementCategory": "kpi",
        "label": "Incoming",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-K2",
        "elementCategory": "kpi",
        "label": "Outgoing",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-K3",
        "elementCategory": "kpi",
        "label": "In Transit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-K4",
        "elementCategory": "kpi",
        "label": "Received",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-TBL1",
        "elementCategory": "table",
        "columns": [
          "Transfer",
          "Direction",
          "From / To",
          "Units",
          "Dispatched",
          "Expected",
          "Status",
          "Actions",
          "Category",
          "Product Name",
          "Quantity"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-B1",
        "elementCategory": "button",
        "actionName": "Create Transfer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R49-B2",
        "elementCategory": "button",
        "actionName": "Open &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/transfers/create",
    "routeName": "inventory-create-transfer",
    "component": "src/views/inventory/CreateTransfer.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.4",
    "chapterTitle": "Inter-Branch Stock Transfers",
    "checkpointsCount": 14,
    "checkpoints": [
      {
        "checkpointId": "M5-R50-H1",
        "elementCategory": "header",
        "label": "Dealership Custody Rule:",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-H2",
        "elementCategory": "header",
        "label": "Transfer Route & Stock",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-H3",
        "elementCategory": "header",
        "label": "Dispatch & Carrier Logistics",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-F1",
        "elementCategory": "field",
        "fieldName": "form.fromBranch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-F2",
        "elementCategory": "field",
        "fieldName": "form.toBranch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-F3",
        "elementCategory": "field",
        "fieldName": "form.productId",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-F4",
        "elementCategory": "field",
        "fieldName": "form.units",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-F5",
        "elementCategory": "field",
        "fieldName": "form.requestedDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-F6",
        "elementCategory": "field",
        "fieldName": "form.carrier",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-F7",
        "elementCategory": "field",
        "fieldName": "form.driverContact",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-F8",
        "elementCategory": "field",
        "fieldName": "form.gatePassNo",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-F9",
        "elementCategory": "field",
        "fieldName": "form.expectedArrival",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-F10",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R50-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/transfers/receive",
    "routeName": "inventory-receive-transfer",
    "component": "src/views/inventory/ReceiveTransfer.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.4",
    "chapterTitle": "Inter-Branch Stock Transfers",
    "checkpointsCount": 13,
    "checkpoints": [
      {
        "checkpointId": "M5-R51-H1",
        "elementCategory": "header",
        "label": "Transfer Record Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R51-H2",
        "elementCategory": "header",
        "label": "Transfer Already Fully Received",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R51-H3",
        "elementCategory": "header",
        "label": "Origin Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R51-H4",
        "elementCategory": "header",
        "label": "Destination Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R51-H5",
        "elementCategory": "header",
        "label": "Carrier / Vehicle",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R51-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product",
          "Type",
          "Dispatched",
          "Prev. Received",
          "Remaining",
          "Received Now *",
          "Damaged Qty",
          "Shortage"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R51-F1",
        "elementCategory": "field",
        "fieldName": "receiverName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R51-F2",
        "elementCategory": "field",
        "fieldName": "receiverLocation",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R51-F3",
        "elementCategory": "field",
        "fieldName": "receiverNotes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R51-B1",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R51-B2",
        "elementCategory": "button",
        "actionName": "View All Transfers",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R51-B3",
        "elementCategory": "button",
        "actionName": "View Complete Transfer Details &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R51-B4",
        "elementCategory": "button",
        "actionName": "Confirm Arrival &amp; Post",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/transfers/receive/:id",
    "routeName": "inventory-receive-transfer-id",
    "component": "src/views/inventory/ReceiveTransfer.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.4",
    "chapterTitle": "Inter-Branch Stock Transfers",
    "checkpointsCount": 13,
    "checkpoints": [
      {
        "checkpointId": "M5-R52-H1",
        "elementCategory": "header",
        "label": "Transfer Record Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R52-H2",
        "elementCategory": "header",
        "label": "Transfer Already Fully Received",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R52-H3",
        "elementCategory": "header",
        "label": "Origin Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R52-H4",
        "elementCategory": "header",
        "label": "Destination Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R52-H5",
        "elementCategory": "header",
        "label": "Carrier / Vehicle",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R52-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product",
          "Type",
          "Dispatched",
          "Prev. Received",
          "Remaining",
          "Received Now *",
          "Damaged Qty",
          "Shortage"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R52-F1",
        "elementCategory": "field",
        "fieldName": "receiverName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R52-F2",
        "elementCategory": "field",
        "fieldName": "receiverLocation",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R52-F3",
        "elementCategory": "field",
        "fieldName": "receiverNotes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R52-B1",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R52-B2",
        "elementCategory": "button",
        "actionName": "View All Transfers",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R52-B3",
        "elementCategory": "button",
        "actionName": "View Complete Transfer Details &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R52-B4",
        "elementCategory": "button",
        "actionName": "Confirm Arrival &amp; Post",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/transfers/:id/receive",
    "routeName": "inventory-receive-transfer-param",
    "component": "src/views/inventory/ReceiveTransfer.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.4",
    "chapterTitle": "Inter-Branch Stock Transfers",
    "checkpointsCount": 13,
    "checkpoints": [
      {
        "checkpointId": "M5-R53-H1",
        "elementCategory": "header",
        "label": "Transfer Record Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R53-H2",
        "elementCategory": "header",
        "label": "Transfer Already Fully Received",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R53-H3",
        "elementCategory": "header",
        "label": "Origin Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R53-H4",
        "elementCategory": "header",
        "label": "Destination Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R53-H5",
        "elementCategory": "header",
        "label": "Carrier / Vehicle",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R53-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product",
          "Type",
          "Dispatched",
          "Prev. Received",
          "Remaining",
          "Received Now *",
          "Damaged Qty",
          "Shortage"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R53-F1",
        "elementCategory": "field",
        "fieldName": "receiverName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R53-F2",
        "elementCategory": "field",
        "fieldName": "receiverLocation",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R53-F3",
        "elementCategory": "field",
        "fieldName": "receiverNotes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R53-B1",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R53-B2",
        "elementCategory": "button",
        "actionName": "View All Transfers",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R53-B3",
        "elementCategory": "button",
        "actionName": "View Complete Transfer Details &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R53-B4",
        "elementCategory": "button",
        "actionName": "Confirm Arrival &amp; Post",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/transfers/detail",
    "routeName": "inventory-transfer-detail-legacy",
    "component": "src/views/inventory/TransferDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.4",
    "chapterTitle": "Inter-Branch Stock Transfers",
    "checkpointsCount": 33,
    "checkpoints": [
      {
        "checkpointId": "M5-R54-H1",
        "elementCategory": "header",
        "label": "Dispatch Transfer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-H2",
        "elementCategory": "header",
        "label": "Receive Consignment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-H3",
        "elementCategory": "header",
        "label": "Transfer Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-H4",
        "elementCategory": "header",
        "label": "&rarr;",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-H5",
        "elementCategory": "header",
        "label": "&middot;",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K1",
        "elementCategory": "kpi",
        "label": "Direction",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K2",
        "elementCategory": "kpi",
        "label": "From Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K3",
        "elementCategory": "kpi",
        "label": "To Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K4",
        "elementCategory": "kpi",
        "label": "Total Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K5",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K6",
        "elementCategory": "kpi",
        "label": "ETA / Arrival",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K7",
        "elementCategory": "kpi",
        "label": "Primary Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K8",
        "elementCategory": "kpi",
        "label": "Line Items Count",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K9",
        "elementCategory": "kpi",
        "label": "Dispatched Count",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K10",
        "elementCategory": "kpi",
        "label": "Received Count",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K11",
        "elementCategory": "kpi",
        "label": "Notes",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K12",
        "elementCategory": "kpi",
        "label": "Dispatched Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K13",
        "elementCategory": "kpi",
        "label": "Dispatched By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K14",
        "elementCategory": "kpi",
        "label": "Carrier / Logistics",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K15",
        "elementCategory": "kpi",
        "label": "Expected Arrival",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K16",
        "elementCategory": "kpi",
        "label": "Authorized Origin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K17",
        "elementCategory": "kpi",
        "label": "Origin Notes",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K18",
        "elementCategory": "kpi",
        "label": "Receiving Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K19",
        "elementCategory": "kpi",
        "label": "Received Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K20",
        "elementCategory": "kpi",
        "label": "Receiver Notes",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K21",
        "elementCategory": "kpi",
        "label": "Damaged Units Recorded",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K22",
        "elementCategory": "kpi",
        "label": "Shortage Detected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-K23",
        "elementCategory": "kpi",
        "label": "Receiving Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product",
          "SKU",
          "Dispatched",
          "Received",
          "Serial Numbers"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-B1",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-B2",
        "elementCategory": "button",
        "actionName": "Dispatch Transfer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-B3",
        "elementCategory": "button",
        "actionName": "Receive Consignment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R54-B4",
        "elementCategory": "button",
        "actionName": "Return to Transfers",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/transfers/:id",
    "routeName": "inventory-transfer-detail",
    "component": "src/views/inventory/TransferDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.4",
    "chapterTitle": "Inter-Branch Stock Transfers",
    "checkpointsCount": 33,
    "checkpoints": [
      {
        "checkpointId": "M5-R55-H1",
        "elementCategory": "header",
        "label": "Dispatch Transfer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-H2",
        "elementCategory": "header",
        "label": "Receive Consignment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-H3",
        "elementCategory": "header",
        "label": "Transfer Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-H4",
        "elementCategory": "header",
        "label": "&rarr;",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-H5",
        "elementCategory": "header",
        "label": "&middot;",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K1",
        "elementCategory": "kpi",
        "label": "Direction",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K2",
        "elementCategory": "kpi",
        "label": "From Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K3",
        "elementCategory": "kpi",
        "label": "To Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K4",
        "elementCategory": "kpi",
        "label": "Total Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K5",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K6",
        "elementCategory": "kpi",
        "label": "ETA / Arrival",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K7",
        "elementCategory": "kpi",
        "label": "Primary Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K8",
        "elementCategory": "kpi",
        "label": "Line Items Count",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K9",
        "elementCategory": "kpi",
        "label": "Dispatched Count",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K10",
        "elementCategory": "kpi",
        "label": "Received Count",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K11",
        "elementCategory": "kpi",
        "label": "Notes",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K12",
        "elementCategory": "kpi",
        "label": "Dispatched Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K13",
        "elementCategory": "kpi",
        "label": "Dispatched By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K14",
        "elementCategory": "kpi",
        "label": "Carrier / Logistics",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K15",
        "elementCategory": "kpi",
        "label": "Expected Arrival",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K16",
        "elementCategory": "kpi",
        "label": "Authorized Origin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K17",
        "elementCategory": "kpi",
        "label": "Origin Notes",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K18",
        "elementCategory": "kpi",
        "label": "Receiving Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K19",
        "elementCategory": "kpi",
        "label": "Received Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K20",
        "elementCategory": "kpi",
        "label": "Receiver Notes",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K21",
        "elementCategory": "kpi",
        "label": "Damaged Units Recorded",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K22",
        "elementCategory": "kpi",
        "label": "Shortage Detected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-K23",
        "elementCategory": "kpi",
        "label": "Receiving Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product",
          "SKU",
          "Dispatched",
          "Received",
          "Serial Numbers"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-B1",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-B2",
        "elementCategory": "button",
        "actionName": "Dispatch Transfer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-B3",
        "elementCategory": "button",
        "actionName": "Receive Consignment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R55-B4",
        "elementCategory": "button",
        "actionName": "Return to Transfers",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/inbound-deliveries",
    "routeName": "inventory-inbound-deliveries",
    "component": "src/views/inventory/InboundDeliveries.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.2",
    "chapterTitle": "Inbound Shipments & Receiving",
    "checkpointsCount": 20,
    "checkpoints": [
      {
        "checkpointId": "M5-R56-H1",
        "elementCategory": "header",
        "label": "Inbound Deliveries",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-H2",
        "elementCategory": "header",
        "label": "Receive Supplier Delivery",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-H3",
        "elementCategory": "header",
        "label": "Columns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-H4",
        "elementCategory": "header",
        "label": "Export",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-H5",
        "elementCategory": "header",
        "label": "Delivery Contents",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-T2",
        "elementCategory": "tab",
        "label": "All",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-T3",
        "elementCategory": "tab",
        "label": "Scheduled",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-T4",
        "elementCategory": "tab",
        "label": "In Transit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-T5",
        "elementCategory": "tab",
        "label": "Received",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-T6",
        "elementCategory": "tab",
        "label": "Discrepancy",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-K1",
        "elementCategory": "kpi",
        "label": "Expected Today",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-K2",
        "elementCategory": "kpi",
        "label": "In Transit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-K3",
        "elementCategory": "kpi",
        "label": "Awaiting Receive",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-K4",
        "elementCategory": "kpi",
        "label": "Discrepancies",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-TBL1",
        "elementCategory": "table",
        "columns": [
          "Inbound",
          "PO Reference",
          "Supplier",
          "Expected",
          "Products",
          "Status",
          "Category",
          "Product Name",
          "Quantity"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-B1",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-B2",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R56-B3",
        "elementCategory": "button",
        "actionName": "Open &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/inbound-deliveries/detail",
    "routeName": "inventory-inbound-delivery-detail-legacy",
    "component": "src/views/inventory/InboundDeliveryDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.2",
    "chapterTitle": "Inbound Shipments & Receiving",
    "checkpointsCount": 31,
    "checkpoints": [
      {
        "checkpointId": "M5-R57-H1",
        "elementCategory": "header",
        "label": "Receive Delivery",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-H2",
        "elementCategory": "header",
        "label": "Branch context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-H3",
        "elementCategory": "header",
        "label": "PO Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-H4",
        "elementCategory": "header",
        "label": "Expected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-H5",
        "elementCategory": "header",
        "label": "Discrepancies",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K1",
        "elementCategory": "kpi",
        "label": "Inbound",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K2",
        "elementCategory": "kpi",
        "label": "PO Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K3",
        "elementCategory": "kpi",
        "label": "Supplier",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K4",
        "elementCategory": "kpi",
        "label": "Expected Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K5",
        "elementCategory": "kpi",
        "label": "Destination",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K6",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K7",
        "elementCategory": "kpi",
        "label": "Expected Products",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K8",
        "elementCategory": "kpi",
        "label": "Total Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K9",
        "elementCategory": "kpi",
        "label": "Serialized Tracking",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K10",
        "elementCategory": "kpi",
        "label": "Source Batch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K11",
        "elementCategory": "kpi",
        "label": "Packaging",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K12",
        "elementCategory": "kpi",
        "label": "Unit Cost Scope",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K13",
        "elementCategory": "kpi",
        "label": "Inspection Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K14",
        "elementCategory": "kpi",
        "label": "Required Checks",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K15",
        "elementCategory": "kpi",
        "label": "Photos Required",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K16",
        "elementCategory": "kpi",
        "label": "Assigned Inspector",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K17",
        "elementCategory": "kpi",
        "label": "QC Standard",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K18",
        "elementCategory": "kpi",
        "label": "Condition",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K19",
        "elementCategory": "kpi",
        "label": "Receiving Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K20",
        "elementCategory": "kpi",
        "label": "Expected Arrival",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K21",
        "elementCategory": "kpi",
        "label": "Receiving Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K22",
        "elementCategory": "kpi",
        "label": "Assigned Receiver",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K23",
        "elementCategory": "kpi",
        "label": "Logistics Fleet",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K24",
        "elementCategory": "kpi",
        "label": "Challan / Waybill",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-K25",
        "elementCategory": "kpi",
        "label": "Discrepancies Recorded",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R57-B1",
        "elementCategory": "button",
        "actionName": "Receive Delivery",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/inbound-deliveries/:id",
    "routeName": "inventory-inbound-delivery-detail",
    "component": "src/views/inventory/InboundDeliveryDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.2",
    "chapterTitle": "Inbound Shipments & Receiving",
    "checkpointsCount": 31,
    "checkpoints": [
      {
        "checkpointId": "M5-R58-H1",
        "elementCategory": "header",
        "label": "Receive Delivery",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-H2",
        "elementCategory": "header",
        "label": "Branch context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-H3",
        "elementCategory": "header",
        "label": "PO Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-H4",
        "elementCategory": "header",
        "label": "Expected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-H5",
        "elementCategory": "header",
        "label": "Discrepancies",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K1",
        "elementCategory": "kpi",
        "label": "Inbound",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K2",
        "elementCategory": "kpi",
        "label": "PO Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K3",
        "elementCategory": "kpi",
        "label": "Supplier",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K4",
        "elementCategory": "kpi",
        "label": "Expected Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K5",
        "elementCategory": "kpi",
        "label": "Destination",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K6",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K7",
        "elementCategory": "kpi",
        "label": "Expected Products",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K8",
        "elementCategory": "kpi",
        "label": "Total Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K9",
        "elementCategory": "kpi",
        "label": "Serialized Tracking",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K10",
        "elementCategory": "kpi",
        "label": "Source Batch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K11",
        "elementCategory": "kpi",
        "label": "Packaging",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K12",
        "elementCategory": "kpi",
        "label": "Unit Cost Scope",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K13",
        "elementCategory": "kpi",
        "label": "Inspection Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K14",
        "elementCategory": "kpi",
        "label": "Required Checks",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K15",
        "elementCategory": "kpi",
        "label": "Photos Required",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K16",
        "elementCategory": "kpi",
        "label": "Assigned Inspector",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K17",
        "elementCategory": "kpi",
        "label": "QC Standard",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K18",
        "elementCategory": "kpi",
        "label": "Condition",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K19",
        "elementCategory": "kpi",
        "label": "Receiving Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K20",
        "elementCategory": "kpi",
        "label": "Expected Arrival",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K21",
        "elementCategory": "kpi",
        "label": "Receiving Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K22",
        "elementCategory": "kpi",
        "label": "Assigned Receiver",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K23",
        "elementCategory": "kpi",
        "label": "Logistics Fleet",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K24",
        "elementCategory": "kpi",
        "label": "Challan / Waybill",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-K25",
        "elementCategory": "kpi",
        "label": "Discrepancies Recorded",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R58-B1",
        "elementCategory": "button",
        "actionName": "Receive Delivery",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/inbound-deliveries/receive",
    "routeName": "inventory-receive-supplier-delivery",
    "component": "src/views/inventory/ReceiveSupplierDelivery.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.2",
    "chapterTitle": "Inbound Shipments & Receiving",
    "checkpointsCount": 12,
    "checkpoints": [
      {
        "checkpointId": "M5-R59-H1",
        "elementCategory": "header",
        "label": "Receive Supplier Delivery",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R59-H2",
        "elementCategory": "header",
        "label": "Approved Inbound",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R59-H3",
        "elementCategory": "header",
        "label": "Inspection",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R59-F1",
        "elementCategory": "field",
        "fieldName": "form.inbound",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R59-F2",
        "elementCategory": "field",
        "fieldName": "form.poReference",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R59-F3",
        "elementCategory": "field",
        "fieldName": "form.expectedProducts",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R59-F4",
        "elementCategory": "field",
        "fieldName": "form.receivingLocation",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R59-F5",
        "elementCategory": "field",
        "fieldName": "form.serializedUnits",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R59-F6",
        "elementCategory": "field",
        "fieldName": "form.condition",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R59-F7",
        "elementCategory": "field",
        "fieldName": "form.photos",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R59-F8",
        "elementCategory": "field",
        "fieldName": "form.discrepancy",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R59-B1",
        "elementCategory": "button",
        "actionName": "Post Receipt",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/stock-requests",
    "routeName": "inventory-stock-requests",
    "component": "src/views/inventory/StockRequests.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.3",
    "chapterTitle": "Warehouse Replenishment Requests",
    "checkpointsCount": 18,
    "checkpoints": [
      {
        "checkpointId": "M5-R60-H1",
        "elementCategory": "header",
        "label": "Stock Requests",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-H2",
        "elementCategory": "header",
        "label": "New Stock Request",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-T3",
        "elementCategory": "tab",
        "label": "All",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-T4",
        "elementCategory": "tab",
        "label": "Pending",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-T5",
        "elementCategory": "tab",
        "label": "Approved",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-T6",
        "elementCategory": "tab",
        "label": "Partial",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-T7",
        "elementCategory": "tab",
        "label": "Rejected",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-K1",
        "elementCategory": "kpi",
        "label": "Open",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-K2",
        "elementCategory": "kpi",
        "label": "Approved",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-K3",
        "elementCategory": "kpi",
        "label": "Partial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-K4",
        "elementCategory": "kpi",
        "label": "Fulfilled",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-TBL1",
        "elementCategory": "table",
        "columns": [
          "Request",
          "Product",
          "Qty",
          "Expected",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-TBL2",
        "elementCategory": "table",
        "columns": [
          "Request",
          "Branch",
          "Products",
          "Units",
          "Need By",
          "Priority",
          "Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R60-B1",
        "elementCategory": "button",
        "actionName": "New Stock Request",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/stock-requests/create",
    "routeName": "inventory-create-stock-request",
    "component": "src/views/inventory/CreateStockRequest.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.3",
    "chapterTitle": "Warehouse Replenishment Requests",
    "checkpointsCount": 11,
    "checkpoints": [
      {
        "checkpointId": "M5-R61-H1",
        "elementCategory": "header",
        "label": "Dealership Replenishment Workflow:",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R61-H2",
        "elementCategory": "header",
        "label": "Demand & Justification",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R61-F1",
        "elementCategory": "field",
        "fieldName": "form.productId",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R61-F2",
        "elementCategory": "field",
        "fieldName": "form.currentStock",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R61-F3",
        "elementCategory": "field",
        "fieldName": "form.requestedQty",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R61-F4",
        "elementCategory": "field",
        "fieldName": "form.urgency",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R61-F5",
        "elementCategory": "field",
        "fieldName": "form.expectedDemand",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R61-F6",
        "elementCategory": "field",
        "fieldName": "form.orderLink",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R61-F7",
        "elementCategory": "field",
        "fieldName": "form.reason",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R61-F8",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R61-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/stock-requests/detail",
    "routeName": "inventory-stock-request-detail-legacy",
    "component": "src/views/inventory/StockRequestDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.3",
    "chapterTitle": "Warehouse Replenishment Requests",
    "checkpointsCount": 23,
    "checkpoints": [
      {
        "checkpointId": "M5-R62-K1",
        "elementCategory": "kpi",
        "label": "Request ID",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K2",
        "elementCategory": "kpi",
        "label": "Requesting Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K3",
        "elementCategory": "kpi",
        "label": "Requested By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K4",
        "elementCategory": "kpi",
        "label": "Primary Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K5",
        "elementCategory": "kpi",
        "label": "Total Units Requested",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K6",
        "elementCategory": "kpi",
        "label": "Reason for Request",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K7",
        "elementCategory": "kpi",
        "label": "Target Need Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K8",
        "elementCategory": "kpi",
        "label": "Priority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K9",
        "elementCategory": "kpi",
        "label": "Current Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K10",
        "elementCategory": "kpi",
        "label": "Approved By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K11",
        "elementCategory": "kpi",
        "label": "Approval Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K12",
        "elementCategory": "kpi",
        "label": "Rejection Reason",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K13",
        "elementCategory": "kpi",
        "label": "Approved Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K14",
        "elementCategory": "kpi",
        "label": "Fulfilment Route",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K15",
        "elementCategory": "kpi",
        "label": "Fulfillment Type",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K16",
        "elementCategory": "kpi",
        "label": "Linked Transfer ID",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K17",
        "elementCategory": "kpi",
        "label": "Courier / Fleet",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K18",
        "elementCategory": "kpi",
        "label": "Receiving Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K19",
        "elementCategory": "kpi",
        "label": "Destination Bay",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-K20",
        "elementCategory": "kpi",
        "label": "SLA Target",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-B1",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-B2",
        "elementCategory": "button",
        "actionName": "Reject",
        "trainingType": "decision",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R62-B3",
        "elementCategory": "button",
        "actionName": "Approve Request",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/stock-requests/:id",
    "routeName": "inventory-stock-request-detail",
    "component": "src/views/inventory/StockRequestDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.3",
    "chapterTitle": "Warehouse Replenishment Requests",
    "checkpointsCount": 23,
    "checkpoints": [
      {
        "checkpointId": "M5-R63-K1",
        "elementCategory": "kpi",
        "label": "Request ID",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K2",
        "elementCategory": "kpi",
        "label": "Requesting Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K3",
        "elementCategory": "kpi",
        "label": "Requested By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K4",
        "elementCategory": "kpi",
        "label": "Primary Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K5",
        "elementCategory": "kpi",
        "label": "Total Units Requested",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K6",
        "elementCategory": "kpi",
        "label": "Reason for Request",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K7",
        "elementCategory": "kpi",
        "label": "Target Need Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K8",
        "elementCategory": "kpi",
        "label": "Priority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K9",
        "elementCategory": "kpi",
        "label": "Current Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K10",
        "elementCategory": "kpi",
        "label": "Approved By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K11",
        "elementCategory": "kpi",
        "label": "Approval Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K12",
        "elementCategory": "kpi",
        "label": "Rejection Reason",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K13",
        "elementCategory": "kpi",
        "label": "Approved Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K14",
        "elementCategory": "kpi",
        "label": "Fulfilment Route",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K15",
        "elementCategory": "kpi",
        "label": "Fulfillment Type",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K16",
        "elementCategory": "kpi",
        "label": "Linked Transfer ID",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K17",
        "elementCategory": "kpi",
        "label": "Courier / Fleet",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K18",
        "elementCategory": "kpi",
        "label": "Receiving Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K19",
        "elementCategory": "kpi",
        "label": "Destination Bay",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-K20",
        "elementCategory": "kpi",
        "label": "SLA Target",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-B1",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-B2",
        "elementCategory": "button",
        "actionName": "Reject",
        "trainingType": "decision",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R63-B3",
        "elementCategory": "button",
        "actionName": "Approve Request",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/stock-adjustments",
    "routeName": "inventory-stock-adjustments",
    "component": "src/views/inventory/StockAdjustments.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.7",
    "chapterTitle": "Stock Adjustments & Variance Claims",
    "checkpointsCount": 15,
    "checkpoints": [
      {
        "checkpointId": "M5-R64-H1",
        "elementCategory": "header",
        "label": "Stock Adjustments",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-H2",
        "elementCategory": "header",
        "label": "Adjustment Request",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-H3",
        "elementCategory": "header",
        "label": "Adjustments",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-H4",
        "elementCategory": "header",
        "label": "New Adjustment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-K1",
        "elementCategory": "kpi",
        "label": "Pending",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-K2",
        "elementCategory": "kpi",
        "label": "Approved",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-K3",
        "elementCategory": "kpi",
        "label": "Posted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-K4",
        "elementCategory": "kpi",
        "label": "Rejected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-TBL1",
        "elementCategory": "table",
        "columns": [
          "Adjustment",
          "Product / Unit",
          "Before",
          "After",
          "Reason",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-TBL2",
        "elementCategory": "table",
        "columns": [
          "Adjustment",
          "Branch",
          "Unit/Product",
          "Type",
          "Qty Effect",
          "Reason",
          "Status",
          "Requested By",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-B1",
        "elementCategory": "button",
        "actionName": "Adjustment Request",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R64-B2",
        "elementCategory": "button",
        "actionName": "New Adjustment",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/stock-adjustments/create",
    "routeName": "inventory-create-adjustment-request",
    "component": "src/views/inventory/CreateAdjustmentRequest.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.7",
    "chapterTitle": "Stock Adjustments & Variance Claims",
    "checkpointsCount": 11,
    "checkpoints": [
      {
        "checkpointId": "M5-R65-H1",
        "elementCategory": "header",
        "label": "Adjustment Details",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R65-H2",
        "elementCategory": "header",
        "label": "Evidence & Verification",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R65-F1",
        "elementCategory": "field",
        "fieldName": "form.productUnit",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R65-F2",
        "elementCategory": "field",
        "fieldName": "form.existingState",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R65-F3",
        "elementCategory": "field",
        "fieldName": "form.correctedState",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R65-F4",
        "elementCategory": "field",
        "fieldName": "form.reason",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R65-F5",
        "elementCategory": "field",
        "fieldName": "form.evidence",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R65-F6",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R65-F7",
        "elementCategory": "field",
        "fieldName": "form.requestedBy",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R65-F8",
        "elementCategory": "field",
        "fieldName": "form.approval",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R65-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/stock-adjustments/detail",
    "routeName": "inventory-adjustment-detail-legacy",
    "component": "src/views/inventory/AdjustmentDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.7",
    "chapterTitle": "Stock Adjustments & Variance Claims",
    "checkpointsCount": 41,
    "checkpoints": [
      {
        "checkpointId": "M5-R66-H1",
        "elementCategory": "header",
        "label": "Stock Adjustment Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-H2",
        "elementCategory": "header",
        "label": "Branch context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-H3",
        "elementCategory": "header",
        "label": "Approval",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-H4",
        "elementCategory": "header",
        "label": "Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-H5",
        "elementCategory": "header",
        "label": "Posted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-T1",
        "elementCategory": "tab",
        "label": "Adjustment",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-T2",
        "elementCategory": "tab",
        "label": "Reason",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-T3",
        "elementCategory": "tab",
        "label": "Before & After",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-T4",
        "elementCategory": "tab",
        "label": "Approval",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-T5",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-T6",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K1",
        "elementCategory": "kpi",
        "label": "Product / Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K2",
        "elementCategory": "kpi",
        "label": "Before State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K3",
        "elementCategory": "kpi",
        "label": "After State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K4",
        "elementCategory": "kpi",
        "label": "Reason",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K5",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K6",
        "elementCategory": "kpi",
        "label": "Evidence",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K7",
        "elementCategory": "kpi",
        "label": "Net Difference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K8",
        "elementCategory": "kpi",
        "label": "Financial Impact",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K9",
        "elementCategory": "kpi",
        "label": "Affected Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K10",
        "elementCategory": "kpi",
        "label": "Attached Evidence",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K11",
        "elementCategory": "kpi",
        "label": "Uploaded By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K12",
        "elementCategory": "kpi",
        "label": "Upload Timestamp",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K13",
        "elementCategory": "kpi",
        "label": "Verification Note",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K14",
        "elementCategory": "kpi",
        "label": "Audit Standard",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K15",
        "elementCategory": "kpi",
        "label": "Total Files",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K16",
        "elementCategory": "kpi",
        "label": "Approval Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K17",
        "elementCategory": "kpi",
        "label": "Approved By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K18",
        "elementCategory": "kpi",
        "label": "Target SLA",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K19",
        "elementCategory": "kpi",
        "label": "Conditions",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K20",
        "elementCategory": "kpi",
        "label": "Posting Authority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K21",
        "elementCategory": "kpi",
        "label": "Audit Ledger",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K22",
        "elementCategory": "kpi",
        "label": "Requested",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K23",
        "elementCategory": "kpi",
        "label": "Current Stage",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K24",
        "elementCategory": "kpi",
        "label": "Adjustment Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-K25",
        "elementCategory": "kpi",
        "label": "Branch Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-B1",
        "elementCategory": "button",
        "actionName": "&larr; Back to Stock Adjustments",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-B2",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-B3",
        "elementCategory": "button",
        "actionName": "Reject / Recount",
        "trainingType": "decision",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-B4",
        "elementCategory": "button",
        "actionName": "Approve Adjustment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R66-B5",
        "elementCategory": "button",
        "actionName": "Reject",
        "trainingType": "decision",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/stock-adjustments/:id",
    "routeName": "inventory-adjustment-detail",
    "component": "src/views/inventory/AdjustmentDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.7",
    "chapterTitle": "Stock Adjustments & Variance Claims",
    "checkpointsCount": 41,
    "checkpoints": [
      {
        "checkpointId": "M5-R67-H1",
        "elementCategory": "header",
        "label": "Stock Adjustment Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-H2",
        "elementCategory": "header",
        "label": "Branch context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-H3",
        "elementCategory": "header",
        "label": "Approval",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-H4",
        "elementCategory": "header",
        "label": "Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-H5",
        "elementCategory": "header",
        "label": "Posted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-T1",
        "elementCategory": "tab",
        "label": "Adjustment",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-T2",
        "elementCategory": "tab",
        "label": "Reason",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-T3",
        "elementCategory": "tab",
        "label": "Before & After",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-T4",
        "elementCategory": "tab",
        "label": "Approval",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-T5",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-T6",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K1",
        "elementCategory": "kpi",
        "label": "Product / Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K2",
        "elementCategory": "kpi",
        "label": "Before State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K3",
        "elementCategory": "kpi",
        "label": "After State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K4",
        "elementCategory": "kpi",
        "label": "Reason",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K5",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K6",
        "elementCategory": "kpi",
        "label": "Evidence",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K7",
        "elementCategory": "kpi",
        "label": "Net Difference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K8",
        "elementCategory": "kpi",
        "label": "Financial Impact",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K9",
        "elementCategory": "kpi",
        "label": "Affected Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K10",
        "elementCategory": "kpi",
        "label": "Attached Evidence",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K11",
        "elementCategory": "kpi",
        "label": "Uploaded By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K12",
        "elementCategory": "kpi",
        "label": "Upload Timestamp",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K13",
        "elementCategory": "kpi",
        "label": "Verification Note",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K14",
        "elementCategory": "kpi",
        "label": "Audit Standard",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K15",
        "elementCategory": "kpi",
        "label": "Total Files",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K16",
        "elementCategory": "kpi",
        "label": "Approval Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K17",
        "elementCategory": "kpi",
        "label": "Approved By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K18",
        "elementCategory": "kpi",
        "label": "Target SLA",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K19",
        "elementCategory": "kpi",
        "label": "Conditions",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K20",
        "elementCategory": "kpi",
        "label": "Posting Authority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K21",
        "elementCategory": "kpi",
        "label": "Audit Ledger",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K22",
        "elementCategory": "kpi",
        "label": "Requested",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K23",
        "elementCategory": "kpi",
        "label": "Current Stage",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K24",
        "elementCategory": "kpi",
        "label": "Adjustment Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-K25",
        "elementCategory": "kpi",
        "label": "Branch Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-B1",
        "elementCategory": "button",
        "actionName": "&larr; Back to Stock Adjustments",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-B2",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-B3",
        "elementCategory": "button",
        "actionName": "Reject / Recount",
        "trainingType": "decision",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-B4",
        "elementCategory": "button",
        "actionName": "Approve Adjustment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R67-B5",
        "elementCategory": "button",
        "actionName": "Reject",
        "trainingType": "decision",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/adjustments/:id",
    "routeName": "inventory-adjustment-detail-alias",
    "component": "src/views/inventory/AdjustmentDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.7",
    "chapterTitle": "Stock Adjustments & Variance Claims",
    "checkpointsCount": 41,
    "checkpoints": [
      {
        "checkpointId": "M5-R68-H1",
        "elementCategory": "header",
        "label": "Stock Adjustment Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-H2",
        "elementCategory": "header",
        "label": "Branch context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-H3",
        "elementCategory": "header",
        "label": "Approval",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-H4",
        "elementCategory": "header",
        "label": "Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-H5",
        "elementCategory": "header",
        "label": "Posted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-T1",
        "elementCategory": "tab",
        "label": "Adjustment",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-T2",
        "elementCategory": "tab",
        "label": "Reason",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-T3",
        "elementCategory": "tab",
        "label": "Before & After",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-T4",
        "elementCategory": "tab",
        "label": "Approval",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-T5",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-T6",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K1",
        "elementCategory": "kpi",
        "label": "Product / Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K2",
        "elementCategory": "kpi",
        "label": "Before State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K3",
        "elementCategory": "kpi",
        "label": "After State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K4",
        "elementCategory": "kpi",
        "label": "Reason",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K5",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K6",
        "elementCategory": "kpi",
        "label": "Evidence",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K7",
        "elementCategory": "kpi",
        "label": "Net Difference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K8",
        "elementCategory": "kpi",
        "label": "Financial Impact",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K9",
        "elementCategory": "kpi",
        "label": "Affected Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K10",
        "elementCategory": "kpi",
        "label": "Attached Evidence",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K11",
        "elementCategory": "kpi",
        "label": "Uploaded By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K12",
        "elementCategory": "kpi",
        "label": "Upload Timestamp",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K13",
        "elementCategory": "kpi",
        "label": "Verification Note",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K14",
        "elementCategory": "kpi",
        "label": "Audit Standard",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K15",
        "elementCategory": "kpi",
        "label": "Total Files",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K16",
        "elementCategory": "kpi",
        "label": "Approval Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K17",
        "elementCategory": "kpi",
        "label": "Approved By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K18",
        "elementCategory": "kpi",
        "label": "Target SLA",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K19",
        "elementCategory": "kpi",
        "label": "Conditions",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K20",
        "elementCategory": "kpi",
        "label": "Posting Authority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K21",
        "elementCategory": "kpi",
        "label": "Audit Ledger",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K22",
        "elementCategory": "kpi",
        "label": "Requested",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K23",
        "elementCategory": "kpi",
        "label": "Current Stage",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K24",
        "elementCategory": "kpi",
        "label": "Adjustment Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-K25",
        "elementCategory": "kpi",
        "label": "Branch Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-B1",
        "elementCategory": "button",
        "actionName": "&larr; Back to Stock Adjustments",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-B2",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-B3",
        "elementCategory": "button",
        "actionName": "Reject / Recount",
        "trainingType": "decision",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-B4",
        "elementCategory": "button",
        "actionName": "Approve Adjustment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R68-B5",
        "elementCategory": "button",
        "actionName": "Reject",
        "trainingType": "decision",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/cycle-counts",
    "routeName": "inventory-cycle-counts",
    "component": "src/views/inventory/CycleCounts.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.5",
    "chapterTitle": "Blind Cycle Counts & Stock Audits",
    "checkpointsCount": 14,
    "checkpoints": [
      {
        "checkpointId": "M5-R69-H1",
        "elementCategory": "header",
        "label": "Cycle Counts",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-H2",
        "elementCategory": "header",
        "label": "Start Count",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-H3",
        "elementCategory": "header",
        "label": "Create Cycle Count",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-K1",
        "elementCategory": "kpi",
        "label": "Open",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-K2",
        "elementCategory": "kpi",
        "label": "Due Today",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-K3",
        "elementCategory": "kpi",
        "label": "Discrepancies",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-K4",
        "elementCategory": "kpi",
        "label": "Completed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-TBL1",
        "elementCategory": "table",
        "columns": [
          "Count",
          "Scope",
          "Due",
          "Expected",
          "Counted",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-TBL2",
        "elementCategory": "table",
        "columns": [
          "Count",
          "Branch",
          "Scope",
          "Expected Units",
          "Counted",
          "Variance",
          "Status",
          "Owner",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-B1",
        "elementCategory": "button",
        "actionName": "Start Count",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R69-B2",
        "elementCategory": "button",
        "actionName": "Create Cycle Count",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/cycle-counts/create",
    "routeName": "inventory-create-cycle-count",
    "component": "src/views/inventory/CreateCycleCount.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.5",
    "chapterTitle": "Blind Cycle Counts & Stock Audits",
    "checkpointsCount": 10,
    "checkpoints": [
      {
        "checkpointId": "M5-R70-H1",
        "elementCategory": "header",
        "label": "Count Scope",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R70-H2",
        "elementCategory": "header",
        "label": "Count Target & Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R70-F1",
        "elementCategory": "field",
        "fieldName": "form.countName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R70-F2",
        "elementCategory": "field",
        "fieldName": "form.scope",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R70-F3",
        "elementCategory": "field",
        "fieldName": "form.assignedTo",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R70-F4",
        "elementCategory": "field",
        "fieldName": "form.scheduledDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R70-F5",
        "elementCategory": "field",
        "fieldName": "form.expectedUnits",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R70-F6",
        "elementCategory": "field",
        "fieldName": "form.targetLocation",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R70-F7",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R70-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/cycle-counts/detail",
    "routeName": "inventory-cycle-count-detail-legacy",
    "component": "src/views/inventory/CycleCountDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.5",
    "chapterTitle": "Blind Cycle Counts & Stock Audits",
    "checkpointsCount": 38,
    "checkpoints": [
      {
        "checkpointId": "M5-R71-H1",
        "elementCategory": "header",
        "label": "Branch context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-H2",
        "elementCategory": "header",
        "label": "Assignee",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-H3",
        "elementCategory": "header",
        "label": "Branch Team",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-H4",
        "elementCategory": "header",
        "label": "Due",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-H5",
        "elementCategory": "header",
        "label": "Notes",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-T1",
        "elementCategory": "tab",
        "label": "Count Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-T2",
        "elementCategory": "tab",
        "label": "Expected Stock",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-T3",
        "elementCategory": "tab",
        "label": "Physical Count",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-T4",
        "elementCategory": "tab",
        "label": "Discrepancies",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-T5",
        "elementCategory": "tab",
        "label": "Adjustment Proposal",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-T6",
        "elementCategory": "tab",
        "label": "Approval",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-T7",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K1",
        "elementCategory": "kpi",
        "label": "Scope",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K2",
        "elementCategory": "kpi",
        "label": "Expected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K3",
        "elementCategory": "kpi",
        "label": "Counted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K4",
        "elementCategory": "kpi",
        "label": "Matched",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K5",
        "elementCategory": "kpi",
        "label": "Discrepancies",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K6",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K7",
        "elementCategory": "kpi",
        "label": "Target Category",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K8",
        "elementCategory": "kpi",
        "label": "Registered Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K9",
        "elementCategory": "kpi",
        "label": "Chassis Assigned",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K10",
        "elementCategory": "kpi",
        "label": "Snapshot Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K11",
        "elementCategory": "kpi",
        "label": "System Lock",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K12",
        "elementCategory": "kpi",
        "label": "Location Filter",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K13",
        "elementCategory": "kpi",
        "label": "Count Session",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K14",
        "elementCategory": "kpi",
        "label": "Count Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K15",
        "elementCategory": "kpi",
        "label": "Units Scanned",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K16",
        "elementCategory": "kpi",
        "label": "Time Started",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K17",
        "elementCategory": "kpi",
        "label": "Count Operator",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K18",
        "elementCategory": "kpi",
        "label": "Verification Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K19",
        "elementCategory": "kpi",
        "label": "Chassis Verified",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K20",
        "elementCategory": "kpi",
        "label": "Tags Scanned",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K21",
        "elementCategory": "kpi",
        "label": "Battery Serials",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K22",
        "elementCategory": "kpi",
        "label": "Unregistered Tags",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K23",
        "elementCategory": "kpi",
        "label": "Relocated Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K24",
        "elementCategory": "kpi",
        "label": "Scan Integrity",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-K25",
        "elementCategory": "kpi",
        "label": "Total Discrepancies",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R71-B1",
        "elementCategory": "button",
        "actionName": "Review Count",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/cycle-counts/:id",
    "routeName": "inventory-cycle-count-detail",
    "component": "src/views/inventory/CycleCountDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.5",
    "chapterTitle": "Blind Cycle Counts & Stock Audits",
    "checkpointsCount": 38,
    "checkpoints": [
      {
        "checkpointId": "M5-R72-H1",
        "elementCategory": "header",
        "label": "Branch context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-H2",
        "elementCategory": "header",
        "label": "Assignee",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-H3",
        "elementCategory": "header",
        "label": "Branch Team",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-H4",
        "elementCategory": "header",
        "label": "Due",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-H5",
        "elementCategory": "header",
        "label": "Notes",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-T1",
        "elementCategory": "tab",
        "label": "Count Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-T2",
        "elementCategory": "tab",
        "label": "Expected Stock",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-T3",
        "elementCategory": "tab",
        "label": "Physical Count",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-T4",
        "elementCategory": "tab",
        "label": "Discrepancies",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-T5",
        "elementCategory": "tab",
        "label": "Adjustment Proposal",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-T6",
        "elementCategory": "tab",
        "label": "Approval",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-T7",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K1",
        "elementCategory": "kpi",
        "label": "Scope",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K2",
        "elementCategory": "kpi",
        "label": "Expected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K3",
        "elementCategory": "kpi",
        "label": "Counted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K4",
        "elementCategory": "kpi",
        "label": "Matched",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K5",
        "elementCategory": "kpi",
        "label": "Discrepancies",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K6",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K7",
        "elementCategory": "kpi",
        "label": "Target Category",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K8",
        "elementCategory": "kpi",
        "label": "Registered Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K9",
        "elementCategory": "kpi",
        "label": "Chassis Assigned",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K10",
        "elementCategory": "kpi",
        "label": "Snapshot Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K11",
        "elementCategory": "kpi",
        "label": "System Lock",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K12",
        "elementCategory": "kpi",
        "label": "Location Filter",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K13",
        "elementCategory": "kpi",
        "label": "Count Session",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K14",
        "elementCategory": "kpi",
        "label": "Count Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K15",
        "elementCategory": "kpi",
        "label": "Units Scanned",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K16",
        "elementCategory": "kpi",
        "label": "Time Started",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K17",
        "elementCategory": "kpi",
        "label": "Count Operator",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K18",
        "elementCategory": "kpi",
        "label": "Verification Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K19",
        "elementCategory": "kpi",
        "label": "Chassis Verified",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K20",
        "elementCategory": "kpi",
        "label": "Tags Scanned",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K21",
        "elementCategory": "kpi",
        "label": "Battery Serials",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K22",
        "elementCategory": "kpi",
        "label": "Unregistered Tags",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K23",
        "elementCategory": "kpi",
        "label": "Relocated Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K24",
        "elementCategory": "kpi",
        "label": "Scan Integrity",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-K25",
        "elementCategory": "kpi",
        "label": "Total Discrepancies",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R72-B1",
        "elementCategory": "button",
        "actionName": "Review Count",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/stock-movement-ledger",
    "routeName": "inventory-stock-movement-ledger",
    "component": "src/views/inventory/StockMovementLedger.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.1",
    "chapterTitle": "Product Stock & Movement Ledger",
    "checkpointsCount": 16,
    "checkpoints": [
      {
        "checkpointId": "M5-R73-H1",
        "elementCategory": "header",
        "label": "Stock Movement Ledger",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-H2",
        "elementCategory": "header",
        "label": "Columns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-H3",
        "elementCategory": "header",
        "label": "Export",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-H4",
        "elementCategory": "header",
        "label": "Movement Ledger",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-T2",
        "elementCategory": "tab",
        "label": "Clear all filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-K1",
        "elementCategory": "kpi",
        "label": "Today",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-K2",
        "elementCategory": "kpi",
        "label": "Receipts",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-K3",
        "elementCategory": "kpi",
        "label": "Sales",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-K4",
        "elementCategory": "kpi",
        "label": "Transfers",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-TBL1",
        "elementCategory": "table",
        "columns": [
          "Time",
          "Unit / Product",
          "Movement",
          "From",
          "To",
          "Reference",
          "User"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-TBL2",
        "elementCategory": "table",
        "columns": [
          "Time",
          "Unit / Product",
          "Movement",
          "From",
          "To",
          "Reference",
          "User"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-B1",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R73-B2",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/quarantine",
    "routeName": "inventory-quarantine",
    "component": "src/views/inventory/Quarantine.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.6",
    "chapterTitle": "Defective Stock Quarantine",
    "checkpointsCount": 16,
    "checkpoints": [
      {
        "checkpointId": "M5-R74-H1",
        "elementCategory": "header",
        "label": "Damaged / Quarantine",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-H2",
        "elementCategory": "header",
        "label": "Report Damaged / Quarantine",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-H3",
        "elementCategory": "header",
        "label": "Affected Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-H4",
        "elementCategory": "header",
        "label": "Damaged / Quarantine / Scrap",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-H5",
        "elementCategory": "header",
        "label": "QC Hold",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-K1",
        "elementCategory": "kpi",
        "label": "Affected Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-K2",
        "elementCategory": "kpi",
        "label": "Quarantine",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-K3",
        "elementCategory": "kpi",
        "label": "Service Route",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-K4",
        "elementCategory": "kpi",
        "label": "Decision Pending",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-TBL1",
        "elementCategory": "table",
        "columns": [
          "Unit",
          "Product",
          "Condition",
          "Source",
          "Decision",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-TBL2",
        "elementCategory": "table",
        "columns": [
          "Serial",
          "Product",
          "Branch",
          "Reason",
          "Since",
          "Proposed Action",
          "Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-B1",
        "elementCategory": "button",
        "actionName": "Report Damaged / Quarantine",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R74-B2",
        "elementCategory": "button",
        "actionName": "Edit &rarr;",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/quarantine/create",
    "routeName": "inventory-create-quarantine",
    "component": "src/views/inventory/CreateQuarantineRecord.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.6",
    "chapterTitle": "Defective Stock Quarantine",
    "checkpointsCount": 13,
    "checkpoints": [
      {
        "checkpointId": "M5-R75-H1",
        "elementCategory": "header",
        "label": "Affected Unit Details",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R75-H2",
        "elementCategory": "header",
        "label": "Inspection & Disposition",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R75-H3",
        "elementCategory": "header",
        "label": "Isolation active upon submit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R75-F1",
        "elementCategory": "field",
        "fieldName": "form.unit",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R75-F2",
        "elementCategory": "field",
        "fieldName": "form.product",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R75-F3",
        "elementCategory": "field",
        "fieldName": "form.source",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R75-F4",
        "elementCategory": "field",
        "fieldName": "form.condition",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R75-F5",
        "elementCategory": "field",
        "fieldName": "form.status",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R75-F6",
        "elementCategory": "field",
        "fieldName": "form.decision",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R75-F7",
        "elementCategory": "field",
        "fieldName": "form.evidence",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R75-F8",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R75-F9",
        "elementCategory": "field",
        "fieldName": "form.approval",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R75-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/quarantine/detail",
    "routeName": "inventory-quarantine-detail-legacy",
    "component": "src/views/inventory/QuarantineDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.6",
    "chapterTitle": "Defective Stock Quarantine",
    "checkpointsCount": 39,
    "checkpoints": [
      {
        "checkpointId": "M5-R76-H1",
        "elementCategory": "header",
        "label": "Report Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-H2",
        "elementCategory": "header",
        "label": "Branch context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-H3",
        "elementCategory": "header",
        "label": "Assignee",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-H4",
        "elementCategory": "header",
        "label": "Branch Team",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-H5",
        "elementCategory": "header",
        "label": "Due",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-T1",
        "elementCategory": "tab",
        "label": "Quarantine Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-T2",
        "elementCategory": "tab",
        "label": "Defect Analysis",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-T3",
        "elementCategory": "tab",
        "label": "Disposition",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-T4",
        "elementCategory": "tab",
        "label": "Supplier Claim",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-T5",
        "elementCategory": "tab",
        "label": "Approval",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-T6",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K1",
        "elementCategory": "kpi",
        "label": "Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K2",
        "elementCategory": "kpi",
        "label": "Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K3",
        "elementCategory": "kpi",
        "label": "Condition",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K4",
        "elementCategory": "kpi",
        "label": "Source",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K5",
        "elementCategory": "kpi",
        "label": "Decision",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K6",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K7",
        "elementCategory": "kpi",
        "label": "Defect Classification",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K8",
        "elementCategory": "kpi",
        "label": "Severity Level",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K9",
        "elementCategory": "kpi",
        "label": "Physical Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K10",
        "elementCategory": "kpi",
        "label": "Isolation Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K11",
        "elementCategory": "kpi",
        "label": "Drive / Operable State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K12",
        "elementCategory": "kpi",
        "label": "Safety Hazard",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K13",
        "elementCategory": "kpi",
        "label": "Attached Inspection",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K14",
        "elementCategory": "kpi",
        "label": "Inspected By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K15",
        "elementCategory": "kpi",
        "label": "Inspection Timestamp",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K16",
        "elementCategory": "kpi",
        "label": "Physical Findings",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K17",
        "elementCategory": "kpi",
        "label": "Checklist Signed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K18",
        "elementCategory": "kpi",
        "label": "Supporting Files",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K19",
        "elementCategory": "kpi",
        "label": "Proposed Disposition",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K20",
        "elementCategory": "kpi",
        "label": "Assigned Service Bay",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K21",
        "elementCategory": "kpi",
        "label": "Approving Authority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K22",
        "elementCategory": "kpi",
        "label": "Estimated Turnaround",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K23",
        "elementCategory": "kpi",
        "label": "Cost Allocation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K24",
        "elementCategory": "kpi",
        "label": "Disposition Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-K25",
        "elementCategory": "kpi",
        "label": "10:45",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-B1",
        "elementCategory": "button",
        "actionName": "Back to List",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-B2",
        "elementCategory": "button",
        "actionName": "Report Unit",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R76-B3",
        "elementCategory": "button",
        "actionName": "Disposition Review",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/inventory/quarantine/:id",
    "routeName": "inventory-quarantine-detail",
    "component": "src/views/inventory/QuarantineDetail.vue",
    "stageId": "M5",
    "stageTitle": "Serialized Inventory, Transfers & Inbound Procurement",
    "chapter": "5.6",
    "chapterTitle": "Defective Stock Quarantine",
    "checkpointsCount": 39,
    "checkpoints": [
      {
        "checkpointId": "M5-R77-H1",
        "elementCategory": "header",
        "label": "Report Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-H2",
        "elementCategory": "header",
        "label": "Branch context",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-H3",
        "elementCategory": "header",
        "label": "Assignee",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-H4",
        "elementCategory": "header",
        "label": "Branch Team",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-H5",
        "elementCategory": "header",
        "label": "Due",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-T1",
        "elementCategory": "tab",
        "label": "Quarantine Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-T2",
        "elementCategory": "tab",
        "label": "Defect Analysis",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-T3",
        "elementCategory": "tab",
        "label": "Disposition",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-T4",
        "elementCategory": "tab",
        "label": "Supplier Claim",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-T5",
        "elementCategory": "tab",
        "label": "Approval",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-T6",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K1",
        "elementCategory": "kpi",
        "label": "Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K2",
        "elementCategory": "kpi",
        "label": "Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K3",
        "elementCategory": "kpi",
        "label": "Condition",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K4",
        "elementCategory": "kpi",
        "label": "Source",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K5",
        "elementCategory": "kpi",
        "label": "Decision",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K6",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K7",
        "elementCategory": "kpi",
        "label": "Defect Classification",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K8",
        "elementCategory": "kpi",
        "label": "Severity Level",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K9",
        "elementCategory": "kpi",
        "label": "Physical Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K10",
        "elementCategory": "kpi",
        "label": "Isolation Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K11",
        "elementCategory": "kpi",
        "label": "Drive / Operable State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K12",
        "elementCategory": "kpi",
        "label": "Safety Hazard",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K13",
        "elementCategory": "kpi",
        "label": "Attached Inspection",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K14",
        "elementCategory": "kpi",
        "label": "Inspected By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K15",
        "elementCategory": "kpi",
        "label": "Inspection Timestamp",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K16",
        "elementCategory": "kpi",
        "label": "Physical Findings",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K17",
        "elementCategory": "kpi",
        "label": "Checklist Signed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K18",
        "elementCategory": "kpi",
        "label": "Supporting Files",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K19",
        "elementCategory": "kpi",
        "label": "Proposed Disposition",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K20",
        "elementCategory": "kpi",
        "label": "Assigned Service Bay",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K21",
        "elementCategory": "kpi",
        "label": "Approving Authority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K22",
        "elementCategory": "kpi",
        "label": "Estimated Turnaround",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K23",
        "elementCategory": "kpi",
        "label": "Cost Allocation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K24",
        "elementCategory": "kpi",
        "label": "Disposition Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-K25",
        "elementCategory": "kpi",
        "label": "10:45",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-B1",
        "elementCategory": "button",
        "actionName": "Back to List",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-B2",
        "elementCategory": "button",
        "actionName": "Report Unit",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M5-R77-B3",
        "elementCategory": "button",
        "actionName": "Disposition Review",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/dashboard",
    "routeName": "sales-dashboard",
    "component": "src/views/sales/SalesDashboard.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.8",
    "chapterTitle": "Sales Performance Analytics",
    "checkpointsCount": 19,
    "checkpoints": [
      {
        "checkpointId": "M3-R78-H1",
        "elementCategory": "header",
        "label": "Sales Dashboard",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-H2",
        "elementCategory": "header",
        "label": "Sales Trend",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-H3",
        "elementCategory": "header",
        "label": "Top Products",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-H4",
        "elementCategory": "header",
        "label": "BRG E-125",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-H5",
        "elementCategory": "header",
        "label": "12 units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-K1",
        "elementCategory": "kpi",
        "label": "Units Sold",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-K2",
        "elementCategory": "kpi",
        "label": "Collections",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-K3",
        "elementCategory": "kpi",
        "label": "Outstanding",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-K4",
        "elementCategory": "kpi",
        "label": "Net Sales",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-K5",
        "elementCategory": "kpi",
        "label": "Orders",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-K6",
        "elementCategory": "kpi",
        "label": "Avg Sale",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-K7",
        "elementCategory": "kpi",
        "label": "Discounts",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-K8",
        "elementCategory": "kpi",
        "label": "Gross Profit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-K9",
        "elementCategory": "kpi",
        "label": "Peshawar",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-K10",
        "elementCategory": "kpi",
        "label": "Islamabad",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-K11",
        "elementCategory": "kpi",
        "label": "Lahore",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-K12",
        "elementCategory": "kpi",
        "label": "Rawalpindi",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product",
          "Revenue",
          "Units",
          "Margin"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R78-TBL2",
        "elementCategory": "table",
        "columns": [
          "Branch",
          "Collected",
          "Outstanding",
          "Overdue"
        ],
        "trainingType": "inspect",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/quotations",
    "routeName": "sales-quotations",
    "component": "src/views/sales/Quotations.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.2",
    "chapterTitle": "Formal Sales Quotations",
    "checkpointsCount": 21,
    "checkpoints": [
      {
        "checkpointId": "M3-R79-H1",
        "elementCategory": "header",
        "label": "Quotations",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-H2",
        "elementCategory": "header",
        "label": "New Quotation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-H3",
        "elementCategory": "header",
        "label": "Branch Quotations",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-T1",
        "elementCategory": "tab",
        "label": "Reset Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-T3",
        "elementCategory": "tab",
        "label": "All",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-T4",
        "elementCategory": "tab",
        "label": "Draft",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-T5",
        "elementCategory": "tab",
        "label": "Sent",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-T6",
        "elementCategory": "tab",
        "label": "Accepted",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-T7",
        "elementCategory": "tab",
        "label": "Expired",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-K1",
        "elementCategory": "kpi",
        "label": "Open",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-K2",
        "elementCategory": "kpi",
        "label": "Accepted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-K3",
        "elementCategory": "kpi",
        "label": "Expiring",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-K4",
        "elementCategory": "kpi",
        "label": "Value",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-TBL1",
        "elementCategory": "table",
        "columns": [
          "Quotation",
          "Customer",
          "Product",
          "Value",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-TBL2",
        "elementCategory": "table",
        "columns": [
          "Quote",
          "Branch",
          "Customer",
          "Items",
          "Amount",
          "Valid Until",
          "Status",
          "Owner",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-B1",
        "elementCategory": "button",
        "actionName": "New Quotation",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-B2",
        "elementCategory": "button",
        "actionName": "Open &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R79-B3",
        "elementCategory": "button",
        "actionName": "Edit &rarr;",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/quotations/create",
    "routeName": "sales-create-quotation",
    "component": "src/views/sales/CreateQuotation.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.2",
    "chapterTitle": "Formal Sales Quotations",
    "checkpointsCount": 21,
    "checkpoints": [
      {
        "checkpointId": "M3-R80-H1",
        "elementCategory": "header",
        "label": "Branch Assignment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-H2",
        "elementCategory": "header",
        "label": "Customer & Commercial Terms",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-H3",
        "elementCategory": "header",
        "label": "Delivery & Validity Terms",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-H4",
        "elementCategory": "header",
        "label": "Vehicles & Quoted Items",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-H5",
        "elementCategory": "header",
        "label": "Subtotal",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-F1",
        "elementCategory": "field",
        "fieldName": "form.branch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-F2",
        "elementCategory": "field",
        "fieldName": "customerSearch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-F3",
        "elementCategory": "field",
        "fieldName": "form.paymentTerms",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-F4",
        "elementCategory": "field",
        "fieldName": "form.taxRegFees",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-F5",
        "elementCategory": "field",
        "fieldName": "form.deliveryLeadTime",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-F6",
        "elementCategory": "field",
        "fieldName": "form.validity",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-F7",
        "elementCategory": "field",
        "fieldName": "item.product",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-F8",
        "elementCategory": "field",
        "fieldName": "item.quantity",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-F9",
        "elementCategory": "field",
        "fieldName": "item.sellingPrice",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-F10",
        "elementCategory": "field",
        "fieldName": "item.warranty",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-F11",
        "elementCategory": "field",
        "fieldName": "form.discount",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-F12",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-B1",
        "elementCategory": "button",
        "actionName": "Create New Customer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-B2",
        "elementCategory": "button",
        "actionName": "+ Add New Customer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-B3",
        "elementCategory": "button",
        "actionName": "Add Vehicle",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R80-B4",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/quotations/detail",
    "routeName": "sales-quotation-detail-legacy",
    "component": "src/views/sales/QuotationDetail.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.2",
    "chapterTitle": "Formal Sales Quotations",
    "checkpointsCount": 41,
    "checkpoints": [
      {
        "checkpointId": "M3-R81-H1",
        "elementCategory": "header",
        "label": "Quotation Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-H2",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-H3",
        "elementCategory": "header",
        "label": "Owner",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-H4",
        "elementCategory": "header",
        "label": "Hamza",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-H5",
        "elementCategory": "header",
        "label": "Last Contact",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-T2",
        "elementCategory": "tab",
        "label": "Items",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-T3",
        "elementCategory": "tab",
        "label": "Customer",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-T4",
        "elementCategory": "tab",
        "label": "Pricing",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-T5",
        "elementCategory": "tab",
        "label": "Communication",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-T6",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-T7",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K1",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K2",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K3",
        "elementCategory": "kpi",
        "label": "Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K4",
        "elementCategory": "kpi",
        "label": "Quantity",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K5",
        "elementCategory": "kpi",
        "label": "Quoted Price",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K6",
        "elementCategory": "kpi",
        "label": "Valid Until",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K7",
        "elementCategory": "kpi",
        "label": "Item Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K8",
        "elementCategory": "kpi",
        "label": "Specification",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K9",
        "elementCategory": "kpi",
        "label": "Inventory Allocation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K10",
        "elementCategory": "kpi",
        "label": "Warranty Plan",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K11",
        "elementCategory": "kpi",
        "label": "Delivery Lead Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K12",
        "elementCategory": "kpi",
        "label": "Chassis Reservation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K13",
        "elementCategory": "kpi",
        "label": "Full Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K14",
        "elementCategory": "kpi",
        "label": "Phone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K15",
        "elementCategory": "kpi",
        "label": "Email",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K16",
        "elementCategory": "kpi",
        "label": "Customer Type",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K17",
        "elementCategory": "kpi",
        "label": "Branch Association",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K18",
        "elementCategory": "kpi",
        "label": "Previous Purchases",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K19",
        "elementCategory": "kpi",
        "label": "Base List Price",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K20",
        "elementCategory": "kpi",
        "label": "Permitted Discount",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K21",
        "elementCategory": "kpi",
        "label": "Net Payable",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K22",
        "elementCategory": "kpi",
        "label": "Tax / Reg Fees",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K23",
        "elementCategory": "kpi",
        "label": "Payment Terms",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K24",
        "elementCategory": "kpi",
        "label": "Price Lock Validity",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-K25",
        "elementCategory": "kpi",
        "label": "WhatsApp Dispatch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-B1",
        "elementCategory": "button",
        "actionName": "Back to Quotations",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-B2",
        "elementCategory": "button",
        "actionName": "Back to List",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-B3",
        "elementCategory": "button",
        "actionName": "Accept Quote",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R81-B4",
        "elementCategory": "button",
        "actionName": "Convert to Sales Order",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/quotations/:id",
    "routeName": "sales-quotation-detail",
    "component": "src/views/sales/QuotationDetail.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.2",
    "chapterTitle": "Formal Sales Quotations",
    "checkpointsCount": 41,
    "checkpoints": [
      {
        "checkpointId": "M3-R82-H1",
        "elementCategory": "header",
        "label": "Quotation Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-H2",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-H3",
        "elementCategory": "header",
        "label": "Owner",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-H4",
        "elementCategory": "header",
        "label": "Hamza",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-H5",
        "elementCategory": "header",
        "label": "Last Contact",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-T2",
        "elementCategory": "tab",
        "label": "Items",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-T3",
        "elementCategory": "tab",
        "label": "Customer",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-T4",
        "elementCategory": "tab",
        "label": "Pricing",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-T5",
        "elementCategory": "tab",
        "label": "Communication",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-T6",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-T7",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K1",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K2",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K3",
        "elementCategory": "kpi",
        "label": "Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K4",
        "elementCategory": "kpi",
        "label": "Quantity",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K5",
        "elementCategory": "kpi",
        "label": "Quoted Price",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K6",
        "elementCategory": "kpi",
        "label": "Valid Until",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K7",
        "elementCategory": "kpi",
        "label": "Item Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K8",
        "elementCategory": "kpi",
        "label": "Specification",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K9",
        "elementCategory": "kpi",
        "label": "Inventory Allocation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K10",
        "elementCategory": "kpi",
        "label": "Warranty Plan",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K11",
        "elementCategory": "kpi",
        "label": "Delivery Lead Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K12",
        "elementCategory": "kpi",
        "label": "Chassis Reservation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K13",
        "elementCategory": "kpi",
        "label": "Full Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K14",
        "elementCategory": "kpi",
        "label": "Phone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K15",
        "elementCategory": "kpi",
        "label": "Email",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K16",
        "elementCategory": "kpi",
        "label": "Customer Type",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K17",
        "elementCategory": "kpi",
        "label": "Branch Association",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K18",
        "elementCategory": "kpi",
        "label": "Previous Purchases",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K19",
        "elementCategory": "kpi",
        "label": "Base List Price",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K20",
        "elementCategory": "kpi",
        "label": "Permitted Discount",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K21",
        "elementCategory": "kpi",
        "label": "Net Payable",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K22",
        "elementCategory": "kpi",
        "label": "Tax / Reg Fees",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K23",
        "elementCategory": "kpi",
        "label": "Payment Terms",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K24",
        "elementCategory": "kpi",
        "label": "Price Lock Validity",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-K25",
        "elementCategory": "kpi",
        "label": "WhatsApp Dispatch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-B1",
        "elementCategory": "button",
        "actionName": "Back to Quotations",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-B2",
        "elementCategory": "button",
        "actionName": "Back to List",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-B3",
        "elementCategory": "button",
        "actionName": "Accept Quote",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R82-B4",
        "elementCategory": "button",
        "actionName": "Convert to Sales Order",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/orders",
    "routeName": "sales-orders",
    "component": "src/views/sales/Orders.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.4",
    "chapterTitle": "Vehicle Booking Orders",
    "checkpointsCount": 25,
    "checkpoints": [
      {
        "checkpointId": "M3-R83-H1",
        "elementCategory": "header",
        "label": "Orders",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-H2",
        "elementCategory": "header",
        "label": "Create Sale",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-H3",
        "elementCategory": "header",
        "label": "Branch Orders",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-H4",
        "elementCategory": "header",
        "label": "Create Order",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-T1",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-T2",
        "elementCategory": "tab",
        "label": "All",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-T3",
        "elementCategory": "tab",
        "label": "New",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-T4",
        "elementCategory": "tab",
        "label": "Confirmed",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-T5",
        "elementCategory": "tab",
        "label": "Payment Pending",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-T6",
        "elementCategory": "tab",
        "label": "Reserved",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-T7",
        "elementCategory": "tab",
        "label": "Ready",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-T8",
        "elementCategory": "tab",
        "label": "Completed",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-T9",
        "elementCategory": "tab",
        "label": "Returned",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-K1",
        "elementCategory": "kpi",
        "label": "Open Orders",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-K2",
        "elementCategory": "kpi",
        "label": "Reserved Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-K3",
        "elementCategory": "kpi",
        "label": "Unpaid / Partial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-K4",
        "elementCategory": "kpi",
        "label": "Completed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-TBL1",
        "elementCategory": "table",
        "columns": [
          "Order",
          "Customer",
          "Product",
          "Total",
          "Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-TBL2",
        "elementCategory": "table",
        "columns": [
          "Order",
          "Branch",
          "Customer",
          "Unit",
          "Amount",
          "Paid",
          "Balance",
          "Status",
          "Delivery",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-B1",
        "elementCategory": "button",
        "actionName": "Create Sale",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-B2",
        "elementCategory": "button",
        "actionName": "Open &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-B3",
        "elementCategory": "button",
        "actionName": "Create Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R83-B4",
        "elementCategory": "button",
        "actionName": "View",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/orders/create",
    "routeName": "sales-create-order",
    "component": "src/views/sales/CreateSale.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.3",
    "chapterTitle": "Point of Sale (POS) Instant Retail",
    "checkpointsCount": 24,
    "checkpoints": [
      {
        "checkpointId": "M3-R84-H1",
        "elementCategory": "header",
        "label": "1. Dealership & Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-H2",
        "elementCategory": "header",
        "label": "Step 1 of 4",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-H3",
        "elementCategory": "header",
        "label": "2. Vehicle Price & Discounts",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-H4",
        "elementCategory": "header",
        "label": "All amounts in PKR",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-H5",
        "elementCategory": "header",
        "label": "Max 8% branch allowance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-TBL1",
        "elementCategory": "table",
        "columns": [
          "Serial",
          "Chassis (VIN)",
          "Status",
          "Landed Cost",
          "Select"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F1",
        "elementCategory": "field",
        "fieldName": "saleData.branch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F2",
        "elementCategory": "field",
        "fieldName": "customerSearch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F3",
        "elementCategory": "field",
        "fieldName": "saleData.salesperson",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F4",
        "elementCategory": "field",
        "fieldName": "saleData.product",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F5",
        "elementCategory": "field",
        "fieldName": "saleData.cataloguePrice",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F6",
        "elementCategory": "field",
        "fieldName": "saleData.discount",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F7",
        "elementCategory": "field",
        "fieldName": "saleData.finalPrice",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F8",
        "elementCategory": "field",
        "fieldName": "saleData.selectedUnit",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F9",
        "elementCategory": "field",
        "fieldName": "saleData.paymentMethod",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F10",
        "elementCategory": "field",
        "fieldName": "saleData.transactionId",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F11",
        "elementCategory": "field",
        "fieldName": "saleData.bankAccount",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F12",
        "elementCategory": "field",
        "fieldName": "saleData.chequeNo",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F13",
        "elementCategory": "field",
        "fieldName": "saleData.draweeBank",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F14",
        "elementCategory": "field",
        "fieldName": "saleData.amountReceived",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-F15",
        "elementCategory": "field",
        "fieldName": "saleData.balance",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-B1",
        "elementCategory": "button",
        "actionName": "Create New Customer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-B2",
        "elementCategory": "button",
        "actionName": "+ Add New Customer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R84-B3",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/create-sale",
    "routeName": "sales-create-sale-alias",
    "component": "src/views/sales/CreateSale.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.3",
    "chapterTitle": "Point of Sale (POS) Instant Retail",
    "checkpointsCount": 24,
    "checkpoints": [
      {
        "checkpointId": "M3-R85-H1",
        "elementCategory": "header",
        "label": "1. Dealership & Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-H2",
        "elementCategory": "header",
        "label": "Step 1 of 4",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-H3",
        "elementCategory": "header",
        "label": "2. Vehicle Price & Discounts",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-H4",
        "elementCategory": "header",
        "label": "All amounts in PKR",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-H5",
        "elementCategory": "header",
        "label": "Max 8% branch allowance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-TBL1",
        "elementCategory": "table",
        "columns": [
          "Serial",
          "Chassis (VIN)",
          "Status",
          "Landed Cost",
          "Select"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F1",
        "elementCategory": "field",
        "fieldName": "saleData.branch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F2",
        "elementCategory": "field",
        "fieldName": "customerSearch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F3",
        "elementCategory": "field",
        "fieldName": "saleData.salesperson",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F4",
        "elementCategory": "field",
        "fieldName": "saleData.product",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F5",
        "elementCategory": "field",
        "fieldName": "saleData.cataloguePrice",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F6",
        "elementCategory": "field",
        "fieldName": "saleData.discount",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F7",
        "elementCategory": "field",
        "fieldName": "saleData.finalPrice",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F8",
        "elementCategory": "field",
        "fieldName": "saleData.selectedUnit",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F9",
        "elementCategory": "field",
        "fieldName": "saleData.paymentMethod",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F10",
        "elementCategory": "field",
        "fieldName": "saleData.transactionId",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F11",
        "elementCategory": "field",
        "fieldName": "saleData.bankAccount",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F12",
        "elementCategory": "field",
        "fieldName": "saleData.chequeNo",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F13",
        "elementCategory": "field",
        "fieldName": "saleData.draweeBank",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F14",
        "elementCategory": "field",
        "fieldName": "saleData.amountReceived",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-F15",
        "elementCategory": "field",
        "fieldName": "saleData.balance",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-B1",
        "elementCategory": "button",
        "actionName": "Create New Customer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-B2",
        "elementCategory": "button",
        "actionName": "+ Add New Customer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R85-B3",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/orders/detail",
    "routeName": "sales-order-detail-legacy",
    "component": "src/views/sales/OrderDetail.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.4",
    "chapterTitle": "Vehicle Booking Orders",
    "checkpointsCount": 45,
    "checkpoints": [
      {
        "checkpointId": "M3-R86-H1",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-H2",
        "elementCategory": "header",
        "label": "Invoice",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-H3",
        "elementCategory": "header",
        "label": "Delivery",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-H4",
        "elementCategory": "header",
        "label": "Today 16:00",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-H5",
        "elementCategory": "header",
        "label": "Warranty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-T2",
        "elementCategory": "tab",
        "label": "Items & Serialized Unit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-T3",
        "elementCategory": "tab",
        "label": "Customer",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-T4",
        "elementCategory": "tab",
        "label": "Price & Margin",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-T5",
        "elementCategory": "tab",
        "label": "Payments",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-T6",
        "elementCategory": "tab",
        "label": "Invoice",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-T7",
        "elementCategory": "tab",
        "label": "Delivery",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-T8",
        "elementCategory": "tab",
        "label": "Returns",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-T9",
        "elementCategory": "tab",
        "label": "Warranty",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-T10",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-T11",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K1",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K2",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K3",
        "elementCategory": "kpi",
        "label": "Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K4",
        "elementCategory": "kpi",
        "label": "Chassis",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K5",
        "elementCategory": "kpi",
        "label": "Order Total",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K6",
        "elementCategory": "kpi",
        "label": "Paid",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K7",
        "elementCategory": "kpi",
        "label": "Product Model",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K8",
        "elementCategory": "kpi",
        "label": "Chassis Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K9",
        "elementCategory": "kpi",
        "label": "Allocated Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K10",
        "elementCategory": "kpi",
        "label": "Variant / Color",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K11",
        "elementCategory": "kpi",
        "label": "Battery Serial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K12",
        "elementCategory": "kpi",
        "label": "QC Inspection",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K13",
        "elementCategory": "kpi",
        "label": "Full Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K14",
        "elementCategory": "kpi",
        "label": "Contact Phone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K15",
        "elementCategory": "kpi",
        "label": "CNIC / National ID",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K16",
        "elementCategory": "kpi",
        "label": "Delivery Address",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K17",
        "elementCategory": "kpi",
        "label": "Customer Segment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K18",
        "elementCategory": "kpi",
        "label": "Account History",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K19",
        "elementCategory": "kpi",
        "label": "Total Billed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K20",
        "elementCategory": "kpi",
        "label": "Amount Received",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K21",
        "elementCategory": "kpi",
        "label": "Outstanding Balance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K22",
        "elementCategory": "kpi",
        "label": "Payment Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K23",
        "elementCategory": "kpi",
        "label": "Transaction Ref",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K24",
        "elementCategory": "kpi",
        "label": "Payment Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-K25",
        "elementCategory": "kpi",
        "label": "Invoice Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-B1",
        "elementCategory": "button",
        "actionName": "Back to List",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-B2",
        "elementCategory": "button",
        "actionName": "Delivery Handover",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-B3",
        "elementCategory": "button",
        "actionName": "Cancel Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R86-B4",
        "elementCategory": "button",
        "actionName": "Order Actions",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/orders/:id",
    "routeName": "sales-order-detail",
    "component": "src/views/sales/OrderDetail.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.4",
    "chapterTitle": "Vehicle Booking Orders",
    "checkpointsCount": 45,
    "checkpoints": [
      {
        "checkpointId": "M3-R87-H1",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-H2",
        "elementCategory": "header",
        "label": "Invoice",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-H3",
        "elementCategory": "header",
        "label": "Delivery",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-H4",
        "elementCategory": "header",
        "label": "Today 16:00",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-H5",
        "elementCategory": "header",
        "label": "Warranty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-T2",
        "elementCategory": "tab",
        "label": "Items & Serialized Unit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-T3",
        "elementCategory": "tab",
        "label": "Customer",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-T4",
        "elementCategory": "tab",
        "label": "Price & Margin",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-T5",
        "elementCategory": "tab",
        "label": "Payments",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-T6",
        "elementCategory": "tab",
        "label": "Invoice",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-T7",
        "elementCategory": "tab",
        "label": "Delivery",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-T8",
        "elementCategory": "tab",
        "label": "Returns",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-T9",
        "elementCategory": "tab",
        "label": "Warranty",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-T10",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-T11",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K1",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K2",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K3",
        "elementCategory": "kpi",
        "label": "Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K4",
        "elementCategory": "kpi",
        "label": "Chassis",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K5",
        "elementCategory": "kpi",
        "label": "Order Total",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K6",
        "elementCategory": "kpi",
        "label": "Paid",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K7",
        "elementCategory": "kpi",
        "label": "Product Model",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K8",
        "elementCategory": "kpi",
        "label": "Chassis Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K9",
        "elementCategory": "kpi",
        "label": "Allocated Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K10",
        "elementCategory": "kpi",
        "label": "Variant / Color",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K11",
        "elementCategory": "kpi",
        "label": "Battery Serial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K12",
        "elementCategory": "kpi",
        "label": "QC Inspection",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K13",
        "elementCategory": "kpi",
        "label": "Full Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K14",
        "elementCategory": "kpi",
        "label": "Contact Phone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K15",
        "elementCategory": "kpi",
        "label": "CNIC / National ID",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K16",
        "elementCategory": "kpi",
        "label": "Delivery Address",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K17",
        "elementCategory": "kpi",
        "label": "Customer Segment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K18",
        "elementCategory": "kpi",
        "label": "Account History",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K19",
        "elementCategory": "kpi",
        "label": "Total Billed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K20",
        "elementCategory": "kpi",
        "label": "Amount Received",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K21",
        "elementCategory": "kpi",
        "label": "Outstanding Balance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K22",
        "elementCategory": "kpi",
        "label": "Payment Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K23",
        "elementCategory": "kpi",
        "label": "Transaction Ref",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K24",
        "elementCategory": "kpi",
        "label": "Payment Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-K25",
        "elementCategory": "kpi",
        "label": "Invoice Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-B1",
        "elementCategory": "button",
        "actionName": "Back to List",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-B2",
        "elementCategory": "button",
        "actionName": "Delivery Handover",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-B3",
        "elementCategory": "button",
        "actionName": "Cancel Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R87-B4",
        "elementCategory": "button",
        "actionName": "Order Actions",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/invoices",
    "routeName": "sales-invoices",
    "component": "src/views/sales/Invoices.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.6",
    "chapterTitle": "Commercial Invoicing & Taxes",
    "checkpointsCount": 19,
    "checkpoints": [
      {
        "checkpointId": "M3-R88-H1",
        "elementCategory": "header",
        "label": "Invoices & Receivables",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-H2",
        "elementCategory": "header",
        "label": "Columns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-H3",
        "elementCategory": "header",
        "label": "Export",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-H4",
        "elementCategory": "header",
        "label": "Invoices",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-T2",
        "elementCategory": "tab",
        "label": "Clear all filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-T3",
        "elementCategory": "tab",
        "label": "Reset Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-K1",
        "elementCategory": "kpi",
        "label": "Paid",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-K2",
        "elementCategory": "kpi",
        "label": "Partial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-K3",
        "elementCategory": "kpi",
        "label": "Unpaid",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-K4",
        "elementCategory": "kpi",
        "label": "Overdue",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-TBL1",
        "elementCategory": "table",
        "columns": [
          "Invoice",
          "Customer",
          "Order",
          "Amount",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-TBL2",
        "elementCategory": "table",
        "columns": [
          "Invoice",
          "Order",
          "Branch",
          "Customer",
          "Amount",
          "Issued",
          "Payment Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-B1",
        "elementCategory": "button",
        "actionName": "Create Invoice",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-B2",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-B4",
        "elementCategory": "button",
        "actionName": "Open &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R88-B5",
        "elementCategory": "button",
        "actionName": "Open",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/invoices/create",
    "routeName": "sales-create-invoice",
    "component": "src/views/sales/CreateInvoice.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.6",
    "chapterTitle": "Commercial Invoicing & Taxes",
    "checkpointsCount": 22,
    "checkpoints": [
      {
        "checkpointId": "M3-R89-H1",
        "elementCategory": "header",
        "label": "Assignment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-H2",
        "elementCategory": "header",
        "label": "Customer Details",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-H3",
        "elementCategory": "header",
        "label": "Invoice Terms",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-H4",
        "elementCategory": "header",
        "label": "Line Items",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-H5",
        "elementCategory": "header",
        "label": "Subtotal",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F1",
        "elementCategory": "field",
        "fieldName": "form.branch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F2",
        "elementCategory": "field",
        "fieldName": "customerSearch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F3",
        "elementCategory": "field",
        "fieldName": "form.relatedReference",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F4",
        "elementCategory": "field",
        "fieldName": "form.paymentTerms",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F5",
        "elementCategory": "field",
        "fieldName": "form.issueDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F6",
        "elementCategory": "field",
        "fieldName": "form.dueDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F7",
        "elementCategory": "field",
        "fieldName": "form.status",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F8",
        "elementCategory": "field",
        "fieldName": "item.description",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F9",
        "elementCategory": "field",
        "fieldName": "item.quantity",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F10",
        "elementCategory": "field",
        "fieldName": "item.unitPrice",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F11",
        "elementCategory": "field",
        "fieldName": "form.discount",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F12",
        "elementCategory": "field",
        "fieldName": "form.tax",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-F13",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-B1",
        "elementCategory": "button",
        "actionName": "Create New Customer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-B2",
        "elementCategory": "button",
        "actionName": "+ Add New Customer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-B3",
        "elementCategory": "button",
        "actionName": "Add Custom Item",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R89-B4",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/invoices/detail",
    "routeName": "sales-invoice-detail-legacy",
    "component": "src/views/sales/InvoiceDetail.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.6",
    "chapterTitle": "Commercial Invoicing & Taxes",
    "checkpointsCount": 9,
    "checkpoints": [
      {
        "checkpointId": "M3-R90-H1",
        "elementCategory": "header",
        "label": "Invoice Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R90-H2",
        "elementCategory": "header",
        "label": "Invoice",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R90-H3",
        "elementCategory": "header",
        "label": "Invoice No:",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R90-H4",
        "elementCategory": "header",
        "label": "Order No:",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R90-H5",
        "elementCategory": "header",
        "label": "Date Issued:",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R90-TBL1",
        "elementCategory": "table",
        "columns": [
          "Description",
          "Qty",
          "Unit Price",
          "Total Amount"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R90-B1",
        "elementCategory": "button",
        "actionName": "Back to Invoices",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R90-B2",
        "elementCategory": "button",
        "actionName": "Print",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R90-B3",
        "elementCategory": "button",
        "actionName": "Download PDF",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/invoices/:id",
    "routeName": "sales-invoice-detail",
    "component": "src/views/sales/InvoiceDetail.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.6",
    "chapterTitle": "Commercial Invoicing & Taxes",
    "checkpointsCount": 9,
    "checkpoints": [
      {
        "checkpointId": "M3-R91-H1",
        "elementCategory": "header",
        "label": "Invoice Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R91-H2",
        "elementCategory": "header",
        "label": "Invoice",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R91-H3",
        "elementCategory": "header",
        "label": "Invoice No:",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R91-H4",
        "elementCategory": "header",
        "label": "Order No:",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R91-H5",
        "elementCategory": "header",
        "label": "Date Issued:",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R91-TBL1",
        "elementCategory": "table",
        "columns": [
          "Description",
          "Qty",
          "Unit Price",
          "Total Amount"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R91-B1",
        "elementCategory": "button",
        "actionName": "Back to Invoices",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R91-B2",
        "elementCategory": "button",
        "actionName": "Print",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R91-B3",
        "elementCategory": "button",
        "actionName": "Download PDF",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/payments",
    "routeName": "sales-payments",
    "component": "src/views/sales/Payments.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.7",
    "chapterTitle": "Customer Payment Settlement",
    "checkpointsCount": 18,
    "checkpoints": [
      {
        "checkpointId": "M3-R92-H1",
        "elementCategory": "header",
        "label": "Payments",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-H2",
        "elementCategory": "header",
        "label": "Record Payment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-K1",
        "elementCategory": "kpi",
        "label": "Collected",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-K2",
        "elementCategory": "kpi",
        "label": "Cash",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-K3",
        "elementCategory": "kpi",
        "label": "Bank",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-K4",
        "elementCategory": "kpi",
        "label": "Unreconciled",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-K5",
        "elementCategory": "kpi",
        "label": "Collected This Month",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-K6",
        "elementCategory": "kpi",
        "label": "Unallocated",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-K7",
        "elementCategory": "kpi",
        "label": "Refunded",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-K8",
        "elementCategory": "kpi",
        "label": "Outstanding",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-TBL1",
        "elementCategory": "table",
        "columns": [
          "Payment",
          "Customer",
          "Method",
          "Amount",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-TBL2",
        "elementCategory": "table",
        "columns": [
          "Payment",
          "Order",
          "Customer",
          "Branch",
          "Method",
          "Amount",
          "Date",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-B1",
        "elementCategory": "button",
        "actionName": "Record Payment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-B2",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R92-B4",
        "elementCategory": "button",
        "actionName": "Open &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/payments/create",
    "routeName": "sales-create-payment",
    "component": "src/views/sales/CreatePayment.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.7",
    "chapterTitle": "Customer Payment Settlement",
    "checkpointsCount": 13,
    "checkpoints": [
      {
        "checkpointId": "M3-R93-H1",
        "elementCategory": "header",
        "label": "Dealership Cash Rule:",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R93-H2",
        "elementCategory": "header",
        "label": "Verification & Reconciliation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R93-H3",
        "elementCategory": "header",
        "label": "* (Mandatory for Bank Transfer)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R93-F1",
        "elementCategory": "field",
        "fieldName": "form.invoice_id",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R93-F2",
        "elementCategory": "field",
        "fieldName": "form.customer",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R93-F3",
        "elementCategory": "field",
        "fieldName": "form.order",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R93-F4",
        "elementCategory": "field",
        "fieldName": "form.method",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R93-F5",
        "elementCategory": "field",
        "fieldName": "e.g. PKR 280,000",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R93-F6",
        "elementCategory": "field",
        "fieldName": "form.transactionRef",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R93-F7",
        "elementCategory": "field",
        "fieldName": "form.bankAccount",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R93-F8",
        "elementCategory": "field",
        "fieldName": "form.date",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R93-F9",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R93-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/payments/detail",
    "routeName": "sales-payment-detail-legacy",
    "component": "src/views/sales/PaymentDetail.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.7",
    "chapterTitle": "Customer Payment Settlement",
    "checkpointsCount": 38,
    "checkpoints": [
      {
        "checkpointId": "M3-R94-H1",
        "elementCategory": "header",
        "label": "Payment Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-H2",
        "elementCategory": "header",
        "label": "Record Payment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-H3",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-H4",
        "elementCategory": "header",
        "label": "Receipt",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-H5",
        "elementCategory": "header",
        "label": "Posted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-T2",
        "elementCategory": "tab",
        "label": "Allocation",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-T3",
        "elementCategory": "tab",
        "label": "Bank Details",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-T4",
        "elementCategory": "tab",
        "label": "Customer Account",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-T5",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K1",
        "elementCategory": "kpi",
        "label": "Payment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K2",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K3",
        "elementCategory": "kpi",
        "label": "Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K4",
        "elementCategory": "kpi",
        "label": "Amount",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K5",
        "elementCategory": "kpi",
        "label": "Order Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K6",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K7",
        "elementCategory": "kpi",
        "label": "Applied Invoice",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K8",
        "elementCategory": "kpi",
        "label": "Total Order Value",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K9",
        "elementCategory": "kpi",
        "label": "Payment Allocation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K10",
        "elementCategory": "kpi",
        "label": "Unallocated Funds",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K11",
        "elementCategory": "kpi",
        "label": "Remaining Balance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K12",
        "elementCategory": "kpi",
        "label": "Allocation Rule",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K13",
        "elementCategory": "kpi",
        "label": "Deposit Account",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K14",
        "elementCategory": "kpi",
        "label": "Transaction Slip",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K15",
        "elementCategory": "kpi",
        "label": "Bank Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K16",
        "elementCategory": "kpi",
        "label": "Clearing Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K17",
        "elementCategory": "kpi",
        "label": "Bank Fee / Charges",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K18",
        "elementCategory": "kpi",
        "label": "Reconciliation State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K19",
        "elementCategory": "kpi",
        "label": "Account Holder",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K20",
        "elementCategory": "kpi",
        "label": "Total Lifetime Orders",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K21",
        "elementCategory": "kpi",
        "label": "Credit Limit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K22",
        "elementCategory": "kpi",
        "label": "Current Receivables",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K23",
        "elementCategory": "kpi",
        "label": "Payment Reliability",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K24",
        "elementCategory": "kpi",
        "label": "Branch Account",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-K25",
        "elementCategory": "kpi",
        "label": "10:45",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-B1",
        "elementCategory": "button",
        "actionName": "Back to Payments",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-B2",
        "elementCategory": "button",
        "actionName": "Back to List",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R94-B3",
        "elementCategory": "button",
        "actionName": "Record Payment",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/payments/:id",
    "routeName": "sales-payment-detail",
    "component": "src/views/sales/PaymentDetail.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.7",
    "chapterTitle": "Customer Payment Settlement",
    "checkpointsCount": 38,
    "checkpoints": [
      {
        "checkpointId": "M3-R95-H1",
        "elementCategory": "header",
        "label": "Payment Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-H2",
        "elementCategory": "header",
        "label": "Record Payment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-H3",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-H4",
        "elementCategory": "header",
        "label": "Receipt",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-H5",
        "elementCategory": "header",
        "label": "Posted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-T2",
        "elementCategory": "tab",
        "label": "Allocation",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-T3",
        "elementCategory": "tab",
        "label": "Bank Details",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-T4",
        "elementCategory": "tab",
        "label": "Customer Account",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-T5",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K1",
        "elementCategory": "kpi",
        "label": "Payment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K2",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K3",
        "elementCategory": "kpi",
        "label": "Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K4",
        "elementCategory": "kpi",
        "label": "Amount",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K5",
        "elementCategory": "kpi",
        "label": "Order Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K6",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K7",
        "elementCategory": "kpi",
        "label": "Applied Invoice",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K8",
        "elementCategory": "kpi",
        "label": "Total Order Value",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K9",
        "elementCategory": "kpi",
        "label": "Payment Allocation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K10",
        "elementCategory": "kpi",
        "label": "Unallocated Funds",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K11",
        "elementCategory": "kpi",
        "label": "Remaining Balance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K12",
        "elementCategory": "kpi",
        "label": "Allocation Rule",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K13",
        "elementCategory": "kpi",
        "label": "Deposit Account",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K14",
        "elementCategory": "kpi",
        "label": "Transaction Slip",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K15",
        "elementCategory": "kpi",
        "label": "Bank Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K16",
        "elementCategory": "kpi",
        "label": "Clearing Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K17",
        "elementCategory": "kpi",
        "label": "Bank Fee / Charges",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K18",
        "elementCategory": "kpi",
        "label": "Reconciliation State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K19",
        "elementCategory": "kpi",
        "label": "Account Holder",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K20",
        "elementCategory": "kpi",
        "label": "Total Lifetime Orders",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K21",
        "elementCategory": "kpi",
        "label": "Credit Limit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K22",
        "elementCategory": "kpi",
        "label": "Current Receivables",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K23",
        "elementCategory": "kpi",
        "label": "Payment Reliability",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K24",
        "elementCategory": "kpi",
        "label": "Branch Account",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-K25",
        "elementCategory": "kpi",
        "label": "10:45",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-B1",
        "elementCategory": "button",
        "actionName": "Back to Payments",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-B2",
        "elementCategory": "button",
        "actionName": "Back to List",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R95-B3",
        "elementCategory": "button",
        "actionName": "Record Payment",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/customers",
    "routeName": "sales-customers",
    "component": "src/views/sales/Customers.vue",
    "stageId": "M2",
    "stageTitle": "Customer Arrival, Walk-In Leads & NADRA KYC Verification",
    "chapter": "2.3",
    "chapterTitle": "Customer Registration & CNIC KYC",
    "checkpointsCount": 22,
    "checkpoints": [
      {
        "checkpointId": "M2-R96-H1",
        "elementCategory": "header",
        "label": "Customers",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-H2",
        "elementCategory": "header",
        "label": "Add Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-H3",
        "elementCategory": "header",
        "label": "Branch Customers",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-T2",
        "elementCategory": "tab",
        "label": "Reset Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-T3",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-K1",
        "elementCategory": "kpi",
        "label": "Customers",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-K2",
        "elementCategory": "kpi",
        "label": "Repeat Buyers",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-K3",
        "elementCategory": "kpi",
        "label": "Outstanding",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-K4",
        "elementCategory": "kpi",
        "label": "Follow-ups",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-K5",
        "elementCategory": "kpi",
        "label": "New This Month",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-K6",
        "elementCategory": "kpi",
        "label": "Receivables",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-K7",
        "elementCategory": "kpi",
        "label": "Owned Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-TBL1",
        "elementCategory": "table",
        "columns": [
          "Customer",
          "Name",
          "Phone",
          "Orders",
          "Outstanding",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-TBL2",
        "elementCategory": "table",
        "columns": [
          "Customer",
          "Phone",
          "Branch",
          "Orders",
          "Owned Units",
          "Lifetime Value",
          "Balance",
          "Last Activity",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-B1",
        "elementCategory": "button",
        "actionName": "Add Customer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-B2",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-B4",
        "elementCategory": "button",
        "actionName": "Open ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R96-B5",
        "elementCategory": "button",
        "actionName": "Open &rarr;",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/customers/create",
    "routeName": "sales-create-customer",
    "component": "src/views/sales/CreateCustomer.vue",
    "stageId": "M2",
    "stageTitle": "Customer Arrival, Walk-In Leads & NADRA KYC Verification",
    "chapter": "2.3",
    "chapterTitle": "Customer Registration & CNIC KYC",
    "checkpointsCount": 12,
    "checkpoints": [
      {
        "checkpointId": "M2-R97-H1",
        "elementCategory": "header",
        "label": "Address & Classification",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R97-F1",
        "elementCategory": "field",
        "fieldName": "formData.firstName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R97-F2",
        "elementCategory": "field",
        "fieldName": "formData.lastName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R97-F3",
        "elementCategory": "field",
        "fieldName": "formData.phone",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R97-F4",
        "elementCategory": "field",
        "fieldName": "formData.email",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R97-F5",
        "elementCategory": "field",
        "fieldName": "formData.cnic",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R97-F6",
        "elementCategory": "field",
        "fieldName": "formData.address",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R97-F7",
        "elementCategory": "field",
        "fieldName": "formData.city",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R97-F8",
        "elementCategory": "field",
        "fieldName": "formData.branch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R97-F9",
        "elementCategory": "field",
        "fieldName": "formData.status",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R97-F10",
        "elementCategory": "field",
        "fieldName": "formData.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R97-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/customers/detail",
    "routeName": "sales-customer-detail-legacy",
    "component": "src/views/sales/CustomerDetail.vue",
    "stageId": "M2",
    "stageTitle": "Customer Arrival, Walk-In Leads & NADRA KYC Verification",
    "chapter": "2.3",
    "chapterTitle": "Customer Registration & CNIC KYC",
    "checkpointsCount": 39,
    "checkpoints": [
      {
        "checkpointId": "M2-R98-H1",
        "elementCategory": "header",
        "label": "Branch Manager",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-H2",
        "elementCategory": "header",
        "label": "Super Admin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-H3",
        "elementCategory": "header",
        "label": "Customer Code",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-H4",
        "elementCategory": "header",
        "label": "Primary Phone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-H5",
        "elementCategory": "header",
        "label": "Email Address",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-T2",
        "elementCategory": "tab",
        "label": "Contact & Profile",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-T3",
        "elementCategory": "tab",
        "label": "Orders & Purchases",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-T4",
        "elementCategory": "tab",
        "label": "Invoices",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-T5",
        "elementCategory": "tab",
        "label": "Payments",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-T6",
        "elementCategory": "tab",
        "label": "Owned Vehicles",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-T7",
        "elementCategory": "tab",
        "label": "Warranty & Service",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-T8",
        "elementCategory": "tab",
        "label": "Leads & Inquiries",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-T9",
        "elementCategory": "tab",
        "label": "Documents & Notes",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-T10",
        "elementCategory": "tab",
        "label": "Activity & Timeline",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-TBL1",
        "elementCategory": "table",
        "columns": [
          "Order Number",
          "Date",
          "Vehicle / Model",
          "Total Amount",
          "Paid Amount",
          "Balance",
          "Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-TBL2",
        "elementCategory": "table",
        "columns": [
          "Invoice Number",
          "Issue Date",
          "Due Date",
          "Total Amount",
          "Paid Amount",
          "Outstanding",
          "Payment Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-TBL3",
        "elementCategory": "table",
        "columns": [
          "Receipt / Payment #",
          "Linked Order",
          "Amount Cleared",
          "Payment Method",
          "Date",
          "Reference / Slip",
          "Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-TBL4",
        "elementCategory": "table",
        "columns": [
          "Chassis / VIN",
          "Product Model",
          "Branch Location",
          "Handover Date",
          "Warranty Coverage",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B1",
        "elementCategory": "button",
        "actionName": "Back to Customers",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B2",
        "elementCategory": "button",
        "actionName": "Edit Customer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B3",
        "elementCategory": "button",
        "actionName": "New Quote",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B4",
        "elementCategory": "button",
        "actionName": "Create Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B5",
        "elementCategory": "button",
        "actionName": "Edit Profile",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B6",
        "elementCategory": "button",
        "actionName": "+ New Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B7",
        "elementCategory": "button",
        "actionName": "+ Record Payment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B8",
        "elementCategory": "button",
        "actionName": "Create New Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B9",
        "elementCategory": "button",
        "actionName": "View Order ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B10",
        "elementCategory": "button",
        "actionName": "Create First Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B11",
        "elementCategory": "button",
        "actionName": "Go to Invoices Hub",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B12",
        "elementCategory": "button",
        "actionName": "View Invoice ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B13",
        "elementCategory": "button",
        "actionName": "Record Payment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B14",
        "elementCategory": "button",
        "actionName": "View Receipt ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B15",
        "elementCategory": "button",
        "actionName": "Record First Payment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B16",
        "elementCategory": "button",
        "actionName": "View Vehicle ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B17",
        "elementCategory": "button",
        "actionName": "Warranty Certificate ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B18",
        "elementCategory": "button",
        "actionName": "+ Log Service Case",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B19",
        "elementCategory": "button",
        "actionName": "View Job Card ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R98-B20",
        "elementCategory": "button",
        "actionName": "View Lead ›",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/customers/:id",
    "routeName": "sales-customer-detail",
    "component": "src/views/sales/CustomerDetail.vue",
    "stageId": "M2",
    "stageTitle": "Customer Arrival, Walk-In Leads & NADRA KYC Verification",
    "chapter": "2.3",
    "chapterTitle": "Customer Registration & CNIC KYC",
    "checkpointsCount": 39,
    "checkpoints": [
      {
        "checkpointId": "M2-R99-H1",
        "elementCategory": "header",
        "label": "Branch Manager",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-H2",
        "elementCategory": "header",
        "label": "Super Admin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-H3",
        "elementCategory": "header",
        "label": "Customer Code",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-H4",
        "elementCategory": "header",
        "label": "Primary Phone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-H5",
        "elementCategory": "header",
        "label": "Email Address",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-T2",
        "elementCategory": "tab",
        "label": "Contact & Profile",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-T3",
        "elementCategory": "tab",
        "label": "Orders & Purchases",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-T4",
        "elementCategory": "tab",
        "label": "Invoices",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-T5",
        "elementCategory": "tab",
        "label": "Payments",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-T6",
        "elementCategory": "tab",
        "label": "Owned Vehicles",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-T7",
        "elementCategory": "tab",
        "label": "Warranty & Service",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-T8",
        "elementCategory": "tab",
        "label": "Leads & Inquiries",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-T9",
        "elementCategory": "tab",
        "label": "Documents & Notes",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-T10",
        "elementCategory": "tab",
        "label": "Activity & Timeline",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-TBL1",
        "elementCategory": "table",
        "columns": [
          "Order Number",
          "Date",
          "Vehicle / Model",
          "Total Amount",
          "Paid Amount",
          "Balance",
          "Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-TBL2",
        "elementCategory": "table",
        "columns": [
          "Invoice Number",
          "Issue Date",
          "Due Date",
          "Total Amount",
          "Paid Amount",
          "Outstanding",
          "Payment Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-TBL3",
        "elementCategory": "table",
        "columns": [
          "Receipt / Payment #",
          "Linked Order",
          "Amount Cleared",
          "Payment Method",
          "Date",
          "Reference / Slip",
          "Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-TBL4",
        "elementCategory": "table",
        "columns": [
          "Chassis / VIN",
          "Product Model",
          "Branch Location",
          "Handover Date",
          "Warranty Coverage",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B1",
        "elementCategory": "button",
        "actionName": "Back to Customers",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B2",
        "elementCategory": "button",
        "actionName": "Edit Customer",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B3",
        "elementCategory": "button",
        "actionName": "New Quote",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B4",
        "elementCategory": "button",
        "actionName": "Create Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B5",
        "elementCategory": "button",
        "actionName": "Edit Profile",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B6",
        "elementCategory": "button",
        "actionName": "+ New Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B7",
        "elementCategory": "button",
        "actionName": "+ Record Payment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B8",
        "elementCategory": "button",
        "actionName": "Create New Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B9",
        "elementCategory": "button",
        "actionName": "View Order ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B10",
        "elementCategory": "button",
        "actionName": "Create First Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B11",
        "elementCategory": "button",
        "actionName": "Go to Invoices Hub",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B12",
        "elementCategory": "button",
        "actionName": "View Invoice ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B13",
        "elementCategory": "button",
        "actionName": "Record Payment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B14",
        "elementCategory": "button",
        "actionName": "View Receipt ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B15",
        "elementCategory": "button",
        "actionName": "Record First Payment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B16",
        "elementCategory": "button",
        "actionName": "View Vehicle ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B17",
        "elementCategory": "button",
        "actionName": "Warranty Certificate ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B18",
        "elementCategory": "button",
        "actionName": "+ Log Service Case",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B19",
        "elementCategory": "button",
        "actionName": "View Job Card ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R99-B20",
        "elementCategory": "button",
        "actionName": "View Lead ›",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/leads",
    "routeName": "sales-leads",
    "component": "src/views/sales/Leads.vue",
    "stageId": "M2",
    "stageTitle": "Customer Arrival, Walk-In Leads & NADRA KYC Verification",
    "chapter": "2.1",
    "chapterTitle": "Walk-In Prospect Intake",
    "checkpointsCount": 25,
    "checkpoints": [
      {
        "checkpointId": "M2-R100-H1",
        "elementCategory": "header",
        "label": "Leads & Inquiries",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-H2",
        "elementCategory": "header",
        "label": "Add Lead",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-H3",
        "elementCategory": "header",
        "label": "Branch Leads",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-T3",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-T4",
        "elementCategory": "tab",
        "label": "Reset all filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-T5",
        "elementCategory": "tab",
        "label": "All",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-T6",
        "elementCategory": "tab",
        "label": "New",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-T7",
        "elementCategory": "tab",
        "label": "Contacted",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-T8",
        "elementCategory": "tab",
        "label": "Qualified",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-T9",
        "elementCategory": "tab",
        "label": "Quoted",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-T10",
        "elementCategory": "tab",
        "label": "Converted",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-K1",
        "elementCategory": "kpi",
        "label": "New",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-K2",
        "elementCategory": "kpi",
        "label": "Contacted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-K3",
        "elementCategory": "kpi",
        "label": "Quoted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-K4",
        "elementCategory": "kpi",
        "label": "Overdue",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-TBL1",
        "elementCategory": "table",
        "columns": [
          "Lead",
          "Name",
          "Source",
          "Interest",
          "Branch",
          "Owner",
          "Stage",
          "Next Follow-up",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-F2",
        "elementCategory": "field",
        "fieldName": "col.visible",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-F3",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-B1",
        "elementCategory": "button",
        "actionName": "Add Lead",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-B2",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R100-B4",
        "elementCategory": "button",
        "actionName": "View",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/leads/create",
    "routeName": "sales-create-lead",
    "component": "src/views/sales/CreateLead.vue",
    "stageId": "M2",
    "stageTitle": "Customer Arrival, Walk-In Leads & NADRA KYC Verification",
    "chapter": "2.1",
    "chapterTitle": "Walk-In Prospect Intake",
    "checkpointsCount": 14,
    "checkpoints": [
      {
        "checkpointId": "M2-R101-H1",
        "elementCategory": "header",
        "label": "Lead Information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-H2",
        "elementCategory": "header",
        "label": "Assignment & Scope",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-H3",
        "elementCategory": "header",
        "label": "Opportunity",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-H4",
        "elementCategory": "header",
        "label": "Follow-up Timeline",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-F1",
        "elementCategory": "field",
        "fieldName": "formData.name",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-F2",
        "elementCategory": "field",
        "fieldName": "formData.phone",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-F3",
        "elementCategory": "field",
        "fieldName": "formData.source",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-F4",
        "elementCategory": "field",
        "fieldName": "formData.branch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-F5",
        "elementCategory": "field",
        "fieldName": "formData.owner",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-F6",
        "elementCategory": "field",
        "fieldName": "formData.stage",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-F7",
        "elementCategory": "field",
        "fieldName": "formData.product",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-F8",
        "elementCategory": "field",
        "fieldName": "formData.budget",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-F9",
        "elementCategory": "field",
        "fieldName": "formData.nextFollowUp",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R101-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/leads/detail",
    "routeName": "sales-lead-detail-legacy",
    "component": "src/views/sales/LeadDetail.vue",
    "stageId": "M2",
    "stageTitle": "Customer Arrival, Walk-In Leads & NADRA KYC Verification",
    "chapter": "2.1",
    "chapterTitle": "Walk-In Prospect Intake",
    "checkpointsCount": 34,
    "checkpoints": [
      {
        "checkpointId": "M2-R102-H1",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-H2",
        "elementCategory": "header",
        "label": "Next Action",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-H3",
        "elementCategory": "header",
        "label": "Call today",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-H4",
        "elementCategory": "header",
        "label": "Quotation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-H5",
        "elementCategory": "header",
        "label": "Not created",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K1",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K2",
        "elementCategory": "kpi",
        "label": "Phone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K3",
        "elementCategory": "kpi",
        "label": "Desired Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K4",
        "elementCategory": "kpi",
        "label": "Budget",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K5",
        "elementCategory": "kpi",
        "label": "Source",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K6",
        "elementCategory": "kpi",
        "label": "Owner",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K7",
        "elementCategory": "kpi",
        "label": "Phone Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K8",
        "elementCategory": "kpi",
        "label": "Email Address",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K9",
        "elementCategory": "kpi",
        "label": "City",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K10",
        "elementCategory": "kpi",
        "label": "Preferred Channel",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K11",
        "elementCategory": "kpi",
        "label": "Preferred Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K12",
        "elementCategory": "kpi",
        "label": "Alt Phone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K13",
        "elementCategory": "kpi",
        "label": "Latest Message",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K14",
        "elementCategory": "kpi",
        "label": "Received Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K15",
        "elementCategory": "kpi",
        "label": "Communication Channel",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K16",
        "elementCategory": "kpi",
        "label": "Assigned Agent",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K17",
        "elementCategory": "kpi",
        "label": "Auto-reply Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K18",
        "elementCategory": "kpi",
        "label": "Read Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K19",
        "elementCategory": "kpi",
        "label": "Next Scheduled Action",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K20",
        "elementCategory": "kpi",
        "label": "Assigned Representative",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K21",
        "elementCategory": "kpi",
        "label": "Discussion Focus",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K22",
        "elementCategory": "kpi",
        "label": "Priority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K23",
        "elementCategory": "kpi",
        "label": "Last Contact Attempt",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K24",
        "elementCategory": "kpi",
        "label": "Target Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-K25",
        "elementCategory": "kpi",
        "label": "Quotation Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-B1",
        "elementCategory": "button",
        "actionName": "Edit Lead",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-B2",
        "elementCategory": "button",
        "actionName": "More",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-B3",
        "elementCategory": "button",
        "actionName": "Create Quotation",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R102-B4",
        "elementCategory": "button",
        "actionName": "Convert to Customer",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/leads/:id",
    "routeName": "sales-lead-detail",
    "component": "src/views/sales/LeadDetail.vue",
    "stageId": "M2",
    "stageTitle": "Customer Arrival, Walk-In Leads & NADRA KYC Verification",
    "chapter": "2.1",
    "chapterTitle": "Walk-In Prospect Intake",
    "checkpointsCount": 34,
    "checkpoints": [
      {
        "checkpointId": "M2-R103-H1",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-H2",
        "elementCategory": "header",
        "label": "Next Action",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-H3",
        "elementCategory": "header",
        "label": "Call today",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-H4",
        "elementCategory": "header",
        "label": "Quotation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-H5",
        "elementCategory": "header",
        "label": "Not created",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K1",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K2",
        "elementCategory": "kpi",
        "label": "Phone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K3",
        "elementCategory": "kpi",
        "label": "Desired Product",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K4",
        "elementCategory": "kpi",
        "label": "Budget",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K5",
        "elementCategory": "kpi",
        "label": "Source",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K6",
        "elementCategory": "kpi",
        "label": "Owner",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K7",
        "elementCategory": "kpi",
        "label": "Phone Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K8",
        "elementCategory": "kpi",
        "label": "Email Address",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K9",
        "elementCategory": "kpi",
        "label": "City",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K10",
        "elementCategory": "kpi",
        "label": "Preferred Channel",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K11",
        "elementCategory": "kpi",
        "label": "Preferred Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K12",
        "elementCategory": "kpi",
        "label": "Alt Phone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K13",
        "elementCategory": "kpi",
        "label": "Latest Message",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K14",
        "elementCategory": "kpi",
        "label": "Received Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K15",
        "elementCategory": "kpi",
        "label": "Communication Channel",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K16",
        "elementCategory": "kpi",
        "label": "Assigned Agent",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K17",
        "elementCategory": "kpi",
        "label": "Auto-reply Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K18",
        "elementCategory": "kpi",
        "label": "Read Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K19",
        "elementCategory": "kpi",
        "label": "Next Scheduled Action",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K20",
        "elementCategory": "kpi",
        "label": "Assigned Representative",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K21",
        "elementCategory": "kpi",
        "label": "Discussion Focus",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K22",
        "elementCategory": "kpi",
        "label": "Priority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K23",
        "elementCategory": "kpi",
        "label": "Last Contact Attempt",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K24",
        "elementCategory": "kpi",
        "label": "Target Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-K25",
        "elementCategory": "kpi",
        "label": "Quotation Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-B1",
        "elementCategory": "button",
        "actionName": "Edit Lead",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-B2",
        "elementCategory": "button",
        "actionName": "More",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-B3",
        "elementCategory": "button",
        "actionName": "Create Quotation",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R103-B4",
        "elementCategory": "button",
        "actionName": "Convert to Customer",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/follow-ups",
    "routeName": "sales-follow-ups",
    "component": "src/views/sales/FollowUps.vue",
    "stageId": "M2",
    "stageTitle": "Customer Arrival, Walk-In Leads & NADRA KYC Verification",
    "chapter": "2.2",
    "chapterTitle": "Test Drive & Prospect Follow-Ups",
    "checkpointsCount": 25,
    "checkpoints": [
      {
        "checkpointId": "M2-R104-H1",
        "elementCategory": "header",
        "label": "Follow-ups",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-H2",
        "elementCategory": "header",
        "label": "Follow-up",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-H3",
        "elementCategory": "header",
        "label": "Customer Follow-ups",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-H4",
        "elementCategory": "header",
        "label": "Schedule Follow-up",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-T2",
        "elementCategory": "tab",
        "label": "Reset Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-T3",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-T4",
        "elementCategory": "tab",
        "label": "All",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-T5",
        "elementCategory": "tab",
        "label": "Today",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-T6",
        "elementCategory": "tab",
        "label": "Upcoming",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-T7",
        "elementCategory": "tab",
        "label": "Overdue",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-T8",
        "elementCategory": "tab",
        "label": "Completed",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-K1",
        "elementCategory": "kpi",
        "label": "Today",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-K2",
        "elementCategory": "kpi",
        "label": "Overdue",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-K3",
        "elementCategory": "kpi",
        "label": "Upcoming",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-K4",
        "elementCategory": "kpi",
        "label": "Completed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-TBL1",
        "elementCategory": "table",
        "columns": [
          "Customer",
          "Linked Record",
          "Owner",
          "Due",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-TBL2",
        "elementCategory": "table",
        "columns": [
          "Due",
          "Customer / Lead",
          "Type",
          "Branch",
          "Owner",
          "Priority",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-B1",
        "elementCategory": "button",
        "actionName": "Follow-up",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-B2",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-B4",
        "elementCategory": "button",
        "actionName": "Open ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R104-B5",
        "elementCategory": "button",
        "actionName": "Schedule Follow-up",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/follow-ups/create",
    "routeName": "sales-create-follow-up",
    "component": "src/views/sales/CreateFollowUp.vue",
    "stageId": "M2",
    "stageTitle": "Customer Arrival, Walk-In Leads & NADRA KYC Verification",
    "chapter": "2.2",
    "chapterTitle": "Test Drive & Prospect Follow-Ups",
    "checkpointsCount": 14,
    "checkpoints": [
      {
        "checkpointId": "M2-R105-H1",
        "elementCategory": "header",
        "label": "Follow-up Details",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-H2",
        "elementCategory": "header",
        "label": "Assignment & Timeline",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-F1",
        "elementCategory": "field",
        "fieldName": "form.customer",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-F2",
        "elementCategory": "field",
        "fieldName": "form.linkedRecord",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-F3",
        "elementCategory": "field",
        "fieldName": "form.taskType",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-F4",
        "elementCategory": "field",
        "fieldName": "form.priority",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-F5",
        "elementCategory": "field",
        "fieldName": "form.channel",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-F6",
        "elementCategory": "field",
        "fieldName": "form.owner",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-F7",
        "elementCategory": "field",
        "fieldName": "form.branch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-F8",
        "elementCategory": "field",
        "fieldName": "form.dueDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-F9",
        "elementCategory": "field",
        "fieldName": "form.dueTime",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-F10",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-F11",
        "elementCategory": "field",
        "fieldName": "reminder",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R105-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/follow-ups/detail",
    "routeName": "sales-follow-up-detail-legacy",
    "component": "src/views/sales/FollowUpDetail.vue",
    "stageId": "M2",
    "stageTitle": "Customer Arrival, Walk-In Leads & NADRA KYC Verification",
    "chapter": "2.2",
    "chapterTitle": "Test Drive & Prospect Follow-Ups",
    "checkpointsCount": 35,
    "checkpoints": [
      {
        "checkpointId": "M2-R106-H1",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-H2",
        "elementCategory": "header",
        "label": "Owner",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-H3",
        "elementCategory": "header",
        "label": "Hamza",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-H4",
        "elementCategory": "header",
        "label": "Due",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-H5",
        "elementCategory": "header",
        "label": "Priority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-T2",
        "elementCategory": "tab",
        "label": "Linked Record",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-T3",
        "elementCategory": "tab",
        "label": "Customer",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-T4",
        "elementCategory": "tab",
        "label": "Notes & Actions",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-T5",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K1",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K2",
        "elementCategory": "kpi",
        "label": "Linked Record",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K3",
        "elementCategory": "kpi",
        "label": "Owner",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K4",
        "elementCategory": "kpi",
        "label": "Due",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K5",
        "elementCategory": "kpi",
        "label": "Priority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K6",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K7",
        "elementCategory": "kpi",
        "label": "Record Type",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K8",
        "elementCategory": "kpi",
        "label": "Interested / Assigned Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K9",
        "elementCategory": "kpi",
        "label": "Financial Value",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K10",
        "elementCategory": "kpi",
        "label": "Outstanding Balance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K11",
        "elementCategory": "kpi",
        "label": "Operational Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K12",
        "elementCategory": "kpi",
        "label": "Allocated Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K13",
        "elementCategory": "kpi",
        "label": "Customer ID",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K14",
        "elementCategory": "kpi",
        "label": "Phone Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K15",
        "elementCategory": "kpi",
        "label": "Total Orders",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K16",
        "elementCategory": "kpi",
        "label": "Lifetime Sales",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K17",
        "elementCategory": "kpi",
        "label": "Preferred Channel",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K18",
        "elementCategory": "kpi",
        "label": "Account Standing",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K19",
        "elementCategory": "kpi",
        "label": "Task Objective",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K20",
        "elementCategory": "kpi",
        "label": "Last Outreach",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K21",
        "elementCategory": "kpi",
        "label": "Next Step",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K22",
        "elementCategory": "kpi",
        "label": "Assigned Staff",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K23",
        "elementCategory": "kpi",
        "label": "Escalation Tier",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K24",
        "elementCategory": "kpi",
        "label": "Target Completion",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R106-K25",
        "elementCategory": "kpi",
        "label": "Today 09:00",
        "trainingType": "observe",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/follow-ups/:id",
    "routeName": "sales-follow-up-detail",
    "component": "src/views/sales/FollowUpDetail.vue",
    "stageId": "M2",
    "stageTitle": "Customer Arrival, Walk-In Leads & NADRA KYC Verification",
    "chapter": "2.2",
    "chapterTitle": "Test Drive & Prospect Follow-Ups",
    "checkpointsCount": 35,
    "checkpoints": [
      {
        "checkpointId": "M2-R107-H1",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-H2",
        "elementCategory": "header",
        "label": "Owner",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-H3",
        "elementCategory": "header",
        "label": "Hamza",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-H4",
        "elementCategory": "header",
        "label": "Due",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-H5",
        "elementCategory": "header",
        "label": "Priority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-T1",
        "elementCategory": "tab",
        "label": "Overview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-T2",
        "elementCategory": "tab",
        "label": "Linked Record",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-T3",
        "elementCategory": "tab",
        "label": "Customer",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-T4",
        "elementCategory": "tab",
        "label": "Notes & Actions",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-T5",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K1",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K2",
        "elementCategory": "kpi",
        "label": "Linked Record",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K3",
        "elementCategory": "kpi",
        "label": "Owner",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K4",
        "elementCategory": "kpi",
        "label": "Due",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K5",
        "elementCategory": "kpi",
        "label": "Priority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K6",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K7",
        "elementCategory": "kpi",
        "label": "Record Type",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K8",
        "elementCategory": "kpi",
        "label": "Interested / Assigned Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K9",
        "elementCategory": "kpi",
        "label": "Financial Value",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K10",
        "elementCategory": "kpi",
        "label": "Outstanding Balance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K11",
        "elementCategory": "kpi",
        "label": "Operational Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K12",
        "elementCategory": "kpi",
        "label": "Allocated Branch",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K13",
        "elementCategory": "kpi",
        "label": "Customer ID",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K14",
        "elementCategory": "kpi",
        "label": "Phone Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K15",
        "elementCategory": "kpi",
        "label": "Total Orders",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K16",
        "elementCategory": "kpi",
        "label": "Lifetime Sales",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K17",
        "elementCategory": "kpi",
        "label": "Preferred Channel",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K18",
        "elementCategory": "kpi",
        "label": "Account Standing",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K19",
        "elementCategory": "kpi",
        "label": "Task Objective",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K20",
        "elementCategory": "kpi",
        "label": "Last Outreach",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K21",
        "elementCategory": "kpi",
        "label": "Next Step",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K22",
        "elementCategory": "kpi",
        "label": "Assigned Staff",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K23",
        "elementCategory": "kpi",
        "label": "Escalation Tier",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K24",
        "elementCategory": "kpi",
        "label": "Target Completion",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M2-R107-K25",
        "elementCategory": "kpi",
        "label": "Today 09:00",
        "trainingType": "observe",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/custom-orders",
    "routeName": "sales-custom-orders",
    "component": "src/views/sales/CustomOrders.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.5",
    "chapterTitle": "Custom Fleet & Corporate Orders",
    "checkpointsCount": 22,
    "checkpoints": [
      {
        "checkpointId": "M3-R108-H1",
        "elementCategory": "header",
        "label": "Custom Orders",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-H2",
        "elementCategory": "header",
        "label": "Custom Order",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-H3",
        "elementCategory": "header",
        "label": "Columns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-H4",
        "elementCategory": "header",
        "label": "Export",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-H5",
        "elementCategory": "header",
        "label": "Custom Orders / Reservations",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-T2",
        "elementCategory": "tab",
        "label": "Reset Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-T3",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-K1",
        "elementCategory": "kpi",
        "label": "Open",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-K2",
        "elementCategory": "kpi",
        "label": "Deposits",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-K3",
        "elementCategory": "kpi",
        "label": "Arriving",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-K4",
        "elementCategory": "kpi",
        "label": "Ready",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-TBL1",
        "elementCategory": "table",
        "columns": [
          "Custom Order",
          "Customer",
          "Requirement",
          "Deposit",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-TBL2",
        "elementCategory": "table",
        "columns": [
          "Order",
          "Customer",
          "Branch",
          "Product",
          "Deposit",
          "Total",
          "ETA",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-B1",
        "elementCategory": "button",
        "actionName": "Custom Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-B2",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-B4",
        "elementCategory": "button",
        "actionName": "Open ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-B5",
        "elementCategory": "button",
        "actionName": "Create Custom Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R108-B6",
        "elementCategory": "button",
        "actionName": "Open &rarr;",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/custom-orders/create",
    "routeName": "sales-create-custom-order",
    "component": "src/views/sales/CreateCustomOrder.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.5",
    "chapterTitle": "Custom Fleet & Corporate Orders",
    "checkpointsCount": 13,
    "checkpoints": [
      {
        "checkpointId": "M3-R109-H1",
        "elementCategory": "header",
        "label": "Requirement & Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R109-H2",
        "elementCategory": "header",
        "label": "Commercial & Reservation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R109-F1",
        "elementCategory": "field",
        "fieldName": "form.customer",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R109-F2",
        "elementCategory": "field",
        "fieldName": "form.product",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R109-F3",
        "elementCategory": "field",
        "fieldName": "form.budget",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R109-F4",
        "elementCategory": "field",
        "fieldName": "form.desiredDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R109-F5",
        "elementCategory": "field",
        "fieldName": "form.deposit",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R109-F6",
        "elementCategory": "field",
        "fieldName": "form.paymentMethod",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R109-F7",
        "elementCategory": "field",
        "fieldName": "form.transactionId",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R109-F8",
        "elementCategory": "field",
        "fieldName": "form.status",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R109-F9",
        "elementCategory": "field",
        "fieldName": "form.reservation",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R109-F10",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R109-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/custom-orders/detail",
    "routeName": "sales-custom-order-detail-legacy",
    "component": "src/views/sales/CustomOrderDetail.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.5",
    "chapterTitle": "Custom Fleet & Corporate Orders",
    "checkpointsCount": 17,
    "checkpoints": [
      {
        "checkpointId": "M3-R110-H1",
        "elementCategory": "header",
        "label": "Requirement",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-H2",
        "elementCategory": "header",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-H3",
        "elementCategory": "header",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-H4",
        "elementCategory": "header",
        "label": "Budget",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-H5",
        "elementCategory": "header",
        "label": "Deposit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-T1",
        "elementCategory": "tab",
        "label": "Requirement",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-T2",
        "elementCategory": "tab",
        "label": "Customer",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-T3",
        "elementCategory": "tab",
        "label": "Deposit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-T4",
        "elementCategory": "tab",
        "label": "Product or Product Request",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-T5",
        "elementCategory": "tab",
        "label": "Stock Request",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-T6",
        "elementCategory": "tab",
        "label": "Arrival",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-T7",
        "elementCategory": "tab",
        "label": "Reservation",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-T8",
        "elementCategory": "tab",
        "label": "Sale",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-T9",
        "elementCategory": "tab",
        "label": "Communication",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-T10",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-B1",
        "elementCategory": "button",
        "actionName": "Update Custom Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R110-B2",
        "elementCategory": "button",
        "actionName": "More",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/custom-orders/:id",
    "routeName": "sales-custom-order-detail",
    "component": "src/views/sales/CustomOrderDetail.vue",
    "stageId": "M3",
    "stageTitle": "Commercial Pricing, Quotations, POS Booking & Invoicing",
    "chapter": "3.5",
    "chapterTitle": "Custom Fleet & Corporate Orders",
    "checkpointsCount": 17,
    "checkpoints": [
      {
        "checkpointId": "M3-R111-H1",
        "elementCategory": "header",
        "label": "Requirement",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-H2",
        "elementCategory": "header",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-H3",
        "elementCategory": "header",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-H4",
        "elementCategory": "header",
        "label": "Budget",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-H5",
        "elementCategory": "header",
        "label": "Deposit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-T1",
        "elementCategory": "tab",
        "label": "Requirement",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-T2",
        "elementCategory": "tab",
        "label": "Customer",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-T3",
        "elementCategory": "tab",
        "label": "Deposit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-T4",
        "elementCategory": "tab",
        "label": "Product or Product Request",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-T5",
        "elementCategory": "tab",
        "label": "Stock Request",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-T6",
        "elementCategory": "tab",
        "label": "Arrival",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-T7",
        "elementCategory": "tab",
        "label": "Reservation",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-T8",
        "elementCategory": "tab",
        "label": "Sale",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-T9",
        "elementCategory": "tab",
        "label": "Communication",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-T10",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-B1",
        "elementCategory": "button",
        "actionName": "Update Custom Order",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M3-R111-B2",
        "elementCategory": "button",
        "actionName": "More",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/delivery",
    "routeName": "sales-delivery",
    "component": "src/views/sales/DeliveryHandover.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 21,
    "checkpoints": [
      {
        "checkpointId": "M8-R112-H1",
        "elementCategory": "header",
        "label": "Delivery / Handover",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-H2",
        "elementCategory": "header",
        "label": "Schedule Handover",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-H3",
        "elementCategory": "header",
        "label": "Handover · SO-7731",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-H4",
        "elementCategory": "header",
        "label": "Ready",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-H5",
        "elementCategory": "header",
        "label": "Customer Verification",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-K1",
        "elementCategory": "kpi",
        "label": "Ready Today",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-K2",
        "elementCategory": "kpi",
        "label": "Completed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-K3",
        "elementCategory": "kpi",
        "label": "Documents Pending",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-K4",
        "elementCategory": "kpi",
        "label": "Accessories Check",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-TBL1",
        "elementCategory": "table",
        "columns": [
          "Order",
          "Customer",
          "Unit",
          "Scheduled",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-F2",
        "elementCategory": "field",
        "fieldName": "formData.recipientName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-F3",
        "elementCategory": "field",
        "fieldName": "formData.handoverDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-F4",
        "elementCategory": "field",
        "fieldName": "formData.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-B1",
        "elementCategory": "button",
        "actionName": "Schedule Handover",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-B2",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-B4",
        "elementCategory": "button",
        "actionName": "Open &rsaquo;",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-B5",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R112-B6",
        "elementCategory": "button",
        "actionName": "Complete Handover & Mark Sold",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/delivery/create",
    "routeName": "sales-create-delivery",
    "component": "src/views/sales/CreateDeliveryHandover.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 17,
    "checkpoints": [
      {
        "checkpointId": "M8-R113-H1",
        "elementCategory": "header",
        "label": "Handover & Order Details",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-H2",
        "elementCategory": "header",
        "label": "Pre-delivery Verification Checklist",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-H3",
        "elementCategory": "header",
        "label": "Customer CNIC / Identity verified",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-H4",
        "elementCategory": "header",
        "label": "Payment completed and invoice issued",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-H5",
        "elementCategory": "header",
        "label": "Chassis & Serial numbers verified",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-F1",
        "elementCategory": "field",
        "fieldName": "form.order",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-F2",
        "elementCategory": "field",
        "fieldName": "form.customer",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-F3",
        "elementCategory": "field",
        "fieldName": "form.unit",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-F4",
        "elementCategory": "field",
        "fieldName": "form.scheduled",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-F5",
        "elementCategory": "field",
        "fieldName": "form.status",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-F6",
        "elementCategory": "field",
        "fieldName": "form.identityVerified",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-F7",
        "elementCategory": "field",
        "fieldName": "form.paymentComplete",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-F8",
        "elementCategory": "field",
        "fieldName": "form.chassisVerified",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-F9",
        "elementCategory": "field",
        "fieldName": "form.accessoriesIncluded",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-F10",
        "elementCategory": "field",
        "fieldName": "form.warrantyBriefed",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-F11",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R113-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/delivery/detail",
    "routeName": "sales-delivery-detail-legacy",
    "component": "src/views/sales/DeliveryHandoverDetail.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 33,
    "checkpoints": [
      {
        "checkpointId": "M8-R114-H1",
        "elementCategory": "header",
        "label": "Delivery Handover Record Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-H2",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-H3",
        "elementCategory": "header",
        "label": "Handover Officer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-H4",
        "elementCategory": "header",
        "label": "Scheduled",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-H5",
        "elementCategory": "header",
        "label": "PDI Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K1",
        "elementCategory": "kpi",
        "label": "Delivery ID",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K2",
        "elementCategory": "kpi",
        "label": "Order Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K3",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K4",
        "elementCategory": "kpi",
        "label": "Assigned Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K5",
        "elementCategory": "kpi",
        "label": "Scheduled Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K6",
        "elementCategory": "kpi",
        "label": "Handover Officer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K7",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K8",
        "elementCategory": "kpi",
        "label": "Identity Verification",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K9",
        "elementCategory": "kpi",
        "label": "Financial Settlement",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K10",
        "elementCategory": "kpi",
        "label": "PDI (Pre-Delivery Inspection)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K11",
        "elementCategory": "kpi",
        "label": "Battery Charge Level",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K12",
        "elementCategory": "kpi",
        "label": "Key & Remote Set",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K13",
        "elementCategory": "kpi",
        "label": "Charger & Toolkit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K14",
        "elementCategory": "kpi",
        "label": "Vehicle Model",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K15",
        "elementCategory": "kpi",
        "label": "Chassis Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K16",
        "elementCategory": "kpi",
        "label": "Motor Serial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K17",
        "elementCategory": "kpi",
        "label": "Battery Serial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K18",
        "elementCategory": "kpi",
        "label": "Odometer Reading",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K19",
        "elementCategory": "kpi",
        "label": "Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K20",
        "elementCategory": "kpi",
        "label": "Customer Code",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K21",
        "elementCategory": "kpi",
        "label": "Phone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K22",
        "elementCategory": "kpi",
        "label": "Total Sale Price",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K23",
        "elementCategory": "kpi",
        "label": "Paid Amount",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K24",
        "elementCategory": "kpi",
        "label": "Outstanding Balance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-K25",
        "elementCategory": "kpi",
        "label": "Invoice Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-B1",
        "elementCategory": "button",
        "actionName": "Back to Delivery List",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-B2",
        "elementCategory": "button",
        "actionName": "Back to List",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R114-B3",
        "elementCategory": "button",
        "actionName": "Complete Handover & Activate Warranty",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/delivery/:id",
    "routeName": "sales-delivery-detail",
    "component": "src/views/sales/DeliveryHandoverDetail.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 33,
    "checkpoints": [
      {
        "checkpointId": "M8-R115-H1",
        "elementCategory": "header",
        "label": "Delivery Handover Record Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-H2",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-H3",
        "elementCategory": "header",
        "label": "Handover Officer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-H4",
        "elementCategory": "header",
        "label": "Scheduled",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-H5",
        "elementCategory": "header",
        "label": "PDI Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K1",
        "elementCategory": "kpi",
        "label": "Delivery ID",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K2",
        "elementCategory": "kpi",
        "label": "Order Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K3",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K4",
        "elementCategory": "kpi",
        "label": "Assigned Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K5",
        "elementCategory": "kpi",
        "label": "Scheduled Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K6",
        "elementCategory": "kpi",
        "label": "Handover Officer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K7",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K8",
        "elementCategory": "kpi",
        "label": "Identity Verification",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K9",
        "elementCategory": "kpi",
        "label": "Financial Settlement",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K10",
        "elementCategory": "kpi",
        "label": "PDI (Pre-Delivery Inspection)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K11",
        "elementCategory": "kpi",
        "label": "Battery Charge Level",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K12",
        "elementCategory": "kpi",
        "label": "Key & Remote Set",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K13",
        "elementCategory": "kpi",
        "label": "Charger & Toolkit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K14",
        "elementCategory": "kpi",
        "label": "Vehicle Model",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K15",
        "elementCategory": "kpi",
        "label": "Chassis Number",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K16",
        "elementCategory": "kpi",
        "label": "Motor Serial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K17",
        "elementCategory": "kpi",
        "label": "Battery Serial",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K18",
        "elementCategory": "kpi",
        "label": "Odometer Reading",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K19",
        "elementCategory": "kpi",
        "label": "Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K20",
        "elementCategory": "kpi",
        "label": "Customer Code",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K21",
        "elementCategory": "kpi",
        "label": "Phone",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K22",
        "elementCategory": "kpi",
        "label": "Total Sale Price",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K23",
        "elementCategory": "kpi",
        "label": "Paid Amount",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K24",
        "elementCategory": "kpi",
        "label": "Outstanding Balance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-K25",
        "elementCategory": "kpi",
        "label": "Invoice Reference",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-B1",
        "elementCategory": "button",
        "actionName": "Back to Delivery List",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-B2",
        "elementCategory": "button",
        "actionName": "Back to List",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R115-B3",
        "elementCategory": "button",
        "actionName": "Complete Handover & Activate Warranty",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/returns",
    "routeName": "sales-returns",
    "component": "src/views/sales/Returns.vue",
    "stageId": "M4",
    "stageTitle": "Vehicle Allocation, 18-Point PDI & Delivery Gate Pass",
    "chapter": "4.5",
    "chapterTitle": "Vehicle Returns & Exchanges",
    "checkpointsCount": 22,
    "checkpoints": [
      {
        "checkpointId": "M4-R116-H1",
        "elementCategory": "header",
        "label": "Returns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-H2",
        "elementCategory": "header",
        "label": "Create Return",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-H3",
        "elementCategory": "header",
        "label": "Columns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-H4",
        "elementCategory": "header",
        "label": "Export",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-H5",
        "elementCategory": "header",
        "label": "Branch Returns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-T2",
        "elementCategory": "tab",
        "label": "Clear all filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-T3",
        "elementCategory": "tab",
        "label": "Reset Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-T4",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-K1",
        "elementCategory": "kpi",
        "label": "In Inspection",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-K2",
        "elementCategory": "kpi",
        "label": "Pending Approval",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-K3",
        "elementCategory": "kpi",
        "label": "Exchanges",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-K4",
        "elementCategory": "kpi",
        "label": "Refunds",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-TBL1",
        "elementCategory": "table",
        "columns": [
          "Return",
          "Order",
          "Customer",
          "Unit",
          "Reason",
          "Requested",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-TBL2",
        "elementCategory": "table",
        "columns": [
          "Return",
          "Order",
          "Customer",
          "Unit",
          "Branch",
          "Reason",
          "Requested",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-B1",
        "elementCategory": "button",
        "actionName": "Create Return",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-B2",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-B4",
        "elementCategory": "button",
        "actionName": "Open ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R116-B5",
        "elementCategory": "button",
        "actionName": "Open &rarr;",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/returns/create",
    "routeName": "sales-create-return",
    "component": "src/views/sales/CreateReturn.vue",
    "stageId": "M4",
    "stageTitle": "Vehicle Allocation, 18-Point PDI & Delivery Gate Pass",
    "chapter": "4.5",
    "chapterTitle": "Vehicle Returns & Exchanges",
    "checkpointsCount": 12,
    "checkpoints": [
      {
        "checkpointId": "M4-R117-H1",
        "elementCategory": "header",
        "label": "Original Order & Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R117-H2",
        "elementCategory": "header",
        "label": "Unit & Destination",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R117-H3",
        "elementCategory": "header",
        "label": "Return Reason & Inspection",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R117-F1",
        "elementCategory": "field",
        "fieldName": "formData.orderNo",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R117-F2",
        "elementCategory": "field",
        "fieldName": "formData.customer",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R117-F3",
        "elementCategory": "field",
        "fieldName": "formData.unit",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R117-F4",
        "elementCategory": "field",
        "fieldName": "formData.branch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R117-F5",
        "elementCategory": "field",
        "fieldName": "formData.requested",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R117-F6",
        "elementCategory": "field",
        "fieldName": "formData.reason",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R117-F7",
        "elementCategory": "field",
        "fieldName": "formData.status",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R117-F8",
        "elementCategory": "field",
        "fieldName": "formData.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R117-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/returns/detail",
    "routeName": "sales-return-detail-legacy",
    "component": "src/views/sales/ReturnDetail.vue",
    "stageId": "M4",
    "stageTitle": "Vehicle Allocation, 18-Point PDI & Delivery Gate Pass",
    "chapter": "4.5",
    "chapterTitle": "Vehicle Returns & Exchanges",
    "checkpointsCount": 39,
    "checkpoints": [
      {
        "checkpointId": "M4-R118-H1",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-H2",
        "elementCategory": "header",
        "label": "Inspector",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-H3",
        "elementCategory": "header",
        "label": "Usman",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-H4",
        "elementCategory": "header",
        "label": "Approval",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-H5",
        "elementCategory": "header",
        "label": "Pending",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-T1",
        "elementCategory": "tab",
        "label": "Request",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-T2",
        "elementCategory": "tab",
        "label": "Original Sale",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-T3",
        "elementCategory": "tab",
        "label": "Unit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-T4",
        "elementCategory": "tab",
        "label": "Inspection",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-T5",
        "elementCategory": "tab",
        "label": "Decision",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-T6",
        "elementCategory": "tab",
        "label": "Refund or Exchange",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-T7",
        "elementCategory": "tab",
        "label": "Stock Disposition",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-T8",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-T9",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K1",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K2",
        "elementCategory": "kpi",
        "label": "Original Order",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K3",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K4",
        "elementCategory": "kpi",
        "label": "Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K5",
        "elementCategory": "kpi",
        "label": "Reason",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K6",
        "elementCategory": "kpi",
        "label": "Requested",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K7",
        "elementCategory": "kpi",
        "label": "Sale Amount",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K8",
        "elementCategory": "kpi",
        "label": "Sale Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K9",
        "elementCategory": "kpi",
        "label": "Salesperson",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K10",
        "elementCategory": "kpi",
        "label": "Payment Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K11",
        "elementCategory": "kpi",
        "label": "Branch of Origin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K12",
        "elementCategory": "kpi",
        "label": "Inspected By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K13",
        "elementCategory": "kpi",
        "label": "Battery Capacity",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K14",
        "elementCategory": "kpi",
        "label": "Motor Test",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K15",
        "elementCategory": "kpi",
        "label": "Cosmetic State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K16",
        "elementCategory": "kpi",
        "label": "Warranty Validation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K17",
        "elementCategory": "kpi",
        "label": "Inspection Report",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K18",
        "elementCategory": "kpi",
        "label": "Approval Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K19",
        "elementCategory": "kpi",
        "label": "Approving Authority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K20",
        "elementCategory": "kpi",
        "label": "Branch Recommendation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K21",
        "elementCategory": "kpi",
        "label": "Customer Goodwill",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K22",
        "elementCategory": "kpi",
        "label": "SLA Target",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K23",
        "elementCategory": "kpi",
        "label": "Ledger Authorization",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K24",
        "elementCategory": "kpi",
        "label": "Resolution Path",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R118-K25",
        "elementCategory": "kpi",
        "label": "Replacement Model",
        "trainingType": "observe",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/sales/returns/:id",
    "routeName": "sales-return-detail",
    "component": "src/views/sales/ReturnDetail.vue",
    "stageId": "M4",
    "stageTitle": "Vehicle Allocation, 18-Point PDI & Delivery Gate Pass",
    "chapter": "4.5",
    "chapterTitle": "Vehicle Returns & Exchanges",
    "checkpointsCount": 39,
    "checkpoints": [
      {
        "checkpointId": "M4-R119-H1",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-H2",
        "elementCategory": "header",
        "label": "Inspector",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-H3",
        "elementCategory": "header",
        "label": "Usman",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-H4",
        "elementCategory": "header",
        "label": "Approval",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-H5",
        "elementCategory": "header",
        "label": "Pending",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-T1",
        "elementCategory": "tab",
        "label": "Request",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-T2",
        "elementCategory": "tab",
        "label": "Original Sale",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-T3",
        "elementCategory": "tab",
        "label": "Unit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-T4",
        "elementCategory": "tab",
        "label": "Inspection",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-T5",
        "elementCategory": "tab",
        "label": "Decision",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-T6",
        "elementCategory": "tab",
        "label": "Refund or Exchange",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-T7",
        "elementCategory": "tab",
        "label": "Stock Disposition",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-T8",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-T9",
        "elementCategory": "tab",
        "label": "Activity",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K1",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K2",
        "elementCategory": "kpi",
        "label": "Original Order",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K3",
        "elementCategory": "kpi",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K4",
        "elementCategory": "kpi",
        "label": "Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K5",
        "elementCategory": "kpi",
        "label": "Reason",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K6",
        "elementCategory": "kpi",
        "label": "Requested",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K7",
        "elementCategory": "kpi",
        "label": "Sale Amount",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K8",
        "elementCategory": "kpi",
        "label": "Sale Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K9",
        "elementCategory": "kpi",
        "label": "Salesperson",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K10",
        "elementCategory": "kpi",
        "label": "Payment Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K11",
        "elementCategory": "kpi",
        "label": "Branch of Origin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K12",
        "elementCategory": "kpi",
        "label": "Inspected By",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K13",
        "elementCategory": "kpi",
        "label": "Battery Capacity",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K14",
        "elementCategory": "kpi",
        "label": "Motor Test",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K15",
        "elementCategory": "kpi",
        "label": "Cosmetic State",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K16",
        "elementCategory": "kpi",
        "label": "Warranty Validation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K17",
        "elementCategory": "kpi",
        "label": "Inspection Report",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K18",
        "elementCategory": "kpi",
        "label": "Approval Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K19",
        "elementCategory": "kpi",
        "label": "Approving Authority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K20",
        "elementCategory": "kpi",
        "label": "Branch Recommendation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K21",
        "elementCategory": "kpi",
        "label": "Customer Goodwill",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K22",
        "elementCategory": "kpi",
        "label": "SLA Target",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K23",
        "elementCategory": "kpi",
        "label": "Ledger Authorization",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K24",
        "elementCategory": "kpi",
        "label": "Resolution Path",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M4-R119-K25",
        "elementCategory": "kpi",
        "label": "Replacement Model",
        "trainingType": "observe",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/after-sales/dashboard",
    "routeName": "after-sales-dashboard",
    "component": "src/views/after-sales/AfterSalesDashboard.vue",
    "stageId": "M6",
    "stageTitle": "Workshop Job Cards, Repairs & Battery BMS Lab",
    "chapter": "6.4",
    "chapterTitle": "After-Sales Service Metrics",
    "checkpointsCount": 23,
    "checkpoints": [
      {
        "checkpointId": "M6-R120-H1",
        "elementCategory": "header",
        "label": "After-sales Dashboard",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-H2",
        "elementCategory": "header",
        "label": "Service Workload",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-H3",
        "elementCategory": "header",
        "label": "Branch Workload",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-H4",
        "elementCategory": "header",
        "label": "Response Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-H5",
        "elementCategory": "header",
        "label": "Priority Cases",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K1",
        "elementCategory": "kpi",
        "label": "Open Cases",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K2",
        "elementCategory": "kpi",
        "label": "Repairs In Progress",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K3",
        "elementCategory": "kpi",
        "label": "Awaiting Parts",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K4",
        "elementCategory": "kpi",
        "label": "Ready",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K5",
        "elementCategory": "kpi",
        "label": "Open Warranty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K6",
        "elementCategory": "kpi",
        "label": "Open Repairs",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K7",
        "elementCategory": "kpi",
        "label": "Overdue Service",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K8",
        "elementCategory": "kpi",
        "label": "Ready for Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K9",
        "elementCategory": "kpi",
        "label": "Peshawar",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K10",
        "elementCategory": "kpi",
        "label": "Islamabad",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K11",
        "elementCategory": "kpi",
        "label": "Lahore",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K12",
        "elementCategory": "kpi",
        "label": "Rawalpindi",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K13",
        "elementCategory": "kpi",
        "label": "Same day",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K14",
        "elementCategory": "kpi",
        "label": "1-2 days",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-K15",
        "elementCategory": "kpi",
        "label": "3+ days",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-TBL1",
        "elementCategory": "table",
        "columns": [
          "Case / Job",
          "Customer",
          "Unit",
          "Issue",
          "Status"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-TBL2",
        "elementCategory": "table",
        "columns": [
          "Case",
          "Branch",
          "Customer",
          "Unit",
          "Type",
          "Age",
          "Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R120-B1",
        "elementCategory": "button",
        "actionName": "Open ›",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/after-sales/warranty",
    "routeName": "after-sales-warranty",
    "component": "src/views/after-sales/WarrantyService.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 22,
    "checkpoints": [
      {
        "checkpointId": "M8-R121-H1",
        "elementCategory": "header",
        "label": "Warranty & Service Cases",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-H2",
        "elementCategory": "header",
        "label": "Create Case",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-H3",
        "elementCategory": "header",
        "label": "Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-H4",
        "elementCategory": "header",
        "label": "Columns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-H5",
        "elementCategory": "header",
        "label": "Export",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-T2",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-T3",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-K1",
        "elementCategory": "kpi",
        "label": "Open",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-K2",
        "elementCategory": "kpi",
        "label": "Warranty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-K3",
        "elementCategory": "kpi",
        "label": "Out of Warranty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-K4",
        "elementCategory": "kpi",
        "label": "Overdue",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-TBL1",
        "elementCategory": "table",
        "columns": [
          "Case",
          "Customer",
          "Unit",
          "Issue",
          "Priority",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-TBL2",
        "elementCategory": "table",
        "columns": [
          "Case",
          "Branch",
          "Customer",
          "Unit",
          "Type",
          "Opened",
          "Warranty",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-F3",
        "elementCategory": "field",
        "fieldName": "selectedBranch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-B1",
        "elementCategory": "button",
        "actionName": "Create Case",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-B2",
        "elementCategory": "button",
        "actionName": "Date",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-B3",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-B4",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R121-B5",
        "elementCategory": "button",
        "actionName": "Open ›",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/after-sales/warranty/create",
    "routeName": "after-sales-create-case",
    "component": "src/views/after-sales/CreateCase.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 17,
    "checkpoints": [
      {
        "checkpointId": "M8-R122-H1",
        "elementCategory": "header",
        "label": "Estimated Cost",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-H2",
        "elementCategory": "header",
        "label": "Warranty Covered",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-H3",
        "elementCategory": "header",
        "label": "Customer Payable",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F1",
        "elementCategory": "field",
        "fieldName": "customerSearch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F2",
        "elementCategory": "field",
        "fieldName": "form.customerPhone",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F3",
        "elementCategory": "field",
        "fieldName": "form.customerEmail",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F4",
        "elementCategory": "field",
        "fieldName": "unitSearch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F5",
        "elementCategory": "field",
        "fieldName": "form.odometer",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F6",
        "elementCategory": "field",
        "fieldName": "form.purchaseDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F7",
        "elementCategory": "field",
        "fieldName": "form.category",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F8",
        "elementCategory": "field",
        "fieldName": "form.complaint",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F9",
        "elementCategory": "field",
        "fieldName": "form.urgency",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F10",
        "elementCategory": "field",
        "fieldName": "form.branch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F11",
        "elementCategory": "field",
        "fieldName": "form.assignedTech",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F12",
        "elementCategory": "field",
        "fieldName": "form.estimatedCompletion",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-F13",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R122-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/after-sales/create-case",
    "routeName": "after-sales-create-case-alias",
    "component": "src/views/after-sales/CreateCase.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 17,
    "checkpoints": [
      {
        "checkpointId": "M8-R123-H1",
        "elementCategory": "header",
        "label": "Estimated Cost",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-H2",
        "elementCategory": "header",
        "label": "Warranty Covered",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-H3",
        "elementCategory": "header",
        "label": "Customer Payable",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F1",
        "elementCategory": "field",
        "fieldName": "customerSearch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F2",
        "elementCategory": "field",
        "fieldName": "form.customerPhone",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F3",
        "elementCategory": "field",
        "fieldName": "form.customerEmail",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F4",
        "elementCategory": "field",
        "fieldName": "unitSearch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F5",
        "elementCategory": "field",
        "fieldName": "form.odometer",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F6",
        "elementCategory": "field",
        "fieldName": "form.purchaseDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F7",
        "elementCategory": "field",
        "fieldName": "form.category",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F8",
        "elementCategory": "field",
        "fieldName": "form.complaint",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F9",
        "elementCategory": "field",
        "fieldName": "form.urgency",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F10",
        "elementCategory": "field",
        "fieldName": "form.branch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F11",
        "elementCategory": "field",
        "fieldName": "form.assignedTech",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F12",
        "elementCategory": "field",
        "fieldName": "form.estimatedCompletion",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-F13",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R123-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/after-sales/warranty/detail",
    "routeName": "after-sales-case-detail-legacy",
    "component": "src/views/after-sales/CaseDetail.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 16,
    "checkpoints": [
      {
        "checkpointId": "M8-R124-H1",
        "elementCategory": "header",
        "label": "Service Case Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-H2",
        "elementCategory": "header",
        "label": "+ Create Repair Job",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-H3",
        "elementCategory": "header",
        "label": "Summary",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-H4",
        "elementCategory": "header",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-H5",
        "elementCategory": "header",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-T2",
        "elementCategory": "tab",
        "label": "Customer",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-T3",
        "elementCategory": "tab",
        "label": "Unit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-T4",
        "elementCategory": "tab",
        "label": "Warranty",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-T5",
        "elementCategory": "tab",
        "label": "Diagnosis",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-T6",
        "elementCategory": "tab",
        "label": "Resolution",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-T7",
        "elementCategory": "tab",
        "label": "Cost",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-T8",
        "elementCategory": "tab",
        "label": "Communication",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-T9",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-T10",
        "elementCategory": "tab",
        "label": "Timeline",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R124-B1",
        "elementCategory": "button",
        "actionName": "+ Create Repair Job",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/after-sales/warranty/:id",
    "routeName": "after-sales-case-detail",
    "component": "src/views/after-sales/CaseDetail.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 16,
    "checkpoints": [
      {
        "checkpointId": "M8-R125-H1",
        "elementCategory": "header",
        "label": "Service Case Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-H2",
        "elementCategory": "header",
        "label": "+ Create Repair Job",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-H3",
        "elementCategory": "header",
        "label": "Summary",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-H4",
        "elementCategory": "header",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-H5",
        "elementCategory": "header",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-T2",
        "elementCategory": "tab",
        "label": "Customer",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-T3",
        "elementCategory": "tab",
        "label": "Unit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-T4",
        "elementCategory": "tab",
        "label": "Warranty",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-T5",
        "elementCategory": "tab",
        "label": "Diagnosis",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-T6",
        "elementCategory": "tab",
        "label": "Resolution",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-T7",
        "elementCategory": "tab",
        "label": "Cost",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-T8",
        "elementCategory": "tab",
        "label": "Communication",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-T9",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-T10",
        "elementCategory": "tab",
        "label": "Timeline",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R125-B1",
        "elementCategory": "button",
        "actionName": "+ Create Repair Job",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/after-sales/cases/:id",
    "routeName": "after-sales-case-detail-canonical",
    "component": "src/views/after-sales/CaseDetail.vue",
    "stageId": "M6",
    "stageTitle": "Workshop Job Cards, Repairs & Battery BMS Lab",
    "chapter": "6.1",
    "chapterTitle": "Service Case Intake & Diagnosis",
    "checkpointsCount": 16,
    "checkpoints": [
      {
        "checkpointId": "M6-R126-H1",
        "elementCategory": "header",
        "label": "Service Case Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-H2",
        "elementCategory": "header",
        "label": "+ Create Repair Job",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-H3",
        "elementCategory": "header",
        "label": "Summary",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-H4",
        "elementCategory": "header",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-H5",
        "elementCategory": "header",
        "label": "Customer",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-T1",
        "elementCategory": "tab",
        "label": "Summary",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-T2",
        "elementCategory": "tab",
        "label": "Customer",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-T3",
        "elementCategory": "tab",
        "label": "Unit",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-T4",
        "elementCategory": "tab",
        "label": "Warranty",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-T5",
        "elementCategory": "tab",
        "label": "Diagnosis",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-T6",
        "elementCategory": "tab",
        "label": "Resolution",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-T7",
        "elementCategory": "tab",
        "label": "Cost",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-T8",
        "elementCategory": "tab",
        "label": "Communication",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-T9",
        "elementCategory": "tab",
        "label": "Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-T10",
        "elementCategory": "tab",
        "label": "Timeline",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R126-B1",
        "elementCategory": "button",
        "actionName": "+ Create Repair Job",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/after-sales/repairs",
    "routeName": "after-sales-repairs",
    "component": "src/views/after-sales/RepairJobs.vue",
    "stageId": "M6",
    "stageTitle": "Workshop Job Cards, Repairs & Battery BMS Lab",
    "chapter": "6.2",
    "chapterTitle": "Workshop Job Cards Kanban",
    "checkpointsCount": 18,
    "checkpoints": [
      {
        "checkpointId": "M6-R127-H1",
        "elementCategory": "header",
        "label": "Repair Jobs",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-H2",
        "elementCategory": "header",
        "label": "Create Repair Job",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-T3",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-K1",
        "elementCategory": "kpi",
        "label": "Open Jobs",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-K2",
        "elementCategory": "kpi",
        "label": "Awaiting Parts",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-K3",
        "elementCategory": "kpi",
        "label": "Approval Needed",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-K4",
        "elementCategory": "kpi",
        "label": "Ready",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-TBL1",
        "elementCategory": "table",
        "columns": [
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-TBL2",
        "elementCategory": "table",
        "columns": [
          "Repair ID",
          "Branch",
          "Customer",
          "Unit Serial",
          "Diagnosis",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-F2",
        "elementCategory": "field",
        "fieldName": "col.visible",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-F3",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-B1",
        "elementCategory": "button",
        "actionName": "Create Repair Job",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-B2",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R127-B4",
        "elementCategory": "button",
        "actionName": "Open ›",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/after-sales/repairs/create",
    "routeName": "after-sales-create-repair",
    "component": "src/views/after-sales/CreateRepairJob.vue",
    "stageId": "M6",
    "stageTitle": "Workshop Job Cards, Repairs & Battery BMS Lab",
    "chapter": "6.2",
    "chapterTitle": "Workshop Job Cards Kanban",
    "checkpointsCount": 18,
    "checkpoints": [
      {
        "checkpointId": "M6-R128-F1",
        "elementCategory": "field",
        "fieldName": "caseSearch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F2",
        "elementCategory": "field",
        "fieldName": "form.customer",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F3",
        "elementCategory": "field",
        "fieldName": "form.unit",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F4",
        "elementCategory": "field",
        "fieldName": "form.branch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F5",
        "elementCategory": "field",
        "fieldName": "form.unitModel",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F6",
        "elementCategory": "field",
        "fieldName": "form.diagnosis",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F7",
        "elementCategory": "field",
        "fieldName": "form.fault",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F8",
        "elementCategory": "field",
        "fieldName": "form.decision",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F9",
        "elementCategory": "field",
        "fieldName": "form.technician",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F10",
        "elementCategory": "field",
        "fieldName": "form.partItem",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F11",
        "elementCategory": "field",
        "fieldName": "form.partQty",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F12",
        "elementCategory": "field",
        "fieldName": "form.partCost",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F13",
        "elementCategory": "field",
        "fieldName": "form.partSource",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F14",
        "elementCategory": "field",
        "fieldName": "form.readyDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F15",
        "elementCategory": "field",
        "fieldName": "form.status",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-F16",
        "elementCategory": "field",
        "fieldName": "newTaskName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-B1",
        "elementCategory": "button",
        "actionName": "+ Add",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R128-B2",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/after-sales/create-repair",
    "routeName": "after-sales-create-repair-alias",
    "component": "src/views/after-sales/CreateRepairJob.vue",
    "stageId": "M6",
    "stageTitle": "Workshop Job Cards, Repairs & Battery BMS Lab",
    "chapter": "6.2",
    "chapterTitle": "Workshop Job Cards Kanban",
    "checkpointsCount": 18,
    "checkpoints": [
      {
        "checkpointId": "M6-R129-F1",
        "elementCategory": "field",
        "fieldName": "caseSearch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F2",
        "elementCategory": "field",
        "fieldName": "form.customer",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F3",
        "elementCategory": "field",
        "fieldName": "form.unit",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F4",
        "elementCategory": "field",
        "fieldName": "form.branch",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F5",
        "elementCategory": "field",
        "fieldName": "form.unitModel",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F6",
        "elementCategory": "field",
        "fieldName": "form.diagnosis",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F7",
        "elementCategory": "field",
        "fieldName": "form.fault",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F8",
        "elementCategory": "field",
        "fieldName": "form.decision",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F9",
        "elementCategory": "field",
        "fieldName": "form.technician",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F10",
        "elementCategory": "field",
        "fieldName": "form.partItem",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F11",
        "elementCategory": "field",
        "fieldName": "form.partQty",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F12",
        "elementCategory": "field",
        "fieldName": "form.partCost",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F13",
        "elementCategory": "field",
        "fieldName": "form.partSource",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F14",
        "elementCategory": "field",
        "fieldName": "form.readyDate",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F15",
        "elementCategory": "field",
        "fieldName": "form.status",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-F16",
        "elementCategory": "field",
        "fieldName": "newTaskName",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-B1",
        "elementCategory": "button",
        "actionName": "+ Add",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R129-B2",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/after-sales/repairs/detail",
    "routeName": "after-sales-repair-detail-legacy",
    "component": "src/views/after-sales/RepairDetail.vue",
    "stageId": "M6",
    "stageTitle": "Workshop Job Cards, Repairs & Battery BMS Lab",
    "chapter": "6.2",
    "chapterTitle": "Workshop Job Cards Kanban",
    "checkpointsCount": 59,
    "checkpoints": [
      {
        "checkpointId": "M6-R130-H1",
        "elementCategory": "header",
        "label": "Repair Job Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-H2",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-H3",
        "elementCategory": "header",
        "label": "Update Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-H4",
        "elementCategory": "header",
        "label": "Approved",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-H5",
        "elementCategory": "header",
        "label": "In Progress",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-T1",
        "elementCategory": "tab",
        "label": "Manage Work Plan",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-T2",
        "elementCategory": "tab",
        "label": "Reserve More Parts",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-T3",
        "elementCategory": "tab",
        "label": "Diagnosis",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-T4",
        "elementCategory": "tab",
        "label": "Work",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-T5",
        "elementCategory": "tab",
        "label": "Parts",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-T6",
        "elementCategory": "tab",
        "label": "Labour",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-T7",
        "elementCategory": "tab",
        "label": "Cost",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-T8",
        "elementCategory": "tab",
        "label": "Warranty Coverage",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-T9",
        "elementCategory": "tab",
        "label": "Photos & Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-T10",
        "elementCategory": "tab",
        "label": "Customer Approval",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-T11",
        "elementCategory": "tab",
        "label": "Timeline",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K1",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K2",
        "elementCategory": "kpi",
        "label": "Case",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K3",
        "elementCategory": "kpi",
        "label": "Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K4",
        "elementCategory": "kpi",
        "label": "Technician",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K5",
        "elementCategory": "kpi",
        "label": "Diagnosis",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K6",
        "elementCategory": "kpi",
        "label": "Parts",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K7",
        "elementCategory": "kpi",
        "label": "Labour",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K8",
        "elementCategory": "kpi",
        "label": "Warranty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K9",
        "elementCategory": "kpi",
        "label": "Customer Approval",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K10",
        "elementCategory": "kpi",
        "label": "Promised",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K11",
        "elementCategory": "kpi",
        "label": "Work Plan",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K12",
        "elementCategory": "kpi",
        "label": "Current Step",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K13",
        "elementCategory": "kpi",
        "label": "Bay Assigned",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K14",
        "elementCategory": "kpi",
        "label": "Lead Technician",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K15",
        "elementCategory": "kpi",
        "label": "Work Order Ref",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K16",
        "elementCategory": "kpi",
        "label": "Target Completion",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K17",
        "elementCategory": "kpi",
        "label": "Total Tasks",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K18",
        "elementCategory": "kpi",
        "label": "Progress",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K19",
        "elementCategory": "kpi",
        "label": "Lead Tech",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K20",
        "elementCategory": "kpi",
        "label": "Est. Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K21",
        "elementCategory": "kpi",
        "label": "Primary Part",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K22",
        "elementCategory": "kpi",
        "label": "Part SKU",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K23",
        "elementCategory": "kpi",
        "label": "Allocated Qty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K24",
        "elementCategory": "kpi",
        "label": "Stock Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-K25",
        "elementCategory": "kpi",
        "label": "Unit Cost",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-TBL1",
        "elementCategory": "table",
        "columns": [
          "Task",
          "Technician",
          "Status"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-TBL2",
        "elementCategory": "table",
        "columns": [
          "Part",
          "Qty",
          "Cost",
          "Source",
          "Status"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-TBL3",
        "elementCategory": "table",
        "columns": [
          "Work",
          "Hours",
          "Rate",
          "Amount"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B1",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B2",
        "elementCategory": "button",
        "actionName": "Post to Finance",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B3",
        "elementCategory": "button",
        "actionName": "Confirm Schedule",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B4",
        "elementCategory": "button",
        "actionName": "Complete Service",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B5",
        "elementCategory": "button",
        "actionName": "Back to Repairs",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B6",
        "elementCategory": "button",
        "actionName": "Repair Actions",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B7",
        "elementCategory": "button",
        "actionName": "Approved",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B8",
        "elementCategory": "button",
        "actionName": "In Progress",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B9",
        "elementCategory": "button",
        "actionName": "Parts Waiting",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B10",
        "elementCategory": "button",
        "actionName": "Ready / Completed",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B11",
        "elementCategory": "button",
        "actionName": "More",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B12",
        "elementCategory": "button",
        "actionName": "Print Job Card",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B13",
        "elementCategory": "button",
        "actionName": "Generate Invoice",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B14",
        "elementCategory": "button",
        "actionName": "Cancel Repair Job",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R130-B15",
        "elementCategory": "button",
        "actionName": "Upload Photo / Document",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/after-sales/repairs/:id",
    "routeName": "after-sales-repair-detail",
    "component": "src/views/after-sales/RepairDetail.vue",
    "stageId": "M6",
    "stageTitle": "Workshop Job Cards, Repairs & Battery BMS Lab",
    "chapter": "6.2",
    "chapterTitle": "Workshop Job Cards Kanban",
    "checkpointsCount": 59,
    "checkpoints": [
      {
        "checkpointId": "M6-R131-H1",
        "elementCategory": "header",
        "label": "Repair Job Not Found",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-H2",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-H3",
        "elementCategory": "header",
        "label": "Update Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-H4",
        "elementCategory": "header",
        "label": "Approved",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-H5",
        "elementCategory": "header",
        "label": "In Progress",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-T1",
        "elementCategory": "tab",
        "label": "Manage Work Plan",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-T2",
        "elementCategory": "tab",
        "label": "Reserve More Parts",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-T3",
        "elementCategory": "tab",
        "label": "Diagnosis",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-T4",
        "elementCategory": "tab",
        "label": "Work",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-T5",
        "elementCategory": "tab",
        "label": "Parts",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-T6",
        "elementCategory": "tab",
        "label": "Labour",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-T7",
        "elementCategory": "tab",
        "label": "Cost",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-T8",
        "elementCategory": "tab",
        "label": "Warranty Coverage",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-T9",
        "elementCategory": "tab",
        "label": "Photos & Documents",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-T10",
        "elementCategory": "tab",
        "label": "Customer Approval",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-T11",
        "elementCategory": "tab",
        "label": "Timeline",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K1",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K2",
        "elementCategory": "kpi",
        "label": "Case",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K3",
        "elementCategory": "kpi",
        "label": "Unit",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K4",
        "elementCategory": "kpi",
        "label": "Technician",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K5",
        "elementCategory": "kpi",
        "label": "Diagnosis",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K6",
        "elementCategory": "kpi",
        "label": "Parts",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K7",
        "elementCategory": "kpi",
        "label": "Labour",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K8",
        "elementCategory": "kpi",
        "label": "Warranty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K9",
        "elementCategory": "kpi",
        "label": "Customer Approval",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K10",
        "elementCategory": "kpi",
        "label": "Promised",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K11",
        "elementCategory": "kpi",
        "label": "Work Plan",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K12",
        "elementCategory": "kpi",
        "label": "Current Step",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K13",
        "elementCategory": "kpi",
        "label": "Bay Assigned",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K14",
        "elementCategory": "kpi",
        "label": "Lead Technician",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K15",
        "elementCategory": "kpi",
        "label": "Work Order Ref",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K16",
        "elementCategory": "kpi",
        "label": "Target Completion",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K17",
        "elementCategory": "kpi",
        "label": "Total Tasks",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K18",
        "elementCategory": "kpi",
        "label": "Progress",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K19",
        "elementCategory": "kpi",
        "label": "Lead Tech",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K20",
        "elementCategory": "kpi",
        "label": "Est. Time",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K21",
        "elementCategory": "kpi",
        "label": "Primary Part",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K22",
        "elementCategory": "kpi",
        "label": "Part SKU",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K23",
        "elementCategory": "kpi",
        "label": "Allocated Qty",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K24",
        "elementCategory": "kpi",
        "label": "Stock Location",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-K25",
        "elementCategory": "kpi",
        "label": "Unit Cost",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-TBL1",
        "elementCategory": "table",
        "columns": [
          "Task",
          "Technician",
          "Status"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-TBL2",
        "elementCategory": "table",
        "columns": [
          "Part",
          "Qty",
          "Cost",
          "Source",
          "Status"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-TBL3",
        "elementCategory": "table",
        "columns": [
          "Work",
          "Hours",
          "Rate",
          "Amount"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B1",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B2",
        "elementCategory": "button",
        "actionName": "Post to Finance",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B3",
        "elementCategory": "button",
        "actionName": "Confirm Schedule",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B4",
        "elementCategory": "button",
        "actionName": "Complete Service",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B5",
        "elementCategory": "button",
        "actionName": "Back to Repairs",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B6",
        "elementCategory": "button",
        "actionName": "Repair Actions",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B7",
        "elementCategory": "button",
        "actionName": "Approved",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B8",
        "elementCategory": "button",
        "actionName": "In Progress",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B9",
        "elementCategory": "button",
        "actionName": "Parts Waiting",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B10",
        "elementCategory": "button",
        "actionName": "Ready / Completed",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B11",
        "elementCategory": "button",
        "actionName": "More",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B12",
        "elementCategory": "button",
        "actionName": "Print Job Card",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B13",
        "elementCategory": "button",
        "actionName": "Generate Invoice",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B14",
        "elementCategory": "button",
        "actionName": "Cancel Repair Job",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M6-R131-B15",
        "elementCategory": "button",
        "actionName": "Upload Photo / Document",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/finance/expenses",
    "routeName": "finance-expenses",
    "component": "src/views/finance/Expenses.vue",
    "stageId": "M7",
    "stageTitle": "Showroom Petty Cash & Expense Management",
    "chapter": "7.2",
    "chapterTitle": "Petty Cash Voucher Submission & Approvals",
    "checkpointsCount": 23,
    "checkpoints": [
      {
        "checkpointId": "M7-R132-H1",
        "elementCategory": "header",
        "label": "Expenses",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-H2",
        "elementCategory": "header",
        "label": "Add Expense",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-H3",
        "elementCategory": "header",
        "label": "Branch Expenses",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-T2",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-T3",
        "elementCategory": "tab",
        "label": "All Categories",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-T4",
        "elementCategory": "tab",
        "label": "Utilities",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-T5",
        "elementCategory": "tab",
        "label": "Rent",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-T6",
        "elementCategory": "tab",
        "label": "Marketing",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-T7",
        "elementCategory": "tab",
        "label": "Logistics",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-T8",
        "elementCategory": "tab",
        "label": "Maintenance",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-K1",
        "elementCategory": "kpi",
        "label": "This Month",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-K2",
        "elementCategory": "kpi",
        "label": "Submitted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-K3",
        "elementCategory": "kpi",
        "label": "Pending",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-K4",
        "elementCategory": "kpi",
        "label": "Paid",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-TBL1",
        "elementCategory": "table",
        "columns": [
          "Expense",
          "Category",
          "Vendor",
          "Amount",
          "Date",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-TBL2",
        "elementCategory": "table",
        "columns": [
          "Expense ID",
          "Branch",
          "Category",
          "Vendor",
          "Amount",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-B1",
        "elementCategory": "button",
        "actionName": "Add Expense",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-B2",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R132-B4",
        "elementCategory": "button",
        "actionName": "Open ›",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/finance/expenses/create",
    "routeName": "finance-create-expense",
    "component": "src/views/finance/CreateExpense.vue",
    "stageId": "M7",
    "stageTitle": "Showroom Petty Cash & Expense Management",
    "chapter": "7.2",
    "chapterTitle": "Petty Cash Voucher Submission & Approvals",
    "checkpointsCount": 23,
    "checkpoints": [
      {
        "checkpointId": "M7-R133-H1",
        "elementCategory": "header",
        "label": "Expense Details",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-H2",
        "elementCategory": "header",
        "label": "Showroom Outflow",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-H3",
        "elementCategory": "header",
        "label": "(Type numbers only)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-H4",
        "elementCategory": "header",
        "label": "Payment & Evidence",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-H5",
        "elementCategory": "header",
        "label": "Audit Compliance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-T1",
        "elementCategory": "tab",
        "label": "Facility & Maintenance",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-T2",
        "elementCategory": "tab",
        "label": "Staff Welfare & Refreshments",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-T3",
        "elementCategory": "tab",
        "label": "Local Logistics & Courier",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-T4",
        "elementCategory": "tab",
        "label": "Showroom Marketing & Banners",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-T5",
        "elementCategory": "tab",
        "label": "Office Stationery & Supplies",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-T6",
        "elementCategory": "tab",
        "label": "Security & Municipal Fees",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-T7",
        "elementCategory": "tab",
        "label": "Workshop Consumables & Cleaning",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-T8",
        "elementCategory": "tab",
        "label": "Other Operating Expense",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-F1",
        "elementCategory": "field",
        "fieldName": "form.category",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-F2",
        "elementCategory": "field",
        "fieldName": "e.g. PKR 48,500",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-F3",
        "elementCategory": "field",
        "fieldName": "form.date",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-F4",
        "elementCategory": "field",
        "fieldName": "form.vendor",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-F5",
        "elementCategory": "field",
        "fieldName": "form.paymentMethod",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-F6",
        "elementCategory": "field",
        "fieldName": "form.transactionId",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-F7",
        "elementCategory": "field",
        "fieldName": "form.description",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-F8",
        "elementCategory": "field",
        "fieldName": "form.receipt",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-F9",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R133-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/finance/create-expense",
    "routeName": "finance-create-expense-alias",
    "component": "src/views/finance/CreateExpense.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 23,
    "checkpoints": [
      {
        "checkpointId": "M8-R134-H1",
        "elementCategory": "header",
        "label": "Expense Details",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-H2",
        "elementCategory": "header",
        "label": "Showroom Outflow",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-H3",
        "elementCategory": "header",
        "label": "(Type numbers only)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-H4",
        "elementCategory": "header",
        "label": "Payment & Evidence",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-H5",
        "elementCategory": "header",
        "label": "Audit Compliance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-T1",
        "elementCategory": "tab",
        "label": "Facility & Maintenance",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-T2",
        "elementCategory": "tab",
        "label": "Staff Welfare & Refreshments",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-T3",
        "elementCategory": "tab",
        "label": "Local Logistics & Courier",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-T4",
        "elementCategory": "tab",
        "label": "Showroom Marketing & Banners",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-T5",
        "elementCategory": "tab",
        "label": "Office Stationery & Supplies",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-T6",
        "elementCategory": "tab",
        "label": "Security & Municipal Fees",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-T7",
        "elementCategory": "tab",
        "label": "Workshop Consumables & Cleaning",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-T8",
        "elementCategory": "tab",
        "label": "Other Operating Expense",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-F1",
        "elementCategory": "field",
        "fieldName": "form.category",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-F2",
        "elementCategory": "field",
        "fieldName": "e.g. PKR 48,500",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-F3",
        "elementCategory": "field",
        "fieldName": "form.date",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-F4",
        "elementCategory": "field",
        "fieldName": "form.vendor",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-F5",
        "elementCategory": "field",
        "fieldName": "form.paymentMethod",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-F6",
        "elementCategory": "field",
        "fieldName": "form.transactionId",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-F7",
        "elementCategory": "field",
        "fieldName": "form.description",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-F8",
        "elementCategory": "field",
        "fieldName": "form.receipt",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-F9",
        "elementCategory": "field",
        "fieldName": "form.notes",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R134-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/finance/expenses/detail",
    "routeName": "finance-expense-detail-legacy",
    "component": "src/views/finance/ExpenseDetail.vue",
    "stageId": "M7",
    "stageTitle": "Showroom Petty Cash & Expense Management",
    "chapter": "7.2",
    "chapterTitle": "Petty Cash Voucher Submission & Approvals",
    "checkpointsCount": 33,
    "checkpoints": [
      {
        "checkpointId": "M7-R135-H1",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-H2",
        "elementCategory": "header",
        "label": "Super Admin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-H3",
        "elementCategory": "header",
        "label": "Finance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-H4",
        "elementCategory": "header",
        "label": "Expenses",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-H5",
        "elementCategory": "header",
        "label": "Expense Detail",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K1",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K2",
        "elementCategory": "kpi",
        "label": "Category",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K3",
        "elementCategory": "kpi",
        "label": "Vendor",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K4",
        "elementCategory": "kpi",
        "label": "Amount",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K5",
        "elementCategory": "kpi",
        "label": "Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K6",
        "elementCategory": "kpi",
        "label": "Payment Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K7",
        "elementCategory": "kpi",
        "label": "Submitted by",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K8",
        "elementCategory": "kpi",
        "label": "Approval",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K9",
        "elementCategory": "kpi",
        "label": "Receipt",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K10",
        "elementCategory": "kpi",
        "label": "Last Update",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K11",
        "elementCategory": "kpi",
        "label": "Current Approval",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K12",
        "elementCategory": "kpi",
        "label": "Branch Threshold",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K13",
        "elementCategory": "kpi",
        "label": "Approving Authority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K14",
        "elementCategory": "kpi",
        "label": "Submission Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K15",
        "elementCategory": "kpi",
        "label": "Policy Verification",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K16",
        "elementCategory": "kpi",
        "label": "Audit Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K17",
        "elementCategory": "kpi",
        "label": "SLA Window",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K18",
        "elementCategory": "kpi",
        "label": "Priority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K19",
        "elementCategory": "kpi",
        "label": "Approver Role",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K20",
        "elementCategory": "kpi",
        "label": "Escalation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K21",
        "elementCategory": "kpi",
        "label": "Payment Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K22",
        "elementCategory": "kpi",
        "label": "Disbursement Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K23",
        "elementCategory": "kpi",
        "label": "Beneficiary Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K24",
        "elementCategory": "kpi",
        "label": "Billing Period",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-K25",
        "elementCategory": "kpi",
        "label": "Settlement Amount",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-B1",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-B2",
        "elementCategory": "button",
        "actionName": "Approve",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R135-B3",
        "elementCategory": "button",
        "actionName": "Reject",
        "trainingType": "decision",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/finance/expenses/:id",
    "routeName": "finance-expense-detail",
    "component": "src/views/finance/ExpenseDetail.vue",
    "stageId": "M7",
    "stageTitle": "Showroom Petty Cash & Expense Management",
    "chapter": "7.2",
    "chapterTitle": "Petty Cash Voucher Submission & Approvals",
    "checkpointsCount": 33,
    "checkpoints": [
      {
        "checkpointId": "M7-R136-H1",
        "elementCategory": "header",
        "label": "Related information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-H2",
        "elementCategory": "header",
        "label": "Super Admin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-H3",
        "elementCategory": "header",
        "label": "Finance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-H4",
        "elementCategory": "header",
        "label": "Expenses",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-H5",
        "elementCategory": "header",
        "label": "Expense Detail",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K1",
        "elementCategory": "kpi",
        "label": "Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K2",
        "elementCategory": "kpi",
        "label": "Category",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K3",
        "elementCategory": "kpi",
        "label": "Vendor",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K4",
        "elementCategory": "kpi",
        "label": "Amount",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K5",
        "elementCategory": "kpi",
        "label": "Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K6",
        "elementCategory": "kpi",
        "label": "Payment Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K7",
        "elementCategory": "kpi",
        "label": "Submitted by",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K8",
        "elementCategory": "kpi",
        "label": "Approval",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K9",
        "elementCategory": "kpi",
        "label": "Receipt",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K10",
        "elementCategory": "kpi",
        "label": "Last Update",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K11",
        "elementCategory": "kpi",
        "label": "Current Approval",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K12",
        "elementCategory": "kpi",
        "label": "Branch Threshold",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K13",
        "elementCategory": "kpi",
        "label": "Approving Authority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K14",
        "elementCategory": "kpi",
        "label": "Submission Date",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K15",
        "elementCategory": "kpi",
        "label": "Policy Verification",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K16",
        "elementCategory": "kpi",
        "label": "Audit Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K17",
        "elementCategory": "kpi",
        "label": "SLA Window",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K18",
        "elementCategory": "kpi",
        "label": "Priority",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K19",
        "elementCategory": "kpi",
        "label": "Approver Role",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K20",
        "elementCategory": "kpi",
        "label": "Escalation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K21",
        "elementCategory": "kpi",
        "label": "Payment Status",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K22",
        "elementCategory": "kpi",
        "label": "Disbursement Method",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K23",
        "elementCategory": "kpi",
        "label": "Beneficiary Name",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K24",
        "elementCategory": "kpi",
        "label": "Billing Period",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-K25",
        "elementCategory": "kpi",
        "label": "Settlement Amount",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-B1",
        "elementCategory": "button",
        "actionName": "Back",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-B2",
        "elementCategory": "button",
        "actionName": "Approve",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M7-R136-B3",
        "elementCategory": "button",
        "actionName": "Reject",
        "trainingType": "decision",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/finance/cash-bank",
    "routeName": "finance-cash-bank",
    "component": "src/views/finance/CashBank.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.5",
    "chapterTitle": "Cash Vault Count & Z-Closing Lock",
    "checkpointsCount": 10,
    "checkpoints": [
      {
        "checkpointId": "M8-R137-H1",
        "elementCategory": "header",
        "label": "Cash / Bank",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R137-H2",
        "elementCategory": "header",
        "label": "Reconciliation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R137-T1",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R137-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R137-K1",
        "elementCategory": "kpi",
        "label": "Bank Balance",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R137-K2",
        "elementCategory": "kpi",
        "label": "Cash on Hand",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R137-K3",
        "elementCategory": "kpi",
        "label": "Unreconciled",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R137-K4",
        "elementCategory": "kpi",
        "label": "Last Reconciled",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R137-TBL1",
        "elementCategory": "table",
        "columns": [
          "Date",
          "Account",
          "Reference",
          "Recorded",
          "Statement",
          "Difference",
          "Status",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R137-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/communication/inbox",
    "routeName": "communication-inbox",
    "component": "src/views/communication/ManagementInbox.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.7",
    "chapterTitle": "Internal Directives & Staff Comms",
    "checkpointsCount": 22,
    "checkpoints": [
      {
        "checkpointId": "M1-R138-H1",
        "elementCategory": "header",
        "label": "Management Inbox",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-H2",
        "elementCategory": "header",
        "label": "New Conversation",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-H3",
        "elementCategory": "header",
        "label": "Columns",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-H4",
        "elementCategory": "header",
        "label": "Export",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-H5",
        "elementCategory": "header",
        "label": "Conversations",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-T2",
        "elementCategory": "tab",
        "label": "Inbox",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-T3",
        "elementCategory": "tab",
        "label": "Sent",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-T4",
        "elementCategory": "tab",
        "label": "Unread",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-K1",
        "elementCategory": "kpi",
        "label": "Unread",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-K2",
        "elementCategory": "kpi",
        "label": "Stock Requests",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-K3",
        "elementCategory": "kpi",
        "label": "Expense Questions",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-K4",
        "elementCategory": "kpi",
        "label": "Service Escalations",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-TBL1",
        "elementCategory": "table",
        "columns": [
          "Thread",
          "Linked Record",
          "From",
          "Last Message",
          "Priority",
          "Status"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-TBL2",
        "elementCategory": "table",
        "columns": [
          "Thread Topic",
          "Branch",
          "Linked Context",
          "From",
          "Last Message Preview",
          "Priority",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-F2",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-B1",
        "elementCategory": "button",
        "actionName": "New Conversation",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-B2",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-B4",
        "elementCategory": "button",
        "actionName": "Open ›",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R138-B5",
        "elementCategory": "button",
        "actionName": "New Thread",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/communication/inbox/create",
    "routeName": "communication-create-conversation",
    "component": "src/views/communication/CreateConversation.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.7",
    "chapterTitle": "Internal Directives & Staff Comms",
    "checkpointsCount": 10,
    "checkpoints": [
      {
        "checkpointId": "M1-R139-H1",
        "elementCategory": "header",
        "label": "Topic & Linked Record",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R139-H2",
        "elementCategory": "header",
        "label": "Message & Documents",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R139-F1",
        "elementCategory": "field",
        "fieldName": "form.title",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R139-F2",
        "elementCategory": "field",
        "fieldName": "form.linkedType",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R139-F3",
        "elementCategory": "field",
        "fieldName": "form.linked",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R139-F4",
        "elementCategory": "field",
        "fieldName": "form.recipient",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R139-F5",
        "elementCategory": "field",
        "fieldName": "form.priority",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R139-F6",
        "elementCategory": "field",
        "fieldName": "form.message",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R139-F7",
        "elementCategory": "field",
        "fieldName": "form.attachment",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R139-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/communication/inbox/detail",
    "routeName": "communication-inbox-detail-legacy",
    "component": "src/views/communication/ConversationDetail.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.7",
    "chapterTitle": "Internal Directives & Staff Comms",
    "checkpointsCount": 22,
    "checkpoints": [
      {
        "checkpointId": "M1-R140-H1",
        "elementCategory": "header",
        "label": "Branch Manager",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-H2",
        "elementCategory": "header",
        "label": "Super Admin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-H3",
        "elementCategory": "header",
        "label": "Peshawar (Requester)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-H4",
        "elementCategory": "header",
        "label": "Lahore (Supplier)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-H5",
        "elementCategory": "header",
        "label": "Head Office Operations",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-T1",
        "elementCategory": "tab",
        "label": "Preview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-T2",
        "elementCategory": "tab",
        "label": "Thread",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-T3",
        "elementCategory": "tab",
        "label": "Attachments",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-T4",
        "elementCategory": "tab",
        "label": "Linked Record",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-T5",
        "elementCategory": "tab",
        "label": "Participants",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-TBL1",
        "elementCategory": "table",
        "columns": [
          "Document Name",
          "Shared / Uploaded By",
          "Date & Time",
          "File Size & Format",
          "Operational Purpose",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-F1",
        "elementCategory": "field",
        "fieldName": "replyText",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-F2",
        "elementCategory": "field",
        "fieldName": "uploadForm.name",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-F3",
        "elementCategory": "field",
        "fieldName": "uploadForm.scope",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-F4",
        "elementCategory": "field",
        "fieldName": "uploadForm.size",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-B1",
        "elementCategory": "button",
        "actionName": "Back to Management Inbox",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-B2",
        "elementCategory": "button",
        "actionName": "Attach File",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-B3",
        "elementCategory": "button",
        "actionName": "Attach Document",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-B4",
        "elementCategory": "button",
        "actionName": "Send Reply",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-B5",
        "elementCategory": "button",
        "actionName": "Upload Attachment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-B6",
        "elementCategory": "button",
        "actionName": "Download",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R140-B7",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/communication/inbox/:id",
    "routeName": "communication-inbox-detail",
    "component": "src/views/communication/ConversationDetail.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.7",
    "chapterTitle": "Internal Directives & Staff Comms",
    "checkpointsCount": 22,
    "checkpoints": [
      {
        "checkpointId": "M1-R141-H1",
        "elementCategory": "header",
        "label": "Branch Manager",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-H2",
        "elementCategory": "header",
        "label": "Super Admin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-H3",
        "elementCategory": "header",
        "label": "Peshawar (Requester)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-H4",
        "elementCategory": "header",
        "label": "Lahore (Supplier)",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-H5",
        "elementCategory": "header",
        "label": "Head Office Operations",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-T1",
        "elementCategory": "tab",
        "label": "Preview",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-T2",
        "elementCategory": "tab",
        "label": "Thread",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-T3",
        "elementCategory": "tab",
        "label": "Attachments",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-T4",
        "elementCategory": "tab",
        "label": "Linked Record",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-T5",
        "elementCategory": "tab",
        "label": "Participants",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-TBL1",
        "elementCategory": "table",
        "columns": [
          "Document Name",
          "Shared / Uploaded By",
          "Date & Time",
          "File Size & Format",
          "Operational Purpose",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-F1",
        "elementCategory": "field",
        "fieldName": "replyText",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-F2",
        "elementCategory": "field",
        "fieldName": "uploadForm.name",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-F3",
        "elementCategory": "field",
        "fieldName": "uploadForm.scope",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-F4",
        "elementCategory": "field",
        "fieldName": "uploadForm.size",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-B1",
        "elementCategory": "button",
        "actionName": "Back to Management Inbox",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-B2",
        "elementCategory": "button",
        "actionName": "Attach File",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-B3",
        "elementCategory": "button",
        "actionName": "Attach Document",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-B4",
        "elementCategory": "button",
        "actionName": "Send Reply",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-B5",
        "elementCategory": "button",
        "actionName": "Upload Attachment",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-B6",
        "elementCategory": "button",
        "actionName": "Download",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R141-B7",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/communication/notifications",
    "routeName": "communication-notifications",
    "component": "src/views/communication/Notifications.vue",
    "stageId": "M1",
    "stageTitle": "Morning Showroom Opening & System Daily Start",
    "chapter": "1.7",
    "chapterTitle": "Internal Directives & Staff Comms",
    "checkpointsCount": 23,
    "checkpoints": [
      {
        "checkpointId": "M1-R142-H1",
        "elementCategory": "header",
        "label": "Notifications",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-T3",
        "elementCategory": "tab",
        "label": "All Categories",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-T4",
        "elementCategory": "tab",
        "label": "Inventory",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-T5",
        "elementCategory": "tab",
        "label": "Sales",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-T6",
        "elementCategory": "tab",
        "label": "Procurement",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-T7",
        "elementCategory": "tab",
        "label": "Finance",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-T8",
        "elementCategory": "tab",
        "label": "Service",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-T9",
        "elementCategory": "tab",
        "label": "System",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-K1",
        "elementCategory": "kpi",
        "label": "Unread",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-K2",
        "elementCategory": "kpi",
        "label": "Inventory",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-K3",
        "elementCategory": "kpi",
        "label": "Sales",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-K4",
        "elementCategory": "kpi",
        "label": "System / Ops",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-TBL1",
        "elementCategory": "table",
        "columns": [
          "Time",
          "Category",
          "Notification",
          "Branch",
          "Read",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-F1",
        "elementCategory": "field",
        "fieldName": "branchSearchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-F2",
        "elementCategory": "field",
        "fieldName": "col.visible",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-F3",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-B1",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-B2",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-B3",
        "elementCategory": "button",
        "actionName": "Mark all read",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-B4",
        "elementCategory": "button",
        "actionName": "Mark Read",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M1-R142-B5",
        "elementCategory": "button",
        "actionName": "Open",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/analytics/reports-hub",
    "routeName": "analytics-reports-hub",
    "component": "src/views/analytics/ReportsHub.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.2",
    "chapterTitle": "Branch Analytics & Performance Audits",
    "checkpointsCount": 13,
    "checkpoints": [
      {
        "checkpointId": "M8-R143-H1",
        "elementCategory": "header",
        "label": "Reports Hub",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R143-H2",
        "elementCategory": "header",
        "label": "Trend",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R143-H3",
        "elementCategory": "header",
        "label": "Key Breakdown",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R143-H4",
        "elementCategory": "header",
        "label": "Top Segment",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R143-H5",
        "elementCategory": "header",
        "label": "BRG E-Series",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R143-K1",
        "elementCategory": "kpi",
        "label": "Current Period",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R143-K2",
        "elementCategory": "kpi",
        "label": "Prior Period",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R143-K3",
        "elementCategory": "kpi",
        "label": "Records",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R143-K4",
        "elementCategory": "kpi",
        "label": "Export",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R143-TBL1",
        "elementCategory": "table",
        "columns": [
          "Report",
          "Owner",
          "Scope",
          "Last Run",
          "Schedule",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R143-B1",
        "elementCategory": "button",
        "actionName": "Export CSV",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R143-B2",
        "elementCategory": "button",
        "actionName": "Export PDF",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R143-B3",
        "elementCategory": "button",
        "actionName": "Build Report",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/analytics/reports/build",
    "routeName": "analytics-build-report",
    "component": "src/views/analytics/BuildReport.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.2",
    "chapterTitle": "Branch Analytics & Performance Audits",
    "checkpointsCount": 21,
    "checkpoints": [
      {
        "checkpointId": "M8-R144-H1",
        "elementCategory": "header",
        "label": "Build Custom Report",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-H2",
        "elementCategory": "header",
        "label": "Build Report",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-H3",
        "elementCategory": "header",
        "label": "Report Setup",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-H4",
        "elementCategory": "header",
        "label": "Date & Comparison",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-H5",
        "elementCategory": "header",
        "label": "Included Metrics",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F1",
        "elementCategory": "field",
        "fieldName": "form.name",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F2",
        "elementCategory": "field",
        "fieldName": "form.category",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F3",
        "elementCategory": "field",
        "fieldName": "form.scope",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F4",
        "elementCategory": "field",
        "fieldName": "form.dateRange",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F5",
        "elementCategory": "field",
        "fieldName": "form.comparison",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F6",
        "elementCategory": "field",
        "fieldName": "form.status",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F7",
        "elementCategory": "field",
        "fieldName": "form.metrics.revenue",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F8",
        "elementCategory": "field",
        "fieldName": "form.metrics.volume",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F9",
        "elementCategory": "field",
        "fieldName": "form.metrics.orders",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F10",
        "elementCategory": "field",
        "fieldName": "form.metrics.margins",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F11",
        "elementCategory": "field",
        "fieldName": "form.metrics.kpi",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F12",
        "elementCategory": "field",
        "fieldName": "form.schedule",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F13",
        "elementCategory": "field",
        "fieldName": "form.format",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-F14",
        "elementCategory": "field",
        "fieldName": "form.email",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R144-B2",
        "elementCategory": "button",
        "actionName": "Generate Report",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/analytics/reports/sales",
    "routeName": "analytics-sales-report",
    "component": "src/views/analytics/SalesReport.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.2",
    "chapterTitle": "Branch Analytics & Performance Audits",
    "checkpointsCount": 12,
    "checkpoints": [
      {
        "checkpointId": "M8-R145-H1",
        "elementCategory": "header",
        "label": "Sales Report",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R145-H2",
        "elementCategory": "header",
        "label": "Breakdown",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R145-H3",
        "elementCategory": "header",
        "label": "Detailed Report",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R145-T1",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R145-K1",
        "elementCategory": "kpi",
        "label": "Net Sales",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R145-K2",
        "elementCategory": "kpi",
        "label": "Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R145-K3",
        "elementCategory": "kpi",
        "label": "Orders",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R145-K4",
        "elementCategory": "kpi",
        "label": "Margin",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R145-TBL1",
        "elementCategory": "table",
        "columns": [
          "Branch",
          "Sales",
          "Units",
          "Orders",
          "Discount",
          "Margin"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R145-B1",
        "elementCategory": "button",
        "actionName": "Save View",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R145-B2",
        "elementCategory": "button",
        "actionName": "Schedule",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R145-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/analytics/reports/inventory",
    "routeName": "analytics-inventory-report",
    "component": "src/views/analytics/InventoryReport.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.2",
    "chapterTitle": "Branch Analytics & Performance Audits",
    "checkpointsCount": 12,
    "checkpoints": [
      {
        "checkpointId": "M8-R146-H1",
        "elementCategory": "header",
        "label": "Inventory Report",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R146-H2",
        "elementCategory": "header",
        "label": "Breakdown",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R146-H3",
        "elementCategory": "header",
        "label": "Detailed Report",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R146-T1",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R146-K1",
        "elementCategory": "kpi",
        "label": "Inventory Value",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R146-K2",
        "elementCategory": "kpi",
        "label": "Units",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R146-K3",
        "elementCategory": "kpi",
        "label": "Available",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R146-K4",
        "elementCategory": "kpi",
        "label": "Low Stock",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R146-TBL1",
        "elementCategory": "table",
        "columns": [
          "Product",
          "Total",
          "Available",
          "Reserved",
          "Incoming",
          "Value"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R146-B1",
        "elementCategory": "button",
        "actionName": "Save View",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R146-B2",
        "elementCategory": "button",
        "actionName": "Schedule",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R146-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/analytics/reports/crm",
    "routeName": "analytics-crm-report",
    "component": "src/views/analytics/CrmReport.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.2",
    "chapterTitle": "Branch Analytics & Performance Audits",
    "checkpointsCount": 12,
    "checkpoints": [
      {
        "checkpointId": "M8-R147-H1",
        "elementCategory": "header",
        "label": "CRM Report",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R147-H2",
        "elementCategory": "header",
        "label": "Breakdown",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R147-H3",
        "elementCategory": "header",
        "label": "Detailed Report",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R147-T1",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R147-K1",
        "elementCategory": "kpi",
        "label": "Leads",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R147-K2",
        "elementCategory": "kpi",
        "label": "Qualified",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R147-K3",
        "elementCategory": "kpi",
        "label": "Converted",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R147-K4",
        "elementCategory": "kpi",
        "label": "Conversion",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R147-TBL1",
        "elementCategory": "table",
        "columns": [
          "Source",
          "Leads",
          "Qualified",
          "Quoted",
          "Converted",
          "Rate"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R147-B1",
        "elementCategory": "button",
        "actionName": "Save View",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R147-B2",
        "elementCategory": "button",
        "actionName": "Schedule",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R147-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/system/audit-log",
    "routeName": "system-audit-log",
    "component": "src/views/system/AuditLog.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 12,
    "checkpoints": [
      {
        "checkpointId": "M8-R148-H1",
        "elementCategory": "header",
        "label": "Audit Log",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R148-H2",
        "elementCategory": "header",
        "label": "Total Visible Events",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R148-H3",
        "elementCategory": "header",
        "label": "Audit Events",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R148-H4",
        "elementCategory": "header",
        "label": "Click record or row to inspect",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R148-H5",
        "elementCategory": "header",
        "label": "Audit Event Trace",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R148-T1",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R148-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R148-TBL1",
        "elementCategory": "table",
        "columns": [
          "Timestamp",
          "User / Actor",
          "Role",
          "Branch",
          "Module",
          "Operation",
          "Affected Record",
          "Change / Description",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R148-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R148-B1",
        "elementCategory": "button",
        "actionName": "Close",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R148-B2",
        "elementCategory": "button",
        "actionName": "View Source Record",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R148-B3",
        "elementCategory": "button",
        "actionName": "Return to Audit Log",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/system/audit-log/:id",
    "routeName": "system-audit-log-detail",
    "component": "src/views/system/AuditLog.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 12,
    "checkpoints": [
      {
        "checkpointId": "M8-R149-H1",
        "elementCategory": "header",
        "label": "Audit Log",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R149-H2",
        "elementCategory": "header",
        "label": "Total Visible Events",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R149-H3",
        "elementCategory": "header",
        "label": "Audit Events",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R149-H4",
        "elementCategory": "header",
        "label": "Click record or row to inspect",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R149-H5",
        "elementCategory": "header",
        "label": "Audit Event Trace",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R149-T1",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R149-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R149-TBL1",
        "elementCategory": "table",
        "columns": [
          "Timestamp",
          "User / Actor",
          "Role",
          "Branch",
          "Module",
          "Operation",
          "Affected Record",
          "Change / Description",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R149-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R149-B1",
        "elementCategory": "button",
        "actionName": "Close",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R149-B2",
        "elementCategory": "button",
        "actionName": "View Source Record",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R149-B3",
        "elementCategory": "button",
        "actionName": "Return to Audit Log",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/system/branch-team",
    "routeName": "system-branch-team",
    "component": "src/views/system/BranchTeam.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 19,
    "checkpoints": [
      {
        "checkpointId": "M8-R150-H1",
        "elementCategory": "header",
        "label": "Branch Team",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-H2",
        "elementCategory": "header",
        "label": "Add Team Member",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-H3",
        "elementCategory": "header",
        "label": "Branch Staff",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-T1",
        "elementCategory": "tab",
        "label": "Clear",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-K1",
        "elementCategory": "kpi",
        "label": "Team Members",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-K2",
        "elementCategory": "kpi",
        "label": "Sales",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-K3",
        "elementCategory": "kpi",
        "label": "Service",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-K4",
        "elementCategory": "kpi",
        "label": "Sessions",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-TBL1",
        "elementCategory": "table",
        "columns": [
          "Team Member",
          "Role / Function",
          "Phone Contact",
          "Email Address",
          "Last Active",
          "Status",
          "Actions"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-F2",
        "elementCategory": "field",
        "fieldName": "memberForm.name",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-F3",
        "elementCategory": "field",
        "fieldName": "memberForm.role",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-F4",
        "elementCategory": "field",
        "fieldName": "memberForm.status",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-F5",
        "elementCategory": "field",
        "fieldName": "memberForm.contact",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-F6",
        "elementCategory": "field",
        "fieldName": "memberForm.email",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-B1",
        "elementCategory": "button",
        "actionName": "Add Team Member",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-B2",
        "elementCategory": "button",
        "actionName": "Columns",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-B3",
        "elementCategory": "button",
        "actionName": "Export",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R150-B4",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/system/account",
    "routeName": "system-account",
    "component": "src/views/system/Account.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 11,
    "checkpoints": [
      {
        "checkpointId": "M8-R151-H1",
        "elementCategory": "header",
        "label": "Account Profile",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R151-H2",
        "elementCategory": "header",
        "label": "Account",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R151-H3",
        "elementCategory": "header",
        "label": "Personal Profile",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R151-H4",
        "elementCategory": "header",
        "label": "Admin Controlled",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R151-H5",
        "elementCategory": "header",
        "label": "Access & Role Information",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R151-F1",
        "elementCategory": "field",
        "fieldName": "profileForm.name",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R151-F2",
        "elementCategory": "field",
        "fieldName": "profileForm.email",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R151-F3",
        "elementCategory": "field",
        "fieldName": "profileForm.phone",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R151-F4",
        "elementCategory": "field",
        "fieldName": "profileForm.photo",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R151-F5",
        "elementCategory": "field",
        "fieldName": "profileForm.contactPreference",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R151-B1",
        "elementCategory": "button",
        "actionName": "Save Changes",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/system/preferences",
    "routeName": "system-preferences",
    "component": "src/views/system/Preferences.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.3",
    "chapterTitle": "Branch Preferences & Session Security",
    "checkpointsCount": 12,
    "checkpoints": [
      {
        "checkpointId": "M8-R152-H1",
        "elementCategory": "header",
        "label": "Preferences",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R152-H2",
        "elementCategory": "header",
        "label": "Appearance & Localization",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R152-H3",
        "elementCategory": "header",
        "label": "Operational Notification Preferences",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R152-F1",
        "elementCategory": "field",
        "fieldName": "preferencesForm.theme",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R152-F2",
        "elementCategory": "field",
        "fieldName": "preferencesForm.language",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R152-F3",
        "elementCategory": "field",
        "fieldName": "preferencesForm.dateFormat",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R152-F4",
        "elementCategory": "field",
        "fieldName": "preferencesForm.tableDensity",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R152-F5",
        "elementCategory": "field",
        "fieldName": "preferencesForm.inventoryAlerts",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R152-F6",
        "elementCategory": "field",
        "fieldName": "preferencesForm.salesAlerts",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R152-F7",
        "elementCategory": "field",
        "fieldName": "preferencesForm.serviceAlerts",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R152-F8",
        "elementCategory": "field",
        "fieldName": "preferencesForm.managementMessages",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R152-B1",
        "elementCategory": "button",
        "actionName": "Save Preferences",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/system/logout",
    "routeName": "system-logout",
    "component": "src/views/system/Logout.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.6",
    "chapterTitle": "Operational Closure",
    "checkpointsCount": 3,
    "checkpoints": [
      {
        "checkpointId": "M8-R153-H1",
        "elementCategory": "header",
        "label": "Logout",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R153-B1",
        "elementCategory": "button",
        "actionName": "Cancel",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R153-B2",
        "elementCategory": "button",
        "actionName": "Sign Out",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/audit-logs/:id",
    "routeName": "audit-log-direct-alias",
    "component": "src/views/system/AuditLog.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.4",
    "chapterTitle": "Audit Logs & Operational Traceability",
    "checkpointsCount": 12,
    "checkpoints": [
      {
        "checkpointId": "M8-R154-H1",
        "elementCategory": "header",
        "label": "Audit Log",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R154-H2",
        "elementCategory": "header",
        "label": "Total Visible Events",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R154-H3",
        "elementCategory": "header",
        "label": "Audit Events",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R154-H4",
        "elementCategory": "header",
        "label": "Click record or row to inspect",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R154-H5",
        "elementCategory": "header",
        "label": "Audit Event Trace",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R154-T1",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R154-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R154-TBL1",
        "elementCategory": "table",
        "columns": [
          "Timestamp",
          "User / Actor",
          "Role",
          "Branch",
          "Module",
          "Operation",
          "Affected Record",
          "Change / Description",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R154-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R154-B1",
        "elementCategory": "button",
        "actionName": "Close",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R154-B2",
        "elementCategory": "button",
        "actionName": "View Source Record",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R154-B3",
        "elementCategory": "button",
        "actionName": "Return to Audit Log",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  },
  {
    "route": "/audit-log/:id",
    "routeName": "audit-log-direct-alias-2",
    "component": "src/views/system/AuditLog.vue",
    "stageId": "M8",
    "stageTitle": "Action Centre Triage, Audit & Day-End Z-Closing",
    "chapter": "8.4",
    "chapterTitle": "Audit Logs & Operational Traceability",
    "checkpointsCount": 12,
    "checkpoints": [
      {
        "checkpointId": "M8-R155-H1",
        "elementCategory": "header",
        "label": "Audit Log",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R155-H2",
        "elementCategory": "header",
        "label": "Total Visible Events",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R155-H3",
        "elementCategory": "header",
        "label": "Audit Events",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R155-H4",
        "elementCategory": "header",
        "label": "Click record or row to inspect",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R155-H5",
        "elementCategory": "header",
        "label": "Audit Event Trace",
        "trainingType": "observe",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R155-T1",
        "elementCategory": "tab",
        "label": "Clear Filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R155-T2",
        "elementCategory": "tab",
        "label": "Reset filters",
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R155-TBL1",
        "elementCategory": "table",
        "columns": [
          "Timestamp",
          "User / Actor",
          "Role",
          "Branch",
          "Module",
          "Operation",
          "Affected Record",
          "Change / Description",
          "Action"
        ],
        "trainingType": "inspect",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R155-F1",
        "elementCategory": "field",
        "fieldName": "searchQuery",
        "trainingType": "practice",
        "interactiveMode": "input-practice",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R155-B1",
        "elementCategory": "button",
        "actionName": "Close",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R155-B2",
        "elementCategory": "button",
        "actionName": "View Source Record",
        "trainingType": "execute",
        "status": "covered"
      },
      {
        "checkpointId": "M8-R155-B3",
        "elementCategory": "button",
        "actionName": "Return to Audit Log",
        "trainingType": "execute",
        "status": "covered"
      }
    ],
    "coverageStatus": "100% Covered"
  }
];

export const totalBranchManagerRoutes = 155;
export const totalBranchManagerCheckpoints = 3394;

export default {
  coverageRegistry: branchManagerCoverageRegistry,
  totalRoutes: totalBranchManagerRoutes,
  totalCheckpoints: totalBranchManagerCheckpoints
};
