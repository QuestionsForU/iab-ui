import React, { useState, useEffect } from 'react';
import {  Col, Row, Form } from "react-bootstrap";

const IUIPrivileges = (props) => {

    const [value, setValue] = useState(Array.isArray(props?.value) ? props.value : [])
    const [schema, setSchema] = useState(props?.schema)

    useEffect(() => {
        setValue(Array.isArray(props?.value) ? props.value : [])
    }, [props.value])

    useEffect(() => {
        if (props?.schema) {
            setSchema(props.schema)
        }
    }, [props.schema])

    const normalizeValues = (items = []) => {
        const list = Array.isArray(items) ? items : [];
        const unique = [];
        list.forEach(item => {
            if (!item || !item.module || !item.name) {
                return;
            }
            const key = `${item.module}|${item.name}`;
            if (!unique.some(entry => `${entry.module}|${entry.name}` === key)) {
                unique.push(item);
            }
        });
        return unique;
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (props.readonly) {
            return;
        }

        const current = Array.isArray(value) ? value : [];
        const item = {
            id: 0,
            name: e.target.dataset.name,
            module: e.target.dataset.module,
        };

        let newValue;
        if (e.target.checked) {
            newValue = normalizeValues([...current, item]);
        } else {
            newValue = normalizeValues(current.filter(v => !(v.module === item.module && v.name === item.name)));
        }

        setValue(newValue);
        const event = { target: { id: props.id, value: newValue }, preventDefault: function () { } }
        if (props.onChange)
            props.onChange(event);
    };

    const handleRowChange = (e, row) => {
        e.preventDefault();
        if (props.readonly) {
            return;
        }

        const current = Array.isArray(value) ? value : [];
        const rowPrivileges = Array.isArray(row?.items) ? row.items.map((item) => ({
            id: 0,
            name: item?.name,
            module: row?.name,
        })) : [];

        let newValue;
        if (e.target.checked) {
            newValue = normalizeValues([...current, ...rowPrivileges]);
        } else {
            newValue = normalizeValues(current.filter((v) => v.module !== row.name));
        }

        setValue(newValue);
        const event = { target: { id: props.id, value: newValue }, preventDefault: function () { } }
        if (props.onChange)
            props.onChange(event);
    };

    return (
        <>
            <Row >

                <Col>
                    <Form.Check className='text-capitalize'
                        disabled={props.readonly}
                        id={`${props.id}_${schema?.text}`}
                        label={schema?.text}
                        checked={Array.isArray(value) && value.filter((v) => v.module === schema.name).length === schema?.items?.length}
                        onChange={(e) => handleRowChange(e, schema)}
                    />
                    {/* <Form.Label><span className="fw-bold text-capitalize"> {schema?.text} : </span></Form.Label> */}
                </Col>
                {schema?.items?.map((item, i) => (
                    <Col key={i}>
                        <Form.Check className='text-capitalize'
                            type="switch"
                            id={`${props.id}_${item.id}`}
                            data-pid={item.id}
                            data-module={schema.name}
                            data-name={item.name}
                            label={item.name || ""}
                            checked={Array.isArray(value) && value.some(v => v.module === schema.name && v.name === item.name)}
                            onChange={(e) => handleChange(e)}
                            disabled={props.readonly}
                        />
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default IUIPrivileges