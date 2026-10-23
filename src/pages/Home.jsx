import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useEffect } from "react";

const Home = () => {
    const { token ,setToken } = useAuth();
    const [searchParams] = useSearchParams()
    const navigate = useNavigate();
    const redirect = searchParams.get('r');

    useEffect(() => {
        if (token && token.logout) {
            setToken();
            navigate("/", { replace: true });
        }
    }, [navigate, setToken, token]);

    useEffect(() => {
        if (redirect) {
            navigate(-1);
        }
    }, [navigate, redirect]);

    return (
        <>
            {token && !token.logout ?
                <Navigate to="./home" />
                :
                <Navigate to="./logout" />
            }
        </>
    )
}

export default Home