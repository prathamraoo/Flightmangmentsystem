import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Chip,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  Flight,
  Schedule,
  AirlineSeatReclineNormal,
  Star,
  Search,
  FlightTakeoff,
  Wifi,
  LocalDining,
  BusinessCenter,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const colors = {
  navy: '#0a1628',
  navyLight: '#1a2942',
  gold: '#c9a962',
  goldLight: '#e0c78a',
  white: '#ffffff',
  gray: '#f5f5f5',
  textGray: '#8a8f98',
};

// 15 Premium fallback flights

export default function PremiumFlights() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const token = localStorage.getItem("token");
  let user = null;
  if (token) {
    try { user = JSON.parse(atob(token.split('.')[1])); } catch { }
  }

  useEffect(() => {
    const fetchPremiumFlights = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/flights?category=premium");
        if (res.data?.success) {
          const backendFlights = res.data.flights || [];
          setFlights(backendFlights);
          setFilteredFlights(backendFlights);
        }
      } catch (err) {
        console.error("Error fetching premium flights:", err);
        setError("Failed to fetch premium flights");
      } finally {
        setLoading(false);
      }
    };
    fetchPremiumFlights();
  }, []);

  // Search + tab filter
  useEffect(() => {
    let result = flights;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        f =>
          f.airline?.toLowerCase().includes(q) ||
          f.source?.toLowerCase().includes(q) ||
          f.destination?.toLowerCase().includes(q)
      );
    }
    if (activeTab === 1) result = result.filter(f => f.price >= 100000);
    if (activeTab === 2) result = result.filter(f => f.price < 100000);
    setFilteredFlights(result);
  }, [searchTerm, activeTab, flights]);

  const getFeatureIcon = (feature) => {
    const lower = feature.toLowerCase();
    if (lower.includes("wifi") || lower.includes("wi-fi")) return <Wifi sx={{ fontSize: 14 }} />;
    if (lower.includes("meal") || lower.includes("dine") || lower.includes("cuisine") || lower.includes("chef")) return <LocalDining sx={{ fontSize: 14 }} />;
    if (lower.includes("lounge") || lower.includes("butler") || lower.includes("concierge")) return <BusinessCenter sx={{ fontSize: 14 }} />;
    return <Star sx={{ fontSize: 14 }} />;
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.navy }}>
      {/* Header */}
      <Box sx={{ borderBottom: `1px solid ${colors.navyLight}` }}>
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 3 }}>
            <Typography
              variant="h4"
              sx={{ color: colors.gold, fontWeight: 300, letterSpacing: "0.3em", fontFamily: '"Playfair Display", Georgia, serif', cursor: "pointer", "&:hover": { color: colors.goldLight } }}
              onClick={() => navigate("/home")}
            >
              SKYBOOK
            </Typography>
            <Box sx={{ display: "flex", gap: 4 }}>
              {[["Airports", "/airports"], ["Flights", "/flights"], ["Premium", "/premium-flights"], ["Reviews", "/reviews"]].map(([label, path]) => (
                <Typography
                  key={label}
                  sx={{ color: path === "/premium-flights" ? colors.gold : colors.white, fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", "&:hover": { color: colors.gold }, transition: "color 0.3s" }}
                  onClick={() => navigate(path)}
                >
                  {label}
                </Typography>
              ))}
            </Box>
            {token ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ color: colors.gold, fontSize: "0.9rem" }}>{user?.name || "User"}</Typography>
                <Button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} sx={{ color: colors.gold, border: `1px solid ${colors.gold}`, borderRadius: 0, px: 3, py: 0.5, fontSize: "0.75rem", "&:hover": { bgcolor: colors.gold, color: colors.navy } }}>
                  LOGOUT
                </Button>
              </Box>
            ) : (
              <Button onClick={() => navigate("/login")} sx={{ color: colors.gold, border: `1px solid ${colors.gold}`, borderRadius: 0, px: 4, py: 1, fontSize: "0.75rem", letterSpacing: "0.2em", "&:hover": { bgcolor: colors.gold, color: colors.navy } }}>
                SIGN IN
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Hero Banner */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 50%, #0d1f3c 100%)`,
          borderBottom: `1px solid ${colors.gold}30`,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold accent lines */}
        <Box sx={{ position: "absolute", top: 0, left: "15%", width: "1px", height: "100%", bgcolor: `${colors.gold}15` }} />
        <Box sx={{ position: "absolute", top: 0, right: "15%", width: "1px", height: "100%", bgcolor: `${colors.gold}15` }} />

        <Typography variant="overline" sx={{ color: colors.gold, letterSpacing: "0.6em", fontSize: "0.75rem" }}>
          EXCLUSIVELY CURATED
        </Typography>
        <Typography
          variant="h2"
          sx={{ color: colors.white, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 300, mt: 2, mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}
        >
          Premium <span style={{ color: colors.gold }}>First Class</span> Flights
        </Typography>
        <Typography sx={{ color: colors.textGray, fontSize: "1.1rem", maxWidth: 600, mx: "auto", mb: 4 }}>
          Handpicked luxury flights from the world's finest airlines. Experience unparalleled service at 40,000 feet.
        </Typography>

        {/* Search */}
        <Box sx={{ maxWidth: 500, mx: "auto" }}>
          <TextField
            fullWidth
            placeholder="Search airlines, routes, destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: colors.gold }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: colors.navyLight,
                borderRadius: 0,
                color: colors.white,
                "& fieldset": { borderColor: `${colors.gold}60` },
                "&:hover fieldset": { borderColor: colors.gold },
                "&.Mui-focused fieldset": { borderColor: colors.gold },
              },
              "& .MuiInputBase-input::placeholder": { color: colors.textGray },
            }}
          />
        </Box>
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ bgcolor: colors.navyLight, borderBottom: `1px solid ${colors.gold}20` }}>
        <Container maxWidth="xl">
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              "& .MuiTab-root": { color: colors.textGray, letterSpacing: "0.1em", fontSize: "0.8rem" },
              "& .Mui-selected": { color: `${colors.gold} !important` },
              "& .MuiTabs-indicator": { bgcolor: colors.gold },
            }}
          >
            <Tab label={`All Premium (${flights.length})`} />
            <Tab label="Ultra Luxury (₹1L+)" />
            <Tab label="Premium Economy & Business" />
          </Tabs>
        </Container>
      </Box>

      {/* Flight Grid */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="xl">
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress sx={{ color: colors.gold }} size={60} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ bgcolor: colors.navyLight, color: colors.white, border: `1px solid ${colors.gold}` }}>{error}</Alert>
          ) : filteredFlights.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <FlightTakeoff sx={{ fontSize: 80, color: colors.gold, mb: 2 }} />
              <Typography sx={{ color: colors.white, fontSize: "1.2rem" }}>No premium flights found</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredFlights.map((flight, index) => (
                <Grid item xs={12} md={6} lg={4} key={flight._id || index}>
                  <Card
                    sx={{
                      bgcolor: colors.navyLight,
                      border: `1px solid ${colors.gold}20`,
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        border: `1px solid ${colors.gold}80`,
                        transform: "translateY(-4px)",
                        boxShadow: `0 12px 32px rgba(201, 169, 98, 0.15)`,
                      },
                    }}
                  >
                    {/* Flight Image */}
                    <Box sx={{ position: "relative", height: 200, overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        image={flight.image}
                        alt={flight.airline}
                        sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", "&:hover": { transform: "scale(1.05)" } }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0, left: 0, right: 0, bottom: 0,
                          background: "linear-gradient(to bottom, transparent 40%, rgba(10,22,40,0.85) 100%)",
                        }}
                      />
                      <Chip
                        label="PREMIUM"
                        size="small"
                        sx={{ position: "absolute", top: 12, right: 12, bgcolor: colors.gold, color: colors.navy, fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.65rem" }}
                      />
                      {/* Price overlay */}
                      <Box sx={{ position: "absolute", bottom: 12, left: 16 }}>
                        <Typography sx={{ color: colors.gold, fontSize: "1.4rem", fontWeight: 700 }}>
                          ₹{(flight.price || 0).toLocaleString("en-IN")}
                        </Typography>
                        <Typography sx={{ color: colors.textGray, fontSize: "0.75rem" }}>per person</Typography>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      {/* Airline */}
                      <Typography variant="h6" sx={{ color: colors.white, fontFamily: '"Playfair Display", serif', fontWeight: 400, mb: 1, fontSize: "1rem" }}>
                        {flight.airline}
                      </Typography>

                      {/* Route */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Typography sx={{ color: colors.gold, fontSize: "0.9rem", fontWeight: 600 }}>{flight.source}</Typography>
                        <ArrowForward sx={{ color: colors.textGray, fontSize: 16 }} />
                        <Typography sx={{ color: colors.gold, fontSize: "0.9rem", fontWeight: 600 }}>{flight.destination}</Typography>
                      </Box>

                      {/* Flight Info chips */}
                      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                        <Chip icon={<Schedule sx={{ fontSize: 12, color: `${colors.gold} !important` }} />} label={flight.duration || "—"} size="small" sx={{ bgcolor: `${colors.gold}15`, color: colors.textGray, fontSize: "0.7rem" }} />
                        <Chip icon={<AirlineSeatReclineNormal sx={{ fontSize: 12, color: `${colors.gold} !important` }} />} label={`${flight.availableSeats || flight.seats || 0} seats`} size="small" sx={{ bgcolor: `${colors.gold}15`, color: colors.textGray, fontSize: "0.7rem" }} />
                      </Box>

                      {/* Features */}
                      <Box sx={{ mb: 3 }}>
                        {(flight.details || []).slice(0, 3).map((feature, i) => (
                          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Box sx={{ color: colors.gold }}>{getFeatureIcon(feature)}</Box>
                            <Typography sx={{ color: colors.textGray, fontSize: "0.78rem" }}>{feature}</Typography>
                          </Box>
                        ))}
                      </Box>

                      {/* Book Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        endIcon={<ArrowForward />}
                        onClick={() =>
                          navigate("/seats", {
                            state: {
                              flight: { ...flight, airline: flight.airline, price: flight.price },
                              from: flight.source,
                              to: flight.destination,
                              date: new Date().toISOString().slice(0, 10),
                              travelers: 1,
                              cabinClass: "Business",
                            },
                          })
                        }
                        sx={{
                          bgcolor: colors.gold,
                          color: colors.navy,
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          fontSize: "0.8rem",
                          borderRadius: 0,
                          py: 1.2,
                          "&:hover": { bgcolor: colors.goldLight },
                          transition: "all 0.3s",
                        }}
                      >
                        BOOK NOW
                      </Button>
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ color: colors.gold, fontFamily: '"Playfair Display", serif', fontSize: "1.5rem" }}>SKYBOOK</Typography>
            <Typography sx={{ color: colors.textGray, fontSize: "0.8rem" }}>© 2026 SkyBook. All rights reserved.</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
