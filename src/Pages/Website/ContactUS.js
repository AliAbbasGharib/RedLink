import { useState, useRef, useEffect } from "react";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    InputAdornment,
    Alert
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import SubjectIcon from "@mui/icons-material/Subject";
import MessageIcon from "@mui/icons-material/Message";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const focus = useRef(null);
    useEffect(() => {
        focus.current.focus();
    }, []);

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

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        // Simulate API call
        setTimeout(() => {
            if (form.name && form.email && form.subject && form.message) {
                setSuccess("Your message has been sent!");
                setForm({ name: "", email: "", subject: "", message: "" });
            } else {
                setError("Please fill in all fields.");
            }
            setLoading(false);
        }, 1200);
    }

    return (
        <>
            <NavBar />
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
                        Contact Us
                    </Typography>
                    <Typography align="center" color="text.secondary" sx={{ mb: 2 }}>
                        We'd love to hear from you! Fill out the form below and we'll get back to you soon.
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <TextField
                            label="Full Name"
                            name="name"
                            value={form.name}
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
                            value={form.email}
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
                            label="Subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            required
                            fullWidth
                            margin="normal"
                            sx={redFocusSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SubjectIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            fullWidth
                            margin="normal"
                            multiline
                            minRows={4}
                            sx={redFocusSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MessageIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                {success}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="error"
                            fullWidth
                            disabled={loading}
                            sx={{ mt: 3, borderRadius: 3, fontWeight: 600, py: 1.2 }}
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </Button>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </>
    );
}