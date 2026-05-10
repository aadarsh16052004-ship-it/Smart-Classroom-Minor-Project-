import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["Info", "Warning", "Emergency"],
      default: "Info",
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetRole: {
      type: String,
      enum: ["student", "teacher", "all"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);