const text = (field, label, required = false) => ({ field, text: label, type: "text", required });
const number = (field, label, required = false) => ({ field, text: label, type: "number", required });
const date = (field, label, required = false) => ({ field, text: label, type: "date", required });
const longText = (field, label, required = false) => ({ field, text: label, type: "textarea", required });
const choice = (field, label, values, required = false) => ({
    field,
    text: label,
    type: "lookup",
    required,
    schema: { items: values.map(name => ({ name })) },
});
const relation = (field, label, module, displayField, required = false) => ({
    field,
    text: label,
    type: "lookup",
    required,
    schema: { module, displayField, valueField: "id" },
});

export const lisModuleDefinitions = [
    {
        module: "patientVisit",
        title: "Patient Visits",
        displayField: "visitId",
        fields: [
            relation("patientId", "Patient", "patient", "name", true),
            text("visitId", "Visit ID", true),
            date("visitDateTime", "Visit Date and Time", true),
            relation("saleInvoiceId", "Invoice", "saleInvoice", "invoiceNo"),
            choice("visitStatus", "Visit Status", ["Scheduled", "In Progress", "Completed", "Cancelled"]),
            choice("isActive", "Active", ["Yes", "No"]),
            text("createdBy", "Created By"),
            text("modifiedBy", "Modified By"),
        ],
        listFields: ["visitId", "patientId", "visitDateTime", "visitStatus"],
    },
    {
        module: "testRequest",
        title: "Test Requests",
        displayField: "sampleNo",
        fields: [
            relation("patientId", "Patient", "patient", "name", true),
            text("sampleNo", "Sample No", true),
            text("hisTestCode", "HIS Test Code"),
            text("hisTestName", "HIS Test Name"),
            text("specimenCode", "Specimen Code"),
            text("specimenName", "Specimen Name"),
            date("sampleCollectionDate", "Sample Collection Date"),
            date("sampleReceivedDate", "Sample Received Date"),
            relation("departmentId", "Department", "department", "departmentName"),
            relation("referralDoctorId", "Referral Doctor", "referralDoctor", "doctorName"),
            text("department", "Department Name"),
            text("hisRequestId", "HIS Request ID"),
            text("hisRequestNo", "HIS Request No"),
            choice("reportStatus", "Report Status", ["Pending", "In Progress", "Completed", "Cancelled"]),
            text("collectedBy", "Collected By"),
            text("receivedBy", "Received By"),
        ],
        listFields: ["sampleNo", "patientId", "hisTestName", "reportStatus"],
    },
    {
        module: "testResult",
        title: "Test Results",
        displayField: "sampleNo",
        fields: [
            relation("patientId", "Patient", "patient", "name", true),
            relation("testRequestId", "Test Request", "testRequest", "sampleNo", true),
            text("sampleNo", "Sample No"),
            text("hisTestCode", "HIS Test Code"),
            text("lisTestCode", "LIS Test Code"),
            text("specimenCode", "Specimen Code"),
            text("specimenName", "Specimen Name"),
            date("resultDate", "Result Date"),
            date("sampleCollectionDate", "Sample Collection Date"),
            date("sampleReceivedDate", "Sample Received Date"),
            date("authorizationDate", "Authorization Date"),
            text("authorizedBy", "Authorized By"),
            date("reviewDate", "Review Date"),
            text("reviewedBy", "Reviewed By"),
            longText("technicianNote", "Technician Note"),
            longText("doctorNote", "Doctor Note"),
            relation("equipmentId", "Equipment", "equipment", "name"),
        ],
        listFields: ["sampleNo", "patientId", "hisTestCode", "resultDate"],
    },
    {
        module: "testResultDetail",
        title: "Test Result Details",
        displayField: "parameterName",
        fields: [
            relation("testResultId", "Test Result", "testResult", "sampleNo", true),
            text("parameterCode", "Parameter Code"),
            text("parameterName", "Parameter Name", true),
            text("result", "Result", true),
            text("unit", "Unit"),
            text("referenceRange", "Reference Range"),
            choice("status", "Status", ["Normal", "Abnormal", "Critical"]),
        ],
        listFields: ["parameterName", "parameterCode", "result", "status"],
    },
    {
        module: "saleInvoice",
        title: "Sale Invoices",
        displayField: "invoiceNo",
        fields: [
            text("invoiceNo", "Invoice No", true),
            date("invoiceDate", "Invoice Date", true),
            choice("invoiceStatus", "Invoice Status", ["Draft", "Finalized", "Cancelled"]),
            choice("paymentStatus", "Payment Status", ["Pending", "Paid"]),
            relation("patientId", "Patient", "patient", "name", true),
            relation("requestDetailId", "Test Request", "testRequest", "sampleNo"),
            relation("patientVisitId", "Patient Visit", "patientVisit", "visitId"),
            number("totalAmount", "Total Amount"),
        ],
        listFields: ["invoiceNo", "patientId", "invoiceDate", "paymentStatus"],
    },
    {
        module: "saleInvoiceDetail",
        title: "Sale Invoice Details",
        displayField: "testName",
        fields: [
            relation("saleInvoiceId", "Sale Invoice", "saleInvoice", "invoiceNo", true),
            text("testCode", "Test Code"),
            text("testName", "Test Name", true),
            number("quantity", "Quantity", true),
            number("rate", "Rate", true),
            number("amount", "Amount"),
        ],
        listFields: ["testName", "saleInvoiceId", "quantity", "amount"],
    },
    {
        module: "hisTest",
        title: "HIS Test Master",
        displayField: "hisTestCodeDescription",
        fields: [
            text("hisTestCode", "HIS Test Code", true),
            text("hisTestCodeDescription", "HIS Test Description", true),
            text("hisSpecimenCode", "HIS Specimen Code"),
            text("hisSpecimenName", "HIS Specimen Name"),
            relation("departmentCode", "Department", "department", "departmentName"),
            choice("isActive", "Active", ["Yes", "No"]),
        ],
        listFields: ["hisTestCodeDescription", "hisTestCode", "hisSpecimenName", "departmentCode"],
    },
    {
        module: "hisParameter",
        title: "HIS Parameter Master",
        displayField: "hisParamDescription",
        fields: [
            text("hisParamCode", "HIS Parameter Code", true),
            text("hisParamDescription", "HIS Parameter Description", true),
            relation("hisTestId", "HIS Test", "hisTest", "hisTestCodeDescription", true),
            relation("testMappingId", "Test Mapping", "testMapping", "lisTestCodeDescription"),
            text("lisParamCode", "LIS Parameter Code"),
            text("unit", "Unit"),
            number("lowerRefRange", "Lower Reference Range"),
            number("upperRefRange", "Upper Reference Range"),
            choice("isActive", "Active", ["Yes", "No"]),
        ],
        listFields: ["hisParamDescription", "hisParamCode", "hisTestId", "unit"],
    },
    {
        module: "testMapping",
        title: "Test Mapping Master",
        displayField: "lisTestCodeDescription",
        fields: [
            relation("equipmentId", "Equipment", "equipment", "name", true),
            text("hisParamCode", "HIS Parameter Code"),
            text("hisParamDescription", "HIS Parameter Description"),
            text("specimenCode", "Specimen Code"),
            text("specimenName", "Specimen Name"),
            text("lisTestCode", "LIS Test Code", true),
            text("lisTestCodeDescription", "LIS Test Description", true),
            text("groupName", "Group Name"),
            choice("isActive", "Active", ["Yes", "No"]),
        ],
        listFields: ["lisTestCodeDescription", "lisTestCode", "equipmentId", "groupName"],
    },
    {
        module: "equipment",
        title: "Equipment Master",
        displayField: "name",
        fields: [
            text("name", "Equipment Name", true),
            text("model", "Model"),
            text("accessKey", "Access Key", true),
            choice("isActive", "Active", ["Yes", "No"]),
        ],
        listFields: ["name", "model", "accessKey", "isActive"],
    },
    {
        module: "equipmentHeartbeat",
        title: "Equipment Heartbeats",
        displayField: "lastHeartBeatTime",
        fields: [
            relation("equipmentId", "Equipment", "equipment", "name", true),
            date("lastHeartBeatTime", "Last Heartbeat Time", true),
            choice("isOnline", "Online", ["Yes", "No"]),
            longText("lastErrorMessage", "Last Error Message"),
            date("recordedOn", "Recorded On"),
        ],
        listFields: ["equipmentId", "lastHeartBeatTime", "isOnline", "lastErrorMessage"],
    },
    {
        module: "testProfile",
        title: "Test Profile Master",
        displayField: "name",
        fields: [
            text("code", "Profile Code", true),
            text("name", "Profile Name", true),
            number("packageRate", "Package Rate"),
            choice("isActive", "Active", ["Yes", "No"]),
        ],
        listFields: ["name", "code", "packageRate", "isActive"],
    },
    {
        module: "testProfileDetail",
        title: "Test Profile Details",
        displayField: "testName",
        fields: [
            relation("profileId", "Profile", "testProfile", "name", true),
            relation("testCode", "HIS Test", "hisTest", "hisTestCodeDescription", true),
            text("testName", "Test Name"),
            number("sequence", "Sequence"),
        ],
        listFields: ["testName", "profileId", "testCode", "sequence"],
    },
    {
        module: "department",
        title: "Departments",
        displayField: "departmentName",
        fields: [
            text("departmentCode", "Department Code", true),
            text("departmentName", "Department Name", true),
            choice("isActive", "Active", ["Yes", "No"]),
        ],
        listFields: ["departmentName", "departmentCode", "isActive"],
    },
    {
        module: "referralDoctor",
        title: "Referral Doctor Master",
        displayField: "doctorName",
        fields: [
            text("doctorCode", "Doctor Code", true),
            text("doctorName", "Doctor Name", true),
            text("qualification", "Qualification"),
            text("phoneNumber", "Phone Number"),
            text("email", "Email"),
            choice("isActive", "Active", ["Yes", "No"]),
        ],
        listFields: ["doctorName", "doctorCode", "qualification", "phoneNumber"],
    },
    {
        module: "radiologyRequest",
        title: "Radiology Requests",
        displayField: "requestNo",
        fields: [
            relation("patientId", "Patient", "patient", "name", true),
            text("requestNo", "Request No", true),
            text("examType", "Exam Type", true),
            date("requestDateTime", "Request Date and Time"),
            date("examDateTime", "Exam Date and Time"),
            longText("comments", "Comments"),
            choice("status", "Status", ["Pending", "Scheduled", "Completed", "Cancelled"]),
        ],
        listFields: ["requestNo", "patientId", "examType", "status"],
    },
    {
        module: "radiologyResult",
        title: "Radiology Results",
        displayField: "impression",
        fields: [
            relation("radiologyRequestId", "Radiology Request", "radiologyRequest", "requestNo", true),
            longText("findings", "Findings"),
            longText("impression", "Impression"),
            date("reportDateTime", "Report Date and Time"),
            text("reportedBy", "Reported By"),
            choice("status", "Status", ["Draft", "Finalized", "Cancelled"]),
        ],
        listFields: ["impression", "radiologyRequestId", "reportDateTime", "status"],
    },
    {
        module: "controlResult",
        title: "Control Results",
        displayField: "controlNo",
        fields: [
            text("controlNo", "Control No", true),
            text("testName", "Test Name", true),
            choice("controlLevel", "Control Level", ["Level 1", "Level 2", "Level 3"]),
            date("resultDate", "Result Date"),
            choice("status", "Status", ["In Control", "Out of Control"]),
        ],
        listFields: ["controlNo", "testName", "controlLevel", "status"],
    },
    {
        module: "controlResultDetail",
        title: "Control Result Details",
        displayField: "parameterName",
        fields: [
            relation("controlResultId", "Control Result", "controlResult", "controlNo", true),
            text("parameterName", "Parameter Name", true),
            number("result", "Result"),
            number("mean", "Mean"),
            number("sd", "Standard Deviation"),
            number("cv", "Coefficient of Variation"),
            choice("status", "Status", ["In Control", "Out of Control"]),
        ],
        listFields: ["parameterName", "controlResultId", "result", "status"],
    },
    {
        module: "reportTemplate",
        title: "Report Templates",
        displayField: "templateName",
        fields: [
            text("templateName", "Template Name", true),
            text("templateCode", "Template Code", true),
            longText("description", "Description"),
            longText("templateJson", "Template JSON"),
            choice("isActive", "Active", ["Yes", "No"]),
        ],
        listFields: ["templateName", "templateCode", "description", "isActive"],
    },
    {
        module: "reportTemplateVersion",
        title: "Report Template Versions",
        displayField: "versionNumber",
        fields: [
            relation("templateId", "Report Template", "reportTemplate", "templateName", true),
            number("versionNumber", "Version Number", true),
            longText("versionJson", "Version JSON"),
            choice("isActive", "Active", ["Yes", "No"]),
        ],
        listFields: ["versionNumber", "templateId", "isActive"],
    },
    {
        module: "reportLayoutConfiguration",
        title: "Report Layout Configurations",
        displayField: "fontFamily",
        fields: [
            relation("templateId", "Report Template", "reportTemplate", "templateName", true),
            text("headerImage", "Header Image"),
            longText("footerText", "Footer Text"),
            text("fontFamily", "Font Family"),
            choice("pageOrientation", "Page Orientation", ["Portrait", "Landscape"]),
            text("margins", "Margins"),
        ],
        listFields: ["fontFamily", "templateId", "pageOrientation"],
    },
    {
        module: "notificationConfiguration",
        title: "Notification Configurations",
        displayField: "notificationName",
        fields: [
            text("notificationName", "Notification Name", true),
            text("eventType", "Event Type", true),
            choice("channel", "Channel", ["Email", "SMS", "HTTP"]),
            longText("recipients", "Recipients"),
            choice("isActive", "Active", ["Yes", "No"]),
        ],
        listFields: ["notificationName", "eventType", "channel", "isActive"],
    },
    {
        module: "notificationTemplate",
        title: "Notification Templates",
        displayField: "templateName",
        fields: [
            relation("notificationConfigurationId", "Notification Configuration", "notificationConfiguration", "notificationName", true),
            text("templateName", "Template Name", true),
            text("subject", "Subject"),
            longText("body", "Body"),
            longText("placeholder", "Placeholders"),
        ],
        listFields: ["templateName", "subject", "notificationConfigurationId"],
    },
];

