
import IUIList from "../../common/IUIList";
import IUIPage from "../../common/IUIPage"

export const ListUser = () => {

    const schema = {
        module: 'user',
        title: 'User Management',
        paging: true,
        searching: true,
        editing: true,
        adding: true,
        fields: [
            { text: 'First Name', field: 'firstName', type: 'link', sorting: true, searching: true },
            { text: 'Last Name', field: 'lastName', type: 'text', sorting: true, searching: true },
            { text: 'Email', field: 'email', type: 'text', sorting: true, searching: true },
            { text: 'Phone Number', field: 'phoneNumber', type: 'text', sorting: true, searching: false },
        ]
    }


    return (<IUIList schema={schema} />)
}

export const ViewUser = () => {
    const schema = {
        module: 'user',
        title: 'User Management',
        editing: true,
        adding: false,
        back: true,
        readonly: true,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Profile Picture', field: 'photoUrl', placeholder: 'PhotoUrl here...', type: 'picture-upload' },
                    // { text: 'Email', field: 'email', type: 'link', to: 'mailto://' },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Reset Password', field: 'email', type: 'reset-password' },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Email', field: 'email', fieldIcon: 'envelope', placeholder: 'Email here...', type: 'email', readonly: true, width: 6 },
                    {
                        text: 'Department', field: 'department', fieldIcon: 'building', placeholder: 'Department here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            //module:'department', Pass either module to be fetched data dynamically
                            items: [ // or use items for fixed value
                                { name: 'Civil' },
                                { name: 'Legal' }
                            ]
                        }
                    },
                    { text: 'First Name', field: 'firstName', fieldIcon: 'user', placeholder: 'First Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Last Name', field: 'lastName', fieldIcon: 'user', placeholder: 'Last Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Phone Number', field: 'phoneNumber', fieldIcon: 'phone', placeholder: 'Phone Number here...', type: 'phone', required: false, width: 6 },
                    { text: 'Disable', field: 'disable', fieldIcon: 'user-slash', placeholder: 'Check to disable user...', type: 'check', required: false, width: 6 },
                    { text: 'Address', field: 'address', fieldIcon: 'location-dot', placeholder: 'Address here...', type: 'textarea', required: false, width: 12 },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Roles', field: 'roles', type: 'user-roles' },
                    { text: 'Privileges', field: 'privileges', type: 'user-privileges', readonly: true },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const EditUser = () => {
    const schema = {
        module: 'user',
        title: 'User Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Profile Picture', field: 'photoUrl', placeholder: 'PhotoUrl here...', type: 'picture-upload' },
                    // { text: 'Email', field: 'email', type: 'link', to: 'mailto://' },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Email', field: 'email', fieldIcon: 'envelope', placeholder: 'Email here...', type: 'email', readonly: true, width: 6 },
                    {
                        text: 'Department', field: 'department', fieldIcon: 'building', placeholder: 'Department here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            //module:'department', Pass either module to be fetched data dynamically
                            items: [ // or use items for fixed value
                                { name: 'Civil' },
                                { name: 'Legal' }
                            ]
                        }
                    },
                    { text: 'First Name', field: 'firstName', fieldIcon: 'user', placeholder: 'First Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Last Name', field: 'lastName', fieldIcon: 'user', placeholder: 'Last Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Phone Number', field: 'phoneNumber', fieldIcon: 'phone', placeholder: 'Phone Number here...', type: 'phone', required: false, width: 6 },
                    { text: 'Disable', field: 'disable', fieldIcon: 'user-slash', placeholder: 'Check to disable user...', type: 'check', required: false, width: 6 },
                    { text: 'Address', field: 'address', fieldIcon: 'location-dot', placeholder: 'Address here...', type: 'textarea', required: false, width: 12 },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Roles', field: 'roles', type: 'user-roles' },
                    { text: 'Privileges', field: 'privileges', type: 'user-privileges', readonly: true },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}

export const AddUser = () => {
    const schema = {
        module: 'user',
        title: 'User Management',
        back: false,
        fields: [
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Profile Picture', field: 'photoUrl', placeholder: 'PhotoUrl here...', type: 'picture-upload' },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Email', field: 'email', fieldIcon: 'envelope', placeholder: 'Email here...', type: 'email', required: true, width: 6 },
                    {
                        text: 'Department', field: 'department', fieldIcon: 'building', placeholder: 'Department here...', type: 'lookup', required: true, width: 6,
                        schema: {
                            //module:'department', Pass either module to be fetched data dynamically
                            items: [ // or use items for fixed value
                                { name: 'Civil' },
                                { name: 'Legal' }
                            ]
                        }
                    },
                    { text: 'First Name', field: 'firstName', fieldIcon: 'user', placeholder: 'First Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Last Name', field: 'lastName', fieldIcon: 'user', placeholder: 'Last Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Phone Number', field: 'phoneNumber', fieldIcon: 'phone', placeholder: 'Phone Number here...', type: 'phone', required: false, width: 6 },
                    { text: 'Disable', field: 'disable', fieldIcon: 'user-slash', placeholder: 'Check to disable user...', type: 'check', required: false, width: 6 },
                    { text: 'Address', field: 'address', fieldIcon: 'location-dot', placeholder: 'Address here...', type: 'textarea', required: false, width: 12 },
                ]
            },
            {
                type: "area", width: 12
                , fields: [
                    { text: 'Roles', field: 'roles', type: 'user-roles' },
                    { text: 'Privileges', field: 'privileges', type: 'user-privileges', readonly: true },
                ]
            },
        ]
    }

    return (<IUIPage schema={schema} />)
}