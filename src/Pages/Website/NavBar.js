import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem,
    Box, Container, Avatar, Tooltip, Badge, ListItemIcon, ListItemText,
    useMediaQuery, useTheme
} from "@mui/material";

import {
    Dashboard as DashboardIcon, Menu as MenuIcon, Home as HomeIcon,
    Bloodtype as BloodtypeIcon, VolunteerActivism as VolunteerActivismIcon,
    Info as InfoIcon, ContactMail as ContactMailIcon, AccountCircle as AccountCircleIcon,
    Logout as LogoutIcon, Login as LoginIcon, PersonAddAlt as PersonAddAltIcon,
    Language as LanguageIcon, Notifications as NotificationsIcon
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
    const cookie = useMemo(() => Cookie(), []);
    const token = cookie.get("token");

    const [user, setUser] = useState({ name: "", role: "" });
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [menus, setMenus] = useState({
        anchorEl: null,
        mobileMenuAnchor: null,
        langMenuAnchor: null,
        notifAnchorEl: null
    });

    const navLinks = useMemo(() => [
        { label: t("home"), to: "/", icon: <HomeIcon /> },
        { label: t("requestBlood"), to: "/request-blood", icon: <BloodtypeIcon /> },
        { label: t("giveBlood"), to: "/give-blood", icon: <VolunteerActivismIcon /> },
        { label: t("aboutUs"), onClick: onAboutClick, icon: <InfoIcon /> },
        { label: t("contactUs"), to: "/contact", icon: <ContactMailIcon /> }
    ], [t, onAboutClick]);

    // Handlers
    const openMenu = useCallback((key) => (e) => setMenus(prev => ({ ...prev, [key]: e.currentTarget })), []);
    const closeMenu = useCallback((key) => () => setMenus(prev => ({ ...prev, [key]: null })), []);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        closeMenu("langMenuAnchor")();
    };

    const handleLogOut = useCallback(async () => {
        try {
            await Axios.post(LOGOUT, {}, { headers: { Authorization: `Bearer ${token}` } });
            cookie.remove("token");
            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    }, [cookie, navigate, token]);

    // Fetch user and notifications
    useEffect(() => {
        if (!token) return;

        Axios.get(USER, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setUser({ name: res.data.name, role: res.data.role }))
            .catch(() => { });

        const fetchAll = async () => {
            try {
                const [notifRes, countRes] = await Promise.all([
                    Axios.get(NOTIFICATIONS, { headers: { Authorization: `Bearer ${token}` } }),
                    Axios.get(UNREADCOUNT)
                ]);
                setNotifications(notifRes.data.notifications || []);
                setUnreadCount(countRes.data.unreadCount || 0);
            } catch (err) {
                console.error("Notification fetch error", err);
            }
        };

        fetchAll();
        const intervalId = setInterval(fetchAll, 10000);
        return () => clearInterval(intervalId);
    }, [token]);

    const handleNotifMenuOpen = async (e) => {
        setMenus(prev => ({ ...prev, notifAnchorEl: e.currentTarget }));
        try {
            await Axios.post(MARKASREAD, {}, { headers: { Authorization: `Bearer ${token}` } });
            setUnreadCount(0);
            const res = await Axios.get(NOTIFICATIONS, { headers: { Authorization: `Bearer ${token}` } });
            setNotifications(res.data.notifications || []);
        } catch (err) {
            console.error("Failed to mark all notifications as read", err);
        }
    };

    const handleNotifClick = (notif) => {
        if (notif.request_id) {
            navigate(`/request-blood/${notif.request_id}`);
            closeMenu("notifAnchorEl")();
        }
    };

    return (
        <AppBar position="fixed" color="inherit" elevation={2} sx={{ borderBottom: "1px solid #eee" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo */}
                    <Typography
                        component={Link}
                        to="/"
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 4, color: "rgb(192, 23, 23)",
                            fontWeight: "bold", textDecoration: "none",
                            fontSize: { xs: 22, md: 28 }
                        }}
                    >
                        →RedLink
                    </Typography>

                    {/* Desktop Nav */}
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
                                            textTransform: "none"
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ) : (
                                    <Button
                                        key={item.label}
                                        onClick={item.onClick}
                                        startIcon={item.icon}
                                        sx={{ color: "#222", fontWeight: 700, textTransform: "none" }}
                                    >
                                        {item.label}
                                    </Button>
                                )
                            )}
                        </Box>
                    )}

                    {/* Right Controls */}
                    <Box sx={{ ml: 2, display: "flex", alignItems: "center", gap: 2 }}>
                        {/* Notifications */}
                        {token && (
                            <Box sx={{ p: 2 }}>
                                <Tooltip title={t("notifications")}>
                                    <IconButton color="inherit" onClick={handleNotifMenuOpen}>
                                        <Badge badgeContent={unreadCount} color="error">
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    anchorEl={menus.notifAnchorEl}
                                    open={Boolean(menus.notifAnchorEl)}
                                    onClose={closeMenu("notifAnchorEl")}
                                    PaperProps={{ sx: { maxHeight: 300, width: 300 } }}
                                >
                                    {notifications.length === 0 ? (
                                        <MenuItem disabled>{t("noNotifications")}</MenuItem>
                                    ) : (
                                        notifications.map(notif => (
                                            <MenuItem
                                                key={notif._id}
                                                onClick={() => handleNotifClick(notif)}
                                                sx={{ cursor: notif.request_id ? "pointer" : "default" }}
                                                disabled={!notif.request_id}
                                            >
                                                {notif.title || JSON.stringify(notif)}
                                            </MenuItem>
                                        ))
                                    )}
                                </Menu>
                            </Box>
                        )}

                        {/* Auth Buttons */}
                        {!token ? (
                            !isMobile && (
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button variant="outlined" color="error"
                                        onClick={() => navigate("/register")}
                                        startIcon={<PersonAddAltIcon />}
                                        sx={{ borderRadius: 3, fontWeight: 600, px: 3 }}
                                    >
                                        {t("signIn")}
                                    </Button>
                                    <Button variant="contained" color="error"
                                        onClick={() => navigate("/login")}
                                        startIcon={<LoginIcon />}
                                        sx={{ borderRadius: 3, fontWeight: 600, px: 3 }}
                                    >
                                        {t("login")}
                                    </Button>
                                </Box>
                            )
                        ) : (
                            <>
                                <Tooltip title={user.name || t("account")}>
                                    <IconButton onClick={openMenu("anchorEl")}>
                                        <Avatar sx={{ bgcolor: "rgb(192, 23, 23)" }}>
                                            {user.name ? user.name[0].toUpperCase() : <AccountCircleIcon />}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu anchorEl={menus.anchorEl} open={Boolean(menus.anchorEl)} onClose={closeMenu("anchorEl")}>
                                    <MenuItem disabled>
                                        <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                                        <ListItemText>{user.name}</ListItemText>
                                    </MenuItem>
                                    {(user.role === "1995" || user.role === "1996") && (
                                        <MenuItem onClick={() => { navigate("/dashboard"); closeMenu("anchorEl")(); }}>
                                            <ListItemIcon><DashboardIcon /></ListItemIcon>
                                            <ListItemText>{t("dashboard")}</ListItemText>
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={handleLogOut}>
                                        <ListItemIcon><LogoutIcon /></ListItemIcon>
                                        <ListItemText>{t("logout")}</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>

                    {/* Mobile Menu & Language */}
                    {isMobile && (
                        <Box sx={{ position: "absolute", left: "80%", display: "flex", alignItems: "center" }}>
                            <Tooltip title={t("language")}>
                                <IconButton onClick={openMenu("langMenuAnchor")}><LanguageIcon /></IconButton>
                            </Tooltip>
                            <Menu anchorEl={menus.langMenuAnchor} open={Boolean(menus.langMenuAnchor)} onClose={closeMenu("langMenuAnchor")}>
                                <MenuItem onClick={() => changeLanguage("en")}>🇺🇸 English</MenuItem>
                                <MenuItem onClick={() => changeLanguage("ar")}>🇸🇦 العربية</MenuItem>
                            </Menu>
                            <IconButton onClick={openMenu("mobileMenuAnchor")}><MenuIcon /></IconButton>
                        </Box>
                    )}
                    <Menu anchorEl={menus.mobileMenuAnchor} open={Boolean(menus.mobileMenuAnchor)} onClose={closeMenu("mobileMenuAnchor")}>
                        {navLinks.map((item) =>
                            item.to ? (
                                <MenuItem key={item.label} component={Link} to={item.to} onClick={closeMenu("mobileMenuAnchor")}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText>{item.label}</ListItemText>
                                </MenuItem>
                            ) : (
                                <MenuItem key={item.label} onClick={() => { item.onClick(); closeMenu("mobileMenuAnchor")(); }}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText>{item.label}</ListItemText>
                                </MenuItem>
                            )
                        )}
                        {!token ? (
                            <Box sx={{ p: 2 }}>
                                <Button fullWidth variant="outlined" color="error" startIcon={<PersonAddAltIcon />}
                                    onClick={() => { navigate("/register"); closeMenu("mobileMenuAnchor")(); }}
                                    sx={{ mb: 1, borderRadius: 3, fontWeight: 600 }}
                                >
                                    {t("signIn")}
                                </Button>
                                <Button fullWidth variant="contained" color="error" startIcon={<LoginIcon />}
                                    onClick={() => { navigate("/login"); closeMenu("mobileMenuAnchor")(); }}
                                    sx={{ borderRadius: 3, fontWeight: 600 }}
                                >
                                    {t("login")}
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ p: 2 }}>
                                <MenuItem disabled>
                                    <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                                    <ListItemText>{user.name}</ListItemText>
                                </MenuItem>
                                {(user.role === "1995" || user.role === "1996") && (
                                    <MenuItem onClick={() => { navigate("/dashboard"); closeMenu("mobileMenuAnchor")(); }}>
                                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                                        <ListItemText>{t("dashboard")}</ListItemText>
                                    </MenuItem>
                                )}
                                <MenuItem onClick={() => { handleLogOut(); closeMenu("mobileMenuAnchor")(); }}>
                                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                                    <ListItemText>{t("logout")}</ListItemText>
                                </MenuItem>
                            </Box>
                        )}
                    </Menu>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
