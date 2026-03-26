import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
  },

  airport: String,

  flight: String,

  from: String,

  to: String,

  seats: [
    {
      seatNumber: String,
      price: Number,
    }
  ],

  travelers: Number,

  cabinClass: String,

  price: Number,

  status: {
    type: String,
    default: "Pending"
  },

  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);