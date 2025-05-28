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
        latitude: null,
        longitude: null,
        location: { type: "Point", coordinates: [] },
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [detectingLocation, setDetectingLocation] = useState(false);

    const focus = useRef(null);
    const nav = useNavigate();
    const cookies = Cookie();

    useEffect(() => {
        focus.current.focus();
        detectLocation(); // detect location on component mount
    }, []);

    // Reverse geocode with OpenStreetMap Nominatim
    const reverseGeocode = async (lat, lon) => {
        try {
            const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
                params: {
                    format: "json",
                    lat,
                    lon,
                    zoom: 18,
                    addressdetails: 1,
                },
            });
            const { city, town, village, country } = res.data.address;
            const locationName = city || town || village || "";
            return `${locationName}, ${country}`;
        } catch (error) {
            console.warn("Reverse geocode error:", error);
            return "";
        }
    };

    // Detect user location & update address field
    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const address = await reverseGeocode(latitude, longitude);
                setUsers(prev => ({
                    ...prev,
                    latitude,
                    longitude,
                    address: address || prev.address,
                }));
                setDetectingLocation(false);
            },
            (error) => {
                alert("Unable to retrieve your location. Please enter your address manually.");
                setDetectingLocation(false);
            }
        );
    };

    function handleChange(e) {
        setUsers({
            ...users,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Extract latitude and longitude
            const { latitude, longitude, ...rest } = users;

            // Prepare payload with location GeoJSON
            const payload = {
                ...rest,
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude], // longitude first
                },
            };

            await axios.post(REGISTER, payload)
                .then(res => {
                    const token = res.data.token;
                    cookies.set("token", token);
                    nav('/');
                });
        }
        catch (error) {
            setError(error?.response?.data?.message || "Registration failed");
        }
        finally {
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
                        {/* Show detected coordinates for debugging */}
                        {(users.latitude !== null && users.longitude !== null) && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                Detected Location: {users.latitude.toFixed(5)}, {users.longitude.toFixed(5)}
                            </Typography>
                        )}

                        <Button
                            type="button"
                            variant="outlined"
                            color="primary"
                            fullWidth
                            sx={{ mt: 1, mb: 3 }}
                            onClick={detectLocation}
                            disabled={detectingLocation}
                        >
                            {detectingLocation ? "Detecting Location..." : "Detect My Location"}
                        </Button>

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
                            sx={redFocusSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            sx={{
                                mt: 3,
                                backgroundColor: "red",
                                fontWeight: "bold",
                                ":hover": {
                                    backgroundColor: "darkred",
                                },
                            }}
                        >
                            Register
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}
