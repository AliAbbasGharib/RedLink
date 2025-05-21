import { Outlet } from "react-router-dom";
import Cookie from "cookie-universal";
import { useEffect } from "react";

export default function RequireBack() {
    const cookie = Cookie();
    const token = cookie.get('token');

    useEffect(() => {
        if (token) {
            window.location.href = "/";
        }
    }, [token]);
    return token ? "/" : <Outlet />;
}
