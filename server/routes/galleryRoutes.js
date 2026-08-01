import express from 'express';
import { getGalleryItems, addGalleryItem, deleteGalleryItem, seedGalleryItems } from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getGalleryItems).post(protect, addGalleryItem);
router.route('/seed').post(protect, seedGalleryItems);
router.route('/:id').delete(protect, deleteGalleryItem);

export default router;
