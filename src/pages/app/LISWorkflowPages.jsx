import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { Alert, Button, Form, Modal, Table } from "react-bootstrap";
import { getData } from "../../store/api-db";

const EMPTY_ITEMS = [];

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

const SampleWorkflow = ({ config, items, loading, error }) => {
    const isCollection = config.sampleWorkflow === "collection";
    const [filters, setFilters] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);
    const [modal, setModal] = useState(null);
    const visibleItems = useMemo(() => {
        const filtered = (items || []).filter(item => matchesQueue(item, config.queue));
        const searchTerm = String(appliedFilters.search || "").trim().toLowerCase();
        return filtered.filter(item => {
            const matchesFields = Object.entries(appliedFilters)
                .filter(([field]) => field !== "search")
                .every(([field, value]) =>
                    !value || String(getItemLabel(item, field)).toLowerCase().includes(value.toLowerCase())
                );
            const matchesSearch = !searchTerm || [
                "barcode", "sampleNo", "hisRequestNo", "patientName", "patientId", "testName",
                "hisTestName", "hisTestCode", "department", "status", "collectionStatus", "receivingStatus",
            ].some(field => String(getItemLabel(item, field)).toLowerCase().includes(searchTerm));
            return matchesFields && matchesSearch;
        });
    }, [appliedFilters, config.queue, items]);
    const allSelected = visibleItems.length > 0 && visibleItems.every(item => selectedIds.includes(item.id));
    const toggleSelected = (id, selected) => {
        setSelectedIds(current => selected
            ? [...new Set([...current, id])]
            : current.filter(selectedId => selectedId !== id));
    };
    const openModal = (action, item = null) => setModal({ action, item });
    const filterFields = isCollection
        ? [
            ["barcode", "Barcode"],
            ["orderNumber", "Order No."],
            ["patientName", "Patient Name"],
            ["orderDate", "Order Date", "date"],
            ["search", "Search"],
        ]
        : [
            ["barcode", "Barcode No"],
            ["orderNumber", "Order No."],
            ["patientName", "Patient Name"],
            ["search", "Search"],
        ];
    const columns = isCollection
        ? [
            ["barcode", "Barcode"],
            ["orderNumber", "Order No."],
            ["hisPatientId", "Patient ID"],
            ["patientName", "Patient"],
            ["testName", "Test"],
            ["department", "Department"],
            ["status", "Status"],
        ]
        : [
            ["barcode", "Barcode"],
            ["orderNumber", "Order"],
            ["patientName", "Patient"],
            ["testName", "Test"],
            ["collectedBy", "Collected By"],
            ["sampleCollectionDate", "Collection Date"],
            ["status", "Status"],
        ];
    const resetFilters = () => {
        setFilters({});
        setAppliedFilters({});
    };
    const submitAction = event => {
        event?.preventDefault();
        setAppliedFilters(filters);
    };

    return (
        <>
            <div className="main-card mb-3 card">
                <div className="card-body">
                    <h3>{config.title}</h3>
                    <p className="text-muted">
                        {isCollection
                            ? "Pending collection queue for confirmed invoices — search, collect, or reject."
                            : "Search collected samples awaiting lab receiving."}
                    </p>
                    <Form onSubmit={submitAction}>
                        <div className="row g-3">
                            {filterFields.map(([field, label, type]) => (
                                <Form.Group key={field} className={type === "date" ? "col-md-2" : "col-md-2"}>
                                    <Form.Label>{label}</Form.Label>
                                    <Form.Control
                                        type={type || "text"}
                                        value={filters[field] || ""}
                                        onChange={event => setFilters(current => ({ ...current, [field]: event.target.value }))}
                                        onKeyDown={event => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                setAppliedFilters(filters);
                                            }
                                        }}
                                    />
                                </Form.Group>
                            ))}
                        </div>
                    </Form>
                    {loading && <p className="mt-3" role="status">Loading records...</p>}
                    {error &&
                        <Alert variant="danger" className="mt-3">Unable to load samples: {error}</Alert>
                    }
                    <div className="d-flex gap-2 mt-3">
                        <Button size="sm" onClick={submitAction}>Search</Button>
                        <Button size="sm" variant="outline-secondary" onClick={resetFilters}>Reset</Button>
                        <Button
                            size="sm"
                            variant="success"
                            disabled={!selectedIds.some(id => visibleItems.some(item => item.id === id))}
                            onClick={() => openModal(isCollection ? "Collect Selected Samples" : "Receive Selected Samples")}
                        >
                            {isCollection ? "Collect Selected" : "Receive Selected"}
                        </Button>
                    </div>
                    <Table responsive hover className="mt-3">
                        <thead>
                            <tr>
                                <th>
                                    <Form.Check
                                        aria-label="Select all"
                                        checked={allSelected}
                                        onChange={event => {
                                            const ids = visibleItems.map(item => item.id);
                                            setSelectedIds(current => event.target.checked
                                                ? [...new Set([...current, ...ids])]
                                                : current.filter(id => !ids.includes(id)));
                                        }}
                                    />
                                </th>
                                {columns.map(([, label]) => <th key={label}>{label}</th>)}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleItems.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <Form.Check
                                            aria-label={`Select ${getItemLabel(item, "barcode") || item.id}`}
                                            checked={selectedIds.includes(item.id)}
                                            onChange={event => toggleSelected(item.id, event.target.checked)}
                                        />
                                    </td>
                                    {columns.map(([field]) => (
                                        <td key={field}>{getItemLabel(item, field) || "—"}</td>
                                    ))}
                                    <td className="d-flex gap-1">
                                        <Button size="sm" variant="success" onClick={() => openModal(isCollection ? "Collect Sample" : "Receive Sample", item)}>
                                            {isCollection ? "Collect" : "Receive"}
                                        </Button>
                                        <Button size="sm" variant="warning" onClick={() => openModal("Reject Sample", item)}>Reject</Button>
                                        {isCollection && <Button size="sm" variant="outline-secondary" onClick={() => openModal("Recollect Sample", item)}>Recollect</Button>}
                                    </td>
                                </tr>
                            ))}
                            {!loading && !visibleItems.length &&
                                <tr><td colSpan={columns.length + 2} className="text-center text-muted">No pending samples found.</td></tr>
                            }
                        </tbody>
                    </Table>
                    <Alert variant="info" className="mb-0">
                        These controls reproduce the workflow layout only. Saving collection, receiving, or rejection
                        changes is not connected to the Angular application's services.
                    </Alert>
                </div>
            </div>
            <Modal show={Boolean(modal)} onHide={() => setModal(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modal?.action}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modal?.item && <p className="text-muted">Sample: {getItemLabel(modal.item, "barcode") || "—"}</p>}
                    {modal?.action?.includes("Reject") && (
                        <Form.Group className="mb-3">
                            <Form.Label>Reason</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                    )}
                    {!modal?.action?.includes("Reject") && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>{isCollection ? "Collection Date/Time" : "Received Date/Time"}</Form.Label>
                                <Form.Control type="datetime-local" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control as="textarea" rows={2} />
                            </Form.Group>
                        </>
                    )}
                    <Alert variant="info" className="mt-3 mb-0">
                        This action is a UI placeholder and cannot save until the workflow service is connected.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setModal(null)}>Cancel</Button>
                    <Button variant="primary" disabled>{modal?.action?.includes("Reject") ? "Reject" : "Save"}</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
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

