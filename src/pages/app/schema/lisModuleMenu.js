import { lisModuleDefinitions } from "./lisModuleDefinitions";

const menuItem = definition => ({
    name: definition.module,
    text: definition.menuTitle || definition.title,
    icon: "list",
    path: definition.routePaths?.[0] || `/${definition.module}s`,
    access: definition.module,
});

const lisMenuItem = (module, text, path, icon = "list", access = module) => ({
    ...menuItem(lisModuleDefinitions.find(definition => definition.module === module) || {
        module,
        title: text,
        routePaths: [path],
    }),
    text,
    path,
    icon,
    access,
});

export const lisModuleMenu = [
    {
        name: "workingBoard",
        text: "Working Board",
        icon: "hospital",
        schema: [
            lisMenuItem("sample", "Recent Samples", "/samples", "chalkboard"),
            { name: "sampleCollection", text: "Sample Collection", icon: "tint", path: "/sample-collection", access: "sample" },
            { name: "sampleReceiving", text: "Sample Receiving", icon: "file-import", path: "/sample-receiving", access: "sample" },
            { name: "radiologyEntry", text: "Radiology Report Entry", icon: "image", path: "/radiology-report-entry", access: "radiologyResult" },
            { name: "radiologyApproval", text: "Radiology Doctor Approval", icon: "check", path: "/radiology-doctor-approvals", access: "radiologyResult" },
            { name: "radiologyApproved", text: "Approved Radiology Reports", icon: "circle-check", path: "/radiology-approved-reports", access: "radiologyResult" },
            { name: "technicianApproval", text: "Technician's Approval", icon: "filter", path: "/technicianapprovals", access: "testResult" },
            { name: "testResultEdit", text: "Test Result Edit", icon: "pen-to-square", path: "/edit-test-results", access: "testResult" },
            { name: "doctorApproval", text: "Doctor's Approval", icon: "scissors", path: "/doctorapprovals", access: "testResult" },
            { name: "approvedSamples", text: "Approved Samples", icon: "thumbs-up", path: "/approvedsamples", access: "testResult" },
            { name: "rejectedSamples", text: "Rejected Samples", icon: "thumbs-down", path: "/rejectedsamples", access: "sample" },
            { name: "qualityControls", text: "Quality Controls", icon: "scale-balanced", path: "/quality-controls", access: "controlResult" },
        ],
    },
    {
        name: "setup",
        text: "Setup",
        icon: "gear",
        schema: [
            lisMenuItem("department", "Department", "/departments"),
            lisMenuItem("unit", "Unit", "/units", "arrows-left-right"),
            lisMenuItem("method", "Method", "/methods", "wrench"),
            lisMenuItem("equipment", "Equipment", "/equipments", "hard-drive"),
            lisMenuItem("equipmentHeartbeat", "Equipment Heartbeat", "/equipment-heartbeat", "heart"),
            lisMenuItem("notificationConfiguration", "Notification Configuration", "/notification-configuration", "bell"),
            lisMenuItem("reportLayoutConfiguration", "Report Layout Configuration", "/report-layout-configuration", "arrows-up-down"),
            lisMenuItem("reportTemplateConfiguration", "Report Template Configuration", "/report-template-configuration", "file-lines"),
        ],
    },
    {
        name: "master",
        text: "Master",
        icon: "book-medical",
        schema: [
            lisMenuItem("hisTest", "Test Master", "/test-master", "list-alt"),
            lisMenuItem("testProfile", "Test Profile", "/test-profiles", "table-cells"),
            lisMenuItem("specimen", "Specimen", "/specimens", "tint"),
            lisMenuItem("testRate", "Test Rate", "/test-rates", "dollar-sign"),
            lisMenuItem("referralDoctor", "Referral Doctor", "/referral-doctors", "user"),
            lisMenuItem("doctorCommissionRate", "Doctor Commission Rate", "/doctor-commission-rates", "dollar-sign"),
            lisMenuItem("sampleCollector", "Sample Collector", "/sample-collectors", "user"),
            lisMenuItem("collectorCommissionRate", "Collector Commission Rate", "/collector-commission-rates", "dollar-sign"),
            lisMenuItem("corporate", "Corporate", "/corporates", "briefcase"),
            lisMenuItem("hisParameter", "Parameter Master", "/his-parameters", "filter"),
            lisMenuItem("testParameter", "Test Parameter Mapping", "/test-parameters", "list"),
            lisMenuItem("testMapping", "Analyzer Parameter Mapping", "/test-mappings", "shuffle"),
            lisMenuItem("parameterRange", "Parameter Range", "/his-parameter-ranges", "signal"),
        ],
    },
    {
        name: "transaction",
        text: "Transaction",
        icon: "file-invoice-dollar",
        schema: [
            { name: "patientMaster", text: "Patient Details", icon: "user", path: "/patient-master", access: "patient" },
            lisMenuItem("saleInvoice", "Sale Invoice", "/sale-invoices", "file"),
        ],
    },
    {
        name: "reports",
        text: "Reports",
        icon: "file-lines",
        schema: [
            { name: "saleInvoiceRegister", text: "Sale Invoice Register", icon: "list-alt", path: "/reports/sale-invoice-register", access: "reportTemplate" },
            { name: "testBookingRegister", text: "Test Booking Register", icon: "book", path: "/reports/test-booking-register", access: "reportTemplate" },
            { name: "diagnosticReport", text: "Diagnostic Report", icon: "print", path: "/reports/test-report", access: "reportTemplate" },
            { name: "radiologyReportPrint", text: "Radiology Report Print", icon: "print", path: "/reports/radiology-report", access: "reportTemplate" },
            { name: "collectionSummary", text: "Collection Summary", icon: "tint", path: "/reports/collection-summary", access: "reportTemplate" },
            { name: "collectorWiseReport", text: "Collector Wise Report", icon: "user", path: "/reports/collector-wise", access: "reportTemplate" },
            { name: "pendingCollection", text: "Pending Collection", icon: "clock", path: "/reports/pending-collection", access: "reportTemplate" },
            { name: "recollectionReport", text: "Recollection Report", icon: "repeat", path: "/reports/recollection", access: "reportTemplate" },
            { name: "receivedSamplesReport", text: "Received Samples", icon: "check", path: "/reports/received-samples", access: "reportTemplate" },
            { name: "rejectedSamplesReport", text: "Rejected Samples", icon: "xmark", path: "/reports/rejected-samples", access: "reportTemplate" },
            { name: "turnaroundReport", text: "Turnaround Time", icon: "gauge", path: "/reports/sample-turnaround", access: "reportTemplate" },
            { name: "pendingRadiology", text: "Pending Radiology Cases", icon: "image", path: "/reports/radiology/pending", access: "reportTemplate" },
            { name: "authorizedRadiology", text: "Authorized Radiology", icon: "check", path: "/reports/radiology/authorized", access: "reportTemplate" },
            { name: "radiologyModalityStats", text: "Modality Statistics", icon: "signal", path: "/reports/radiology/modality-stats", access: "reportTemplate" },
            { name: "radiologistProductivity", text: "Radiologist Productivity", icon: "chart-bar", path: "/reports/radiology/productivity", access: "reportTemplate" },
            { name: "doctorCommissionReport", text: "Doctor Commission", icon: "list-alt", path: "/reports/doctor-commission", access: "reportTemplate" },
            { name: "collectorCommissionReport", text: "Collector Commission", icon: "list-alt", path: "/reports/collector-commission", access: "reportTemplate" },
        ],
    },
    {
        name: "commission",
        text: "Commission",
        icon: "briefcase",
        schema: [
            { name: "commissionPayout", text: "Commission Payout", icon: "file-invoice-dollar", path: "/commission-payouts", access: "commissionPayout" },
        ],
    },
    {
        name: "account",
        text: "Account",
        icon: "user-shield",
        schema: [
            { name: "userManagement", text: "Users", icon: "user", path: "/users" },
            { name: "roleManagement", text: "Roles", icon: "table-list", path: "/roles" },
            { name: "changePassword", text: "Change Password", icon: "lock", path: "/change-password" },
        ],
    },
];
