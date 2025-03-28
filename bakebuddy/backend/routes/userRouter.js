import express from 'express';
import { register, login, profile, editProfile, deleteProfile } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/admin', protect, adminOnly, (req, res) => res.json({ message: 'Admin Access Granted' }));
router.get('/me', protect, profile);
router.put('/me', protect, editProfile);
router.delete('/me', protect, deleteProfile);

export default router;