import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Avatar,
  Link,
  Alert,
  IconButton,
} from '@mui/material'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import {
  FlightTakeoff,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

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

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = React.useState({
    useremail: '',
    userpassword: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("");
  }

  const handleSubmit = async () => {
    if (!form.useremail || !form.userpassword) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/auth/login", form)

      if (res.data.success) {
        localStorage.setItem("token", res.data.token)
        navigate("/home")
      } else {
        setError(res.data.message || "Login failed")
      }
    } catch (error) {
      console.log(error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError("Login failed. Please check your credentials.")
      }
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

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
        src="/login.mp4"
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
      
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${colors.gold}40`,
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
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textGray }}>
              Sign in to your SkyBook account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 0, bgcolor: colors.navyLight, color: colors.white, border: `1px solid ${colors.gold}` }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email Address"
              name="useremail"
              type="email"
              value={form.useremail}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              margin="normal"
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

            <TextField
              fullWidth
              label="Password"
              name="userpassword"
              type={showPassword ? 'text' : 'password'}
              value={form.userpassword}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              margin="normal"
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
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
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
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: colors.textGray }}>
              Don't have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/')}
                sx={{
                  fontWeight: 600,
                  color: colors.navy,
                  textDecoration: 'none',
                  '&:hover': {
                    color: colors.gold,
                  },
                }}
              >
                Create one here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}