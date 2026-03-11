import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Hardware", "Software"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "Allocated"],
      default: "Available",
    },

    allocatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },

    allocatedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);



export default mongoose.model("Resource", resourceSchema);