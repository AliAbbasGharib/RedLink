import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    Snackbar,
    Alert,
} from '@mui/material';
import { Axios } from '../../../API/Axios';
import { ADDNOTIFICATION } from '../../../API/Api';

export default function AddNotification() {
    const [notification, setNotification] = useState({
        title: '',
        body: '',
        recipient: '',
    });
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);

    const handleChange = (e) => {
        setNotification({
            ...notification,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Example validation
        if (!notification.title || !notification.body) {
            setErrorOpen(true);
            return;
        }

        // Simulate API call
        Axios.post(ADDNOTIFICATION,notification)
        .then((response)=> {
            // <Alert>Sending Successfully</Alert>
        })

        // Show success
        setSuccessOpen(true);
        setNotification({ title: '', body: '', recipient: '' });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" color='error' gutterBottom>
                    Add Notification
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
                        Send Notification
                    </Button>
                </Box>
            </Paper>

            {/* Success Snackbar */}
            <Snackbar
                open={successOpen}
                autoHideDuration={4000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccessOpen(false)} severity="success">
                    Notification sent successfully!
                </Alert>
            </Snackbar>

            {/* Error Snackbar */}
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
