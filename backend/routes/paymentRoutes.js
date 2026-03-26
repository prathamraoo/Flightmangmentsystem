import express from "express";
import authUser from "../middleware/authUser.js";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  processPayment,
  makePayment,
  getPayments,
  getPaymentByBooking,
  getPaymentByTransactionId,
  updatePaymentStatus,
  deletePayment
} from "../controller/paymentController.js";

const router = express.Router();

// USER - Process comprehensive payment
router.post("/process", authUser, processPayment);

// USER - Legacy payment endpoint
router.post("/pay", authUser, makePayment);

// USER - Get payment by booking ID
router.get("/booking/:bookingId", authUser, getPaymentByBooking);

// USER - Get payment by transaction ID
router.get("/transaction/:transactionId", authUser, getPaymentByTransactionId);

// ADMIN - Get all payments
router.get("/", adminAuth, getPayments);

// ADMIN - Update payment status
router.put("/:id/status", adminAuth, updatePaymentStatus);

// ADMIN - Delete payment
router.delete("/delete/:id", adminAuth, deletePayment);

export default router;