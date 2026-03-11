import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  isRead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
}, { timestamps: true });

export default mongoose.model("Announcement", announcementSchema);
