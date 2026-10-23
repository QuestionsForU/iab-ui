import React, { useState, useEffect } from 'react';
import { Form} from "react-bootstrap";
import IUIPrivileges from './IUIPrivileges';
import { lisModuleDefinitions } from "../../app/schema/lisModuleDefinitions";

const IUIRolePrivilege = (props) => {

    const [value, setValue] = useState(props?.value)
    
    // There is no server module privilege - this is fixed 
    const privileges = [
        { id: 0, name: "list" },
        { id: 1, name: "view" },
        { id: 2, name: "add" },
        { id: 3, name: "edit" },
        { id: 4, name: "delete" }
    ]
    const modules = [
        { name: "role", text: "Role" },
        { name: "user", text: "User" },
        { name: "supplier", text: "Supplier" },
        { name: "productType", text: "Product Type" },
        { name: "product", text: "Product" },
        { name: "invoice", text: "Invoice" },
        { name: "employee", text: "Employee" },
        { name: "patient", text: "Patient" },
        { name: "parameterRange", text: "Parameter Range" },
        ...lisModuleDefinitions.map(({ module, title }) => ({ name: module, text: title })),
		// { name: "company", text: "Companies" },
        // { name: "itemMaster", text: "Item Master" },
        // { name: "itemGroup", text: "Item Group" },
        // { name: "project", text: "Projects" },
        // { name: "tower", text: "Towers" },
        // { name: "floor", text: "Floors" },
        // { name: "flat", text: "Flats" },
    ] // TODO

    const modulePrivileges = modules.map((item, index) => {
        return { id: index, name: item.name, text: item.text, items: privileges }
    })

    const schema = modulePrivileges;

    useEffect(() => {
        const nextValue = Array.isArray(props.value) ? props.value : [];
        setValue(currentValue => (
            JSON.stringify(nextValue) === JSON.stringify(currentValue) ? currentValue : nextValue
        ));
    }, [props.value])



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
        if (props.readonly) {
            return;
        }

        const baseValue = Array.isArray(e?.target?.value) ? e.target.value : value;
        const nextValue = normalizePrivileges(baseValue);
        setValue(nextValue);

        const ev = { target: { id: props.id, value: nextValue }, preventDefault: function () { } };
        if (props.onChange) {
            props.onChange(ev);
        }
    };

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <Form.Label className="fs-6"><span className="fw-bold text-capitalize"> {props?.text} </span></Form.Label>
                </div>
                <div className="card-body">
                    <div className="fs-12">
                        {schema?.map((item, i) => (
                            <IUIPrivileges
                                key={i}
                                id={`${item.name}`}
                                schema={item}
                                value={value}
                                readonly={props.readonly}
                                onChange={handleChange}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </>
    )
}

export default IUIRolePrivilege