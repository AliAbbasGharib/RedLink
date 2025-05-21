import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Grid,
    Button,
    Chip,
    Container,
    TextField,
    MenuItem,
    IconButton,
    Menu
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NavBar from "../NavBar";
import { Axios } from "../../../API/Axios";
import { REQUESTBLOOD, USER } from "../../../API/Api";
import { Link } from "react-router-dom";
import Cookie from "cookie-universal";

const cookies = Cookie();
const token = cookies.get("token");

export default function RequestBloodCardList() {
    const bloodTypes = ["", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

    const [searchAddress, setSearchAddress] = useState("");
    const [searchBloodType, setSearchBloodType] = useState("");
    const [requests, setRequests] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReq, setSelectedReq] = useState(null);
    const [user, setUser] = useState("");

    useEffect(() => {
        if (token) {
            try {
             Axios.get(USER)
             .then((response) => {
                const userData = response.data._id;
                setUser(userData);
                console.log("User data:", userData);
             })
            } catch (e) {
                console.error("Failed to parse user token:", e);
            }
        }
    }, []);

    useEffect(() => {
        Axios.get(REQUESTBLOOD)
            .then((response) => {
                setRequests(response.data.requests);
            })
            .catch((error) => {
                console.error("Error fetching blood requests:", error);
            });
    }, []);

    const filteredRequests = requests.filter((request) =>
        (request.donation_point?.toLowerCase() || "").includes(searchAddress.toLowerCase()) &&
        (searchBloodType === "" ||
            (request.blood_type?.toLowerCase() || "") === searchBloodType.toLowerCase())
    );

    const getStatusChip = (status) => {
        return status === "complete"
            ? <Chip label="Complete" color="success" size="small" />
            : <Chip label="Non Complete" color="warning" size="small" />;
    };

    const handleMenuOpen = (event, req) => {
        setAnchorEl(event.currentTarget);
        setSelectedReq(req);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedReq(null);
    };

    const handleComplete = async (req) => {
        try {
            await Axios.put(`${REQUESTBLOOD}/status/${req._id}`, { done_status: "complete" });
            setRequests((prev) =>
                prev.map((r) => (r._id === req._id ? { ...r, done_status: "complete" } : r))
            );
        } catch {
            alert("Failed to mark as complete.");
        }
        handleMenuClose();
    };

    const handleDelete = async (req) => {
        try {
            await Axios.delete(`${REQUESTBLOOD}/${req._id}`);
            setRequests((prev) => prev.filter((r) => r._id !== req._id));
        } catch {
            alert("Failed to delete request.");
        }
        handleMenuClose();
    };

    const handleViewDetails = (id) => {
        alert(`View details for request ID: ${id}`);
        handleMenuClose();
    };

    const canManageRequest = (request) => {
        if (!user) return false;
        const requestUserId = typeof request.user_id === "object" ? request.user_id._id : request.user_id;
        return (
            user.role === "1995" ||
            requestUserId === user
        );
    };

    return (
        <>
            <NavBar />
            <Box mt={10} />
            <Container maxWidth="lg">
                <Box p={3}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Blood Donation Requests
                    </Typography>

                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button
                            variant="contained"
                            color="error"
                            component={Link}
                            to="/request-blood/add-request"
                            sx={{
                                color: "#fff",
                                fontWeight: "bold",
                                textTransform: "none",
                                boxShadow: 2,
                                px: 3,
                            }}
                        >
                            Add Request
                        </Button>
                    </Box>

                    <Box display="flex" gap={3} mb={3} flexDirection={{ xs: "column", sm: "row" }}>
                        <TextField
                            label="Search by Address"
                            variant="outlined"
                            value={searchAddress}
                            onChange={(e) => setSearchAddress(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Search by Blood Type"
                            variant="outlined"
                            value={searchBloodType}
                            onChange={(e) => setSearchBloodType(e.target.value)}
                            fullWidth
                        >
                            {bloodTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type === "" ? "All Types" : type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Grid container spacing={6}>
                        {filteredRequests.map((request) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={request._id}>
                                <Card
                                    elevation={3}
                                    sx={{
                                        width: "100%",
                                        maxWidth: 420,
                                        position: "relative",
                                        bgcolor:
                                            request.done_status === "complete"
                                                ? "#e8f5e9"
                                                : "background.paper",
                                        transition: "background 0.3s",
                                    }}
                                >
                                    {canManageRequest(request) && (
                                        <IconButton
                                            aria-label="more"
                                            onClick={(e) => handleMenuOpen(e, request)}
                                            sx={{ position: "absolute", top: 8, right: 8 }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    )}
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: "#d32f2f",
                                                    width: 56,
                                                    height: 56,
                                                    fontWeight: "bold",
                                                    fontSize: 20,
                                                }}
                                            >
                                                {request.blood_type}
                                            </Avatar>
                                            <Box ml={2}>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {request.patient_name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {request.hospital_name}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" mb={1}>
                                            <strong>Location:</strong> {request.donation_point}
                                        </Typography>
                                        <Typography variant="body1" mb={1}>
                                            <strong>Status:</strong>{" "}
                                            {getStatusChip(request.done_status)}
                                        </Typography>
                                        <Box mt={2} textAlign="right">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                onClick={() => handleViewDetails(request._id)}
                                            >
                                                View Details
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl && selectedReq && canManageRequest(selectedReq))}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {selectedReq && (
                    <>
                        <MenuItem onClick={() => handleViewDetails(selectedReq._id)}>
                            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                            View Details
                        </MenuItem>
                        <MenuItem onClick={() => handleComplete(selectedReq)}>
                            <DoneIcon fontSize="small" sx={{ mr: 1 }} />
                            Mark as Complete
                        </MenuItem>
                        <MenuItem onClick={() => handleDelete(selectedReq)} sx={{ color: "error.main" }}>
                            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                            Delete
                        </MenuItem>
                    </>
                )}
            </Menu>
        </>
    );
}
