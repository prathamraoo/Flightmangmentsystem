import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";
import {
  People,
  FlightTakeoff,
  LocationOn,
  BookOnline,
  Payment,
  TrendingUp,
  Assessment,
} from "@mui/icons-material";
import FlightStatusTracker from "../components/FlightStatusTracker";
import RouteMap from "../components/RouteMap";

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

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    users: 0,
    flights: 0,
    airports: 0,
    bookings: 0,
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, flightsRes, airportsRes, bookingsRes] = await Promise.all([
          axios.get("http://localhost:8000/users", config).catch(() => ({ data: {} })),
          axios.get("http://localhost:8000/flights", config).catch(() => ({ data: {} })),
          axios.get("http://localhost:8000/airports", config).catch(() => ({ data: {} })),
          axios.get("http://localhost:8000/bookings", config).catch(() => ({ data: {} })),
        ]);

        setStats({
          users: usersRes.data.users?.length || usersRes.data.data?.length || 0,
          flights: flightsRes.data.flights?.length || flightsRes.data.data?.length || 0,
          airports: airportsRes.data.airports?.length || airportsRes.data.data?.length || 0,
          bookings: bookingsRes.data.bookings?.length || bookingsRes.data.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: <People />,
      color: colors.gold,
      bgColor: colors.navy,
      borderColor: colors.goldLight,
    },
    {
      title: "Total Flights",
      value: stats.flights,
      icon: <FlightTakeoff />,
      color: colors.gold,
      bgColor: colors.navy,
      borderColor: colors.goldLight,
    },
    {
      title: "Airports",
      value: stats.airports,
      icon: <LocationOn />,
      color: colors.gold,
      bgColor: colors.navy,
      borderColor: colors.goldLight,
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: <BookOnline />,
      color: colors.gold,
      bgColor: colors.navy,
      borderColor: colors.goldLight,
    },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography sx={{ color: colors.textGray }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: colors.gray, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 300,
            color: colors.navy,
            fontFamily: '"Playfair Display", Georgia, serif',
            letterSpacing: '0.1em',
          }}
        >
          Dashboard Overview
        </Typography>
        <Typography variant="body1" sx={{ color: colors.textGray }}>
          Welcome to the SKYBOOK Admin Control Panel
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card
              sx={{
                height: "100%",
                background: `linear-gradient(135deg, ${card.bgColor} 0%, ${colors.navyLight} 100%)`,
                border: `1px solid ${card.borderColor}40`,
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: `0 12px 24px rgba(201, 169, 98, 0.2)`,
                  border: `1px solid ${card.borderColor}`,
                },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: card.color,
                      color: colors.navy,
                      width: 48,
                      height: 48,
                      border: `2px solid ${card.borderColor}`,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                }
                action={
                  <IconButton
                    size="small"
                    sx={{
                      color: card.color,
                      '&:hover': { bgcolor: 'rgba(201, 169, 98, 0.1)' },
                    }}
                  >
                    <TrendingUp />
                  </IconButton>
                }
                title={
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: colors.white,
                      fontSize: '0.9rem',
                    }}
                  >
                    {card.title}
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: card.color,
                    textAlign: "center",
                    fontFamily: '"Playfair Display", Georgia, serif',
                  }}
                >
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Flight Status Tracker */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <FlightStatusTracker />
        </Grid>
      </Grid>
    </Box>
  );
}