import React, { useEffect, useState } from 'react';
import { Col, Form, Row, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import MaskedInput from 'react-text-mask';
import IUILookUp from './IUILookUp';
import IUIPictureUpload from './IUIPictureUpload';
import IUIRolePrivilege from './IUIRolePrivilege';
import IUIUserRoleEdit from './IUIUserRole';
import IUIListRelation from '../IUIListRelation';
import IUIResetPasswordElement from '../../ResetUserPassword';
import IUIHiddenState from './IUIHiddenState';
import IUIListInline from '../IUIListInline';

const IUIPageElement = (props) => {
    // Properties
    const schema = props?.schema;

    // Local State
    const [data, setData] = useState({});
    const [errors, setErrors] = useState({});
    const [dirty, setDirty] = useState(props.dirty)

    useEffect(() => {
        if (props?.value)
            setData(props?.value);
    }, [props?.value]);

    useEffect(() => {
        if (props?.dirty)
            setDirty(props?.dirty);
    }, [props?.dirty]);

    useEffect(() => {

        if (props?.errors)
            setErrors(props?.errors);
    }, [props?.errors]);

    const handleChange = (e) => {
        e.preventDefault();
        if (props.readonly)
            return

        let newData = { ...data, [e.target.id]: e.target.value }
        if (e.target.id === 'roles') {
            let newPrivileges = []
            if (newData?.privileges) {
                newPrivileges = newData?.privileges
            }
            if (e.target.value) {
                newPrivileges = []
                for (let i = 0; i < e.target.value.length; i++) {
                    if (e.target.value[i].privileges) {
                        newPrivileges = [...newPrivileges, ...e.target.value[i].privileges]
                    }
                }

                newPrivileges = [...newPrivileges, ...[{ id: -1, name: "dummy", module: "dummy" }]]
            }
            newData = { ...newData, privileges: newPrivileges }
        }
        else if (e.target.id === 'disable') {
            newData = { ...data, [e.target.id]: e.target.checked }
        }
        setData(newData);
        const event = { target: { id: props.id, value: newData }, preventDefault: function () { } }
        if (props.onChange) {
            props.onChange(event);
        }
    };


    return (
        <>
            <Row>
                {schema?.map((fld, f) => (
                    <Col md={fld.width || 12} key={f}>
                        {fld.type === 'link' &&
                            <>
                                <Form.Group className="position-relative form-group">
                                    <Form.Label htmlFor={fld.field}>{fld.text}</Form.Label>
                                    <span><Link className="stretched-link" to={`${fld.to}${data[fld.field]}`}> {data[fld.field]} </Link></span>
                                </Form.Group>
                            </>
                        }
                        {fld.type === 'hidden-filter' &&
                            <span key={f}>
                                <IUIHiddenState
                                    value={fld.value}
                                    id={fld.field}
                                    schema={fld.schema}
                                    onChange={handleChange}
                                />
                            </span>
                        }
                        {fld.type === 'label' &&
                            <>
                                <Form.Group className="position-relative form-group">
                                    <Form.Label htmlFor={fld.field}>{fld.text} : </Form.Label>
                                    <span> {data[fld.field]} </span>
                                </Form.Group>
                            </>
                        }
                        {(!fld.type || fld.type === 'text' || fld.type === 'number') &&
                            <>
                                <Form.Group className="position-relative mb-3">
                                    {!props?.inline &&
                                        <Form.Label htmlFor={fld.field} className="fw-bold">
                                            {fld.text}
                                            {fld.required &&
                                                <span className="text-danger">*</span>
                                            }
                                        </Form.Label>
                                    }

                                    <InputGroup>
                                        {!props?.inline &&
                                            <InputGroup.Text id={`${fld.field}_input_icon`}>
                                                {
                                                    (fld.fieldIcon) ?
                                                        <i className={`fa-solid fa-${fld.fieldIcon}`}></i>
                                                        :
                                                        <i className={`fa-solid fa-star`}></i>
                                                }
                                            </InputGroup.Text>
                                        }
                                        <Form.Control type="text"
                                            name={fld.field}
                                            id={fld.field}
                                            className={dirty ? (errors[fld.field] ? "is-invalid" : "is-valid") : ""}
                                            placeholder={fld.placeholder}
                                            value={data[fld.field] || ""}
                                            disabled={props.readonly || fld.readonly || false}
                                            onChange={handleChange} />
                                    </InputGroup>
                                    {/* <p className="text-danger">{errors[fld.field]}</p> */}
                                </Form.Group>
                            </>
                        }
                        {(fld.type === 'textarea') &&
                            <>
                                <Form.Group className="position-relative mb-3">
                                    <Form.Label htmlFor={fld.field} className="fw-bold">
                                        {fld.text}
                                        {fld.required &&
                                            <span className="text-danger">*</span>
                                        }
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text id={`${fld.field}_input_icon`}>
                                            {
                                                (fld.fieldIcon) ?
                                                    <i className={`fa-solid fa-${fld.fieldIcon}`}></i>
                                                    :
                                                    <i className={`fa-solid fa-star`}></i>
                                            }
                                        </InputGroup.Text>
                                        <Form.Control as="textarea" rows={3}
                                            name={fld.field}
                                            id={fld.field}
                                            className={dirty ? (errors[fld.field] ? "is-invalid" : "is-valid") : ""}
                                            placeholder={fld.placeholder}
                                            value={data[fld.field] || ""}
                                            disabled={props.readonly || fld.readonly || false}
                                            onChange={handleChange} />
                                        {/* <p className="text-danger">{errors[fld.field]}</p> */}
                                    </InputGroup>
                                </Form.Group>
                            </>
                        }
                        {(fld.type === 'email') &&
                            <>
                                <Form.Group className="position-relative mb-3">
                                    <Form.Label htmlFor={fld.field} className="fw-bold">
                                        {fld.text}
                                        {fld.required &&
                                            <span className="text-danger">*</span>
                                        }
                                    </Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text id={`${fld.field}_input_icon`}>
                                            {
                                                (fld.fieldIcon) ?
                                                    <i className={`fa-solid fa-${fld.fieldIcon}`}></i>
                                                    :
                                                    <i className={`fa-solid fa-star`}></i>
                                            }
                                        </InputGroup.Text>
                                        <Form.Control type="text"
                                            name={fld.field}
                                            id={fld.field}
                                            className={dirty ? (errors[fld.field] ? "is-invalid" : "is-valid") : ""}
                                            placeholder={fld.placeholder}
                                            value={data[fld.field] || ""}
                                            disabled={props.readonly || fld.readonly || false}
                                            onChange={handleChange} />
                                        {/* <p className="text-danger">{errors[fld.field]}</p> */}
                                    </InputGroup>
                                </Form.Group>
                            </>
                        }
                        {(fld.type === 'phone') &&
                            <>
                                <Form.Group className="position-relative mb-3">
                                    <Form.Label htmlFor={fld.field} className="fw-bold">
                                        {fld.text}
                                        {fld.required &&
                                            <span className="text-danger">*</span>
                                        }
                                    </Form.Label>
                                    <MaskedInput
                                        mask={[/[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                                        placeholder="##########"
                                        name={fld.field}
                                        id={fld.field}
                                        className={dirty ? (errors[fld.field] ? "form-control is-invalid" : "form-control is-valid") : "form-control"}
                                        value={data[fld.field] || ""}
                                        disabled={props.readonly || fld.readonly || false}
                                        onChange={handleChange} />
                                    {/* <p className="text-danger">{errors[fld.field]}</p> */}

                                </Form.Group>
                            </>
                        }
                        {fld.type === 'check' &&
                            <>
                                <Form.Group className="position-relative mb-3">
                                    <Form.Label htmlFor={fld.field} className="fw-bold">
                                        {fld.text} :
                                        {fld.required &&
                                            <span className="text-danger">*</span>
                                        }
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Check className='text-capitalize'
                                            type="switch"
                                            style={{ transform: 'scale(1.2)' }}
                                            id={fld.field}
                                            checked={data[fld.field] || false}
                                            onChange={(e) => handleChange(e)}
                                            disabled={props.readonly}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </>
                        }
                        {fld.type === 'user-roles' &&
                            <>
                                <Form.Group className="position-relative form-group">
                                    <IUIUserRoleEdit
                                        value={data[fld.field] || []}
                                        id={fld.field}
                                        text={fld.text}
                                        onChange={handleChange}
                                        readonly={props.readonly || fld.readonly || false}
                                    />
                                </Form.Group>
                                <br />
                            </>
                        }
                        {fld.type === 'user-privileges' &&
                            <>
                                <Form.Group className="position-relative form-group">
                                    <IUIRolePrivilege value={data[fld.field] || []}
                                        id={fld.field}
                                        text={fld.text}
                                        onChange={handleChange}
                                        readonly={props.readonly || fld.readonly || false}
                                    />
                                </Form.Group>
                                <br />
                            </>
                        }
                        {fld.type === 'lookup' &&
                            <>
                                <Form.Group className="position-relative mb-3">
                                    {!props?.inline &&
                                        <Form.Label htmlFor={fld.field} className="fw-bold">
                                            {fld.text}
                                            {fld.required &&
                                                <span className="text-danger">*</span>
                                            }
                                        </Form.Label>
                                    }
                                    <InputGroup>
                                        {!props?.inline &&
                                            <InputGroup.Text id={`${fld.field}_input_icon`}>
                                                {
                                                    (fld.fieldIcon) ?
                                                        <i className={`fa-solid fa-${fld.fieldIcon}`}></i>
                                                        :
                                                        <i className={`fa-solid fa-star`}></i>
                                                }
                                            </InputGroup.Text>
                                        }
                                        <IUILookUp
                                            value={data[fld.field]}
                                            className={dirty ? (errors[fld.field] ? "is-invalid" : "is-valid") : ""}
                                            id={fld.field}
                                            schema={fld.schema}
                                            onChange={handleChange}
                                            readonly={props.readonly || fld.readonly || false}
                                        />
                                    </InputGroup>
                                </Form.Group>
                                {/* <p className="text-danger">{errors[fld.field]}</p> */}
                            </>
                        }
                        {(fld.type === 'date') &&
                            <>
                                <Form.Group className="position-relative form-group fw-bold">
                                    <Form.Label htmlFor={fld.field} >
                                        {fld.text}
                                        {fld.required &&
                                            <span className="text-danger">*</span>
                                        }
                                    </Form.Label>
                                    <Form.Control type="date"
                                        name={fld.field}
                                        id={fld.field}
                                        className={dirty ? (errors[fld.field] ? "is-invalid" : "is-valid") : ""}
                                        placeholder={fld.placeholder}
                                        value={data[fld.field]?.substring(0, 10) || ""}
                                        disabled={props.readonly || fld.readonly || false}
                                        onChange={handleChange} />

                                </Form.Group>
                            </>
                        }
                        {fld.type === 'picture-upload' &&
                            <>
                                <Form.Group className="position-relative">
                                    <IUIPictureUpload value={data[fld.field] || []}
                                        id={fld.field}
                                        text={fld.text}
                                        onChange={handleChange}
                                        readonly={props.readonly || fld.readonly || false}
                                    />
                                </Form.Group>
                                <br />
                            </>
                        }
                        {fld.type === 'module-relation' &&
                            <>
                                <Form.Group className="position-relative">
                                    <IUIListRelation schema={fld.schema} parentId={data.id} />
                                </Form.Group>
                                <br />
                            </>
                        }
                        {fld.type === 'module-relation-inline' &&
                            <>
                                <Form.Group className="position-relative">
                                    <IUIListInline
                                        value={data[fld.field]}
                                        // className={dirty ? (errors[fld.field] ? "is-invalid" : "is-valid") : ""}
                                        id={fld.field}
                                        schema={fld.schema}
                                        onChange={handleChange}
                                        readonly={props.readonly || fld.readonly || false}
                                    />
                                </Form.Group>
                                <br />
                            </>
                        }
                        {fld.type === 'reset-password' &&
                            <>
                                <Form.Group className="position-relative">
                                    <IUIResetPasswordElement value={data[fld.field] || []}
                                        id={fld.field}
                                        text={fld.text}
                                    />
                                </Form.Group>
                                <br />
                            </>
                        }
                    </Col>
                ))}
            </Row>
        </>

    )
}

export default IUIPageElement;