import React, { useEffect, useState } from "react";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Paper,
    Divider,
    Tooltip,
    Badge,
    IconButton
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { Axios } from "../../../API/Axios";
import { GetMESSAGES, MARKMESSAGEASREAD, DELETEMESSAGE } from "../../../API/Api";

export default function Messages() {
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await Axios(GetMESSAGES);
            setMessages(res.data.messages);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    const handleSelectMessage = async (msg) => {
        setSelectedMessage(msg);

        if (msg.status !== "read") {
            setMessages((prev) =>
                prev.map((m) => (m._id === msg._id ? { ...m, status: "read" } : m))
            );
            try {
                await Axios.put(`${MARKMESSAGEASREAD}/status/${msg._id}`, {
                    status: "read",
                });
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }
    };

    const handleDeleteMessage = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await Axios.delete(`${DELETEMESSAGE}/${id}`);
                setMessages((prev) => prev.filter((msg) => msg._id !== id));

                if (selectedMessage?._id === id) {
                    setSelectedMessage(null);
                }
            } catch (err) {
                console.error("Failed to delete message", err);
            }
        }
    };

    return (
        <Box display="flex" gap={2} p={2}>
            {/* Message List */}
            <Paper sx={{ width: "35%", height: "80vh", overflow: "auto" }}>
                <Typography variant="h6" p={2}>Inbox</Typography>
                <Divider />
                <List>
                    {messages.map((msg) => (
                        <ListItem
                            key={msg._id}
                            button
                            onClick={() => handleSelectMessage(msg)}
                            selected={selectedMessage?._id === msg._id}
                            alignItems="flex-start"
                            secondaryAction={
                                <Tooltip title="Delete">
                                    <IconButton
                                        edge="end"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteMessage(msg._id);
                                        }}
                                    >
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </Tooltip>
                            }
                        >
                            <ListItemAvatar>
                                <Badge
                                    color="primary"
                                    variant="dot"
                                    invisible={msg.status === "read"}
                                >
                                    <Avatar>{msg.name?.[0] || "?"}</Avatar>
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography
                                        fontWeight={msg.status === "read" ? "normal" : "bold"}
                                    >
                                        {msg.name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                        fontWeight={msg.status === "read" ? "normal" : "bold"}
                                    >
                                        {msg.message.slice(0, 40)}...
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Message Details */}
            <Paper sx={{ flex: 1, p: 2, height: "80vh", overflow: "auto" }}>
                {selectedMessage ? (
                    <>
                        <Typography variant="h6">{selectedMessage.name}</Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            From: {selectedMessage.phone_number} |{" "}
                            {new Date(selectedMessage.createdAt).toLocaleString()}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography>{selectedMessage.message}</Typography>
                        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                Contact User
                            </Typography>
                            <Box display="flex" justifyContent="center" gap={2}>
                                <Tooltip title="Contact via WhatsApp" arrow>
                                    <Box
                                        component="a"
                                        href={`https://wa.me/${selectedMessage.phone_number}`}
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
                                                bgcolor: "#1ebe57",
                                            },
                                        }}
                                    >
                                        <WhatsAppIcon sx={{ color: "#fff", fontSize: 28 }} />
                                    </Box>
                                </Tooltip>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <Typography>Select a message to view details</Typography>
                )}
            </Paper>
        </Box>
    );
}
