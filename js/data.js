// Stage Definitions
const STAGES = {
    CASE_FILED: {
        id: 'case_filed',
        name: 'Case Filed',
        icon: '📝',
        order: 1,
        statuses: ['Pending Scrutiny', 'Documents Verified', 'Case Registered']
    },
    SUMMONS_ISSUED: {
        id: 'summons_issued',
        name: 'Summons Issued',
        icon: '📄',
        order: 2,
        statuses: ['Summons Generated', 'Awaiting Dispatch']
    },
    DIGITAL_SERVICE: {
        id: 'digital_service',
        name: 'Digital Summons Service',
        icon: '📧',
        order: 3,
        statuses: ['Digital Summons Sent', 'Digital Summons Delivered', 'Digital Summons Acknowledged', 'Digital Summons Failed']
    },
    POSTAL_SERVICE: {
        id: 'postal_service',
        name: 'Postal Summons Service',
        icon: '📮',
        order: 4,
        statuses: ['Summons Sent via Post', 'In Transit', 'Summons Delivered (Post)', 'Summons Returned Undelivered']
    },
    POLICE_SERVICE: {
        id: 'police_service',
        name: 'Police-Mediated Service',
        icon: '🚓',
        order: 5,
        statuses: ['Sent to Police for Service', 'Police Attempted Service', 'Summons Served by Police', 'Summons Not Served']
    },
    BAILABLE_WARRANT: {
        id: 'bailable_warrant',
        name: 'Bailable Warrant Issued',
        icon: '⚖️',
        order: 6,
        statuses: ['Bailable Warrant Issued', 'Bailable Warrant Pending Execution', 'Bailable Warrant Executed']
    },
    NON_BAILABLE_WARRANT: {
        id: 'non_bailable_warrant',
        name: 'Non-Bailable Warrant Issued',
        icon: '🚨',
        order: 7,
        statuses: ['Non-Bailable Warrant Issued', 'NBW Under Execution', 'NBW Executed']
    },
    WITHDRAWN: {
        id: 'withdrawn',
        name: 'Withdrawn',
        icon: '🚫',
        order: 0,
        statuses: ['Case Withdrawn']
    }
};

// Stage order array for progress tracking
const STAGE_ORDER = [
    STAGES.CASE_FILED,
    STAGES.SUMMONS_ISSUED,
    STAGES.DIGITAL_SERVICE,
    STAGES.POSTAL_SERVICE,
    STAGES.POLICE_SERVICE,
    STAGES.BAILABLE_WARRANT,
    STAGES.NON_BAILABLE_WARRANT
];

