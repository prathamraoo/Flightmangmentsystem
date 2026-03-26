import express from 'express';
import authUser from "../middleware/authUser.js";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  getFlightSeats,
  bookSeats,
  releaseSeats,
  getSeatStats,
} from '../controller/seatController.js';

const router = express.Router();

// Get seats for a flight
router.get('/flight/:flightId', getFlightSeats);

// Book seats
router.post('/book', authUser, bookSeats);

// Release seats (when booking is cancelled)
router.delete('/release/:bookingId', authUser, releaseSeats);

// Get seat statistics for a flight
router.get('/stats/:flightId', getSeatStats);

export default router;
