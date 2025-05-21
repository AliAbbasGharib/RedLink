import { Outlet, Navigate, useNavigate } from "react-router-dom";
import Cookie from 'cookie-universal';
import { useEffect, useState } from "react";
import { USER } from "../../API/Api";
import Err403 from "./403";
import LoadingSubmit from "../../Components/Loading";
import { Axios } from "../../API/Axios";
export default function RequireAuth({ allowedRole }) {
    const [user, setUser] = useState("");
    const navigate = useNavigate();
    // token and Cookie
    const cookie = Cookie();
    const token = cookie.get('token');
    useEffect(() => {
        Axios.get(USER)
            .then(res => {
                setUser(res.data);
            }).catch(() => {
                navigate('/login', { replace: true });
            })
    }, [token, navigate]);


    return token ? (user === "" ? <LoadingSubmit /> :
        allowedRole.includes(user.role) ? (<Outlet />) : (<Err403 role={user.role} />)) :
        <Navigate to={'/login'} replace={true} />
}