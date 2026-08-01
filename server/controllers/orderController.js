import Order from '../models/Order.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest) or Private (User)
export const createOrder = asyncHandler(async (req, res) => {
  const { 
    items, 
    customerDetails, 
    fulfillmentType, 
    deliveryAddress, 
    totalAmount, 
    specialInstructions 
  } = req.body;

  if (items && items.length === 0) {
    throw new ApiError(400, 'No order items');
  }

  const order = new Order({
    // req.user might not exist if it's a guest checkout
    user: req.user ? req.user._id : undefined,
    items,
    customerDetails,
    fulfillmentType,
    deliveryAddress,
    totalAmount,
    specialInstructions
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin
// @access  Private/Admin
export const getAdminOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  order.status = status;
  await order.save();

  res.json(order);
});
