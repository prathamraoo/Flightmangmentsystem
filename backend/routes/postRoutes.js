import express from 'express';
import { createPost } from '../controller/postController.js';
import authUser from '../middleware/authUser.js';

const router =  express.Router();

//routes
router.post("/create",authUser, createPost)


export default router;