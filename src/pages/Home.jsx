import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Chip,
  Fade,
  IconButton,
} from "@mui/material";
import {
  FlightTakeoff,
  LocationOn,
  Schedule,
  Person,
  FlightClass,
  SwapHoriz,
  ArrowForward,
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

export default function Home() {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [cabinClass, setCabinClass] = useState("Economy");
  const [tripType, setTripType] = useState("return");
  const [visible, setVisible] = useState(false);

  const locations = ["Chennai", "Bangalore", "Kolkata", "Hyderabad", "Mumbai", "Delhi"];

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleSearch = () => {
    if (!from || !to || !departDate) {
      alert("Please select From, To and Departure Date");
      return;
    }
    if (from === to) {
      alert("From and To cannot be same");
      return;
    }
    navigate("/flights", {
      state: { from, to, departDate, returnDate, travelers, cabinClass }
    });
  };

  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    try {
      user = JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
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
            {token ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ color: colors.gold, fontSize: '0.9rem' }}>
                  {user?.name || 'User'}
                </Typography>
                <Button
                  onClick={handleLogout}
                  sx={{
                    color: colors.gold,
                    border: `1px solid ${colors.gold}`,
                    borderRadius: 0,
                    px: 3,
                    py: 0.5,
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    '&:hover': { bgcolor: colors.gold, color: colors.navy },
                    transition: 'all 0.3s',
                  }}
                >
                  LOGOUT
                </Button>
              </Box>
            ) : (
              <Button
                onClick={() => navigate('/login')}
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
            )}
          </Box>
        </Container>
      </Box>

      {/* Hero Section - Luxury Dark with Video */}
      <Box
        sx={{
          minHeight: '85vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Video Background */}
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          src="/hero.mp4"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />

        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, rgba(10, 22, 40, 0.8) 0%, rgba(26, 41, 66, 0.7) 100%)`,
            zIndex: 1,
          }}
        />

        {/* Subtle Gold Accent Lines */}
        <Box sx={{ position: 'absolute', top: 0, left: '10%', width: '1px', height: '30%', bgcolor: `${colors.gold}20`, zIndex: 2 }} />
        <Box sx={{ position: 'absolute', top: 0, right: '10%', width: '1px', height: '40%', bgcolor: `${colors.gold}20`, zIndex: 2 }} />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Fade in={visible} timeout={1500}>
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: colors.gold,
                      letterSpacing: '0.5em',
                      fontSize: '0.75rem',
                      mb: 2,
                    }}
                  >
                    PREMIUM TRAVEL EXPERIENCE
                  </Typography>
                  <Typography
                    variant="h1"
                    sx={{
                      color: colors.white,
                      fontWeight: 300,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2,
                      mb: 3,
                      fontFamily: '"Playfair Display", Georgia, serif',
                    }}
                  >
                    Discover the<br />
                    <span style={{ color: colors.gold }}>Extraordinary</span>
                  </Typography>
                  <Typography
                    sx={{
                      color: colors.textGray,
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      mb: 4,
                      maxWidth: 450,
                    }}
                  >
                    Experience unparalleled luxury in air travel. Curated flights for the discerning traveler.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Typography sx={{ color: colors.gold, fontSize: '2rem', fontWeight: 300 }}>
                      50K+
                      <Typography component="span" sx={{ color: colors.textGray, fontSize: '0.75rem', display: 'block', mt: 0.5 }}>
                        Premium Flights
                      </Typography>
                    </Typography>
                    <Typography sx={{ color: colors.gold, fontSize: '2rem', fontWeight: 300 }}>
                      100+
                      <Typography component="span" sx={{ color: colors.textGray, fontSize: '0.75rem', display: 'block', mt: 0.5 }}>
                        Destinations
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={7}>
              <Fade in={visible} timeout={2000}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    bgcolor: colors.white,
                    borderRadius: 0,
                  }}
                >
                  {/* Trip Type Toggle */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 4, borderBottom: `1px solid ${colors.gray}`, pb: 2 }}>
                    {['Return', 'One Way'].map((type) => (
                      <Typography
                        key={type}
                        onClick={() => setTripType(type.toLowerCase().replace(' ', ''))}
                        sx={{
                          color: tripType === type.toLowerCase().replace(' ', '') ? colors.navy : colors.textGray,
                          borderBottom: tripType === type.toLowerCase().replace(' ', '') ? `2px solid ${colors.gold}` : 'none',
                          pb: 1,
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          letterSpacing: '0.1em',
                          transition: 'all 0.3s',
                        }}
                      >
                        {type.toUpperCase()}
                      </Typography>
                    ))}
                  </Box>

                  <Grid container spacing={3}>
                    {/* From/To Row */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                          select
                          fullWidth
                          label="From"
                          value={from}
                          onChange={(e) => setFrom(e.target.value)}
                          InputProps={{ startAdornment: <LocationOn sx={{ color: colors.gold, mr: 1 }} /> }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 0,
                              bgcolor: colors.gray,
                              '& fieldset': { border: 'none' },
                            },
                          }}
                        >
                          {locations.map((loc) => (
                            <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                          ))}
                        </TextField>

                        <IconButton
                          onClick={() => { const temp = from; setFrom(to); setTo(temp); }}
                          sx={{ bgcolor: colors.navy, color: colors.gold, '&:hover': { bgcolor: colors.navyLight } }}
                        >
                          <SwapHoriz />
                        </IconButton>

                        <TextField
                          select
                          fullWidth
                          label="To"
                          value={to}
                          onChange={(e) => setTo(e.target.value)}
                          InputProps={{ startAdornment: <LocationOn sx={{ color: colors.gold, mr: 1 }} /> }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 0,
                              bgcolor: colors.gray,
                              '& fieldset': { border: 'none' },
                            },
                          }}
                        >
                          {locations.map((loc) => (
                            <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                          ))}
                        </TextField>
                      </Box>
                    </Grid>

                    {/* Dates */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Depart"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        InputProps={{ startAdornment: <Schedule sx={{ color: colors.gold, mr: 1 }} /> }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            bgcolor: colors.gray,
                            '& fieldset': { border: 'none' },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Return"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        disabled={tripType === 'oneway'}
                        InputProps={{ startAdornment: <Schedule sx={{ color: colors.gold, mr: 1 }} /> }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            bgcolor: tripType === 'oneway' ? `${colors.gray}80` : colors.gray,
                            '& fieldset': { border: 'none' },
                          },
                        }}
                      />
                    </Grid>

                    {/* Travelers & Class */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Travelers"
                        value={travelers}
                        onChange={(e) => setTravelers(e.target.value)}
                        InputProps={{ startAdornment: <Person sx={{ color: colors.gold, mr: 1 }} /> }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            bgcolor: colors.gray,
                            '& fieldset': { border: 'none' },
                          },
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <MenuItem key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Cabin Class"
                        value={cabinClass}
                        onChange={(e) => setCabinClass(e.target.value)}
                        InputProps={{ startAdornment: <FlightClass sx={{ color: colors.gold, mr: 1 }} /> }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 0,
                            bgcolor: colors.gray,
                            '& fieldset': { border: 'none' },
                          },
                        }}
                      >
                        {['Economy', 'Premium Economy', 'Business', 'First Class'].map((cls) => (
                          <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* Search Button */}
                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        onClick={handleSearch}
                        sx={{
                          py: 2,
                          bgcolor: colors.navy,
                          color: colors.gold,
                          borderRadius: 0,
                          fontSize: '0.9rem',
                          letterSpacing: '0.3em',
                          '&:hover': { bgcolor: colors.navyLight },
                          transition: 'all 0.3s',
                        }}
                      >
                        SEARCH FLIGHTS
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Destinations - Luxury Grid */}
      <Box sx={{ py: 10, bgcolor: colors.white }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              sx={{ color: colors.gold, letterSpacing: '0.5em', fontSize: '0.75rem' }}
            >
              CURATED DESTINATIONS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: colors.navy,
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: 300,
                mt: 2,
              }}
            >
              Exquisite Locations
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              { city: 'Maldives', country: 'Paradise Islands', price: '₹45,000', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80' },
              { city: 'Santorini', country: 'Greece', price: '₹68,000', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80' },
              { city: 'Dubai', country: 'UAE', price: '₹32,000', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' },
              { city: 'Tokyo', country: 'Japan', price: '₹55,000', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80' },
            ].map((dest, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 0,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': { '& img': { transform: 'scale(1.1)' } },
                  }}
                >
                  <Box sx={{ position: 'relative', height: 350, overflow: 'hidden' }}>
                    <Box
                      component="img"
                      src={dest.image}
                      alt={dest.city}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease',
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 3,
                      background: 'linear-gradient(to top, rgba(10,22,40,0.9), transparent)',
                    }}>
                      <Typography sx={{ color: colors.gold, fontSize: '0.75rem', letterSpacing: '0.2em' }}>
                        {dest.country.toUpperCase()}
                      </Typography>
                      <Typography sx={{ color: colors.white, fontSize: '1.5rem', fontFamily: '"Playfair Display", serif' }}>
                        {dest.city}
                      </Typography>
                      <Typography sx={{ color: colors.gold, fontSize: '1rem', mt: 1 }}>
                        From {dest.price}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>



      {/* Why Choose Us - Dark Section */}
      <Box sx={{ py: 10, bgcolor: colors.navy }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography
                variant="overline"
                sx={{ color: colors.gold, letterSpacing: '0.5em', fontSize: '0.75rem' }}
              >
                THE SKYBOOK DIFFERENCE
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: colors.white,
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 300,
                  mt: 2,
                  mb: 3,
                }}
              >
                Uncompromising Excellence
              </Typography>
              <Typography sx={{ color: colors.textGray, lineHeight: 1.8 }}>
                We curate only the finest travel experiences for those who demand nothing but the best.
                Every journey with SkyBook is crafted to perfection.
              </Typography>
            </Grid>

            {[
              { title: 'Premium Selection', desc: 'Handpicked flights from elite carriers' },
              { title: 'Concierge Support', desc: '24/7 dedicated travel specialists' },
              { title: 'Best Price Guarantee', desc: 'Competitive rates on luxury travel' },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ p: 4, border: `1px solid ${colors.navyLight}`, '&:hover': { borderColor: colors.gold }, transition: 'all 0.3s' }}>
                  <Typography sx={{ color: colors.gold, fontSize: '1.2rem', mb: 2, fontFamily: '"Playfair Display", serif' }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: colors.textGray, fontSize: '0.9rem' }}>
                    {feature.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
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