// Dummy Cases Data
const CASES = [
    {
        id: 'CASE-2024-001234',
        petitioner: 'Ravi Kumar',
        respondent: 'State of Kerala',
        caseType: 'Criminal',
        filedDate: '2024-01-12',
        isWithdrawn: false,
        currentStage: STAGES.BAILABLE_WARRANT,
        currentStatus: 'Bailable Warrant Pending Execution',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-01-12', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Summons Generated', date: '2024-01-15', completed: true },
            { stage: STAGES.DIGITAL_SERVICE, status: 'Digital Summons Failed', date: '2024-01-18', completed: true, success: false },
            { stage: STAGES.POSTAL_SERVICE, status: 'Summons Returned Undelivered', date: '2024-01-25', completed: true, success: false },
            { stage: STAGES.POLICE_SERVICE, status: 'Summons Not Served', date: '2024-02-01', completed: true, success: false },
            { stage: STAGES.BAILABLE_WARRANT, status: 'Bailable Warrant Pending Execution', date: '2024-02-05', completed: false }
        ],
        attempts: { digital: false, postal: false, police: false }
    },
    {
        id: 'CASE-2024-001235',
        petitioner: 'Meera Shah',
        respondent: 'ABC Enterprises',
        caseType: 'Civil',
        filedDate: '2024-01-18',
        isWithdrawn: true,
        withdrawnAt: STAGES.SUMMONS_ISSUED,
        withdrawnDate: '2024-01-22',
        withdrawnReason: 'Settled outside court',
        currentStage: STAGES.WITHDRAWN,
        currentStatus: 'Case Withdrawn',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-01-18', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Summons Generated', date: '2024-01-20', completed: true }
        ],
        attempts: { digital: false, postal: false, police: false }
    },
    {
        id: 'CASE-2024-001236',
        petitioner: 'Anil Menon',
        respondent: 'State of Kerala',
        caseType: 'Criminal',
        filedDate: '2024-01-20',
        isWithdrawn: false,
        currentStage: STAGES.DIGITAL_SERVICE,
        currentStatus: 'Digital Summons Delivered',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-01-20', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Summons Generated', date: '2024-01-22', completed: true },
            { stage: STAGES.DIGITAL_SERVICE, status: 'Digital Summons Delivered', date: '2024-01-24', completed: false }
        ],
        attempts: { digital: true, postal: false, police: false }
    },
    {
        id: 'CASE-2024-001237',
        petitioner: 'Priya Nair',
        respondent: 'XYZ Corporation',
        caseType: 'Civil',
        filedDate: '2024-01-22',
        isWithdrawn: false,
        currentStage: STAGES.CASE_FILED,
        currentStatus: 'Pending Scrutiny',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Pending Scrutiny', date: '2024-01-22', completed: false }
        ],
        attempts: { digital: false, postal: false, police: false }
    },
    {
        id: 'CASE-2024-001238',
        petitioner: 'Suresh Pillai',
        respondent: 'State of Kerala',
        caseType: 'Criminal',
        filedDate: '2024-01-25',
        isWithdrawn: false,
        currentStage: STAGES.POSTAL_SERVICE,
        currentStatus: 'In Transit',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-01-25', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Summons Generated', date: '2024-01-27', completed: true },
            { stage: STAGES.DIGITAL_SERVICE, status: 'Digital Summons Failed', date: '2024-01-29', completed: true, success: false },
            { stage: STAGES.POSTAL_SERVICE, status: 'In Transit', date: '2024-02-01', completed: false }
        ],
        attempts: { digital: false, postal: true, police: false }
    },
    {
        id: 'CASE-2024-001239',
        petitioner: 'Lakshmi Devi',
        respondent: 'Government Hospital',
        caseType: 'Civil',
        filedDate: '2024-01-28',
        isWithdrawn: false,
        currentStage: STAGES.NON_BAILABLE_WARRANT,
        currentStatus: 'NBW Under Execution',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-01-28', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Summons Generated', date: '2024-01-30', completed: true },
            { stage: STAGES.DIGITAL_SERVICE, status: 'Digital Summons Failed', date: '2024-02-01', completed: true, success: false },
            { stage: STAGES.POSTAL_SERVICE, status: 'Summons Returned Undelivered', date: '2024-02-05', completed: true, success: false },
            { stage: STAGES.POLICE_SERVICE, status: 'Summons Not Served', date: '2024-02-08', completed: true, success: false },
            { stage: STAGES.BAILABLE_WARRANT, status: 'Bailable Warrant Executed', date: '2024-02-12', completed: true, success: false },
            { stage: STAGES.NON_BAILABLE_WARRANT, status: 'NBW Under Execution', date: '2024-02-15', completed: false }
        ],
        attempts: { digital: false, postal: false, police: false }
    },
    {
        id: 'CASE-2024-001240',
        petitioner: 'Vijay Kumar',
        respondent: 'Private Ltd Company',
        caseType: 'Civil',
        filedDate: '2024-02-01',
        isWithdrawn: false,
        currentStage: STAGES.SUMMONS_ISSUED,
        currentStatus: 'Awaiting Dispatch',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-02-01', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Awaiting Dispatch', date: '2024-02-03', completed: false }
        ],
        attempts: { digital: false, postal: false, police: false }
    },
    {
        id: 'CASE-2024-001241',
        petitioner: 'Deepa Krishnan',
        respondent: 'State of Kerala',
        caseType: 'Criminal',
        filedDate: '2024-02-03',
        isWithdrawn: true,
        withdrawnAt: STAGES.DIGITAL_SERVICE,
        withdrawnDate: '2024-02-10',
        withdrawnReason: 'Petitioner withdrew complaint',
        currentStage: STAGES.WITHDRAWN,
        currentStatus: 'Case Withdrawn',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-02-03', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Summons Generated', date: '2024-02-05', completed: true },
            { stage: STAGES.DIGITAL_SERVICE, status: 'Digital Summons Sent', date: '2024-02-07', completed: true }
        ],
        attempts: { digital: true, postal: false, police: false }
    },
    {
        id: 'CASE-2024-001242',
        petitioner: 'Mohan Das',
        respondent: 'Municipal Corporation',
        caseType: 'Civil',
        filedDate: '2024-02-05',
        isWithdrawn: false,
        currentStage: STAGES.POLICE_SERVICE,
        currentStatus: 'Police Attempted Service',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-02-05', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Summons Generated', date: '2024-02-07', completed: true },
            { stage: STAGES.DIGITAL_SERVICE, status: 'Digital Summons Failed', date: '2024-02-09', completed: true, success: false },
            { stage: STAGES.POSTAL_SERVICE, status: 'Summons Returned Undelivered', date: '2024-02-14', completed: true, success: false },
            { stage: STAGES.POLICE_SERVICE, status: 'Police Attempted Service', date: '2024-02-18', completed: false }
        ],
        attempts: { digital: false, postal: false, police: true }
    },
    {
        id: 'CASE-2024-001243',
        petitioner: 'Shalini Thomas',
        respondent: 'Insurance Company',
        caseType: 'Civil',
        filedDate: '2024-02-08',
        isWithdrawn: false,
        currentStage: STAGES.DIGITAL_SERVICE,
        currentStatus: 'Digital Summons Acknowledged',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-02-08', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Summons Generated', date: '2024-02-10', completed: true },
            { stage: STAGES.DIGITAL_SERVICE, status: 'Digital Summons Acknowledged', date: '2024-02-12', completed: true, success: true }
        ],
        attempts: { digital: true, postal: false, police: false }
    },
    {
        id: 'CASE-2024-001244',
        petitioner: 'Rajesh Varma',
        respondent: 'State of Kerala',
        caseType: 'Criminal',
        filedDate: '2024-02-10',
        isWithdrawn: false,
        currentStage: STAGES.CASE_FILED,
        currentStatus: 'Documents Verified',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Documents Verified', date: '2024-02-10', completed: false }
        ],
        attempts: { digital: false, postal: false, police: false }
    },
    {
        id: 'CASE-2024-001245',
        petitioner: 'Anitha George',
        respondent: 'Private Hospital',
        caseType: 'Civil',
        filedDate: '2024-02-12',
        isWithdrawn: false,
        currentStage: STAGES.POSTAL_SERVICE,
        currentStatus: 'Summons Delivered (Post)',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-02-12', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Summons Generated', date: '2024-02-14', completed: true },
            { stage: STAGES.DIGITAL_SERVICE, status: 'Digital Summons Failed', date: '2024-02-16', completed: true, success: false },
            { stage: STAGES.POSTAL_SERVICE, status: 'Summons Delivered (Post)', date: '2024-02-20', completed: true, success: true }
        ],
        attempts: { digital: false, postal: true, police: false }
    },
    {
        id: 'CASE-2024-001246',
        petitioner: 'Gopalan Nair',
        respondent: 'Real Estate Developer',
        caseType: 'Civil',
        filedDate: '2024-02-14',
        isWithdrawn: true,
        withdrawnAt: STAGES.POSTAL_SERVICE,
        withdrawnDate: '2024-02-25',
        withdrawnReason: 'Mutual agreement reached',
        currentStage: STAGES.WITHDRAWN,
        currentStatus: 'Case Withdrawn',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-02-14', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Summons Generated', date: '2024-02-16', completed: true },
            { stage: STAGES.DIGITAL_SERVICE, status: 'Digital Summons Failed', date: '2024-02-18', completed: true, success: false },
            { stage: STAGES.POSTAL_SERVICE, status: 'In Transit', date: '2024-02-22', completed: true }
        ],
        attempts: { digital: false, postal: true, police: false }
    },
    {
        id: 'CASE-2024-001247',
        petitioner: 'Sreeja Menon',
        respondent: 'State of Kerala',
        caseType: 'Criminal',
        filedDate: '2024-02-16',
        isWithdrawn: false,
        currentStage: STAGES.POLICE_SERVICE,
        currentStatus: 'Summons Served by Police',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-02-16', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Summons Generated', date: '2024-02-18', completed: true },
            { stage: STAGES.DIGITAL_SERVICE, status: 'Digital Summons Failed', date: '2024-02-20', completed: true, success: false },
            { stage: STAGES.POSTAL_SERVICE, status: 'Summons Returned Undelivered', date: '2024-02-25', completed: true, success: false },
            { stage: STAGES.POLICE_SERVICE, status: 'Summons Served by Police', date: '2024-03-01', completed: true, success: true }
        ],
        attempts: { digital: false, postal: false, police: true }
    },
    {
        id: 'CASE-2024-001248',
        petitioner: 'Harish Chandran',
        respondent: 'Transport Corporation',
        caseType: 'Civil',
        filedDate: '2024-02-18',
        isWithdrawn: false,
        currentStage: STAGES.BAILABLE_WARRANT,
        currentStatus: 'Bailable Warrant Executed',
        stageHistory: [
            { stage: STAGES.CASE_FILED, status: 'Case Registered', date: '2024-02-18', completed: true },
            { stage: STAGES.SUMMONS_ISSUED, status: 'Summons Generated', date: '2024-02-20', completed: true },
            { stage: STAGES.DIGITAL_SERVICE, status: 'Digital Summons Failed', date: '2024-02-22', completed: true, success: false },
            { stage: STAGES.POSTAL_SERVICE, status: 'Summons Returned Undelivered', date: '2024-02-27', completed: true, success: false },
            { stage: STAGES.POLICE_SERVICE, status: 'Summons Not Served', date: '2024-03-03', completed: true, success: false },
            { stage: STAGES.BAILABLE_WARRANT, status: 'Bailable Warrant Executed', date: '2024-03-08', completed: true, success: true }
        ],
        attempts: { digital: false, postal: false, police: false }
    }
];

