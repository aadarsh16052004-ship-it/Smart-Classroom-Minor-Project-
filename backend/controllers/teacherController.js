import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import Attendance from "../models/Attendance.js";
import AttendanceSession from "../models/AttendanceSession.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Marks from "../models/Marks.js";
import Lecture from "../models/Lecture.js";
import Resource from "../models/Resource.js";
import Announcement from "../models/Announcement.js";
import Alert from "../models/Alert.js";

/* ── DASHBOARD ─────────────────────────────────────────── */
export const getTeacherDashboard = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const subjects         = await Subject.find({ teacher: teacher._id }).select("name code students");
    const students         = await Student.find({ subjects: { $in: teacher.subjects } }).select("_id");
    const assignmentsIssued= await Assignment.countDocuments({ teacher: teacher._id });
    const attendanceSessions=await AttendanceSession.countDocuments({ teacher: teacher._id });
    const pendingGrading   = await Submission.countDocuments({ evaluatedBy: null, assignment: { $in: await Assignment.find({ teacher: teacher._id }).distinct("_id") } });
    const lecturesUploaded = await Lecture.countDocuments({ teacher: teacher._id });
    const announcementsCount=await Announcement.countDocuments({ teacher: teacher._id });

    // Recent submissions (last 5)
    const recentSubmissions = await Submission.find({ assignment: { $in: await Assignment.find({ teacher: teacher._id }).distinct("_id") } })
      .sort({ submittedAt: -1 }).limit(5)
      .populate({ path: "student", populate: { path: "userId", select: "name" } })
      .populate({ path: "assignment", select: "title" });

    // Subject-wise student count
    const subjectStats = subjects.map(s => ({ name: s.name, code: s.code, studentCount: s.students?.length || 0 }));

    // Today's sessions
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayEnd   = new Date(); todayEnd.setHours(23,59,59,999);
    const todaySessions = await AttendanceSession.find({ teacher: teacher._id, date: { $gte: todayStart, $lte: todayEnd } })
      .populate("subject", "name");

    res.json({
      subjectsTeaching: subjects.length,
      totalStudents: students.length,
      assignmentsIssued,
      attendanceSessions,
      pendingGrading,
      lecturesUploaded,
      announcementsCount,
      subjectStats,
      recentSubmissions: recentSubmissions.map(s => ({
        studentName: s.student?.userId?.name || "Unknown",
        assignmentTitle: s.assignment?.title || "Unknown",
        submittedAt: s.submittedAt,
        graded: s.marksObtained !== null && s.marksObtained !== undefined,
      })),
      todaySessions: todaySessions.map(s => ({ subject: s.subject?.name, code: s.code, isActive: s.isActive, joinedCount: s.joinedStudents?.length || 0 })),
    });
  } catch (err) { console.error(err); res.status(500).json({ message: "Teacher dashboard error" }); }
};

