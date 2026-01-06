import IUIUserProfile from "../common/shared/IUIUserProfile";

export const ViewProfile = () => {
    const schema = {
        module: 'identity',
        title: 'User Profile',
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
                    { text: 'Email', field: 'email', fieldIcon: 'envelope', placeholder: 'Email here...', type: 'email', readonly: true, width: 6 },
                    { text: 'Phone Number', field: 'phoneNumber', fieldIcon: 'phone', placeholder: 'Phone Number here...', type: 'phone', required: false, width: 6 },
                    { text: 'First Name', field: 'firstName', fieldIcon: 'user', placeholder: 'First Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Last Name', field: 'lastName', fieldIcon: 'user', placeholder: 'Last Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Address', field: 'address', fieldIcon: 'location-dot', placeholder: 'Address here...', type: 'textarea', required: false, width: 12 },
                ]
            }
        ]
    }

    return (<IUIUserProfile schema={schema} />)
}

export const EditProfile = () => {
    const schema = {
        module: 'identity',
        title: 'Update Profile',
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
                    { text: 'Phone Number', field: 'phoneNumber', fieldIcon: 'phone', placeholder: 'Phone Number here...', type: 'phone', required: false, width: 6 },
                    { text: 'First Name', field: 'firstName', fieldIcon: 'user', placeholder: 'First Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Last Name', field: 'lastName', fieldIcon: 'user', placeholder: 'Last Name here...', type: 'text', required: true, width: 6 },
                    { text: 'Address', field: 'address', fieldIcon: 'location-dot', placeholder: 'Address here...', type: 'textarea', required: false, width: 12 },
                ]
            }
        ]
    }

    return (<IUIUserProfile schema={schema} />)
}