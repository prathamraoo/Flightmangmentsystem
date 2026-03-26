import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'qr'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
  },
  paymentDetails: {
    // Card details
    cardNumber: String,
    cardName: String,
    expiry: String,
    // UPI details
    upiId: String,
    // Net banking
    bankName: String,
    // QR payment
    qrVerified: Boolean,
  },
  from: String,
  to: String,
  date: String,
  travelers: Number,
  cabinClass: String,
  seats: [{
    seatNumber: String,
    price: Number,
  }],
  completedAt: Date,
}, { timestamps: true });

// Generate transaction ID
paymentSchema.pre('save', function(next) {
  if (this.isNew && !this.transactionId) {
    this.transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

export default mongoose.model("Payment", paymentSchema);