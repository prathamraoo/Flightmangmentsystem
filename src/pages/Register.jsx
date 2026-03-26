import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  Avatar,
  Link,
  Alert,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FlightTakeoff,
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
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

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    useremail: "",
    userphone: "",
    userpassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      setError("Name is required");
      return false;
    }
    if (form.username.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return false;
    }
    if (!form.useremail.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.useremail)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!form.userphone.trim()) {
      setError("Phone number is required");
      return false;
    }
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(form.userphone)) {
      setError("Please enter a valid phone number");
      return false;
    }
    if (form.userphone.replace(/\D/g, '').length < 10) {
      setError("Phone number must be at least 10 digits");
      return false;
    }
    if (!form.userpassword.trim()) {
      setError("Password is required");
      return false;
    }
    if (form.userpassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/auth/register",
        form
      );

      if (res.data.success) {
        alert("Registered Successfully!");
        navigate("/login");
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: 'relative',
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
        src="/register.mp4"
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
          bgcolor: 'rgba(10, 22, 40, 0.7)',
          zIndex: 1,
        }}
      />
      
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.gold}40`,
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: colors.navy,
                mx: 'auto',
                mb: 2,
                border: `2px solid ${colors.gold}`,
              }}
            >
              <FlightTakeoff sx={{ fontSize: 40, color: colors.gold }} />
            </Avatar>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 300,
                color: colors.navy,
                mb: 1,
                fontFamily: '"Playfair Display", Georgia, serif',
                letterSpacing: '0.1em',
              }}
            >
              Join SkyBook
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textGray }}>
              Create your account and start booking flights
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 0, bgcolor: colors.navyLight, color: colors.white, border: `1px solid ${colors.gold}` }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  margin="dense"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: colors.gold }} />,
                  }}
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
                  label="Email Address"
                  name="useremail"
                  type="email"
                  value={form.useremail}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  margin="dense"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: colors.gold }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      bgcolor: colors.gray,
                      '& fieldset': { border: 'none' },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="userphone"
                  type="tel"
                  value={form.userphone}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  margin="dense"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: colors.gold }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      bgcolor: colors.gray,
                      '& fieldset': { border: 'none' },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="userpassword"
                  type={showPassword ? 'text' : 'password'}
                  value={form.userpassword}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  margin="dense"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Lock sx={{ mr: 1, color: colors.gold }} />,
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      bgcolor: colors.gray,
                      '& fieldset': { border: 'none' },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleRegister}
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 0,
              background: colors.navy,
              color: colors.gold,
              border: `1px solid ${colors.gold}`,
              letterSpacing: '0.1em',
              '&:hover': {
                background: colors.gold,
                color: colors.navy,
              },
              '&:disabled': {
                background: colors.navyLight,
              },
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: colors.textGray }}>
              Already have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{
                  fontWeight: 600,
                  color: colors.navy,
                  textDecoration: 'none',
                  '&:hover': {
                    color: colors.gold,
                  },
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
