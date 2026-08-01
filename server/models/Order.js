import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true }
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    items: [orderItemSchema],
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    fulfillmentType: {
      type: String,
      enum: ['Takeaway', 'Delivery'],
      default: 'Takeaway',
    },
    deliveryAddress: { type: String },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    specialInstructions: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
