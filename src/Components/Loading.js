import { CircularProgress, Box } from "@mui/material";

export default function LoadingSubmit() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 120,
                width: "100%",
            }}
        >
            <CircularProgress size={40} thickness={4} color="error" />
        </Box>
    );
}