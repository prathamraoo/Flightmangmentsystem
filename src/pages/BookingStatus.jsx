import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingStatus() {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking, paymentId, success } = location.state || {};
  const [bookingData, setBookingData] = useState(booking || null);

  useEffect(() => {
    console.log('BookingStatus received data:', { booking, paymentId, success });
    
    // Use booking data from payment state immediately
    if (booking) {
      setBookingData(booking);
    } else {
      // If no booking data, create a default one
      setBookingData({
        _id: 'booking-' + Date.now(),
        airport: 'Demo Airport',
        flight: 'Demo Flight',
        price: 0,
        status: 'Confirmed'
      });
    }
  }, [booking]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url(https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>
          Booking Status
        </Typography>

        {success && (
          <Typography color="green" sx={{ mb: 2, textAlign: "center" }}>
            ✅ Payment Successful!
          </Typography>
        )}

        <Typography>Airport: {bookingData?.airport || "N/A"}</Typography>
        <Typography>Flight: {bookingData?.flight || "N/A"}</Typography>
        <Typography>Price: ₹{bookingData?.price || "N/A"}</Typography>

        <Typography color="green" sx={{ mt: 2 }}>
          Status: {bookingData?.status || "Confirmed"}
        </Typography>

        {paymentId && (
          <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
            Payment ID: {paymentId}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => navigate("/home")}
        >
          Back to Home
        </Button>
      </Paper>
    </Box>
  );
}