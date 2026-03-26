import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  AirlineSeatReclineNormal,
  Person,
  ArrowForward,
  CheckCircle,
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
  green: '#4caf50',
  red: '#f44336',
};

export default function SeatBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, from, to, date, travelers, cabinClass } = location.state || {};

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Generate seat layout based on cabin class (fallback)
  const generateSeats = () => {
    const seatLayout = [];
    const rows = cabinClass === 'Business' ? 8 : 12;
    const seatsPerRow = cabinClass === 'Business' ? 4 : 6;

    for (let row = 1; row <= rows; row++) {
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatNumber = `${row}${String.fromCharCode(64 + seat)}`;
        const isBooked = Math.random() < 0.3; // 30% seats already booked
        const price = cabinClass === 'Business' ?
          flight?.price * 1.8 || 8000 :
          flight?.price || 4500;

        seatLayout.push({
          _id: seatNumber, // Use _id for consistency with backend
          id: seatNumber,  // Keep id for frontend compatibility
          seatNumber,
          row,
          position: seat,
          isBooked,
          price,
          cabinClass,
        });
      }
    }
    return seatLayout;
  };

  // Fetch seats from backend
  const fetchSeats = async () => {
    try {
      setLoading(true);

      // For demo, use a mock flight ID if no real flight._id
      const flightId = flight?._id || 'demo-flight-id';

      const res = await axios.get(`http://localhost:8000/seats/flight/${flightId}?cabinClass=${cabinClass}`);

      if (res.data?.success) {
        setSeats(res.data.seats || []);
      } else {
        // Fallback to generated seats if backend fails
        const fallbackSeats = generateSeats();
        setSeats(fallbackSeats);
      }
    } catch (error) {
      console.error('Failed to fetch seats from backend:', error);
      // Fallback to generated seats
      const fallbackSeats = generateSeats();
      setSeats(fallbackSeats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!flight) {
      navigate('/flights');
      return;
    }

    fetchSeats();
  }, [flight, navigate]);

  const handleSeatClick = (seat) => {
    console.log('Seat clicked:', seat);
    console.log('Current selected seats:', selectedSeats);
    console.log('Travelers limit:', travelers);

    if (seat.isBooked) {
      console.log('Seat is already booked');
      return;
    }

    const isAlreadySelected = selectedSeats.find(s =>
      (s._id && s._id === seat._id) ||
      (s.id && s.id === seat.id) ||
      (s.seatNumber && s.seatNumber === seat.seatNumber)
    );
    console.log('Is seat already selected:', isAlreadySelected);

    if (isAlreadySelected) {
      // Deselect seat
      console.log('Deselecting seat');
      setSelectedSeats(selectedSeats.filter(s =>
        !((s._id && s._id === seat._id) ||
          (s.id && s.id === seat.id) ||
          (s.seatNumber && s.seatNumber === seat.seatNumber))
      ));
    } else if (selectedSeats.length < travelers) {
      // Select seat if under traveler limit
      console.log('Selecting seat');
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      console.log('Cannot select more seats - limit reached');
      setError(`You can only select ${travelers} seat(s)`);
      setTimeout(() => setError(''), 3000);
    }
  };

  const getSeatColor = (seat) => {
    if (seat.isBooked) return colors.red;
    if (selectedSeats.find(s =>
      (s._id && s._id === seat._id) ||
      (s.id && s.id === seat.id) ||
      (s.seatNumber && s.seatNumber === seat.seatNumber)
    )) return colors.gold;
    return colors.navyLight;
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const handleProceed = () => {
    console.log('Proceed button clicked!');
    console.log('Selected seats:', selectedSeats);
    console.log('Travelers count:', travelers);

    if (selectedSeats.length !== travelers) {
      setError(`Please select exactly ${travelers} seat(s)`);
      setTimeout(() => setError(''), 3000);
      return;
    }
    setConfirmDialogOpen(true);
  };

  const handleConfirmBooking = async () => {
    console.log('Confirm booking clicked!');
    console.log('Selected seats for booking:', selectedSeats);

    try {
      // Create payment data directly (skip backend booking for now)
      const paymentData = {
        flight,
        from,
        to,
        date,
        travelers,
        cabinClass,
        seats: selectedSeats,
        totalPrice: getTotalPrice(),
        bookingId: `booking-${Date.now()}`,
      };

      console.log('Navigating to payment with data:', paymentData);

      // Try backend booking first
      try {
        const seatIds = selectedSeats.map(seat => seat._id || seat.id);
        const bookingData = {
          seatIds,
          bookingId: paymentData.bookingId,
        };

        console.log('Sending booking data:', bookingData);
        const res = await axios.post('http://localhost:8000/seats/book', bookingData);
        console.log('Booking response:', res.data);

        if (res.data?.success) {
          console.log('Backend booking successful, proceeding to payment');
        } else {
          console.log('Backend booking failed, proceeding anyway');
        }
      } catch (backendError) {
        console.error('Backend booking error:', backendError);
        console.log('Proceeding to payment without backend booking');
      }

      // Always proceed to payment
      navigate('/payment', { state: paymentData });

    } catch (error) {
      console.error('Error in handleConfirmBooking:', error);
      setError('Failed to proceed to payment. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: colors.navy, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: colors.gold }} />
      </Box>
    );
  }

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
                  color: colors.white,
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  '&:hover': { color: colors.gold },
                  transition: 'color 0.3s',
                }}
                onClick={() => navigate('/reviews')}
              >
                Reviews
              </Typography>
            </Box>
            <Button
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
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: 8 }}>
        <Container maxWidth="xl">
          {/* Flight Info Header */}
          <Card sx={{ mb: 4, borderRadius: 0, bgcolor: colors.navyLight, border: `1px solid ${colors.gold}40` }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container alignItems="center" spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" sx={{ color: colors.gold, mb: 1 }}>
                    {flight?.airline || 'Selected Flight'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Typography variant="h5" sx={{ color: colors.white, fontWeight: 600 }}>
                      {from}
                    </Typography>
                    <ArrowForward sx={{ color: colors.gold }} />
                    <Typography variant="h5" sx={{ color: colors.white, fontWeight: 600 }}>
                      {to}
                    </Typography>
                    <Chip
                      label={cabinClass}
                      size="small"
                      sx={{ bgcolor: colors.gold, color: colors.navy }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ color: colors.textGray }}>
                    {travelers} Traveler(s) • {date}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 0, bgcolor: colors.navyLight, color: colors.white, border: `1px solid ${colors.gold}` }}>
              {error}
            </Alert>
          )}

          {/* Seat Selection Area */}
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            {/* Airplane Container */}
            <Card sx={{ borderRadius: 0, bgcolor: colors.navyLight, border: `1px solid ${colors.gold}40`, mb: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: colors.gold, mb: 3, fontFamily: '"Playfair Display", serif', textAlign: 'center' }}>
                  Select Your Seats
                </Typography>

                {/* Legend */}
                <Box sx={{ display: 'flex', gap: 3, mb: 4, justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 24, height: 24, bgcolor: colors.navyLight, border: `1px solid ${colors.gold}` }} />
                    <Typography variant="body2" sx={{ color: colors.white }}>Available</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 24, height: 24, bgcolor: colors.gold }} />
                    <Typography variant="body2" sx={{ color: colors.white }}>Selected</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 24, height: 24, bgcolor: colors.red }} />
                    <Typography variant="body2" sx={{ color: colors.white }}>Occupied</Typography>
                  </Box>
                </Box>

                {/* Aircraft Layout */}
                <Box sx={{
                  bgcolor: '#eceff1', // Light gray plane body
                  p: { xs: 2, md: 4 },
                  borderRadius: '120px 120px 30px 30px',
                  border: `6px solid #cfd8dc`,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.5)',
                  maxWidth: 450,
                  margin: '0 auto',
                  position: 'relative'
                }}>
                  {/* Airplane Nose/Cockpit */}
                  <Box sx={{
                    height: 100,
                    bgcolor: 'rgba(255,255,255,0.4)',
                    borderRadius: '100px 100px 0 0',
                    mb: 4,
                    mt: -2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '3px solid #cfd8dc',
                    position: 'relative'
                  }}>
                    <Box sx={{
                      width: '60%',
                      height: 40,
                      bgcolor: '#b0bec5',
                      borderRadius: '40px 40px 10px 10px',
                      opacity: 0.5,
                      position: 'absolute',
                      top: 10
                    }} />
                    <Typography variant="overline" sx={{ color: colors.navy, fontWeight: 'bold', mt: 4, letterSpacing: 3 }}>
                      FRONT
                    </Typography>
                  </Box>

                  {/* Cabin Details */}
                  <Typography variant="subtitle1" sx={{ color: colors.navy, textAlign: 'center', mb: 3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
                    {cabinClass} Class
                  </Typography>

                  {/* Seats Container */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, alignItems: 'center' }}>
                    {Array.from(new Set(seats.map(s => s.row))).sort((a, b) => a - b).map(rowNum => {
                      const rowSeats = seats.filter(s => s.row === rowNum).sort((a, b) => a.position - b.position);
                      const seatsPerRow = rowSeats.length;
                      const midPoint = Math.ceil(seatsPerRow / 2);
                      const leftSeats = rowSeats.slice(0, midPoint);
                      const rightSeats = rowSeats.slice(midPoint);

                      const renderSeatBox = (seat) => {
                        const isSelected = selectedSeats.find(s =>
                          (s._id && s._id === seat._id) ||
                          (s.id && s.id === seat.id) ||
                          (s.seatNumber && s.seatNumber === seat.seatNumber)
                        );
                        return (
                          <Box key={seat._id || seat.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Paper
                              onClick={() => handleSeatClick(seat)}
                              sx={{
                                width: 42,
                                height: 48, // Taller to resemble a seat
                                bgcolor: seat.isBooked ? colors.navyLight :
                                  isSelected ? colors.gold : '#ffffff',
                                border: `2px solid ${seat.isBooked ? colors.navyLight : isSelected ? colors.gold : '#cfd8dc'}`,
                                borderRadius: '12px 12px 4px 4px', // Rounded top for headrest
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: seat.isBooked ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: isSelected ? `0 4px 12px ${colors.gold}60` : '0 2px 4px rgba(0,0,0,0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': !seat.isBooked ? {
                                  bgcolor: isSelected ? colors.goldLight : '#f5f5f5',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                                } : {},
                              }}
                            >
                              {/* Headrest Detail */}
                              <Box sx={{
                                position: 'absolute',
                                top: 0,
                                width: '100%',
                                height: 12,
                                bgcolor: seat.isBooked ? 'rgba(0,0,0,0.2)' :
                                  isSelected ? 'rgba(255,255,255,0.3)' : '#eceff1',
                                borderBottom: '1px solid rgba(0,0,0,0.05)'
                              }} />

                              <Typography
                                variant="caption"
                                sx={{
                                  color: seat.isBooked ? colors.white :
                                    isSelected ? colors.navy : colors.navy,
                                  fontWeight: 'bold',
                                  zIndex: 1,
                                  mt: 1
                                }}
                              >
                                {seat.seatNumber ? seat.seatNumber.slice(-1) : ''}
                              </Typography>
                            </Paper>
                          </Box>
                        );
                      };

                      return (
                        <Box key={`row-${rowNum}`} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                          {/* Left Side */}
                          <Box sx={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
                            {leftSeats.map(renderSeatBox)}
                          </Box>

                          {/* Aisle with Row Number */}
                          <Box sx={{ width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ color: '#90a4ae', fontWeight: 'bold' }}>
                              {rowNum}
                            </Typography>
                          </Box>

                          {/* Right Side */}
                          <Box sx={{ display: 'flex', gap: 1, flex: 1, justifyContent: 'flex-start' }}>
                            {rightSeats.map(renderSeatBox)}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>

                  {/* Rear of plane details */}
                  <Box sx={{
                    height: 60,
                    mt: 4,
                    borderTop: '2px solid #cfd8dc',
                    display: 'flex',
                    justifyContent: 'space-between',
                    pt: 2
                  }}>
                    <Box sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }} />
                    <Box sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Booking Summary - Stacked Below */}
            <Card sx={{ borderRadius: 0, bgcolor: colors.navyLight, border: `1px solid ${colors.gold}40` }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ color: colors.gold, mb: 3, textAlign: 'center' }}>
                  Booking Summary
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: colors.textGray, textAlign: 'center', mb: 2 }}>
                    Selected Seats ({selectedSeats.length}/{travelers})
                  </Typography>
                  {selectedSeats.length > 0 ? (
                    <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 500, mx: 'auto' }}>
                      {selectedSeats.map((seat) => (
                        <Grid item xs={6} sm={4} key={seat._id || seat.id}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: colors.navy, p: 1.5, border: `1px solid ${colors.gold}40`, borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ color: colors.white }}>
                              Seat {seat.seatNumber || seat.id}
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.gold }}>
                              ₹{seat.price}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body2" sx={{ color: colors.textGray, mt: 1, textAlign: 'center' }}>
                      No seats selected
                    </Typography>
                  )}
                </Box>

                <Box sx={{ borderTop: `1px solid ${colors.gold}40`, pt: 3, maxWidth: 400, mx: 'auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ color: colors.white }}>
                      Total Amount
                    </Typography>
                    <Typography variant="h5" sx={{ color: colors.gold, fontWeight: 'bold' }}>
                      ₹{getTotalPrice()}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleProceed}
                    disabled={selectedSeats.length === 0}
                    sx={{
                      py: 1.5,
                      borderRadius: 1,
                      background: colors.gold,
                      color: colors.navy,
                      fontWeight: 600,
                      fontSize: '1rem',
                      letterSpacing: 1,
                      '&:hover': { background: colors.goldLight },
                      '&:disabled': { bgcolor: colors.textGray },
                    }}
                  >
                    Proceed to Payment
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{ sx: { bgcolor: colors.navyLight, color: colors.white, border: `1px solid ${colors.gold}` } }}
      >
        <DialogTitle sx={{ color: colors.gold }}>Confirm Seat Selection</DialogTitle>
        <DialogContent>
          <Typography>
            You have selected {selectedSeats.length} seat(s) for {travelers} traveler(s).
            Total amount: ₹{getTotalPrice()}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {selectedSeats.map((seat) => (
              <Typography key={seat._id || seat.id} variant="body2" sx={{ color: colors.textGray }}>
                Seat {seat.seatNumber || seat.id} - ₹{seat.price}
              </Typography>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            console.log('Cancel clicked');
            setConfirmDialogOpen(false);
          }} sx={{ color: colors.textGray }}>
            Cancel
          </Button>

          <Button onClick={handleConfirmBooking} sx={{ color: colors.gold }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
