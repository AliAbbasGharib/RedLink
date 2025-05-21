import { Outlet } from "react-router-dom";
import SideBar from "../../Components/Dashboard/SideBar";
import TopBar from "../../Components/Dashboard/TopBar";
import Box from "@mui/material/Box";

export default function DashBoard() {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh", background: "#f5f5f5" }}>
            <SideBar />
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <TopBar />
                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}