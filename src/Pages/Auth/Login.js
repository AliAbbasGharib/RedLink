import axios from "axios";
import { useEffect, useRef, useState } from 'react';
import { LOGIN } from '../../API/Api';
import Cookie from "cookie-universal";
import LoadingSubmit from "../../Components/Loading";
import NavBar from "../Website/NavBar";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Alert,
    InputAdornment,
    IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
    const [users, setUsers] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const focus = useRef(null);
    useEffect(() => {
        focus.current.focus();
    }, []);

    const cookies = Cookie();
    function handleChange(e) {
        setUsers({
            ...users,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(LOGIN, users)
                .then(res => {
                    const role = res.data.user.role;
                    const token = res.data.token;
                    cookies.set("token", token);           

            setLoading(false);
            if (role === "1995") {
                window.location.pathname = `/dashboard`;
            } else {
                window.location.pathname = `/`;
            }
        });
    }
        catch (error) {
        setError(error);
        setLoading(false);
    }
}

// Custom sx for red focus border
const redFocusSx = {
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: "red",
        },
    },
    "& label.Mui-focused": {
        color: "red",
    },
};

return (
    <>
        <NavBar />
        {loading && <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999,
            }}
        >
            <LoadingSubmit />
        </Box>}


        <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, width: "100%" }}>
                <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Enter your email..."
                        value={users.email}
                        onChange={handleChange}
                        inputRef={focus}
                        required
                        fullWidth
                        margin="normal"
                        sx={redFocusSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password..."
                        value={users.password}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        inputProps={{ minLength: 8 }}
                        sx={redFocusSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword((show) => !show)}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {error?.status === 400 && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            Email or Password is Wrong!
                        </Alert>
                    )}
                    {error?.status === 403 && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error.response.data.message}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        fullWidth
                        sx={{ mt: 3, borderRadius: 3, fontWeight: 600, py: 1.2 }}
                    >
                        Login
                    </Button>

                    {/* Register link message */}
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Don't have an account?{" "}
                        <a href="/register" style={{ color: "#d32f2f", textDecoration: "none", fontWeight: "bold" }}>
                            Register here
                        </a>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    </>
);
}
