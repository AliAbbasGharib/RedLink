import React, { useEffect, useState } from "react";
import {
    Button,
    CircularProgress,
    Container,
    Typography,
    Paper,
    Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ANSWERS, SUBMITDONATION } from "../../../API/Api";
import { Axios } from "../../../API/Axios";
import NavBar from "../NavBar";

export default function BloodDonationEligibilityForm() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [eligible, setEligible] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        Axios.get(ANSWERS)
            .then((res) => {
                setQuestions(res.data.questions || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch questions", err);
                setError("Failed to load questions.");
                setLoading(false);
            });
    }, []);

    function handleAnswer(answer) {
        const question = questions[currentIndex];
        setAnswers((prev) => [
            ...prev,
            { questionId: question._id, answer: answer.toLowerCase() },
        ]);
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            submitAnswers([
                ...answers,
                { questionId: question._id, answer: answer.toLowerCase() },
            ]);
        }
    }

    function submitAnswers(allAnswers) {
        setSubmitting(true);
        Axios.post(SUBMITDONATION, { answers: allAnswers })
            .then((res) => {
                const result = res.data.eligible;
                setEligible(result);
                setSubmitting(false);
                // Redirect after 5 seconds
                setTimeout(() => {
                    navigate("/");
                }, 5000);
            })
            .catch((err) => {
                console.error("Failed to submit answers", err);
                setError("Failed to submit answers.");
                setSubmitting(false);
            });
    }

    if (loading || submitting)
        return (
            <Container sx={{ mt: 8, textAlign: "center" }}>
                <CircularProgress thickness={5} size={60} sx={{ color: "red" }} />
                <Typography variant="h6" mt={3} color="text.secondary">
                    {loading ? "Loading questions..." : "Submitting your answers..."}
                </Typography>
            </Container>
        );

    if (error)
        return (
            <Container sx={{ mt: 8 }}>
                <Paper elevation={4} sx={{ p: 4, backgroundColor: "#fff3f3" }}>
                    <Typography variant="h5" color="error" align="center">
                        {error}
                    </Typography>
                </Paper>
            </Container>
        );

    if (eligible !== null) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper
                    elevation={5}
                    sx={{
                        p: 5,
                        borderRadius: 4,
                        textAlign: "center",
                        backgroundColor: "#f0f4ff",
                    }}
                >
                    <Typography variant="h4" gutterBottom fontWeight="bold" color="primary.main">
                        Eligibility Result
                    </Typography>
                    {eligible ? (
                        <Typography variant="h6" color="success.main">
                            ✅ You are eligible to donate blood. Thank you!
                        </Typography>
                    ) : (
                        <Typography variant="h6" color="error.main">
                            ❌ Sorry, you are currently not eligible to donate blood.
                            <br />
                            You will be redirected shortly...
                        </Typography>
                    )}
                </Paper>
            </Container>
        );
    }

    const question = questions[currentIndex];
    return (
        <>
            <NavBar />
            <Container
                maxWidth="sm"
                sx={{
                    mt: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "70vh",
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: 5,
                        borderRadius: 4,
                        bgcolor: "#fdfdfd",
                        boxShadow: "0px 8px 24px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease-in-out",
                        width: "100%",
                    }}
                >
                    <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
                        Blood Donation Eligibility
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            mb: 5,
                            textAlign: "center",
                            fontSize: "1.25rem",
                            color: "text.secondary",
                        }}
                    >
                        {question.text}
                    </Typography>

                    <Stack direction="row" spacing={4} justifyContent="center">
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={() => handleAnswer("yes")}
                            sx={{ px: 5, py: 1.5 }}
                        >
                            Yes
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="large"
                            onClick={() => handleAnswer("no")}
                            sx={{ px: 5, py: 1.5 }}
                        >
                            No
                        </Button>
                    </Stack>

                    <Typography
                        variant="body2"
                        mt={4}
                        align="center"
                        color="text.secondary"
                    >
                        Question {currentIndex + 1} of {questions.length}
                    </Typography>
                </Paper>
            </Container>
        </>
    );
}
