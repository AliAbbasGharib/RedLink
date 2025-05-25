import React, { useEffect, useState } from "react";
import {
    Container,
    Box,
    Typography,
    Avatar,
    Button,
    Chip,
    Paper,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import NoteIcon from "@mui/icons-material/Note";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useNavigate, useParams } from "react-router-dom";
import { Axios } from "../../../API/Axios"; // Make sure this is correctly imported
import { REQUESTBLOOD } from "../../../API/Api"; // Your API endpoint constant
import NavBar from "../NavBar";

export default function RequestBloodDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Axios.get(`${REQUESTBLOOD}/${id}`)
            .then((res) => {
                setRequest(res.data.request || res.data.data || res.data); // Adjust according to your API response shape
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch request details:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <>
                <NavBar />
                <Container sx={{ mt: 10, textAlign: "center" }}>
                    <CircularProgress />
                </Container>
            </>
        );
    }

    if (!request) {
        return (
            <>
                <NavBar />
                <Container sx={{ mt: 10, textAlign: "center" }}>
                    <Typography variant="h6" color="error">
                        Request not found.
                    </Typography>
                    <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }} startIcon={<ArrowBackIcon />}>
                        Back
                    </Button>
                </Container>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <Container maxWidth="sm" sx={{ mt: 10, mb: 5 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3 }}
                >
                    Back to Requests
                </Button>

                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Box display="flex" alignItems="center" mb={3}>
                        <Avatar
                            sx={{
                                bgcolor: "#d32f2f",
                                width: 56,
                                height: 56,
                                fontSize: 24,
                                fontWeight: "bold",
                            }}
                        >
                            {request.blood_type || "?"}
                        </Avatar>
                        <Box ml={3}>
                            <Typography variant="h5" fontWeight="bold">
                                {request.patient_name || "Unknown Patient"}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                Blood Type: {request.blood_type || "N/A"}
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="body1" gutterBottom>
                        <LocationOnIcon
                            fontSize="small"
                            sx={{ verticalAlign: "middle", mr: 1 }}
                        />
                        <strong>Location: </strong>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${request.donation_point}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#1976d2", textDecoration: "underline" }}
                        >
                            {request.donation_point}
                        </a>
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <PhoneIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>Contact Number: </strong> {request.contact_number || "N/A"}
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <BloodtypeIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>Required Amount of Blood: </strong> {request.quantity || "N/A"} units
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <PriorityHighIcon
                            fontSize="small"
                            sx={{ verticalAlign: "middle", mr: 1, color: "#f57c00" }}
                        />
                        <strong>Urgency: </strong> {request.urgency || "N/A"}
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <LocalShippingIcon
                            fontSize="small"
                            sx={{ verticalAlign: "middle", mr: 1, color: "#43a047" }}
                        />
                        <strong>Transportation: </strong> {request.transportation || "N/A"}
                    </Typography>

                    <Typography variant="body1" gutterBottom>
                        <NoteIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
                        <strong>Additional Notes: </strong>{" "}
                        {request.description || "No additional information."}
                    </Typography>

                    <Box mt={3}>
                        <Chip
                            label={request.done_status === "complete" ? "Complete" : "Non Complete"}
                            color={request.done_status === "complete" ? "success" : "warning"}
                            icon={<DoneAllIcon />}
                        />
                    </Box>

                    <Box display="flex" justifyContent="center" gap={2} mt={3}>
                        <Tooltip title="Contact via WhatsApp" arrow>
                            <Box
                                component="a"
                                href={`https://wa.me/${request.contact_number}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    bgcolor: "#25D366",
                                    borderRadius: "50%",
                                    p: 1.2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "box-shadow 0.2s",
                                    boxShadow: 2,
                                    "&:hover": {
                                        boxShadow: 6,
                                        bgcolor: "#1ebe57"
                                    }
                                }}
                            >
                                <WhatsAppIcon sx={{ color: "#fff", fontSize: 28 }} />
                            </Box>
                        </Tooltip>
                        <Tooltip title="Contact via Gmail" arrow>
                            <Box
                                component="a"
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${request.email}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    bgcolor: "#EA4335",
                                    borderRadius: "50%",
                                    p: 1.2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "box-shadow 0.2s",
                                    boxShadow: 2,
                                    "&:hover": {
                                        boxShadow: 6,
                                        bgcolor: "#c5221f"
                                    }
                                }}
                            >
                                <EmailIcon sx={{ color: "#fff", fontSize: 28 }} />
                            </Box>
                        </Tooltip>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}
