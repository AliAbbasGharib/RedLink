import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Menu as MenuContext } from "../../Context/MenuContext";
import { LOGOUT, USER } from "../../API/Api";
import Cookie from 'cookie-universal';
import { Axios } from "../../API/Axios";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Avatar,
    CircularProgress
} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function TopBar() {
    const menue = useContext(MenuContext);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const cookie = Cookie();
    useEffect(() => {
        Axios.get(USER).then(res => {
            setName(res.data.name);
        }).catch(() => {
            // handle error or redirect
        })
    }, [])

    async function handleLogOut() {
        try {
            await Axios.post(LOGOUT)
            cookie.remove("token");
            setLoading(true);
            window.location.pathname = "/login";
        } catch (error) {
            console.log(error);
        }
    }

    const setIsOpen = menue.setIsOpen;

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {loading && (
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 1 }}>
                    <CircularProgress size={24} />
                </Box>
            )}
            <AppBar position="fixed" sx={{ backgroundColor: "#b71c1c", boxShadow: 2, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <ArrowForwardIcon sx={{ fontSize: 32, color: "#fff", mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
                            RedLink
                        </Typography>
                        <IconButton
                            color="inherit"
                            onClick={() => setIsOpen((prev) => !prev)}
                            sx={{ ml: 2 }}
                        >
                            <FontAwesomeIcon icon={faBars} style={{ fontSize: 24 }} />
                        </IconButton>
                    </Box>
                    <Box>
                        <IconButton onClick={handleMenuOpen} color="inherit">
                            <Avatar sx={{ bgcolor: "#fff", color: "#b71c1c", width: 32, height: 32 }}>
                                {name ? name.charAt(0).toUpperCase() : "U"}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                        >
                            <MenuItem disabled>{name}</MenuItem>
                            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            {/* Spacer to push content below the fixed AppBar */}
            <Toolbar />
        </>
    );
}