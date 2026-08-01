import Booking from '../models/Booking.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/analytics/overview — KPI summary
export const getOverview = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalBookings,
    todayBookings,
    pendingBookings,
    totalOrders,
    todayOrders,
    totalCustomers,
    todayRevenue,
    totalRevenue,
  ] = await Promise.all([
    Booking.countDocuments({}),
    Booking.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
    Booking.countDocuments({ status: 'Pending' }),
    Order.countDocuments({}),
    Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
    User.countDocuments({ role: { $ne: 'admin' } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: today, $lt: tomorrow }, status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
  ]);

  res.json({
    totalBookings,
    todayBookings,
    pendingBookings,
    totalOrders,
    todayOrders,
    totalCustomers,
    todayRevenue: todayRevenue[0]?.total || 0,
    totalRevenue: totalRevenue[0]?.total || 0,
  });
});

// GET /api/analytics/revenue?days=7
export const getRevenueChart = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const revenue = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate }, status: { $ne: 'Cancelled' } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Fill in missing days with 0
  const result = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const found = revenue.find(r => r._id === dateStr);
    result.push({
      date: dateStr,
      revenue: found?.revenue || 0,
      orders: found?.orders || 0,
    });
  }

  res.json(result);
});

// GET /api/analytics/bookings-by-status
export const getBookingsByStatus = asyncHandler(async (req, res) => {
  const result = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.json(result.map(r => ({ status: r._id || 'Unknown', count: r.count })));
});

// GET /api/analytics/popular-dishes
export const getPopularDishes = asyncHandler(async (req, res) => {
  const result = await Order.aggregate([
    { $match: { status: { $ne: 'Cancelled' } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.name',
        totalOrdered: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      }
    },
    { $sort: { totalOrdered: -1 } },
    { $limit: 10 }
  ]);

  res.json(result.map(r => ({
    name: r._id,
    orders: r.totalOrdered,
    revenue: r.totalRevenue,
  })));
});

// GET /api/analytics/peak-hours
export const getPeakHours = asyncHandler(async (req, res) => {
  const result = await Booking.aggregate([
    { $match: { status: { $nin: ['Cancelled'] } } },
    {
      $group: {
        _id: '$time',
        count: { $sum: 1 },
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json(result.map(r => ({ time: r._id, bookings: r.count })));
});
