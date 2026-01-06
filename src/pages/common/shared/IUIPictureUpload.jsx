import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';

const IUIPictureUpload = (props) => {
    const schema = props?.schema;
    const [file, setFile] = useState([]);
    const fileRef = React.createRef()
    const cardBodyStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '300px',
        overflow: 'hidden',
        position: 'relative'
    };

    useEffect(() => {
        if (props?.value)
            setFile(props?.value);
    }, [props?.value]);

    const handleChange = async (e) => {
        e.preventDefault();
        const imageContent = await convertBase64(e.target.files[0])
        setFile(imageContent);

        const event = { target: { id: e.target.id, value: imageContent }, preventDefault: function () { } }

        if (props.onChange) {
            props.onChange(event);
        }

    }

    const triggerClick = (e) => {
        e.preventDefault();
        fileRef.current.click()
    }

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    return (
        <>
            <div className="card position-relative" style={{ width: "10rem", height: "10rem", margin: "auto", borderRadius: "150px" }}>
                <div className="card-body" style={cardBodyStyle}>
                    <button className="btn top-0 end-0" onClick={triggerClick}>
                        {/* <i className="metismenu-icon fa-solid fa-cogs"></i> */}
                        {
                            (file.length > 0) && <img src={file} style={{ width: "10rem", height: "10rem", margin: "auto", borderRadius: "150px" }} title='Profile Picture' alt='Profile Picture' />
                        }
                        {
                            (file.length === 0) && <span className="profile-pic-upload-text">
                                <i className="fa-solid fa-cloud-arrow-up"></i> Upload Logo
                            </span>
                        }
                    </button>


                    <Form.Control
                        className='d-none'
                        id={props?.id}
                        type="file"
                        onChange={handleChange}
                        disabled={props.readonly || false}
                        ref={fileRef}
                        accept="image/gif, image/jpeg, image/png"
                    ></Form.Control>
                </div>
            </div>
        </>
    );
}


export default IUIPictureUpload