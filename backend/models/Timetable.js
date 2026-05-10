import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    startTime: {
      type: String, // e.g. "10:00"
      required: true,
    },

    endTime: {
      type: String, // e.g. "11:00"
      required: true,
    },
  },
  { timestamps: true }
);



export default mongoose.model("Timetable", timetableSchema);