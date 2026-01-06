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
    const [value, setValue] = useState([])


    useEffect(() => {
        if (props?.value) {
            setValue(props?.value);
        }
    }, [props?.value]);


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
                    setValue(items)

                    const event = { target: { id: props?.id, value: items }, preventDefault: function () { } }
                    if (props.onChange) {
                        props.onChange(event);
                    }
                } else {// Edit 
                    const items = [
                        ...value?.slice(0, index), // everything before array
                        {
                            ...value[index],
                            ...item
                        },
                        ...value?.slice(index + 1), // everything after array
                    ]
                    setValue(items)

                    const event = { target: { id: props?.id, value: items }, preventDefault: function () { } }
                    if (props.onChange) {
                        props.onChange(event);
                    }
                }

            } else { // Add

                const items = [...value, ...[item]]
                setValue(items)
                const event = { target: { id: props?.id, value: items }, preventDefault: function () { } }
                if (props.onChange) {
                    props.onChange(event);
                }
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
                                {
                                    <th width={90}>
                                        <button type="submit" className="btn btn-link text-white">#</button>
                                    </th>
                                }
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
                                            readonly={true}
                                        />

                                    </tr>
                                ))
                            }
                            {schema.adding &&
                                <tr>
                                    <IUIPageInline
                                        id={value ? value.length + 1 : 1}
                                        schema={schema}
                                        value={{ id: value ? value.length + 1 : 1, mode: 'add' }}
                                        onChange={handleChange}
                                    />
                                </tr>
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    )
}

export default IUIListInline