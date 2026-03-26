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
  Alert
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

export default function ManageAirports() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dialog states
  const [open, setOpen] = useState(false);
  const [editingAirport, setEditingAirport] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    image: ""
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Fetch all airports
  const fetchAirports = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/airports");
      if (response.data.success) {
        setAirports(response.data.airports);
      }
    } catch (error) {
      setError("Failed to fetch airports");
      console.error("Error fetching airports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Open dialog for adding new airport
  const handleAdd = () => {
    setEditingAirport(null);
    setFormData({ name: "", code: "", image: "" });
    setOpen(true);
  };

  // Open dialog for editing airport
  const handleEdit = (airport) => {
    setEditingAirport(airport);
    setFormData({
      name: airport.name,
      code: airport.code,
      image: airport.image || ""
    });
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setEditingAirport(null);
    setFormData({ name: "", code: "", image: "" });
    setError("");
    setSuccess("");
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
    try {
      if (editingAirport) {
        // Update airport
        const response = await axios.put(
          `http://localhost:8000/airports/update/${editingAirport._id}`,
          formData,
          config
        );
        if (response.data.success) {
          setSuccess("Airport updated successfully");
          fetchAirports();
          setTimeout(() => handleClose(), 1500);
        }
      } else {
        // Create airport
        const response = await axios.post(
          "http://localhost:8000/airports/create",
          formData,
          config
        );
        if (response.data.success) {
          setSuccess("Airport created successfully");
          fetchAirports();
          setTimeout(() => handleClose(), 1500);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
      console.error("Error:", error);
    }
  };

  // Delete airport
  const handleDelete = async (airportId) => {
    if (window.confirm("Are you sure you want to delete this airport?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/airports/delete/${airportId}`,
          config
        );
        if (response.data.success) {
          setSuccess("Airport deleted successfully");
          fetchAirports();
          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (error) {
        setError("Failed to delete airport");
        console.error("Error deleting airport:", error);
      }
    }
  };

  if (loading) {
    return <Typography>Loading airports...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Airports
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleAdd}
        sx={{ mb: 2 }}
      >
        Add New Airport
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {airports.map((airport) => (
              <TableRow key={airport._id}>
                <TableCell>{airport.name}</TableCell>
                <TableCell>{airport.code}</TableCell>
                <TableCell>{airport.image || "No image"}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(airport)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(airport._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAirport ? "Edit Airport" : "Add New Airport"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Airport Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Airport Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAirport ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}