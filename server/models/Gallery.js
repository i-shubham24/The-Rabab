import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    category: { type: String, default: 'general' },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
