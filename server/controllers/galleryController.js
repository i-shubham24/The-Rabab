import Gallery from '../models/Gallery.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

export const getGalleryItems = asyncHandler(async (req, res) => {
  const items = await Gallery.find({ isApproved: true });
  res.status(200).json(items);
});

export const addGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.create(req.body);
  res.status(201).json(item);
});

export const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Gallery item not found');
  }
  res.status(200).json({ message: 'Gallery item removed' });
});

export const seedGalleryItems = asyncHandler(async (req, res) => {
  const { items } = req.body;
  if (!items || !items.length) {
    throw new ApiError(400, 'No items provided for seeding');
  }

  await Gallery.deleteMany({});
  const createdItems = await Gallery.insertMany(items);
  res.status(201).json(createdItems);
});
