import express from 'express';
import {getDashboardStats,
  getAllUsers,
  getUserById,
  addUser,
  getAllStores,
  addStore} from '../controllers/admin.js';

import {protect,authorize} from '../middleware/auth.js';

const router=express.Router();

router.use(protect);
router.use(authorize('SYSTEM_ADMIN'));

router.use('/dashboard',getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', addUser);
router.get('/stores', getAllStores);
router.post('/stores', addStore);
export default router;
