import express from 'express';
import { submitContactForm, getContacts, updateContactStatus } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(submitContactForm).get(protect, admin, getContacts);
router.route('/:id').put(protect, admin, updateContactStatus);

export default router;
