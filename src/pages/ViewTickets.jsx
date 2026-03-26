import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import {
  FlightTakeoff,
  FlightLand,
  Person,
  EventSeat,
  ConfirmationNumber,
  CalendarToday,
  AccessTime,
  ArrowForward,
  Refresh,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Luxury Color Palette
const colors = {
  navy: '#0a1628',
  navyLight: '#1a2942',
  gold: '#c9a962',
  goldLight: '#e0c78a',
  white: '#ffffff',
  gray: '#f5f5f5',
  textGray: '#8a8f98',
};

export default function ViewTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all tickets for the user
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:8000/tickets/my-tickets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        setTickets(res.data.tickets || []);
      } else {
        setError(res.data?.message || "Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Tickets fetch error:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 403) {
        setError("Access denied. Please login to view tickets.");
      } else {
        setError(error.response?.data?.message || "Error loading tickets. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTickets();
    } else {
      setLoading(false);
      setError("Please login to view your tickets");
    }
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: colors.navy }}>
        <Box sx={{ borderBottom: `1px solid ${colors.navyLight}` }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  color: colors.gold,
                  fontWeight: 300,
                  letterSpacing: '0.3em',
                  fontFamily: '"Playfair Display", Georgia, serif',
                }}
              >
                SKYBOOK
              </Typography>
            </Box>
          </Container>
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}>
          <CircularProgress sx={{ color: colors.gold }} size={60} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.navy }}>
      {/* Luxury Header */}
      <Box sx={{ borderBottom: `1px solid ${colors.navyLight}` }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
            <Typography
              variant="h4"
              sx={{
                color: colors.gold,
                fontWeight: 300,
                letterSpacing: '0.3em',
                fontFamily: '"Playfair Display", Georgia, serif',
                cursor: 'pointer',
                '&:hover': { color: colors.goldLight },
                transition: 'color 0.3s',
              }}
              onClick={() => navigate('/home')}
            >
              SKYBOOK
            </Typography>
            <Box sx={{ display: 'flex', gap: 6 }}>
              <Typography
                sx={{
                  color: colors.white,
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  '&:hover': { color: colors.gold },
                  transition: 'color 0.3s',
                }}
                onClick={() => navigate('/airports')}
              >
                Airports
              </Typography>
              <Typography
                sx={{
                  color: colors.white,
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  '&:hover': { color: colors.gold },
                  transition: 'color 0.3s',
                }}
                onClick={() => navigate('/home')}
              >
                Flights
              </Typography>
              <Typography
                sx={{
                  color: colors.white,
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  '&:hover': { color: colors.gold },
                  transition: 'color 0.3s',
                }}
                onClick={() => navigate('/reviews')}
              >
                Reviews
              </Typography>
            </Box>
            <Button
              sx={{
                color: colors.gold,
                border: `1px solid ${colors.gold}`,
                borderRadius: 0,
                px: 4,
                py: 1,
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                '&:hover': { bgcolor: colors.gold, color: colors.navy },
                transition: 'all 0.3s',
              }}
            >
              SIGN IN
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ flex: 1, py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="overline"
                sx={{ color: colors.gold, letterSpacing: '0.5em', fontSize: '0.75rem', display: 'block', mb: 1 }}
              >
                YOUR JOURNEYS
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  textAlign: { xs: "center", md: "left" },
                  fontWeight: 300,
                  color: colors.white,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                My Tickets
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchTickets}
              disabled={loading}
              sx={{
                borderRadius: 0,
                textTransform: "none",
                fontWeight: 600,
                alignSelf: { xs: "center", md: "flex-start" },
                color: colors.gold,
                borderColor: colors.gold,
                '&:hover': { bgcolor: colors.gold, color: colors.navy, borderColor: colors.gold },
              }}
            >
              Refresh
            </Button>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 0, bgcolor: colors.navyLight, color: colors.white, border: `1px solid ${colors.gold}` }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={fetchTickets}
                  startIcon={<Refresh />}
                  sx={{ color: colors.gold }}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {tickets.length === 0 && !error ? (
            <Paper
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 0,
                bgcolor: colors.navyLight,
                border: `1px solid ${colors.gold}40`,
              }}
            >
              <FlightTakeoff sx={{ fontSize: 80, color: colors.gold, mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: colors.white }}>
                No Tickets Found
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: colors.textGray }}>
                You haven't booked any flights yet. Start your journey today!
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/home")}
                sx={{
                  bgcolor: colors.navy,
                  color: colors.gold,
                  border: `1px solid ${colors.gold}`,
                  borderRadius: 0,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  '&:hover': { bgcolor: colors.gold, color: colors.navy },
                }}
              >
                Book a Flight
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {tickets.map((ticket, index) => (
                <Grid item xs={12} key={ticket._id || index}>
                  <Card
                    sx={{
                      borderRadius: 0,
                      overflow: "hidden",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                      transition: "transform 0.3s ease",
                      bgcolor: colors.white,
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      {/* Ticket Header */}
                      <Box
                        sx={{
                          p: 3,
                          background: colors.navy,
                          color: colors.white,
                          borderBottom: `1px solid ${colors.gold}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <FlightTakeoff sx={{ color: colors.gold }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: colors.white }}>
                              SkyBook Flight
                            </Typography>
                          </Box>
                          <Chip
                            label={ticket.status || "Confirmed"}
                            sx={{
                              bgcolor: colors.gold,
                              color: colors.navy,
                              fontWeight: 600,
                              borderRadius: 0,
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Flight Details */}
                      <Box sx={{ p: { xs: 2, md: 3 } }}>
                        <Grid container spacing={2} alignItems="center">
                          {/* From */}
                          <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: "center", mb: { xs: 2, md: 0 } }}>
                              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", md: "2rem" }, color: colors.navy }}>
                                {ticket.flight?.source || "N/A"}
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.textGray }}>
                                {ticket.flight?.sourceAirport || "Source Airport"}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* Flight Icon */}
                          <Grid item xs={12} md={2}>
                            <Box sx={{ textAlign: "center", mb: { xs: 2, md: 0 } }}>
                              <ArrowForward sx={{ fontSize: { xs: 30, md: 40 }, color: colors.gold }} />
                              <Typography variant="body2" sx={{ color: colors.textGray }}>
                                {ticket.flight?.duration || "--"}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* To */}
                          <Grid item xs={12} md={3}>
                            <Box sx={{ textAlign: "center", mb: { xs: 2, md: 0 } }}>
                              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", md: "2rem" }, color: colors.navy }}>
                                {ticket.flight?.destination || "N/A"}
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.textGray }}>
                                {ticket.flight?.destinationAirport || "Dest Airport"}
                              </Typography>
                            </Box>
                          </Grid>

                          {/* Ticket Info */}
                          <Grid item xs={12} md={4}>
                            <Box
                              sx={{
                                p: { xs: 1.5, md: 2 },
                                borderRadius: 0,
                                bgcolor: colors.gray,
                                border: `1px solid ${colors.navyLight}`,
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <CalendarToday fontSize="small" sx={{ color: colors.gold }} />
                                <Typography variant="body2" sx={{ color: colors.navy }}>
                                  {formatDate(ticket.flight?.date)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                <AccessTime fontSize="small" sx={{ color: colors.gold }} />
                                <Typography variant="body2" sx={{ color: colors.navy }}>
                                  {formatTime(ticket.flight?.departureTime)} - {formatTime(ticket.flight?.arrivalTime)}
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <EventSeat fontSize="small" sx={{ color: colors.gold }} />
                                <Typography variant="body2" sx={{ color: colors.navy }}>
                                  Seat: {ticket.seat || "Not assigned"}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: { xs: 2, md: 3 }, borderColor: colors.navyLight }} />

                        {/* Passenger & Ticket Info */}
                        <Grid container spacing={{ xs: 2, md: 2 }}>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: { xs: 2, sm: 0 } }}>
                              <Person sx={{ color: colors.gold }} />
                              <Box>
                                <Typography variant="body2" sx={{ color: colors.textGray }}>
                                  Passenger
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: "0.9rem", md: "1rem" }, color: colors.navy }}>
                                  {ticket.user?.name || ticket.user || "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <ConfirmationNumber sx={{ color: colors.gold }} />
                              <Box>
                                <Typography variant="body2" sx={{ color: colors.textGray }}>
                                  Ticket Number
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: "0.9rem", md: "1rem" }, color: colors.navy }}>
                                  {ticket._id?.slice(-8).toUpperCase() || "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Price */}
                        <Box
                          sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 0,
                            bgcolor: colors.navy,
                            color: colors.white,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            border: `1px solid ${colors.gold}`,
                          }}
                        >
                          <Typography variant="h6" sx={{ color: colors.gold }}>Total Paid</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: colors.gold }}>
                            ₹{ticket.flight?.price || ticket.amount || "0"}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: colors.navy, borderTop: `1px solid ${colors.navyLight}` }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ color: colors.gold, fontFamily: '"Playfair Display", serif', fontSize: '1.5rem' }}>
              SKYBOOK
            </Typography>
            <Typography sx={{ color: colors.textGray, fontSize: '0.8rem' }}>
              © 2026 SkyBook. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
