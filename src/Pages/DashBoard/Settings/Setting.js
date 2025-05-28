import React, { useState } from "react";
import {
    Box,
    Container,
    Paper,
    Tabs,
    Tab,
    Typography,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Grid,
} from "@mui/material";

function TabPanel({ value, index, children }) {
    return value === index && <Box sx={{ pt: 2 }}>{children}</Box>;
}

export default function SystemSettings() {
    const [tab, setTab] = useState(0);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const handleTabChange = (e, newValue) => setTab(newValue);

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    System Settings
                </Typography>

                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                >
                    <Tab label="General" />
                    <Tab label="User Roles" />
                    <Tab label="Email Config" />
                    <Tab label="Security" />
                    <Tab label="Backup" />
                </Tabs>

                {/* General Settings */}
                <TabPanel value={tab} index={0}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Site Name" defaultValue="My System" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={maintenanceMode}
                                        onChange={() => setMaintenanceMode(!maintenanceMode)}
                                        color="error"
                                    />
                                }
                                label="Maintenance Mode"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary">
                                Save Changes
                            </Button>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* User Roles */}
                <TabPanel value={tab} index={1}>
                    <Typography>User role and permission settings (custom UI or table here)</Typography>
                </TabPanel>

                {/* Email Config */}
                <TabPanel value={tab} index={2}>
                    <TextField fullWidth label="SMTP Server" sx={{ mb: 2 }} />
                    <TextField fullWidth label="SMTP Port" type="number" sx={{ mb: 2 }} />
                    <TextField fullWidth label="Sender Email" sx={{ mb: 2 }} />
                    <TextField fullWidth label="Sender Password" type="password" sx={{ mb: 2 }} />
                    <Button variant="contained" color="primary">
                        Save Email Config
                    </Button>
                </TabPanel>

                {/* Security Settings */}
                <TabPanel value={tab} index={3}>
                    <Typography>Security controls like 2FA, IP restrictions (custom logic)</Typography>
                </TabPanel>

                {/* Backup */}
                <TabPanel value={tab} index={4}>
                    <Typography>
                        Manage system backup or restore options (you can hook with Node.js/MongoDB logic)
                    </Typography>
                    <Button variant="outlined" sx={{ mt: 2 }}>
                        Create Backup
                    </Button>
                </TabPanel>
            </Paper>
        </Container>
    );
}
