// Filter State
let filterState = {
    searchQuery: '',
    stage: '',
    status: '',
    dateFrom: '',
    dateTo: ''
};

// Update filter state
function updateFilter(filterName, value) {
    filterState[filterName] = value;
    applyFilters();
}

// Clear all filters
function clearFilters() {
    filterState = {
        searchQuery: '',
        stage: '',
        status: '',
        dateFrom: '',
        dateTo: ''
    };

    // Reset UI elements
    document.getElementById('searchInput').value = '';
    document.getElementById('stageFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';

    applyFilters();
}

// Filter cases based on current filter state
function filterCases(cases) {
    return cases.filter(caseData => {
        // Search by case number (partial match)
        if (filterState.searchQuery) {
            const query = filterState.searchQuery.toLowerCase();
            const caseId = caseData.id.toLowerCase();
            const petitioner = caseData.petitioner.toLowerCase();
            const respondent = caseData.respondent.toLowerCase();

            if (!caseId.includes(query) && !petitioner.includes(query) && !respondent.includes(query)) {
                return false;
            }
        }

        // Filter by stage
        if (filterState.stage) {
            if (filterState.stage === 'withdrawn') {
                if (!caseData.isWithdrawn) return false;
            } else {
                if (caseData.isWithdrawn) return false;
                if (caseData.currentStage.id !== filterState.stage) return false;
            }
        }

        // Filter by status
        if (filterState.status) {
            if (caseData.currentStatus !== filterState.status) return false;
        }

        // Filter by date range
        if (filterState.dateFrom) {
            const filedDate = new Date(caseData.filedDate);
            const fromDate = new Date(filterState.dateFrom);
            if (filedDate < fromDate) return false;
        }

        if (filterState.dateTo) {
            const filedDate = new Date(caseData.filedDate);
            const toDate = new Date(filterState.dateTo);
            if (filedDate > toDate) return false;
        }

        return true;
    });
}

// Apply filters and re-render
function applyFilters() {
    const filteredCases = filterCases(CASES);
    renderCases(filteredCases);
    updateResultsCount(filteredCases.length, CASES.length);
}

// Update results count display
function updateResultsCount(filtered, total) {
    const countEl = document.getElementById('resultsCount');
    if (countEl) {
        if (filtered === total) {
            countEl.textContent = `Showing all ${total} cases`;
        } else {
            countEl.textContent = `Showing ${filtered} of ${total} cases`;
        }
    }
}

// Populate stage filter dropdown
function populateStageFilter() {
    const select = document.getElementById('stageFilter');
    if (!select) return;

    select.innerHTML = '<option value="">All Stages</option>';

    STAGE_ORDER.forEach(stage => {
        const option = document.createElement('option');
        option.value = stage.id;
        option.textContent = `${stage.icon} ${stage.name}`;
        select.appendChild(option);
    });

    // Add withdrawn option
    const withdrawnOption = document.createElement('option');
    withdrawnOption.value = 'withdrawn';
    withdrawnOption.textContent = '🚫 Withdrawn';
    select.appendChild(withdrawnOption);
}

// Populate status filter dropdown based on selected stage
function populateStatusFilter(stageId = '') {
    const select = document.getElementById('statusFilter');
    if (!select) return;

    select.innerHTML = '<option value="">All Statuses</option>';

    let statuses = [];

    if (stageId && stageId !== 'withdrawn') {
        const stage = getStageById(stageId);
        if (stage) {
            statuses = stage.statuses;
        }
    } else if (stageId === 'withdrawn') {
        statuses = ['Case Withdrawn'];
    } else {
        statuses = getAllStatuses();
    }

    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        select.appendChild(option);
    });
}

// Handle stage filter change
function onStageFilterChange(value) {
    updateFilter('stage', value);
    populateStatusFilter(value);
    // Reset status filter when stage changes
    document.getElementById('statusFilter').value = '';
    filterState.status = '';
}
