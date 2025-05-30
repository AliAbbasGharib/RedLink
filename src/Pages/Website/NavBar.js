import React, { useEffect, useState } from "react";
import {
    AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem,
    Box, Container, Avatar, Tooltip, Badge, ListItemIcon, ListItemText,
    useMediaQuery, useTheme
} from "@mui/material";

import {
    Dashboard as DashboardIcon,
    Menu as MenuIcon,
    Home as HomeIcon,
    Bloodtype as BloodtypeIcon,
    VolunteerActivism as VolunteerActivismIcon,
    Info as InfoIcon,
    ContactMail as ContactMailIcon,
    AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon,
    Login as LoginIcon,
    PersonAddAlt as PersonAddAltIcon,
    Language as LanguageIcon,
    Notifications as NotificationsIcon
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import { LOGOUT, MARKASREAD, NOTIFICATIONS, UNREADCOUNT, USER } from "../../API/Api";
import { Axios } from "../../API/Axios";
import { useTranslation } from "react-i18next";

export default function NavBar({ onAboutClick }) {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
    const [langMenuAnchor, setLangMenuAnchor] = useState(null);
    const [notifAnchorEl, setNotifAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const cookie = Cookie();
    const token = cookie.get("token");

    // Fetch user info on token change
    useEffect(() => {
        if (token) {
            Axios.get(USER, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    setName(res.data.name);
                    setRole(res.data.role);
                })
                .catch(() => { });
        }
    }, [token]);

    // Fetch notifications function
    const fetchNotifications = async () => {
        try {
            const res = await Axios.get(NOTIFICATIONS, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(res.data.notifications || []);
        } catch (err) {
            console.error("Notifications error:", err);
        }
    };

    // Fetch unread notifications count function
    const fetchUnreadCount = async () => {
        try {
            const res = await Axios.get(UNREADCOUNT, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUnreadCount(res.data.unreadCount || 0);
        } catch (err) {
            console.error("Failed to fetch unread count", err);
        }
    };

    // Initial fetch on mount & token change
    useEffect(() => {
        if (token) {
            fetchNotifications();
            fetchUnreadCount();
        }
    }, []);

    // Polling: fetch notifications & unread count every 10 seconds
    useEffect(() => {
        if (!token) return;

        const intervalId = setInterval(() => {
            fetchNotifications();
            fetchUnreadCount();
        }, 10000); // 10 seconds

        return () => clearInterval(intervalId);
    }, []);

    // Open notifications menu, mark all read & refresh
    const handleNotifMenuOpen = async (e) => {
        setNotifAnchorEl(e.currentTarget);

        if (!token) return;

        try {
            await Axios.post(MARKASREAD, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUnreadCount(0);
            fetchNotifications();
        } catch (err) {
            console.error("Failed to mark all notifications as read", err);
        }
    };
    const handleNotifMenuClose = () => setNotifAnchorEl(null);
    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleMobileMenuOpen = (e) => setMobileMenuAnchor(e.currentTarget);
    const handleMobileMenuClose = () => setMobileMenuAnchor(null);
    const handleLangMenuOpen = (e) => setLangMenuAnchor(e.currentTarget);
    const handleLangMenuClose = () => setLangMenuAnchor(null);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        handleLangMenuClose();
    };

    const handleRegister = () => navigate("/register");
    const handleLogin = () => navigate("/login");

    const handleLogOut = async () => {
        try {
            await Axios.post(LOGOUT, {}, { headers: { Authorization: `Bearer ${token}` } });
            cookie.remove("token");
            window.location.pathname = "/login";
        } catch (err) {
            console.log(err);
        }
    };

    const navLinks = [
        { label: t("home"), to: "/", icon: <HomeIcon /> },
        { label: t("requestBlood"), to: "/request-blood", icon: <BloodtypeIcon /> },
        { label: t("giveBlood"), to: "/give-blood", icon: <VolunteerActivismIcon /> },
        { label: t("aboutUs"), onClick: onAboutClick, icon: <InfoIcon /> },
        { label: t("contactUs"), to: "/contact", icon: <ContactMailIcon /> }
    ];

    return (
        <AppBar position="fixed" color="inherit" elevation={2} sx={{ borderBottom: "1px solid #eee" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        component={Link}
                        to="/"
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 4,
                            color: "rgb(192, 23, 23)",
                            fontWeight: "bold",
                            textDecoration: "none",
                            fontSize: { xs: 22, md: 28 }
                        }}
                    >
                        →RedLink
                    </Typography>

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
                                            color: item.label === t("home") ? "rgb(192, 23, 23)" : "#222",
                                            fontWeight: 700,
                                            textTransform: "none",
                                            fontSize: 16
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ) : (
                                    <Button
                                        key={item.label}
                                        onClick={item.onClick}
                                        startIcon={item.icon}
                                        sx={{ color: "#222", fontWeight: 700, textTransform: "none", fontSize: 16 }}
                                    >
                                        {item.label}
                                    </Button>
                                )
                            )}
                        </Box>
                    )}

                    <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 2 }}>
                        {token && (
                            <>
                                <Tooltip title={t("notifications")}>
                                    <IconButton color="inherit" onClick={handleNotifMenuOpen}>
                                        <Badge badgeContent={unreadCount} color="error">
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    anchorEl={notifAnchorEl}
                                    open={Boolean(notifAnchorEl)}
                                    onClose={handleNotifMenuClose}
                                    PaperProps={{ sx: { maxHeight: 300, width: '300px' } }}
                                >
                                    {notifications.length === 0 ? (
                                        <MenuItem disabled>{t("noNotifications")}</MenuItem>
                                    ) : (
                                        notifications.map((notif, i) => (
                                            <MenuItem key={i} onClick={handleNotifMenuClose}>
                                                {notif.body || JSON.stringify(notif)}
                                            </MenuItem>
                                        ))
                                    )}
                                </Menu>
                            </>
                        )}

                        {!isMobile && !token && (
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleRegister}
                                    startIcon={<PersonAddAltIcon />}
                                    sx={{ borderRadius: 3, fontWeight: 600, px: 3 }}
                                >
                                    {t("signIn")}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleLogin}
                                    startIcon={<LoginIcon />}
                                    sx={{ borderRadius: 3, fontWeight: 600, px: 3 }}
                                >
                                    {t("login")}
                                </Button>
                            </Box>
                        )}

                        {token && (
                            <>
                                <Tooltip title={name || t("account")}>
                                    <IconButton onClick={handleMenuOpen}>
                                        <Avatar sx={{ bgcolor: "rgb(192, 23, 23)" }}>
                                            {name ? name[0].toUpperCase() : <AccountCircleIcon />}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                    <MenuItem disabled>
                                        <ListItemIcon>
                                            <AccountCircleIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>{name}</ListItemText>
                                    </MenuItem>
                                    {(role === "1995" || role === "1996") && (
                                        <MenuItem onClick={() => { navigate("/dashboard"); handleMenuClose(); }}>
                                            <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                                            <ListItemText>{t("dashboard")}</ListItemText>
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={handleLogOut}>
                                        <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                                        <ListItemText>{t("logout")}</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>

                    {isMobile && (
                        <Box sx={{ position: "absolute", left: "80%", display: "flex", alignItems: "center" }}>
                            <Tooltip title={t("language")}>
                                <IconButton onClick={handleLangMenuOpen}><LanguageIcon /></IconButton>
                            </Tooltip>
                            <Menu anchorEl={langMenuAnchor} open={Boolean(langMenuAnchor)} onClose={handleLangMenuClose}>
                                <MenuItem onClick={() => changeLanguage("en")}>🇺🇸 English</MenuItem>
                                <MenuItem onClick={() => changeLanguage("ar")}>🇸🇦 العربية</MenuItem>
                            </Menu>
                            <IconButton onClick={handleMobileMenuOpen}><MenuIcon /></IconButton>
                        </Box>
                    )}
                    <Menu anchorEl={mobileMenuAnchor} open={Boolean(mobileMenuAnchor)} onClose={handleMobileMenuClose}>
                        {navLinks.map((item) =>
                            item.to ? (
                                <MenuItem key={item.label} component={Link} to={item.to} onClick={handleMobileMenuClose}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText>{item.label}</ListItemText>
                                </MenuItem>
                            ) : (
                                <MenuItem key={item.label} onClick={() => { item.onClick(); handleMobileMenuClose(); }}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText>{item.label}</ListItemText>
                                </MenuItem>
                            )
                        )}
                        {!token ? (
                            <Box sx={{ p: 2 }}>
                                <Button fullWidth variant="outlined" color="error" startIcon={<PersonAddAltIcon />}
                                    onClick={() => { handleRegister(); handleMobileMenuClose(); }}
                                    sx={{ mb: 1, borderRadius: 3, fontWeight: 600 }}
                                >
                                    {t("signIn")}
                                </Button>
                                <Button fullWidth variant="contained" color="error" startIcon={<LoginIcon />}
                                    onClick={() => { handleLogin(); handleMobileMenuClose(); }}
                                    sx={{ borderRadius: 3, fontWeight: 600 }}
                                >
                                    {t("login")}
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <MenuItem disabled>
                                    <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                                    <ListItemText>{name}</ListItemText>
                                </MenuItem>
                                {(role === "1995" || role === "1996") && (
                                    <MenuItem onClick={() => { navigate("/dashboard"); handleMobileMenuClose(); }}>
                                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                                        <ListItemText>{t("dashboard")}</ListItemText>
                                    </MenuItem>
                                )}
                                <MenuItem onClick={() => { handleLogOut(); handleMobileMenuClose(); }}>
                                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                                    <ListItemText>{t("logout")}</ListItemText>
                                </MenuItem>
                            </>
                        )}
                    </Menu>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
