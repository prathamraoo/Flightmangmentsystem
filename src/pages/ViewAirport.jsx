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
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  FlightTakeoff,
  FlightLand,
  CalendarToday,
  ArrowForward,
  LocationOn,
  ArrowRight,
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

export default function ViewAirport() {
  const navigate = useNavigate();
  const location = useLocation();

  const { from, to, date } = location.state || {};

  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Default Airports (if API fails)
  const defaultAirports = [
    {
      name: "Indira Gandhi International",
      code: "DEL",
      city: "New Delhi",
      image: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1080&q=80",
    },
    {
      name: "Chhatrapati Shivaji Maharaj",
      code: "BOM",
      city: "Mumbai",
      image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1080&q=80",
    },
    {
      name: "Dubai International",
      code: "DXB",
      city: "Dubai",
      image: "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg",
    },
    {
      name: "London Heathrow",
      code: "LHR",
      city: "London",
      image: "https://images.pexels.com/photos/4836109/pexels-photo-4836109.jpeg",
    },
    {
      name: "John F. Kennedy",
      code: "JFK",
      city: "New York",
      image: "https://images.pexels.com/photos/7027/airport-plane-travel.jpg",
    },
    {
      name: "Charles de Gaulle",
      code: "CDG",
      city: "Paris",
      image: "https://images.pexels.com/photos/36056154/pexels-photo-36056154.jpeg",
    },
    {
      name: "Singapore Changi",
      code: "SIN",
      city: "Singapore",
      image: "https://images.pexels.com/photos/1381416/pexels-photo-1381416.jpeg",
    },
    {
      name: "Tokyo Haneda",
      code: "HND",
      city: "Tokyo",
      image: "https://images.pexels.com/photos/5868605/pexels-photo-5868605.jpeg",
    },
    {
      name: "Kempegowda International",
      code: "BLR",
      city: "Bangalore",
      image: "https://images.pexels.com/photos/36023562/pexels-photo-36023562.jpeg",
    },
    {
      name: "Rajiv Gandhi International",
      code: "HYD",
      city: "Hyderabad",
      image: "https://images.pexels.com/photos/7478338/pexels-photo-7478338.jpeg",
    },
    {
      name: "Chennai International",
      code: "MAA",
      city: "Chennai",
      image: "https://images.pexels.com/photos/5891773/pexels-photo-5891773.jpeg",
    },
    {
      name: "Netaji Subhas Chandra Bose",
      code: "CCU",
      city: "Kolkata",
      image: "https://images.pexels.com/photos/36409485/pexels-photo-36409485.jpeg",
    },
    {
      name: "Hamad International",
      code: "DOH",
      city: "Doha",
      image: "https://images.pexels.com/photos/3140204/pexels-photo-3140204.jpeg",
    },
    {
      name: "Kingsford Smith",
      code: "SYD",
      city: "Sydney",
      image: "https://images.pexels.com/photos/4078337/pexels-photo-4078337.jpeg",
    },
    {
      name: "Cochin International",
      code: "COK",
      city: "Kochi",
      image: "https://images.pexels.com/photos/4606722/pexels-photo-4606722.jpeg",
    },
  ];

  const fetchAirports = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/airports");

      if (res.data?.airports?.length > 0) {
        setAirports(res.data.airports);
      } else {
        setAirports(defaultAirports);
      }
    } catch (_) {
      console.log("API not working, using default airports");
      setAirports(defaultAirports);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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
              SELECT DEPARTURE
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
              Choose Your Airport
            </Typography>

            {/* Route Info Card */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                background: colors.navyLight,
                border: `1px solid ${colors.gold}40`,
                px: 4,
                py: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FlightTakeoff sx={{ color: colors.gold }} />
                <Typography
                  variant="h6"
                  sx={{ color: colors.white, fontWeight: 600 }}
                >
                  {from}
                </Typography>
              </Box>

              <ArrowForward sx={{ color: colors.gold }} />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FlightLand sx={{ color: colors.gold }} />
                <Typography
                  variant="h6"
                  sx={{ color: colors.white, fontWeight: 600 }}
                >
                  {to}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: "1px",
                  height: "30px",
                  background: colors.gold,
                  mx: 1,
                  display: { xs: "none", sm: "block" },
                }}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday sx={{ color: colors.gold, fontSize: 20 }} />
                <Typography variant="body1" sx={{ color: colors.white }}>
                  {formatDate(date)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Airport Cards Grid */}
          <Grid container spacing={3}>
            {loading
              ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={400}
                    sx={{ bgcolor: colors.navyLight }}
                  />
                </Grid>
              ))
              : airports.map((airport, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
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
                      <Box sx={{ position: "relative", height: 280 }}>
                        <Box
                          component="img"
                          src={airport.image}
                          alt={airport.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.6s ease",
                            transform:
                              hoveredCard === index
                                ? "scale(1.1)"
                                : "scale(1)",
                          }}
                        />
                        {/* Gradient Overlay */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(to bottom, transparent 0%, rgba(10,22,40,0.8) 100%)",
                          }}
                        />

                        {/* City Badge */}
                        <Chip
                          icon={<LocationOn sx={{ fontSize: 16, color: colors.navy }} />}
                          label={airport.city}
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            background: colors.gold,
                            color: colors.navy,
                            fontWeight: 600,
                          }}
                        />

                        {/* Airport Code Badge */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            background: colors.navy,
                            color: colors.gold,
                            px: 2,
                            py: 0.5,
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            letterSpacing: "1px",
                            border: `1px solid ${colors.gold}`,
                          }}
                        >
                          {airport.code}
                        </Box>

                        {/* Airport Name on Image */}
                        <Typography
                          variant="h5"
                          sx={{
                            position: "absolute",
                            bottom: 16,
                            left: 16,
                            right: 16,
                            color: colors.white,
                            fontWeight: 500,
                            fontFamily: '"Playfair Display", serif',
                          }}
                        >
                          {airport.name}
                        </Typography>
                      </Box>

                      {/* Card Content */}
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 3, color: colors.textGray }}
                        >
                          International Airport • {airport.city}
                        </Typography>

                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() =>
                            navigate("/flights", {
                              state: {
                                airport,
                                from,
                                to,
                                date,
                              },
                            })
                          }
                          sx={{
                            py: 1.5,
                            borderRadius: 0,
                            background: colors.navy,
                            color: colors.gold,
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: "1rem",
                            letterSpacing: '0.1em',
                            transition: "all 0.3s ease",
                            border: `1px solid ${colors.gold}`,
                            "&:hover": {
                              background: colors.gold,
                              color: colors.navy,
                            },
                          }}
                          endIcon={<ArrowRight />}
                        >
                          SELECT AIRPORT
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