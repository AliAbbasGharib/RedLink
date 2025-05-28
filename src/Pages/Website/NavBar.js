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
    Badge,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
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
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import { LOGOUT, NOTIFICATIONS, USER } from "../../API/Api";
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

    useEffect(() => {
        if (token) {
            Axios.get(USER)
                .then((res) => {
                    setName(res.data.name);
                    setRole(res.data.role);
                })
                .catch(() => { });

            fetchNotifications();
        }
    }, [token]);

    const fetchNotifications = async () => {
        try {
            const response = await Axios.get(NOTIFICATIONS);
            setNotifications(response.data.notifications || []);
            const unread = response.data.notifications?.filter(n => !n.read).length || 0;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const handleNotifMenuOpen = (event) => {
        setNotifAnchorEl(event.currentTarget);
        setUnreadCount(0);
    };
    const handleNotifMenuClose = () => setNotifAnchorEl(null);
    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleMobileMenuOpen = (event) => setMobileMenuAnchor(event.currentTarget);
    const handleMobileMenuClose = () => setMobileMenuAnchor(null);
    const handleLangMenuOpen = (event) => setLangMenuAnchor(event.currentTarget);
    const handleLangMenuClose = () => setLangMenuAnchor(null);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        handleLangMenuClose();
    };

    const handleRegister = () => navigate("/register");
    const handleLogin = () => navigate("/login");

    async function handleLogOut() {
        try {
            await Axios.post(LOGOUT);
            cookie.remove("token");
            window.location.pathname = "/login";
        } catch (error) {
            console.log(error);
        }
    }

    const navLinks = [
        { label: t("home"), to: "/", icon: <HomeIcon sx={{ marginInlineEnd: 1 }} /> },
        { label: t("requestBlood"), to: "/request-blood", icon: <BloodtypeIcon sx={{ marginInlineEnd: 1 }} /> },
        { label: t("giveBlood"), to: "/give-blood", icon: <VolunteerActivismIcon sx={{ marginInlineEnd: 1 }} /> },
        { label: t("aboutUs"), onClick: onAboutClick, icon: <InfoIcon sx={{ marginInlineEnd: 1 }} /> },
        { label: t("contactUs"), to: "/contact", icon: <ContactMailIcon sx={{ marginInlineEnd: 1 }} /> },
    ];

    return (
        <AppBar position="fixed" color="inherit" elevation={2} sx={{ borderBottom: "1px solid #eee" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
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
                                        notifications.map((notif, index) => (
                                            <MenuItem key={index} onClick={handleNotifMenuClose} sx={{ whiteSpace: "normal", py: 1 }}>
                                                {notif.body || JSON.stringify(notif)}
                                            </MenuItem>
                                        ))
                                    )}
                                </Menu>
                            </>
                        )}

                        {!isMobile && (
                            <>
                                {!token && (
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
                            </>
                        )}

                        {token && (
                            <>
                                <Tooltip title={name || t("account")}>
                                    <IconButton onClick={handleMenuOpen} sx={{ p: 0, ml: 1 }}>
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
                                    <MenuItem
                                        style={{ display: role === "1995" || role === "1996" ? "flex" : "none" }}
                                        onClick={() => {
                                            navigate("/dashboard");
                                            handleMenuClose();
                                        }}
                                    >
                                        <ListItemIcon>
                                            <DashboardIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>{t("dashboard")}</ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogOut}>
                                        <ListItemIcon>
                                            <LogoutIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>{t("logout")}</ListItemText>
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>

                    {isMobile && (
                        <>
                        <div style={{
                            position:"absolute",
                            left:"80%",
                            display:"flex",
                            alignItems:'center',

                        }}>
                            <Tooltip title={t("language")} >
                                <IconButton onClick={handleLangMenuOpen} color="inherit">
                                    <LanguageIcon />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={langMenuAnchor}
                                open={Boolean(langMenuAnchor)}
                                onClose={handleLangMenuClose}
                            >
                                <MenuItem onClick={() => changeLanguage("en")}>🇺🇸 English</MenuItem>
                                <MenuItem onClick={() => changeLanguage("ar")}>🇸🇦 العربية</MenuItem>
                            </Menu>

                            <IconButton size="large" color="inherit" onClick={handleMobileMenuOpen} >
                                <MenuIcon />
                            </IconButton>
                            </div>
                            <Menu anchorEl={mobileMenuAnchor} open={Boolean(mobileMenuAnchor)} onClose={handleMobileMenuClose}>
                                {navLinks.map((item) =>
                                    item.to ? (
                                        <MenuItem
                                            key={item.label}
                                            component={Link}
                                            to={item.to}
                                            onClick={handleMobileMenuClose}
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
                                        >
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText>{item.label}</ListItemText>
                                        </MenuItem>
                                    )
                                )}

                                {!token ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            color="error"
                                            startIcon={<PersonAddAltIcon />}
                                            onClick={() => { handleRegister(); handleMobileMenuClose(); }}
                                            sx={{ mb: 1, borderRadius: 3, fontWeight: 600 }}
                                        >
                                            {t("signIn")}
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="error"
                                            startIcon={<LoginIcon />}
                                            onClick={() => { handleLogin(); handleMobileMenuClose(); }}
                                            sx={{ borderRadius: 3, fontWeight: 600 }}
                                        >
                                            {t("login")}
                                        </Button>
                                    </Box>
                                ) : (
                                    <>
                                        <MenuItem disabled>
                                            <ListItemIcon>
                                                <AccountCircleIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>{name}</ListItemText>
                                        </MenuItem>
                                        <MenuItem
                                            style={{ display: role === "1995" || role === "1996" ? "flex" : "none" }}
                                            onClick={() => {
                                                navigate("/dashboard");
                                                handleMobileMenuClose();
                                            }}
                                        >
                                            <ListItemIcon>
                                                <DashboardIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>{t("dashboard")}</ListItemText>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleLogOut();
                                                handleMobileMenuClose();
                                            }}
                                        >
                                            <ListItemIcon>
                                                <LogoutIcon fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>{t("logout")}</ListItemText>
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
