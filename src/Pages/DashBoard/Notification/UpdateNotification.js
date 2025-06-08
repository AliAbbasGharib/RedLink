import {
    Paper,
    Typography,
    Box,
    TextField,
    Button,

} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Axios } from '../../../API/Axios';
import { NOTIFICATION, UPDATENOTIFICATION } from '../../../API/Api';

export default function UpdateNotification() {
    const [notification, setNotification] = useState({
        title: "",
        body: "",
    });

    const nav = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        try {
            Axios.get(`${NOTIFICATION}/${id}`)
                .then(res => {
                    setNotification({
                        title: res.data.data.title,
                        body: res.data.data.body,

                    });
                })

        } catch (err) {
            console.log(err);
        }
    }, [id]);

    function handleChange(e) {
        setNotification({
            ...notification,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await Axios.put(`${UPDATENOTIFICATION}/${id}`, notification);
            console.log("Success:", res.data);
            nav("/dashboard/notification");


        } catch (e) {
            console.log(e.message)
        }
    }
    return (
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" color="error" gutterBottom>
                Update Notification
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
                <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{ mt: 3 }}
                >
                    Update
                </Button>
            </Box>
        </Paper>
    );
}


