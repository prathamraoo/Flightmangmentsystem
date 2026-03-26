import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  row: {
    type: Number,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  cabinClass: {
    type: String,
    enum: ['Economy', 'Business', 'First'],
    default: 'Economy',
  },
  price: {
    type: Number,
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for unique seat per flight
seatSchema.index({ flightId: 1, seatNumber: 1 }, { unique: true });

const Seat = mongoose.model('Seat', seatSchema);
export default Seat;
