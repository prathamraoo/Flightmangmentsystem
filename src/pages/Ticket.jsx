import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Ticket() {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking } = location.state || {};

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Ticket from Backend
  const getTicket = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8000/tickets/${booking._id}`
      );

      if (res.data?.success) {
        setTicket(res.data.ticket);
      }

    } catch (error) {
      console.log("Ticket fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (booking?._id) {
      getTicket();
    }
  }, [booking?._id]);

  // Passenger name support for both formats
  const passengerName = ticket?.user?.name || ticket?.user || "N/A";

  if (!booking?._id) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6">No booking found</Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/home")}
        >
          Go Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url(https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: 400,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" mb={3} fontWeight="bold">
          ✈ Flight Ticket
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography sx={{ mb: 1 }}>
              <strong>Passenger:</strong> {passengerName}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <strong>Airport:</strong> {ticket?.airport || "N/A"}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <strong>Flight:</strong> {ticket?.flight || "N/A"}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <strong>Price:</strong> ₹{ticket?.price || "0"}
            </Typography>

            <Typography
              sx={{
                mt: 2,
                color: "green",
                fontWeight: "bold",
              }}
            >
              Ticket Confirmed ✅
            </Typography>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => navigate("/home")}
            >
              Go Home
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}