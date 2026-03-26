import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  Rating,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  useNavigate,
} from "react-router-dom";
import {
  Person,
  Send,
  Star,
} from '@mui/icons-material';
import axios from 'axios';

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

export default function Reviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    rating: 5,
    comment: '',
  });

  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/reviews');
      if (res.data?.success) {
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.comment) {
      setError('Please fill in all fields');
      return;
    }

    if (!token) {
      setError('Please login to submit a review');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      console.log('Submitting review:', form);
      const res = await axios.post('http://localhost:8000/reviews', form, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Review submission response:', res.data);
      if (res.data?.success) {
        setSuccess('Thank you for your review!');
        setForm({ name: '', rating: 5, comment: '' });
        fetchReviews();
      } else {
        setError(res.data?.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Review submission error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to submit review. Please check if the backend server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.navy }}>
      {/* Luxury Header */}
      <Box sx={{ borderBottom: `1px solid ${colors.navyLight}` }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3 }}>
            <Typography
              variant="h4"
              sx={{
                color: colors.gold,
                fontWeight: 300,
                letterSpacing: '0.3em',
                fontFamily: '"Playfair Display", Georgia, serif',
                cursor: 'pointer',
                '&:hover': { color: colors.goldLight },
                transition: 'color 0.3s',
              }}
              onClick={() => navigate('/home')}
            >
              SKYBOOK
            </Typography>
            <Box sx={{ display: 'flex', gap: 6 }}>
              <Typography
                sx={{
                  color: colors.white,
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  '&:hover': { color: colors.gold },
                  transition: 'color 0.3s',
                }}
                onClick={() => navigate('/airports')}
              >
                Airports
              </Typography>
              <Typography
                sx={{
                  color: colors.white,
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  '&:hover': { color: colors.gold },
                  transition: 'color 0.3s',
                }}
                onClick={() => navigate('/flights')}
              >
                Flights
              </Typography>
              <Typography
                sx={{
                  color: colors.gold,
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Reviews
              </Typography>
            </Box>
            {token ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ color: colors.gold, fontSize: '0.9rem' }}>
                  {user?.name || 'User'}
                </Typography>
                <Button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  }}
                  sx={{
                    color: colors.gold,
                    border: `1px solid ${colors.gold}`,
                    borderRadius: 0,
                    px: 3,
                    py: 0.5,
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    '&:hover': { bgcolor: colors.gold, color: colors.navy },
                    transition: 'all 0.3s',
                  }}
                >
                  LOGOUT
                </Button>
              </Box>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                sx={{
                  color: colors.gold,
                  border: `1px solid ${colors.gold}`,
                  borderRadius: 0,
                  px: 4,
                  py: 1,
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  '&:hover': { bgcolor: colors.gold, color: colors.navy },
                  transition: 'all 0.3s',
                }}
              >
                SIGN IN
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                color: colors.gold,
                letterSpacing: '0.5em',
                fontSize: '0.75rem',
                mb: 2,
                display: 'block',
              }}
            >
              TESTIMONIALS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: colors.white,
                fontWeight: 300,
                mb: 3,
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              Customer Reviews
            </Typography>
          </Box>

          {/* Submit Review Form */}
          <Card sx={{ mb: 6, borderRadius: 0, bgcolor: colors.navyLight, border: `1px solid ${colors.gold}40` }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ color: colors.gold, mb: 3, fontFamily: '"Playfair Display", serif' }}>
                Share Your Experience
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 0, bgcolor: colors.navy, color: colors.white, border: `1px solid ${colors.gold}` }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 0, bgcolor: colors.gold, color: colors.navy }}>
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                          bgcolor: colors.navy,
                          color: colors.white,
                          '& fieldset': { borderColor: colors.gold },
                        },
                        '& .MuiInputLabel-root': { color: colors.textGray },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
                      <Typography sx={{ color: colors.textGray }}>Rating:</Typography>
                      <Rating
                        value={form.rating}
                        onChange={(e, newValue) => setForm({ ...form, rating: newValue || 5 })}
                        sx={{
                          '& .MuiRating-iconFilled': { color: colors.gold },
                          '& .MuiRating-iconEmpty': { color: colors.textGray },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Your Review"
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 0,
                          bgcolor: colors.navy,
                          color: colors.white,
                          '& fieldset': { borderColor: colors.gold },
                        },
                        '& .MuiInputLabel-root': { color: colors.textGray },
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  startIcon={<Send />}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    px: 4,
                    borderRadius: 0,
                    background: colors.gold,
                    color: colors.navy,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    '&:hover': { background: colors.goldLight },
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Reviews List */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: colors.gold }} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {reviews.map((review, index) => (
                <Grid item xs={12} md={6} key={review._id || index}>
                  <Card sx={{ borderRadius: 0, bgcolor: colors.white, height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: colors.navy, color: colors.gold }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ color: colors.navy, fontWeight: 600 }}>
                            {review.name}
                          </Typography>
                          <Rating
                            value={review.rating}
                            readOnly
                            size="small"
                            sx={{
                              '& .MuiRating-iconFilled': { color: colors.gold },
                            }}
                          />
                        </Box>
                      </Box>
                      <Divider sx={{ my: 2, borderColor: colors.gray }} />
                      <Typography variant="body1" sx={{ color: colors.textGray }}>
                        "{review.comment}"
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.textGray, mt: 2, display: 'block' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}
