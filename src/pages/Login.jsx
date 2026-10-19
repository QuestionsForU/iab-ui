import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useState, useEffect } from "react";
import { loginUser } from "../store/api-db";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
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
    const [showPassword, setShowPassword] = useState(false);
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

    }, [loggedInUser, dirty, navigate, setToken]);


    return (
        <div className="avilis-auth-page">
            <header className="avilis-auth-header">
                <Link to="/login" aria-label="ZoryaLMS sign in">
                    <img src={logo} alt="ZoryaLMS" />
                </Link>
            </header>
            <main className="avilis-auth-main">
                <h1>Sign in to ZoryaLMS</h1>
                <div className="avilis-auth-card">
                    <h2>Use your account to log in</h2>
                    <p className="text-muted">Secure access to samples, results, and laboratory workflows.</p>
                    <hr />
                    <Form onSubmit={loginWithUsernameAndPassword}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <InputGroup>
                                <InputGroup.Text aria-hidden="true"><i className="fa-solid fa-user" /></InputGroup.Text>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    autoComplete="username"
                                    placeholder="Email"
                                    value={email}
                                    isInvalid={dirty && Boolean(formErrors.email)}
                                    onChange={event => setEmail(event.target.value)}
                                />
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">{formErrors.email}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <InputGroup.Text aria-hidden="true"><i className="fa-solid fa-lock" /></InputGroup.Text>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    value={password}
                                    isInvalid={dirty && Boolean(formErrors.password)}
                                    onChange={event => setPassword(event.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    title={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword(current => !current)}
                                >
                                    <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} aria-hidden="true" />
                                </Button>
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
                        </Form.Group>
                        {notice &&
                            <Alert variant="warning" role="alert">{notice}</Alert>
                        }
                        <Button type="submit" className="w-100 avilis-auth-submit">
                            Sign in
                        </Button>
                        <div className="text-end mt-3">
                            <Link to="/forgot-password">Forgot your password?</Link>
                        </div>
                    </Form>
                </div>
            </main>
            <footer className="avilis-auth-footer">
                <span>ZoryaLMS — Zorya Laboratory Management System · © {new Date().getFullYear()}</span>
                <a href="https://www.zorya.co.in/" target="_blank" rel="noopener noreferrer">ZoryaLMS</a>
                <span>All rights reserved</span>
            </footer>
        </div>
    )
};

export default Login;
