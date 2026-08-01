import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    image: { type: String },
    isVeg: { type: Boolean, required: true, default: true },
    spiceLevel: { type: Number, min: 0, max: 3, default: 0 },
    allergens: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
