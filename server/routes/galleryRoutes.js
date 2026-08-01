import express from 'express';
import { getGalleryItems, addGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';

const router = express.Router();

router.route('/').get(getGalleryItems).post(addGalleryItem);
router.route('/:id').delete(deleteGalleryItem);

export default router;
