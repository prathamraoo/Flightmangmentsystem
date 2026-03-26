import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import {
  FlightTakeoff,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

export default function Footer() {
  const theme = useTheme();

  const footerLinks = {
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
    services: [
      { label: "Flight Booking", href: "/book" },
      { label: "Airport Info", href: "/airports" },
      { label: "Flight Status", href: "/flights" },
      { label: "Travel Insurance", href: "/insurance" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { icon: <Facebook />, href: "#", label: "Facebook" },
    { icon: <Twitter />, href: "#", label: "Twitter" },
    { icon: <Instagram />, href: "#", label: "Instagram" },
    { icon: <LinkedIn />, href: "#", label: "LinkedIn" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.grey[900],
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FlightTakeoff sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                SkyBook
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: theme.palette.grey[400] }}>
              Your trusted partner for seamless flight bookings and travel experiences.
              Connecting you to destinations worldwide with comfort and reliability.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.href}
                  sx={{
                    color: theme.palette.grey[400],
                    '&:hover': {
                      color: theme.palette.primary.main,
                      backgroundColor: 'rgba(0, 82, 212, 0.1)',
                    },
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              <Grid item xs={6} sm={4}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Company
                </Typography>
                {footerLinks.company.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    color="inherit"
                    sx={{
                      display: 'block',
                      mb: 1,
                      color: theme.palette.grey[400],
                      textDecoration: 'none',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Grid>

              <Grid item xs={6} sm={4}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Services
                </Typography>
                {footerLinks.services.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    color="inherit"
                    sx={{
                      display: 'block',
                      mb: 1,
                      color: theme.palette.grey[400],
                      textDecoration: 'none',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Grid>

              <Grid item xs={6} sm={4}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Support
                </Typography>
                {footerLinks.support.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    color="inherit"
                    sx={{
                      display: 'block',
                      mb: 1,
                      color: theme.palette.grey[400],
                      textDecoration: 'none',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: theme.palette.grey[700] }} />

        {/* Contact Info */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Email sx={{ color: theme.palette.primary.main }} />
              <Typography variant="body2" color="grey.400">
                support@skybook.com
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Phone sx={{ color: theme.palette.primary.main }} />
              <Typography variant="body2" color="grey.400">
                7338070501
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ color: theme.palette.primary.main }} />
              <Typography variant="body2" color="grey.400">
                Mangalore, Dakshina Kannada
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ textAlign: 'center', pt: 2, borderTop: 1, borderColor: theme.palette.grey[700] }}>
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} SkyBook. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}