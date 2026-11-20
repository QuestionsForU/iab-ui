import React, { useEffect, useState } from 'react';
import { Col, Form, Row, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import IUILookUp from './IUILookUp';
import IUIPictureUpload from './IUIPictureUpload';
import IUIRolePrivilege from './IUIRolePrivilege';
import IUIUserRoleEdit from './IUIUserRole';
import IUIListRelation from '../IUIListRelation';
import IUIResetPasswordElement from '../../ResetUserPassword';
import IUIHiddenState from './IUIHiddenState';
import IUIListInline from '../IUIListInline';
import IUIRichText from './IUIRichText';
import IUISignatureUpload from './IUISignatureUpload';
import ProfileTestsField from './ProfileTestsField';
import { isFieldVisible } from '../formValidation';

const FieldRow = ({ inline, alignTop, wide, htmlFor, text, required, children }) => {
    if (inline) {
        return <Form.Group className="position-relative mb-3">{children}</Form.Group>;
    }

    const className = ["iui-field", alignTop ? "iui-field-top" : "", wide ? "iui-field-wide" : ""].filter(Boolean).join(" ");
    return (
        <Form.Group className={className}>
            <Form.Label htmlFor={htmlFor} className="fw-bold">
                {text}
                {required && <span className="text-danger">*</span>}
            </Form.Label>
            <div className="iui-field-control">{children}</div>
        </Form.Group>
    );
};

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

    const normalizePrivileges = (items = []) => {
        const filtered = (Array.isArray(items) ? items : []).filter(item => item && item.module && item.name);
        const unique = [];
        filtered.forEach(item => {
            const key = `${item.module}|${item.name}`;
            if (!unique.some(entry => `${entry.module}|${entry.name}` === key)) {
                unique.push(item);
            }
        });
        return unique;
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (props.readonly)
            return

        let newData = { ...data };
        if (e.target?.id === 'disable') {
            newData = { ...newData, disable: e.target.checked };
        } else if (e?.target?.value && typeof e.target.value === 'object' && !Array.isArray(e.target.value)) {
            newData = { ...newData, ...e.target.value };
        } else if (e.target?.type === 'checkbox') {
            newData = { ...newData, [e.target.id]: e.target.value };
        } else {
            newData = { ...newData, [e.target.id]: e.target.value };
        }

        if (e.target.id === 'roles') {
            const selectedRoles = Array.isArray(e.target.value) ? e.target.value : [];
            const mergedPrivileges = selectedRoles.reduce((acc, role) => {
                if (Array.isArray(role?.privileges)) {
                    acc.push(...role.privileges);
                }
                return acc;
            }, []);
            newData = {
                ...newData,
                roles: [...selectedRoles],
                privileges: normalizePrivileges(mergedPrivileges)
            };
        }
        setData(newData);
        const event = { target: { id: props.id, value: newData }, preventDefault: function () { } }
        if (props.onChange) {
            props.onChange(event);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 10);
        handleChange({
            target: { id: e.target.id, value },
            preventDefault: () => e.preventDefault()
        });
    };


    return (
        <>
            <Row>
                {schema?.map((fld, f) => isFieldVisible(fld, data) && (
                    <Col md={fld.width || 12} key={f}>
                        {fld.type === 'link' &&
                            <FieldRow htmlFor={fld.field} text={fld.text}>
                                <span><Link className="stretched-link" to={`${fld.to}${data[fld.field]}`}> {data[fld.field]} </Link></span>
                            </FieldRow>
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
                            <FieldRow htmlFor={fld.field} text={`${fld.text} :`}>
                                <span> {data[fld.field]} </span>
                            </FieldRow>
                        }
                        {(!fld.type || fld.type === 'text' || fld.type === 'number') &&
                            <FieldRow inline={props?.inline} htmlFor={fld.field} text={fld.text} required={fld.required}>
                                {fld.fieldIcon && !props?.inline ? (
                                    <InputGroup>
                                        <InputGroup.Text id={`${fld.field}_input_icon`}>
                                            <i className={`fa-solid fa-${fld.fieldIcon}`}></i>
                                        </InputGroup.Text>
                                        <Form.Control type="text"
                                            name={fld.field}
                                            id={fld.field}
                                            className={dirty ? (errors[fld.field] ? "is-invalid" : "is-valid") : ""}
                                            placeholder={fld.placeholder}
                                            value={fld.field === 'total'
                                                ? (Number(data.quantity || 0) * Number(data.price || 0)).toFixed(2)
                                                : (data[fld.field] ?? "")}
                                            disabled={props.readonly || fld.readonly || false}
                                            onChange={handleChange} />
                                    </InputGroup>
                                ) : (
                                    <Form.Control type="text"
                                        name={fld.field}
                                        id={fld.field}
                                        className={dirty ? (errors[fld.field] ? "is-invalid" : "is-valid") : ""}
                                        placeholder={fld.placeholder}
                                        value={fld.field === 'total'
                                            ? (Number(data.quantity || 0) * Number(data.price || 0)).toFixed(2)
                                            : (data[fld.field] ?? "")}
                                        disabled={props.readonly || fld.readonly || false}
                                        onChange={handleChange} />
                                )}
                            </FieldRow>
                        }
                        {(fld.type === 'textarea') &&
                            <FieldRow alignTop htmlFor={fld.field} text={fld.text} required={fld.required}>
                                <Form.Control as="textarea" rows={3}
                                    name={fld.field}
                                    id={fld.field}
                                    className={dirty ? (errors[fld.field] ? "is-invalid" : "is-valid") : ""}
                                    placeholder={fld.placeholder}
                                    value={data[fld.field] || ""}
                                    disabled={props.readonly || fld.readonly || false}
                                    onChange={handleChange} />
                            </FieldRow>
                        }
                        {(fld.type === 'email') &&
                            <FieldRow htmlFor={fld.field} text={fld.text} required={fld.required}>
                                <Form.Control type="text"
                                    name={fld.field}
                                    id={fld.field}
                                    className={dirty ? (errors[fld.field] ? "is-invalid" : "is-valid") : ""}
                                    placeholder={fld.placeholder}
                                    value={data[fld.field] || ""}
                                    disabled={props.readonly || fld.readonly || false}
                                    onChange={handleChange} />
                            </FieldRow>
                        }
                        {(fld.type === 'phone') &&
                            <FieldRow htmlFor={fld.field} text={fld.text} required={fld.required}>
                                <Form.Control
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    placeholder="##########"
                                    name={fld.field}
                                    id={fld.field}
                                    className={dirty ? (errors[fld.field] ? "form-control is-invalid" : "form-control is-valid") : "form-control"}
                                    value={data[fld.field] || ""}
                                    disabled={props.readonly || fld.readonly || false}
                                    onChange={handlePhoneChange} />
                            </FieldRow>
                        }
                        {fld.type === 'checkbox' &&
                            <FieldRow htmlFor={fld.field} text={fld.text} required={fld.required}>
                                <Form.Check
                                    type="checkbox"
                                    id={fld.field}
                                    checked={data[fld.field] === true || data[fld.field] === (fld.trueValue || "Yes")}
                                    disabled={props.readonly}
                                    onChange={(e) => handleChange({
                                        target: {
                                            id: fld.field,
                                            type: "checkbox",
                                            value: e.target.checked ? (fld.trueValue || "Yes") : (fld.falseValue || "No"),
                                        },
                                        preventDefault() {},
                                    })}
                                />
                            </FieldRow>
                        }
                        {fld.type === 'richtext' &&
                            <FieldRow alignTop wide htmlFor={fld.field} text={fld.text} required={fld.required}>
                                <IUIRichText
                                    id={fld.field}
                                    value={data[fld.field] || ""}
                                    readonly={props.readonly}
                                    onChange={handleChange}
                                />
                            </FieldRow>
                        }
                        {fld.type === 'signature' &&
                            <FieldRow alignTop htmlFor={fld.field} text={fld.text} required={fld.required}>
                                <IUISignatureUpload
                                    id={fld.field}
                                    value={data[fld.field] || ""}
                                    readonly={props.readonly}
                                    onChange={handleChange}
                                />
                            </FieldRow>
                        }
                        {fld.type === 'profile-tests' &&
                            <ProfileTestsField
                                value={data[fld.field]}
                                readonly={props.readonly}
                                onChange={handleChange}
                            />
                        }
                        {fld.type === 'check' &&
                            <>
                                <FieldRow htmlFor={fld.field} text={`${fld.text} :`} required={fld.required}>
                                    <Form.Check className='text-capitalize'
                                        type="switch"
                                        id={fld.field}
                                        checked={data[fld.field] || false}
                                        onChange={(e) => handleChange(e)}
                                        disabled={props.readonly}
                                    />
                                </FieldRow>
                                {data[fld.field] && fld.showFields && fld.showFields.map((showField, idx) => (
                                    <FieldRow key={idx} htmlFor={showField.field} text={showField.text} required={showField.required}>
                                        <Form.Control
                                            type="text"
                                            name={showField.field}
                                            id={showField.field}
                                            className={dirty ? (errors[showField.field] ? "is-invalid" : "is-valid") : ""}
                                            placeholder={showField.placeholder}
                                            value={data[showField.field] || ""}
                                            disabled={props.readonly || false}
                                            onChange={handleChange}
                                        />
                                    </FieldRow>
                                ))}
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
                            <FieldRow inline={props?.inline} htmlFor={fld.field} text={fld.text} required={fld.required}>
                                <IUILookUp
                                    value={data[fld.field]}
                                    className={dirty ? (errors[fld.field] ? "is-invalid" : "is-valid") : ""}
                                    id={fld.field}
                                    placeholder={fld.placeholder || fld.schema?.placeholder}
                                    schema={fld.schema}
                                    onChange={handleChange}
                                    readonly={props.readonly || fld.readonly || false}
                                />
                            </FieldRow>
                        }
                        {(fld.type === 'date' || fld.type === 'datetime') &&
                            <FieldRow htmlFor={fld.field} text={fld.text} required={fld.required}>
                                <Form.Control type={fld.type === 'datetime' ? 'datetime-local' : 'date'}
                                    name={fld.field}
                                    id={fld.field}
                                    className={dirty ? (errors[fld.field] ? "is-invalid" : "is-valid") : ""}
                                    placeholder={fld.placeholder}
                                    value={data[fld.field]?.substring(0, fld.type === 'datetime' ? 16 : 10) || ""}
                                    disabled={props.readonly || fld.readonly || false}
                                    onChange={handleChange} />
                            </FieldRow>
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
                                        gstPercent={data?.gstPercent || 0}
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