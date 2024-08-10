"use client";

import React, { useEffect, useState } from "react";
import { Box, Fab, Dialog, DialogContent, DialogTitle, Typography, Slider, DialogActions, Button } from "@mui/material";
import { Chat } from "@mui/icons-material";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Chatbot from "./components/Chatbot";

export default function Home() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState(3); // Default feedback value

  const handleSetOpen = () => {
    setOpen(true);
  };

  const handleSetClose = () => {
    setOpen(false);
    setFeedbackOpen(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackOpen(false);
    // Here you can handle the feedback submission, e.g., send it to your backend
    console.log(`User feedback: ${feedback}`);
  };

  const handleFeedbackChange = (event, newValue) => {
    setFeedback(newValue);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        {/* Floating Action Button to open chatbot or redirect to login */}
        <Fab
          aria-label="chat"
          onClick={handleSetOpen}
          style={{
            position: "fixed",
            bottom: 90,
            right: 16,
            borderRadius: "15px",
            width: "fit-content",
            padding: "8px",
            backgroundColor: "#26a69a",
            gap: "5px"
          }}
        >
          <span>have a question?</span>
          <Chat />
        </Fab>

        {/* Dialog for Chatbot */}
        <Dialog
          open={open}
          onClose={handleSetClose}
          maxWidth={false}
        >
          <DialogTitle>Chat with Us</DialogTitle>
          <DialogContent>
            {user ? <Chatbot /> : <Login />}{" "}
            {/* Show Chatbot or Login depending on the user's state */}
          </DialogContent>
        </Dialog>

        {/* Feedback Dialog */}
      <Dialog
        open={feedbackOpen}
        onClose={handleFeedbackClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rate Your Chat Experience</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Please rate your experience on a scale of 1-5:
          </Typography>
          <Slider
            value={feedback}
            onChange={handleFeedbackChange}
            aria-labelledby="feedback-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={5}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFeedbackClose} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
        <Footer />
      </Box>
    </>
  );
}
