const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const mdPath = path.join(__dirname, '..', 'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

// Configure marked options
marked.setOptions({
    gfm: true,
    breaks: true
});

// Custom marked renderer for clean, professional executive styling
const renderer = new marked.Renderer();

// Custom Heading Renderer
renderer.heading = function({ tokens, depth, raw }) {
    const text = this.parser.parseInline(tokens);
    const plainText = raw.replace(/[^\w\s-]/g, '').trim();
    const id = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Q&A Question Detection (depth 3, e.g. ### Q27: What is...)
    const qMatch = raw.match(/^Q([0-9A-Za-z_-]+):?\s*(.*)/i);
    if (depth === 3 && qMatch) {
        const qid = ('Q' + qMatch[1]).toUpperCase();
        const titleText = qMatch[2] || plainText;
        const anchorId = qid.toLowerCase();
        return `
        <div class="qa-card-anchor" id="${anchorId}"></div>
        <div class="qa-card" data-qid="${qid}">
            <div class="qa-header">
                <div class="d-flex align-items-center gap-2">
                    <span class="qid-badge">${qid}</span>
                    <h4 class="qa-title mb-0">${titleText}</h4>
                </div>
                <button class="btn btn-sm btn-link copy-link-btn text-muted p-0" onclick="copyCardLink('${anchorId}')" title="Copy direct link to ${qid}">
                    <i class="fas fa-link"></i>
                </button>
            </div>
            <div class="qa-body">
        `;
    }

    // SECTION Banner
    if (raw.toUpperCase().includes('SECTION ') && depth <= 3) {
        return `<div class="section-banner" id="${id}"><div class="section-tag">SECTION ARCHITECTURE</div><h3 class="mb-0">${text}</h3></div>`;
    }

    // PART Banner
    if (raw.toUpperCase().includes('PART ') && depth <= 3) {
        return `<div class="part-banner" id="${id}"><div class="part-pill"><i class="fas fa-folder-open me-1"></i> OPERATIONAL MODULE</div><h3 class="part-title mb-0">${text}</h3></div>`;
    }

    // APPENDIX Banner
    if (raw.toUpperCase().includes('APPENDIX') && depth <= 3) {
        return `<div class="appendix-banner" id="${id}"><div class="appendix-pill"><i class="fas fa-bookmark me-1"></i> ARCHITECTURAL APPENDIX</div><h3 class="appendix-title mb-0">${text}</h3></div>`;
    }

    // Main document headings
    if (depth === 1) {
        return `<h1 class="doc-main-title mt-4 mb-3" id="${id}">${text}</h1>`;
    }
    if (depth === 2) {
        return `<h2 class="doc-section-title mt-4 mb-2 pb-2 border-bottom" id="${id}">${text}</h2>`;
    }
    return `<h${depth} class="doc-sub-heading mt-3 mb-2" id="${id}">${text}</h${depth}>`;
};

// Custom Table Renderer
renderer.table = function(token) {
    let headerHtml = '';
    token.header.forEach(cell => {
        headerHtml += `<th>${this.parser.parseInline(cell.tokens)}</th>`;
    });

    let bodyHtml = '';
    token.rows.forEach(row => {
        bodyHtml += '<tr>';
        row.forEach(cell => {
            bodyHtml += `<td>${this.parser.parseInline(cell.tokens)}</td>`;
        });
        bodyHtml += '</tr>';
    });

    return `
    <div class="table-responsive my-3 custom-table-wrapper">
        <table class="table table-hover custom-table mb-0 align-middle">
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${bodyHtml}</tbody>
        </table>
    </div>
    `;
};

// Custom Blockquote Renderer
renderer.blockquote = function(token) {
    const quoteContent = this.parser.parse(token.tokens);
    return `<div class="executive-callout my-3"><i class="fas fa-shield-halved callout-icon"></i><div class="callout-content">${quoteContent}</div></div>`;
};

// Custom Horizontal Rule (closes QA card if open)
renderer.hr = function() {
    return `</div></div><div class="qa-divider"></div>`;
};

// Parse Markdown content to HTML using marked
const rawHtml = marked(mdContent, { renderer });

// Extract Table of Contents items for Sidebar
const tocSections = [
    {
        title: "SECTION I: Foundations & Getting Started",
        id: "section-i-foundations-getting-started",
        parts: [
            { id: "part-1-understanding-aj-ecodrive-the-ev-dealership-model-q1-q12", title: "Part 1: Understanding AJ EcoDrive (Q1–Q12)" },
            { id: "part-2-workstation-platforms-user-login-categories-q13-q24", title: "Part 2: Workstation Platforms & Logins (Q13–Q24)" },
            { id: "part-3-morning-showroom-opening-system-daily-start-q25-q36", title: "Part 3: Showroom Daily Opening (Q25–Q36)" }
        ]
    },
    {
        title: "SECTION II: Central Command & Action Centre",
        id: "section-ii-central-command-collaboration-the-action-centre",
        parts: [
            { id: "part-4-the-dealership-action-centre-the-command-bridge-q37-q52", title: "Part 4: Action Centre Command Bridge (Q37–Q52)" },
            { id: "part-5-the-5-standard-enterprise-action-flows-q53-q68", title: "Part 5: 5 Standard Enterprise Flows (Q53–Q68)" },
            { id: "part-6-the-action-creation-wizard-decision-treatment-drawer-q69-q84", title: "Part 6: Creation Wizard & Decision Drawer (Q69–Q84)" }
        ]
    },
    {
        title: "SECTION III: Showroom Sales Lifecycle",
        id: "section-iii-the-showroom-sales-lifecycle-walk-in-to-delivery",
        parts: [
            { id: "part-7-walk-in-customers-capturing-sales-leads-q85-q98", title: "Part 7: Walk-In Customers & Leads (Q85–Q98)" },
            { id: "part-8-customer-registration-cnic-verification-kyc-q99-q112", title: "Part 8: CNIC Registration & KYC (Q99–Q112)" },
            { id: "part-9-formal-pricing-customer-quotations-q113-q128", title: "Part 9: Pricing & Customer Quotations (Q113–Q128)" },
            { id: "part-10-instant-point-of-sale-pos-sales-order-confirmation-q129-q144", title: "Part 10: Point of Sale (POS) vs Orders (Q129–Q144)" },
            { id: "part-11-invoicing-deposits-customer-money-collections-q145-q158", title: "Part 11: Invoicing & Money Collections (Q145–Q158)" },
            { id: "part-12-pre-delivery-inspection-pdi-official-gate-pass-handover-q159-q174", title: "Part 12: PDI Checklist & Gate Pass (Q159–Q174)" }
        ]
    },
    {
        title: "SECTION IV: Workshop, Service & Battery Warranty",
        id: "section-iv-after-sales-service-workshop-warranty-ownership-journey",
        parts: [
            { id: "part-13-workshop-intake-opening-service-cases-q175-q188", title: "Part 13: Service Intake & Cases (Q175–Q188)" },
            { id: "part-14-workshop-repair-execution-mechanic-job-cards-q189-q202", title: "Part 14: Repair Execution & Job Cards (Q189–Q202)" },
            { id: "part-15-lithium-battery-warranties-bms-diagnostics-q203-q218", title: "Part 15: Lithium Battery & BMS Warranty (Q203–Q218)" },
            { id: "part-16-vehicle-cancellations-returns-customer-refund-settlement-q219-q232", title: "Part 16: Cancellations & Returns (Q219–Q232)" }
        ]
    },
    {
        title: "SECTION V: Inventory, Transfers & Quality",
        id: "section-v-showroom-inventory-transfers-quality-control",
        parts: [
            { id: "part-17-showroom-inventory-serialized-unit-management-q233-q246", title: "Part 17: Serialized Floor Units (Q233–Q246)" },
            { id: "part-18-showroom-stock-replenishment-requisitions-q247-q258", title: "Part 18: Stock Replenishment Requisitions (Q247–Q258)" },
            { id: "part-19-inter-branch-stock-transfers-in-transit-custody-q259-q272", title: "Part 19: Inter-Branch Stock Transfers (Q259–Q272)" },
            { id: "part-20-inbound-delivery-receiving-transit-discrepancies-q273-q286", title: "Part 20: Inbound Delivery Receiving (Q273–Q286)" },
            { id: "part-21-blind-physical-cycle-counts-inventory-audits-q287-q300", title: "Part 21: Blind Physical Cycle Counts (Q287–Q300)" },
            { id: "part-22-quality-quarantine-defective-stock-isolation-q301-q314", title: "Part 22: Quality Quarantine Isolation (Q301–Q314)" }
        ]
    },
    {
        title: "SECTION VI: Cash Controls, Expenses & Day-End",
        id: "section-vi-cash-protection-expenses-day-end-reconciliation",
        parts: [
            { id: "part-23-showroom-operating-expenses-petty-cash-q315-q328", title: "Part 23: Showroom Expenses & Petty Cash (Q315–Q328)" },
            { id: "part-24-day-end-closing-reconciliation-daily-z-report-q329-q342", title: "Part 24: Day-End Closing & Z-Report (Q329–Q342)" }
        ]
    },
    {
        title: "SECTION VII: Head Office Procurement & Administration",
        id: "section-vii-head-office-governance-procurement-network-administration",
        parts: [
            { id: "part-25-sea-container-imports-procurement-supplier-management-q343-q358", title: "Part 25: Sea Container Procurement (Q343–Q358)" },
            { id: "part-26-showroom-branches-user-accounts-security-permissions-q359-q374", title: "Part 26: Showroom Branches & Security (Q359–Q374)" }
        ]
    },
    {
        title: "SECTION VIII: Collaboration Matrix & Appendices",
        id: "section-viii-collaboration-matrix-architecture-appendices",
        parts: [
            { id: "part-27-super-admin-branch-manager-10-master-touchpoints-collaboration-matrix-q375-q390", title: "Part 27: 10 Master Touchpoints Matrix (Q375–Q390)" },
            { id: "part-28-offline-continuity-synchronization-local-workstation-architecture-q391-q405", title: "Part 28: Offline Continuity & Local DB (Q391–Q405)" },
            { id: "appendix-a-policy-summary-operational-continuity-synchronization", title: "Appendix A: Operational Continuity Policy" },
            { id: "appendix-b-target-production-topology-blueprint", title: "Appendix B: Target Production Topology" },
            { id: "appendix-e-failure-recovery-scenarios-matrix-18-critical-events", title: "Appendix E: 18 Failure Recovery Scenarios" },
            { id: "appendix-h-core-production-acceptance-criteria", title: "Appendix H: Acceptance Criteria" }
        ]
    }
];

let sidebarNavHtml = '';
tocSections.forEach(sec => {
    sidebarNavHtml += `
    <div class="sidebar-section-group mb-3">
        <div class="sidebar-section-title">${sec.title}</div>
        <ul class="sidebar-nav-list list-unstyled mb-0">
    `;
    sec.parts.forEach(p => {
        sidebarNavHtml += `<li><a href="#${p.id}" class="sidebar-nav-link">${p.title}</a></li>`;
    });
    sidebarNavHtml += `</ul></div>`;
});

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AJ EcoDrive — Client Operations Guide & Complete Architecture Manual (400+ Q&A)</title>
    
    <!-- Google Fonts & Favicon -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- Bootstrap 5.3 & FontAwesome 6 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">

    <style>
        :root {
            --brand-green-primary: #165A31;
            --brand-green-dark: #0f3d21;
            --brand-green-light: #eefcf2;
            --brand-emerald: #10b981;
            --brand-gold: #f59e0b;
            --brand-gold-soft: #fef3c7;
            --brand-dark: #090d16;
            --brand-slate: #0f172a;
            --brand-slate-light: #1e293b;
            --brand-border: #e2e8f0;
            --brand-border-subtle: #f1f5f9;
            --brand-text-main: #1e293b;
            --brand-text-muted: #64748b;
            --bg-body: #f8fafc;
            --bg-card: #ffffff;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg-body);
            color: var(--brand-text-main);
            line-height: 1.65;
            -webkit-font-smoothing: antialiased;
        }

        /* Top Sticky Navbar */
        .top-navbar {
            background: linear-gradient(135deg, #090d16 0%, #0f172a 100%);
            border-bottom: 3px solid var(--brand-gold);
            position: sticky;
            top: 0;
            z-index: 1040;
            padding: 12px 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .brand-logo-area {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
        }

        .brand-text-main {
            font-size: 1.25rem;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.02em;
        }

        .brand-text-accent {
            color: var(--brand-gold);
        }

        .badge-manual-version {
            background: rgba(245, 158, 11, 0.15);
            border: 1px solid var(--brand-gold);
            color: var(--brand-gold);
            font-size: 0.7rem;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 999px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* Search Box */
        .search-wrapper {
            position: relative;
            max-width: 460px;
            width: 100%;
        }

        .search-wrapper input {
            background: #1e293b;
            border: 1px solid #334155;
            color: #ffffff;
            padding: 8px 16px 8px 38px;
            border-radius: 30px;
            font-size: 0.88rem;
            width: 100%;
            transition: all 0.2s ease;
        }

        .search-wrapper input:focus {
            outline: none;
            background: #090d16;
            border-color: var(--brand-gold);
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.25);
        }

        .search-wrapper i {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            font-size: 0.85rem;
        }

        /* Layout Structure: Sidebar + Main Content */
        .layout-container {
            display: flex;
            max-width: 1540px;
            margin: 0 auto;
            min-height: calc(100vh - 65px);
        }

        /* Left Navigation Sidebar */
        .sidebar-left {
            width: 320px;
            flex-shrink: 0;
            background: #ffffff;
            border-right: 1px solid var(--brand-border);
            position: sticky;
            top: 65px;
            height: calc(100vh - 65px);
            overflow-y: auto;
            padding: 20px 16px 40px;
            scrollbar-width: thin;
        }

        .sidebar-section-title {
            font-size: 0.72rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--brand-text-muted);
            margin-bottom: 6px;
            padding-left: 8px;
        }

        .sidebar-nav-link {
            display: block;
            padding: 5px 10px;
            font-size: 0.82rem;
            color: #334155;
            text-decoration: none;
            border-radius: 6px;
            transition: all 0.15s ease;
            line-height: 1.4;
            margin-bottom: 2px;
        }

        .sidebar-nav-link:hover {
            background: var(--brand-green-light);
            color: var(--brand-green-primary);
            font-weight: 600;
            padding-left: 14px;
        }

        /* Main Content Viewport */
        .main-content {
            flex-grow: 1;
            padding: 32px 40px 100px;
            max-width: 1220px;
        }

        /* Hero Card */
        .hero-guide-card {
            background: linear-gradient(135deg, #090d16 0%, #165A31 100%);
            color: #ffffff;
            border-radius: 16px;
            padding: 32px 36px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(9, 13, 22, 0.15);
            border: 1px solid rgba(245, 158, 11, 0.25);
            position: relative;
            overflow: hidden;
        }

        .hero-guide-card::after {
            content: "";
            position: absolute;
            right: -20px;
            bottom: -30px;
            width: 220px;
            height: 220px;
            background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
            pointer-events: none;
        }

        .hero-guide-card h1 {
            font-size: 1.75rem;
            font-weight: 800;
            line-height: 1.25;
            letter-spacing: -0.02em;
            margin-bottom: 10px;
        }

        /* Presentation Live Access Credentials Card */
        .demo-credentials-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 12px;
            padding: 16px 20px;
            margin-top: 22px;
        }

        .cred-pill {
            background: rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 4px 10px;
            border-radius: 6px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            color: #fef08a;
            font-weight: 700;
        }

        /* Stats Strip */
        .metric-badges-strip {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 28px;
        }

        .metric-badge-item {
            background: #ffffff;
            border: 1px solid var(--brand-border);
            padding: 7px 14px;
            border-radius: 8px;
            font-size: 0.82rem;
            font-weight: 700;
            color: var(--brand-text-main);
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
            display: inline-flex;
            align-items: center;
            gap: 7px;
        }

        /* Section Banners */
        .section-banner {
            background: linear-gradient(135deg, #090d16 0%, #1e293b 100%);
            color: #ffffff;
            border-radius: 12px;
            padding: 18px 24px;
            margin: 48px 0 20px;
            border-left: 6px solid var(--brand-gold);
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
        }

        .section-tag {
            font-size: 0.68rem;
            font-weight: 800;
            color: var(--brand-gold);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 4px;
        }

        .section-banner h3 {
            font-size: 1.25rem;
            font-weight: 800;
            letter-spacing: -0.01em;
        }

        /* Part Banners */
        .part-banner {
            background: #ffffff;
            border: 1px solid var(--brand-border);
            border-left: 5px solid var(--brand-green-primary);
            border-radius: 10px;
            padding: 14px 20px;
            margin: 32px 0 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .part-pill {
            font-size: 0.68rem;
            font-weight: 800;
            color: var(--brand-green-primary);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 2px;
        }

        .part-title {
            font-size: 1.08rem;
            font-weight: 800;
            color: var(--brand-dark);
        }

        /* Appendix Banner */
        .appendix-banner {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-left: 5px solid var(--brand-gold);
            border-radius: 10px;
            padding: 14px 20px;
            margin: 32px 0 16px;
        }

        .appendix-pill {
            font-size: 0.68rem;
            font-weight: 800;
            color: #b45309;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 2px;
        }

        .appendix-title {
            font-size: 1.08rem;
            font-weight: 800;
            color: #78350f;
        }

        /* Q&A Cards */
        .qa-card-anchor {
            position: relative;
            top: -85px;
            visibility: hidden;
        }

        .qa-card {
            background: #ffffff;
            border: 1px solid var(--brand-border);
            border-radius: 12px;
            margin-bottom: 18px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
            transition: all 0.2s ease;
            overflow: hidden;
        }

        .qa-card:hover {
            border-color: #cbd5e1;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        }

        .qa-header {
            background: #f8fafc;
            border-bottom: 1px solid var(--brand-border);
            padding: 12px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        .qid-badge {
            background: var(--brand-dark);
            color: var(--brand-gold);
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.78rem;
            font-weight: 800;
            padding: 4px 8px;
            border-radius: 6px;
            flex-shrink: 0;
            letter-spacing: 0.02em;
        }

        .qa-title {
            font-size: 0.96rem;
            font-weight: 700;
            color: var(--brand-dark);
            line-height: 1.4;
        }

        .copy-link-btn {
            opacity: 0.3;
            transition: opacity 0.2s ease;
            text-decoration: none;
            cursor: pointer;
        }

        .qa-card:hover .copy-link-btn {
            opacity: 0.9;
        }

        .qa-body {
            padding: 18px 20px;
            font-size: 0.92rem;
            color: #334155;
            line-height: 1.7;
        }

        .qa-body p:last-child {
            margin-bottom: 0;
        }

        .qa-body code {
            font-family: 'JetBrains Mono', monospace;
            background: #f1f5f9;
            color: #0f766e;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.84em;
        }

        .qa-body ul, .qa-body ol {
            padding-left: 20px;
            margin-top: 8px;
            margin-bottom: 12px;
        }

        .qa-body li {
            margin-bottom: 4px;
        }

        .qa-divider {
            height: 6px;
        }

        /* Custom Tables */
        .custom-table-wrapper {
            border: 1px solid var(--brand-border);
            border-radius: 10px;
            overflow: hidden;
            background: #ffffff;
        }

        .custom-table {
            font-size: 0.86rem;
            margin-bottom: 0;
        }

        .custom-table thead th {
            background: #090d16;
            color: var(--brand-gold);
            font-weight: 700;
            font-size: 0.76rem;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            padding: 11px 14px;
            border-color: #1e293b;
            white-space: nowrap;
        }

        .custom-table tbody td {
            padding: 10px 14px;
            border-color: #f1f5f9;
            color: #1e293b;
        }

        .custom-table tbody tr:nth-child(even) {
            background-color: #fafbfc;
        }

        /* Executive Callouts */
        .executive-callout {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-left: 5px solid #2563eb;
            border-radius: 8px;
            padding: 14px 18px;
            display: flex;
            gap: 12px;
            align-items: flex-start;
        }

        .callout-icon {
            color: #2563eb;
            font-size: 1.1rem;
            margin-top: 2px;
            flex-shrink: 0;
        }

        .callout-content {
            font-size: 0.9rem;
            color: #1e3a8a;
            line-height: 1.6;
        }

        .callout-content p:last-child {
            margin-bottom: 0;
        }

        /* Floating Top Button */
        .floating-top-btn {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: var(--brand-dark);
            color: var(--brand-gold);
            border: 2px solid var(--brand-gold);
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            cursor: pointer;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
            z-index: 1000;
            text-decoration: none;
        }

        .floating-top-btn:hover {
            background: var(--brand-gold);
            color: var(--brand-dark);
            transform: translateY(-2px);
        }

        /* Toast notification */
        .toast-copied {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #090d16;
            color: #ffffff;
            padding: 8px 18px;
            border-radius: 30px;
            font-size: 0.85rem;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
            border: 1px solid var(--brand-gold);
            z-index: 2000;
            display: none;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
            .sidebar-left {
                display: none;
            }
            .main-content {
                padding: 20px 16px 80px;
            }
            .hero-guide-card {
                padding: 24px 20px;
            }
            .hero-guide-card h1 {
                font-size: 1.35rem;
            }
        }
    </style>
</head>
<body>

    <!-- Sticky Navigation Header -->
    <header class="top-navbar">
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <a href="https://aj-eco-drive.vercel.app" target="_blank" class="brand-logo-area">
                <i class="fas fa-bolt text-warning fs-5"></i>
                <span class="brand-text-main">AJ <span class="brand-text-accent">EcoDrive</span></span>
                <span class="badge-manual-version d-none d-sm-inline">CLIENT GUIDE V3.0</span>
            </a>

            <div class="search-wrapper">
                <i class="fas fa-search"></i>
                <input type="text" id="guideSearchInput" placeholder="Instant Search 400+ Q&As (e.g., Q27, POS, battery, cash)..." aria-label="Search Operations Guide">
            </div>

            <div class="d-flex align-items-center gap-2">
                <a href="https://aj-eco-drive.vercel.app" target="_blank" class="btn btn-sm btn-warning fw-bold text-dark px-3 shadow-sm">
                    <i class="fas fa-desktop me-1"></i> Live Demo App
                </a>
                <a href="https://github.com/SkyraSoft/AJ-EcoDrive" target="_blank" class="btn btn-sm btn-outline-light px-3">
                    <i class="fab fa-github me-1"></i> GitHub
                </a>
            </div>
        </div>
    </header>

    <!-- Master Layout: Sidebar + Reading Canvas -->
    <div class="layout-container">
        
        <!-- Left Navigation Sidebar -->
        <aside class="sidebar-left">
            <div class="d-flex align-items-center justify-content-between mb-3 px-2">
                <span class="fw-bold text-dark small"><i class="fas fa-list-check text-warning me-1"></i> OPERATIONAL INDEX</span>
                <span class="badge bg-light text-secondary border font-monospace">400+ Q&As</span>
            </div>
            ${sidebarNavHtml}
        </aside>

        <!-- Main Reading Content Canvas -->
        <main class="main-content">
            
            <!-- Hero Header Banner -->
            <div class="hero-guide-card">
                <div class="badge bg-warning text-dark fw-bold mb-2">MASTER CLIENT SPECIFICATION — V3.0</div>
                <h1>AJ EcoDrive — Client Operations Guide &amp; Systems Architecture QA</h1>
                <p class="mb-0 text-white-50 small">
                    Comprehensive Operational Manual, Non-Technical Leadership Guide &amp; Master System Specification for Dealership Owners, Board Members, Head Office Executives, and Branch Managers.
                </p>

                <!-- Live Access Demo Credentials Card -->
                <div class="demo-credentials-card">
                    <div class="row g-3 align-items-center">
                        <div class="col-md-3 col-sm-6">
                            <div class="text-warning fw-bold text-uppercase" style="font-size: 0.7rem;"><i class="fas fa-globe me-1"></i> Production URL</div>
                            <a href="https://aj-eco-drive.vercel.app" target="_blank" class="text-white text-decoration-none fw-semibold small">aj-eco-drive.vercel.app</a>
                        </div>
                        <div class="col-md-3 col-sm-6">
                            <div class="text-warning fw-bold text-uppercase" style="font-size: 0.7rem;"><i class="fas fa-key me-1"></i> Universal Demo Password</div>
                            <span class="cred-pill">password123</span>
                        </div>
                        <div class="col-md-3 col-sm-6">
                            <div class="text-warning fw-bold text-uppercase" style="font-size: 0.7rem;"><i class="fas fa-user-shield me-1"></i> Head Office (Super Admin)</div>
                            <span class="cred-pill">ADMIN</span>
                        </div>
                        <div class="col-md-3 col-sm-6">
                            <div class="text-warning fw-bold text-uppercase" style="font-size: 0.7rem;"><i class="fas fa-store me-1"></i> Showroom Branches</div>
                            <span class="text-white small fw-bold font-monospace">PEW-01, ISB-01, LHE-01, RWP-01</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Metric Badges Strip -->
            <div class="metric-badges-strip">
                <span class="metric-badge-item"><i class="fas fa-clipboard-check text-success"></i> 400+ Standard Q&amp;A Answers</span>
                <span class="metric-badge-item"><i class="fas fa-bolt text-warning"></i> 9 Instant In-Context Quick Action Modals</span>
                <span class="metric-badge-item"><i class="fas fa-sitemap text-info"></i> 5 Enterprise Action Centre Flows</span>
                <span class="metric-badge-item"><i class="fas fa-building text-primary"></i> 4 Nationwide Dealership Showrooms</span>
                <span class="metric-badge-item"><i class="fas fa-wifi text-secondary"></i> Offline Local Durability Ready</span>
            </div>

            <!-- Search Status Pill (Shows matching count when filtering) -->
            <div id="searchStatsPill" class="alert alert-info py-2 px-3 small d-none align-items-center justify-content-between mb-3">
                <span><i class="fas fa-filter me-1"></i> Showing <strong id="matchCountNum">0</strong> matching questions</span>
                <button class="btn btn-sm btn-outline-primary py-0 px-2" onclick="resetSearch()">Clear Filter</button>
            </div>

            <!-- Parsed Content Body -->
            <div id="qaContentWrapper">
                ${rawHtml}
            </div>

        </main>
    </div>

    <!-- Floating Back to Top Button -->
    <a href="#" class="floating-top-btn" title="Back to Top">
        <i class="fas fa-chevron-up"></i>
    </a>

    <!-- Toast Notification for Copied Link -->
    <div id="toastCopied" class="toast-copied">
        <i class="fas fa-check-circle text-warning me-1"></i> Question link copied to clipboard!
    </div>

    <!-- Bootstrap 5 Scripts & Interactive Filtering -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Copy direct link to clipboard
        function copyCardLink(anchorId) {
            const url = window.location.origin + window.location.pathname + '#' + anchorId;
            navigator.clipboard.writeText(url).then(() => {
                const toast = document.getElementById('toastCopied');
                toast.style.display = 'block';
                setTimeout(() => { toast.style.display = 'none'; }, 2200);
            });
        }

        // Reset search filter
        function resetSearch() {
            const input = document.getElementById('guideSearchInput');
            if (input) {
                input.value = '';
                input.dispatchEvent(new Event('input'));
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('guideSearchInput');
            const qaCards = document.querySelectorAll('.qa-card');
            const searchStats = document.getElementById('searchStatsPill');
            const matchCountNum = document.getElementById('matchCountNum');

            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase().trim();
                    let matchCount = 0;

                    if (!query) {
                        qaCards.forEach(card => card.style.display = '');
                        if (searchStats) searchStats.classList.add('d-none');
                        searchStats.classList.remove('d-flex');
                        return;
                    }

                    qaCards.forEach(card => {
                        const qid = (card.getAttribute('data-qid') || '').toLowerCase();
                        const text = card.innerText.toLowerCase();

                        if (qid.includes(query) || text.includes(query)) {
                            card.style.display = '';
                            matchCount++;
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    if (searchStats) {
                        matchCountNum.innerText = matchCount;
                        searchStats.classList.remove('d-none');
                        searchStats.classList.add('d-flex');
                    }
                });
            }

            // Smooth scrolling for sidebar links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href').substring(1);
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        window.history.pushState(null, null, '#' + targetId);

                        // If it's a QA card anchor, highlight the card
                        const card = targetEl.nextElementSibling;
                        if (card && card.classList.contains('qa-card')) {
                            card.style.transition = 'all 0.4s ease';
                            card.style.borderColor = '#f59e0b';
                            card.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.35)';
                            setTimeout(() => {
                                card.style.borderColor = '';
                                card.style.boxShadow = '';
                            }, 2500);
                        }
                    }
                });
            });
        });
    </script>
</body>
</html>
`;

// Write to Complete Guide.html, public/guide.html, and public/complete-guide.html
const rootPath = path.join(__dirname, '..', 'Complete Guide.html');
const publicGuidePath = path.join(__dirname, '..', 'public', 'guide.html');
const publicCompleteGuidePath = path.join(__dirname, '..', 'public', 'complete-guide.html');

fs.writeFileSync(rootPath, fullHtml, 'utf8');
fs.writeFileSync(publicGuidePath, fullHtml, 'utf8');
fs.writeFileSync(publicCompleteGuidePath, fullHtml, 'utf8');

console.log('Successfully generated clean, balanced, executive HTML Guide:');
console.log('1. ' + rootPath + ' (' + fullHtml.length + ' bytes)');
console.log('2. ' + publicGuidePath);
console.log('3. ' + publicCompleteGuidePath);
