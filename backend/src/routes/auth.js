import express from 'express';
import {register,login,updatePassword} from '../controllers/auth.js';
import {validateRegistration} from '../middleware/validate.js';
import {protect} from '../middleware/auth.js';

const router=express.Router();

router.post('/register',validateRegistration,register);
router.post('/login',login);
router.put('/password',protect,updatePassword);

export default router;