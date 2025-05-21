import { Container, Grid, Typography, Link, Box, IconButton, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: "#f5f6fa", color: "#222", pt: 6, pb: 3, mt: 8 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" sx={{ color: "red", fontWeight: "bold", mb: 1 }}>
                            →RedLink
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                            Stay Connected
                        </Typography>
                        <Box>
                            <IconButton href="#" sx={{ color: "#4267B2", "&:hover": { color: "#29487d" } }}>
                                <FacebookIcon />
                            </IconButton>
                            <IconButton href="#" sx={{ color: "#E1306C", "&:hover": { color: "#ad1457" } }}>
                                <InstagramIcon />
                            </IconButton>
                            <IconButton href="#" sx={{ color: "#1DA1F2", "&:hover": { color: "#0d8ddb" } }}>
                                <TwitterIcon />
                            </IconButton>
                            <IconButton href="#" sx={{ color: "#FF0000", "&:hover": { color: "#b71c1c" } }}>
                                <YouTubeIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                            PAGES
                        </Typography>
                        <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                            {[
                                { label: "Home", href: "/" },
                                { label: "About Us", href: "/about" },
                                { label: "Give Blood", href: "/give-blood" },
                                { label: "Request Blood", href: "/request-blood" },
                                { label: "Contact Us", href: "/contact" },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        underline="hover"
                                        color="inherit"
                                        sx={{
                                            transition: "color 0.2s",
                                            "&:hover": { color: "red", pl: 1 },
                                            fontWeight: 500,
                                            display: "inline-block",
                                            py: 0.5,
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                            ACCOUNT
                        </Typography>
                        <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                            {[
                                { label: "Register", href: "/register" },
                                { label: "Login", href: "/login" },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        underline="hover"
                                        color="inherit"
                                        sx={{
                                            transition: "color 0.2s",
                                            "&:hover": { color: "red", pl: 1 },
                                            fontWeight: 500,
                                            display: "inline-block",
                                            py: 0.5,
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                            TEMPLATE
                        </Typography>
                        <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                            {[
                                { label: "Style Guide", href: "#" },
                                { label: "License", href: "#" },
                                { label: "Changelog", href: "#" },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        underline="hover"
                                        color="inherit"
                                        sx={{
                                            transition: "color 0.2s",
                                            "&:hover": { color: "red", pl: 1 },
                                            fontWeight: 500,
                                            display: "inline-block",
                                            py: 0.5,
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 4 }} />
                <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                        © →RedLink. All Rights Reserved. 2025.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}