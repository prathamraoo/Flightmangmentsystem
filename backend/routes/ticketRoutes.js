import express from "express";

import {
 getTicket,
 getAllTickets,
 deleteTicket,
 getUserTickets
} from "../controller/ticketController.js";

import authUser from "../middleware/authUser.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();


// USER - Get all tickets for logged-in user
router.get("/my-tickets", authUser, getUserTickets);

// USER - Get single ticket
router.get("/:id", authUser, getTicket);


// ADMIN
router.get("/", adminAuth, getAllTickets);

router.delete("/delete/:id", adminAuth, deleteTicket);

export default router;