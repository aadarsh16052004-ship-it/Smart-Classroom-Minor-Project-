import Student from "../models/Student.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import AttendanceSession from "../models/AttendanceSession.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Marks from "../models/Marks.js";
import Alert from "../models/Alert.js";
import Timetable from "../models/Timetable.js";
import Lecture from "../models/Lecture.js";
import Subject from "../models/Subject.js";
import Announcement from "../models/Announcement.js";
import bcrypt from "bcryptjs";

/* ── DASHBOARD ─────────────────────────────────────────── */
export const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const subjectsCount  = student.subjects.length;
    const attendance     = await Attendance.find({ student: student._id });
    const present        = attendance.filter(a => a.status === "Present").length;
    const attendancePct  = attendance.length === 0 ? 0 : Math.round((present / attendance.length) * 100);
    const assignments    = await Assignment.find({ subject: { $in: student.subjects }, isActive: true });
    const submissions    = await Submission.find({ student: student._id }).select("assignment");
    const submittedIds   = submissions.map(s => s.assignment.toString());
    const pendingAssignments = assignments.filter(a => !submittedIds.includes(a._id.toString())).length;
    const marks          = await Marks.find({ student: student._id });
    const averageMarks   = marks.length === 0 ? 0 : Math.round(marks.reduce((sum, m) => sum + (m.marksObtained / m.maxMarks) * 100, 0) / marks.length);
    const alerts         = await Alert.find({ targetRole: { $in: ["student","all"] } }).sort({ createdAt: -1 }).limit(3).select("message level");

    // Unread notifications count
    const unreadAlerts   = await Alert.countDocuments({ targetRole: { $in: ["student","all"] } });
    const unreadAnns     = await Announcement.countDocuments({ subject: { $in: student.subjects }, isRead: { $ne: student._id } });

    res.json({ subjects: subjectsCount, attendancePercentage: attendancePct, pendingAssignments, averageMarks, alerts, notifications: unreadAlerts + unreadAnns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Student dashboard error" });
  }
};

/* ── ATTENDANCE ────────────────────────────────────────── */
export const getStudentAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const records  = await Attendance.find({ student: student._id }).populate("subject", "name");
    const total    = records.length;
    const present  = records.filter(r => r.status === "Present").length;
    const subjectMap = {};
    records.forEach(r => {
      const name = r.subject?.name || "Unknown";
      if (!subjectMap[name]) subjectMap[name] = { total: 0, present: 0 };
      subjectMap[name].total++;
      if (r.status === "Present") subjectMap[name].present++;
    });
    const subjectWise = Object.entries(subjectMap).map(([subject, data]) => ({
      subject, percentage: Math.round((data.present / data.total) * 100),
    }));
    res.json({ overallPercentage: total === 0 ? 0 : Math.round((present / total) * 100), subjectWise, detainedSubjects: subjectWise.filter(s => s.percentage < 75).map(s => s.subject) });
  } catch (err) { res.status(500).json({ message: "Attendance fetch failed" }); }
};

export const joinSession = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Session code required" });
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const session = await AttendanceSession.findOne({ code: code.toUpperCase(), isActive: true });
    if (!session) return res.status(404).json({ message: "Invalid or expired session code" });
    if (session.expiresAt < new Date()) return res.status(400).json({ message: "Session has expired" });
    if (!student.subjects.map(s => s.toString()).includes(session.subject.toString()))
      return res.status(403).json({ message: "You are not enrolled in this subject" });
    if (session.joinedStudents.some(id => id.toString() === student._id.toString()))
      return res.status(400).json({ message: "Attendance already marked as present" });
    session.joinedStudents.push(student._id);
    await session.save();
    res.status(200).json({ message: "Attendance marked as present!" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/* ── ASSIGNMENTS ───────────────────────────────────────── */
export const getStudentAssignments = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const assignments = await Assignment.find({ subject: { $in: student.subjects }, isActive: true }).populate("subject", "name");
    const submissions = await Submission.find({ student: student._id });
    const submittedMap = {};
    submissions.forEach(s => { submittedMap[s.assignment.toString()] = s; });
    res.json(assignments.map(a => {
      const sub = submittedMap[a._id.toString()];
      return {
        assignmentId: a._id, title: a.title, subject: a.subject.name,
        dueDate: a.dueDate, maxMarks: a.maxMarks,
        status: sub ? "Submitted" : "Pending",
        allowResubmission: a.allowResubmission || false,
        submission: sub ? { text: sub.submissionUrl, submittedAt: sub.submittedAt, marks: sub.marksObtained, remarks: sub.remarks } : null,
      };
    }));
  } catch (err) { res.status(500).json({ message: "Failed to fetch assignments" }); }
};

