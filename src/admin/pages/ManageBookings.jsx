import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import { 
  CheckCircle, 
  Cancel, 
  Delete, 
  Search, 
  BookOnline, 
  FlightTakeoff, 
  Person, 
  AttachMoney,
  EventSeat,
  Schedule,
  Error
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
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
};

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");

  // Status update dialog
  const [statusDialog, setStatusDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/bookings", config);
      if (response.data.success) {
        setBookings(response.data.bookings);
        setFilteredBookings(response.data.bookings);
      }
    } catch (error) {
      setError("Failed to fetch bookings");
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on search and status
  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.flightId?.airline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.to?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
    setPage(0);
  }, [searchTerm, statusFilter, bookings]);

  // Open status update dialog
  const handleStatusUpdate = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setStatusDialog(true);
  };

  // Close status dialog
  const handleCloseStatusDialog = () => {
    setStatusDialog(false);
    setSelectedBooking(null);
    setNewStatus("");
    setError("");
    setSuccess("");
  };

  // Submit status update
  const handleStatusSubmit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/bookings/status/${selectedBooking._id}`,
        { status: newStatus },
        config
      );
      if (response.data.success) {
        setSuccess(`Booking status updated to ${newStatus}`);
        fetchBookings();
        setTimeout(() => handleCloseStatusDialog(), 1500);
      }
    } catch (error) {
      setError("Failed to update booking status");
      console.error("Error updating status:", error);
    }
  };

  // Delete booking
  const handleDelete = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/bookings/delete/${bookingId}`,
          config
        );
        if (response.data.success) {
          setSuccess("Booking deleted successfully");
          fetchBookings();
          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (error) {
        setError("Failed to delete booking");
        console.error("Error deleting booking:", error);
      }
    }
  };

  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Confirmed':
        return { color: colors.success, icon: <CheckCircle />, label: 'Confirmed' };
      case 'Rejected':
        return { color: colors.error, icon: <Cancel />, label: 'Rejected' };
      case 'Cancelled':
        return { color: colors.error, icon: <Cancel />, label: 'Cancelled' };
      case 'Pending':
      default:
        return { color: colors.warning, icon: <Schedule />, label: 'Pending' };
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get paginated bookings
  const paginatedBookings = filteredBookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate stats
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    rejected: bookings.filter(b => b.status === 'Rejected').length,
    totalRevenue: bookings.filter(b => b.status === 'Confirmed').reduce((sum, b) => sum + b.price, 0),
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ color: colors.textGray }}>Loading bookings...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: colors.gray, minHeight: '100vh' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 300,
          color: colors.navy,
          fontFamily: '"Playfair Display", Georgia, serif',
          letterSpacing: '0.1em',
          mb: 3,
        }}
      >
        Manage Bookings
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <BookOnline sx={{ fontSize: 40, color: colors.gold, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.gold }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                Total Bookings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircle sx={{ fontSize: 40, color: colors.success, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.success }}>
                {stats.confirmed}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                Confirmed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Schedule sx={{ fontSize: 40, color: colors.warning, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.warning }}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Cancel sx={{ fontSize: 40, color: colors.error, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.error }}>
                {stats.rejected}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                Rejected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography sx={{ fontSize: 40, color: colors.gold, mb: 1 }}>₹</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.gold }}>
                ₹{stats.totalRevenue.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search bookings..."
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
            width: 300,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: colors.gold },
              '&:hover fieldset': { borderColor: colors.goldLight },
              '&.Mui-focused fieldset': { borderColor: colors.gold },
            }
          }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.gold,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.goldLight,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.gold,
              },
            }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <Card sx={{ bgcolor: colors.white, border: `1px solid ${colors.gold}40` }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: colors.navy }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Booking ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Flight</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Route</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Seats</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBookings.map((booking) => {
                const statusInfo = getStatusInfo(booking.status);
                return (
                  <TableRow key={booking._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BookOnline sx={{ mr: 1, color: colors.gold, fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {booking._id.slice(-8)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Person sx={{ mr: 1, color: colors.gold, fontSize: 16 }} />
                        {booking.userId?.name || 'Unknown User'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FlightTakeoff sx={{ mr: 1, color: colors.gold, fontSize: 16 }} />
                        {booking.flightId?.airline || 'Unknown Flight'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {booking.from} → {booking.to}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventSeat sx={{ mr: 1, color: colors.gold, fontSize: 16 }} />
                        {booking.seats && booking.seats.length > 0 
                          ? booking.seats.slice(0, 2).map((seat, index) => 
                              typeof seat === 'object' ? seat.seatNumber : seat
                            ).join(', ') + (booking.seats.length > 2 ? ` +${booking.seats.length - 2}` : '')
                          : "N/A"
                        }
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: colors.gold }}>
                      ₹{booking.price}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={statusInfo.icon}
                        label={statusInfo.label}
                        size="small"
                        sx={{
                          bgcolor: statusInfo.color + '20',
                          color: statusInfo.color,
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleStatusUpdate(booking)}
                        sx={{ 
                          mr: 1,
                          borderColor: colors.gold,
                          color: colors.gold,
                          '&:hover': { 
                            borderColor: colors.goldLight,
                            bgcolor: 'rgba(201, 169, 98, 0.1)'
                          }
                        }}
                      >
                        Update
                      </Button>
                      <IconButton
                        size="small"
                        sx={{ color: '#d32f2f' }}
                        onClick={() => handleDelete(booking._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ bgcolor: colors.gray }}
        />
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog} onClose={handleCloseStatusDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: colors.navy, color: colors.gold }}>
          Update Booking Status
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2, color: colors.textGray }}>
            Booking ID: <strong>{selectedBooking?._id.slice(-8)}</strong>
          </Typography>
          {selectedBooking?.userId && (
            <Typography variant="body2" sx={{ mb: 2, color: colors.textGray }}>
              User: <strong>{selectedBooking.userId.name}</strong>
            </Typography>
          )}
          {selectedBooking?.flightId && (
            <Typography variant="body2" sx={{ mb: 2, color: colors.textGray }}>
              Flight: <strong>{selectedBooking.flightId.airline}</strong>
            </Typography>
          )}
          {selectedBooking?.from && selectedBooking?.to && (
            <Typography variant="body2" sx={{ mb: 2, color: colors.textGray }}>
              Route: <strong>{selectedBooking.from} → {selectedBooking.to}</strong>
            </Typography>
          )}
          {selectedBooking?.seats && selectedBooking.seats.length > 0 && (
            <Typography variant="body2" sx={{ mb: 2, color: colors.textGray }}>
              Seat Numbers: <strong>
                {selectedBooking.seats.map(seat => 
                  typeof seat === 'object' ? seat.seatNumber : seat
                ).join(', ')}
              </strong>
            </Typography>
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.gold,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.goldLight,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.gold,
                },
              }}
            >
              <MenuItem value="Pending">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ mr: 1, fontSize: 16 }} />
                  Pending
                </Box>
              </MenuItem>
              <MenuItem value="Confirmed">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle sx={{ mr: 1, fontSize: 16 }} />
                  Confirmed
                </Box>
              </MenuItem>
              <MenuItem value="Rejected">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Cancel sx={{ mr: 1, fontSize: 16 }} />
                  Rejected
                </Box>
              </MenuItem>
              <MenuItem value="Cancelled">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Cancel sx={{ mr: 1, fontSize: 16 }} />
                  Cancelled
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: colors.gray }}>
          <Button onClick={handleCloseStatusDialog} sx={{ color: colors.textGray }}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusSubmit} 
            variant="contained"
            sx={{ bgcolor: colors.gold, color: colors.navy, '&:hover': { bgcolor: colors.goldLight } }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}