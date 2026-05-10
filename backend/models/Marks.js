import mongoose from "mongoose";

const marksSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    examType: {
      type: String,
      enum: ["MST1", "MST2", "FINAL"],
      required: true,
    },

    marksObtained: {
      type: Number,
      required: true,
    },

    maxMarks: {
      type: Number,
      required: true,
    },

    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model("Marks", marksSchema);