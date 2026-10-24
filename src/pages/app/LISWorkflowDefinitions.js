const workflowPages = {
    "/sample-collection": {
        title: "Sample Collection",
        description: "Pending collection queue for confirmed invoices.",
        module: "sample",
        fields: [
            ["barcode", "Barcode"],
            ["sampleNo", "Order No."],
            ["patientName", "Patient"],
            ["testName", "Test"],
            ["department", "Department"],
            ["collectionStatus", "Status"],
        ],
        queue: "collection",
        sampleWorkflow: "collection",
        action: "Collect",
    },
    "/sample-receiving": {
        title: "Sample Receiving",
        description: "Collected samples awaiting laboratory receiving.",
        module: "sample",
        fields: [
            ["barcode", "Barcode"],
            ["sampleNo", "Order No."],
            ["patientName", "Patient"],
            ["testName", "Test"],
            ["collectedBy", "Collected By"],
            ["sampleCollectionDate", "Collection Date"],
            ["receivingStatus", "Status"],
        ],
        queue: "receiving",
        sampleWorkflow: "receiving",
        action: "Receive",
    },
    "/radiology-report-entry": {
        title: "Radiology Report Entry",
        description: "Radiology cases ready for findings and impression entry.",
        module: "radiologyResult",
        fields: [
            ["accessionNo", "Accession"],
            ["patientName", "Patient"],
            ["testName", "Test"],
            ["modality", "Modality"],
            ["status", "Status"],
        ],
        queue: "radiology-entry",
        action: "Open",
    },
    "/radiology-doctor-approvals": {
        title: "Radiology Doctor Approval",
        description: "Review radiology reports submitted for doctor approval.",
        module: "radiologyResult",
        fields: [
            ["accessionNo", "Accession"],
            ["patientName", "Patient"],
            ["testName", "Test"],
            ["modality", "Modality"],
            ["status", "Status"],
        ],
        queue: "radiology-approval",
        action: "Review",
    },
    "/radiology-approved-reports": {
        title: "Approved Radiology Reports",
        description: "Radiology reports available for review.",
        module: "radiologyResult",
        fields: [
            ["accessionNo", "Accession"],
            ["patientName", "Patient"],
            ["testName", "Test"],
            ["modality", "Modality"],
            ["status", "Status"],
        ],
        queue: "radiology-approved",
        action: "View",
    },
    "/technicianapprovals": {
        title: "Technician's Approval",
        description: "Test results awaiting technician review.",
        module: "testResult",
        fields: [
            ["sampleNo", "Sample No."],
            ["patientName", "Patient"],
            ["hisTestCode", "Test"],
            ["resultDate", "Result Date"],
            ["reviewedBy", "Reviewed By"],
        ],
        queue: "technician-approval",
        detailPath: "/technicianapprovals",
        action: "Review",
    },
    "/edit-test-results": {
        title: "Test Result Edit",
        description: "Review and open test result records.",
        module: "testResult",
        fields: [
            ["sampleNo", "Sample No."],
            ["patientName", "Patient"],
            ["hisTestCode", "Test"],
            ["resultDate", "Result Date"],
            ["authorizedBy", "Authorized By"],
        ],
        queue: "all",
        detailPath: "/edit-test-results",
        action: "Open",
    },
    "/doctorapprovals": {
        title: "Doctor's Approval",
        description: "Test results awaiting doctor approval.",
        module: "testResult",
        fields: [
            ["sampleNo", "Sample No."],
            ["patientName", "Patient"],
            ["hisTestCode", "Test"],
            ["resultDate", "Result Date"],
            ["authorizedBy", "Authorized By"],
        ],
        queue: "doctor-approval",
        detailPath: "/doctor-samples",
        action: "Review",
    },
    "/approvedsamples": {
        title: "Approved Samples",
        description: "Samples with authorized test results.",
        module: "testResult",
        fields: [
            ["sampleNo", "Sample No."],
            ["patientName", "Patient"],
            ["hisTestCode", "Test"],
            ["resultDate", "Result Date"],
            ["authorizedBy", "Authorized By"],
        ],
        queue: "approved",
        detailPath: "/approved-samples",
        action: "View",
    },
    "/rejectedsamples": {
        title: "Rejected Samples",
        description: "Samples with rejected or incomplete results.",
        module: "sample",
        fields: [
            ["sampleNo", "Sample No."],
            ["patientName", "Patient"],
            ["barcode", "Barcode"],
            ["specimenId", "Specimen"],
            ["status", "Status"],
        ],
        queue: "rejected",
        detailPath: "/rejected-samples",
        action: "View",
    },
    "/quality-controls": {
        title: "Quality Controls",
        description: "Quality control result records.",
        module: "controlResult",
        fields: [
            ["controlNo", "Control No."],
            ["testName", "Test"],
            ["controlLevel", "Control Level"],
            ["resultDate", "Result Date"],
            ["status", "Status"],
        ],
        detailPath: "/quality-controls",
        action: "View",
    },
};

