import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentId: { type: String },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    deliveryAddress: { type: String, required: true },
    specialInstructions: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
