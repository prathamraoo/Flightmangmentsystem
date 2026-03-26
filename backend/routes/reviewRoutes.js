import express from 'express';
import authUser from "../middleware/authUser.js";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  getReviews,
  getAllReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
} from '../controller/reviewController.js';

const router = express.Router();

// Public routes
router.get('/', getReviews);
router.post('/', authUser, createReview);

// Admin routes
router.get('/all', adminAuth, getAllReviews);
router.put('/:id', adminAuth, updateReviewStatus);
router.delete('/:id', adminAuth, deleteReview);

export default router;
