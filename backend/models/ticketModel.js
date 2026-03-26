import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({

  bookingId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Booking"
  },

  user:String,

  airport:String,

  flight:String,

  price:Number

},{timestamps:true});

export default mongoose.model("Ticket",ticketSchema);