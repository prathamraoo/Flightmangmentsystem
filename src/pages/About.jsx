import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";
import {
  FlightTakeoff,
  Security,
  Speed,
  Support,
  Star,
  Group,
  Timeline,
  Verified,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  const theme = useTheme();

  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Secure & Reliable",
      description: "Bank-level security with SSL encryption and secure payment processing."
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Lightning Fast",
      description: "Real-time flight search and instant booking confirmation."
    },
    {
      icon: <Support sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "24/7 Support",
      description: "Round-the-clock customer service to assist you anytime."
    },
    {
      icon: <FlightTakeoff sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Global Coverage",
      description: "Access to flights from major airlines worldwide."
    },
  ];

  const stats = [
    { number: "500K+", label: "Happy Customers" },
    { number: "1000+", label: "Daily Bookings" },
    { number: "50+", label: "Airline Partners" },
    { number: "99.9%", label: "Uptime" },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      description: "Former airline executive with 15+ years in aviation industry.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description: "Tech innovator specializing in travel technology solutions.",
      avatar: "MC"
    },
    {
      name: "Emma Davis",
      role: "Head of Customer Experience",
      description: "Dedicated to making travel booking seamless and enjoyable.",
      avatar: "ED"
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: theme.palette.primary.main,
              mx: 'auto',
              mb: 4,
              boxShadow: 4,
            }}
          >
            <FlightTakeoff sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            About SkyBook
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
          >
            Revolutionizing air travel booking with cutting-edge technology,
            exceptional service, and unbeatable prices.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label="🏆 Award Winning"
              sx={{ bgcolor: theme.palette.success.main + '20', color: theme.palette.success.main }}
            />
            <Chip
              label="🌍 Global Reach"
              sx={{ bgcolor: theme.palette.primary.main + '20', color: theme.palette.primary.main }}
            />
            <Chip
              label="⭐ 4.9/5 Rating"
              sx={{ bgcolor: theme.palette.warning.main + '20', color: theme.palette.warning.main }}
            />
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      mb: 1,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{ textAlign: 'center', mb: 4, fontWeight: 700 }}
          >
            Our Mission
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 6, lineHeight: 1.6 }}
          >
            To democratize air travel by making flight booking accessible,
            affordable, and effortless for everyone. We believe that exploring
            the world should be as simple as a few clicks.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<Verified />}
              label="Trusted Platform"
              sx={{ bgcolor: theme.palette.success.main + '20', color: theme.palette.success.main }}
            />
            <Chip
              icon={<Timeline />}
              label="Real-time Updates"
              sx={{ bgcolor: theme.palette.primary.main + '20', color: theme.palette.primary.main }}
            />
            <Chip
              icon={<Group />}
              label="Customer First"
              sx={{ bgcolor: theme.palette.secondary.main + '20', color: theme.palette.secondary.main }}
            />
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{ textAlign: 'center', mb: 2, fontWeight: 700 }}
          >
            Why Choose SkyBook?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 6 }}
          >
            Experience the difference with our premium features
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{ textAlign: 'center', mb: 2, fontWeight: 700 }}
          >
            Meet Our Team
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 6 }}
          >
            The passionate people behind SkyBook's success
          </Typography>

          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: theme.palette.primary.main,
                      mx: 'auto',
                      mb: 2,
                      fontSize: 24,
                      fontWeight: 600,
                    }}
                  >
                    {member.avatar}
                  </Avatar>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}