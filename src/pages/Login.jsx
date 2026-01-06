import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useState, useEffect } from "react";
import { loginUser } from "../store/api-db";
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import ICarousel from "./common/ICarousel";
import { useDispatch, useSelector } from 'react-redux';
import logo from '../assets/images/logo.png';

const Login = () => {
    const module = 'user';
    const navigate = useNavigate();
    const loggedInUser = useSelector((state) => state.api.loggedInUser)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notice, setNotice] = useState("");
    const [dirty, setDirty] = useState(false)
    const { setToken } = useAuth();
    const [formErrors, setFormErrors] = useState({});
    const dispatch = useDispatch();

    const handleLogin = async () => {
        dispatch(loginUser({ module: module, data: { email: email, password: password } }));
    };

    const loginWithUsernameAndPassword = async (e) => {
        e.preventDefault();
        setDirty(true);
        setFormErrors(validate({ email: email, password: password }));
        if (Object.keys(validate({ email: email, password: password })).length === 0) {
            handleLogin();
        }
    }

    const validate = (values) => {
        const errors = {};
        if (!values.email || values.email === "") {
            errors.email = "Email is required";
        }
        /*if (!values.email) {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[item.field])) {
                errors.email = 'Invalid email address.'
            }
        }*/
        if (!values.password || values.password === "") {
            errors.password = "Password is required";
        }

        return errors;
    }

    useEffect(() => {
        setNotice("");
        if (loggedInUser) {

            if (loggedInUser.accessToken) {
                setToken(loggedInUser);
                if (loggedInUser.resetPassword) {
                    navigate("/change-password", { replace: true });
                } else {
                    navigate("/", { replace: true });
                }
            }
            if (dirty) {
                setNotice("Wrong email or password.");
            }
        }

    }, [loggedInUser]);


    return (
        <div className="app-login app-theme-white body-tabs-shadow">
            <div className="app-container">
                <div className="h-100">
                    <Row className="h-100 no-gutters">
                        <Col className="d-none d-lg-block" lg={5}>
                            <ICarousel />
                        </Col>
                        <Col
                            className="h-100 d-flex bg-white justify-content-center align-items-center"
                            md={12} lg={7} >
                            <Col className="mx-auto app-login-box" sm={12} md={10} lg={9}>
                                <div className="app-logo"><img src={logo} alt='logo' /> </div>
                                <h4 className="mb-0">
                                    <span className="d-block">Welcome back,</span>
                                    <span>Please sign in to your account.</span>
                                </h4>
                                {/* <h6 className="mt-3 mb-3">No account? <Link to={'/signup'} className="text-primary">Sign up now</Link></h6> */}
                                <div className="divider row"></div>
                                <div>
                                    <Form onSubmit={(e) => loginWithUsernameAndPassword(e)}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="position-relative">
                                                    <Form.Label htmlFor='email'>Email<span className="text-danger">*</span></Form.Label>
                                                    <Form.Control type="email"
                                                        name="email"
                                                        id="email"
                                                        placeholder="Email here..."
                                                        value={email}
                                                        className={dirty ? (formErrors.email ? "is-invalid" : "is-valid") : ""}
                                                        onChange={(e) => setEmail(e.target.value)} />
                                                    <p className="text-danger">{formErrors.email}</p>
                                                </Form.Group>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Group className="position-relative">
                                                    <Form.Label htmlFor='password'>Password<span className="text-danger">*</span></Form.Label>
                                                    <Form.Control type="password"
                                                        name="password"
                                                        id="password"
                                                        placeholder="Password here..."
                                                        className={dirty ? (formErrors.password ? "is-invalid" : "is-valid") : ""}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)} />
                                                    <p className="text-danger">{formErrors.password}</p>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        {/* <div className="position-relative form-check mt-3 mb-3">
                                            <input name="check" id="exampleCheck" type="checkbox" className="form-check-input" />
                                            <label htmlFor="exampleCheck" className="form-check-label">Keep me logged in</label>
                                        </div> */}
                                        {"" !== notice &&
                                            <Alert variant="warning">
                                                {notice}
                                            </Alert>
                                        }
                                        <div className="divider row"></div>
                                        <div className="mt-4 d-flex align-items-center">
                                            <div className="ml-auto">
                                                <Link to={'/forgot-password'} className="btn-lg btn btn-link">Recover Password</Link>

                                                <Button
                                                    variant="contained"
                                                    className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-lg"
                                                    type="submit"
                                                >
                                                    Login
                                                </Button>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
};

export default Login;
