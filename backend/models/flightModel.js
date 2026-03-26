import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({

  airline: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  image: {
    type: String
  },

  source: {
    type: String,
    required: true
  },

  destination: {
    type: String,
    required: true
  },

  departureTime: {
    type: String,
  },

  arrivalTime: {
    type: String,
  },

  duration: {
    type: String,
  },

  availableSeats: {
    type: Number,
  },

  details: [
    {
      type: String
    }
  ],

  category: {
    type: String,
    enum: ['economy', 'business', 'first', 'premium'],
    default: 'economy'
  }

}, { timestamps: true });

export default mongoose.model("Flight", flightSchema);