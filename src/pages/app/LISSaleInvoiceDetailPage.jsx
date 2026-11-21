import { useEffect } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getData } from "../../store/api-db";

const currency = (amount) => {
    const value = Number(amount);
    return Number.isFinite(value) ? `₹${value.toFixed(2)}` : "—";
};

const text = (value) => (value === undefined || value === null || value === "" ? "—" : value);

const invoiceStatusLabel = (value) => {
    if (value === 1 || value === "Finalized" || value === "Confirmed") return "Confirmed";
    if (value === 2 || value === "Cancelled") return "Cancelled";
    if (value === 0 || value === "Draft") return "Draft";
    return text(value);
};

const paymentStatusLabel = (value) => {
    const labels = ["Unpaid", "Partially Paid", "Paid"];
    return labels[Number(value)] || text(value);
};

const DetailItem = ({ label, value }) => (
    <div className="col-md-4 mb-3">
        <div className="text-muted small">{label}</div>
        <div>{text(value)}</div>
    </div>
);

const SaleInvoiceDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const invoices = useSelector(state => state.api.saleInvoice);
    const patients = useSelector(state => state.api.patient?.items || []);
    const invoice = (invoices?.items || []).find(item => String(item.id) === String(id));
    const patient = patients.find(item => String(item.id) === String(invoice?.patientId));

    useEffect(() => {
        dispatch(getData({
            module: "saleInvoice",
            options: { recordPerPage: 0, search: "", searchCondition: null, searchMode: null, searchFields: null },
        }));
        dispatch(getData({
            module: "patient",
            options: { recordPerPage: 0, search: "", searchCondition: null, searchMode: null, searchFields: null },
        }));
    }, [dispatch]);

    const lines = Array.isArray(invoice?.lines) ? invoice.lines : [];

    return (
        <>
            <div className="app-page-title">
                <div className="page-title-heading">Sale Invoice {invoice?.invoiceNo || ""}</div>
            </div>
            <div className="main-card mb-3 card">
                <div className="card-body">
                    <div className="mb-3">
                        <Button variant="secondary" className="me-2" onClick={() => navigate("/sale-invoices")}>Back</Button>
                        {invoice && (
                            <Button as={Link} to={`/sale-invoices/${invoice.id}/edit`} variant="primary">Edit</Button>
                        )}
                    </div>
                    {invoices?.status === "loading" && !invoice && <p role="status">Loading invoice...</p>}
                    {invoices?.status === "error" && <Alert variant="danger">Unable to load the invoice: {invoices.message}</Alert>}
                    {invoices?.status === "succeeded" && !invoice && <Alert variant="warning">This invoice could not be found.</Alert>}
                    {invoice && (
                        <>
                            <div className="row">
                                <DetailItem label="Invoice No" value={invoice.invoiceNo} />
                                <DetailItem label="Invoice Date" value={String(invoice.invoiceDate || "").slice(0, 10)} />
                                <DetailItem label="Invoice Status" value={invoiceStatusLabel(invoice.invoiceStatus)} />
                                <DetailItem label="Patient" value={invoice.patientName || patient?.name} />
                                <DetailItem label="Patient No" value={invoice.patientNo || patient?.patientNo} />
                                <DetailItem label="Phone" value={invoice.patientPhone || patient?.phoneNumber || patient?.phone} />
                                <DetailItem label="Payment Type" value={invoice.paymentType} />
                                <DetailItem label="Payment Status" value={paymentStatusLabel(invoice.paymentStatus)} />
                                <DetailItem label="Referral" value={invoice.referralType} />
                                <DetailItem label="Notes" value={invoice.notes} />
                            </div>
                            <Table responsive hover className="mt-2">
                                <thead>
                                    <tr>
                                        <th>Test</th>
                                        <th>Department</th>
                                        <th>Qty</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                        <th>Discount</th>
                                        <th>Net</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lines.map((line, index) => (
                                        <tr key={`${line.testId || line.testProfileId || line.testName}-${index}`}>
                                            <td>{text(line.testName)}</td>
                                            <td>{text(line.departmentName || line.departmentCode)}</td>
                                            <td>{text(line.quantity)}</td>
                                            <td>{currency(line.rate)}</td>
                                            <td>{currency(line.amount ?? (Number(line.rate) || 0) * (Number(line.quantity) || 0))}</td>
                                            <td>{currency(line.discountAmount)}</td>
                                            <td>{currency(line.netAmount)}</td>
                                        </tr>
                                    ))}
                                    {lines.length === 0 && (
                                        <tr><td colSpan={7} className="text-center text-muted">No invoice lines are saved on this invoice.</td></tr>
                                    )}
                                </tbody>
                            </Table>
                            <div className="sale-invoice-create-totals">
                                <div className="sale-invoice-total-row"><span>Gross Amount</span><span>{currency(invoice.grossAmount)}</span></div>
                                <div className="sale-invoice-total-row"><span>Discount ({text(invoice.discountType)})</span><span>{currency(invoice.discountAmount)}</span></div>
                                <div className="sale-invoice-total-row"><span>Tax</span><span>{currency(invoice.taxAmount)}</span></div>
                                <div className="sale-invoice-total-row sale-invoice-total-net"><strong>Net Amount</strong><strong>{currency(invoice.netAmount ?? invoice.totalAmount)}</strong></div>
                                <div className="sale-invoice-total-row"><span>Paid Amount</span><span>{currency(invoice.paidAmount)}</span></div>
                                <div className="sale-invoice-total-row"><span>Outstanding Amount</span><span>{currency(invoice.dueAmount)}</span></div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default SaleInvoiceDetailPage;
