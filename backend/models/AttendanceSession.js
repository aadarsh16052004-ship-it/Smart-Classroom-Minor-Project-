import mongoose from "mongoose";

const attendanceSessionSchema = new mongoose.Schema(
  {
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
    date: {
      type: Date,
      default: () => new Date().setHours(0,0,0,0),
    },
    timeSlot: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    joinedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Only one session per subject per day per timeSlot
attendanceSessionSchema.index(
  { subject: 1, date: 1, timeSlot: 1 },
  { unique: true }
);

export default mongoose.model("AttendanceSession", attendanceSessionSchema);