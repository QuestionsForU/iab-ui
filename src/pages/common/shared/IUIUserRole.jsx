import React, { useState, useEffect } from 'react';
import { getData } from '../../../store/api-db';
import { useDispatch, useSelector } from 'react-redux'
import {  Col, Row, Form } from "react-bootstrap";

const IUIUserRole = (props) => {
    const module = "role"
    const [value, setValue] = useState(props?.value)

    const allRoles = useSelector((state) => state.api[module]?.items)
    const [schema, setSchema] = useState([])
    const dispatch = useDispatch();

    useEffect(() => {
        const pageOptions = { recordPerPage: 0 }
        dispatch(getData({ module: module, options: pageOptions }));
    }, []);

    useEffect(() => {
        if (!props.value || !Array.isArray(props.value)) {
            if (Array.isArray(value) && value.length > 0) {
                setValue([])
            }
            return;
        }

        if (JSON.stringify(props.value) !== JSON.stringify(value)) {
            setValue(props.value)
        }
    }, [props.value])

    useEffect(() => {
        if (!allRoles || allRoles.length === 0) {
            return;
        }

        const nextSchema = allRoles.map(s => ({
            ...s,
            checked: value.some(v => `${v.id}` === `${s.id}`)
        }));

        if (JSON.stringify(schema) !== JSON.stringify(nextSchema)) {
            setSchema(nextSchema);
        }
    }, [allRoles, value]);

    const handleChange = (e, name) => {
        e.preventDefault();
        if (props.readonly) {
            return;
        }

        const selectedPrivileges = e.target.dataset.privileges ? JSON.parse(e.target.dataset.privileges) : [];
        let nextValue = [...value];

        if (e.target.checked) {
            nextValue = [
                ...nextValue.filter(item => `${item.id}` !== `${e.target.dataset.rid}`),
                {
                    id: e.target.dataset.rid,
                    name: name,
                    privileges: [...selectedPrivileges]
                }
            ];
        } else {
            nextValue = nextValue.filter(item => `${item.id}` !== `${e.target.dataset.rid}`);
        }

        setValue(nextValue);
        const ev = { target: { id: props.id, value: nextValue }, preventDefault: function () { } };
        if (props.onChange) {
            props.onChange(ev);
        }
    };

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <Form.Label className="fs-6"><span className="fw-bold text-capitalize"> {props?.text} </span></Form.Label>
                </div>
                <div className="card-body">
                    <Row>
                        {schema?.map((item, i) => (
                            <Col key={i}>
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id={`r_${item.id}`}
                                    data-rid={`${item.id}`}
                                    data-privileges={JSON.stringify(item.privileges)}
                                    label={item.name || ""}
                                    checked={item.checked || false}
                                    onChange={(e) => handleChange(e, item.name)}
                                    disabled={props.readonly}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </>
    )
}

export default IUIUserRole