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
import MessageIcon from "@mui/icons-material/Message";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Axios } from "../../API/Axios";
import { SENDCONTACT } from "../../API/Api";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        phone_number: "",
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

   async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
           await Axios.post(SENDCONTACT, form)
                .then(resp => {
                    console.log(resp)
                    setForm(resp.data);
                    setSuccess("Your message has been sent!");
                    setLoading(false);
                });
        } catch (err) {
            if(err.status === 429)
            {
                setError("Send Another message after 30 min");
            }
            
        }





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
                            label="Phone Number "
                            name="phone_number"
                            type="number"
                            value={form.phone_number}
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