export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, submissionText } = req.body;
    if (!assignmentId) return res.status(400).json({ message: "Assignment ID required" });
    if (!submissionText?.trim()) return res.status(400).json({ message: "Submission text cannot be empty" });
    const student    = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    if (!student.subjects.some(s => s.toString() === assignment.subject.toString()))
      return res.status(403).json({ message: "Not enrolled in this subject" });

    const existing = await Submission.findOne({ assignment: assignmentId, student: student._id });

    if (existing) {
      // Allow resubmission only if teacher enabled it
      if (!assignment.allowResubmission)
        return res.status(400).json({ message: "Resubmission is not allowed for this assignment" });
      // Update existing submission, clear previous grade
      existing.submissionUrl  = submissionText.trim();
      existing.submittedAt    = new Date();
      existing.marksObtained  = null;
      existing.remarks        = "";
      existing.evaluatedBy    = null;
      await existing.save();
      return res.status(200).json({ message: "Assignment resubmitted successfully!" });
    }

    await Submission.create({ assignment: assignmentId, student: student._id, submissionUrl: submissionText.trim() });
    res.status(201).json({ message: "Assignment submitted successfully!" });
  } catch (err) { res.status(500).json({ message: "Failed to submit assignment" }); }
};

/* ── MARKS ─────────────────────────────────────────────── */
export const getStudentMarks = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const marks = await Marks.find({ student: student._id }).populate("subject", "name");
    res.json(marks.map(m => ({ subject: m.subject?.name || "Unknown", examType: m.examType, marksObtained: m.marksObtained, maxMarks: m.maxMarks })));
  } catch (err) { res.status(500).json({ message: "Failed to fetch marks" }); }
};

/* ── TIMETABLE ─────────────────────────────────────────── */
export const getStudentTimetable = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const timetable = await Timetable.find({ subject: { $in: student.subjects } }).populate("subject", "name");
    res.json(timetable.map(t => ({ day: t.day, subject: t.subject?.name || "Unknown", startTime: t.startTime, endTime: t.endTime })));
  } catch (err) { res.status(500).json({ message: "Failed to fetch timetable" }); }
};

/* ── LECTURES ───────────────────────────────────────────── */
export const getStudentLectures = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const lectures = await Lecture.find({ subject: { $in: student.subjects }, isActive: true }).populate("subject", "name");
    res.json(lectures.map(l => ({ title: l.title, description: l.description, subject: l.subject?.name || "Unknown", resourceUrl: l.resourceUrl })));
  } catch (err) { res.status(500).json({ message: "Failed to fetch lectures" }); }
};

/* ── ALERTS ─────────────────────────────────────────────── */
export const getStudentAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ targetRole: { $in: ["student","all"] } }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) { res.status(500).json({ message: "Failed to fetch alerts" }); }
};

/* ── SUBJECTS ───────────────────────────────────────────── */
export const getMySubjects = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id })
      .populate({ path: "subjects", populate: { path: "teacher", populate: { path: "userId", select: "name email" } } });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student.subjects);
  } catch (err) { res.status(500).json({ message: "Failed to fetch subjects" }); }
};

/* ── SUBMISSIONS ────────────────────────────────────────── */
export const getStudentSubmissions = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const submissions = await Submission.find({ student: student._id })
      .populate({ path: "assignment", populate: { path: "subject", select: "name" } });
    res.json(submissions.map(s => ({
      assignment: s.assignment?.title || "Unknown", subject: s.assignment?.subject?.name || "Unknown",
      marks: s.marksObtained, remarks: s.remarks,
    })));
  } catch (err) { res.status(500).json({ message: "Error fetching submissions" }); }
};

/* ── ANNOUNCEMENTS ──────────────────────────────────────── */
export const getStudentAnnouncements = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const anns = await Announcement.find({ subject: { $in: student.subjects } })
      .populate("subject", "name").sort({ createdAt: -1 });
    res.json(anns.map(a => ({ ...a.toObject(), isRead: a.isRead.some(id => id.toString() === student._id.toString()) })));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const markAnnouncementRead = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    await Announcement.findByIdAndUpdate(req.params.id, { $addToSet: { isRead: student._id } });
    res.json({ message: "Marked as read" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/* ── NOTIFICATIONS COUNT ────────────────────────────────── */
export const getNotificationsCount = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found" });
    const unreadAlerts = await Alert.countDocuments({ targetRole: { $in: ["student","all"] } });
    const unreadAnns   = await Announcement.countDocuments({ subject: { $in: student.subjects }, isRead: { $ne: student._id } });
    res.json({ count: unreadAlerts + unreadAnns });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/* ── PROFILE ────────────────────────────────────────────── */
export const getStudentProfile = async (req, res) => {
  try {
    const user    = await User.findById(req.user.id).select("-password");
    const student = await Student.findOne({ userId: req.user.id });
    res.json({ name: user.name, email: user.email, role: user.role, rollNumber: student?.rollNumber });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (name) user.name = name.trim();
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: "Current password is required" });
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return res.status(400).json({ message: "Current password is incorrect" });
      if (newPassword.length < 6) return res.status(400).json({ message: "New password must be at least 6 characters" });
      user.password = await bcrypt.hash(newPassword, 10);
    }
    await user.save();
    res.json({ message: "Profile updated successfully", user: { name: user.name, email: user.email } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
