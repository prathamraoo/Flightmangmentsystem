import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  Chip,
  Fade,
  Skeleton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Flight,
  Schedule,
  AirlineSeatReclineNormal,
  ArrowForward,
  CheckCircle,
  ArrowRight,
    FlightTakeoff,
} from "@mui/icons-material";
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

export default function ViewFlight() {
  const location = useLocation();
  const navigate = useNavigate();

  const { airport, from, to, date } = location.state || {};

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Default Flights for robust experience
  const fallbackFlights = [
    {
      airline: "IndiGo", price: 4500, duration: "2h 30m", availableSeats: 120, category: "economy",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200",
      details: ["On-time Guarantee", "Direct Flight", "Web Check-in"],
      source: "Bangalore", destination: "Kolkata"
    },
    {
      airline: "Air India", price: 5200, duration: "2h 15m", availableSeats: 85, category: "business",
      image: "https://images.pexels.com/photos/6479834/pexels-photo-6479834.jpeg",
      details: ["Premium Service", "Complimentary Meal", "Extra Legroom"],
      source: "Bangalore", destination: "Kolkata"
    },
    {
      airline: "Vistara", price: 4800, duration: "5h 10m", availableSeats: 45, category: "economy",
      image: "https://images.pexels.com/photos/3912838/pexels-photo-3912838.jpeg",
      details: ["In-flight Entertainment", "Gourmet Food", "Direct"],
      source: "Delhi", destination: "Mumbai"
    },
    {
      airline: "SpiceJet", price: 3900, duration: "2h 45m", availableSeats: 60, category: "economy",
      image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1200",
      details: ["Lowest Fares", "Daily Flight"],
      source: "Mumbai", destination: "Hyderabad"
    }
  ];

  useEffect(() => {
    setLoading(true);

    // Build query params
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    axios
      .get(`http://localhost:8000/flights${queryString}`)
      .then((res) => {
        let fetched = res.data?.flights || [];
        if (fetched.length === 0) {
           // Use fallback if API returns nothing for the specific route or in general
           const filtered = fallbackFlights.filter(f => 
             (!from || f.source.toLowerCase().includes(from.toLowerCase())) &&
             (!to || f.destination.toLowerCase().includes(to.toLowerCase()))
           );
           setFlights(filtered.length > 0 ? filtered : fallbackFlights.slice(0, 2));
        } else {
          setFlights(fetched);
        }
      })
      .catch((err) => {
        console.error("Error fetching flights:", err);
        // Fallback on error
        const filtered = fallbackFlights.filter(f => 
          (!from || f.source.toLowerCase().includes(from.toLowerCase())) &&
          (!to || f.destination.toLowerCase().includes(to.toLowerCase()))
        );
        setFlights(filtered.length > 0 ? filtered : fallbackFlights.slice(0, 2));
      })
      .finally(() => setLoading(false));
  }, [from, to]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.navy }}>
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
                onClick={() => navigate('/flights')}
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

      <Box sx={{ py: 8, bgcolor: colors.navy }}>
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                color: colors.gold,
                letterSpacing: '0.5em',
                fontSize: '0.75rem',
                mb: 2,
                display: 'block',
              }}
            >
              SELECT YOUR JOURNEY
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: colors.white,
                fontWeight: 300,
                mb: 3,
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Available Flights
            </Typography>

            {/* Route Info Card */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                background: colors.navyLight,
                border: `1px solid ${colors.gold}`,
                px: 3,
                py: 1,
              }}
            >
              <FlightTakeoff sx={{ color: colors.gold, fontSize: 20 }} />
              <Typography sx={{ color: colors.white, fontWeight: 600, fontSize: "1.1rem" }}>
                {from}
              </Typography>
              <ArrowForward sx={{ color: colors.gold, fontSize: 18 }} />
              <Typography sx={{ color: colors.white, fontWeight: 600, fontSize: "1.1rem" }}>
                {to}
              </Typography>
            </Box>
          </Box>

          {/* Flight Cards Grid */}
          <Grid container spacing={3}>
            {loading
              ? Array.from(new Array(4)).map((_, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={400}
                    sx={{ bgcolor: colors.navyLight }}
                  />
                </Grid>
              ))
              : flights.map((flight, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Fade in timeout={500 + index * 100}>
                    <Card
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                      sx={{
                        height: "100%",
                        borderRadius: 0,
                        overflow: "hidden",
                        position: "relative",
                        cursor: "pointer",
                        bgcolor: colors.white,
                        transition: "all 0.4s ease",
                        transform:
                          hoveredCard === index
                            ? "translateY(-8px)"
                            : "translateY(0)",
                        boxShadow:
                          hoveredCard === index
                            ? `0 25px 50px rgba(0,0,0,0.3)`
                            : "0 10px 30px rgba(0,0,0,0.2)",
                      }}
                    >
                      {/* Image Container */}
                      <Box sx={{ position: "relative", height: 220 }}>
                        <Box
                          component="img"
                          src={flight.image}
                          alt={flight.airline}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.6s ease",
                            transform:
                              hoveredCard === index ? "scale(1.1)" : "scale(1)",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(to bottom, transparent 0%, rgba(10,22,40,0.8) 100%)",
                          }}
                        />

                        {/* Airline Badge */}
                        <Chip
                          icon={<Flight sx={{ fontSize: 16, color: colors.navy }} />}
                          label={flight.airline}
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            background: colors.gold,
                            color: colors.navy,
                            fontWeight: 600,
                          }}
                        />

                        {/* Duration Badge */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            background: colors.navy,
                            color: colors.gold,
                            px: 2,
                            py: 0.5,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            border: `1px solid ${colors.gold}`,
                          }}
                        >
                          <Schedule sx={{ fontSize: 16 }} />
                          {flight.duration}
                        </Box>

                        {/* Price on Image */}
                        <Typography
                          variant="h4"
                          sx={{
                            position: "absolute",
                            bottom: 16,
                            left: 16,
                            color: colors.white,
                            fontWeight: 700,
                          }}
                        >
                          ₹{flight.price}
                        </Typography>
                      </Box>

                      {/* Card Content */}
                      <CardContent sx={{ p: 3 }}>
                        {/* Spacer if needed */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* Info Row */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 3,
                            p: 2,
                            background: colors.gray,
                          }}
                        >
                          <Box sx={{ display: "flex", flex: 1, flexDirection: 'column', alignItems: "center", borderRight: `1px solid ${colors.gray}` }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <AirlineSeatReclineNormal sx={{ color: colors.navy, fontSize: 24 }} />
                               <Typography sx={{ color: colors.navy, fontWeight: 900, fontSize: '1.4rem' }}>
                                 {flight.availableSeats || flight.seats}
                               </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: colors.textGray, fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                              AVAILABLE SEATS
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", flex: 1, flexDirection: 'column', alignItems: "center" }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <Typography sx={{ color: colors.gold, fontWeight: 900, fontSize: '1.4rem' }}>₹</Typography>
                               <Typography sx={{ color: colors.navy, fontWeight: 900, fontSize: '1.2rem' }}>
                                 Best Price
                               </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: colors.textGray, fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                              GUARANTEED
                            </Typography>
                          </Box>
                        </Box>

                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() =>
                            navigate("/seat-booking", {
                              state: {
                                flight: flight,
                                from,
                                to,
                                date,
                                travelers: location.state?.travelers || 1,
                                cabinClass: location.state?.cabinClass || "Economy",
                              },
                            })
                          }
                          sx={{
                            py: 1.5,
                            borderRadius: 0,
                            background: colors.navy,
                            color: colors.gold,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            fontSize: "1rem",
                            letterSpacing: '0.2em',
                            transition: "all 0.3s ease",
                            border: `2px solid ${colors.gold}`,
                            "&:hover": {
                              background: colors.gold,
                              color: colors.navy,
                            },
                          }}
                          endIcon={<ArrowRight />}
                        >
                          BOOK FLIGHT
                        </Button>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}