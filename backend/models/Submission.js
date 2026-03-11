import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    submissionUrl: {
      type: String,
      required: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    marksObtained: {
      type: Number,
      default: null,
    },

    remarks: {
      type: String,
      default: "",
    },

    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
  },
  { timestamps: true }
);



export default mongoose.model("Submission", submissionSchema);