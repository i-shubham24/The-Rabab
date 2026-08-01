import express from 'express';
import { submitContactForm, getContacts, updateContactStatus } from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(submitContactForm).get(protect, getContacts);
router.route('/:id').put(protect, updateContactStatus);

export default router;
