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
        if (props.value && props.value.length > 0) {
            setValue(props.value)
        }
    }, [props.value])

    useEffect(() => {
        if (allRoles && allRoles.length > 0) {
            setSchema(allRoles)
        }
    }, [allRoles])

    useEffect(() => {
        const newSchema = [...schema.map(s => {
            return {
                ...s
                , checked: value.findIndex(v => `${v.id}` === `${s.id}`) >= 0 || false
            }
        })]
        setSchema(newSchema);

        const e = { target: { id: props.id, value: value }, preventDefault: function () { } }
        if (props.onChange)
            props.onChange(e);

    }, [value])

    const handleChange = (e, name) => {
        e.preventDefault();
        const oldValue = [
            ...value.map(v => {
                return {
                    ...v,
                    privileges: schema.filter(s => `${v.id}` === `${s.id}`).map(p => p.privileges)[0]
                }
            })
        ]
        if (e.target.checked) {
            const newValue = [...oldValue
                , {
                id: e.target.dataset.rid,
                name: name,
                privileges: [...JSON.parse(e.target.dataset.privileges)]
            }]

            setValue(newValue)
        }
        else {
            const index = value.findIndex(i => `${i.id}` === e.target.dataset.rid)

            const newValue = [
                ...value.slice(0, index), // everything before current post
                ...value.slice(index + 1), // everything after current post
            ]

            setValue(newValue)
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