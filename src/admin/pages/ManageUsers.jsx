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
  TablePagination,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Add, Search, Person, Email, Phone, AdminPanelSettings } from "@mui/icons-material";

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

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dialog states
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    userphone: ""
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/users", config);
      if (response.data.success) {
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      }
    } catch (error) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(0);
  }, [searchTerm, users]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Open dialog for adding new user
  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ username: "", useremail: "", userphone: "" });
    setOpen(true);
  };

  // Open dialog for editing user
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.name,
      useremail: user.email,
      userphone: user.phone
    });
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
    setFormData({ username: "", useremail: "", userphone: "" });
    setError("");
    setSuccess("");
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
    try {
      const submitData = {
        name: formData.username,
        email: formData.useremail,
        phone: formData.userphone
      };

      if (editingUser) {
        // Update user
        const response = await axios.put(
          `http://localhost:8000/users/update/${editingUser._id}`,
          submitData,
          config
        );
        if (response.data.success) {
          fetchUsers();
          setTimeout(() => handleClose(), 1500);
        }
      } else {
        // Create user
        const response = await axios.post(
          "http://localhost:8000/users/create",
          submitData,
          config
        );
        if (response.data.success) {
          setSuccess("User created successfully");
          fetchUsers();
          setTimeout(() => handleClose(), 1500);
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
      console.error("Error:", error);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/users/delete/${userId}`,
          config
        );
        if (response.data.success) {
          setSuccess("User deleted successfully");
          fetchUsers();
          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (error) {
        setError("Failed to delete user");
        console.error("Error deleting user:", error);
      }
    }
  };

  // Update user role
  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/users/role/${userId}`,
        { role: newRole },
        config
      );
      if (response.data.success) {
        setSuccess(`User role updated to ${newRole}`);
        fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError("Failed to update user role");
      console.error("Error updating role:", error);
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

  // Get paginated users
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ color: colors.textGray }}>Loading users...</Typography>
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
        Manage Users
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Person sx={{ fontSize: 40, color: colors.gold, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.gold }}>
                {users.length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                Total Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Email sx={{ fontSize: 40, color: colors.gold, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.gold }}>
                {users.filter(u => u.email).length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                With Email
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Phone sx={{ fontSize: 40, color: colors.gold, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.gold }}>
                {users.filter(u => u.phone).length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                With Phone
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <AdminPanelSettings sx={{ fontSize: 40, color: colors.gold, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.gold }}>
                {users.filter(u => u.role === 'admin').length}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                Admins
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
          placeholder="Search users..."
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
          Add New User
        </Button>
      </Box>

      {/* Table */}
      <Card sx={{ bgcolor: colors.white, border: `1px solid ${colors.gold}40` }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: colors.navy }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 1, color: colors.gold }} />
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ mr: 1, color: colors.gold, fontSize: 16 }} />
                      {user.email}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Phone sx={{ mr: 1, color: colors.gold, fontSize: 16 }} />
                      {user.phone}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={user.role || "user"}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        sx={{
                          '& .MuiSelect-select': {
                            py: 0.5,
                          },
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
                        <MenuItem value="user">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Person sx={{ mr: 1, fontSize: 16 }} />
                            User
                          </Box>
                        </MenuItem>
                        <MenuItem value="admin">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AdminPanelSettings sx={{ mr: 1, fontSize: 16 }} />
                            Admin
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      sx={{ color: colors.gold, '&:hover': { bgcolor: 'rgba(201, 169, 98, 0.1)' } }}
                      onClick={() => handleEdit(user)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' } }}
                      onClick={() => handleDelete(user._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ bgcolor: colors.gray }}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: colors.navy, color: colors.gold }}>
          {editingUser ? "Edit User" : "Add New User"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: colors.gold }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Email"
            name="useremail"
            type="email"
            value={formData.useremail}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: colors.gold }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Phone"
            name="userphone"
            value={formData.userphone}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone sx={{ color: colors.gold }} />
                </InputAdornment>
              ),
            }}
          />
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
            {editingUser ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}