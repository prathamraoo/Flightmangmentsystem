import Booking from "../models/bookingModel.js";


// USER - CREATE BOOKING
export const createBooking = async (req, res) => {

  try {

    const { flightId, airport, flight, price, from, to, seats, travelers, cabinClass } = req.body;

    const booking = await Booking.create({
      userId: req.user?.id,
      flightId,
      airport,
      flight,
      price,
      from,
      to,
      seats,
      travelers,
      cabinClass,
      status: "Pending"
    });

    res.json({
      success: true,
      booking
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Booking failed"
    });

  }

};



// USER - GET SINGLE BOOKING
export const getBooking = async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.id)
      .populate("userId", "name email")
      .populate("flightId", "airline source destination");

    res.json({
      success: true,
      booking
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Booking not found"
    });

  }

};



// ADMIN - GET ALL BOOKINGS
export const getAllBookings = async (req, res) => {

  try {

    const bookings = await Booking.find()
      .populate("userId", "name email phone")
      .populate("flightId", "airline source destination price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Error fetching bookings"
    });

  }

};



// ADMIN - APPROVE OR REJECT BOOKING
export const updateBookingStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      booking
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Booking status update failed"
    });

  }

};



// ADMIN - DELETE BOOKING
export const deleteBooking = async (req, res) => {

  try {

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Booking deleted"
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Delete failed"
    });

  }

};