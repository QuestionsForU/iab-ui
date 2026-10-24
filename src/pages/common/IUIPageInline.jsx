import React, { useState, useEffect } from 'react';
import IUIPageElement from './shared/IUIPageElement';
import validateFormFields from './formValidation';

const IUIPageInline = (props) => {
    // Properties
    const schema = props?.schema;

    // Local State
    const [value, setValue] = useState({});
    const [dirty, setDirty] = useState(false)
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (props?.value) {
            const item = {
                ...props?.value,
                name: props?.value?.name ?? '',
                quantity: props?.value?.quantity ?? '',
                price: props?.value?.price ?? '',
                total: props?.value?.total ?? 0,
                readonly: props?.value?.mode !== 'add'
            }
            setValue(item);
        }
    }, [props?.value]);


    const handleChange = (e) => {
        e.preventDefault();
        const item = { ...value, ...e.target.value };
        const quantity = Number(item.quantity || 0);
        const price = Number(item.price || 0);
        item.total = quantity * price;
        setValue(item)
    };

    const savePageValue = (e) => {
        e.preventDefault();
        setDirty(true);
        const error = validateFormFields(value, schema?.fields)
        setErrors(error);
        if (Object.keys(error).length === 0) {
            if (!value)
                return

            const item = {
                ...value,
                total: Number(value.quantity || 0) * Number(value.price || 0),
                mode: null,
                readonly: null
            }
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
            {schema?.editing && !props?.readonly && (
                <td>
                    <div className="input-group">
                        {!value?.mode &&
                            <>
                                <button className="btn btn-outline-primary" onClick={e => setMode(e, 'edit')}><i className="fa-solid fa-edit" title='Edit'></i></button>
                                <button className="btn btn-outline-danger" onClick={deletePageValue}><i className="fa-solid fa-trash" title='Delete'></i></button>
                            </>
                        }
                        {value?.mode === 'add' &&
                            <>
                                <button className="btn btn-outline-primary" onClick={savePageValue}><i className="fa-solid fa-save" title='Save'></i></button>
                            </>
                        }
                        {value?.mode === 'edit' &&
                            <>
                                <button className="btn btn-outline-primary" onClick={savePageValue}><i className="fa-solid fa-save" title='Save'></i></button>
                                <button className="btn btn-outline-secondary" onClick={cancelPageValue}><i className="fa-solid fa-cancel" title='Cancel'></i></button>
                            </>
                        }
                    </div>
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
                </td>
            )}
        </React.Fragment >
    )
}

export default IUIPageInline;