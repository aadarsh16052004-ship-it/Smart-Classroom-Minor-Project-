import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env") });

import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Subject from "../models/Subject.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Marks from "../models/Marks.js";
import Attendance from "../models/Attendance.js";
import AttendanceSession from "../models/AttendanceSession.js";
import Lecture from "../models/Lecture.js";
import Timetable from "../models/Timetable.js";
import Resource from "../models/Resource.js";
import Alert from "../models/Alert.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB Connected");

async function seed() {
  try {
    await Promise.all([
      User.deleteMany(), Student.deleteMany(), Teacher.deleteMany(),
      Subject.deleteMany(), Assignment.deleteMany(), Submission.deleteMany(),
      Marks.deleteMany(), Attendance.deleteMany(), AttendanceSession.deleteMany(),
      Lecture.deleteMany(), Timetable.deleteMany(), Resource.deleteMany(), Alert.deleteMany(),
    ]);
    console.log("Old data cleared");

    const password = await bcrypt.hash("password123", 10);

    // USERS
    const adminUser = await User.create({ name: "Admin", email: "admin@cms.com", password, role: "admin" });
    const teacherUser1 = await User.create({ name: "Dr. Sharma", email: "teacher@cms.com", password, role: "teacher" });
    const teacherUser2 = await User.create({ name: "Prof. Mehta", email: "mehta@cms.com", password, role: "teacher" });
    const studentUsers = await User.insertMany([
      { name: "Rahul Singh", email: "rahul@cms.com", password, role: "student" },
      { name: "Aman Gupta",  email: "aman@cms.com",  password, role: "student" },
      { name: "Priya Patel", email: "priya@cms.com", password, role: "student" },
      { name: "Sneha Verma", email: "sneha@cms.com", password, role: "student" },
    ]);
    console.log("Users created");

    // TEACHERS
    const teacher1 = await Teacher.create({ userId: teacherUser1._id, subjects: [] });
    const teacher2 = await Teacher.create({ userId: teacherUser2._id, subjects: [] });

    // STUDENTS
    const students = [];
    for (let i = 0; i < studentUsers.length; i++) {
      students.push(await Student.create({ userId: studentUsers[i]._id, rollNumber: `CSE10${i+1}`, subjects: [], detainedSubjects: [] }));
    }
    console.log("Teachers & Students created");

    // SUBJECTS
    const subject1 = await Subject.create({ name: "Computer Networks",  code: "CN101", teacher: teacher1._id, students: students.map(s=>s._id), isActive: true });
    const subject2 = await Subject.create({ name: "Operating Systems",  code: "OS201", teacher: teacher1._id, students: students.map(s=>s._id), isActive: true });
    const subject3 = await Subject.create({ name: "Database Management",code: "DB301", teacher: teacher2._id, students: students.map(s=>s._id), isActive: true });

    teacher1.subjects.push(subject1._id, subject2._id); await teacher1.save();
    teacher2.subjects.push(subject3._id);               await teacher2.save();
    for (const s of students) { s.subjects.push(subject1._id, subject2._id, subject3._id); await s.save(); }
    console.log("Subjects linked");

    // ASSIGNMENTS
    const assignment1 = await Assignment.create({ title: "OSI Model Explanation", description: "Explain all 7 layers of the OSI Model with examples", subject: subject1._id, teacher: teacher1._id, dueDate: new Date(Date.now() + 7*24*60*60*1000), maxMarks: 20, isActive: true });
    const assignment2 = await Assignment.create({ title: "Deadlock Prevention", description: "Explain deadlock prevention and avoidance strategies in OS", subject: subject2._id, teacher: teacher1._id, dueDate: new Date(Date.now() + 5*24*60*60*1000), maxMarks: 25, isActive: true });
    const assignment3 = await Assignment.create({ title: "ER Diagram Design", description: "Design an ER diagram for a hospital management system", subject: subject3._id, teacher: teacher2._id, dueDate: new Date(Date.now() + 10*24*60*60*1000), maxMarks: 30, isActive: true });
    console.log("Assignments created");

    // SUBMISSIONS (first 2 students submitted assignment1, all 4 submitted assignment2)
    for (let i = 0; i < 2; i++) {
      await Submission.create({ assignment: assignment1._id, student: students[i]._id, submissionUrl: "https://github.com/sample/assignment1", submittedAt: new Date(), marksObtained: Math.floor(Math.random()*10)+10, remarks: "Good work", evaluatedBy: teacher1._id });
    }
    for (const s of students) {
      await Submission.create({ assignment: assignment2._id, student: s._id, submissionUrl: "https://github.com/sample/assignment2", submittedAt: new Date(), marksObtained: null, remarks: "", evaluatedBy: null });
    }
    console.log("Submissions created");

    // MARKS - all 3 exam types, all 3 subjects, all 4 students
    const markConfig = [
      { subject: subject1._id, max: 20, teacher: teacher1._id },
      { subject: subject2._id, max: 25, teacher: teacher1._id },
      { subject: subject3._id, max: 30, teacher: teacher2._id },
    ];
    for (const s of students) {
      for (const { subject, max, teacher } of markConfig) {
        for (const examType of ["MST1", "MST2", "FINAL"]) {
          await Marks.create({ student: s._id, subject, examType, marksObtained: Math.floor(Math.random()*(max*0.4)) + Math.floor(max*0.55), maxMarks: max, evaluatedBy: teacher });
        }
      }
    }
    console.log("Marks created");

    // ATTENDANCE - past 10 days, 3 subjects
    const attConfig = [
      { subject: subject1._id, teacher: teacher1._id, slot: "10:00-11:00" },
      { subject: subject2._id, teacher: teacher1._id, slot: "11:00-12:00" },
      { subject: subject3._id, teacher: teacher2._id, slot: "14:00-15:00" },
    ];
    for (let day = 1; day <= 10; day++) {
      const date = new Date(); date.setHours(0,0,0,0); date.setDate(date.getDate()-day);
      for (const { subject, teacher, slot } of attConfig) {
        for (const s of students) {
          try {
            await Attendance.create({ student: s._id, subject, date, timeSlot: slot, status: Math.random()>0.2?"Present":"Absent", markedBy: teacher });
          } catch(e) { /* skip duplicates */ }
        }
      }
    }
    console.log("Attendance created");

    // TIMETABLE
    await Timetable.insertMany([
      { day: "Monday",    subject: subject1._id, teacher: teacher1._id, startTime: "10:00", endTime: "11:00" },
      { day: "Monday",    subject: subject3._id, teacher: teacher2._id, startTime: "14:00", endTime: "15:00" },
      { day: "Tuesday",   subject: subject2._id, teacher: teacher1._id, startTime: "11:00", endTime: "12:00" },
      { day: "Wednesday", subject: subject1._id, teacher: teacher1._id, startTime: "10:00", endTime: "11:00" },
      { day: "Wednesday", subject: subject3._id, teacher: teacher2._id, startTime: "13:00", endTime: "14:00" },
      { day: "Thursday",  subject: subject2._id, teacher: teacher1._id, startTime: "11:00", endTime: "12:00" },
      { day: "Friday",    subject: subject1._id, teacher: teacher1._id, startTime: "10:00", endTime: "11:00" },
      { day: "Friday",    subject: subject3._id, teacher: teacher2._id, startTime: "14:00", endTime: "15:00" },
    ]);
    console.log("Timetable created");

    // LECTURES
    await Lecture.insertMany([
      { title: "Introduction to OSI Model",       description: "All 7 layers with detailed examples",             subject: subject1._id, teacher: teacher1._id, resourceUrl: "https://www.youtube.com/watch?v=vv4y_uOneC0", isActive: true },
      { title: "TCP/IP Protocol Suite",           description: "Deep dive into TCP/IP networking",                subject: subject1._id, teacher: teacher1._id, resourceUrl: "https://www.youtube.com/watch?v=PpsEaqJV_A0", isActive: true },
      { title: "Process Scheduling Algorithms",   description: "FCFS, SJF, Round Robin and Priority scheduling",  subject: subject2._id, teacher: teacher1._id, resourceUrl: "https://www.youtube.com/watch?v=EWkQl0n0w5M", isActive: true },
      { title: "Deadlock Detection & Recovery",   description: "Banker algorithm and deadlock detection",         subject: subject2._id, teacher: teacher1._id, resourceUrl: "https://www.youtube.com/watch?v=UVo9mGARkhQ", isActive: true },
      { title: "Normalization in DBMS",           description: "1NF, 2NF, 3NF and BCNF with examples",           subject: subject3._id, teacher: teacher2._id, resourceUrl: "https://www.youtube.com/watch?v=ABwD8IYByfk", isActive: true },
      { title: "SQL Joins & Subqueries",          description: "Inner, outer, cross joins with practice queries", subject: subject3._id, teacher: teacher2._id, resourceUrl: "https://www.youtube.com/watch?v=9yeOJ0ZMUYw", isActive: true },
    ]);
    console.log("Lectures created");

    // RESOURCES
    await Resource.insertMany([
      { name: "Projector - Lab A",  type: "Hardware", status: "Available", allocatedTo: null,        allocatedAt: null },
      { name: "Projector - Lab B",  type: "Hardware", status: "Allocated", allocatedTo: teacher1._id, allocatedAt: new Date() },
      { name: "MATLAB License",     type: "Software", status: "Available", allocatedTo: null,        allocatedAt: null },
      { name: "AutoCAD License",    type: "Software", status: "Allocated", allocatedTo: teacher2._id, allocatedAt: new Date() },
      { name: "Smart Board",        type: "Hardware", status: "Available", allocatedTo: null,        allocatedAt: null },
    ]);
    console.log("Resources created");

    // ALERTS
    await Alert.insertMany([
      { message: "Mid semester exams scheduled for next week. Check the notice board.", level: "Warning",   targetRole: "student", issuedBy: adminUser._id },
      { message: "Holiday declared on Friday due to college annual day.",              level: "Info",      targetRole: "all",     issuedBy: adminUser._id },
      { message: "All faculty must submit attendance reports by end of month.",        level: "Warning",   targetRole: "teacher", issuedBy: adminUser._id },
      { message: "Server maintenance Sunday 2AM-4AM. Systems may be unavailable.",    level: "Emergency", targetRole: "all",     issuedBy: adminUser._id },
    ]);
    console.log("Alerts created");

    console.log("\n✅ Database seeded successfully!");
    console.log("─────────────────────────────────────");
    console.log("Login credentials (password: password123)");
    console.log("  Admin:    admin@cms.com");
    console.log("  Teacher:  teacher@cms.com  (Dr. Sharma)");
    console.log("  Teacher:  mehta@cms.com    (Prof. Mehta)");
    console.log("  Student:  rahul@cms.com    (Rahul Singh)");
    console.log("  Student:  aman@cms.com     (Aman Gupta)");
    console.log("  Student:  priya@cms.com    (Priya Patel)");
    console.log("  Student:  sneha@cms.com    (Sneha Verma)");
    console.log("─────────────────────────────────────");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seed();
