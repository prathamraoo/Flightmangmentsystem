import mongoose from "mongoose";

const airportSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  code: {
    type: String,
    required: true
  },

  image: {
    type: String
  }

}, { timestamps: true });

export default mongoose.model("Airport", airportSchema);