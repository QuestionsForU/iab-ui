import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Form, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addData, getData } from "../../store/api-db";

const LOOKUP_MODULES = [
    "patient",
    "corporate",
    "referralDoctor",
    "hisTest",
    "testProfile",
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
    const invoiceDataReady = collections.saleInvoice?.status === "succeeded";
    const invoiceDataLoading = !invoiceDataReady && collections.saleInvoice?.status !== "error";
    const lookupErrors = LOOKUP_MODULES
        .map(module => collections[module]?.status === "error" ? `${module}: ${collections[module]?.message || "Unable to load records"}` : "")
        .filter(Boolean);

    useEffect(() => {
        LOOKUP_MODULES.forEach(module => {
            dispatch(getData({ module, options: { recordPerPage: 0 } }));
        });
    }, [dispatch]);

    const patients = lookupData.patient;
    const selectedPatient = patients.find(patient => String(patient.id) === patientId);
    const invoiceNo = useMemo(() => {
        const prefix = `INV-${invoiceDate.replace(/-/g, "")}-`;
        const maxSequence = lookupData.saleInvoice.reduce((max, invoice) => {
            const match = String(invoice.invoiceNo || "").match(/^INV-\d{8}-(\d+)$/);
            return match && String(invoice.invoiceNo).startsWith(prefix)
                ? Math.max(max, Number(match[1]) || 0)
                : max;
        }, 0);
        return `${prefix}${String(maxSequence + 1).padStart(4, "0")}`;
    }, [invoiceDate, lookupData.saleInvoice]);

    const billableItems = useMemo(() => {
        if (modalItemType === "profile") {
            return lookupData.testProfile
                .filter(profile => profile.isActive !== false && profile.active !== "No")
                .map(profile => ({
                    key: `profile:${profile.id}`,
                    id: profile.id,
                    label: getName(profile) || profile.code || "Test profile",
                    type: "profile",
                    rate: Number(profile.packageRate || profile.rate || 0),
                }));
        }

        return lookupData.hisTest
            .filter(test => test.isActive !== false && test.active !== "No")
            .map(test => {
                const departmentCode = test.departmentCode || test.departmentId || "";
                const department = lookupData.department.find(item =>
                    String(item.departmentCode || item.code || item.id) === String(departmentCode)
                );
                return {
                    key: `test:${test.id}`,
                    id: test.id,
                    label: getName(test) || test.hisTestCode || test.testCode || "Test",
                    code: test.hisTestCode || test.testCode || "",
                    type: "test",
                    departmentCode,
                    departmentName: getName(department) || departmentCode || "—",
                    rate: Number(test.rate || 0),
                };
            });
    }, [lookupData.department, lookupData.hisTest, lookupData.testProfile, modalItemType]);

    const visibleBillableItems = billableItems.filter(item =>
        `${item.label} ${item.code || ""}`.toLowerCase().includes(modalSearch.trim().toLowerCase())
    );
    const selectedBillable = billableItems.find(item => item.key === selectedBillableKey);
    const grossAmount = lines.reduce((total, line) => total + Number(line.rate || 0) * Number(line.quantity || 0), 0);
    const lineDiscount = line => {
        const amount = Number(line.rate || 0) * Number(line.quantity || 0);
        const value = Math.max(0, Number(line.discountValue) || 0);
        return line.discountType === "Percentage" ? amount * Math.min(100, value) / 100 : Math.min(amount, value);
    };
    const calculatedDiscount = discountType === "Percentage"
        ? grossAmount * Math.min(100, Math.max(0, Number(discountValue) || 0)) / 100
        : Number(discountValue) > 0
            ? Math.min(grossAmount, Number(discountValue))
            : lines.reduce((total, line) => total + lineDiscount(line), 0);
    const tax = Math.max(0, Number(taxAmount) || 0);
    const netAmount = Math.max(0, grossAmount - calculatedDiscount + tax);
    const paid = Math.max(0, Number(paidAmount) || 0);
    const dueAmount = Math.max(0, netAmount - paid);
    const paymentStatus = paid <= 0 ? 0 : paid >= netAmount && netAmount > 0 ? 2 : 1;
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
        if (paid > netAmount) {
            setError("Paid amount cannot exceed the net amount.");
            return;
        }

        setSaving(true);
        try {
            const invoice = {
                invoiceNo,
                name: invoiceNo,
                invoiceDate,
                patientId,
                patientName: getName(selectedPatient),
                patientNo: selectedPatient?.patientNo || "",
                patientPhone: selectedPatient?.phoneNumber || selectedPatient?.phone || "",
                corporateId: corporateId || null,
                referralDoctorId: referralDoctorId || null,
                paymentType,
                notes,
                invoiceStatus: confirm ? 1 : 0,
                paymentStatus,
                grossAmount,
                discountType,
                discountValue: Number(discountValue) || 0,
                discountAmount: calculatedDiscount,
                taxAmount: tax,
                netAmount,
                paidAmount: paid,
                dueAmount,
                lines: lines.map(({ key, ...line }) => ({
                    ...line,
                    rate: Number(line.rate) || 0,
                    quantity: Number(line.quantity) || 0,
                    amount: (Number(line.rate) || 0) * (Number(line.quantity) || 0),
                    discountValue: Number(line.discountValue) || 0,
                    discountAmount: lineDiscount(line),
                    netAmount: Math.max(0, (Number(line.rate) || 0) * (Number(line.quantity) || 0) - lineDiscount(line)),
                })),
            };
            const result = await dispatch(addData({ module: "saleInvoice", data: invoice })).unwrap();
            if (!result?.data) {
                throw new Error("The invoice could not be saved.");
            }
            setSuccess(confirm ? "Invoice confirmed." : "Invoice saved as draft.");
            navigate(`/sale-invoices/${result.data}`);
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
                        <Form.Group className="col-md-3" controlId="sale-invoice-number">
                            <Form.Label>Invoice No</Form.Label>
                            <Form.Control value={invoiceNo} readOnly />
                        </Form.Group>
                        <Form.Group className="col-md-3" controlId="sale-invoice-date">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" value={invoiceDate} onChange={event => setInvoiceDate(event.target.value)} />
                        </Form.Group>
                        <Form.Group className="col-md-6" controlId="sale-invoice-patient">
                            <Form.Label>Patient <span className="text-danger">*</span></Form.Label>
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
                        </Form.Group>
                    </div>

                    <div className="row g-3 mt-1">
                        <Form.Group className="col-md-4" controlId="sale-invoice-corporate">
                            <Form.Label>Corporate</Form.Label>
                            <Form.Select value={corporateId} onChange={event => setCorporateId(event.target.value)}>
                                <option value="">-- None --</option>
                                {lookupData.corporate.map(item => <option key={item.id} value={item.id}>{getName(item)}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="col-md-4" controlId="sale-invoice-referral-doctor">
                            <Form.Label>Referral Doctor</Form.Label>
                            <Form.Select value={referralDoctorId} onChange={event => setReferralDoctorId(event.target.value)}>
                                <option value="">-- None --</option>
                                {lookupData.referralDoctor.map(item => <option key={item.id} value={item.id}>{getName(item)}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="col-md-4" controlId="sale-invoice-payment-type">
                            <Form.Label>Payment Type</Form.Label>
                            <Form.Select value={paymentType} onChange={event => setPaymentType(event.target.value)}>
                                {["Cash", "Card", "UPI", "Net Banking", "Cheque", "Credit"].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>

                    <Form.Group className="mt-3" controlId="sale-invoice-notes">
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
                                            <td>{currency(Math.max(0, Number(line.rate || 0) * Number(line.quantity || 0) - lineDiscount(line)))}</td>
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
                        <Button type="button" onClick={() => saveInvoice(false)} disabled={saving || !invoiceDataReady}>Save Draft</Button>
                        <Button type="button" variant="success" onClick={() => saveInvoice(true)} disabled={saving || !invoiceDataReady}>Confirm</Button>
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
                        <Form.Control autoFocus type="search" value={modalSearch} onChange={event => {
                            setModalSearch(event.target.value);
                            setSelectedBillableKey("");
                        }} placeholder={`Type to search ${modalItemType === "test" ? "tests" : "profiles"}`} />
                    </Form.Group>
                    <Form.Group className="mt-3" controlId="sale-invoice-billable-select">
                        <Form.Select size="lg" value={selectedBillableKey} onChange={event => setSelectedBillableKey(event.target.value)}>
                            <option value="">Select a {modalItemType}...</option>
                            {visibleBillableItems.map(item => (
                                <option key={item.key} value={item.key}>{item.label}{item.code ? ` (${item.code})` : ""}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
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
