const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true},
    isActive: { type: Boolean, default: true, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const ChildCategoryModel = mongoose.model("ChildCategory", dataSchema);

module.exports = ChildCategoryModel;
