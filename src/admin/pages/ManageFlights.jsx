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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Add, Search, FlightTakeoff, AttachMoney, Description } from "@mui/icons-material";

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

export default function ManageFlights() {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [open, setOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [formData, setFormData] = useState({
    category: "economy",
  });


  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Fetch all flights
  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/flights");
      if (response.data.success) {
        setFlights(response.data.flights || []);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
      setError("Failed to fetch flights from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  // Filter flights based on search term
  useEffect(() => {
    const filtered = flights.filter(flight =>
      flight.airline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.price?.toString().includes(searchTerm)
    );
    setFilteredFlights(filtered);
  }, [searchTerm, flights]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Open dialog for adding new flight
  const handleAdd = () => {
    setEditingFlight(null);
    setFormData({
      airline: "",
      price: "",
      image: "",
      details: "",
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      duration: "",
      availableSeats: "",
    });
    setOpen(true);
  };

  // Open dialog for editing flight
  const handleEdit = (flight) => {
    setEditingFlight(flight);
    setFormData({
      airline: flight.airline,
      price: flight.price,
      image: flight.image || "",
      details: flight.details ? flight.details.join(", ") : "",
      from: flight.source || "",
      to: flight.destination || "",
      departureTime: flight.departureTime || "",
      arrivalTime: flight.arrivalTime || "",
      duration: flight.duration || "",
      availableSeats: flight.availableSeats || "",
      category: flight.category || "economy",
    });
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setEditingFlight(null);
    setFormData({
      airline: "",
      price: "",
      image: "",
      details: "",
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      duration: "",
      availableSeats: "",
      category: "economy",
    });
    setError("");
    setSuccess("");
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const submitData = {
        ...formData,
        source: formData.from || "",
        destination: formData.to || "",
        price: Number(formData.price) || 0,
        availableSeats: Number(formData.availableSeats) || 0,
        details: typeof formData.details === 'string' ? formData.details.split(",").map(d => d.trim()).filter(d => d) : (Array.isArray(formData.details) ? formData.details : []),
      };

      console.log("Submitting flight data:", submitData);

      if (editingFlight) {
        // Update flight
        const response = await axios.put(
          `http://localhost:8000/flights/update/${editingFlight._id}`,
          submitData,
          config
        );
        if (response.data.success) {
          setSuccess("Flight updated successfully");
          fetchFlights();
          setTimeout(() => handleClose(), 1500);
        }
      } else {
        // Create flight
        const response = await axios.post(
          "http://localhost:8000/flights/create",
          submitData,
          config
        );
        if (response.data.success) {
          setSuccess("Flight created successfully");
          fetchFlights();
          setTimeout(() => handleClose(), 1500);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Operation failed";
      setError(msg);
      console.error("Flight Operation Error:", error);
    }
  };

  // Sync Database
  const handleSync = async () => {
    if (window.confirm("This will reset the database to the 19 default flights. Continue?")) {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:8000/flights/seed-internal", {}, config);
        if (response.data.success) {
          setSuccess(response.data.message);
          fetchFlights();
        }
      } catch (error) {
        const msg = error.response?.data?.message || error.message || "Sync failed";
        console.error("Sync Error Details:", error);
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  // Delete flight
  const handleDelete = async (flightId) => {
    if (window.confirm("Are you sure you want to delete this flight?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/flights/delete/${flightId}`,
          config
        );
        if (response.data.success) {
          setSuccess("Flight deleted successfully");
          fetchFlights();
          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (error) {
        setError("Failed to delete flight");
        console.error("Error deleting flight:", error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ color: colors.textGray }}>Loading flights...</Typography>
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
        Manage Flights
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <FlightTakeoff sx={{ fontSize: 40, color: colors.gold, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.gold }}>
                {flights.length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                Total Flights
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography sx={{ fontSize: 40, color: colors.gold, mb: 1 }}>₹</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.gold }}>
                ₹{flights.reduce((sum, f) => sum + f.price, 0).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                Total Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Search and Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          placeholder="Search flights..."
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Search />}
            onClick={handleSync}
            sx={{
              color: colors.gold,
              borderColor: colors.gold,
              fontWeight: 600,
              '&:hover': { borderColor: colors.goldLight, bgcolor: 'rgba(201, 169, 98, 0.1)' }
            }}
          >
            Sync Database
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{
              bgcolor: colors.gold,
              color: colors.navy,
              fontWeight: 600,
              '&:hover': { bgcolor: colors.goldLight },
            }}
          >
            Add New Flight
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <Card sx={{ bgcolor: colors.white, border: `1px solid ${colors.gold}40` }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: colors.navy }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Airline</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Route</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Seats</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Details</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFlights.map((flight) => (
                <TableRow key={flight._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FlightTakeoff sx={{ mr: 1, color: colors.gold }} />
                      {flight.airline}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {flight.image ? (
                      <Box 
                        component="img" 
                        src={flight.image} 
                        alt={flight.airline}
                        sx={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 1, border: `1px solid ${colors.gold}` }} 
                      />
                    ) : (
                      <Box sx={{ width: 60, height: 40, bgcolor: colors.gray, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ color: colors.textGray }}>No Img</Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {flight.from} → {flight.to}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: colors.gold }}>
                    ₹{flight.price}
                  </TableCell>
                  <TableCell>{flight.availableSeats || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={flight.category || 'economy'} 
                      size="small" 
                      sx={{ 
                        bgcolor: (flight.category === 'premium' || flight.category === 'first') ? colors.gold : colors.navyLight,
                        color: (flight.category === 'premium' || flight.category === 'first') ? colors.navy : colors.white,
                        textTransform: 'capitalize'
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    {flight.details && flight.details.length > 0 ? (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {flight.details.slice(0, 2).map((detail, index) => (
                          <Chip
                            key={index}
                            label={detail}
                            size="small"
                            sx={{ bgcolor: colors.gold, color: colors.navy, fontSize: '0.7rem' }}
                          />
                        ))}
                        {flight.details.length > 2 && (
                          <Chip
                            label={`+${flight.details.length - 2}`}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: colors.gold, color: colors.gold }}
                          />
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: colors.textGray }}>
                        No details
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      sx={{ color: colors.gold, '&:hover': { bgcolor: 'rgba(201, 169, 98, 0.1)' } }}
                      onClick={() => handleEdit(flight)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' } }}
                      onClick={() => handleDelete(flight._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: colors.navy, color: colors.gold }}>
          {editingFlight ? "Edit Flight" : "Add New Flight"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Airline"
                name="airline"
                value={formData.airline}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FlightTakeoff sx={{ color: colors.gold }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney sx={{ color: colors.gold }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="From"
                name="from"
                value={formData.from}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="To"
                name="to"
                value={formData.to}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Departure Time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Arrival Time"
                name="arrivalTime"
                value={formData.arrivalTime}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Available Seats"
                name="availableSeats"
                type="number"
                value={formData.availableSeats}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  <MenuItem value="economy">Economy</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="first">First Class</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                margin="normal"
                placeholder="Paste high-resolution image URL (e.g. from Unsplash)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Details (comma-separated)"
                name="details"
                value={formData.details}
                onChange={handleChange}
                margin="normal"
                placeholder="e.g., WiFi, Meals, Entertainment"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description sx={{ color: colors.gold }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: colors.gray }}>
          <Button onClick={handleClose} sx={{ color: colors.textGray }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: colors.gold, color: colors.navy, '&:hover': { bgcolor: colors.goldLight } }}
          >
            {editingFlight ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}