import React, {  useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Snackbar,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    TablePagination,
} from '@mui/material';
import { Axios } from '../../../API/Axios';
import { ADDNOTIFICATION, NOTIFICATION, NOTIFICATIONS } from '../../../API/Api';
import { useNavigate } from 'react-router-dom';

export default function AddNotification() {
    const [notification, setNotification] = useState({
        title: '',
        body: '',
    });
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const nav = useNavigate();
    const handleChange = (e) => {
        setNotification({
            ...notification,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!notification.title || !notification.body) {
            setErrorOpen(true);
            return;
        }

        try {
            if (isEditing && editId) {
                await Axios.put(`${ADDNOTIFICATION}/${editId}`, notification);
                setIsEditing(false);
                setEditId(null);
            } else {
                await Axios.post(ADDNOTIFICATION, notification);
            }

            setSuccessOpen(true);
            setNotification({ title: '', body: '' });
            fetchNotifications();
        } catch (err) {
            console.error("Error saving notification:", err);
            setErrorOpen(true);
        }
    };


    const handleDelete = async (id) => {
        try {
            await Axios.delete(`${NOTIFICATION}/${id}`);
            fetchNotifications();
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await Axios.get(NOTIFICATIONS);
            setNotifications(response.data.notifications || []);
        } catch (err) {
            console.error("Error fetching notifications", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <Container maxWidth="md" sx={{ mt: 6 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
                <Typography variant="h5" fontWeight="bold" color="error" gutterBottom>
                    {isEditing ? 'Update Notification' : 'Add Notification'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Title"
                        name="title"
                        value={notification.title}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Message"
                        name="body"
                        value={notification.body}
                        onChange={handleChange}
                        required
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                    />
                    <TextField
                        label="Recipient (optional)"
                        name="recipient"
                        value={notification.recipient}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        placeholder="Leave blank to notify all users"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        fullWidth
                        sx={{ mt: 3 }}
                    >
                        {isEditing ? 'Update Notification' : 'Send Notification'}
                    </Button>
                </Box>
            </Paper>

            {/* Notifications Table */}
            <Typography variant="h6" gutterBottom>
                Recent Notifications
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Message</TableCell>
                                    <TableCell>Recipient</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {notifications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No notifications available.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    notifications
                                        .slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        )
                                        .map((n, index) => (
                                            <TableRow key={n._id || index}>
                                                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell>{n.title}</TableCell>
                                                <TableCell>{n.body}</TableCell>
                                                <TableCell>{n.recipient || 'All'}</TableCell>
                                                <TableCell>{n.created_at?.slice(0, 10) || '-'}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => nav(`/dashboard/notification/${n._id}`)}
                                                    >
                                                        Update
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(n._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={notifications.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}

            {/* Snackbars */}
            <Snackbar
                open={successOpen}
                autoHideDuration={4000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccessOpen(false)} severity="success">
                    {isEditing ? 'Notification updated successfully!' : 'Notification sent successfully!'}
                </Alert>
            </Snackbar>

            <Snackbar
                open={errorOpen}
                autoHideDuration={4000}
                onClose={() => setErrorOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setErrorOpen(false)} severity="error">
                    Title and message are required!
                </Alert>
            </Snackbar>
        </Container>
    );
}