// Helper function to get all unique statuses
function getAllStatuses() {
    const statuses = new Set();
    Object.values(STAGES).forEach(stage => {
        stage.statuses.forEach(status => statuses.add(status));
    });
    return Array.from(statuses).sort();
}

// Helper function to get stage by ID
function getStageById(stageId) {
    return Object.values(STAGES).find(s => s.id === stageId);
}

// Helper function to format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Helper to get next action based on current stage
function getNextAction(caseData) {
    if (caseData.isWithdrawn) return 'Case Closed';

    const stageIndex = STAGE_ORDER.findIndex(s => s.id === caseData.currentStage.id);
    if (stageIndex === -1) return 'N/A';

    const lastHistory = caseData.stageHistory[caseData.stageHistory.length - 1];

    if (lastHistory.success === true) {
        return 'Proceed to Hearing';
    }

    if (stageIndex < STAGE_ORDER.length - 1) {
        return `Escalate to ${STAGE_ORDER[stageIndex + 1].name}`;
    }

    return 'Await Execution';
}

// Get status badge class
function getStatusBadgeClass(caseData) {
    if (caseData.isWithdrawn) return 'badge-withdrawn';

    const stage = caseData.currentStage;
    if (stage.id === 'case_filed') return 'badge-info';
    if (stage.id === 'summons_issued') return 'badge-info';
    if (stage.id === 'digital_service') return 'badge-primary';
    if (stage.id === 'postal_service') return 'badge-warning';
    if (stage.id === 'police_service') return 'badge-warning';
    if (stage.id === 'bailable_warrant') return 'badge-danger';
    if (stage.id === 'non_bailable_warrant') return 'badge-critical';

    return 'badge-default';
}
