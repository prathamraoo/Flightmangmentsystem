import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ViewAirport from "./pages/ViewAirport";
import ViewFlight from "./pages/ViewFlight";
import About from "./pages/About";
import BookingStatus from "./pages/BookingStatus";
import Payment from "./pages/Payment";
import ViewTickets from "./pages/ViewTickets";
import Reviews from "./pages/Reviews";
import SeatBooking from "./pages/SeatBooking";
import Ticket from "./pages/Ticket";
import PremiumFlights from "./pages/PremiumFlights";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ManageAirports from "./admin/pages/ManageAirports";
import ManageFlights from "./admin/pages/ManageFlights";
import ManageUsers from "./admin/pages/ManageUsers";
import ManageBookings from "./admin/pages/ManageBookings";
import ManageReviews from "./admin/pages/ManageReviews";

import AdminRoute from "./auth/AdminRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Create a professional aviation-themed design system
const theme = createTheme({
  palette: {
    primary: {
      main: '#0052D4', // Professional blue
      light: '#4364F7',
      dark: '#0039A6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF6B35', // Coral accent
      light: '#FF8B6A',
      dark: '#E55A2B',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC', // Light gray background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B', // Dark slate
      secondary: '#64748B', // Medium gray
    },
    success: {
      main: '#10B981', // Emerald
    },
    warning: {
      main: '#F59E0B', // Amber
    },
    error: {
      main: '#EF4444', // Red
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 82, 212, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 82, 212, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4364F7',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1E293B',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/airports" element={<ViewAirport />} />
        <Route path="/flights" element={<ViewFlight />} />
        <Route path="/seat-booking" element={<SeatBooking />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/booking-status" element={<BookingStatus />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/tickets" element={<ViewTickets />} />
        <Route path="/ticket/:id" element={<Ticket />} />
        <Route path="/seats" element={<SeatBooking />} />
        <Route path="/premium-flights" element={<PremiumFlights />} />

        <Route path="/adminlogin" element={<AdminLogin/>} />

      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard/>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/airports"
        element={
          <AdminRoute>
            <ManageAirports/>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/flights"
        element={
          <AdminRoute>
            <ManageFlights/>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <ManageUsers/>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <AdminRoute>
            <ManageBookings/>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <AdminRoute>
            <ManageReviews/>
          </AdminRoute>
        }
      />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;