const menuItem = definition => ({
    name: definition.module,
    text: definition.title,
    icon: "list",
    path: `/${definition.module}s`,
    access: definition.module,
});

export const lisModuleMenu = [
    {
        name: "lisPatientCare",
        text: "Patient Care",
        icon: "hospital",
        schema: lisModuleDefinitions
            .filter(({ module }) => ["patientVisit", "testRequest"].includes(module))
            .map(menuItem),
    },
    {
        name: "lisResults",
        text: "Results",
        icon: "flask",
        schema: lisModuleDefinitions
            .filter(({ module }) => ["testResult", "testResultDetail"].includes(module))
            .map(menuItem),
    },
    {
        name: "lisBilling",
        text: "Billing",
        icon: "file-invoice-dollar",
        schema: lisModuleDefinitions
            .filter(({ module }) => ["saleInvoice", "saleInvoiceDetail"].includes(module))
            .map(menuItem),
    },
    {
        name: "lisTestCatalog",
        text: "Test Catalog",
        icon: "book-medical",
        schema: lisModuleDefinitions
            .filter(({ module }) => ["department", "referralDoctor", "hisTest", "hisParameter", "testMapping", "testProfile", "testProfileDetail"].includes(module))
            .map(menuItem),
    },
    {
        name: "lisEquipment",
        text: "Equipment",
        icon: "microscope",
        schema: lisModuleDefinitions
            .filter(({ module }) => ["equipment", "equipmentHeartbeat"].includes(module))
            .map(menuItem),
    },
    {
        name: "lisRadiology",
        text: "Radiology",
        icon: "x-ray",
        schema: lisModuleDefinitions
            .filter(({ module }) => ["radiologyRequest", "radiologyResult"].includes(module))
            .map(menuItem),
    },
    {
        name: "lisQualityControl",
        text: "Quality Control",
        icon: "chart-line",
        schema: lisModuleDefinitions
            .filter(({ module }) => ["controlResult", "controlResultDetail"].includes(module))
            .map(menuItem),
    },
    {
        name: "lisReporting",
        text: "Reporting",
        icon: "file-lines",
        schema: lisModuleDefinitions
            .filter(({ module }) => ["reportTemplate", "reportTemplateVersion", "reportLayoutConfiguration"].includes(module))
            .map(menuItem),
    },
    {
        name: "lisNotifications",
        text: "Notifications",
        icon: "bell",
        schema: lisModuleDefinitions
            .filter(({ module }) => ["notificationConfiguration", "notificationTemplate"].includes(module))
            .map(menuItem),
    },
];
