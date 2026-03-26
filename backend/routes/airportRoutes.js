import express from "express";
import authUser from "../middleware/authUser.js";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  getAirports,
  createAirport,
  updateAirport,
  deleteAirport
} from "../controller/airportController.js";

const router = express.Router();


// USER + ADMIN
router.get("/", getAirports);


// ADMIN
router.post("/create", adminAuth, createAirport);

router.put("/update/:id", adminAuth, updateAirport);

router.delete("/delete/:id", adminAuth, deleteAirport);


export default router;