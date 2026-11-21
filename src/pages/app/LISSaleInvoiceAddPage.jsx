import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Form, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addData, editData, getData } from "../../store/api-db";
import { calculateInvoiceAmounts, filterBillableItems, invoiceInputErrors, isActiveRecord, lineDiscountAmount, standardTestRate } from "./saleInvoiceBilling";

const LOOKUP_MODULES = [
    "patient",
    "corporate",
    "referralDoctor",
    "hisTest",
    "testProfile",
    "testRate",
    "department",
    "saleInvoice",
];

const toLocalDateInput = date => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
};

const getName = item => item?.name || item?.doctorName || item?.corporateName || item?.departmentName || item?.hisTestCodeDescription || item?.hisTestName || "";
const getPatientLabel = patient => [getName(patient), patient?.phoneNumber || patient?.phone, patient?.patientNo || patient?.mrNo]
    .filter(Boolean)
    .join(" — ");
const currency = amount => `₹${(Number(amount) || 0).toFixed(2)}`;

const SaleInvoiceAddPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: invoiceId } = useParams();
    const loadedInvoiceId = useRef("");
    const [invoiceDate, setInvoiceDate] = useState(() => toLocalDateInput(new Date()));
    const [patientSearch, setPatientSearch] = useState("");
    const [patientId, setPatientId] = useState("");
    const [corporateId, setCorporateId] = useState("");
    const [referralDoctorId, setReferralDoctorId] = useState("");
    const [paymentType, setPaymentType] = useState("Cash");
    const [notes, setNotes] = useState("");
    const [discountType, setDiscountType] = useState("Fixed Amount");
    const [discountValue, setDiscountValue] = useState("0");
    const [taxAmount, setTaxAmount] = useState("0");
    const [paidAmount, setPaidAmount] = useState("0");
    const [lines, setLines] = useState([]);
    const [showLineModal, setShowLineModal] = useState(false);
    const [modalItemType, setModalItemType] = useState("test");
    const [modalSearch, setModalSearch] = useState("");
    const [selectedBillableKey, setSelectedBillableKey] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const collections = useSelector(state => state.api);
    const lookupData = Object.fromEntries(LOOKUP_MODULES.map(module => [module, collections[module]?.items || []]));
    const invoiceCollection = collections.saleInvoice;
    const invoiceDataReady = invoiceCollection?.status === "succeeded"
        || (Array.isArray(invoiceCollection?.items) && invoiceCollection?.status !== "loading");
    const invoiceDataLoading = invoiceCollection?.status === "loading" && !Array.isArray(invoiceCollection?.items);
    const lookupErrors = LOOKUP_MODULES
        .map(module => collections[module]?.status === "error" ? `${module}: ${collections[module]?.message || "Unable to load records"}` : "")
        .filter(Boolean);

    useEffect(() => {
        LOOKUP_MODULES.forEach(module => {
            dispatch(getData({
                module,
                options: { recordPerPage: 0, search: "", searchCondition: null, searchMode: null, searchFields: null },
            }));
        });
    }, [dispatch]);

    const patients = lookupData.patient;
    const selectedPatient = patients.find(patient => String(patient.id) === patientId);
    const editingInvoice = invoiceId
        ? lookupData.saleInvoice.find(invoice => String(invoice.id) === String(invoiceId))
        : null;
    const generatedInvoiceNo = useMemo(() => {
        const prefix = `INV-${invoiceDate.replace(/-/g, "")}-`;
        const maxSequence = lookupData.saleInvoice.reduce((max, invoice) => {
            const match = String(invoice.invoiceNo || "").match(/^INV-\d{8}-(\d+)$/);
            return match && String(invoice.invoiceNo).startsWith(prefix)
                ? Math.max(max, Number(match[1]) || 0)
                : max;
        }, 0);
        return `${prefix}${String(maxSequence + 1).padStart(4, "0")}`;
    }, [invoiceDate, lookupData.saleInvoice]);
    const invoiceNo = editingInvoice?.invoiceNo || generatedInvoiceNo;

    useEffect(() => {
        if (!invoiceId || !editingInvoice || loadedInvoiceId.current === invoiceId) {
            return;
        }
        loadedInvoiceId.current = invoiceId;
        setInvoiceDate(String(editingInvoice.invoiceDate || "").slice(0, 10));
        setPatientId(editingInvoice.patientId ? String(editingInvoice.patientId) : "");
        setPatientSearch(editingInvoice.patientName || "");
        setCorporateId(editingInvoice.corporateId ? String(editingInvoice.corporateId) : "");
        setReferralDoctorId(
            editingInvoice.referralDoctorId
                ? String(editingInvoice.referralDoctorId)
                : editingInvoice.referralType === "Self"
                    ? "self"
                    : editingInvoice.referralType === "Corporate"
                        ? "corporate"
                        : ""
        );
        setPaymentType(editingInvoice.paymentType || "Cash");
        setNotes(editingInvoice.notes || "");
        setDiscountType(editingInvoice.discountType || "Fixed Amount");
        setDiscountValue(String(editingInvoice.discountValue ?? "0"));
        setTaxAmount(String(editingInvoice.taxAmount ?? "0"));
        setPaidAmount(String(editingInvoice.paidAmount ?? "0"));
        setLines((editingInvoice.lines || []).map((line, index) => ({
            ...line,
            key: line.key || `${line.testId || line.testProfileId || "line"}-${index}`,
        })));
    }, [editingInvoice, invoiceId]);

    const billableItems = useMemo(() => {
        if (modalItemType === "profile") {
            return lookupData.testProfile
                .filter(isActiveRecord)
                .map(profile => ({
                    key: `profile:${profile.id}`,
                    id: profile.id,
                    label: getName(profile) || profile.code || "Test profile",
                    code: profile.code || "",
                    type: "profile",
                    rate: Number(profile.packageRate || profile.rate || 0),
                }));
        }

        return lookupData.hisTest
            .filter(isActiveRecord)
            .map(test => {
                const departmentCode = test.departmentCode || test.departmentId || "";
                const department = lookupData.department.find(item =>
                    String(item.departmentCode || item.code || item.id) === String(departmentCode)
                );
                const rate = standardTestRate(test.id, lookupData.testRate, invoiceDate);
                if (!(rate > 0)) {
                    return null;
                }
                return {
                    key: `test:${test.id}`,
                    id: test.id,
                    label: getName(test) || test.hisTestCode || test.testCode || "Test",
                    code: test.hisTestCode || test.testCode || "",
                    type: "test",
                    departmentCode,
                    departmentName: getName(department) || departmentCode || "—",
                    rate,
                };
            }).filter(Boolean);
    }, [invoiceDate, lookupData.department, lookupData.hisTest, lookupData.testProfile, lookupData.testRate, modalItemType]);

    const visibleBillableItems = filterBillableItems(billableItems, modalSearch);
    const selectedBillable = billableItems.find(item => item.key === selectedBillableKey);
    const totals = calculateInvoiceAmounts({ discountType, discountValue, taxAmount, paidAmount, lines });
    const { grossAmount, netAmount, dueAmount, paymentStatus } = totals;
    const paymentStatusLabel = ["Unpaid", "Partially Paid", "Paid"][paymentStatus];

    const openAddLineModal = () => {
        setModalItemType("test");
        setModalSearch("");
        setSelectedBillableKey("");
        setShowLineModal(true);
    };

    const addSelectedLine = () => {
        if (!selectedBillable) return;
        setLines(current => [...current, {
            key: `${selectedBillable.key}-${Date.now()}`,
            itemType: selectedBillable.type,
            lineItemKey: selectedBillable.key,
            testId: selectedBillable.type === "test" ? selectedBillable.id : "",
            testProfileId: selectedBillable.type === "profile" ? selectedBillable.id : null,
            testName: selectedBillable.label,
            departmentCode: selectedBillable.departmentCode || "",
            departmentName: selectedBillable.departmentName || "",
            rate: selectedBillable.rate,
            quantity: 1,
            discountType: "Fixed Amount",
            discountValue: 0,
        }]);
        setShowLineModal(false);
    };

    const updateLine = (key, field, value) => {
        setLines(current => current.map(line => line.key === key ? { ...line, [field]: value } : line));
    };

    const saveInvoice = async confirm => {
        setSubmitted(true);
        setError("");
        setSuccess("");
        if (!patientId) {
            setError("Please select a patient.");
            return;
        }
        if (!invoiceDate) {
            setError("Invoice date is required.");
            return;
        }
        if (lines.length === 0) {
            setError("Add at least one test or profile line.");
            return;
        }
        const problems = invoiceInputErrors({
            patientId,
            invoiceDate,
            discountType,
            discountValue,
            taxAmount,
            paidAmount,
            lines,
        });
        if (problems.length > 0) {
            setError(problems[0]);
            return;
        }
        const unrated = lines.find(line => line.itemType !== "profile" && !(Number(line.rate) > 0));
        if (unrated) {
            setError(`No applicable test rate for ${unrated.testName || "the selected test"} on ${invoiceDate}.`);
            return;
        }
        if (invoiceId && !editingInvoice) {
            setError("The invoice could not be loaded for editing.");
            return;
        }

        setSaving(true);
        try {
            const amounts = calculateInvoiceAmounts({ discountType, discountValue, taxAmount, paidAmount, lines });
            const invoice = {
                invoiceNo,
                name: invoiceNo,
                invoiceDate,
                patientId,
                patientName: getName(selectedPatient) || editingInvoice?.patientName || "",
                patientNo: selectedPatient?.patientNo || editingInvoice?.patientNo || "",
                patientPhone: selectedPatient?.phoneNumber || selectedPatient?.phone || editingInvoice?.patientPhone || "",
                corporateId: corporateId || null,
                referralDoctorId: referralDoctorId === "self" || referralDoctorId === "corporate" ? null : (referralDoctorId || null),
                referralType: referralDoctorId === "self" ? "Self" : referralDoctorId === "corporate" ? "Corporate" : (lookupData.referralDoctor.find(item => String(item.id) === referralDoctorId)?.type || ""),
                paymentType,
                notes,
                invoiceStatus: confirm ? 1 : 0,
                grossAmount: amounts.grossAmount,
                discountType,
                discountValue: Number(discountValue) || 0,
                discountAmount: amounts.discountAmount,
                taxAmount: amounts.taxAmount,
                netAmount: amounts.netAmount,
                totalAmount: amounts.netAmount,
                paidAmount: amounts.paidAmount,
                dueAmount: amounts.dueAmount,
                paymentStatus: amounts.paymentStatus,
                lines: amounts.lines.map(({ key, ...line }) => line),
            };
            const result = invoiceId
                ? await dispatch(editData({ module: "saleInvoice", data: { ...editingInvoice, ...invoice, id: invoiceId } })).unwrap()
                : await dispatch(addData({ module: "saleInvoice", data: invoice })).unwrap();
            if (!result?.data) {
                throw new Error("The invoice could not be saved.");
            }
            setSuccess(confirm ? "Invoice confirmed." : "Invoice saved as draft.");
            navigate("/sale-invoices");
        } catch (saveError) {
            setError(saveError.message || "Unable to save the invoice.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="sale-invoice-create-page">
            <section className="sale-invoice-create-card">
                <h1 className="sale-invoice-create-title">Sale Invoice {invoiceNo}</h1>
                {error && <Alert variant="danger" role="alert">{error}</Alert>}
                {success && <Alert variant="success" role="status">{success}</Alert>}
                {lookupErrors.length > 0 && (
                    <Alert variant="warning" role="alert">
                        Some invoice lookup lists could not be loaded: {lookupErrors.join("; ")}
                    </Alert>
                )}
                {invoiceDataLoading && (
                    <Alert variant="info" role="status">Loading existing invoices to generate a unique invoice number...</Alert>
                )}

                <Form noValidate onSubmit={event => event.preventDefault()}>
                    <div className="row g-3">
                        <Form.Group className="col-md-3 iui-field" controlId="sale-invoice-number">
                            <Form.Label>Invoice No</Form.Label>
                            <Form.Control value={invoiceNo} readOnly />
                        </Form.Group>
                        <Form.Group className="col-md-3 iui-field" controlId="sale-invoice-date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" value={invoiceDate} onChange={event => setInvoiceDate(event.target.value)} />
                        </Form.Group>
                        <Form.Group className="col-md-6 iui-field" controlId="sale-invoice-patient">
                            <Form.Label>Patient <span className="text-danger">*</span></Form.Label>
                            <div className="iui-field-control">
                                <Form.Control
                                    list="sale-invoice-patient-options"
                                    value={patientSearch}
                                    placeholder="Search patient by name, phone, or ID"
                                    isInvalid={submitted && !patientId}
                                    onChange={event => {
                                        const value = event.target.value;
                                        setPatientSearch(value);
                                        const patient = patients.find(item =>
                                            getPatientLabel(item).toLowerCase() === value.toLowerCase() ||
                                            String(item.id) === value
                                        );
                                        setPatientId(patient ? String(patient.id) : "");
                                    }}
                                />
                                <datalist id="sale-invoice-patient-options">
                                    {patients.map(patient => (
                                        <option key={patient.id} value={getPatientLabel(patient)} />
                                    ))}
                                </datalist>
                                <Form.Control.Feedback type="invalid">Patient is required.</Form.Control.Feedback>
                            </div>
                        </Form.Group>
                    </div>

                    <div className="row g-3 mt-1">
                        <Form.Group className="col-md-4 iui-field" controlId="sale-invoice-corporate">
                            <Form.Label>Corporate</Form.Label>
                            <Form.Select value={corporateId} onChange={event => setCorporateId(event.target.value)}>
                                <option value="">-- None --</option>
                                {lookupData.corporate.map(item => <option key={item.id} value={item.id}>{getName(item)}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="col-md-4 iui-field" controlId="sale-invoice-referral-doctor">
                            <Form.Label>Referral Doctor</Form.Label>
                            <Form.Select value={referralDoctorId} onChange={event => setReferralDoctorId(event.target.value)}>
                                <option value="">-- None --</option>
                                <option value="self">Self</option>
                                <option value="corporate">Corporate</option>
                                {lookupData.referralDoctor.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {getName(item) || item.doctorCode}{item.type ? ` (${item.type})` : ""}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="col-md-4 iui-field" controlId="sale-invoice-payment-type">
                            <Form.Label>Payment Type</Form.Label>
                            <Form.Select value={paymentType} onChange={event => setPaymentType(event.target.value)}>
                                {["Cash", "Card", "UPI", "Net Banking", "Cheque", "Credit"].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>

                    <Form.Group className="mt-3 iui-field" controlId="sale-invoice-notes">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control value={notes} onChange={event => setNotes(event.target.value)} />
                    </Form.Group>

                    <div className="sale-invoice-create-toolbar">
                        <Button type="button" size="sm" className="sale-invoice-add-line-button" onClick={openAddLineModal}>
                            <i className="fa-solid fa-plus me-2" aria-hidden="true" />Add Line
                        </Button>
                        {lines.length === 0 && (
                            <span className="sale-invoice-create-hint">No items yet — use Add Line to search and add tests or profiles.</span>
                        )}
                    </div>

                    {lines.length > 0 && (
                        <div className="table-responsive mt-3">
                            <Table bordered className="sale-invoice-create-lines">
                                <thead><tr>
                                    <th>Type</th><th>Item</th><th>Department</th><th>Rate</th><th>Qty</th>
                                    <th>Disc. Type</th><th>Discount</th><th>Net</th><th aria-label="Actions" />
                                </tr></thead>
                                <tbody>
                                    {lines.map(line => (
                                        <tr key={line.key}>
                                            <td>{line.itemType === "profile" ? "Profile" : "Test"}</td>
                                            <td>{line.testName}</td>
                                            <td>{line.departmentName || "—"}</td>
                                            <td><Form.Control type="number" min="0" step="0.01" value={line.rate} onChange={event => updateLine(line.key, "rate", event.target.value)} aria-label={`Rate for ${line.testName}`} /></td>
                                            <td><Form.Control type="number" min="1" step="1" value={line.quantity} onChange={event => updateLine(line.key, "quantity", event.target.value)} aria-label={`Quantity for ${line.testName}`} /></td>
                                            <td><Form.Select value={line.discountType} onChange={event => updateLine(line.key, "discountType", event.target.value)} aria-label={`Discount type for ${line.testName}`}>
                                                <option>Fixed Amount</option><option>Percentage</option>
                                            </Form.Select></td>
                                            <td><Form.Control type="number" min="0" step="0.01" value={line.discountValue} onChange={event => updateLine(line.key, "discountValue", event.target.value)} aria-label={`Discount for ${line.testName}`} /></td>
                                            <td>{currency(Math.max(0, Number(line.rate || 0) * Number(line.quantity || 0) - lineDiscountAmount(line)))}</td>
                                            <td><Button variant="outline-danger" size="sm" onClick={() => setLines(current => current.filter(item => item.key !== line.key))} aria-label={`Remove ${line.testName}`}>×</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}

                    <div className="sale-invoice-create-totals">
                        <div className="sale-invoice-total-row"><span>Gross Amount</span><span>{currency(grossAmount)}</span></div>
                        <div className="sale-invoice-total-row sale-invoice-total-edit">
                            <span>Total Discount</span>
                            <div className="sale-invoice-total-controls">
                                <Form.Select aria-label="Discount type" value={discountType} onChange={event => setDiscountType(event.target.value)}>
                                    <option>Fixed Amount</option>
                                    <option>Percentage</option>
                                </Form.Select>
                                <Form.Control aria-label="Discount value" type="number" min="0" step="0.01" value={discountValue} onChange={event => setDiscountValue(event.target.value)} />
                            </div>
                        </div>
                        <div className="sale-invoice-total-row sale-invoice-total-edit">
                            <span>Tax</span>
                            <Form.Control aria-label="Tax amount" type="number" min="0" step="0.01" value={taxAmount} onChange={event => setTaxAmount(event.target.value)} />
                        </div>
                        <div className="sale-invoice-total-row sale-invoice-total-net"><strong>Net Amount (Invoice Total)</strong><strong>{currency(netAmount)}</strong></div>
                        <div className="sale-invoice-total-row sale-invoice-total-edit">
                            <span>Paid Amount</span>
                            <Form.Control aria-label="Paid amount" type="number" min="0" step="0.01" value={paidAmount} onChange={event => setPaidAmount(event.target.value)} />
                        </div>
                        <div className="sale-invoice-total-row"><span>Outstanding Amount</span><span>{currency(dueAmount)}</span></div>
                        <div className="sale-invoice-total-row sale-invoice-status">
                            <span>Payment Status</span>
                            <div><Form.Select aria-label="Payment status" value={paymentStatus} onChange={event => {
                                const status = Number(event.target.value);
                                setPaidAmount(status === 0 ? "0" : status === 2 ? String(netAmount) : String(Math.round(netAmount / 2 * 100) / 100));
                            }}>
                                <option value={0}>Unpaid</option><option value={1}>Partially Paid</option><option value={2}>Paid</option>
                            </Form.Select><span className={`sale-invoice-payment-badge status-${paymentStatus}`}>{paymentStatusLabel}</span></div>
                        </div>
                    </div>

                    <div className="sale-invoice-create-actions">
                        <Button type="button" onClick={() => saveInvoice(false)} disabled={saving || !invoiceDataReady || (Boolean(invoiceId) && !editingInvoice)}>Save Draft</Button>
                        <Button type="button" variant="success" onClick={() => saveInvoice(true)} disabled={saving || !invoiceDataReady || (Boolean(invoiceId) && !editingInvoice)}>Confirm</Button>
                        <Button type="button" variant="outline-secondary" onClick={() => navigate("/sale-invoices")}>Back</Button>
                    </div>
                </Form>
            </section>

            <Modal show={showLineModal} onHide={() => setShowLineModal(false)} centered size="lg" className="sale-invoice-line-modal">
                <Modal.Header closeButton>
                    <div>
                        <Modal.Title>Add invoice line</Modal.Title>
                        <p>Search and select a test or profile. Department is assigned automatically for tests.</p>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="sale-invoice-line-type" role="group" aria-label="Invoice item type">
                        <Button variant={modalItemType === "test" ? "light" : "outline-light"} onClick={() => {
                            setModalItemType("test");
                            setSelectedBillableKey("");
                        }}>Test</Button>
                        <Button variant={modalItemType === "profile" ? "light" : "outline-light"} onClick={() => {
                            setModalItemType("profile");
                            setSelectedBillableKey("");
                        }}>Profile</Button>
                    </div>
                    <Form.Group className="mt-3" controlId="sale-invoice-billable-search">
                        <Form.Label>Search {modalItemType}</Form.Label>
                        <Form.Control autoFocus type="search" value={modalSearch} onChange={event => setModalSearch(event.target.value)} placeholder={`Type to search ${modalItemType === "test" ? "tests" : "profiles"}`} />
                    </Form.Group>
                    <div className="sale-invoice-search-results" role="listbox" aria-label={`Matching ${modalItemType}s`}>
                        {visibleBillableItems.map(item => (
                            <button
                                key={item.key}
                                type="button"
                                role="option"
                                aria-selected={item.key === selectedBillableKey}
                                className={item.key === selectedBillableKey ? "is-selected" : ""}
                                onClick={() => setSelectedBillableKey(item.key)}
                            >
                                <span>{item.label}{item.code ? ` (${item.code})` : ""}</span>
                                <strong>{currency(item.rate)}</strong>
                            </button>
                        ))}
                    </div>
                    {visibleBillableItems.length === 0 && (
                        <p className="text-muted mt-2 mb-0">
                            {modalSearch ? `No ${modalItemType}s match your search.` : `No ${modalItemType}s are available.`}
                        </p>
                    )}
                    {selectedBillable && (
                        <div className="sale-invoice-line-preview">
                            <div><span>Selected</span><strong>{selectedBillable.label}</strong></div>
                            {modalItemType === "test" && <div><span>Department</span><strong>{selectedBillable.departmentName}</strong></div>}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowLineModal(false)}>Cancel</Button>
                    <Button className="sale-invoice-add-line-button" onClick={addSelectedLine} disabled={!selectedBillable}>Add to invoice</Button>
                </Modal.Footer>
            </Modal>
        </main>
    );
};

export default SaleInvoiceAddPage;
