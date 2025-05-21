import { Link } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";

export default function Err403({ role }) {
    return (
        <Box
            minHeight="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ bgcolor: "#f5f6fa" }}
        >
            <Paper elevation={4} sx={{ p: 5, borderRadius: 4, textAlign: "center", maxWidth: 400 }}>
                <Typography
                    variant="h2"
                    color="error"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ letterSpacing: 2 }}
                >
                    403
                </Typography>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    ACCESS DENIED
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Oops, you don't have permission to access this page.
                </Typography>
                <Button
                    component={Link}
                    to={role === '1996' ? "/dashboard/agent" : "/"}
                    variant="contained"
                    color="error"
                    size="large"
                    sx={{ borderRadius: 3, fontWeight: 600, mt: 2 }}
                    fullWidth
                >
                    {role === '1996' ? "Go To Agent Page" : "Go To Home Page"}
                </Button>
            </Paper>
        </Box>
    );
}