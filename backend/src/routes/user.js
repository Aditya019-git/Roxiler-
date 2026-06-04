import express from 'express';
import {getStores, submitRating, updateRating } from '../controllers/user.js';

import {protect,authorize} from '../middleware/auth.js';

const router=express.Router();

router.use(protect);
router.get('/stores',getStores);
router.post('/ratings',authorize('NORMAL_USER'),submitRating);
router.put('/ratings/:ratingId',authorize('NORMAL_USER'),updateRating);

export default router;