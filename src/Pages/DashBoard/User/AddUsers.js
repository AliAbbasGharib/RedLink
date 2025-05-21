import { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Alert,
    Typography,
    Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingSubmit from "../../../Components/Loading";
import { ADDUSER } from "../../../API/Api";
import { Axios } from "../../../API/Axios";

export default function AddUser() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        date_of_birth: '',
        gender: '',
        blood_type: '',
        address: '',
        last_donation_date: '',
        role: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const focus = useRef(null);
    const nav = useNavigate();

    useEffect(() => {
        if (focus.current) focus.current.focus();
    }, []);

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value });
        setError(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await Axios.post(ADDUSER, user);
            nav("/dashboard/users");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
            setLoading(false);
        }
    }

    // Custom style for red focus border only when input is focused
    const redInputSx = {
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#b71c1c',
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#b71c1c',
        },
        background: "#fff"
    };

    return (
        <Box sx={{ height: "100%", minHeight: 0, p: 0, m: 0, display: "flex", flexDirection: "column", flex: 1 }}>
            {loading && <LoadingSubmit />}
            <Box
                component={Paper}
                elevation={3}
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 3,
                    boxShadow: 4,
                    background: "#fff",
                    width: "100%",
                    height: "100%",
                    p: { xs: 2, sm: 4 },
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={2} align="center">
                    Add User
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ width: "100%", maxWidth: 500, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <TextField
                        label="Full Name"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        inputRef={focus}
                        required
                        fullWidth
                        margin="normal"
                        sx={redInputSx}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        sx={redInputSx}
                    />
                    <TextField
                        label="Phone Number"
                        name="phone_number"
                        value={user.phone_number}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={redInputSx}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={user.password}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        sx={redInputSx}
                    />
                    <TextField
                        label="Date of Birth"
                        name="date_of_birth"
                        type="date"
                        value={user.date_of_birth}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        sx={redInputSx}
                    />
                    <FormControl fullWidth margin="normal" required sx={redInputSx}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                            name="gender"
                            value={user.gender}
                            label="Gender"
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select Gender</MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal" required sx={redInputSx}>
                        <InputLabel>Blood Type</InputLabel>
                        <Select
                            name="blood_type"
                            value={user.blood_type}
                            label="Blood Type"
                            onChange={handleChange}
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
                        </Select>
                    </FormControl>
                    <TextField
                        label="Address"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        sx={redInputSx}
                    />
                    <TextField
                        label="Last Donation Date"
                        name="last_donation_date"
                        type="date"
                        value={user.last_donation_date}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        sx={redInputSx}
                    />
                    <FormControl fullWidth margin="normal" required sx={redInputSx}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            name="role"
                            value={user.role}
                            label="Role"
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select Role</MenuItem>
                            <MenuItem value={1995}>Admin</MenuItem>
                            <MenuItem value={1996}>Hospital</MenuItem>
                            <MenuItem value={1999}>Patient</MenuItem>
                            <MenuItem value={2001}>Donor</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="error"
                        type="submit"
                        fullWidth
                        sx={{
                            mt: 2,
                            boxShadow: "none",
                            fontWeight: "bold",
                            '&:hover': {
                                backgroundColor: "#fff",
                                color: "#b71c1c",
                            }
                        }}
                        disabled={
                            !user.name ||
                            !user.email ||
                            !user.password ||
                            !user.gender ||
                            !user.blood_type ||
                            !user.address ||
                            !user.role
                        }
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}