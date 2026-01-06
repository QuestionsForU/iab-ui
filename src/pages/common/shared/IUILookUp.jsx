import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import Form from 'react-bootstrap/Form';

const IUILookUp = (props) => {
    const schema = props?.schema;
    const [value, setValue] = useState("")
    const [text, setText] = useState("")

    const [dataSet, setDataSet] = useState(useSelector((state) => state.api[schema?.module]))

    useEffect(() => {
        if (!schema?.module) {
            setDataSet({ items: schema?.items });
        }
    }, []);

    useEffect(() => {
        const newValue = schema?.module
            ? dataSet?.items?.find(item => item.id === value)?.name
            : value
        if (newValue) {
            setText(newValue);
        }
    }, [dataSet?.items, value]);

    useEffect(() => {
        if (props?.value) {
            setValue(props?.value);
        }
    }, [props?.value]);

    const handleChange = (e) => {
        e.preventDefault();
        if (!props?.readonly) {
            setValue({ ...value, [e.target.id]: e.target.value });
            props.onChange(e);
        }
    };

    return (
        <>
            {props?.readonly &&
                <>
                    {!props?.textonly &&
                        <Form.Control type="text"
                            aria-label={props.placeholder}
                            id={props.id}
                            value={text}
                            disabled={true}
                            readOnly={true}
                            className={`fs-6 ${props.className}`} />
                    }
                    {props?.textonly &&
                        <>
                            {text}
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
                    <option>--Select--</option>
                    {dataSet?.items?.map((item, i) => (
                        <option key={i} value={item.id || item.name}>{item.name}</option>
                    ))}

                </Form.Select>
            }
        </>
    );
}

export default IUILookUp