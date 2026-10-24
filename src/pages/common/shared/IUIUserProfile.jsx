import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { updateProfile, resetSave } from '../../../store/api-db';
import IUIPageElement from '../shared/IUIPageElement';
import validateFormFields from '../formValidation';

const IUIUserProfile = (props) => {
    // Properties
    const schema = props?.schema;
    const module = schema?.module;

    // Logged in User
    const loggedInUser = useSelector((state) => state.api.loggedInUser);

    // Global State
    const saved = useSelector((state) => state.api[module]?.saved)
    const [dirty, setDirty] = useState(false)

    // Local State
    const [data, setData] = useState({});
    const [errors, setErrors] = useState({});

    // Usage
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (loggedInUser) {
            setData(loggedInUser);
        }
    }, [loggedInUser]);

    useEffect(() => {
        if (dirty) {
            const error = validateFormFields(data, schema?.fields)
            setErrors(error);
        }
    }, [data, dirty, schema?.fields]);

    const handleChange = (e) => {
        e.preventDefault();
        const newData = { ...data, ...e.target.value }
        setData(newData);
    };

    const savePageValue = (e) => {
        e.preventDefault();
        if (!props?.readonly) {
            setDirty(true);
            const error = validateFormFields(data, schema?.fields)
            setErrors(error);
            if (Object.keys(error).length === 0) {
                if (!data)
                    return

                const userData = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    department: data.department,
                    photoUrl: data.photoUrl,
                    address: data.address,
                }

                if (loggedInUser !== undefined)
                    dispatch(updateProfile({ module: module, data: userData }));
            }
        }
    };

    // Redirection after save
    useEffect(() => {
        if (!props?.readonly) {

            if (saved === 'saved') {
                if (module) {
                    dispatch(resetSave({ module: module }));
                    navigate(`/view-profile`);
                }
                else {
                    navigate("/");
                }
            }
        }
    }, [dispatch, module, navigate, props?.readonly, saved])

    return (
        <>
            <div className="app-page-title">
                <div className="page-title-heading"> {schema?.title}</div>
            </div>
            <div className="tab-content">
                <div className="tabs-animation">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="main-card mb-3 card">
                                <div className="card-body">
                                    <div>
                                        <Form>
                                            <Row>
                                                <Col>
                                                    {schema?.back &&
                                                        <Button variant="contained"
                                                            className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-secondary btn-md mr-2"
                                                            onClick={() => navigate(`/home`)}> Back </Button>
                                                    }
                                                    {!schema?.readonly &&
                                                        <>
                                                            <Button variant="contained"
                                                                className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-md mr-2"
                                                                onClick={savePageValue}>Save </Button>

                                                            <Button variant="contained"
                                                                className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-secondary btn-md mr-2"
                                                                onClick={() => navigate(-1)}> Cancel</Button>
                                                        </>
                                                    }
                                                    {schema?.editing &&
                                                        <Button
                                                            variant="contained"
                                                            className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-sm mr-2"
                                                            onClick={() => navigate(`/edit-profile`)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    }
                                                    {/* <IUIModuleMessage schema={props.schema} /> */}
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                {schema?.fields?.map((fld, f) => (
                                                    <Col md={fld.width || 6} key={f}>
                                                        {fld.type === 'area' &&
                                                            <>
                                                                <IUIPageElement
                                                                    id={schema.module}
                                                                    schema={fld.fields}
                                                                    value={data}
                                                                    errors={errors}
                                                                    readonly={schema.readonly}
                                                                    onChange={handleChange}
                                                                    dirty={dirty}
                                                                />
                                                                <br />
                                                            </>
                                                        }
                                                        {fld.type !== 'area' &&
                                                            <>
                                                                <IUIPageElement
                                                                    id={schema.module}
                                                                    schema={[fld]}
                                                                    value={data}
                                                                    errors={errors}
                                                                    onChange={handleChange}
                                                                    readonly={schema.readonly}
                                                                />
                                                                <br />
                                                            </>
                                                        }
                                                    </Col>
                                                ))}
                                            </Row>

                                            <hr />
                                            <Row>
                                                <Col>
                                                    {schema?.back &&
                                                        <Button variant="contained"
                                                            className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-secondary btn-md mr-2"
                                                            onClick={() => navigate(`/home`)}> Back </Button>
                                                    }
                                                    {!schema?.readonly &&
                                                        <>
                                                            <Button variant="contained"
                                                                className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-md mr-2"
                                                                onClick={savePageValue}>Save </Button>

                                                            <Button variant="contained"
                                                                className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-secondary btn-md mr-2"
                                                                onClick={() => navigate(-1)}> Cancel</Button>
                                                        </>
                                                    }
                                                    {schema?.editing &&
                                                        <Button
                                                            variant="contained"
                                                            className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-sm mr-2"
                                                            onClick={() => navigate(`/edit-profile`)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    }
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default IUIUserProfile;