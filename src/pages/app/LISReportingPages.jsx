import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Button, Form, Table } from "react-bootstrap";

const REPORT_CONFIGS = {
    "/reports/sale-invoice-register": {
        title: "Sale Invoice Register",
        reportType: "SaleInvoiceRegister",
        layout: "sale-invoice",
        description: "Operational invoice listing for the selected period.",
        filters: [
            { name: "fromDate", label: "From Date", type: "date", width: 2 },
            { name: "toDate", label: "To Date", type: "date", width: 2 },
            { name: "patientId", label: "Patient", type: "select", width: 3, placeholder: "All Patients" },
            { name: "referralDoctorId", label: "Referral Doctor", type: "select", width: 3, placeholder: "All Doctors" },
            { name: "invoiceNo", label: "Invoice No.", type: "text", width: 2 },
            { name: "createdById", label: "Created By", type: "select", width: 3, secondRow: true, placeholder: "All Users" },
        ],
        columns: [
            "Invoice Date", "Invoice No.", "Patient ID", "Patient Name", "Referral Doctor", "Corporate",
            "Gross", "Discount", "Tax", "Net", "Status", "Payment", "Created By",
        ],
    },
    "/reports/test-booking-register": {
        title: "Test Booking Register",
        reportType: "TestBookingRegister",
        layout: "test-booking",
        description: "Test booking and sample request listing for the selected period.",
        filters: [
            { name: "fromDate", label: "From Date", type: "date", width: 2, required: true },
            { name: "toDate", label: "To Date", type: "date", width: 2, required: true },
            { name: "patientId", label: "Patient", type: "select", width: 4, placeholder: "All patients" },
            { name: "referralDoctorId", label: "Referral Doctor", type: "select", width: 4, placeholder: "All doctors" },
        ],
        columns: [
            "Booking Date", "Request No.", "Invoice No.", "Patient ID", "Patient Name", "Test Name",
            "Department", "Specimen", "Referral Doctor", "Status", "Sample No.", "Created By",
        ],
    },
    "/reports/collection-summary": {
        title: "Collection Summary",
        reportType: "CollectionSummary",
        layout: "fdd",
        description: "Report summary based on selected date range and filters.",
        filters: { patient: true },
        columns: [
            "Collection Date", "Barcode", "Order No.", "Patient ID", "Patient", "Test", "Collector", "Status",
        ],
    },
    "/reports/collector-wise": {
        title: "Collector Wise Report",
        reportType: "CollectorWise",
        layout: "fdd",
        description: "Report summary based on selected date range and filters.",
        filters: { collector: true, patient: false },
        columns: ["Collector", "Collected", "Rejected", "Recollection"],
    },
    "/reports/pending-collection": {
        title: "Pending Collection Report",
        reportType: "PendingCollection",
        layout: "fdd",
        description: "Report summary based on selected date range and filters.",
        filters: { patient: false },
        columns: ["Barcode", "Order No.", "Patient ID", "Patient", "Test", "Order Date"],
    },
    "/reports/recollection": {
        title: "Recollection Report",
        reportType: "Recollection",
        layout: "fdd",
        description: "Report summary based on selected date range and filters.",
        filters: { patient: true },
        columns: ["Barcode", "Order", "Patient", "Test", "Collector", "Date", "Remarks"],
    },
    "/reports/received-samples": {
        title: "Received Samples Report",
        reportType: "ReceivedSamples",
        layout: "fdd",
        description: "Report summary based on selected date range and filters.",
        filters: { patient: true },
        columns: ["Barcode", "Patient", "Test", "Collected", "Received", "Received By", "TAT (min)"],
    },
    "/reports/rejected-samples": {
        title: "Rejected Samples Report",
        reportType: "RejectedSamples",
        layout: "fdd",
        description: "Report summary based on selected date range and filters.",
        filters: { patient: true },
        columns: ["Barcode", "Patient", "Test", "Stage", "Reason", "Rejected By", "Rejected On"],
    },
    "/reports/sample-turnaround": {
        title: "Turnaround Time Report",
        reportType: "SampleTurnaround",
        layout: "fdd",
        description: "Report summary based on selected date range and filters.",
        filters: { patient: true },
        columns: ["Barcode", "Patient", "Test", "Collection", "Received", "TAT (min)"],
    },
    "/reports/radiology/pending": {
        title: "Pending Reporting Cases",
        reportType: "PendingRadiology",
        layout: "fdd",
        description: "Report summary based on selected date range and filters.",
        filters: { patient: true, modality: true },
        columns: ["Accession", "Patient", "Test", "Modality", "Status", "Created"],
    },
    "/reports/radiology/authorized": {
        title: "Authorized Reports",
        reportType: "AuthorizedRadiology",
        layout: "fdd",
        description: "Report summary based on selected date range and filters.",
        filters: { patient: true, modality: true },
        columns: ["Accession", "Patient", "Test", "Modality", "Authorized By", "Authorized On", "Status"],
    },
    "/reports/radiology/modality-stats": {
        title: "Modality Statistics",
        reportType: "ModalityStatistics",
        layout: "fdd",
        description: "Report summary based on selected date range and filters.",
        filters: { patient: false },
        columns: ["Modality", "Total", "Authorized", "Pending"],
    },
    "/reports/radiology/productivity": {
        title: "Radiologist Productivity Report",
        reportType: "RadiologistProductivity",
        layout: "fdd",
        description: "Report summary based on selected date range and filters.",
        filters: { patient: false },
        columns: ["Radiologist", "Authorized", "Released"],
    },
    "/reports/doctor-commission": {
        title: "Doctor Commission",
        reportType: "CommissionReport",
        recipient: "doctor",
        layout: "commission",
    },
    "/reports/collector-commission": {
        title: "Collector Commission",
        reportType: "CommissionReport",
        recipient: "collector",
        layout: "commission",
    },
    "/reports/test-report": {
        title: "Diagnostic Report",
        reportType: "TestReport",
        layout: "test-report",
    },
    "/reports/radiology-report": {
        title: "Radiology Report Print",
        reportType: "RadiologyReportPrint",
        layout: "radiology-report",
    },
};

