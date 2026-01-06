import React, { useState, useEffect } from 'react';
import {  Col, Row, Form } from "react-bootstrap";

const IUIPrivileges = (props) => {

    const [value, setValue] = useState(props?.value)
    const [schema, setSchema] = useState(props?.schema)

    useEffect(() => {
        if (props?.value) {
            setValue(props.value)
        }
    }, [props.value])

    useEffect(() => {
        if (props?.schema) {
            setSchema(props.schema)
        }
    }, [props.schema])

    const handleChange = (e) => {
        e.preventDefault();

        if (e.target.checked) { // Add to value
            const newValue = [...value, ...[{
                id: 0
                , name: e.target.dataset.name
                , module: e.target.dataset.module
            }]]

            if (!props.readonly) {
                const e = { target: { id: props.id, value: newValue }, preventDefault: function () { } }
                if (props.onChange)
                    props.onChange(e);
            }
        }
        else { // Remove from value
            const index = value.findIndex(v => v.module === e.target.dataset.module && v.name === e.target.dataset.name)
            const newValue = [
                ...value?.slice(0, index), // everything before array
                ...value?.slice(index + 1), // everything after array
            ]

            if (!props.readonly) {
                const e = { target: { id: props.id, value: newValue }, preventDefault: function () { } }
                if (props.onChange)
                    props.onChange(e);
            }
        }
    };

    const handleRowChange = (e, row) => {
        e.preventDefault();

        if (e.target.checked) {
            const newValue = [...value, ...row?.items?.map((item) => ({
                id: 0
                , name: item?.name
                , module: row?.name
            }))];

            if (!props.readonly) {
                const e = { target: { id: props.id, value: newValue }, preventDefault: function () { } }
                if (props.onChange)
                    props.onChange(e);
            }
        }
        else {
            const newValue = [
                ...value?.filter((v) => v.module !== row.name), // everything except current row
            ]

            if (!props.readonly) {
                const e = { target: { id: props.id, value: newValue }, preventDefault: function () { } }
                if (props.onChange)
                    props.onChange(e);
            }
        }

    };

    return (
        <>
            <Row >

                <Col>
                    <Form.Check className='text-capitalize'
                        disabled={props.readonly}
                        id={`${props.id}_${schema?.text}`}
                        label={schema?.text}
                        checked={(value?.filter((v) => v.module === schema.name)?.length === schema?.items?.length) || false}
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
                            checked={value.findIndex(v => v.module === schema.name && v.name === item.name) >= 0 || false}
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