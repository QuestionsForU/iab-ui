import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage";

export const ListRole = () => {
    const schema = {
        module: 'role',
        title: 'Role Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'Role Name', field: 'name', type: 'link', sorting: true, searching: true },
        ]
    }
    return (<IUIList schema={schema} />)
}

export const ViewRole = () => {
    const schema = {
        module: 'role',
        title: 'Role Details',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            { text: 'Role Name', field: 'name', fieldIcon: 'circle-user', type: 'label', width: 12 },
            { text: 'Privileges', field: 'privileges', type: 'user-privileges', width: 12 },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditRole = () => {
    const schema = {
        module: 'role',
        title: 'Edit Role',
        back: false,
        fields: [
            { text: 'Role Name', field: 'name', fieldIcon: 'circle-user', type: 'label', width: 12 },
            { text: 'Privileges', field: 'privileges', type: 'user-privileges', width: 12 },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddRole = () => {
    const schema = {
        module: 'role',
        title: 'Add New Role',
        back: false,
        fields: [
            { text: 'Role Name', field: 'name', fieldIcon: 'circle-user', placeholder: 'Role Name here...', type: 'text', required: true, width: 12 },
            { text: 'Privileges', field: 'privileges', type: 'user-privileges', width: 12 },
        ]
    }

    return (<IUIPage schema={schema} />)
}