const REPORT_UI_ONLY_MESSAGE =
    "This report is UI-only. Searching and exporting require the Angular application's report services and are unavailable here.";

const PageHeading = ({ title }) => (
    <div className="app-page-title">
        <div className="page-title-heading">{title}</div>
    </div>
);

const FilterPanel = ({ children }) => (
    <div className="main-card mb-3 card">
        <div className="card-body">{children}</div>
    </div>
);

const EmptyReportTable = ({ columns, message = "Report data will appear after report service integration." }) => (
    <Table responsive hover className="mb-0">
        <thead>
            <tr>{columns.map(column => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
            <tr>
                <td colSpan={columns.length} className="text-center text-muted py-4">{message}</td>
            </tr>
        </tbody>
    </Table>
);

const FilterControl = ({ field, value, onChange, filters }) => (
    <Form.Group
        className={`col-md-${field.width}${field.secondRow ? " pt-md-2" : ""}`}
        controlId={`report-${field.name}`}
    >
        <Form.Label>{field.label}{field.required ? " *" : ""}</Form.Label>
        {field.type === "select" ? (
            <Form.Select value={value || ""} onChange={onChange} disabled>
                <option value="">{field.placeholder || "All"}</option>
            </Form.Select>
        ) : (
            <Form.Control
                type={field.type}
                value={value || ""}
                onChange={onChange}
                min={field.name === "toDate" ? filters.fromDate || undefined : undefined}
            />
        )}
    </Form.Group>
);

const ReportActions = ({ reset }) => (
    <div className="d-flex gap-2">
        <Button type="button" size="sm" disabled>Search</Button>
        <Button type="button" size="sm" variant="outline-secondary" onClick={reset}>Reset</Button>
        <Button type="button" size="sm" variant="success" disabled>Export to Excel</Button>
    </div>
);

const FddReportPage = ({ config }) => {
    const [filters, setFilters] = useState({});
    const filterConfig = config.filters;
    const fields = [
        { name: "fromDate", label: "From Date", type: "date", width: 2, required: true },
        { name: "toDate", label: "To Date", type: "date", width: 2, required: true },
        ...(filterConfig.patient ? [
            { name: "patientId", label: "Patient", type: "select", width: 4, placeholder: "All patients" },
        ] : []),
        ...(filterConfig.collector ? [
            { name: "collectorName", label: "Collector", type: "text", width: 2 },
        ] : []),
        ...(filterConfig.modality ? [
            { name: "modality", label: "Modality", type: "text", width: 2 },
        ] : []),
    ];
    const updateFilter = name => event => setFilters(current => ({ ...current, [name]: event.target.value }));
    const reset = () => setFilters({});

    return (
        <>
            <PageHeading title={config.title} />
            <FilterPanel>
                <h5 className="mb-2">{config.title}</h5>
                <p className="text-muted">{config.description}</p>
                <Form>
                    <div className="row g-3 align-items-end">
                        {fields.map(field => (
                            <FilterControl
                                key={field.name}
                                field={field}
                                value={filters[field.name]}
                                onChange={updateFilter(field.name)}
                                filters={filters}
                            />
                        ))}
                        <div className="col-12">
                            <ReportActions reset={reset} />
                        </div>
                    </div>
                </Form>
            </FilterPanel>
            <FilterPanel>
                <EmptyReportTable columns={config.columns} />
            </FilterPanel>
            <Alert variant="info" className="mb-0">{REPORT_UI_ONLY_MESSAGE}</Alert>
        </>
    );
};

const RegisterReportPage = ({ config }) => {
    const [filters, setFilters] = useState({});
    const updateFilter = name => event => setFilters(current => ({ ...current, [name]: event.target.value }));
    const reset = () => setFilters({});
    const firstRow = config.filters.filter(field => !field.secondRow);
    const secondRow = config.filters.filter(field => field.secondRow);

    return (
        <>
            <PageHeading title={config.title} />
            <FilterPanel>
                <h5 className="mb-2">{config.title}</h5>
                <p className="text-muted">{config.description}</p>
                <Form>
                    <div className="row g-3 align-items-end">
                        {firstRow.map(field => (
                            <FilterControl
                                key={field.name}
                                field={field}
                                value={filters[field.name]}
                                onChange={updateFilter(field.name)}
                                filters={filters}
                            />
                        ))}
                    </div>
                    {secondRow.length > 0 && (
                        <div className="row g-3 align-items-end mt-1">
                            {secondRow.map(field => (
                                <FilterControl
                                    key={field.name}
                                    field={field}
                                    value={filters[field.name]}
                                    onChange={updateFilter(field.name)}
                                    filters={filters}
                                />
                            ))}
                        </div>
                    )}
                    <div className="mt-3">
                        <ReportActions reset={reset} />
                    </div>
                </Form>
            </FilterPanel>
            <FilterPanel>
                <EmptyReportTable columns={config.columns} />
            </FilterPanel>
            <Alert variant="info" className="mb-0">{REPORT_UI_ONLY_MESSAGE}</Alert>
        </>
    );
};

const CommissionReportPage = ({ config }) => {
    const [filters, setFilters] = useState({ format: "Summary" });
    const updateFilter = name => event => setFilters(current => ({ ...current, [name]: event.target.value }));
    const summaryColumns = ["Recipient", "Invoices", "Amount"];
    const detailColumns = ["Invoice No", "Invoice Date", "Recipient", "Commission Base", "Rate", "Amount"];

    return (
        <>
            <PageHeading title={config.title} />
            <FilterPanel>
                <h5 className="mb-2">{config.title}</h5>
                <p className="text-muted">
                    One format at a time. Eligible invoices are payment Paid and invoice status Confirmed or Paid.
                </p>
                <Form>
                    <div className="row g-3 align-items-end">
                        <Form.Group className="col-sm-2" controlId="commission-report-from">
                            <Form.Label>From Date</Form.Label>
                            <Form.Control type="date" value={filters.fromDate || ""} onChange={updateFilter("fromDate")} />
                        </Form.Group>
                        <Form.Group className="col-sm-2" controlId="commission-report-to">
                            <Form.Label>To Date</Form.Label>
                            <Form.Control type="date" min={filters.fromDate || undefined} value={filters.toDate || ""} onChange={updateFilter("toDate")} />
                        </Form.Group>
                        <Form.Group className="col-sm-3" controlId="commission-report-recipient">
                            <Form.Label>{config.recipient === "doctor" ? "Referral Doctor" : "Sample Collector"}</Form.Label>
                            <Form.Select disabled>
                                <option value="">All</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="col-sm-3">
                            <Form.Label>Format</Form.Label>
                            <div className="d-flex gap-3 pt-1">
                                {["Summary", "Detail"].map(format => (
                                    <Form.Check
                                        key={format}
                                        inline
                                        type="radio"
                                        name={`commission-format-${config.recipient}`}
                                        id={`commission-format-${config.recipient}-${format.toLowerCase()}`}
                                        label={format}
                                        value={format}
                                        checked={filters.format === format}
                                        onChange={updateFilter("format")}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                        <div className="col-sm-2 d-flex gap-2">
                            <Button type="button" size="sm" disabled>Search</Button>
                            <Button type="button" size="sm" variant="outline-success" disabled>Excel</Button>
                        </div>
                    </div>
                </Form>
            </FilterPanel>
            <FilterPanel>
                <p className="text-muted">Report results and totals will appear after commission service integration.</p>
                <EmptyReportTable columns={filters.format === "Detail" ? detailColumns : summaryColumns} message="No report data is available in this UI-only page." />
            </FilterPanel>
            <Alert variant="info" className="mb-0">{REPORT_UI_ONLY_MESSAGE}</Alert>
        </>
    );
};

const PrintReportSearchPage = ({ config, radiology = false }) => {
    const [lookupValue, setLookupValue] = useState("");
    const fieldLabel = radiology ? "Accession No" : "Lab No";
    const reportName = radiology ? "Radiology Diagnostic Report" : "Diagnostic Report";

    return (
        <>
            <PageHeading title={config.title} />
            <FilterPanel>
                <h5 className="mb-2">{config.title}</h5>
                <p className="text-muted">
                    {radiology
                        ? "Authorized radiology reports — paid invoices only."
                        : "Paid invoices only. Print All requires every test approved; individual approved tests may print earlier."}
                </p>
                <Form>
                    <div className="row g-3">
                        <Form.Group className="col-md-8" controlId={radiology ? "radiology-accession" : "diagnostic-lab-number"}>
                            <Form.Label>{fieldLabel}</Form.Label>
                            <Form.Control
                                value={lookupValue}
                                onChange={event => setLookupValue(event.target.value)}
                                placeholder={`Select ${fieldLabel.toLowerCase()}`}
                            />
                        </Form.Group>
                    </div>
                    {!radiology && (
                        <div className="row mt-2">
                            <Form.Group className="col-md-8">
                                <Form.Label>Print</Form.Label>
                                <div className="d-flex gap-3">
                                    <Form.Check type="radio" name="diagnostic-print-mode" label="All Reports" disabled />
                                    <Form.Check type="radio" name="diagnostic-print-mode" label="Specific Report" disabled />
                                </div>
                                <Form.Select className="mt-2" disabled>
                                    <option>Select report</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    )}
                    <div className="d-flex gap-2 mt-3">
                        <Button type="button" size="sm" variant="outline-secondary" disabled title="Lookup services are unavailable">Refresh list</Button>
                        <Button type="button" size="sm" disabled>Search</Button>
                        <Button type="button" size="sm" variant="outline-secondary" onClick={() => setLookupValue("")}>Reset</Button>
                        <Button type="button" size="sm" variant="success" disabled>Print Report</Button>
                    </div>
                </Form>
            </FilterPanel>
            <FilterPanel>
                <h5>{reportName}</h5>
                <p className="text-muted mb-0">The printable report and patient results require the report service and are not available in this UI-only port.</p>
                {radiology ? (
                    <>
                        <Table bordered responsive className="mt-3">
                            <tbody>
                                <tr><th>Accession No</th><td>—</td><th>Invoice No</th><td>—</td></tr>
                                <tr><th>Patient</th><td colSpan={3}>—</td></tr>
                                <tr><th>MR No</th><td>—</td><th>Visit ID</th><td>—</td></tr>
                                <tr><th>Age / Gender</th><td>—</td><th>Reported</th><td>—</td></tr>
                            </tbody>
                        </Table>
                        {["Clinical History", "Findings", "Impression", "Recommendation"].map(section => (
                            <section key={section} className="border rounded p-3 mb-3">
                                <h6>{section}</h6>
                                <p className="mb-0 text-muted">—</p>
                            </section>
                        ))}
                    </>
                ) : (
                    <>
                        <Table bordered responsive className="mt-3">
                            <tbody>
                                <tr><th>Patient Name</th><td>—</td><th>Collected</th><td>—</td></tr>
                                <tr><th>Age / Gender</th><td>—</td><th>Received</th><td>—</td></tr>
                                <tr><th>UHID / MR No</th><td>—</td><th>Reported</th><td>—</td></tr>
                                <tr><th>Visit ID</th><td>—</td><th>Status</th><td>—</td></tr>
                                <tr><th>Referring Doctor</th><td>—</td><th>Centre</th><td>—</td></tr>
                                <tr><th>Lab No</th><td>—</td><th>Invoice No</th><td>—</td></tr>
                            </tbody>
                        </Table>
                        <Table responsive className="mb-0">
                            <thead>
                                <tr>
                                    <th>Test Name / Parameter</th>
                                    <th className="text-center">Result</th>
                                    <th className="text-center">Unit</th>
                                    <th className="text-center">Bio. Ref. Interval</th>
                                </tr>
                            </thead>
                        </Table>
                        <div className="d-flex justify-content-between mt-5">
                            <span>Reviewing Technician<br />_________________________</span>
                            <span>Approving Doctor<br />_________________________</span>
                        </div>
                    </>
                )}
            </FilterPanel>
            <Alert variant="info" className="mb-0">{REPORT_UI_ONLY_MESSAGE}</Alert>
        </>
    );
};

const CommissionPayoutPageComponent = () => {
    const [recipientType, setRecipientType] = useState("1");
    const [toDate, setToDate] = useState("");

    return (
        <>
            <PageHeading title="Commission Payout" />
            <FilterPanel>
                <h5 className="mb-2">Commission Payout</h5>
                <p className="text-muted">
                    The From date is fixed. The first payout starts on the first day of the implementation month.
                    The next From date is the day after the previous To date.
                </p>
                <Form>
                    <div className="row g-3 align-items-end">
                        <Form.Group className="col-sm-2" controlId="payout-recipient-type">
                            <Form.Label>Recipient</Form.Label>
                            <Form.Select value={recipientType} onChange={event => setRecipientType(event.target.value)}>
                                <option value="1">Referral Doctor</option>
                                <option value="2">Sample Collector</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="col-sm-3" controlId="payout-recipient">
                            <Form.Label>Name</Form.Label>
                            <Form.Select disabled>
                                <option value="">-- Select --</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="col-sm-2" controlId="payout-from-date">
                            <Form.Label>From Date</Form.Label>
                            <Form.Control type="date" disabled />
                            <Form.Text>Calculated by the commission service</Form.Text>
                        </Form.Group>
                        <Form.Group className="col-sm-2" controlId="payout-to-date">
                            <Form.Label>To Date</Form.Label>
                            <Form.Control type="date" value={toDate} onChange={event => setToDate(event.target.value)} />
                        </Form.Group>
                        <div className="col-sm-3 d-flex gap-2">
                            <Button type="button" variant="outline-secondary" disabled>Preview</Button>
                            <Button type="button" disabled>Confirm</Button>
                        </div>
                    </div>
                </Form>
            </FilterPanel>
            <FilterPanel>
                <h5>History</h5>
                <Table responsive className="mb-0">
                    <thead>
                        <tr><th>Payout No</th><th>Recipient</th><th>From</th><th>To</th><th>Amount</th><th></th></tr>
                    </thead>
                    <tbody>
                        <tr><td colSpan={6} className="text-center text-muted">No payout history is available without the commission service.</td></tr>
                    </tbody>
                </Table>
            </FilterPanel>
            <Alert variant="info" className="mb-0">
                Preview, confirmation, history, and payout memo data require the Angular application's commission service.
                Actions are disabled in this UI-only port.
            </Alert>
        </>
    );
};

const CommissionPayoutMemoPageComponent = () => {
    const { id } = useParams();

    return (
        <>
            <PageHeading title="Commission Payout Memo" />
            <FilterPanel>
                <div className="d-flex justify-content-between gap-2 mb-3">
                    <Button type="button" variant="primary" disabled>Print</Button>
                    <Button as={Link} to="/commission-payouts" variant="outline-secondary">Back</Button>
                </div>
                <div className="border rounded p-4">
                    <div className="text-center">
                        <h4>Laboratory</h4>
                        <h5>Commission Payout Memo</h5>
                    </div>
                    <p className="mt-4">
                        <strong>Payout No: —</strong><br />
                        Recipient: —<br />
                        Period: — to —
                    </p>
                    {id && <p className="small text-muted">Payout record ID: {id}</p>}
                    <Table bordered responsive>
                        <thead>
                            <tr><th>Invoice No</th><th>Invoice Date</th><th>Commission Base</th><th>Rate</th><th>Amount</th></tr>
                        </thead>
                        <tbody>
                            <tr><td colSpan={5} className="text-center text-muted">Payout details are unavailable without the commission service.</td></tr>
                        </tbody>
                    </Table>
                    <p className="text-end"><strong>Total —</strong></p>
                    <p className="text-center mt-5 mb-0">Acknowledged<br /><span className="d-inline-block mt-4">_________________________</span></p>
                </div>
            </FilterPanel>
            <Alert variant="info" className="mb-0">
                Memo details and printing require the Angular application's commission service and are unavailable in this UI-only port.
            </Alert>
        </>
    );
};

export const SaleInvoiceRegisterReportPage = () => <RegisterReportPage config={REPORT_CONFIGS["/reports/sale-invoice-register"]} />;
export const TestBookingRegisterReportPage = () => <RegisterReportPage config={REPORT_CONFIGS["/reports/test-booking-register"]} />;
export const CollectionSummaryReportPage = () => <FddReportPage config={REPORT_CONFIGS["/reports/collection-summary"]} />;
export const CollectorWiseReportPage = () => <FddReportPage config={REPORT_CONFIGS["/reports/collector-wise"]} />;
export const PendingCollectionReportPage = () => <FddReportPage config={REPORT_CONFIGS["/reports/pending-collection"]} />;
export const RecollectionReportPage = () => <FddReportPage config={REPORT_CONFIGS["/reports/recollection"]} />;
export const ReceivedSamplesReportPage = () => <FddReportPage config={REPORT_CONFIGS["/reports/received-samples"]} />;
export const RejectedSamplesReportPage = () => <FddReportPage config={REPORT_CONFIGS["/reports/rejected-samples"]} />;
export const SampleTurnaroundReportPage = () => <FddReportPage config={REPORT_CONFIGS["/reports/sample-turnaround"]} />;
export const PendingRadiologyReportPage = () => <FddReportPage config={REPORT_CONFIGS["/reports/radiology/pending"]} />;
export const AuthorizedRadiologyReportPage = () => <FddReportPage config={REPORT_CONFIGS["/reports/radiology/authorized"]} />;
export const ModalityStatisticsReportPage = () => <FddReportPage config={REPORT_CONFIGS["/reports/radiology/modality-stats"]} />;
export const RadiologistProductivityReportPage = () => <FddReportPage config={REPORT_CONFIGS["/reports/radiology/productivity"]} />;
export const DoctorCommissionReportPage = () => <CommissionReportPage config={REPORT_CONFIGS["/reports/doctor-commission"]} />;
export const CollectorCommissionReportPage = () => <CommissionReportPage config={REPORT_CONFIGS["/reports/collector-commission"]} />;
export const TestReportPage = () => <PrintReportSearchPage config={REPORT_CONFIGS["/reports/test-report"]} />;
export const RadiologyReportPrintPage = () => <PrintReportSearchPage config={REPORT_CONFIGS["/reports/radiology-report"]} radiology />;
export const CommissionPayoutPage = CommissionPayoutPageComponent;
export const CommissionPayoutMemoPage = CommissionPayoutMemoPageComponent;

export const LIS_REPORT_PAGE_CONFIGS = Object.freeze({
    "/reports/sale-invoice-register": { title: "Sale Invoice Register", reportType: "SaleInvoiceRegister", component: SaleInvoiceRegisterReportPage },
    "/reports/test-booking-register": { title: "Test Booking Register", reportType: "TestBookingRegister", component: TestBookingRegisterReportPage },
    "/reports/collection-summary": { title: "Collection Summary", reportType: "CollectionSummary", component: CollectionSummaryReportPage },
    "/reports/collector-wise": { title: "Collector Wise Report", reportType: "CollectorWise", component: CollectorWiseReportPage },
    "/reports/pending-collection": { title: "Pending Collection Report", reportType: "PendingCollection", component: PendingCollectionReportPage },
    "/reports/recollection": { title: "Recollection Report", reportType: "Recollection", component: RecollectionReportPage },
    "/reports/received-samples": { title: "Received Samples Report", reportType: "ReceivedSamples", component: ReceivedSamplesReportPage },
    "/reports/rejected-samples": { title: "Rejected Samples Report", reportType: "RejectedSamples", component: RejectedSamplesReportPage },
    "/reports/sample-turnaround": { title: "Turnaround Time Report", reportType: "SampleTurnaround", component: SampleTurnaroundReportPage },
    "/reports/radiology/pending": { title: "Pending Reporting Cases", reportType: "PendingRadiology", component: PendingRadiologyReportPage },
    "/reports/radiology/authorized": { title: "Authorized Reports", reportType: "AuthorizedRadiology", component: AuthorizedRadiologyReportPage },
    "/reports/radiology/modality-stats": { title: "Modality Statistics", reportType: "ModalityStatistics", component: ModalityStatisticsReportPage },
    "/reports/radiology/productivity": { title: "Radiologist Productivity Report", reportType: "RadiologistProductivity", component: RadiologistProductivityReportPage },
    "/reports/doctor-commission": { title: "Doctor Commission", reportType: "CommissionReport", recipient: "doctor", component: DoctorCommissionReportPage },
    "/reports/collector-commission": { title: "Collector Commission", reportType: "CommissionReport", recipient: "collector", component: CollectorCommissionReportPage },
    "/reports/test-report": { title: "Diagnostic Report", reportType: "TestReport", component: TestReportPage },
    "/reports/radiology-report": { title: "Radiology Report Print", reportType: "RadiologyReportPrint", component: RadiologyReportPrintPage },
});

export const LISReportingRoutes = [
    ...Object.entries(LIS_REPORT_PAGE_CONFIGS).map(([path, { component: Page }]) => ({
        path,
        element: <Page />,
    })),
    { path: "/commission-payouts", element: <CommissionPayoutPage /> },
    { path: "/commission-payouts/:id", element: <CommissionPayoutMemoPage /> },
    { path: "/commission-payouts/:id/memo", element: <CommissionPayoutMemoPage /> },
];
