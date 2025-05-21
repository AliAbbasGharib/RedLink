import React, { useEffect, useRef, useState } from "react";
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Typography,
    Box,
    Badge,
    useTheme,
    useMediaQuery,
    Fade,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import NavBar from './NavBar';
import Footer from './Footer';

export default function Home() {
    const cardRefs = useRef([]);
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));

    // Card animation on scroll
    useEffect(() => {
        cardRefs.current = cardRefs.current.slice(0, 3);
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('mui-card-animate');
                    }
                });
            },
            { threshold: 0.5 }
        );
        cardRefs.current.forEach((card) => card && observer.observe(card));
        return () => observer.disconnect();
    }, []);

    // About section animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.4 }
        );
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <NavBar onAboutClick={() => {
                sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }} />

            {/* Hero Section */}
            <Box
                sx={{
                    minHeight: "60vh",
                    background: "linear-gradient(120deg, #c01717 60%, #e3e9f7 100%)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    py: { xs: 6, md: 10 },
                }}
            >
                <Container>
                    <Grid container alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Box mb={3} mt={5}>
                                <Badge
                                    badgeContent="NEW"
                                    color="warning"
                                    sx={{ mr: 2, fontWeight: 700 }}
                                />
                                <Typography variant="subtitle1" component="span">
                                    Stay connected to receive donations
                                </Typography>
                            </Box>
                            <Typography
                                variant={isSm ? "h4" : "h2"}
                                fontWeight="bold"
                                gutterBottom
                                sx={{
                                    textShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    mb: 2,
                                }}
                            >
                                Every dot blinking is someone in need of blood,{" "}
                                <Box component="span" sx={{ color: "#ffe082" }}>now</Box>.
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{ color: "rgb(240, 232, 232)" }}
                            >
                                Check the live map and help save a life.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Info Section */}
            <Container sx={{ py: 6 }}>
                <Grid container alignItems="center" spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" color="error" gutterBottom>
                            No one should stress or even die from a blood shortage in Lebanon
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Much blood has been wasted in the streets of Lebanon throughout its history.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Yet, blood banks are almost empty and families of patients in need of blood struggle to find potential donors, every day.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            The pressure of finding blood for a loved one is an added burden the families should not bear alone.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Our mission is to improve the anonymous and voluntary blood donation system in Lebanon, and for that, we created a movement.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src="https://dsclebanon.org/static/assets/images/all-lives/all_lives_en.gif"
                            alt="Our Team"
                            sx={{
                                width: "100%",
                                borderRadius: 3,
                                boxShadow: 3,
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>

            {/* Card Section */}
            <Box sx={{ background: "#f8f9fa", py: 6 }}>
                <Container>
                    <Typography
                        variant="h4"
                        color="error"
                        align="center"
                        fontWeight="bold"
                        mb={4}
                    >
                        Roll up your sleeves and join the movement!
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {/* Card 1 */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                ref={el => cardRefs.current[0] = el}
                                sx={{
                                    height: "100%",
                                    borderRadius: 3,
                                    boxShadow: 4,
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-8px) scale(1.03)",
                                        boxShadow: 8,
                                    },
                                }}
                                className="mui-card"
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image="https://media.istockphoto.com/id/1492669234/photo/mid-adult-man-taking-iv-drip-in-the-hospital.jpg?s=1024x1024&w=is&k=20&c=II5HQ-_A94XjkZbXHQtAmZ7T54Rb3CKJRXpmHGkgjgc="
                                    alt="Give Blood"
                                />
                                <CardContent>
                                    <Typography variant="h6" color="error" fontWeight="bold">
                                        Give Blood
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Make it your new healthy and life-saving habit!
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            borderRadius: 5,
                                            fontWeight: 600,
                                            textTransform: "none",
                                            ml: 1,
                                        }}
                                    >
                                        Donate Blood
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        {/* Card 2 */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                ref={el => cardRefs.current[1] = el}
                                sx={{
                                    height: "100%",
                                    borderRadius: 3,
                                    boxShadow: 4,
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-8px) scale(1.03)",
                                        boxShadow: 8,
                                    },
                                }}
                                className="mui-card"
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image="https://media.istockphoto.com/id/534831801/photo/phlebotomist-preparing-patient-to-donate-blood-in-hospital-lab.jpg?s=1024x1024&w=is&k=20&c=L7gowzIqovSPAYGbLp5luoh1Jyd5G9Bi-e-OZRKNj0g="
                                    alt="Give Time"
                                />
                                <CardContent>
                                    <Typography variant="h6" color="error" fontWeight="bold">
                                        Give Time
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Want to become an active citizen in your community?
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            borderRadius: 5,
                                            fontWeight: 600,
                                            textTransform: "none",
                                            ml: 1,
                                        }}
                                    >
                                        Read More
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                        {/* Card 3 */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Card
                                ref={el => cardRefs.current[2] = el}
                                sx={{
                                    height: "100%",
                                    borderRadius: 3,
                                    boxShadow: 4,
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-8px) scale(1.03)",
                                        boxShadow: 8,
                                    },
                                }}
                                className="mui-card"
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image="https://media.istockphoto.com/id/1382944449/photo/hands-holding-a-heart.jpg?s=1024x1024&w=is&k=20&c=feMfwoDF9jANGjc019fRxrZo0pCwo0ukcuAQJvb_w6w="
                                    alt="Give Space"
                                />
                                <CardContent>
                                    <Typography variant="h6" color="error" fontWeight="bold">
                                        Give Space
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Use your space to spread awareness and encourage
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            borderRadius: 5,
                                            fontWeight: 600,
                                            textTransform: "none",
                                            ml: 1,
                                        }}
                                    >
                                        Read More
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* About Us Section */}
            <Fade in={isVisible} timeout={1000}>
                <Box
                    ref={sectionRef}
                    id="about"
                    sx={{
                        background: "#fff",
                        borderRadius: 4,
                        boxShadow: 3,
                        my: 6,
                        py: 6,
                    }}
                >
                    <Container>
                        <Grid container alignItems="center" spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h4" color="error" gutterBottom>
                                    About Us
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    At <strong>LifePulse</strong>, our mission is to connect generous donors with those in urgent need of blood.
                                    We believe that one drop can make a world of difference, and our platform helps facilitate safe, quick, and impactful donations.
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    Founded in 2025, we aim to bridge the gap between blood donors and hospitals, ensuring no life is lost due to shortage.
                                    Join us in this life-saving journey and become a hero today.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box
                                    component="img"
                                    src="https://media.istockphoto.com/id/1304993981/photo/donate-on-a-red-background.jpg?s=1024x1024&w=is&k=20&c=ihtZTKrOtlne5gd7abL413xKMfwoCw0XkZb0EHmSXUI="
                                    alt="Our Team"
                                    sx={{
                                        width: "100%",
                                        borderRadius: 3,
                                        boxShadow: 3,
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Fade>
            <Footer />
        </>
    );
}