const getItemLabel = (item, field) => {
    const fallbackFields = {
        barcode: item.sampleNo,
        orderNumber: item.hisRequestNo || item.invoiceNo,
        orderDate: item.orderDate || item.orderDateTime || item.sampleCollectionDate || item.dateCreated,
        patientName: item.patientId,
        hisPatientId: item.patientId,
        testName: item.hisTestName || item.hisTestCode || item.lisTestCode,
        accessionNo: item.requestNo || item.radiologyRequestId,
        department: item.departmentName,
        status: item.collectionStatus || item.receivingStatus,
    };
    const value = item[field] ?? fallbackFields[field];
    if (value && typeof value === "object") {
        if (typeof value.toDate === "function") {
            return value.toDate().toISOString();
        }
        return value.name || value.text || value.id || "";
    }
    if (typeof value === "string" || typeof value === "number") {
        return value;
    }
    return "";
};

const matchesQueue = (item, queue) => {
    const status = String(item.status || "").toLowerCase();
    const collectionStatus = String(item.collectionStatus || "").toLowerCase();
    const receivingStatus = String(item.receivingStatus || "").toLowerCase();
    if (queue === "collection") {
        return !["collected", "rejected"].includes(collectionStatus) && status !== "rejected";
    }
    if (queue === "receiving") {
        return (collectionStatus === "collected" || Boolean(item.sampleCollectionDate))
            && !["received", "rejected"].includes(receivingStatus)
            && status !== "rejected";
    }
    if (queue === "radiology-entry") {
        return !["finalized", "cancelled"].includes(status);
    }
    if (queue === "radiology-approval") {
        return ["submitted", "pending approval", "pending"].includes(status);
    }
    if (queue === "radiology-approved") {
        return ["authorized", "approved", "released"].includes(status);
    }
    if (queue === "technician-approval") {
        return !item.reviewedBy;
    }
    if (queue === "doctor-approval") {
        return Boolean(item.reviewedBy) && !item.authorizedBy;
    }
    if (queue === "approved") {
        return Boolean(item.authorizedBy);
    }
    if (queue === "rejected") {
        return status === "rejected" || collectionStatus === "rejected" || receivingStatus === "rejected";
    }
    return true;
};

const radiologyPaths = [
    "/radiology-report-entry",
    "/radiology-doctor-approvals",
    "/radiology-approved-reports",
];

const reportRoutes = {
    "/reports/sale-invoice-register": "Sale Invoice Register",
    "/reports/test-booking-register": "Test Booking Register",
    "/reports/test-report": "Diagnostic Report",
    "/reports/radiology-report": "Radiology Report Print",
    "/reports/collection-summary": "Collection Summary",
    "/reports/collector-wise": "Collector Wise Report",
    "/reports/pending-collection": "Pending Collection",
    "/reports/recollection": "Recollection Report",
    "/reports/received-samples": "Received Samples",
    "/reports/rejected-samples": "Rejected Samples",
    "/reports/sample-turnaround": "Turnaround Time",
    "/reports/radiology/pending": "Pending Radiology Cases",
    "/reports/radiology/authorized": "Authorized Radiology",
    "/reports/radiology/modality-stats": "Modality Statistics",
    "/reports/radiology/productivity": "Radiologist Productivity",
    "/reports/doctor-commission": "Doctor Commission",
    "/reports/collector-commission": "Collector Commission",
};

export { getItemLabel, matchesQueue, radiologyPaths, reportRoutes, workflowPages };