export const LISWorkflowPage = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const config = workflowPages[location.pathname];
    const dataSet = useSelector(state => state.api[config.module]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        dispatch(getData({ module: config.module, options: { recordPerPage: 0 } }));
    }, [config.module, dispatch]);

    const rows = useMemo(() => {
        const items = (dataSet?.items || []).filter(item => matchesQueue(item, config.queue));
        const term = search.trim().toLowerCase();
        if (!term) {
            return items;
        }
        return items.filter(item => config.fields.some(([field]) =>
            String(getItemLabel(item, field)).toLowerCase().includes(term)
        ));
    }, [config.fields, config.queue, dataSet?.items, search]);
    const detailPath = config.detailPath || `/${config.module}s`;

    if (config.sampleWorkflow) {
        return (
            <SampleWorkflow
                config={config}
                items={dataSet?.items}
                loading={!dataSet || dataSet.status === "loading"}
                error={dataSet?.status === "error" ? dataSet.message : ""}
            />
        );
    }

    return (
        <>
            <div className="app-page-title">
                <div className="page-title-heading">{config.title}</div>
            </div>
            <div className="main-card mb-3 card">
                <div className="card-body">
                    <p className="text-muted">{config.description}</p>
                    <Form className="mb-3" onSubmit={event => event.preventDefault()}>
                        <Form.Control
                            aria-label={`Search ${config.title}`}
                            placeholder="Search"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                        />
                    </Form>
                    {dataSet?.status === "error" &&
                        <Alert variant="danger">Unable to load records: {dataSet.message}</Alert>
                    }
                    {dataSet?.status === "loading" &&
                        <p role="status">Loading records...</p>
                    }
                    <Table responsive hover>
                        <thead>
                            <tr>
                                {config.fields.map(([, label]) => <th key={label}>{label}</th>)}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(item => (
                                <tr key={item.id}>
                                    {config.fields.map(([field, label], index) => (
                                        <td key={field}>
                                            {index === 0
                                                ? <Link to={`${detailPath}/${item.id}`}>{getItemLabel(item, field) || "—"}</Link>
                                                : getItemLabel(item, field) || "—"}
                                        </td>
                                    ))}
                                    <td>
                                        <Button
                                            as={Link}
                                            to={`${detailPath}/${item.id}`}
                                            size="sm"
                                            variant="outline-primary"
                                        >
                                            {config.action}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {!rows.length && dataSet && dataSet.status !== "loading" &&
                                <tr>
                                    <td colSpan={config.fields.length + 1} className="text-center text-muted">
                                        No records found.
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                    <Alert variant="info" className="mb-0">
                        This worklist is read-only in the current UI port. Collection, receiving, review, and authorization
                        actions require the Angular application's workflow services and are not connected here.
                    </Alert>
                </div>
            </div>
        </>
    );
};

export const LISResultDetailPage = () => {
    const location = useLocation();
    const { id } = useParams();
    const dispatch = useDispatch();
    const isQuality = location.pathname.startsWith("/quality-controls/");
    const isRejected = location.pathname.startsWith("/rejected-samples/");
    const isApproved = location.pathname.startsWith("/approved-samples/");
    const isDoctorApproval = location.pathname.startsWith("/doctor-samples/");
    const isTechnicianApproval = location.pathname.startsWith("/technicianapprovals/")
        || location.pathname.startsWith("/technician-samples/");
    const module = isQuality ? "controlResult" : isRejected ? "sample" : "testResult";
    const dataSet = useSelector(state => state.api[module]);
    const detailsData = useSelector(state => state.api[isQuality ? "controlResultDetail" : "testResultDetail"]);
    const patients = useSelector(state => state.api.patient?.items || EMPTY_ITEMS);
    const requests = useSelector(state => state.api.testRequest?.items || EMPTY_ITEMS);
    const controlDetails = useSelector(state => state.api.controlResultDetail?.items || EMPTY_ITEMS);
    const [note, setNote] = useState("");
    const result = dataSet?.items?.find(item => item.id === id);

    useEffect(() => {
        dispatch(getData({ module, options: { recordPerPage: 0 } }));
        if (!isQuality) {
            dispatch(getData({ module: "patient", options: { recordPerPage: 0 } }));
        }
        if (isQuality) {
            dispatch(getData({ module: "controlResultDetail", options: { recordPerPage: 0 } }));
        } else if (!isRejected) {
            dispatch(getData({ module: "testResultDetail", options: { recordPerPage: 0 } }));
            dispatch(getData({ module: "testRequest", options: { recordPerPage: 0 } }));
        }
    }, [dispatch, isQuality, isRejected, module]);

    const patient = patients.find(item => item.id === result?.patientId);
    const request = requests.find(item => item.id === result?.testRequestId);
    const resultDetails = isQuality
        ? controlDetails.filter(item => item.controlResultId === id)
        : isRejected
            ? EMPTY_ITEMS
            : (detailsData?.items || EMPTY_ITEMS).filter(item => item.testResultId === id);
    const backPath = isQuality
        ? "/quality-controls"
        : isRejected
            ? "/rejectedsamples"
            : isApproved
                ? "/approvedsamples"
                : isDoctorApproval
                    ? "/doctorapprovals"
                    : isTechnicianApproval
                        ? "/technicianapprovals"
                        : "/edit-test-results";
    const title = isQuality
        ? `Quality Control Report Details - ${result?.controlNo || "—"}`
        : isRejected
            ? `Rejected Report Details - ${result?.sampleNo || "—"}`
            : isApproved
                ? `Approved Report Details - ${result?.sampleNo || "—"}`
                : isDoctorApproval
                    ? `Doctor Approval - ${result?.sampleNo || "—"}`
                    : isTechnicianApproval
                        ? `Technician Approval - ${result?.sampleNo || "—"}`
                        : `Test Result - ${result?.sampleNo || "—"}`;

    return (
        <>
            <div className="app-page-title">
                <div className="page-title-heading">{title}</div>
            </div>
            {!result ? (
                <Alert variant={dataSet?.status === "error" ? "danger" : "warning"}>
                    {dataSet?.status === "error"
                        ? `Unable to load record: ${dataSet.message}`
                        : dataSet?.status === "loading" || !dataSet
                            ? "Loading record..."
                            : "Record not found."}
                </Alert>
            ) : (
                <div className="main-card mb-3 card">
                    <div className="card-body">
                        <h4>{isQuality ? "Control Details" : "Patient Details"}</h4>
                        <div className="row">
                            {isQuality ? (
                                <>
                                    <DetailValue label="Control Number" value={result.controlNo} />
                                    <DetailValue label="Equipment Name" value={result.equipmentName || result.equipmentId} />
                                    <DetailValue label="Control Period" value={result.monthName || result.resultDate} />
                                </>
                            ) : (
                                <>
                                    <DetailValue label="MR No." value={patient?.mrNo || result.mrNo} />
                                    <DetailValue label="Patient ID" value={patient?.hisPatientId || result.patientId} />
                                    <DetailValue label="Patient Name" value={patient?.name || result.patientName} />
                                    <DetailValue label="Age" value={patient?.age || result.age} />
                                    <DetailValue label="Gender" value={patient?.gender || result.gender} />
                                    <DetailValue label="Department" value={result.department || request?.department} />
                                    <DetailValue label="Test Name" value={result.hisTestName || result.hisTestCode || request?.hisTestName} />
                                    <DetailValue label="Specimen" value={result.specimenName || result.specimenCode} />
                                    <DetailValue label="Barcode" value={result.barcode || result.sampleNo} />
                                    <DetailValue label="Sample Collection Date" value={result.sampleCollectionDate} />
                                    <DetailValue label="Report Date & Time" value={result.resultDate} />
                                    <DetailValue label="Technician" value={result.reviewedBy || result.technicianName} />
                                    {isRejected && <DetailValue label="Rejection Reason" value={result.rejectionReason || result.rejectionReasonId} />}
                                    {isRejected && <DetailValue label="Rejected By" value={result.rejectedBy} />}
                                    {isRejected && <DetailValue label="Rejected On" value={result.rejectedOn} />}
                                </>
                            )}
                        </div>
                        {!isRejected && <hr />}
                        {!isRejected && <Table responsive bordered>
                            <thead>
                                <tr>
                                    {isQuality
                                        ? <><th>Parameter</th><th>Result</th><th>Mean</th><th>SD</th><th>CV</th><th>Status</th></>
                                        : <><th>Parameter</th><th>Result</th><th>Unit</th><th>Reference Range</th><th>Status</th></>}
                                </tr>
                            </thead>
                            <tbody>
                                {resultDetails.map((row, index) => (
                                    <tr key={row.id || index}>
                                        <td>{row.parameterName || "—"}</td>
                                        <td>{row.result ?? "—"}</td>
                                        {isQuality
                                            ? <><td>{row.mean ?? "—"}</td><td>{row.sd ?? "—"}</td><td>{row.cv ?? "—"}</td></>
                                            : <><td>{row.unit || "—"}</td><td>{row.referenceRange || "—"}</td></>}
                                        <td>{row.status || "—"}</td>
                                    </tr>
                                ))}
                                {!resultDetails.length &&
                                    <tr><td colSpan={isQuality ? 6 : 5} className="text-center text-muted">No result detail records found.</td></tr>
                                }
                            </tbody>
                        </Table>}
                        {!isQuality && (
                            <Form.Group className="mb-3" controlId="reviewNote">
                                <Form.Label>Note</Form.Label>
                                <Form.Control as="textarea" rows={3} value={note} onChange={event => setNote(event.target.value)} />
                            </Form.Group>
                        )}
                        <div className="d-flex gap-2">
                            <Button as={Link} to={backPath} variant="outline-secondary">Back to List</Button>
                            {!isQuality && !isRejected && !isApproved && <Button disabled>Save Note</Button>}
                            {isTechnicianApproval && <><Button variant="success" disabled>Approve</Button><Button variant="danger" disabled>Reject</Button></>}
                            {isDoctorApproval && <><Button variant="success" disabled>Authorize</Button><Button variant="danger" disabled>Reject</Button></>}
                            {isRejected && <Button variant="primary" disabled>Re-Run Sample</Button>}
                        </div>
                        <Alert variant="info" className="mt-3 mb-0">
                            Result review and authorization controls are presentational only and do not change Firestore records.
                        </Alert>
                    </div>
                </div>
            )}
        </>
    );
};

const DetailValue = ({ label, value }) => (
    <div className="col-sm-6 col-lg-3 mb-3">
        <strong>{label}</strong>
        <div>{formatValue(value) || "—"}</div>
    </div>
);

const formatValue = value => {
    if (value && typeof value === "object" && typeof value.toDate === "function") {
        return value.toDate().toLocaleString();
    }
    if (value && typeof value === "object") {
        return value.name || value.text || value.id || "";
    }
    return value == null ? "" : String(value);
};

const radiologyPaths = [
    "/radiology-report-entry",
    "/radiology-doctor-approvals",
    "/radiology-approved-reports",
];

export const LISRadiologyPage = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const isApproval = location.pathname === "/radiology-doctor-approvals";
    const isApproved = location.pathname === "/radiology-approved-reports";
    const results = useSelector(state => state.api.radiologyResult);
    const requests = useSelector(state => state.api.radiologyRequest?.items || EMPTY_ITEMS);
    const patients = useSelector(state => state.api.patient?.items || EMPTY_ITEMS);
    const [search, setSearch] = useState("");
    const [modality, setModality] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [appliedModality, setAppliedModality] = useState("");
    const [selected, setSelected] = useState(null);
    const [report, setReport] = useState({});

    useEffect(() => {
        dispatch(getData({ module: "radiologyResult", options: { recordPerPage: 0 } }));
        dispatch(getData({ module: "radiologyRequest", options: { recordPerPage: 0 } }));
        dispatch(getData({ module: "patient", options: { recordPerPage: 0 } }));
    }, [dispatch]);

    const rows = useMemo(() => {
        const allRows = (results?.items || []).map(result => {
            const request = requests.find(item => item.id === result.radiologyRequestId) || {};
            const patient = patients.find(item => item.id === request.patientId) || {};
            return {
                ...result,
                accessionNo: result.accessionNo || request.requestNo || request.invoiceNo || result.radiologyRequestId,
                patientName: result.patientName || patient.name || request.patientName || request.patientId,
                testName: result.testName || request.examType || request.testName,
                modality: result.modality || request.modality || request.examType,
                clinicalHistory: result.clinicalHistory || request.comments,
            };
        });
        const term = appliedSearch.trim().toLowerCase();
        const modalityTerm = appliedModality.trim().toLowerCase();
        return allRows.filter(row => {
            const matchesSearch = !term || [
                row.accessionNo, row.patientName, row.testName, row.modality, row.status,
            ].some(value => String(value || "").toLowerCase().includes(term));
            const matchesModality = !modalityTerm || String(row.modality || "").toLowerCase().includes(modalityTerm);
            if (!matchesSearch || !matchesModality) {
                return false;
            }
            const status = String(row.status || "").toLowerCase();
            if (isApproval) {
                return ["submitted", "pending approval", "pending"].includes(status);
            }
            if (isApproved) {
                return ["authorized", "approved", "released"].includes(status);
            }
            return !["finalized", "cancelled"].includes(status);
        });
    }, [appliedModality, appliedSearch, isApproval, isApproved, patients, requests, results?.items]);

    const openRecord = row => {
        setSelected(row);
        setReport({
            clinicalHistory: row.clinicalHistory || "",
            findings: row.findings || "",
            impression: row.impression || "",
            recommendation: row.recommendation || "",
        });
    };
    const updateReport = field => event => setReport(current => ({ ...current, [field]: event.target.value }));
    const title = isApproval ? "Radiology Doctor Approval" : isApproved ? "Approved Radiology Reports" : "Radiology Report Entry";

    return (
        <>
            <div className="app-page-title">
                <div className="page-title-heading">{title}</div>
            </div>
            {!selected ? (
                <div className="main-card mb-3 card">
                    <div className="card-body">
                        <p className="text-muted">
                            {isApproval
                                ? "Review radiology reports submitted for doctor approval."
                                : isApproved
                                    ? "Radiology reports available for review."
                                    : "Enter and submit radiology findings for doctor approval."}
                        </p>
                        <Form onSubmit={event => {
                            event.preventDefault();
                            setAppliedSearch(search);
                            setAppliedModality(modality);
                        }}>
                            <div className="row g-3 align-items-end">
                                <Form.Group className="col-md-4" controlId="radiologySearch">
                                    <Form.Label>Search</Form.Label>
                                    <Form.Control value={search} onChange={event => setSearch(event.target.value)} />
                                </Form.Group>
                                <Form.Group className="col-md-3" controlId="radiologyModality">
                                    <Form.Label>Modality</Form.Label>
                                    <Form.Control value={modality} onChange={event => setModality(event.target.value)} />
                                </Form.Group>
                                <div className="col-md-2"><Button type="submit">Search</Button></div>
                            </div>
                        </Form>
                        {results?.status === "error" &&
                            <Alert variant="danger" className="mt-3">Unable to load radiology cases: {results.message}</Alert>
                        }
                        {(!results || results.status === "loading") && <p role="status">Loading radiology cases...</p>}
                        <Table responsive hover className="mt-3">
                            <thead>
                                <tr><th>Accession</th><th>Patient</th><th>Test</th><th>Modality</th><th>Status</th><th></th></tr>
                            </thead>
                            <tbody>
                                {rows.map(row => (
                                    <tr key={row.id}>
                                        <td>{row.accessionNo || "—"}</td>
                                        <td>{row.patientName || "—"}</td>
                                        <td>{row.testName || "—"}</td>
                                        <td>{row.modality || "—"}</td>
                                        <td>{row.status || "Pending"}</td>
                                        <td>
                                            <Button size="sm" variant={isApproval ? "success" : "primary"} onClick={() => openRecord(row)}>
                                                {isApproval ? "Review" : isApproved ? "View" : "Entry"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {!rows.length && results && results.status !== "loading" &&
                                    <tr><td colSpan={6} className="text-center text-muted">No radiology cases in the queue.</td></tr>
                                }
                            </tbody>
                        </Table>
                        <Alert variant="info" className="mb-0">
                            Report entry and authorization are UI-only. Saving and releasing reports require the Angular
                            application's radiology services.
                        </Alert>
                    </div>
                </div>
            ) : (
                <div className="main-card mb-3 card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <span><strong>{selected.testName || "Radiology Report"}</strong> — {selected.modality || "—"} ({selected.status || "Pending"})</span>
                        <Button size="sm" variant="outline-secondary" onClick={() => setSelected(null)}>Back</Button>
                    </div>
                    <div className="card-body">
                        <div className="border rounded p-3 mb-3">
                            <h5>Patient Details</h5>
                            <div className="row">
                                <p className="col-md-3"><strong>Patient Name</strong><br />{selected.patientName || "—"}</p>
                                <p className="col-md-3"><strong>Accession</strong><br />{selected.accessionNo || "—"}</p>
                                <p className="col-md-3"><strong>Age / Gender</strong><br />{selected.age || "—"} / {selected.gender || "—"}</p>
                                <p className="col-md-3"><strong>Result Date</strong><br />{selected.reportDateTime || "—"}</p>
                            </div>
                        </div>
                        {[
                            ["clinicalHistory", "Clinical History", 2],
                            ["findings", "Findings", 4],
                            ["impression", "Impression", 3],
                            ["recommendation", "Recommendation", 2],
                        ].map(([field, label, rowsCount]) => (
                            <Form.Group key={field} className="mb-3">
                                <Form.Label>{label}{["findings", "impression"].includes(field) && !isApproval && !isApproved ? " *" : ""}</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={rowsCount}
                                    value={report[field] || ""}
                                    onChange={updateReport(field)}
                                    readOnly={isApproval || isApproved}
                                />
                            </Form.Group>
                        ))}
                        <div className="d-flex gap-2">
                            {!isApproval && !isApproved && <Button disabled>Save Draft</Button>}
                            {!isApproval && !isApproved && <Button variant="primary" disabled>Submit for Doctor Approval</Button>}
                            {isApproval && <Button variant="success" disabled>Authorize</Button>}
                            {isApproval && <Button variant="info" disabled>Authorize &amp; Release</Button>}
                        </div>
                        <Alert variant="info" className="mt-3 mb-0">
                            This detail view is a UI placeholder. Report changes and authorization are not saved.
                        </Alert>
                    </div>
                </div>
            )}
        </>
    );
};

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

export const LISReportPage = () => {
    const location = useLocation();
    const title = reportRoutes[location.pathname] || "Reports";
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    return (
        <>
            <div className="app-page-title">
                <div className="page-title-heading">{title}</div>
            </div>
            <div className="main-card mb-3 card">
                <div className="card-body">
                    <Form>
                        <div className="row g-3 align-items-end">
                            <Form.Group className="col-md-3" controlId="reportFromDate">
                                <Form.Label>From Date</Form.Label>
                                <Form.Control type="date" value={fromDate} onChange={event => setFromDate(event.target.value)} />
                            </Form.Group>
                            <Form.Group className="col-md-3" controlId="reportToDate">
                                <Form.Label>To Date</Form.Label>
                                <Form.Control type="date" value={toDate} onChange={event => setToDate(event.target.value)} />
                            </Form.Group>
                            <div className="col-md-3">
                                <Button type="button" disabled>Generate Report</Button>
                            </div>
                        </div>
                    </Form>
                    <hr />
                    <Alert variant="info" className="mb-0">
                        The report layout is available, but generating or exporting this report requires the Angular
                        application's report services, which are not part of this UI-only port.
                    </Alert>
                </div>
            </div>
        </>
    );
};

export const LISCommissionPage = () => {
    const [recipientType, setRecipientType] = useState("doctor");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    return (
        <>
            <div className="app-page-title">
                <div className="page-title-heading">Commission Payout</div>
            </div>
            <div className="main-card mb-3 card">
                <div className="card-body">
                    <p className="text-muted">
                        Set a recipient and payout period to preview eligible invoices. The payout calculation and
                        confirmation depend on the Angular application's commission service.
                    </p>
                    <Form>
                        <div className="row g-3 align-items-end">
                            <Form.Group className="col-md-3" controlId="commissionRecipientType">
                                <Form.Label>Recipient</Form.Label>
                                <Form.Select value={recipientType} onChange={event => setRecipientType(event.target.value)}>
                                    <option value="doctor">Referral Doctor</option>
                                    <option value="collector">Sample Collector</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="col-md-3" controlId="commissionRecipient">
                                <Form.Label>Name</Form.Label>
                                <Form.Select defaultValue="">
                                    <option value="">-- Select --</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="col-md-2" controlId="commissionFromDate">
                                <Form.Label>From Date</Form.Label>
                                <Form.Control type="date" value={fromDate} onChange={event => setFromDate(event.target.value)} />
                            </Form.Group>
                            <Form.Group className="col-md-2" controlId="commissionToDate">
                                <Form.Label>To Date</Form.Label>
                                <Form.Control type="date" value={toDate} onChange={event => setToDate(event.target.value)} />
                            </Form.Group>
                            <div className="col-md-2">
                                <Button disabled>Preview</Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
            <div className="main-card mb-3 card">
                <div className="card-header">History</div>
                <div className="card-body">
                    <Table responsive>
                        <thead>
                            <tr><th>Payout No.</th><th>Recipient</th><th>From</th><th>To</th><th>Amount</th><th></th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={6} className="text-center text-muted">Payout history requires the commission service.</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
            <Alert variant="info">
                Preview, confirmation, and payout memo generation are not connected in this UI-only port.
            </Alert>
        </>
    );
};

export const LISWorkflowRoutes = [
    ...Object.keys(workflowPages)
        .filter(path => !radiologyPaths.includes(path))
        .map(path => ({ path, element: <LISWorkflowPage /> })),
    ...radiologyPaths.map(path => ({ path, element: <LISRadiologyPage /> })),
    ...[
        "/technicianapprovals/:id",
        "/technician-samples/:id",
        "/doctor-samples/:id",
        "/approved-samples/:id",
        "/rejected-samples/:id",
        "/quality-controls/:id",
        "/edit-test-results/:id",
    ].map(path => ({ path, element: <LISResultDetailPage /> })),
];
