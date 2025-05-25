import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Paper,
    LinearProgress,
    Tooltip,
    Stack,
} from "@mui/material";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import GroupIcon from "@mui/icons-material/Group";
import InventoryIcon from "@mui/icons-material/Inventory";
import { red, green, orange } from "@mui/material/colors";
import CountUp from "react-countup";
import { Axios } from "../../API/Axios";
import { AVAILABLEDONOR, BLOODTYPES } from "../../API/Api";

// Helper: get color based on availability ratio
function getAvailabilityColor(ratio) {
    if (ratio >= 0.7) return green[600];
    if (ratio >= 0.4) return orange[800];
    return red[700];
}

const BloodCard = ({ type, available, total }) => {
    const availabilityRatio = total === 0 ? 0 : available / total;
    const availabilityPercent = Math.round(availabilityRatio * 100);

    return (
        <Card
            elevation={4}
            sx={{
                borderRadius: 3,
                backgroundColor: "#fff",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
                height: "100%",
            }}
        >
            <CardContent>
                <Box display="flex" alignItems="center" mb={2} gap={2}>
                    <Avatar sx={{ bgcolor: red[500] }}>
                        <BloodtypeIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                        Blood Type {type}
                    </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary">
                    Total Donors: {total}
                </Typography>

                <Box mt={1} mb={1}>
                    <Tooltip title={`${availabilityPercent}% donors available`} arrow>
                        <LinearProgress
                            variant="determinate"
                            value={availabilityPercent}
                            sx={{
                                height: 12,
                                borderRadius: 5,
                                backgroundColor: "#eee",
                                "& .MuiLinearProgress-bar": {
                                    backgroundColor: getAvailabilityColor(availabilityRatio),
                                },
                            }}
                        />
                    </Tooltip>
                </Box>

                <Typography
                    variant="h6"
                    color={getAvailabilityColor(availabilityRatio)}
                    fontWeight="bold"
                    mt={0.5}
                >
                    {available} Available Donor{available !== 1 ? "s" : ""}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default function DashboardPage() {
    const [bloodStats, setBloodStats] = useState([]);
    const [availableDonorCount, setAvailableDonorCount] = useState(0);

    useEffect(() => {
        // Fetch blood stats (total + available per blood type)
        Axios.get(BLOODTYPES)
            .then(res => {
                const raw = res.data?.data;

                if (raw && typeof raw === "object") {
                    const transformed = Object.entries(raw).map(([type, stats]) => ({
                        type,
                        ...stats,
                    }));
                    setBloodStats(transformed);
                } else {
                    console.error("Unexpected blood stats format:", raw);
                    setBloodStats([]);
                }
            })
            .catch(err => console.error("Error fetching blood stats:", err));

        // Fetch total available donor count
        Axios.get(AVAILABLEDONOR)
            .then(res => {
                setAvailableDonorCount(res.data?.count || 0);
            })
            .catch(err => console.error("Error fetching available donor count:", err));
    }, []);

    const totalDonors = bloodStats.reduce((acc, b) => acc + b.total, 0);

    return (
        <Box
            component={Paper}
            sx={{
                p: 4,
                maxWidth: 1100,
                mx: "auto",
                my: 6,
                borderRadius: 4,
                backgroundColor: "#fef6f6",
            }}
        >
            <Typography
                variant="h4"
                fontWeight="bold"
                color="error"
                textAlign="center"
                mb={4}
            >
                Blood Donor Dashboard
            </Typography>

            <Grid container spacing={3}>
                {bloodStats.map(({ type, available, total }) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={type}>
                        <BloodCard type={type} available={available} total={total} />
                    </Grid>
                ))}
            </Grid>

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="center"
                spacing={4}
                mt={6}
            >
                {/* Total Available Donors */}
                <Card
                    sx={{
                        flex: 1,
                        bgcolor: red[50],
                        borderRadius: 3,
                        boxShadow: 3,
                        p: 3,
                        textAlign: "center",
                    }}
                >
                    <Avatar
                        sx={{ bgcolor: red[500], mx: "auto", mb: 1, width: 56, height: 56 }}
                    >
                        <GroupIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" color="error">
                        Total Available Donors
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="error">
                        <CountUp end={availableDonorCount} duration={1.5} />
                    </Typography>
                </Card>

                {/* Total Units (All Donors) */}
                <Card
                    sx={{
                        flex: 1,
                        bgcolor: red[50],
                        borderRadius: 3,
                        boxShadow: 3,
                        p: 3,
                        textAlign: "center",
                    }}
                >
                    <Avatar
                        sx={{ bgcolor: red[500], mx: "auto", mb: 1, width: 56, height: 56 }}
                    >
                        <InventoryIcon fontSize="large" />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" color="error">
                        Total Donors
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="error">
                        <CountUp end={totalDonors} duration={1.5} separator="," />
                    </Typography>
                </Card>
            </Stack>
        </Box>
    );
}
