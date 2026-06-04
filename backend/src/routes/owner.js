import express from 'express';
import {getOwnerStore} from '../controllers/owner.js';
import {protect,authorize} from '../middleware/auth.js';

const router=express.Router();

router.use(protect);
router.use(authorize('STORE_OWNER'));

router.get('/store',getOwnerStore);

export default router;