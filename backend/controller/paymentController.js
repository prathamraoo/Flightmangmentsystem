import Payment from "../models/paymentModel.js";
import Booking from "../models/bookingModel.js";
import Seat from "../models/seatModel.js";

// Process Payment (comprehensive)
export const processPayment = async (req, res) => {
  try {
    const {
      bookingId,
      amount,
      method,
      flight,
      from,
      to,
      date,
      travelers,
      cabinClass,
      seats,
      ...paymentDetails
    } = req.body;

    // Create payment record
    const payment = await Payment.create({
      bookingId,
      flightId: flight,
      userId: req.user?.id || 'demo-user', // Get from auth middleware
      amount,
      method,
      paymentDetails,
      from,
      to,
      date,
      travelers,
      cabinClass,
      seats,
      status: 'processing',
    });

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Update payment status to completed
        await Payment.findByIdAndUpdate(
          payment._id,
          { 
            status: 'completed',
            completedAt: new Date()
          }
        );

        // Update booking status
        if (bookingId) {
          await Booking.findByIdAndUpdate(
            bookingId,
            { 
              status: "Confirmed",
              paymentId: payment._id
            }
          );
        }

        // Mark seats as booked
        if (seats && seats.length > 0) {
          const seatIds = seats.map(s => s._id || s.id);
          await Seat.updateMany(
            { _id: { $in: seatIds } },
            { 
              isBooked: true, 
              bookingId: payment._id
            }
          );
        }

        console.log(`Payment ${payment.transactionId} completed successfully`);
      } catch (error) {
        console.error('Error completing payment:', error);
        await Payment.findByIdAndUpdate(
          payment._id,
          { status: 'failed' }
        );
      }
    }, 2000); // Simulate 2 second processing time

    res.json({
      success: true,
      payment: {
        _id: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        method: payment.method,
        status: payment.status
      },
      message: 'Payment processing initiated'
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: "Payment failed: " + error.message
    });
  }
};

// USER - MAKE PAYMENT (legacy)
export const makePayment = async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body;

    const payment = await Payment.create({
      bookingId,
      amount,
      method,
      status: 'completed'
    });

    await Booking.findByIdAndUpdate(
      bookingId,
      { status: "Confirmed" }
    );

    res.json({
      success: true,
      payment
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Payment failed"
    });
  }
};

// ADMIN - GET ALL PAYMENTS
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("bookingId")
      .populate("flightId")
      .populate("userId");

    res.json({
      success: true,
      payments
    });

  } catch (error) {
    res.json({
      success: false,
      message: "Error fetching payments"
    });
  }
};

// USER - GET PAYMENT BY BOOKING
export const getPaymentByBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      bookingId: req.params.bookingId
    }).populate("bookingId");

    res.json({
      success: true,
      payment
    });

  } catch (error) {
    res.json({
      success: false,
      message: "Payment not found"
    });
  }
};

// Get payment by transaction ID
export const getPaymentByTransactionId = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      transactionId: req.params.transactionId
    }).populate("bookingId").populate("flightId");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.json({
      success: true,
      payment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payment"
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'completed' && { completedAt: new Date() })
      },
      { new: true }
    ).populate("bookingId");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.json({
      success: true,
      payment,
      message: `Payment status updated to ${status}`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating payment status"
    });
  }
};

// ADMIN - DELETE PAYMENT
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    // Release seats if payment was completed
    if (payment.status === 'completed' && payment.seats?.length > 0) {
      await Seat.updateMany(
        { bookingId: payment._id },
        { 
          isBooked: false, 
          bookingId: null 
        }
      );
    }

    // Update booking status
    if (payment.bookingId) {
      await Booking.findByIdAndUpdate(
        payment.bookingId,
        { status: "Cancelled" }
      );
    }

    res.json({
      success: true,
      message: "Payment deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
};