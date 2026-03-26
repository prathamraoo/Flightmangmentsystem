import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Drawer,
  Typography,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import {
  FlightTakeoff,
  LocationOn,
  People,
  BookOnline,
  Payment,
  Dashboard,
  RateReview,
} from "@mui/icons-material";

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

export default function AdminSidebar({ setPage }) {
  const menuItems = [
    { label: "Dashboard", value: "dashboard", icon: <Dashboard /> },
    { label: "Manage Airports", value: "airports", icon: <LocationOn /> },
    { label: "Manage Flights", value: "flights", icon: <FlightTakeoff /> },
    { label: "Manage Users", value: "users", icon: <People /> },
    { label: "Manage Bookings", value: "bookings", icon: <BookOnline /> },
    { label: "Manage Reviews", value: "reviews", icon: <RateReview /> },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          background: `linear-gradient(180deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
          borderRight: `1px solid ${colors.gold}40`,
          color: colors.white,
        },
      }}
    >
      {/* Logo Section */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            bgcolor: colors.gold,
            mx: 'auto',
            mb: 2,
            border: `2px solid ${colors.goldLight}`,
          }}
        >
          <FlightTakeoff sx={{ fontSize: 30, color: colors.navy }} />
        </Avatar>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 300,
            mb: 1,
            fontFamily: '"Playfair Display", Georgia, serif',
            letterSpacing: '0.2em',
            color: colors.gold,
          }}
        >
          SKYBOOK
        </Typography>
        <Typography variant="body2" sx={{ color: colors.textGray, mb: 2 }}>
          Admin Control Panel
        </Typography>
      </Box>
      
      <Divider sx={{ bgcolor: `${colors.gold}40`, mx: 3 }} />
      
      {/* Menu Items */}
      <List sx={{ pt: 3, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.value} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => setPage(item.value)}
              sx={{
                borderRadius: 1,
                py: 1.5,
                px: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(201, 169, 98, 0.1)',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  bgcolor: 'rgba(201, 169, 98, 0.15)',
                  borderLeft: `3px solid ${colors.gold}`,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: colors.gold,
                  minWidth: 40,
                  '& svg': {
                    fontSize: 20,
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ mt: 'auto', p: 3, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: colors.textGray }}>
          Flight Management System
        </Typography>
        <Typography variant="caption" sx={{ color: colors.textGray, display: 'block' }}>
          Version 1.0.0
        </Typography>
      </Box>
    </Drawer>
  );
}