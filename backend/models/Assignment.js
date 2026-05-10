// import mongoose from "mongoose";
// const assignmentSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     subject: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Subject",
//       required: true,
//     },
//     teacher: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Teacher",
//       required: true,
//     },
//     dueDate: {
//       type: Date,
//       required: true,
//     },
//     maxMarks: {
//       type: Number,
//       required: true,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Assignment", assignmentSchema);


import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    subject:     { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    teacher:     { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    dueDate:     { type: Date, required: true },
    maxMarks:    { type: Number, required: true },
    isActive:    { type: Boolean, default: true },
    allowResubmission: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
