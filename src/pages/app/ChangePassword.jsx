import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../store/api-db";

const ChangePassword = () => {
    const module = 'identity';
    const loggedInUser = useSelector((state) => state.api.loggedInUser);
    const saved = useSelector((state) => state.api[module]?.saved);
    const [data, setData] = useState({ email: loggedInUser?.email, currentPassword: "", newPassword: "", confirmPassword: "" });
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        e.preventDefault();
        setData({ ...data, [e.target.id]: e.target.value });
    };

    const validate = (values) => {
        const errors = {};
        if (!values.currentPassword || values.currentPassword === "") {
            errors.currentPassword = "Current Password is required.";
        }
        if (!values.newPassword || values.newPassword === "") {
            errors.newPassword = "New Password is required.";
        }
        if (!values.confirmPassword || values.confirmPassword === "") {
            errors.confirmPassword = "Confirm Password is required.";
        }
        if (values.newPassword !== "" && values.confirmPassword !== "" && values.newPassword !== values.confirmPassword) {
            errors.matchNewAndConfirmed = "New Password should be same as Confirm Password."
        }
        return errors;
    }

    const handleChangePassword = (e) => {
        e.preventDefault();
        setFormErrors(validate(data));
        if (Object.keys(validate(data)).length === 0) {
            dispatch(changePassword({ module: module, data: data }));
        }
    };

    useEffect(() => {
        if (saved === 'saved') {
            // Logout on load of this page
            //dispatch(resetSave({ module: module }));
            navigate("/change-password-success", { replace: true });
        }
    }, [saved, navigate, dispatch]);

    return (
        <>
            <div className="app-page-title">
                <div className="page-title-heading">Change Your Password</div>
            </div>
            <div className="tab-content">
                <div className="tabs-animation">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="main-card mb-3 card">
                                <div className="card-body">
                                    <Form>
                                        <Row>
                                            <Col>
                                                <Button variant="contained"
                                                    className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-md mr-2"
                                                    onClick={handleChangePassword}>
                                                    Submit
                                                </Button>

                                                <Button variant="contained"
                                                    className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-secondary btn-md mr-2"
                                                    onClick={() => navigate(-1)}>
                                                    Cancel
                                                </Button>
                                            </Col>
                                        </Row>
                                        <hr />

                                        <Row>
                                            <Col>
                                                <Form.Group className="position-relative">
                                                    <Form.Label htmlFor='currentPassword' className="fw-bold">
                                                        <span className="text-danger">*</span> Current Password :
                                                    </Form.Label>
                                                    <Form.Control type="password"
                                                        name="currentPassword"
                                                        id="currentPassword"
                                                        placeholder="Current Password here..."
                                                        value={data?.currentPassword}
                                                        onChange={handleChange} />
                                                    <p className="text-danger">{formErrors.currentPassword}</p>
                                                </Form.Group>

                                                <Form.Group className="position-relative">
                                                    <Form.Label htmlFor='newPassword' className="fw-bold">
                                                        <span className="text-danger">*</span> New Password :
                                                    </Form.Label>
                                                    <Form.Control type="password"
                                                        name="newPassword"
                                                        id="newPassword"
                                                        placeholder="New Password here..."
                                                        value={data?.newPassword}
                                                        onChange={handleChange} />
                                                    <p className="text-danger">{formErrors.newPassword}</p>
                                                </Form.Group>

                                                <Form.Group className="position-relative">
                                                    <Form.Label htmlFor='confirmPassword' className="fw-bold">
                                                        <span className="text-danger">*</span> Confirm Password :
                                                    </Form.Label>
                                                    <Form.Control type="password"
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        placeholder="Confirm Password here..."
                                                        value={data?.confirmPassword}
                                                        onChange={handleChange} />
                                                    <p className="text-danger">{formErrors.confirmPassword}</p>
                                                    <p className="text-danger">{formErrors.matchNewAndConfirmed}</p>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <hr />
                                        <Row>
                                            <Col>
                                                <Button variant="contained"
                                                    className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-md mr-2"
                                                    onClick={handleChangePassword}>
                                                    Submit
                                                </Button>

                                                <Button variant="contained"
                                                    className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-secondary btn-md mr-2"
                                                    onClick={() => navigate(-1)}>
                                                    Cancel
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePassword