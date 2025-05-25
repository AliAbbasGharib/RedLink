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
import { useNavigate, useParams } from "react-router-dom";
import LoadingSubmit from "../../../Components/Loading";
import { USER } from "../../../API/Api";
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
        role: '',
        donation_point_lat: null,
        donation_point_lng: null,
        location: { type: "Point", coordinates: [] },
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const focus = useRef(null);
    const nav = useNavigate();
    const donationPointRef = useRef(null);
    const autocompleteRef = useRef(null);
    function loadScript(url, callback) {
        const existingScript = document.getElementById("googleMaps");
        if (!existingScript) {
            const script = document.createElement("script");
            script.src = url;
            script.id = "googleMaps";
            script.async = true;
            script.defer = true;
            script.onload = callback;
            document.body.appendChild(script);
        } else {
            callback();
        }
    }
    useEffect(() => {
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=AIzaSyAxjQtpZsmQISacL74_I90QUGElgEre69M&libraries=places`,
            () => {
                if (window.google && window.google.maps) {
                    autocompleteRef.current = new window.google.maps.places.Autocomplete(
                        donationPointRef.current,
                        {
                            types: ["establishment", "geocode"],
                            componentRestrictions: { country: "lb" },
                            fields: ["name", "formatted_address", "geometry"],
                        }
                    );

                    autocompleteRef.current.addListener("place_changed", () => {
                        const place = autocompleteRef.current.getPlace();
                        if (place && (place.name || place.formatted_address)) {
                            const locationName = `${place.name || ""} - ${place.formatted_address || ""}`.trim();
                            const lat = place.geometry?.location.lat();
                            const lng = place.geometry?.location.lng();

                            setUser((prev) => ({
                                ...prev,
                                address: locationName,
                                donation_point_lat: lat,
                                donation_point_lng: lng,
                                location: {
                                    type: "Point",
                                    coordinates: [lng, lat], // GeoJSON format
                                },
                            }));
                            setError(null);
                        }
                    });
                }
            }
        );
    }, []);

    const { id } = useParams();
    useEffect(() => {
        setLoading(true);
        Axios.get(`${USER}/${id}`)
            .then(resp => {
                setUser({
                    name: resp.data.data.name,
                    email: resp.data.data.email,
                    phone_number: resp.data.data.phone_number,
                    role: resp.data.data.role,
                    gender: resp.data.data.gender,
                    date_of_birth: resp.data.data.date_of_birth?.slice(0, 10) || '',
                    address: resp.data.data.address,
                    blood_type: resp.data.data.blood_type,
                    last_donation_date: resp.data.data.last_donation_date?.slice(0, 10) || '',
                    donation_point_lat: resp.data.data.donation_point_lat || null,
                    donation_point_lng: resp.data.data.donation_point_lng || null,
                });
                setLoading(false);
            })
            .catch(() => nav("/dashbaord/users/pages/404", { replace: true }));
    }, [nav, id])

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
            await Axios.put(`${USER}/update/${id}`, user);
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

                    p: { xs: 2, sm: 4 },
                }}
            >
                <Typography variant="h5" fontWeight="bold" mb={2} align="center">
                    Update User
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
                        label="*Address"
                        name="address"
                        placeholder="Start typing a location..."
                        value={user.address || ""}
                        onChange={handleChange}
                        inputRef={donationPointRef}
                        fullWidth
                        required
                        sx={{ mb: 1 }}
                        helperText="Choose a location from the suggestions."
                    />
                    {user.address && (
                        <Box mb={2}>
                            <Typography fontWeight="bold" mb={1}>Map Preview</Typography>
                            <Box sx={{ height: 300, width: "100%", borderRadius: 2, overflow: "hidden" }}>
                                <iframe
                                    title="Google Maps Location"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={
                                        user.donation_point_lat && user.donation_point_lng
                                            ? `https://www.google.com/maps/embed/v1/view?key=AIzaSyAxjQtpZsmQISacL74_I90QUGElgEre69M&center=${user.donation_point_lat},${user.donation_point_lng}&zoom=16`
                                            : `https://www.google.com/maps/embed/v1/place?key=AIzaSyAxjQtpZsmQISacL74_I90QUGElgEre69M&q=${encodeURIComponent(user.address)}`
                                    }
                                />
                            </Box>
                        </Box>
                    )}

                    {/* Debug Coordinates Display */}
                    {user.location?.coordinates?.length > 0 && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Coordinates: {user.location.coordinates[1]} (lat), {user.location.coordinates[0]} (lng)
                        </Alert>
                    )}

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
         
                    >
                        Update 
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}


