import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  seedMenuItems
} from '../controllers/menuController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/seed', protect, admin, seedMenuItems);
router.route('/').get(getMenuItems).post(protect, admin, createMenuItem);
router.route('/:id').get(getMenuItemById).put(protect, admin, updateMenuItem).delete(protect, admin, deleteMenuItem);

export default router;
