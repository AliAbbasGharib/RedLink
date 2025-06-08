import React, { useEffect, useState } from "react";
import { Axios } from "../../../API/Axios";
import { REQUESTBLOOD } from "../../../API/Api";
import {
    Box,
    Typography,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
    Chip,
    Divider,
    ListSubheader,
    Select,
    FormControl,
    InputLabel,
    Pagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link, useNavigate } from "react-router-dom";

function GetRequestBlood() {
    const [searchName, setSearchName] = useState("");
    const [searchBloodType, setSearchBloodType] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmRequest, setConfirmRequest] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReq, setSelectedReq] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRequests, setTotalRequests] = useState(0);

    const rowsPerPage = 12;
    const nav = useNavigate();

    // Fetch blood requests from server with filters & pagination
    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                params.append("page", currentPage);
                params.append("limit", rowsPerPage);

                if (searchName) params.append("name", searchName);
                if (searchBloodType) params.append("blood_type", searchBloodType);
                if (searchLocation) params.append("location", searchLocation);

                const response = await Axios.get(`${REQUESTBLOOD}?${params.toString()}`);

                const data = response.data || {};
                setRequests(Array.isArray(data.requests) ? data.requests : []);
                setTotalRequests(data.totalRequests || 0);
            } catch (err) {
                setError("Error fetching blood requests.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [currentPage, searchName, searchBloodType, searchLocation]);

    // Navigate to detailed view page
    const handleView = (req) => nav(`/request-blood/${req._id}`);

    // Delete a request
    const handleDelete = async (req) => {
        try {
            await Axios.delete(`${REQUESTBLOOD}/${req._id}`);
            // After delete, refetch current page or update state locally:
            setRequests((prev) => prev.filter((r) => r._id !== req._id));
            setConfirmRequest(null);
        } catch {
            alert("Failed to delete request.");
        }
    };

    // Change request status
    const handleChangeStatus = async (req, status) => {
        try {
            await Axios.put(`${REQUESTBLOOD}/status/${req._id}`, { done_status: status });
            setRequests((prev) =>
                prev.map((r) => (r._id === req._id ? { ...r, done_status: status } : r))
            );
        } catch {
            alert("Failed to update status.");
        }
    };

    // Dropdown menu handlers
    const handleMenuOpen = (event, req) => {
        setAnchorEl(event.currentTarget);
        setSelectedReq(req);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedReq(null);
    };

    // Status chip component
    const statusChip = (status) => (
        <Chip
            label={status === "complete" ? "Complete" : "Non Complete"}
            color={status === "complete" ? "success" : "warning"}
            variant="filled"
            size="small"
        />
    );

    const menuItems = [
        { label: "View", onClick: () => handleView(selectedReq) },
        { label: "Update", link: selectedReq ? `/request-blood/update/${selectedReq._id}` : "" },
        {
            label: "Delete",
            onClick: () => setConfirmRequest(selectedReq),
            sx: { color: "error.main" },
        },
    ];

    const statusOptions = ["non complete", "complete"];

    // Pagination page change handler
    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box sx={{ p: { xs: 1, md: 4 } }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Blood Requests
            </Typography>

            {/* Filters */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
                <TextField
                    label="Search by Patient Name"
                    variant="outlined"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    size="small"
                />
                <FormControl sx={{ minWidth: 200 }} size="small">
                    <InputLabel>Blood Type</InputLabel>
                    <Select
                        value={searchBloodType}
                        onChange={(e) => setSearchBloodType(e.target.value)}
                        label="Blood Type"
                    >
                        <MenuItem value="">All</MenuItem>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Search by Location"
                    variant="outlined"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    size="small"
                />
            </Box>

            {/* Loading and error */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <>
                    {/* Requests Table */}
                    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {[
                                        "#",
                                        "Patient Name",
                                        "Blood Type",
                                        "Units",
                                        "Contact",
                                        "Location",
                                        "Date",
                                        "Status",
                                        "Action",
                                    ].map((head) => (
                                        <TableCell key={head}>{head}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">
                                            <Typography color="text.secondary" sx={{ py: 3 }}>
                                                No requests found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    requests.map((req, i) => (
                                        <TableRow key={req._id || i} hover>
                                            <TableCell>{(currentPage - 1) * rowsPerPage + i + 1}</TableCell>
                                            <TableCell>{req.patient_name}</TableCell>
                                            <TableCell>
                                                <Chip label={req.blood_type} color="error" size="small" />
                                            </TableCell>
                                            <TableCell>{req.quantity}</TableCell>
                                            <TableCell>{req.contact_number}</TableCell>
                                            <TableCell>{req.donation_point}</TableCell>
                                            <TableCell>{req.request_date?.slice(0, 10)}</TableCell>
                                            <TableCell>{statusChip(req.done_status)}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={(e) => handleMenuOpen(e, req)} size="small">
                                                    <MoreVertIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                        <Pagination
                            count={Math.ceil(totalRequests / rowsPerPage)}
                            page={currentPage}
                            onChange={handleChangePage}
                            color="primary"
                        />
                    </Box>
                </>
            )}

            {/* Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {menuItems.map((item, i) =>
                    item.link ? (
                        <MenuItem key={i} component={Link} to={item.link} onClick={handleMenuClose}>
                            {item.label}
                        </MenuItem>
                    ) : (
                        <MenuItem
                            key={i}
                            onClick={() => {
                                item.onClick();
                                handleMenuClose();
                            }}
                            sx={item.sx}
                        >
                            {item.label}
                        </MenuItem>
                    )
                )}
                <Divider />
                <ListSubheader>Change Status</ListSubheader>
                {statusOptions.map((status) => (
                    <MenuItem
                        key={status}
                        onClick={() => {
                            handleChangeStatus(selectedReq, status);
                            handleMenuClose();
                        }}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                ))}
            </Menu>

            {/* Confirm Delete Dialog */}
            <Dialog open={!!confirmRequest} onClose={() => setConfirmRequest(null)}>
                <DialogTitle>Delete Request</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the request for <strong>{confirmRequest?.patient_name}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmRequest(null)} variant="outlined">
                        No
                    </Button>
                    <Button onClick={() => handleDelete(confirmRequest)} color="error" variant="contained">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default GetRequestBlood;