/* ── ATTENDANCE ─────────────────────────────────────────── */
export const getAttendanceBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { date, timeSlot } = req.query;
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const subject = await Subject.findOne({ _id: subjectId, teacher: teacher._id });
    if (!subject) return res.status(403).json({ message: "Not authorized for this subject" });
    const filter = { subject: subjectId };
    if (date) { const s = new Date(date); const e = new Date(date); e.setHours(23,59,59,999); filter.date = { $gte: s, $lte: e }; }
    if (timeSlot) filter.timeSlot = timeSlot;
    const records = await Attendance.find(filter).populate("student", "name email").sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const createSession = async (req, res) => {
  try {
    const { subjectId, timeSlot } = req.body;
    if (!subjectId || !timeSlot) return res.status(400).json({ message: "Subject and timeSlot required" });
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const subject = await Subject.findOne({ _id: subjectId, teacher: teacher._id });
    if (!subject) return res.status(403).json({ message: "Invalid subject" });
    const today = new Date(); today.setHours(0,0,0,0);
    const existingSession = await AttendanceSession.findOne({ subject: subjectId, date: today, timeSlot });
    if (existingSession) return res.status(400).json({ message: "Session already created for this time slot" });
    const code = Math.random().toString(36).substring(2,8).toUpperCase();
    const session = await AttendanceSession.create({ subject: subjectId, teacher: teacher._id, date: today, timeSlot, code, expiresAt: new Date(Date.now() + 10*60*1000) });
    res.status(201).json({ message: "Session created successfully", sessionId: session._id, code: session.code, expiresAt: session.expiresAt });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const closeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const session = await AttendanceSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (!session.isActive) return res.status(400).json({ message: "Session already closed" });
    if (session.teacher.toString() !== teacher._id.toString()) return res.status(403).json({ message: "Not authorized" });
    const enrolledStudents = await Student.find({ subjects: session.subject });
    const attendanceRecords = enrolledStudents.map(student => ({
      student: student._id, subject: session.subject, date: session.date, timeSlot: session.timeSlot,
      status: session.joinedStudents.some(id => id.toString() === student._id.toString()) ? "Present" : "Absent",
      markedBy: teacher._id,
    }));
    await Attendance.insertMany(attendanceRecords);
    session.isActive = false;
    await session.save();
    res.status(200).json({ message: "Attendance finalized successfully", totalStudents: enrolledStudents.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const markManualAttendance = async (req, res) => {
  try {
    const { subjectId, timeSlot, attendance } = req.body;
    if (!subjectId || !timeSlot || !attendance) return res.status(400).json({ message: "subjectId, timeSlot and attendance array required" });
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const subject = await Subject.findOne({ _id: subjectId, teacher: teacher._id });
    if (!subject) return res.status(403).json({ message: "Invalid subject" });
    const today = new Date(); today.setHours(0,0,0,0);
    const records = attendance.map(entry => ({ student: entry.studentId, subject: subjectId, date: today, timeSlot, status: entry.status, markedBy: teacher._id }));
    await Attendance.insertMany(records);
    res.status(201).json({ message: "Manual attendance marked successfully", totalStudents: records.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const editAttendance = async (req, res) => {
  try {
    const { subjectId, timeSlot, updates } = req.body;
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const today = new Date(); today.setHours(0,0,0,0);
    for (let update of updates) {
      await Attendance.findOneAndUpdate({ student: update.studentId, subject: subjectId, date: today, timeSlot }, { status: update.status }, { new: true });
    }
    res.status(200).json({ message: "Attendance updated successfully", totalUpdated: updates.length });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/* ── ASSIGNMENTS ─────────────────────────────────────────── */
export const createAssignment = async (req, res) => {
  try {
    const { title, description, subjectId, dueDate, maxMarks } = req.body;
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher.subjects.includes(subjectId)) return res.status(403).json({ message: "Unauthorized subject" });
    await Assignment.create({ title, description, subject: subjectId, teacher: teacher._id, dueDate, maxMarks });
    res.json({ message: "Assignment created" });
  } catch { res.status(500).json({ message: "Assignment creation failed" }); }
};

export const viewSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId }).populate("student", "rollNumber");
    res.json(submissions.map(s => ({ student: s.student.rollNumber, submissionUrl: s.submissionUrl, marksObtained: s.marksObtained, remarks: s.remarks })));
  } catch { res.status(500).json({ message: "Failed to fetch submissions" }); }
};

export const getTeacherAssignments = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const subjects = await Subject.find({ teacher: teacher._id });
    const subjectIds = subjects.map(s => s._id);
    const assignments = await Assignment.find({ subject: { $in: subjectIds } }).populate("subject", "name");
    const result = await Promise.all(assignments.map(async (a) => {
      const submissionsCount = await Submission.countDocuments({ assignment: a._id });
      return { id: a._id, title: a.title, subject: a.subject.name, dueDate: a.dueDate, maxMarks: a.maxMarks, submissionsCount, allowResubmission: a.allowResubmission };
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate({ path: "student", populate: { path: "userId", select: "name email" } });
    const formatted = submissions.map(sub => ({
      _id: sub._id,
      student: sub.student?.userId?.name || "N/A",
      email:   sub.student?.userId?.email || "N/A",
      rollNumber: sub.student?.rollNumber || "N/A",
      submissionText: sub.submissionUrl,
      submittedAt: sub.submittedAt,
      marks:   sub.marksObtained,
      remarks: sub.remarks,
    }));
    res.json(formatted);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/* ── TOGGLE RESUBMISSION ─────────────────────────────────── */
export const toggleResubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const assignment = await Assignment.findOne({ _id: assignmentId, teacher: teacher._id });
    if (!assignment) return res.status(404).json({ message: "Assignment not found or not yours" });

    assignment.allowResubmission = !assignment.allowResubmission;
    await assignment.save();

    res.json({
      message: assignment.allowResubmission
        ? "Resubmission enabled — students can now edit their submissions"
        : "Resubmission disabled",
      allowResubmission: assignment.allowResubmission,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/* ── GRADE SUBMISSION ────────────────────────────────────── */
export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marksObtained, remarks } = req.body;
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      { marksObtained, remarks, evaluatedBy: teacher._id },
      { new: true }
    );
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.json({ message: "Submission graded successfully", submission });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/* ── MARKS ───────────────────────────────────────────────── */
export const enterMarks = async (req, res) => {
  try {
    const { studentId, subjectId, examType, marksObtained, maxMarks } = req.body;
    const teacher = await Teacher.findOne({ userId: req.user.id });
    await Marks.findOneAndUpdate(
      { student: studentId, subject: subjectId, examType },
      { marksObtained, maxMarks, evaluatedBy: teacher._id },
      { upsert: true, new: true }
    );
    res.json({ message: "Marks saved" });
  } catch { res.status(500).json({ message: "Marks entry failed" }); }
};

/* ── LECTURES ────────────────────────────────────────────── */
export const uploadLecture = async (req, res) => {
  try {
    const { title, description, subjectId, resourceUrl } = req.body;
    const teacher = await Teacher.findOne({ userId: req.user.id });
    await Lecture.create({ title, description, subject: subjectId, teacher: teacher._id, resourceUrl });
    res.json({ message: "Lecture uploaded" });
  } catch { res.status(500).json({ message: "Lecture upload failed" }); }
};

/* ── RESOURCES ───────────────────────────────────────────── */
export const getResources = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const resources = await Resource.find();
    res.status(200).json(resources.map(r => ({ _id: r._id, name: r.name, type: r.type, status: r.status, allocatedToMe: r.allocatedTo?.toString() === teacherId?.toString() })));
  } catch (err) { res.status(500).json({ message: "Failed to fetch resources" }); }
};

export const allocateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    if (resource.status === "Allocated") return res.status(400).json({ message: "Resource already allocated" });
    resource.status = "Allocated";
    resource.allocatedTo = req.user.id;
    await resource.save();
    res.json({ message: "Resource allocated successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const releaseResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    resource.status = "Available";
    resource.allocatedTo = null;
    await resource.save();
    res.json({ message: "Resource released successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/* ── SUBJECTS & STUDENTS ─────────────────────────────────── */
export const getTeacherSubjects = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id }).populate("subjects", "name code students isActive");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher.subjects);
  } catch { res.status(500).json({ message: "Failed to fetch subjects" }); }
};

export const getTeacherStudents = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const subjects = await Subject.find({ teacher: teacher._id });
    const students = await Student.find({ subjects: { $in: subjects.map(s => s._id) } }).populate("userId", "name email");
    res.json(students.map(s => ({ _id: s._id, name: s.userId?.name, email: s.userId?.email })));
  } catch (err) { res.status(500).json({ message: "Error fetching students" }); }
};

export const getStudentsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const subject = await Subject.findOne({ _id: subjectId, teacher: teacher._id });
    if (!subject) return res.status(403).json({ message: "Not authorized for this subject" });
    const students = await Student.find({ subjects: subjectId }).populate("userId", "name email");
    res.json({ subject: subject.name, students: students.map(s => ({ _id: s._id, name: s.userId?.name || "N/A", email: s.userId?.email || "N/A", rollNumber: s.rollNumber })) });
  } catch (err) { res.status(500).json({ message: "Failed to fetch students for subject" }); }
};

/* ── ANNOUNCEMENTS ───────────────────────────────────────── */
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, subjectId } = req.body;
    if (!title || !content || !subjectId) return res.status(400).json({ message: "Title, content and subject required" });
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const subject = await Subject.findOne({ _id: subjectId, teacher: teacher._id });
    if (!subject) return res.status(403).json({ message: "Not authorized for this subject" });
    const ann = await Announcement.create({ title, content, subject: subjectId, teacher: teacher._id });
    res.status(201).json({ message: "Announcement posted!", announcement: ann });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getTeacherAnnouncements = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    const anns = await Announcement.find({ teacher: teacher._id })
      .populate("subject", "name").sort({ createdAt: -1 });
    res.json(anns);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    const ann = await Announcement.findOne({ _id: req.params.id, teacher: teacher._id });
    if (!ann) return res.status(404).json({ message: "Announcement not found" });
    await ann.deleteOne();
    res.json({ message: "Announcement deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/* ── TEACHER ALERTS ──────────────────────────────────────── */
export const createTeacherAlert = async (req, res) => {
  try {
    const { message, level, targetRole } = req.body;
    if (!message || !level) return res.status(400).json({ message: "Message and level required" });
    await Alert.create({ message, level, targetRole: targetRole || "student", issuedBy: req.user.id });
    res.status(201).json({ message: "Alert created successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getTeacherAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).limit(20);
    res.json(alerts);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/* ── STUDENT DETAIL (for teacher) ───────────────────────── */
export const getStudentDetail = async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const student = await Student.findById(studentId)
      .populate("userId", "name email isActive")
      .populate("subjects", "name code");
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Verify this student is enrolled in at least one of teacher's subjects
    const teacherSubjectIds = teacher.subjects.map(s => s.toString());
    const studentSubjectIds = student.subjects.map(s => s._id.toString());
    const hasAccess = teacherSubjectIds.some(id => studentSubjectIds.includes(id));
    if (!hasAccess) return res.status(403).json({ message: "No access to this student" });

    // Attendance per subject
    const attendance = await Attendance.find({ student: studentId }).populate("subject", "name");
    const attMap = {};
    attendance.forEach(a => {
      const name = a.subject?.name || "Unknown";
      if (!attMap[name]) attMap[name] = { total: 0, present: 0 };
      attMap[name].total++;
      if (a.status === "Present") attMap[name].present++;
    });
    const attendanceStats = Object.entries(attMap).map(([subject, d]) => ({
      subject, total: d.total, present: d.present,
      percentage: Math.round((d.present / d.total) * 100),
    }));

    // Marks
    const marks = await Marks.find({ student: studentId }).populate("subject", "name");

    // Submissions
    const submissions = await Submission.find({ student: studentId })
      .populate({ path: "assignment", populate: { path: "subject", select: "name" } });

    res.json({
      name: student.userId?.name,
      email: student.userId?.email,
      rollNumber: student.rollNumber,
      isActive: student.userId?.isActive,
      subjects: student.subjects,
      attendanceStats,
      marks: marks.map(m => ({ subject: m.subject?.name, examType: m.examType, marksObtained: m.marksObtained, maxMarks: m.maxMarks })),
      submissions: submissions.map(s => ({ assignment: s.assignment?.title, subject: s.assignment?.subject?.name, submittedAt: s.submittedAt, marks: s.marksObtained, remarks: s.remarks })),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/* ── SUBMISSION STATUS for an assignment ────────────────── */
export const getSubmissionStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const teacher  = await Teacher.findOne({ userId: req.user.id });
    const assignment = await Assignment.findOne({ _id: assignmentId, teacher: teacher._id }).populate("subject", "name");
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // All students enrolled in this subject
    const allStudents = await Student.find({ subjects: assignment.subject._id })
      .populate("userId", "name email");

    // Who submitted
    const submissions = await Submission.find({ assignment: assignmentId }).select("student marksObtained");
    const submittedIds = new Set(submissions.map(s => s.student.toString()));

    const result = allStudents.map(s => ({
      _id: s._id,
      name: s.userId?.name || "N/A",
      email: s.userId?.email,
      rollNumber: s.rollNumber,
      submitted: submittedIds.has(s._id.toString()),
      marks: submissions.find(sub => sub.student.toString() === s._id.toString())?.marksObtained ?? null,
    }));

    res.json({
      assignment: assignment.title,
      subject: assignment.subject.name,
      dueDate: assignment.dueDate,
      maxMarks: assignment.maxMarks,
      total: result.length,
      submitted: result.filter(r => r.submitted).length,
      pending: result.filter(r => !r.submitted).length,
      students: result,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
