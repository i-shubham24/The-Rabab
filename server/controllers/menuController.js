import MenuItem from '../models/MenuItem.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const getMenuItems = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ isAvailable: true });
  res.status(200).json(items);
});

export const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Menu item not found');
  }
  res.status(200).json(item);
});

export const createMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json(item);
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) {
    throw new ApiError(404, 'Menu item not found');
  }
  res.status(200).json(item);
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Menu item not found');
  }
  res.status(200).json({ message: 'Menu item removed' });
});
