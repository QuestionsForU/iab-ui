import {  Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { useEffect } from "react";

const Home = () => {
    const { token ,setToken } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate();

    useEffect(() => {
        if (token && token.logout) {
            setToken();
            navigate("/", { replace: true });
        }
    }, [token]);

    useEffect(() => {
            const r = searchParams.get('r')
            if(r){
                navigate(-1);
            }
        },[searchParams]);

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