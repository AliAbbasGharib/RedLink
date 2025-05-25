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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";

function GetRequestBlood() {
    const [search, setSearch] = useState("");
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmRequest, setConfirmRequest] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReq, setSelectedReq] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const response = await Axios.get(REQUESTBLOOD);
                const data = response.data?.requests || [];
                setRequests(Array.isArray(data) ? data : []);
            } catch {
                setError("Error fetching blood requests.");
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const filteredRequests = requests.filter((req) => {
        const term = search.toLowerCase();
        return (
            req.patient_name?.toLowerCase().includes(term) ||
            req.blood_type?.toLowerCase().includes(term) ||
            req.hospital_name?.toLowerCase().includes(term)
        );
    });

    const handleView = (req) => alert(`Viewing request for ${req.patient_name}`);

    const handleDelete = async (req) => {
        try {
            await Axios.delete(`${REQUESTBLOOD}/${req._id}`);
            setRequests((prev) => prev.filter((r) => r._id !== req._id));
            setConfirmRequest(null);
        } catch {
            alert("Failed to delete request.");
        }
    };

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

    const handleMenuOpen = (event, req) => {
        setAnchorEl(event.currentTarget);
        setSelectedReq(req);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedReq(null);
    };

    const statusChip = (status) => (
        <Chip
            label={status === "complete" ? "Complete" : "Non Complete"}
            color={status === "complete" ? "success" : "warning"}
            variant="filled"
        />
    );

    const menuItems = [
        { label: "View", onClick: () => handleView(selectedReq) },
        { label: "Update", link: `${selectedReq?._id}` },
        {
            label: "Delete",
            onClick: () => setConfirmRequest(selectedReq),
            sx: { color: "error.main" },
        },
    ];

    const statusOptions = ["non complete", "complete"];

    return (
        <Box sx={{ p: { xs: 1, md: 4 } }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Blood Requests
            </Typography>

            <TextField
                label="Search by patient, blood type, or hospital"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 3, width: 350, maxWidth: "100%" }}
            />

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
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
                            {filteredRequests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <Typography color="text.secondary" sx={{ py: 3 }}>
                                            No requests found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRequests.map((req, i) => (
                                    <TableRow key={req._id || i} hover>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{req.patient_name}</TableCell>
                                        <TableCell>
                                            <Chip label={req.blood_type} color="error" />
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
                        <MenuItem
                            key={i}
                            component={Link}
                            to={item.link}
                            onClick={handleMenuClose}
                        >
                            {item.label}
                        </MenuItem>
                    ) : (
                        <MenuItem key={i} onClick={() => { item.onClick(); handleMenuClose(); }} sx={item.sx}>
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
                        Are you sure you want to delete the request for{" "}
                        <strong>{confirmRequest?.patient_name}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmRequest(null)} variant="outlined">
                        No
                    </Button>
                    <Button
                        onClick={() => handleDelete(confirmRequest)}
                        color="error"
                        variant="contained"
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default GetRequestBlood;
