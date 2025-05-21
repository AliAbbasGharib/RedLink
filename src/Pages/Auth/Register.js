import axios from "axios";
import { useEffect, useRef, useState } from 'react';
import { REGISTER } from '../../API/Api';
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
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
    MenuItem,
    InputAdornment
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import WcIcon from "@mui/icons-material/Wc";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

export default function Register() {
    const [users, setUsers] = useState({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        date_of_birth: "",
        gender: "",
        blood_type: "",
        address: "",
        last_donation_date: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const focus = useRef(null);
    useEffect(() => {
        focus.current.focus();
    }, []);
    const nav = useNavigate();
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
            await axios.post(REGISTER, users)
                .then(res => {
                    const token = res.data.token;
                    cookies.set("token", token);
                    nav('/');
                    setLoading(false);
                });
        }
        catch (error) {
            setError(error?.response?.data?.message || "Registration failed");
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
            {loading && <LoadingSubmit />}
            <Container
                maxWidth="sm"
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    mt: { xs: 8, md: 12 }
                }}
            >
                <Paper elevation={4} sx={{ p: 4, borderRadius: 4, width: "100%" }}>
                    <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                        Register
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <TextField
                            label="Full Name"
                            name="name"
                            value={users.name}
                            onChange={handleChange}
                            required
                            fullWidth
                            margin="normal"
                            inputRef={focus}
                            sx={redFocusSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={users.email}
                            onChange={handleChange}
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
                            label="Phone Number"
                            name="phone_number"
                            value={users.phone_number}
                            onChange={handleChange}
                            required
                            fullWidth
                            margin="normal"
                            sx={redFocusSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PhoneIphoneIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Date of Birth"
                            name="date_of_birth"
                            type="date"
                            value={users.date_of_birth}
                            onChange={handleChange}
                            required
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            sx={redFocusSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarMonthIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            select
                            label="Gender"
                            name="gender"
                            value={users.gender}
                            onChange={handleChange}
                            required
                            fullWidth
                            margin="normal"
                            sx={redFocusSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <WcIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem value="">Select Gender</MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </TextField>
                        <TextField
                            select
                            label="Blood Type"
                            name="blood_type"
                            value={users.blood_type}
                            onChange={handleChange}
                            required
                            fullWidth
                            margin="normal"
                            sx={redFocusSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BloodtypeIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem value="">Select Blood Type</MenuItem>
                            <MenuItem value="A+">A+</MenuItem>
                            <MenuItem value="A-">A-</MenuItem>
                            <MenuItem value="B+">B+</MenuItem>
                            <MenuItem value="B-">B-</MenuItem>
                            <MenuItem value="AB+">AB+</MenuItem>
                            <MenuItem value="AB-">AB-</MenuItem>
                            <MenuItem value="O+">O+</MenuItem>
                            <MenuItem value="O-">O-</MenuItem>
                        </TextField>
                        <TextField
                            label="Address"
                            name="address"
                            value={users.address}
                            onChange={handleChange}
                            required
                            fullWidth
                            margin="normal"
                            sx={redFocusSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <HomeIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Last Donation Date"
                            name="last_donation_date"
                            type="date"
                            value={users.last_donation_date}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            sx={redFocusSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarMonthIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
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
                            }}
                            helperText={users.password.length > 0 && users.password.length < 8 ? "Password must be at least 8 characters" : ""}
                            error={users.password.length > 0 && users.password.length < 8}
                        />
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="error"
                            fullWidth
                            sx={{ mt: 3, borderRadius: 3, fontWeight: 600, py: 1.2 }}
                        >
                            Register
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}