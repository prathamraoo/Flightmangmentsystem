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
  Rating,
} from "@mui/material";
import { 
  CheckCircle, 
  Cancel, 
  Delete, 
  Search, 
  Star, 
  RateReview,
  ThumbUp,
  ThumbDown,
  Schedule
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

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/reviews/all", config);
      if (response.data.success) {
        setReviews(response.data.reviews);
        setFilteredReviews(response.data.reviews);
      }
    } catch (error) {
      setError("Failed to fetch reviews");
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Filter reviews based on search and filters
  useEffect(() => {
    let filtered = reviews;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(review => review.status === statusFilter);
    }

    // Rating filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    setFilteredReviews(filtered);
    setPage(0);
  }, [searchTerm, statusFilter, ratingFilter, reviews]);

  // Update review status
  const handleStatusUpdate = async (reviewId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/reviews/${reviewId}`,
        { status: newStatus },
        config
      );
      if (response.data.success) {
        setSuccess(`Review ${newStatus} successfully`);
        fetchReviews();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError("Failed to update review status");
      console.error("Error updating status:", error);
    }
  };

  // Delete review
  const handleDelete = async () => {
    if (!selectedReview) return;
    
    try {
      const response = await axios.delete(
        `http://localhost:8000/reviews/${selectedReview._id}`,
        config
      );
      if (response.data.success) {
        setSuccess("Review deleted successfully");
        fetchReviews();
        setDeleteDialog(false);
        setSelectedReview(null);
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError("Failed to delete review");
      console.error("Error deleting review:", error);
    }
  };

  // Open delete dialog
  const openDeleteDialog = (review) => {
    setSelectedReview(review);
    setDeleteDialog(true);
  };

  // Open details dialog
  const openDetailsDialog = (review) => {
    setSelectedReview(review);
    setDetailsDialog(true);
  };

  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return { color: colors.success, icon: <ThumbUp />, label: 'Approved' };
      case 'rejected':
        return { color: colors.error, icon: <ThumbDown />, label: 'Rejected' };
      case 'pending':
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

  // Get paginated reviews
  const paginatedReviews = filteredReviews.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate stats
  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    avgRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0,
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Typography sx={{ color: colors.textGray }}>Loading reviews...</Typography>
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
        Manage Reviews
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <RateReview sx={{ fontSize: 40, color: colors.gold, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.gold }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                Total Reviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: colors.navy, color: colors.white }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <ThumbUp sx={{ fontSize: 40, color: colors.success, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.success }}>
                {stats.approved}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                Approved
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
              <ThumbDown sx={{ fontSize: 40, color: colors.error, mb: 1 }} />
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
              <Star sx={{ fontSize: 40, color: colors.gold, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.gold }}>
                {stats.avgRating}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                Avg Rating
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
          placeholder="Search reviews..."
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
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Rating</InputLabel>
          <Select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            label="Rating"
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
            <MenuItem value="all">All Ratings</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <Card sx={{ bgcolor: colors.white, border: `1px solid ${colors.gold}40` }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: colors.navy }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Review</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: colors.white }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReviews.map((review) => {
                const statusInfo = getStatusInfo(review.status);
                return (
                  <TableRow key={review._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RateReview sx={{ mr: 1, color: colors.gold, fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {review.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating 
                          value={review.rating} 
                          readOnly 
                          size="small" 
                          sx={{ 
                            '& .MuiRating-iconFilled': { color: colors.gold },
                            mr: 1
                          }} 
                        />
                        <Typography variant="body2" sx={{ color: colors.textGray }}>
                          {review.rating}/5
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          '&:hover': { 
                            overflow: 'visible',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word'
                          }
                        }}
                        onClick={() => openDetailsDialog(review)}
                      >
                        {review.comment}
                      </Typography>
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
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {review.status !== 'approved' && (
                        <IconButton
                          size="small"
                          sx={{ color: colors.success, mr: 1 }}
                          onClick={() => handleStatusUpdate(review._id, 'approved')}
                          title="Approve"
                        >
                          <CheckCircle />
                        </IconButton>
                      )}
                      {review.status === 'approved' && (
                        <IconButton
                          size="small"
                          sx={{ color: colors.warning, mr: 1 }}
                          onClick={() => handleStatusUpdate(review._id, 'rejected')}
                          title="Reject"
                        >
                          <Cancel />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        sx={{ color: '#d32f2f' }}
                        onClick={() => openDeleteDialog(review)}
                        title="Delete"
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
          count={filteredReviews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ bgcolor: colors.gray }}
        />
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: colors.navy, color: colors.gold }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: colors.textGray }}>
            Are you sure you want to delete this review from <strong>{selectedReview?.name}</strong>?
          </Typography>
          {selectedReview && (
            <Box sx={{ mt: 2, p: 2, bgcolor: colors.gray, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Rating:</strong> {selectedReview.rating}/5
              </Typography>
              <Typography variant="body2">
                <strong>Review:</strong> {selectedReview.comment}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: colors.gray }}>
          <Button onClick={() => setDeleteDialog(false)} sx={{ color: colors.textGray }}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            sx={{ bgcolor: colors.error, color: colors.white, '&:hover': { bgcolor: '#d32f2f' } }}
          >
            Delete Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: colors.navy, color: colors.gold }}>
          Review Details
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedReview && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: colors.textGray }}>Customer Name</Typography>
                <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {selectedReview.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: colors.textGray }}>Rating</Typography>
                <Box sx={{ mb: 2 }}>
                  <Rating 
                    value={selectedReview.rating} 
                    readOnly 
                    sx={{ 
                      '& .MuiRating-iconFilled': { color: colors.gold }
                    }} 
                  />
                  <Typography variant="body2" sx={{ ml: 1, color: colors.textGray }}>
                    {selectedReview.rating}/5
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: colors.textGray }}>Review Comment</Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {selectedReview.comment}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: colors.textGray }}>Status</Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={getStatusInfo(selectedReview.status).icon}
                    label={getStatusInfo(selectedReview.status).label}
                    sx={{
                      bgcolor: getStatusInfo(selectedReview.status).color + '20',
                      color: getStatusInfo(selectedReview.status).color,
                      fontWeight: 'bold',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" sx={{ color: colors.textGray }}>Date Submitted</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {new Date(selectedReview.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: colors.gray }}>
          <Button onClick={() => setDetailsDialog(false)} sx={{ color: colors.textGray }}>
            Close
          </Button>
          {selectedReview && selectedReview.status !== 'approved' && (
            <Button
              onClick={() => {
                handleStatusUpdate(selectedReview._id, 'approved');
                setDetailsDialog(false);
              }}
              variant="contained"
              sx={{ bgcolor: colors.success, color: colors.white }}
            >
              Approve Review
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
