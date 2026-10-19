import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import Form from 'react-bootstrap/Form';
import { getData } from '../../../store/api-db';

const IUILookUp = (props) => {
    const schema = props?.schema;
    const dispatch = useDispatch();
    const getLookupValue = useCallback((nextValue) => {
        if (typeof nextValue === 'string') return nextValue;
        if (nextValue && typeof nextValue === 'object') return nextValue[schema?.displayField || 'name'] || nextValue.name || "";
        return "";
    }, [schema?.displayField]);

    const [value, setValue] = useState(getLookupValue(props?.value))
    const [text, setText] = useState(getLookupValue(props?.value))

    const dataSet = useSelector((state) => state.api[schema?.module]) || { items: schema?.items || [] };

    useEffect(() => {
        const nextValue = getLookupValue(props?.value);

        if (props?.value === undefined || props?.value === null || nextValue === "") {
            setValue("");
            setText("");
            return;
        }

        setValue(nextValue);
        setText(nextValue);
    }, [getLookupValue, props?.value]);

    useEffect(() => {
        if (schema?.module) {
            dispatch(getData({ module: schema.module, options: { recordPerPage: 0 } }));
        }
    }, [dispatch, schema?.module]);

    useEffect(() => {
        const displayField = schema?.displayField || 'name';
        const valueField = schema?.valueField || displayField;
        const lookupValue = dataSet?.items?.find(item =>
            `${item?.[valueField]}` === `${value}` || item?.[displayField] === value || item?.name === value
        )?.[displayField] || dataSet?.items?.find(item =>
            `${item?.[valueField]}` === `${value}` || item?.[displayField] === value || item?.name === value
        )?.name || value;
        setText(lookupValue);
    }, [dataSet?.items, schema?.displayField, schema?.valueField, value]);

    const handleChange = (e) => {
        e.preventDefault();
        if (props?.readonly) {
            return;
        }

        const nextValue = e.target.value;
        const displayField = schema?.displayField || 'name';
        const valueField = schema?.valueField || displayField;
        const selectedItem = schema?.module
            ? dataSet?.items?.find(item =>
                `${item?.[valueField]}` === `${nextValue}` ||
                item?.[displayField] === nextValue ||
                item?.name === nextValue
            )
            : null;

        const displayValue = selectedItem?.[displayField] || selectedItem?.name || nextValue || "";
        const storedValue = selectedItem && schema?.valueField ? selectedItem[schema.valueField] : displayValue;

        if (nextValue === "") {
            setValue("");
            setText("");
        } else {
            setValue(storedValue);
            setText(displayValue);
        }

        if (!props?.onChange) {
            return;
        }

        if (schema?.module === 'product' && selectedItem) {
            const selectedProductValue = {
                name: selectedItem.name,
                price: Number(selectedItem.price) || 0,
            };

            props.onChange({
                target: {
                    id: props.id,
                    value: selectedProductValue,
                },
                preventDefault: function () { }
            });
            return;
        }

        props.onChange({
            target: { id: props.id, value: storedValue },
            preventDefault: function () { }
        });
    };

    return (
        <>
            {props?.readonly &&
                <>
                    {!props?.textonly &&
                        <Form.Control type="text"
                            aria-label={props.placeholder}
                            id={props.id}
                            value={text || props?.value || ""}
                            disabled={true}
                            readOnly={true}
                            className={`fs-6 ${props.className}`} />
                    }
                    {props?.textonly &&
                        <>
                            {text || props?.value || ""}
                        </>
                    }
                </>
            }
            {!props?.readonly &&
                <Form.Select
                    aria-label={props.placeholder}
                    id={props.id}
                    value={value}
                    className={`fs-6 ${props.className}`}
                    disabled={props.readonly || false}
                    onChange={(e) => handleChange(e)}>
                    <option value="">--Select--</option>
                    {(dataSet?.items || []).map((item, i) => (
                        <option
                            key={item.id || item[schema?.displayField || 'name'] || i}
                            value={item[schema?.valueField || schema?.displayField || 'name'] ?? item.name}
                        >
                            {item[schema?.displayField || 'name'] || item.name}
                        </option>
                    ))}
                </Form.Select>
            }
        </>
    );
}

export default IUILookUp