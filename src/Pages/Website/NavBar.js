import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Container,
    Avatar,
    Tooltip,
    useMediaQuery,
    useTheme,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookie from "cookie-universal";
import { LOGOUT, USER } from "../../API/Api";
import { Axios } from "../../API/Axios";

export default function NavBar({ onAboutClick }) {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const cookie = Cookie();
    const token = cookie.get("token");

    useEffect(() => {
        if (token) {
            axios
                .get(USER, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setName(res.data.name);
                })
                .catch(() => { });
        }
    }, [token]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchor(null);
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    async function handleLogOut() {
        try {
            await Axios.post(LOGOUT).then(() => {
                cookie.remove("token");
                window.location.pathname = "/login";
            });
        } catch (error) {
            console.log(error);
        }
    }

    const navLinks = [
        { label: "Home", to: "/", icon: <HomeIcon sx={{ mr: 1 }} /> },
        { label: "Request Blood", to: "/request-blood", icon: <BloodtypeIcon sx={{ mr: 1 }} /> },
        { label: "Give Blood", to: "/give-blood", icon: <VolunteerActivismIcon sx={{ mr: 1 }} /> },
        { label: "About Us", onClick: onAboutClick, icon: <InfoIcon sx={{ mr: 1 }} /> },
        { label: "Contact Us", to: "/contact", icon: <ContactMailIcon sx={{ mr: 1 }} /> },
    ];

    return (
        <AppBar position="fixed" color="inherit" elevation={2} sx={{ borderBottom: "1px solid #eee" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 4,
                            color: "rgb(192, 23, 23)",
                            fontWeight: "bold",
                            textDecoration: "none",
                            fontSize: { xs: 22, md: 28 },
                        }}
                    >
                        →RedLink
                    </Typography>

                    {/* Desktop Menu */}
                    {!isMobile && (
                        <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
                            {navLinks.map((item) =>
                                item.to ? (
                                    <Button
                                        key={item.label}
                                        component={Link}
                                        to={item.to}
                                        startIcon={item.icon}
                                        sx={{
                                            color: item.label === "Home" ? "rgb(192, 23, 23)" : "#222",
                                            fontWeight: 700,
                                            textTransform: "none",
                                            fontSize: 16,
                                            px: 2,
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ) : (
                                    <Button
                                        key={item.label}
                                        onClick={item.onClick}
                                        startIcon={item.icon}
                                        sx={{
                                            color: "#222",
                                            fontWeight: 700,
                                            textTransform: "none",
                                            fontSize: 16,
                                            px: 2,
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                )
                            )}
                        </Box>
                    )}

                    {/* Right Side */}
                    <Box sx={{ flexGrow: 0, ml: "auto" }}>
                        {!token ? (
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleRegister}
                                    startIcon={<PersonAddAltIcon />}
                                    sx={{ borderRadius: 3, fontWeight: 600, px: 3 }}
                                >
                                    SignIn
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleLogin}
                                    startIcon={<LoginIcon />}
                                    sx={{ borderRadius: 3, fontWeight: 600, px: 3 }}
                                >
                                    Login
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <Tooltip title={name || "Account"}>
                                    <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
                                        {name ? (
                                            <Avatar sx={{ bgcolor: "rgb(192, 23, 23)" }}>
                                                {name[0].toUpperCase()}
                                            </Avatar>
                                        ) : (
                                            <Avatar sx={{ bgcolor: "rgb(192, 23, 23)" }}>
                                                <AccountCircleIcon />
                                            </Avatar>
                                        )}
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                >
                                    <MenuItem disabled>
                                        <ListItemIcon>
                                            <AccountCircleIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>{name}</ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogOut}>
                                        <ListItemIcon>
                                            <LogoutIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>Logout</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>

                    {/* Mobile Menu Icon */}
                    {isMobile && (
                        <>
                            <IconButton
                                size="large"
                                edge="end"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMobileMenuOpen}
                                sx={{ ml: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={mobileMenuAnchor}
                                open={Boolean(mobileMenuAnchor)}
                                onClose={handleMobileMenuClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                            >
                                {navLinks.map((item) =>
                                    item.to ? (
                                        <MenuItem
                                            key={item.label}
                                            component={Link}
                                            to={item.to}
                                            onClick={handleMobileMenuClose}
                                            sx={{ fontWeight: 600 }}
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText>{item.label}</ListItemText>
                                        </MenuItem>
                                    ) : (
                                        <MenuItem
                                            key={item.label}
                                            onClick={() => {
                                                item.onClick();
                                                handleMobileMenuClose();
                                            }}
                                            sx={{ fontWeight: 600 }}
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText>{item.label}</ListItemText>
                                        </MenuItem>
                                    )
                                )}
                                {!token ? (
                                    <>
                                        <MenuItem onClick={() => { handleRegister(); handleMobileMenuClose(); }}>
                                            <ListItemIcon>
                                                <PersonAddAltIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>SignIn</ListItemText>
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleLogin(); handleMobileMenuClose(); }}>
                                            <ListItemIcon>
                                                <LoginIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Login</ListItemText>
                                        </MenuItem>
                                    </>
                                ) : (
                                    <>
                                        <MenuItem disabled>
                                            <ListItemIcon>
                                                <AccountCircleIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>{name}</ListItemText>
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleLogOut(); handleMobileMenuClose(); }}>
                                            <ListItemIcon>
                                                <LogoutIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Logout</ListItemText>
                                        </MenuItem>
                                    </>
                                )}
                            </Menu>
                        </>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}