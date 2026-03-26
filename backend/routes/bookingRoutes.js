import express from "express";
import authUser from "../middleware/authUser.js";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  createBooking,
  getBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking
} from "../controller/bookingController.js";

const router = express.Router();


// USER
router.post("/book", authUser, createBooking);
router.get("/:id", authUser, getBooking);


// ADMIN
router.get("/", adminAuth, getAllBookings);

router.put("/status/:id", adminAuth, updateBookingStatus);

router.delete("/delete/:id", adminAuth, deleteBooking);


export default router;