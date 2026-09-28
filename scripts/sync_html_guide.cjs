const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', 'AJ_ECODRIVE_COMPLETE_CLIENT_GUIDE_QA.md');
const mdContent = fs.readFileSync(mdPath, 'utf8');

// Helper to convert inline markdown to HTML
function formatInline(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

// Helper to parse markdown tables
function renderTable(tableLines) {
    if (tableLines.length < 2) return '';
    const headerLine = tableLines[0];
    const rows = tableLines.slice(2); // skip separator

    const parseRow = (line) => {
        return line.split('|')
            .map(c => c.trim())
            .filter((c, i, arr) => i > 0 && i < arr.length - 1);
    };

    const headers = parseRow(headerLine);
    let html = '<div class="table-responsive my-3"><table class="table table-bordered table-striped custom-table">\n<thead><tr>';
    headers.forEach(h => {
        html += `<th>${formatInline(h)}</th>`;
    });
    html += '</tr></thead>\n<tbody>';

    rows.forEach(r => {
        if (!r.trim()) return;
        const cells = parseRow(r);
        html += '<tr>';
        cells.forEach(c => {
            html += `<td>${formatInline(c)}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table></div>\n';
    return html;
}

// Convert markdown blocks to HTML
function markdownToHtml(md) {
    const lines = md.split('\n');
    let html = '';
    let inTable = false;
    let tableLines = [];
    let inList = false;
    let listType = 'ul';

    const closeList = () => {
        if (inList) {
            html += listType === 'ul' ? '</ul>\n' : '</ol>\n';
            inList = false;
        }
    };

    const closeTable = () => {
        if (inTable) {
            html += renderTable(tableLines);
            inTable = false;
            tableLines = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Table line detection
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            closeList();
            inTable = true;
            tableLines.push(trimmed);
            continue;
        } else {
            closeTable();
        }

        // Section / Part Header detection
        if (trimmed.startsWith('# ')) {
            closeList();
            const title = trimmed.replace('# ', '');
            html += `<div class="main-section-heading" id="${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"><h2>${formatInline(title)}</h2></div>\n`;
            continue;
        }

        if (trimmed.startsWith('### SECTION') || trimmed.startsWith('## SECTION')) {
            closeList();
            const title = trimmed.replace(/^#+\s*/, '');
            html += `<div class="section-banner" id="${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"><h3><i class="fas fa-layer-group me-2"></i>${formatInline(title)}</h3></div>\n`;
            continue;
        }

        if (trimmed.startsWith('### PART') || trimmed.startsWith('## PART')) {
            closeList();
            const title = trimmed.replace(/^#+\s*/, '');
            html += `<div class="part-banner" id="${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"><h4><i class="fas fa-folder-open me-2 text-warning"></i>${formatInline(title)}</h4></div>\n`;
            continue;
        }

        if (trimmed.startsWith('### APPENDIX') || trimmed.startsWith('## APPENDIX')) {
            closeList();
            const title = trimmed.replace(/^#+\s*/, '');
            html += `<div class="appendix-banner" id="${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"><h4><i class="fas fa-book-bookmark me-2 text-warning"></i>${formatInline(title)}</h4></div>\n`;
            continue;
        }

        // Q&A Question Detection
        if (trimmed.startsWith('### Q') || trimmed.startsWith('#### Q') || trimmed.startsWith('### **Q')) {
            closeList();
            const qMatch = trimmed.match(/^#+\s*\*?\*?(Q[0-9A-Za-z_-]+):?\*?\*?\s*(.*)/i);
            if (qMatch) {
                const qid = qMatch[1].toUpperCase();
                const qText = qMatch[2].replace(/^\*+/, '').replace(/\*+$/, '').trim();
                const anchorId = qid.toLowerCase();
                html += `
                <div class="qa-card" id="${anchorId}" data-qid="${qid}">
                    <div class="qa-header">
                        <span class="badge bg-gold text-dark fw-bold qid-badge">${qid}</span>
                        <span class="qa-title">${formatInline(qText)}</span>
                        <a href="#${anchorId}" class="permalink-icon text-muted ms-auto" title="Copy Direct Link"><i class="fas fa-link"></i></a>
                    </div>
                    <div class="qa-body">
                `;
                continue;
            }
        }

        // Q&A Answer Start
        if (trimmed.startsWith('**Answer:**')) {
            const ansContent = trimmed.replace('**Answer:**', '').trim();
            html += `<p class="ans-lead"><strong>Answer:</strong> ${formatInline(ansContent)}</p>\n`;
            continue;
        }

        // Close Q&A item on divider
        if (trimmed === '---' || trimmed === '___') {
            closeList();
            if (html.lastIndexOf('<div class="qa-body">') > html.lastIndexOf('</div>\n                </div>')) {
                html += `</div>\n</div>\n`;
            } else {
                html += `<hr class="my-4 border-secondary opacity-25">\n`;
            }
            continue;
        }

        // Callouts / Blockquotes
        if (trimmed.startsWith('>')) {
            closeList();
            const calloutText = trimmed.replace(/^>\s*/, '');
            html += `<blockquote class="callout-box"><i class="fas fa-info-circle text-warning me-2"></i>${formatInline(calloutText)}</blockquote>\n`;
            continue;
        }

        // Unordered lists
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('+ ')) {
            if (!inList || listType !== 'ul') {
                closeList();
                inList = true;
                listType = 'ul';
                html += '<ul class="qa-list">\n';
            }
            const itemText = trimmed.replace(/^[*+-]\s*/, '');
            html += `<li>${formatInline(itemText)}</li>\n`;
            continue;
        }

        // Ordered lists
        const olMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
        if (olMatch) {
            if (!inList || listType !== 'ol') {
                closeList();
                listType = 'ol';
                html += '<ol class="qa-list">\n';
            }
            html += `<li>${formatInline(olMatch[2])}</li>\n`;
            continue;
        }

        // Close list if normal line encountered
        if (trimmed === '') {
            closeList();
            continue;
        }

        // Subheaders within answers
        if (trimmed.startsWith('#### ') || trimmed.startsWith('##### ')) {
            closeList();
            const subTitle = trimmed.replace(/^#+\s*/, '');
            html += `<h5 class="sub-qa-heading mt-3 mb-2 text-primary-dark">${formatInline(subTitle)}</h5>\n`;
            continue;
        }

        // Normal paragraph
        closeList();
        html += `<p class="qa-p">${formatInline(trimmed)}</p>\n`;
    }

    closeList();
    closeTable();
    return html;
}

const parsedBody = markdownToHtml(mdContent);

const fullHtmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AJ EcoDrive — Comprehensive Client Operations & Systems Architecture Guide (Q&A Manual)</title>
    
    <!-- Google Fonts & Favicon -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">

    <!-- Bootstrap 5 & FontAwesome 6 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">

    <style>
        :root {
            --brand-gold: #f59e0b;
            --brand-gold-soft: #fef3c7;
            --brand-dark: #0f172a;
            --brand-dark-soft: #1e293b;
            --brand-green: #10b981;
            --brand-border: #e2e8f0;
            --brand-text: #1e293b;
            --brand-muted: #64748b;
            --bg-page: #f8fafc;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--bg-page);
            color: var(--brand-text);
            line-height: 1.65;
            padding-bottom: 80px;
        }

        /* Top Sticky Banner */
        .top-nav-bar {
            background: linear-gradient(135deg, #090d16 0%, #0f172a 100%);
            border-bottom: 4px solid var(--brand-gold);
            color: #ffffff;
            padding: 16px 24px;
            position: sticky;
            top: 0;
            z-index: 1050;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .brand-title {
            font-weight: 800;
            font-size: 1.35rem;
            letter-spacing: -0.02em;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .brand-title .accent {
            color: var(--brand-gold);
        }

        .guide-badge {
            background: rgba(245, 158, 11, 0.15);
            border: 1px solid var(--brand-gold);
            color: var(--brand-gold);
            font-size: 0.75rem;
            padding: 4px 10px;
            border-radius: 999px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* Search & Filter Toolbar */
        .search-container {
            position: relative;
            max-width: 420px;
            width: 100%;
        }

        .search-container input {
            background: #1e293b;
            border: 1px solid #334155;
            color: #ffffff;
            padding: 9px 16px 9px 40px;
            border-radius: 30px;
            font-size: 0.9rem;
            width: 100%;
            transition: all 0.2s ease;
        }

        .search-container input:focus {
            outline: none;
            border-color: var(--brand-gold);
            background: #0f172a;
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.25);
        }

        .search-container i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            font-size: 0.85rem;
        }

        /* Hero Header Section */
        .hero-banner {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            border-radius: 16px;
            padding: 32px 36px;
            margin: 28px 0;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
            border: 1px solid #334155;
        }

        .hero-banner h1 {
            font-size: 1.85rem;
            font-weight: 800;
            line-height: 1.3;
            margin-bottom: 12px;
        }

        /* Live Access Presentation Pill Grid */
        .demo-access-card {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            padding: 16px 20px;
            margin-top: 20px;
        }

        /* Section & Part Banners */
        .main-section-heading {
            margin: 40px 0 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid var(--brand-gold);
        }

        .main-section-heading h2 {
            font-weight: 800;
            color: var(--brand-dark);
            font-size: 1.5rem;
        }

        .section-banner {
            background: linear-gradient(90deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 14px 20px;
            border-radius: 10px;
            border-left: 6px solid var(--brand-gold);
            margin: 32px 0 18px;
        }

        .section-banner h3 {
            font-size: 1.15rem;
            font-weight: 700;
            margin: 0;
        }

        .part-banner {
            background: #ffffff;
            border: 1px solid var(--brand-border);
            border-left: 5px solid var(--brand-gold);
            border-radius: 8px;
            padding: 12px 18px;
            margin: 24px 0 14px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .part-banner h4 {
            font-size: 1.05rem;
            font-weight: 700;
            color: var(--brand-dark);
            margin: 0;
        }

        .appendix-banner {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-left: 5px solid var(--brand-gold);
            border-radius: 8px;
            padding: 14px 20px;
            margin: 28px 0 16px;
        }

        .appendix-banner h4 {
            font-size: 1.05rem;
            font-weight: 700;
            color: #92400e;
            margin: 0;
        }

        /* Q&A Cards */
        .qa-card {
            background: #ffffff;
            border: 1px solid var(--brand-border);
            border-radius: 12px;
            margin-bottom: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
            overflow: hidden;
        }

        .qa-card:hover {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
            border-color: #cbd5e1;
        }

        .qa-header {
            background: #f8fafc;
            border-bottom: 1px solid var(--brand-border);
            padding: 14px 18px;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .qid-badge {
            background: var(--brand-dark) !important;
            color: var(--brand-gold) !important;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
            padding: 4px 10px;
            border-radius: 6px;
            flex-shrink: 0;
        }

        .qa-title {
            font-weight: 700;
            color: var(--brand-dark);
            font-size: 0.98rem;
            flex-grow: 1;
            line-height: 1.4;
        }

        .permalink-icon {
            opacity: 0.3;
            transition: opacity 0.2s;
            text-decoration: none;
        }

        .qa-card:hover .permalink-icon {
            opacity: 0.8;
        }

        .qa-body {
            padding: 18px 20px;
            font-size: 0.94rem;
            color: #334155;
            line-height: 1.7;
        }

        .qa-body p.ans-lead {
            font-size: 0.96rem;
            color: #1e293b;
            margin-bottom: 10px;
        }

        .qa-body code {
            font-family: 'JetBrains Mono', monospace;
            background: #f1f5f9;
            color: #0f766e;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.85em;
        }

        .qa-list {
            padding-left: 20px;
            margin-top: 8px;
            margin-bottom: 12px;
        }

        .qa-list li {
            margin-bottom: 5px;
        }

        /* Custom Tables */
        .custom-table {
            font-size: 0.88rem;
            border-color: var(--brand-border);
        }

        .custom-table thead th {
            background: var(--brand-dark);
            color: var(--brand-gold);
            font-weight: 700;
            font-size: 0.82rem;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            padding: 10px 14px;
            border-color: var(--brand-dark);
        }

        .custom-table tbody td {
            padding: 9px 14px;
            vertical-align: middle;
        }

        .custom-table tbody tr:hover {
            background-color: #f1f5f9;
        }

        /* Callout Blockquote */
        .callout-box {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 12px 16px;
            border-radius: 6px;
            margin: 12px 0;
            font-size: 0.92rem;
            color: #1e40af;
        }

        /* Floating Action Buttons */
        .floating-top-btn {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: var(--brand-dark);
            color: var(--brand-gold);
            border: 2px solid var(--brand-gold);
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
            transition: all 0.2s ease;
            z-index: 1000;
            text-decoration: none;
        }

        .floating-top-btn:hover {
            background: var(--brand-gold);
            color: var(--brand-dark);
            transform: translateY(-3px);
        }

        /* Quick Stat Pill */
        .stat-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ffffff;
            color: var(--brand-dark);
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 0.82rem;
            font-weight: 700;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--brand-border);
        }

        @media (max-width: 768px) {
            .hero-banner {
                padding: 20px;
            }
            .hero-banner h1 {
                font-size: 1.4rem;
            }
            .top-nav-bar {
                padding: 12px 16px;
            }
        }
    </style>
</head>
<body>

    <!-- Sticky Navigation Header -->
    <header class="top-nav-bar">
        <div class="container-xl d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div class="brand-title">
                <i class="fas fa-bolt text-warning"></i>
                <span>AJ <span class="accent">EcoDrive</span></span>
                <span class="guide-badge d-none d-md-inline">Client Operations &amp; Systems Manual</span>
            </div>

            <div class="search-container">
                <i class="fas fa-search"></i>
                <input type="text" id="guideSearchInput" placeholder="Search 400+ questions (e.g., Q27, POS, battery, cash)..." aria-label="Search Guide">
            </div>

            <div class="d-flex align-items-center gap-2">
                <a href="https://aj-eco-drive.vercel.app" target="_blank" class="btn btn-sm btn-warning fw-bold">
                    <i class="fas fa-desktop me-1"></i> Live Demo App
                </a>
                <a href="https://github.com/SkyraSoft/AJ-EcoDrive" target="_blank" class="btn btn-sm btn-outline-light">
                    <i class="fab fa-github me-1"></i> Repo
                </a>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <main class="container-xl mt-3">

        <!-- Hero Header -->
        <div class="hero-banner">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                    <span class="badge bg-warning text-dark fw-bold mb-2">MASTER CLIENT SPECIFICATION — V3.0</span>
                    <h1>AJ EcoDrive — Client Operations Guide &amp; Systems Architecture Manual</h1>
                    <p class="mb-0 text-light opacity-85">
                        Comprehensive Operational Manual, Non-Technical Leadership Guide &amp; Master System Specification for Dealership Owners, Board Members, Head Office Executives, and Branch Managers.
                    </p>
                </div>
            </div>

            <!-- Live Access Quick Reference Card -->
            <div class="demo-access-card">
                <div class="row g-3 align-items-center">
                    <div class="col-lg-3 col-md-6">
                        <div class="text-warning fw-bold text-uppercase small mb-1"><i class="fas fa-globe me-1"></i> Production URL</div>
                        <a href="https://aj-eco-drive.vercel.app" target="_blank" class="text-white text-decoration-none fw-semibold">https://aj-eco-drive.vercel.app</a>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <div class="text-warning fw-bold text-uppercase small mb-1"><i class="fas fa-key me-1"></i> Universal Demo Password</div>
                        <span class="text-white font-monospace">password123</span> <span class="text-muted small">(or password)</span>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <div class="text-warning fw-bold text-uppercase small mb-1"><i class="fas fa-user-shield me-1"></i> Head Office Login</div>
                        <span class="text-white font-monospace">ADMIN</span> <span class="badge bg-primary ms-1">Super Admin</span>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <div class="text-warning fw-bold text-uppercase small mb-1"><i class="fas fa-store me-1"></i> Branch Showrooms</div>
                        <span class="text-white font-monospace">PEW-01</span>, <span class="text-white font-monospace">ISB-01</span>, <span class="text-white font-monospace">LHE-01</span>, <span class="text-white font-monospace">RWP-01</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Summary Metrics -->
        <div class="d-flex flex-wrap gap-2 mb-4">
            <span class="stat-pill"><i class="fas fa-clipboard-check text-success"></i> 400+ Standard Q&amp;A Answers</span>
            <span class="stat-pill"><i class="fas fa-bolt text-warning"></i> 9 Instant In-Context Quick Action Modals</span>
            <span class="stat-pill"><i class="fas fa-sitemap text-info"></i> 5 Enterprise Action Centre Flows</span>
            <span class="stat-pill"><i class="fas fa-building text-primary"></i> 4 Nationwide Dealership Showrooms</span>
            <span class="stat-pill"><i class="fas fa-wifi text-secondary"></i> Offline Local Durability Ready</span>
        </div>

        <!-- Parsed Markdown Content -->
        <div id="qaContentWrapper">
            ${parsedBody}
        </div>

    </main>

    <!-- Floating Back to Top Button -->
    <a href="#" class="floating-top-btn" title="Back to Top">
        <i class="fas fa-chevron-up"></i>
    </a>

    <!-- Bootstrap 5 Scripts & Interactive Search Filtering -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('guideSearchInput');
            const qaCards = document.querySelectorAll('.qa-card');

            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase().trim();
                    let matchCount = 0;

                    qaCards.forEach(card => {
                        const qid = (card.getAttribute('data-qid') || '').toLowerCase();
                        const text = card.innerText.toLowerCase();

                        if (!query || qid.includes(query) || text.includes(query)) {
                            card.style.display = '';
                            matchCount++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            }

            // Smooth scrolling to hash anchors
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href').substring(1);
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        window.history.pushState(null, null, '#' + targetId);
                        
                        // Highlight target
                        if (targetEl.classList.contains('qa-card')) {
                            targetEl.style.transition = 'all 0.4s ease';
                            targetEl.style.borderColor = '#f59e0b';
                            targetEl.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.35)';
                            setTimeout(() => {
                                targetEl.style.borderColor = '';
                                targetEl.style.boxShadow = '';
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

// Write to root Complete Guide.html and public/guide.html and public/complete-guide.html
const rootGuidePath = path.join(__dirname, '..', 'Complete Guide.html');
const publicGuidePath = path.join(__dirname, '..', 'public', 'guide.html');
const publicCompleteGuidePath = path.join(__dirname, '..', 'public', 'complete-guide.html');

fs.writeFileSync(rootGuidePath, fullHtmlTemplate, 'utf8');
fs.writeFileSync(publicGuidePath, fullHtmlTemplate, 'utf8');
fs.writeFileSync(publicCompleteGuidePath, fullHtmlTemplate, 'utf8');

console.log('Successfully generated:');
console.log('1. ' + rootGuidePath + ' (' + fullHtmlTemplate.length + ' bytes)');
console.log('2. ' + publicGuidePath);
console.log('3. ' + publicCompleteGuidePath);
