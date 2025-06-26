import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const VerifySuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    useEffect(() => {
        if (token) {
            // Optional: decode token or save to localStorage
            try {
                const decoded = jwtDecode(token);
                console.log("Verified user:", decoded);

                // Store token to log in the user directly
                localStorage.setItem("token", token);

                // Redirect to dashboard or login
                setTimeout(() => {
                    navigate("/dashboard"); // or "/login"
                }, 2000);
            } catch (err) {
                console.error("Invalid token", err);
            }
        }
    }, [token, navigate]);

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h2 style={{ color: "green" }}>✅ Email Verified Successfully!</h2>
            <p>You will be redirected shortly...</p>
        </div>
    );
};

export default VerifySuccess;
