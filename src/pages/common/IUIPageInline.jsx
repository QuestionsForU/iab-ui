import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSingleData, editData, addData, selectModuleItem } from '../../store/api-db'
import { useSelector } from 'react-redux'
import IUIPageElement from './shared/IUIPageElement';
import IUIModuleMessage from './shared/IUIModuleMessage';

const IUIPageInline = (props) => {
    // Properties
    const schema = props?.schema;

    // Local State
    const [value, setValue] = useState({});
    const [dirty, setDirty] = useState(false)
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (props?.value) {
            const item = { ...props?.value, ...{ readonly: props?.value?.mode !== 'add' } }
            setValue(item);
        }
    }, [props?.value]);


    const handleChange = (e) => {
        e.preventDefault();
        const item = { ...value, ...e.target.value }
        setValue(item)
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
        setDirty(true);
        const error = validate(value, schema?.fields)
        setErrors(error);
        if (Object.keys(error).length === 0) {
            if (!value)
                return

            const item = { ...value, mode: null, readonly: null }
            const event = { target: { id: props?.id, value: item }, preventDefault: function () { } }
            if (props.onChange) {
                props.onChange(event);
            }

            setDirty(false);
            setErrors({});
        }
    };

    const deletePageValue = (e) => {
        e.preventDefault();
        const event = { target: { id: props?.id, value: { id: value.id, deleted: true } }, preventDefault: function () { } }
        if (props.onChange) {
            props.onChange(event);
        }
    }

    const cancelPageValue = (e) =>{
        e.preventDefault();
        const event = { target: { id: props?.id, value: { id: value.id} }, preventDefault: function () { } }
        if (props.onChange) {
            props.onChange(event);
        }
    }

    const setMode = (e, mode) => {
        e.preventDefault();
        setDirty(false)
        setErrors({})
        const item = {
            ...value,
            ...{
                mode: mode,
                readonly: (mode !== 'add' && mode !== 'edit')
            }
        }
        setValue(item);

    }

    return (
        <React.Fragment>
            {schema?.fields?.map((fld, f) => (
                <React.Fragment key={f}>

                    {fld.type !== 'hidden-filter' &&
                        <td >
                            <IUIPageElement
                                id={`${value?.id}`}
                                schema={[fld]}
                                value={value}
                                errors={errors}
                                onChange={handleChange}
                                readonly={value?.readonly}
                                inline={true}
                                dirty={dirty}
                            />
                        </td>
                    }

                </React.Fragment>
            ))}
            {<td>
                {schema?.editing &&

                    <div className="input-group">
                        {!value?.mode &&
                            <>
                                < button className="btn btn-outline-primary" onClick={e => setMode(e, 'edit')}><i className="fa-solid fa-edit" title='Edit'></i></button>
                                < button className="btn btn-outline-danger" onClick={deletePageValue}><i className="fa-solid fa-trash" title='Delete'></i></button>
                            </>
                        }
                        {value?.mode === 'add' &&
                            <>
                                < button className="btn btn-outline-primary" onClick={savePageValue}><i className="fa-solid fa-save" title='Save'></i></button>
                            </>
                        }
                        {value?.mode === 'edit' &&
                            <>
                                < button className="btn btn-outline-primary" onClick={savePageValue}><i className="fa-solid fa-save" title='Save'></i></button>
                                < button className="btn btn-outline-secondary" onClick={cancelPageValue}><i className="fa-solid fa-cancel" title='Cancel'></i></button>
                            </>
                        }
                    </div>
                }
                {
                    schema?.fields?.map((fld, f) => (
                        <React.Fragment key={f}>
                            {fld.type === 'hidden-filter' &&
                                <IUIPageElement
                                    id={`${value?.id}`}
                                    schema={[fld]}
                                    value={value}
                                    errors={errors}
                                    onChange={handleChange}
                                    readonly={value?.readonly}
                                />
                            }
                        </React.Fragment>
                    ))
                }
            </td >}
        </React.Fragment >
    )
}

export default IUIPageInline;