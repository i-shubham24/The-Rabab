import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  seedMenuItems
} from '../controllers/menuController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/seed', protect, seedMenuItems);
router.route('/').get(getMenuItems).post(protect, createMenuItem);
router.route('/:id').get(getMenuItemById).put(protect, updateMenuItem).delete(protect, deleteMenuItem);

export default router;
