const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['amount', 'percentage'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    minimumOrder: {
      type: Number,
      default: 0,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    usageLimit: {
      type: Number,
      default: null, // null = unlimited
      min: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Coupon', couponSchema);
