import express from "express";
import authUser from "../middleware/authUser.js";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  getFlights,
  createFlight,
  updateFlight,
  deleteFlight,
  seedInternal
} from "../controller/flightController.js";

const router = express.Router();


// USER
router.get("/", getFlights);


// ADMIN
router.post("/create", adminAuth, createFlight);

router.put("/update/:id", adminAuth, updateFlight);

router.delete("/delete/:id", adminAuth, deleteFlight);

router.post("/seed-internal", adminAuth, seedInternal);


export default router;