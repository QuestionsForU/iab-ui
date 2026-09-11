import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { Button, Col, Row } from "react-bootstrap";
import IUILookUp from './shared/IUILookUp'
import IUIListPage from './IUIPageInline';
import IUIPageInline from './IUIPageInline';

const IUIListInline = (props) => {
    const schema = props.schema;
    const storageKey = `inline_${schema?.module || 'items'}_${props?.id || 'default'}`;
    const [value, setValue] = useState([])
    const [gstPercent, setGstPercent] = useState(Number(props?.gstPercent || 0))

    useEffect(() => {
        const savedValue = sessionStorage.getItem(storageKey);
        const hasExistingItems = Array.isArray(props?.value) && props.value.length > 0;
        const isAddMode = schema?.adding && !props?.readonly;

        if (isAddMode) {
            if (!hasExistingItems) {
                setValue([]);
                setGstPercent(Number(props?.gstPercent || 0));
                sessionStorage.removeItem(storageKey);
                return;
            }

            setValue(props.value);
            setGstPercent(Number(props?.gstPercent || 0));
            sessionStorage.setItem(storageKey, JSON.stringify({ items: props.value, gstPercent: Number(props?.gstPercent || 0) }));
            return;
        }

        if (hasExistingItems) {
            setValue(props.value);
            setGstPercent(Number(props?.gstPercent || 0));
            sessionStorage.setItem(storageKey, JSON.stringify({ items: props.value, gstPercent: Number(props?.gstPercent || 0) }));
            return;
        }

        if (savedValue) {
            try {
                const parsed = JSON.parse(savedValue);
                if (Array.isArray(parsed)) {
                    setValue(parsed);
                    setGstPercent(Number(props?.gstPercent || 0));
                } else if (parsed && Array.isArray(parsed.items)) {
                    setValue(parsed.items);
                    setGstPercent(Number(parsed.gstPercent || 0));
                }
            } catch (error) {
                console.error('Invalid inline item cache', error);
            }
        }
    }, [props?.value, props?.readonly, props?.gstPercent, schema?.adding, storageKey]);

    useEffect(() => {
        setGstPercent(Number(props?.gstPercent || 0));
    }, [props?.gstPercent]);

    const persistValue = (items) => {
        setValue(items);
        const nextGstPercent = Number(gstPercent || 0);
        sessionStorage.setItem(storageKey, JSON.stringify({ items, gstPercent: nextGstPercent }));
        const event = { target: { id: props?.id, value: { items, gstPercent: nextGstPercent } }, preventDefault: function () { } }
        if (props.onChange) {
            props.onChange(event);
        }
    };

    const totalColumns = (schema?.fields || []).filter((fld) => fld.type !== 'hidden-filter').length;
    const grandTotal = (value || []).reduce((sum, item) => {
        const total = Number(item?.total ?? ((Number(item?.quantity || 0) * Number(item?.price || 0))));
        return sum + total;
    }, 0);
    const gstAmount = grandTotal * (gstPercent / 100);
    const actualTotal = grandTotal + gstAmount;

    const handleChange = (e) => {
        e.preventDefault();
        const item = e.target.value
        if (item) {
            const index = value?.findIndex(it => `${it.id}` === `${item.id}`)

            if (index > -1) {
                if (item.deleted) { // Delete
                    const items = [
                        ...value?.slice(0, index), // everything before array
                        ...value?.slice(index + 1), // everything after array
                    ]
                    persistValue(items)
                } else {// Edit 
                    const items = [
                        ...value?.slice(0, index), // everything before array
                        {
                            ...value[index],
                            ...item
                        },
                        ...value?.slice(index + 1), // everything after array
                    ]
                    persistValue(items)
                }

            } else { // Add
                const items = [...value, ...[item]]
                persistValue(items)
            }
        }
    };

    return (
        <>
            <Row>
                <Col md={12}>
                    <Table responsive>
                        <thead>
                            <tr>

                                {schema?.fields?.map((fld, f) => (
                                    <React.Fragment key={f}>
                                        {fld.type !== 'hidden-filter' &&
                                            <th >
                                                <button
                                                    type="submit"
                                                    className="btn btn-link text-white"
                                                >
                                                    {fld.text}
                                                </button>
                                            </th>
                                        }
                                    </React.Fragment>

                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                value?.map((item, i) => (
                                    <tr key={i}>
                                        <IUIPageInline
                                            id={item?.id}
                                            schema={schema}
                                            value={item}
                                            onChange={handleChange}
                                            readonly={props?.readonly}
                                        />

                                    </tr>
                                ))
                            }
                            {schema.adding && !props?.readonly &&
                                <tr>
                                    <IUIPageInline
                                        id={value ? value.length + 1 : 1}
                                        schema={schema}
                                        value={{ id: value ? value.length + 1 : 1, mode: 'add', name: '', quantity: '', price: '', total: 0 }}
                                        onChange={handleChange}
                                    />
                                </tr>
                            }
                            <tr>
                                <td colSpan={totalColumns - 1} className="text-end fw-bold">Grand Total</td>
                                <td className="fw-bold text-end">{grandTotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan={totalColumns - 1} className="text-end fw-bold">GST (%)</td>
                                <td className="text-end">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={gstPercent}
                                        disabled={props?.readonly || false}
                                        onChange={(e) => {
                                            const nextValue = Number(e.target.value || 0);
                                            setGstPercent(nextValue);
                                            if (props.onChange) {
                                                props.onChange({
                                                    target: {
                                                        id: props?.id,
                                                        value: { items: value, gstPercent: nextValue },
                                                    },
                                                    preventDefault: function () { }
                                                });
                                            }
                                        }}
                                        className="form-control form-control-sm text-end"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={totalColumns - 1} className="text-end fw-bold">Actual Total</td>
                                <td className="fw-bold text-end">{actualTotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    )
}

export default IUIListInline