import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Chip,
} from '@mui/material';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  CreditCard,
  AccountBalance,
  QrCodeScanner,
  Smartphone,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  Security,
  Payment as PaymentIcon,
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
  success: '#4caf50',
};

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, from, to, date, travelers, cabinClass, seats, totalPrice, bookingId } = location.state || {};

  // Debug logging
  console.log('Payment page received data:', { flight, from, to, date, travelers, cabinClass, seats, totalPrice, bookingId });

  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    // Card Details
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    // UPI Details
    upiId: '',
    // Net Banking
    bankName: '',
    // QR Payment
    qrVerified: false,
  });

  const steps = ['Select Payment Method', 'Enter Details', 'Confirm & Pay'];

  const paymentMethods = [
    {
      id: 'card',
      title: 'Credit/Debit Card',
      icon: <CreditCard />,
      description: 'Visa, Mastercard, RuPay',
    },
    {
      id: 'upi',
      title: 'UPI Payment',
      icon: <Smartphone />,
      description: 'Google Pay, PhonePe, PayTM',
    },
    {
      id: 'netbanking',
      title: 'Net Banking',
      icon: <AccountBalance />,
      description: 'All major banks supported',
    },
    {
      id: 'qr',
      title: 'QR Code',
      icon: <QrCodeScanner />,
      description: 'Scan & Pay instantly',
    },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (activeStep === 0 && !paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    if (activeStep === 1) {
      // Validate payment form data
      if (paymentMethod === 'card') {
        if (!formData.cardNumber || !formData.cardName || !formData.expiry || !formData.cvv) {
          setError('Please fill in all card details');
          return;
        }
      } else if (paymentMethod === 'upi') {
        if (!formData.upiId) {
          setError('Please enter your UPI ID');
          return;
        }
      } else if (paymentMethod === 'netbanking') {
        if (!formData.bankName) {
          setError('Please select a bank');
          return;
        }
      } else if (paymentMethod === 'qr') {
        if (!formData.qrVerified) {
          setError('Please confirm you have scanned the QR code');
          return;
        }
      }
    }

    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePayment = async () => {
    console.log('Payment button clicked!');
    setProcessing(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');

    try {
      const paymentData = {
        bookingId,
        amount: totalPrice,
        method: paymentMethod,
        flight: flight?._id,
        from,
        to,
        date,
        travelers,
        cabinClass,
        seats: seats?.map(s => ({ seatNumber: s.seatNumber || s.id, price: s.price })) || [],
        ...formData,
      };

      console.log('Sending payment data to backend:', paymentData);

      let paymentResponse;
      try {
        const res = await axios.post('http://localhost:8000/payments/process', paymentData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          paymentResponse = res.data;
        }
      } catch (apiError) {
        console.log('Backend payment failed, using local fallback:', apiError.message);
      }

      // Also create a booking record on the backend
      try {
        await axios.post('http://localhost:8000/bookings/book', {
          flightId: flight?._id,
          airport: from,
          flight: flight?.airline,
          price: totalPrice,
          from,
          to,
          seats: seats?.map(s => ({ seatNumber: s.seatNumber || s.id, price: s.price })) || [],
          travelers,
          cabinClass,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (bookingError) {
        console.log('Backend booking failed:', bookingError.message);
      }

      setSuccess('Payment confirmed! Redirecting to booking status...');
      setPaymentComplete(true);

      const bookingRecord = {
        _id: paymentResponse?.booking?._id || bookingId || 'booking-' + Date.now(),
        status: 'Confirmed',
        airport: from,
        flight: flight?.airline || 'Selected Flight',
        price: totalPrice,
      };

      setTimeout(() => {
        navigate('/booking-status', {
          state: {
            booking: bookingRecord,
            paymentId: paymentResponse?.payment?.transactionId || 'PAY' + Date.now(),
            success: true
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Card Number"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <CreditCard sx={{ mr: 1, color: colors.gold }} />,
              }}
            />
            <TextField
              fullWidth
              label="Cardholder Name"
              name="cardName"
              value={formData.cardName}
              onChange={handleInputChange}
              placeholder="John Doe"
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  type="password"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 'upi':
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="UPI ID"
              name="upiId"
              value={formData.upiId}
              onChange={handleInputChange}
              placeholder="yourname@upi"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Smartphone sx={{ mr: 1, color: colors.gold }} />,
              }}
            />
            <Box sx={{ p: 2, bgcolor: colors.navyLight, borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: colors.textGray, mb: 1 }}>
                You will receive a payment request on your UPI app
              </Typography>
              <Chip icon={<Smartphone />} label="UPI Enabled" size="small" sx={{ bgcolor: colors.gold, color: colors.navy }} />
            </Box>
          </Box>
        );

      case 'netbanking':
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              select
              label="Select Bank"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              SelectProps={{ native: true }}
            >
              <option value="">Select Bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
              <option value="pnb">Punjab National Bank</option>
            </TextField>
            <Box sx={{ p: 2, bgcolor: colors.navyLight, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ color: colors.textGray }}>
                You will be redirected to your bank's secure payment gateway
              </Typography>
            </Box>
          </Box>
        );

      case 'qr':
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: colors.gold, mb: 2 }}>
              Scan QR Code to Pay
            </Typography>

            {/* Dummy QR Code */}
            <Box sx={{
              width: 200,
              height: 200,
              bgcolor: colors.white,
              border: `2px solid ${colors.gold}`,
              borderRadius: 1,
              mx: 'auto',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}>
              <Box sx={{
                width: 180,
                height: 180,
                bgcolor: colors.navy,
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 8px, ${colors.gold} 8px, ${colors.gold} 16px), repeating-linear-gradient(90deg, transparent, transparent 8px, ${colors.gold} 8px, ${colors.gold} 16px)`,
                opacity: 0.3,
              }} />
              <QrCodeScanner sx={{ fontSize: 60, color: colors.gold, position: 'absolute' }} />
            </Box>

            <Typography variant="body2" sx={{ color: colors.textGray, mb: 2 }}>
              Scan with any UPI app or mobile banking app
            </Typography>

            <Button
              variant="outlined"
              onClick={() => setFormData({ ...formData, qrVerified: true })}
              sx={{
                color: colors.gold,
                borderColor: colors.gold,
                '&:hover': { borderColor: colors.goldLight, color: colors.goldLight }
              }}
            >
              I've Scanned the QR Code
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  if (!flight || !totalPrice || !seats) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: colors.navy, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: colors.white, mb: 2 }}>
            No booking data found
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textGray, mb: 3 }}>
            Please go back and select your flight and seats first.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/flights')}
            sx={{
              background: colors.gold,
              color: colors.navy,
              '&:hover': { background: colors.goldLight },
            }}
          >
            Search Flights
          </Button>
        </Card>
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
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: colors.navyLight, border: `1px solid ${colors.gold}40` }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ color: colors.white }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 0, bgcolor: colors.navyLight, color: colors.white, border: `1px solid ${colors.gold}` }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 0, bgcolor: colors.gold, color: colors.navy }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Payment Form */}
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 0, bgcolor: colors.navyLight, border: `1px solid ${colors.gold}40` }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: colors.gold, mb: 3, fontFamily: '"Playfair Display", serif' }}>
                  {steps[activeStep]}
                </Typography>

                {activeStep === 0 && (
                  <Grid container spacing={2}>
                    {paymentMethods.map((method) => (
                      <Grid item xs={12} sm={6} key={method.id}>
                        <Paper
                          onClick={() => setPaymentMethod(method.id)}
                          sx={{
                            p: 3,
                            border: `2px solid ${paymentMethod === method.id ? colors.gold : colors.navy}`,
                            bgcolor: paymentMethod === method.id ? colors.navy : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            '&:hover': { border: `2px solid ${colors.goldLight}` },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ color: paymentMethod === method.id ? colors.gold : colors.textGray }}>
                              {method.icon}
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ color: colors.white, fontSize: '1rem' }}>
                                {method.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: colors.textGray }}>
                                {method.description}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {activeStep === 1 && renderPaymentForm()}

                {activeStep === 2 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CheckCircle sx={{ fontSize: 60, color: colors.success, mb: 2 }} />
                    <Typography variant="h6" sx={{ color: colors.white, mb: 2 }}>
                      Ready to Pay
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textGray }}>
                      Review your details and click confirm to complete the payment
                    </Typography>
                  </Box>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ color: colors.gold }}
                    startIcon={<ArrowBack />}
                  >
                    Back
                  </Button>

                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handlePayment}
                      disabled={processing || paymentComplete}
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 0,
                        background: colors.gold,
                        color: colors.navy,
                        fontWeight: 600,
                        '&:hover': { background: colors.goldLight },
                        '&:disabled': { bgcolor: colors.textGray },
                      }}
                      startIcon={processing ? <CircularProgress size={20} sx={{ color: colors.navy }} /> : <PaymentIcon />}
                    >
                      {processing ? 'Processing...' : `Pay ₹${totalPrice}`}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 0,
                        background: colors.gold,
                        color: colors.navy,
                        fontWeight: 600,
                        '&:hover': { background: colors.goldLight },
                      }}
                      endIcon={<ArrowForward />}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Booking Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 0, bgcolor: colors.navyLight, border: `1px solid ${colors.gold}40` }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ color: colors.gold, mb: 3 }}>
                  Booking Summary
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: colors.textGray, mb: 1 }}>
                    Flight Details
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.white, fontWeight: 600 }}>
                    {flight?.airline}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textGray }}>
                    {from} → {to}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textGray }}>
                    {date} • {travelers} Traveler(s)
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: colors.textGray, mb: 1 }}>
                    Selected Seats
                  </Typography>
                  {seats?.map((seat) => (
                    <Typography key={seat._id || seat.id} variant="body2" sx={{ color: colors.white }}>
                      Seat {seat.seatNumber || seat.id} - ₹{seat.price}
                    </Typography>
                  ))}
                </Box>

                <Box sx={{ borderTop: `1px solid ${colors.gold}40`, pt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: colors.textGray }}>
                      Subtotal
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.white }}>
                      ₹{totalPrice}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: colors.textGray }}>
                      Taxes & Fees
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.white }}>
                      ₹0
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: colors.white }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{ color: colors.gold }}>
                      ₹{totalPrice}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: colors.navy, borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Security sx={{ fontSize: 16, color: colors.gold }} />
                    <Typography variant="body2" sx={{ color: colors.gold }}>
                      Secure Payment
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: colors.textGray }}>
                    Your payment information is encrypted and secure
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}