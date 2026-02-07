// DOM Ready
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    populateStageFilter();
    populateStatusFilter();
    renderCases(CASES);
    updateResultsCount(CASES.length, CASES.length);
    setupEventListeners();
    updateStats();
}

// Setup Event Listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            updateFilter('searchQuery', e.target.value);
        });
    }

    // Stage filter
    const stageFilter = document.getElementById('stageFilter');
    if (stageFilter) {
        stageFilter.addEventListener('change', function (e) {
            onStageFilterChange(e.target.value);
        });
    }

    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function (e) {
            updateFilter('status', e.target.value);
        });
    }

    // Date filters
    const dateFrom = document.getElementById('dateFrom');
    if (dateFrom) {
        dateFrom.addEventListener('change', function (e) {
            updateFilter('dateFrom', e.target.value);
        });
    }

    const dateTo = document.getElementById('dateTo');
    if (dateTo) {
        dateTo.addEventListener('change', function (e) {
            updateFilter('dateTo', e.target.value);
        });
    }

    // Clear filters button
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }

    // Modal close
    const modal = document.getElementById('caseModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                closeModal();
            }
        });
    }

    // Escape key to close modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Render Cases Grid
function renderCases(cases) {
    const container = document.getElementById('casesGrid');
    if (!container) return;

    if (cases.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <span class="no-results-icon">🔍</span>
                <h3>No cases found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cases.map(caseData => createCaseCard(caseData)).join('');
}

// Create Case Card HTML
function createCaseCard(caseData) {
    const badgeClass = getStatusBadgeClass(caseData);
    const withdrawnClass = caseData.isWithdrawn ? 'card-withdrawn' : '';
    const nextAction = getNextAction(caseData);

    // Calculate attempts display
    const attemptsHtml = createAttemptsHtml(caseData);

    if (caseData.isWithdrawn) {
        return `
            <div class="case-card ${withdrawnClass}" onclick="openCaseDetail('${caseData.id}')">
                <div class="card-header">
                    <span class="case-id">${caseData.id}</span>
                    <span class="badge ${badgeClass}">WITHDRAWN</span>
                </div>
                <div class="card-body">
                    <p class="parties withdrawn-text">${caseData.petitioner} vs ${caseData.respondent}</p>
                    <div class="stage-info">
                        <span class="stage-icon">🚫</span>
                        <span class="stage-name">Withdrawn at: ${caseData.withdrawnAt.name}</span>
                    </div>
                    <p class="withdrawn-reason">${caseData.withdrawnReason || 'No reason provided'}</p>
                </div>
                <div class="card-footer">
                    <span class="filed-date">Withdrawn: ${formatDate(caseData.withdrawnDate)}</span>
                </div>
            </div>
        `;
    }

    return `
        <div class="case-card ${withdrawnClass}" onclick="openCaseDetail('${caseData.id}')">
            <div class="card-header">
                <span class="case-id">${caseData.id}</span>
                <span class="badge ${badgeClass}">${getShortStageName(caseData.currentStage)}</span>
            </div>
            <div class="card-body">
                <p class="parties">${caseData.petitioner} vs ${caseData.respondent}</p>
                <div class="stage-info">
                    <span class="stage-icon">${caseData.currentStage.icon}</span>
                    <span class="stage-name">${caseData.currentStage.name}</span>
                </div>
                <p class="current-status">Status: ${caseData.currentStatus}</p>
                <div class="attempts-row">
                    ${attemptsHtml}
                </div>
            </div>
            <div class="card-footer">
                <span class="filed-date">Filed: ${formatDate(caseData.filedDate)}</span>
                <span class="next-action">${nextAction}</span>
            </div>
        </div>
    `;
}

// Create attempts HTML
function createAttemptsHtml(caseData) {
    const history = caseData.stageHistory;

    const digitalStage = history.find(h => h.stage.id === 'digital_service');
    const postalStage = history.find(h => h.stage.id === 'postal_service');
    const policeStage = history.find(h => h.stage.id === 'police_service');

    const getIcon = (stage) => {
        if (!stage) return '⏳';
        if (stage.success === true) return '✔️';
        if (stage.success === false) return '❌';
        return '🔄';
    };

    return `
        <span class="attempt" title="Digital Service">Digital ${getIcon(digitalStage)}</span>
        <span class="attempt" title="Postal Service">Post ${getIcon(postalStage)}</span>
        <span class="attempt" title="Police Service">Police ${getIcon(policeStage)}</span>
    `;
}

// Get short stage name for badge
function getShortStageName(stage) {
    const shortNames = {
        'case_filed': 'FILED',
        'summons_issued': 'SUMMONS',
        'digital_service': 'DIGITAL',
        'postal_service': 'POST',
        'police_service': 'POLICE',
        'bailable_warrant': 'BW',
        'non_bailable_warrant': 'NBW',
        'withdrawn': 'WD'
    };
    return shortNames[stage.id] || stage.name.toUpperCase();
}

// Open Case Detail Modal
function openCaseDetail(caseId) {
    const caseData = CASES.find(c => c.id === caseId);
    if (!caseData) return;

    const modal = document.getElementById('caseModal');
    const content = document.getElementById('modalContent');

    if (!modal || !content) return;

    content.innerHTML = createCaseDetailHtml(caseData);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('caseModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Create Case Detail HTML
function createCaseDetailHtml(caseData) {
    const withdrawnClass = caseData.isWithdrawn ? 'detail-withdrawn' : '';
    const badgeClass = getStatusBadgeClass(caseData);

    let headerHtml = `
        <div class="detail-header ${withdrawnClass}">
            <div class="detail-title">
                <h2>${caseData.id}</h2>
                <span class="badge ${badgeClass}">${caseData.isWithdrawn ? 'WITHDRAWN' : caseData.currentStage.name}</span>
            </div>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
    `;

    let infoHtml = `
        <div class="detail-info">
            <div class="info-row">
                <span class="info-label">Petitioner:</span>
                <span class="info-value ${caseData.isWithdrawn ? 'withdrawn-text' : ''}">${caseData.petitioner}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Respondent:</span>
                <span class="info-value ${caseData.isWithdrawn ? 'withdrawn-text' : ''}">${caseData.respondent}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Case Type:</span>
                <span class="info-value">${caseData.caseType}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Filed On:</span>
                <span class="info-value">${formatDate(caseData.filedDate)}</span>
            </div>
            ${caseData.isWithdrawn ? `
                <div class="info-row withdrawn-info">
                    <span class="info-label">Withdrawn On:</span>
                    <span class="info-value">${formatDate(caseData.withdrawnDate)}</span>
                </div>
                <div class="info-row withdrawn-info">
                    <span class="info-label">Reason:</span>
                    <span class="info-value">${caseData.withdrawnReason || 'Not specified'}</span>
                </div>
            ` : ''}
        </div>
    `;

    let progressHtml = createStageProgressHtml(caseData);

    let statusSummary = createStatusSummary(caseData);

    return `
        ${headerHtml}
        ${infoHtml}
        <div class="status-summary">
            <p class="summary-text">${statusSummary}</p>
        </div>
        <div class="stage-progress-section">
            <h3>Stage Progress</h3>
            ${progressHtml}
        </div>
    `;
}

// Create Stage Progress HTML
function createStageProgressHtml(caseData) {
    let html = '<div class="stage-timeline">';

    STAGE_ORDER.forEach((stage, index) => {
        const historyEntry = caseData.stageHistory.find(h => h.stage.id === stage.id);
        const isCurrent = !caseData.isWithdrawn && caseData.currentStage.id === stage.id;
        const isWithdrawnAt = caseData.isWithdrawn && caseData.withdrawnAt && caseData.withdrawnAt.id === stage.id;

        let statusClass = 'pending';
        let statusIcon = '⏳';

        if (historyEntry) {
            if (historyEntry.completed && historyEntry.success === true) {
                statusClass = 'success';
                statusIcon = '✅';
            } else if (historyEntry.completed && historyEntry.success === false) {
                statusClass = 'failed';
                statusIcon = '❌';
            } else if (historyEntry.completed) {
                statusClass = 'completed';
                statusIcon = '✅';
            } else if (isCurrent) {
                statusClass = 'current';
                statusIcon = '🔄';
            }
        }

        if (isWithdrawnAt) {
            statusClass = 'withdrawn';
            statusIcon = '🚫';
        }

        html += `
            <div class="timeline-item ${statusClass}">
                <div class="timeline-marker">
                    <span class="marker-icon">${stage.icon}</span>
                    <span class="marker-status">${statusIcon}</span>
                </div>
                <div class="timeline-content">
                    <h4 class="timeline-title">${stage.name}</h4>
                    ${historyEntry ? `
                        <p class="timeline-status">${historyEntry.status}</p>
                        <span class="timeline-date">${formatDate(historyEntry.date)}</span>
                    ` : `
                        <p class="timeline-status pending-text">Pending</p>
                    `}
                    ${isWithdrawnAt ? `
                        <p class="withdrawn-at-text">Case withdrawn at this stage</p>
                    ` : ''}
                </div>
            </div>
        `;

        // Add connector line if not last
        if (index < STAGE_ORDER.length - 1) {
            html += '<div class="timeline-connector"></div>';
        }
    });

    html += '</div>';
    return html;
}

// Create status summary sentence
function createStatusSummary(caseData) {
    if (caseData.isWithdrawn) {
        return `Case withdrawn at ${caseData.withdrawnAt.name} stage. Reason: ${caseData.withdrawnReason || 'Not specified'}`;
    }

    const stage = caseData.currentStage;
    const status = caseData.currentStatus;

    // Find service attempts
    const digitalFailed = caseData.stageHistory.some(h => h.stage.id === 'digital_service' && h.success === false);
    const postalFailed = caseData.stageHistory.some(h => h.stage.id === 'postal_service' && h.success === false);
    const policeFailed = caseData.stageHistory.some(h => h.stage.id === 'police_service' && h.success === false);

    if (stage.id === 'digital_service' && status.includes('Acknowledged')) {
        return 'Summons delivered digitally and acknowledged';
    }

    if (stage.id === 'postal_service') {
        if (status.includes('Delivered')) {
            return 'Postal summons delivered successfully';
        }
        if (digitalFailed) {
            return 'Digital summons failed; postal service in progress';
        }
    }

    if (stage.id === 'police_service') {
        if (status.includes('Served')) {
            return 'Summons served by police';
        }
        return 'Postal summons returned; police service initiated';
    }

    if (stage.id === 'bailable_warrant') {
        if (status.includes('Executed')) {
            return 'Bailable warrant executed';
        }
        return 'Bailable warrant issued; execution pending';
    }

    if (stage.id === 'non_bailable_warrant') {
        return 'Non-bailable warrant under execution';
    }

    return `${stage.name}: ${status}`;
}

// Update Dashboard Stats
function updateStats() {
    const stats = {
        total: CASES.length,
        active: CASES.filter(c => !c.isWithdrawn).length,
        withdrawn: CASES.filter(c => c.isWithdrawn).length,
        warrants: CASES.filter(c => !c.isWithdrawn &&
            (c.currentStage.id === 'bailable_warrant' || c.currentStage.id === 'non_bailable_warrant')).length
    };

    const totalEl = document.getElementById('statTotal');
    const activeEl = document.getElementById('statActive');
    const withdrawnEl = document.getElementById('statWithdrawn');
    const warrantsEl = document.getElementById('statWarrants');

    if (totalEl) totalEl.textContent = stats.total;
    if (activeEl) activeEl.textContent = stats.active;
    if (withdrawnEl) withdrawnEl.textContent = stats.withdrawn;
    if (warrantsEl) warrantsEl.textContent = stats.warrants;
}
