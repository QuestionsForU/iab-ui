import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleData, getData, editData, addData, selectModuleItem } from '../../store/api-db'
import { useDispatch, useSelector } from 'react-redux'
import IUIPageElement from './shared/IUIPageElement';
import IUIModuleMessage from './shared/IUIModuleMessage';

const IUIPage = (props) => {
    // Properties
    const schema = props?.schema;
    const module = schema?.module;

    // Parameter
    const { id } = useParams();

    // Global State
    const saved = useSelector((state) => state.api[module].saved)
    const items = useSelector((state) => state.api[module].items)
    const loggedInUser = useSelector((state) => state.api.loggedInUser)
    const [dirty, setDirty] = useState(false)
    // Local State
    const [data, setData] = useState({});
    const [errors, setErrors] = useState({});
    const [privileges, setPrivileges] = useState({});

    // Usage
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (id) {
            const u = items?.find((element) => {
                return `${element.id}` === id;
            });
            
            setData(u);
            dispatch(getSingleData({ module: module, id: id }));
            dispatch(selectModuleItem({ module: module, id: id }));
        }
    }, []);

    useEffect(() => {
        const modulePrivileges = loggedInUser?.privileges?.filter(p => p.module === module)?.map(p => p.name);
        if(modulePrivileges){
            let access = {};
            modulePrivileges.forEach(p => {
                access = { ...access, ...{ [p]: true } }
            })
            setPrivileges(access)
        }
    }, [loggedInUser, module]);

    useEffect(() => {
        if (dirty) {
            const error = validate(data, schema?.fields)
            setErrors(error);
        }
    }, [data]);

    useEffect(() => {
        if (module === 'invoice' && !id) {
            dispatch(getData({ module: module, options: { recordPerPage: 0 } }));
        }
    }, [module, id, dispatch]);

    useEffect(() => {
        const u = items?.find((element) => {
            return `${element.id}` === id;
        });
        setData(u);
    }, [items]);

    useEffect(() => {
        if (module !== 'invoice' || id) {
            return;
        }

        const maxInvoiceNumber = (items || []).reduce((max, item) => {
            const raw = String(item?.name || '').match(/\d+/g)?.[0];
            if (!raw) return max;
            const num = Number(raw);
            return Number.isFinite(num) && num > max ? num : max;
        }, 0);

        const nextInvoiceNumber = maxInvoiceNumber + 1;
        const generatedInvoiceNumber = `INV-${String(nextInvoiceNumber).padStart(5, '0')}`;

        const today = new Date();
        const offset = today.getTimezoneOffset();
        const localToday = new Date(today.getTime() - offset * 60000);

        setData((prev) => ({
            ...prev,
            name: prev?.name || generatedInvoiceNumber,
            invoiceDate: prev?.invoiceDate || localToday.toISOString().slice(0, 10),
            gstPercent: prev?.gstPercent ?? 0
        }));
    }, [module, id, items]);

    const handleChange = (e) => {
        e.preventDefault();
        const newData = { ...data, ...e.target.value }
        setData(newData);
    };

    const validate = (values, fields) => {
        let errors = {};

        for (let i = 0; i < fields?.length; i++) {
            let item = fields[i];
            if (item.type === 'area') {
                errors = { ...errors, ...validate(values, item.fields) }
            }
            if (item.required && values && !values[item?.field]) {
                errors[item.field] = `Required field.`;
            }
            if (item.type === 'email' && values && values[item?.field]) {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[item.field])) {
                    errors[item.field] = 'Invalid email address.'
                }
            }
            if (item.type === 'phone' && values && values[item?.field]) {
                const regex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
                //var pattern = new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/); // /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
                if (!regex.test(values[item.field])) {
                    errors[item.field] = 'Invalid phone number.'
                }
            }
        }
        return errors;
    };

    const savePageValue = (e) => {
        e.preventDefault();
        if (!props?.readonly) {
            setDirty(true);
            const error = validate(data, schema?.fields)
            setErrors(error);
            if (Object.keys(error).length === 0) {
                if (!data)
                    return

                if (id !== undefined)
                    dispatch(editData({ module: module, data: data }));
                else
                    dispatch(addData({ module: module, data: data }));
            }
        }
    };

    const handlePrint = () => {
        const invoiceDate = data?.invoiceDate
            ? (() => {
                const d = new Date(data.invoiceDate);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
            })()
            : '';
        const invoiceItems = Array.isArray(data?.items) && data.items.length > 0 ? data.items : [];
        const lineItems = invoiceItems.map((item, index) => {
            const qty = Number(item?.quantity || 0);
            const price = Number(item?.price || 0);
            const total = Number(item?.total ?? qty * price);
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item?.name || ''}</td>
                    <td>${qty}</td>
                    <td>${price.toFixed(2)}</td>
                    <td>${total.toFixed(2)}</td>
                </tr>
            `;
        }).join('');

        const grandTotal = invoiceItems.reduce((sum, item) => {
            const qty = Number(item?.quantity || 0);
            const price = Number(item?.price || 0);
            const total = Number(item?.total ?? qty * price);
            return sum + total;
        }, 0);
        const gstRate = Number(data?.gstPercent || 0);
        const gstAmount = grandTotal * (gstRate / 100);
        const finalTotal = grandTotal + gstAmount;

        const printWindow = window.open('', '_blank', 'width=900,height=1100');
        if (!printWindow) return;

        printWindow.document.write(`
            <!doctype html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>Invoice ${data?.name || 'Print'}</title>
                <style>
                    body { margin: 0; background: #111; font-family: Arial, sans-serif; }
                    .page { width: 820px; margin: 24px auto; background: #ffffff; padding: 28px 32px 20px; box-sizing: border-box; }
                    .head { text-align: center; padding-bottom: 8px; border-bottom: 1px solid #cfcfcf; }
                    .head h2 { margin: 0; font-size: 30px; letter-spacing: 1px; }
                    .company { font-weight: 700; font-size: 14px; text-transform: uppercase; margin-bottom: 8px; }
                    .meta { display: flex; justify-content: space-between; align-items: flex-start; margin-top: 18px; }
                    .bill-to { width: 52%; }
                    .bill-to b, .invoice-meta strong { display: block; margin-bottom: 6px; }
                    .invoice-meta { width: 28%; text-align: right; }
                    table { width: 100%; border-collapse: collapse; margin-top: 18px; }
                    th, td { border: 1px solid #d9d9d9; padding: 8px 10px; text-align: left; }
                    th { background: #1e88e5; color: white; font-weight: 700; }
                    .totals { width: 42%; margin-left: auto; border-collapse: collapse; margin-top: 12px; }
                    .totals td { border: 1px solid #d9d9d9; padding: 8px 10px; }
                    .totals tr td:first-child { background: #f4f4f4; font-weight: 700; }
                    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 24px; gap: 16px; }
                    .note-box { width: 52%; border-top: 1px dashed #999; padding-top: 8px; min-height: 60px; }
                    .signature { width: 36%; text-align: center; }
                    .signature .sig-line { border-top: 2px solid #222; width: 160px; margin: 50px auto 0; }
                    .pay-box { margin-top: 18px; border: 1px solid #d9d9d9; display: flex; }
                    .pay-box > div { flex: 1; padding: 12px; border-right: 1px solid #d9d9d9; }
                    .pay-box > div:last-child { border-right: none; }
                    .qr { width: 90px; height: 90px; margin: 14px auto 0; border: 1px solid #222; background: repeating-linear-gradient(90deg,#000 0,#000 8px,#fff 8px,#fff 16px), repeating-linear-gradient(#000 0,#000 8px,#fff 8px,#fff 16px); }
                    @media print { body { background: white; } .page { margin: 0; width: 100%; box-shadow: none; } }
                </style>
            </head>
            <body>
                <div class="page">
                    <div class="head">
                        <div class="company">UNIQUE COMPUTER</div>
                        <div>Karimpur Old Bus Stand, Kanpur, Nadia, 741152</div>
                        <div>7584996992</div>
                        <div>amritabiswas95@gmail.com</div>
                    </div>
                    <h2 style="text-align:center; margin:18px 0 10px; font-size:30px; letter-spacing:1px;">INVOICE</h2>
                    <div class="meta">
                        <div class="bill-to">
                            <b>Bill To</b>
                            <div>${data?.customerName || ''}</div>
                            <div>${data?.address || ''}</div>
                            <div>${data?.customerEmail || ''}</div>
                            <div>${data?.phoneNo || ''}</div>
                            <div>GSTIN: ${data?.panNo || 'AA'}</div>
                        </div>
                        <div class="invoice-meta">
                            <strong>Invoice No.</strong>
                            <div>${data?.name || ''}</div>
                            <strong>Date</strong>
                            <div>${invoiceDate}</div>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th style="width:10%">Sr no.</th>
                                <th>Product</th>
                                <th style="width:15%">Qty</th>
                                <th style="width:18%">Rate</th>
                                <th style="width:20%">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${lineItems || '<tr><td colspan="5">No items</td></tr>'}
                        </tbody>
                    </table>
                    <table class="totals">
                        <tr>
                            <td>Sub Total</td>
                            <td>₹ ${grandTotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>GST (${gstRate}%)</td>
                            <td>₹ ${gstAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Grand Total</td>
                            <td>₹ ${finalTotal.toFixed(2)}</td>
                        </tr>
                    </table>
                  
                  
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 300);
    };

    // Redirection after save
    useEffect(() => {
        if (!props.readonly) {

            if (saved === 'saved') {
                if (module) {
                    //dispatch(resetSave({ module: module }));
                    if (data?.id) {
                        let url = `/${module}s/${data.id}`;
                        navigate(url);
                    }
                    else {
                        let url = `/${module}s`;
                        navigate(url);
                    }
                }
                else {
                    navigate("/");
                }
            }
        }
    }, [saved])

    return (
        <>
            <div className="app-page-title">
                <div className="page-title-heading"> {schema?.title}</div>
            </div>
            <div className="tab-content">
                <div className="tabs-animation">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="main-card mb-3 card">
                                <div className="card-body">
                                    <div>
                                        <Form>
                                            <Row>
                                                <Col>
                                                    {schema?.back &&
                                                        <Button variant="contained"
                                                            className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-secondary btn-md mr-2"
                                                            onClick={() => navigate(`/${schema.module}s`)}> Back</Button>
                                                    }
                                                    {!schema?.readonly &&
                                                        <>
                                                            {(!privileges?.add || !privileges?.edit) &&
                                                                <>
                                                                    <Button variant="contained"
                                                                        className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-md mr-2"
                                                                        onClick={savePageValue}>Save </Button>

                                                                    <Button variant="contained"
                                                                        className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-secondary btn-md mr-2"
                                                                        onClick={() => navigate(-1)}> Cancel</Button>
                                                                </>
                                                            }
                                                        </>
                                                    }
                                                    {schema?.adding &&
                                                        <>
                                                            {!privileges?.add &&
                                                                <Button
                                                                    variant="contained"
                                                                    className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-sm mr-2"
                                                                    onClick={() => navigate(`/${schema.module}s/add`)}
                                                                >
                                                                    Add New
                                                                </Button>
                                                            }
                                                        </>
                                                    }
                                                    {schema?.editing &&
                                                        <>
                                                            {!privileges?.edit &&
                                                                <Button
                                                                    variant="contained"
                                                                    className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-sm mr-2"
                                                                    onClick={() => navigate(`/${schema.module}s/${id}/edit`)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            }
                                                        </>
                                                    }
                                                    {schema?.module === 'invoice' && schema?.readonly && id !== undefined &&
                                                        <Button
                                                            variant="contained"
                                                            className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-info btn-sm mr-2"
                                                            onClick={handlePrint}
                                                        >
                                                            Print
                                                        </Button>
                                                    }
                                                    <IUIModuleMessage schema={props.schema} />
                                                </Col>
                                            </Row>
                                            {(schema?.back || schema?.adding || schema?.editing) &&
                                                <hr />
                                            }
                                            <Row>
                                                {schema?.fields?.map((fld, f) => (
                                                    <Col md={fld.width || 6} key={f}>
                                                        {fld.type === 'area' &&
                                                            <>
                                                                <IUIPageElement
                                                                    id={schema.module}
                                                                    schema={fld.fields}
                                                                    value={data}
                                                                    errors={errors}
                                                                    readonly={schema.readonly}
                                                                    onChange={handleChange}
                                                                    dirty={dirty}
                                                                />
                                                                {/* <br /> */}
                                                            </>
                                                        }
                                                        {fld.type !== 'area' &&
                                                            <>
                                                                <IUIPageElement
                                                                    id={schema.module}
                                                                    schema={[fld]}
                                                                    value={data}
                                                                    errors={errors}
                                                                    onChange={handleChange}
                                                                    readonly={schema.readonly}
                                                                />
                                                                {/* <br /> */}
                                                            </>
                                                        }
                                                    </Col>
                                                ))}
                                            </Row>

                                            {(!schema?.readonly && (!privileges?.add || !privileges?.edit)) &&
                                                <hr />
                                            }
                                            <Row>
                                                <Col>
                                                    {schema?.back &&
                                                        <Button variant="contained"
                                                            className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-secondary btn-md mr-2"
                                                            onClick={() => navigate(`/${schema.module}s`)}> Back</Button>
                                                    }
                                                    {!schema?.readonly &&
                                                        <>
                                                            {(!privileges?.add || !privileges?.edit) &&
                                                                <>
                                                                    <Button variant="contained"
                                                                        className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-md mr-2"
                                                                        onClick={savePageValue}>Save </Button>

                                                                    <Button variant="contained"
                                                                        className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-secondary btn-md mr-2"
                                                                        onClick={() => navigate(-1)}> Cancel</Button>
                                                                </>
                                                            }
                                                        </>
                                                    }
                                                    {schema?.adding &&
                                                        <>
                                                            {!privileges?.add &&
                                                                <Button
                                                                    variant="contained"
                                                                    className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-sm mr-2"
                                                                    onClick={() => navigate(`/${schema.module}s/add`)}
                                                                >
                                                                    Add New
                                                                </Button>
                                                            }
                                                        </>
                                                    }
                                                    {schema?.editing &&
                                                        <>
                                                            {!privileges?.edit &&
                                                                <Button
                                                                    variant="contained"
                                                                    className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-sm mr-2"
                                                                    onClick={() => navigate(`/${schema.module}s/${id}/edit`)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            }
                                                        </>
                                                    }
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default IUIPage;