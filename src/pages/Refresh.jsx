import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useEffect } from "react";
import { loginUser } from "../store/api-db";
import { useDispatch, useSelector } from 'react-redux';

const Refresh = () => {
    const module = 'user';
    const navigate = useNavigate();
    const loggedInUser = useSelector((state) => state.api.loggedInUser)

    const { setToken } = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            dispatch(loginUser({ module: module, data: { refreshToken: refreshToken } }));
        }
        else{
            setToken();
            navigate("/", { replace: true });
        }
    }, []);

    useEffect(() => {
        if (loggedInUser) {
            setToken(loggedInUser);
            navigate("/", { replace: true });
        }
    }, [loggedInUser]);


    return (
        <div className="app-login app-theme-white body-tabs-shadow">
            <div className="app-container">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary m-5" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Refresh;
