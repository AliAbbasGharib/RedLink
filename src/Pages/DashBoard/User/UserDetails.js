import { useEffect, useState } from "react";
import { Axios } from "../../../API/Axios";
import { USER } from "../../../API/Api";
import { useParams } from "react-router-dom";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Divider,
    Chip,
    Tooltip,
    Stack
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import WcIcon from '@mui/icons-material/Wc';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function UserDetails() {
    const [user, setUser] = useState({});
    const { id } = useParams();

    useEffect(() => {
        Axios.get(`${USER}/${id}`)
            .then((response) => {
                setUser(response.data.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the user data!", error);
            });
    }, [id]);

    // Helper for role display
    const getRole = (role) => {
        switch (role?.toString()) {
            case "1995": return "Admin";
            case "1996": return "Hospital";
            case "1999": return "Patient";
            case "2001": return "Donor";
            default: return "Unknown";
        }
    };

    return (
        <Box
            sx={{
                height: "100vh", // changed from minHeight
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // background: "linear-gradient(135deg, #e3e9f7 60%, #f5f6fa 100%)",
                p: 2,
                overflowX: "hidden"
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    minWidth: 260,
                    boxShadow: 12,
                    borderRadius: 5,
                    p: 2,
                    background: "linear-gradient(135deg, #fff 70%, #e3e9f7 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1px solid #e0e0e0"
                }}
            >
                <CardContent sx={{ width: "100%", p: 0 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        <Avatar
                            sx={{
                                bgcolor: "#1976d2",
                                width: 90,
                                height: 90,
                                mb: 1,
                                boxShadow: 4,
                                border: "3px solid #fff"
                            }}
                        >
                            <PersonIcon fontSize="large" />
                        </Avatar>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                            noWrap
                            sx={{ maxWidth: "100%", textOverflow: "ellipsis" }}
                        >
                            {user.name}
                        </Typography>
                        <Chip
                            label={`ID: ${id}`}
                            size="small"
                            color="default"
                            sx={{ mb: 1, bgcolor: "#e3e9f7", fontWeight: 500, maxWidth: "100%" }}
                        />
                        <Chip
                            label={getRole(user.role)}
                            color="primary"
                            variant="outlined"
                            sx={{ mb: 1, fontWeight: 500, maxWidth: "100%" }}
                        />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={1.2} mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <EmailIcon color="action" fontSize="small" />
                            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                                <strong>Email:</strong> {user.email}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <PhoneIcon color="action" fontSize="small" />
                            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                                <strong>Phone:</strong> {user.phone_number}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <BloodtypeIcon color="error" fontSize="small" />
                            <Typography variant="body2">
                                <strong>Blood Type:</strong> {user.blood_type}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <WcIcon color="action" fontSize="small" />
                            <Typography variant="body2">
                                <strong>Gender:</strong> {user.gender}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <CakeIcon color="secondary" fontSize="small" />
                            <Typography variant="body2">
                                <strong>Date of Birth:</strong> {user.date_of_birth?.slice(0, 10) || "N/A"}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <CalendarMonthIcon color="primary" fontSize="small" />
                            <Typography variant="body2">
                                <strong>Last Donation:</strong> {user.last_donation_date?.slice(0, 10) || "N/A"}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <LocationOnIcon color="action" fontSize="small" />
                            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                                <strong>Address:</strong> {user.address}
                            </Typography>
                        </Box>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" flexDirection="column" alignItems="center" mt={1}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Contact User
                        </Typography>
                        <Box display="flex" justifyContent="center" gap={2}>
                            <Tooltip title="Contact via WhatsApp" arrow>
                                <Box
                                    component="a"
                                    href={`https://wa.me/${user.phone_number}`}
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
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`}
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
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}