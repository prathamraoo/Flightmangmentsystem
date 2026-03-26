import express from "express";
import authUser from "../middleware/authUser.js";
import { adminAuth } from "../middleware/adminAuth.js";

import {
  createUser,
  getUser,
  singleView,
  deleteUser,
  updateUser,
  updateUserRole
} from "../controller/userController.js";

const router = express.Router();


// ADMIN
router.post("/create", adminAuth, createUser);

router.get("/", adminAuth, getUser);

router.get("/:id", authUser, singleView);

router.put("/update/:id", adminAuth, updateUser);

router.put("/role/:id", adminAuth, updateUserRole);

router.delete("/delete/:id", adminAuth, deleteUser);


export default router;