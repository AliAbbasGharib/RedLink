import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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

    // Helper to split the hero title string and highlight "now" with styling
    const renderHeroTitle = () => {
        const fullTitle = t('hero.title');
        const highlight = t('hero.highlight');
        const parts = fullTitle.split(highlight);

        return parts.map((part, index) =>
            index < parts.length - 1 ? (
                <React.Fragment key={index}>
                    {part}
                    <Box component="span" sx={{ color: "#ffe082" }}>{highlight}</Box>
                </React.Fragment>
            ) : (
                part
            )
        );
    };

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
                    <Grid container alignItems="center" >
                        <Grid item xs={12} md={8}>
                            <Box mb={3} mt={5}>
                                <Badge
                                    badgeContent={t('hero.badge')}
                                    color="warning"
                                    sx={{ mr: 2, fontWeight: 700 }}
                                />
                                <Typography variant="subtitle1" component="span">
                                    {t('hero.subtitle')}
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
                                {renderHeroTitle()}
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{ color: "rgb(240, 232, 232)" }}
                            >
                                {t('hero.description')}
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
                            {t('infoSection.title')}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {t('infoSection.paragraph1')}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {t('infoSection.paragraph2')}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {t('infoSection.paragraph3')}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {t('infoSection.paragraph4')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src="https://dsclebanon.org/static/assets/images/all-lives/all_lives_en.gif"
                            alt={t('about.title')}
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
                        {t('joinMovement')}
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
                                    alt={t('cards.card1.title')}
                                />
                                <CardContent>
                                    <Typography variant="h6" color="error" fontWeight="bold">
                                        {t('cards.card1.title')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('cards.card1.description')}
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
                                        {t('cards.card1.button')}
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
                                    alt={t('cards.card2.title')}
                                />
                                <CardContent>
                                    <Typography variant="h6" color="error" fontWeight="bold">
                                        {t('cards.card2.title')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('cards.card2.description')}
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
                                        {t('cards.card2.button')}
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
                                    image="https://media.istockphoto.com/id/534831801/photo/phlebotomist-preparing-patient-to-donate-blood-in-hospital-lab.jpg?s=1024x1024&w=is&k=20&c=L7gowzIqovSPAYGbLp5luoh1Jyd5G9Bi-e-OZRKNj0g="
                                    alt={t('cards.card3.title')}
                                />
                                <CardContent>
                                    <Typography variant="h6" color="error" fontWeight="bold">
                                        {t('cards.card3.title')}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('cards.card3.description')}
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
                                        {t('cards.card3.button')}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* About Us Section */}
            <Container
                sx={{
                    py: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "40vh",
                }}
                ref={sectionRef}
            >
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Fade in={isVisible} timeout={800}>
                            <Box>
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    mb={4}
                                    sx={{ color: "error.main" }}
                                >
                                    {t('about.title')}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {t('about.paragraph1')}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {t('about.paragraph2')}
                                </Typography>
                            </Box>
                        </Fade>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Fade in={isVisible} timeout={800} style={{ transitionDelay: "300ms" }}>
                            <Box
                                component="img"
                                src="https://media.istockphoto.com/id/1304993981/photo/donate-on-a-red-background.jpg?s=1024x1024&w=is&k=20&c=ihtZTKrOtlne5gd7abL413xKMfwoCw0XkZb0EHmSXUI="
                                alt={t('about.title')}
                                sx={{
                                    width: "100%",
                                    borderRadius: 3,
                                    boxShadow: 3,
                                }}
                            />
                        </Fade>
                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </>
    );
}
