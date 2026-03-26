import { useState } from "react";
import { Box, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import ManageAirports from "./ManageAirports";
import ManageFlights from "./ManageFlights";
import ManageUsers from "./ManageUsers";
import ManageBookings from "./ManageBookings";
import ManageReviews from "./ManageReviews";
import DashboardOverview from "./DashboardOverview";
import AdminSidebar from "../components/AdminSidebar";
import { Logout, Settings } from "@mui/icons-material";

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

export default function AdminDashboard() {
  const [page, setPage] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/admin/login";
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <DashboardOverview />;
      case "airports":
        return <ManageAirports />;
      case "flights":
        return <ManageFlights />;
      case "users":
        return <ManageUsers />;
      case "bookings":
        return <ManageBookings />;
      case "reviews":
        return <ManageReviews />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: colors.navy }}>
      {/* Admin Header */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1200,
          bgcolor: colors.navy,
          borderBottom: `1px solid ${colors.gold}40`,
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h5"
            sx={{
              color: colors.gold,
              fontWeight: 300,
              letterSpacing: '0.2em',
              fontFamily: '"Playfair Display", Georgia, serif',
            }}
          >
            SKYBOOK ADMIN
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              sx={{ color: colors.gold }}
              onClick={handleLogout}
            >
              <Logout />
            </IconButton>
            <IconButton
              sx={{ color: colors.gold }}
            >
              <Settings />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <AdminSidebar setPage={setPage} />
      
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          pt: 8, // Account for fixed header
          bgcolor: colors.gray,
        }}
      >
        {renderPage()}
      </Box>
    </Box>
  );
}