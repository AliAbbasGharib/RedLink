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
    Menu,
    Pagination,
    Alert,
    Snackbar,
    CircularProgress
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NavBar from "../NavBar";
import { Axios } from "../../../API/Axios";
import { REQUESTBLOOD, USER } from "../../../API/Api";
import { Link, useNavigate } from "react-router-dom";
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
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openAlert, setOpenAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const requestsPerPage = 12;

    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            Axios.get(USER)
                .then((response) => {
                    const userData = response.data; // Adjust if your user data shape is different
                    setUser(userData);
                })
                .catch((e) => {
                    console.error("Failed to fetch user:", e);
                });
        }
    }, []);

    const fetchRequests = (page) => {
        setLoading(true);
        // Pass page and limit as query params
        Axios.get(`${REQUESTBLOOD}?page=${page}&limit=${requestsPerPage}`)
            .then((response) => {
                // Assuming response.data looks like:
                // { requests: [...], totalPages: x, totalRequests: y }
                setRequests(response.data.requests || []);
                setTotalPages(response.data.totalPages || 1);
            })
            .catch((error) => {
                console.error("Error fetching blood requests:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Fetch requests every time currentPage changes
    useEffect(() => {
        fetchRequests(currentPage);
    }, [currentPage]);

    // Apply filtering client-side after fetching current page
    // (If you want server-side filtering, that requires API support)
    const filteredRequests = requests.filter((request) =>
        (request.donation_point?.toLowerCase() || "").includes(searchAddress.toLowerCase()) &&
        (searchBloodType === "" ||
            (request.blood_type?.toLowerCase() || "") === searchBloodType.toLowerCase())
    );

    const getStatusChip = (status) =>
        status === "complete"
            ? <Chip label="Complete" color="success" size="small" />
            : <Chip label="Non Complete" color="warning" size="small" />;

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

    const handleNavigation = () => {
        if (token) {
            navigate("/request-blood/add-request");
        } else {
            setOpenAlert(true);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    };

    const canManageRequest = (request) => {
        if (!user) return false;
        const requestUserId = typeof request.user_id === "object" ? request.user_id._id : request.user_id;
        return user.role === "1995" || requestUserId === user._id || requestUserId === user;
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
                            onClick={handleNavigation}
                            sx={{ color: "#fff", fontWeight: "bold", textTransform: "none", boxShadow: 2, px: 3 }}
                        >
                            Add Request
                        </Button>
                        <Snackbar
                            open={openAlert}
                            autoHideDuration={2000}
                            onClose={() => setOpenAlert(false)}
                            anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                            <Alert severity="warning" onClose={() => setOpenAlert(false)} sx={{ width: '100%' }}>
                                You must register before accessing this page!
                            </Alert>
                        </Snackbar>
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

                    {loading ? (
                        <Box display="flex" justifyContent="center" my={5}>
                            <CircularProgress color="error" />
                        </Box>
                    ) : (
                        <Box>
                            <Grid container spacing={4}>
                                {filteredRequests.length === 0 && (
                                    <Typography variant="body1" align="center" width="100%">
                                        No requests found.
                                    </Typography>
                                )}
                                {filteredRequests.map((request) => (
                                    <Grid item xs={12} sm={5} md={4} key={request._id} sx={{ display: "flex" }}>
                                        <Card
                                            elevation={3}
                                            sx={{
                                                position: "relative",
                                                borderRadius: 3,
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                height: "100%",
                                                transition: "0.3s",
                                                backgroundColor: request.done_status === "complete" ? "#f1f8e9" : "#fff",
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                },
                                            }}
                                        >
                                            {canManageRequest(request) && (
                                                <IconButton
                                                    aria-label="options"
                                                    onClick={(e) => handleMenuOpen(e, request)}
                                                    sx={{ position: "absolute", top: 8, right: 8 }}
                                                >
                                                    <MoreVertIcon />
                                                </IconButton>
                                            )}

                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Box display="flex" alignItems="center" mb={2}>
                                                    <Avatar sx={{ bgcolor: "#d32f2f", width: 48, height: 48 }}>
                                                        {request.blood_type}
                                                    </Avatar>
                                                    <Box ml={2}>
                                                        <Typography fontWeight="bold">
                                                            {request.patient_name}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Typography style={{ width: "300px" }} variant="body2" mb={1}>
                                                    <strong>Location:</strong>{" "}
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${request.donation_point}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: "#1976d2", textDecoration: "underline" }}
                                                    >
                                                        {request.donation_point}
                                                    </a>
                                                </Typography>

                                                <Typography variant="body2" component="div" mb={1}>
                                                    <strong>Status:</strong> {getStatusChip(request.done_status)}
                                                </Typography>
                                            </CardContent>

                                            <Box px={2} pb={2} textAlign="right">
                                                <Button variant="contained" size="small" color="primary">
                                                    <Link
                                                        style={{ textDecoration: "none", color: "#fff" }}
                                                        to={`${request._id}`}
                                                    >
                                                        View Details
                                                    </Link>
                                                </Button>
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Box mt={4} display="flex" justifyContent="center">
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={(e, value) => setCurrentPage(value)}
                                        color="primary"
                                        shape="rounded"
                                    />
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            </Container>

            {/* Menu Options */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl && selectedReq && canManageRequest(selectedReq))}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {selectedReq && (
                    <Box>
                        <MenuItem>
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
                    </Box>
                )}
            </Menu>
        </>
    );
}
