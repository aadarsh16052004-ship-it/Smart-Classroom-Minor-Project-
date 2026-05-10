// import User from "../models/User.js";
// import Student from "../models/Student.js";
// import Teacher from "../models/Teacher.js";
// import Subject from "../models/Subject.js";
// import Timetable from "../models/Timetable.js";
// import Resource from "../models/Resource.js";
// import Alert from "../models/Alert.js";

// /* ---------------- DASHBOARD ---------------- */
// export const getAdminDashboard = async (req, res) => {
//   try {
//     const users = await User.countDocuments();
//     const activeUsers = await User.countDocuments({ isActive: true });
//     const students = await Student.countDocuments();
//     const teachers = await Teacher.countDocuments();
//     const resources = await Resource.countDocuments();

//     res.json({
//       users,
//       activeUsers,
//       students,
//       teachers,
//       resources,
//     });
//   } catch {
//     res.status(500).json({ message: "Admin dashboard error" });
//   }
// };

// /* ---------------- USERS ---------------- */
// export const getUsers = async (req, res) => {
//   const users = await User.find().select("name email role isActive");
//   res.json(users);
// };

// export const updateUserStatus = async (req, res) => {
//   const { id } = req.params;
//   const { isActive } = req.body;

//   await User.findByIdAndUpdate(id, { isActive });
//   res.json({ message: "User status updated" });
// };

// /* ---------------- SUBJECTS ---------------- */
// export const createSubject = async (req, res) => {
//   const { name, code, teacherId, studentIds } = req.body;

//   const subject = await Subject.create({
//     name,
//     code,
//     teacher: teacherId,
//     students: studentIds,
//   });

//   await Teacher.findByIdAndUpdate(teacherId, {
//     $push: { subjects: subject._id },
//   });

//   await Student.updateMany(
//     { _id: { $in: studentIds } },
//     { $push: { subjects: subject._id } }
//   );

//   res.json({ message: "Subject created" });
// };

// export const getSubjects = async (req, res) => {
//   const subjects = await Subject.find()
//     .populate("teacher", "userId")
//     .populate("students", "rollNumber");

//   res.json(subjects);
// };

// /* ---------------- TIMETABLE ---------------- */
// export const createTimetableEntry = async (req, res) => {
//   const { day, subjectId, teacherId, startTime, endTime } = req.body;

//   await Timetable.create({
//     day,
//     subject: subjectId,
//     teacher: teacherId,
//     startTime,
//     endTime,
//   });

//   res.json({ message: "Timetable entry created" });
// };

// export const getTimetable = async (req, res) => {
//   const timetable = await Timetable.find()
//     .populate("subject", "name")
//     .populate("teacher", "userId");

//   res.json(timetable);
// };

// /* ---------------- RESOURCES ---------------- */
// export const createResource = async (req, res) => {
//   const { name, type } = req.body;

//   await Resource.create({ name, type });
//   res.json({ message: "Resource created" });
// };

// export const getResources = async (req, res) => {
//   const resources = await Resource.find()
//     .populate("allocatedTo", "userId");

//   res.json(resources);
// };

// export const deleteResource = async (req, res) => {
//   const { id } = req.params;
//   await Resource.findByIdAndDelete(id);
//   res.json({ message: "Resource deleted" });
// };

// /* ---------------- ALERTS ---------------- */
// export const createAlert = async (req, res) => {
//   const { message, level, targetRole } = req.body;

//   await Alert.create({
//     message,
//     level,
//     targetRole,
//     issuedBy: req.user.id,
//   });

//   res.json({ message: "Alert created" });
// };

// export const getAlerts = async (req, res) => {
//   const alerts = await Alert.find().sort({ createdAt: -1 });
//   res.json(alerts);
// };

// /* ── ASSIGN/REMOVE SUBJECT FOR STUDENT ─────────────────── */
// export const assignSubjectToStudent = async (req, res) => {
//   try {
//     const { studentId, subjectId } = req.body;
//     const student = await Student.findById(studentId);
//     const subject = await Subject.findById(subjectId);
//     if (!student) return res.status(404).json({ message: "Student not found" });
//     if (!subject) return res.status(404).json({ message: "Subject not found" });
//     if (student.subjects.some(s => s.toString() === subjectId))
//       return res.status(400).json({ message: "Student already enrolled in this subject" });
//     student.subjects.push(subjectId);
//     await student.save();
//     await Subject.findByIdAndUpdate(subjectId, { $addToSet: { students: studentId } });
//     res.json({ message: `${student.rollNumber} enrolled in ${subject.name}` });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };

// export const removeSubjectFromStudent = async (req, res) => {
//   try {
//     const { studentId, subjectId } = req.body;
//     await Student.findByIdAndUpdate(studentId, { $pull: { subjects: subjectId } });
//     await Subject.findByIdAndUpdate(subjectId, { $pull: { students: studentId } });
//     res.json({ message: "Subject removed from student" });
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };

// export const getStudentsWithSubjects = async (req, res) => {
//   try {
//     const students = await Student.find()
//       .populate("userId", "name email isActive")
//       .populate("subjects", "name code");
//     res.json(students.map(s => ({
//       _id: s._id,
//       name: s.userId?.name,
//       email: s.userId?.email,
//       isActive: s.userId?.isActive,
//       rollNumber: s.rollNumber,
//       subjects: s.subjects,
//     })));
//   } catch (err) { res.status(500).json({ message: err.message }); }
// };
import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Subject from "../models/Subject.js";
import Timetable from "../models/Timetable.js";
import Resource from "../models/Resource.js";
import Alert from "../models/Alert.js";

/* ---------------- DASHBOARD ---------------- */
export const getAdminDashboard = async (req, res) => {
  try {
    const [users, activeUsers, students, teachers, subjects, resources, alerts] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Student.countDocuments(),
      Teacher.countDocuments(),
      Subject.countDocuments(),
      Resource.countDocuments(),
      Alert.countDocuments(),
    ]);

    // Recent registrations (last 5 users)
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt");

    // Subject enrollment stats
    const subjectStats = await Subject.find().select("name code").populate("students", "_id");
    const subjectEnrollments = subjectStats.map(s => ({ name: s.name, code: s.code, students: s.students?.length || 0 }));

    // Resource usage
    const availableResources = await Resource.countDocuments({ status: "Available" });
    const allocatedResources  = await Resource.countDocuments({ status: "Allocated" });

    // Inactive students (no subjects assigned)
    const unenrolledStudents = await Student.countDocuments({ subjects: { $size: 0 } });

    res.json({
      users, activeUsers, students, teachers, subjects, resources, alerts,
      availableResources, allocatedResources,
      unenrolledStudents,
      recentUsers,
      subjectEnrollments,
    });
  } catch (err) {
    res.status(500).json({ message: "Admin dashboard error" });
  }
};

/* ---------------- USERS ---------------- */
export const getUsers = async (req, res) => {
  const users = await User.find().select("name email role isActive");
  res.json(users);
};

export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  await User.findByIdAndUpdate(id, { isActive });
  res.json({ message: "User status updated" });
};

/* ---------------- SUBJECTS ---------------- */
export const createSubject = async (req, res) => {
  const { name, code, teacherId, studentIds } = req.body;

  const subject = await Subject.create({
    name,
    code,
    teacher: teacherId,
    students: studentIds,
  });

  await Teacher.findByIdAndUpdate(teacherId, {
    $push: { subjects: subject._id },
  });

  await Student.updateMany(
    { _id: { $in: studentIds } },
    { $push: { subjects: subject._id } }
  );

  res.json({ message: "Subject created" });
};

export const getSubjects = async (req, res) => {
  const subjects = await Subject.find()
    .populate("teacher", "userId")
    .populate("students", "rollNumber");

  res.json(subjects);
};

/* ---------------- TIMETABLE ---------------- */
export const createTimetableEntry = async (req, res) => {
  const { day, subjectId, teacherId, startTime, endTime } = req.body;

  await Timetable.create({
    day,
    subject: subjectId,
    teacher: teacherId,
    startTime,
    endTime,
  });

  res.json({ message: "Timetable entry created" });
};

export const getTimetable = async (req, res) => {
  const timetable = await Timetable.find()
    .populate("subject", "name")
    .populate("teacher", "userId");

  res.json(timetable);
};

/* ---------------- RESOURCES ---------------- */
export const createResource = async (req, res) => {
  const { name, type } = req.body;

  await Resource.create({ name, type });
  res.json({ message: "Resource created" });
};

export const getResources = async (req, res) => {
  const resources = await Resource.find()
    .populate("allocatedTo", "userId");

  res.json(resources);
};

export const deleteResource = async (req, res) => {
  const { id } = req.params;
  await Resource.findByIdAndDelete(id);
  res.json({ message: "Resource deleted" });
};

/* ---------------- ALERTS ---------------- */
export const createAlert = async (req, res) => {
  const { message, level, targetRole } = req.body;

  await Alert.create({
    message,
    level,
    targetRole,
    issuedBy: req.user.id,
  });

  res.json({ message: "Alert created" });
};

export const getAlerts = async (req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 });
  res.json(alerts);
};

/* ── ASSIGN/REMOVE SUBJECT FOR STUDENT ─────────────────── */
export const assignSubjectToStudent = async (req, res) => {
  try {
    const { studentId, subjectId } = req.body;
    const student = await Student.findById(studentId);
    const subject = await Subject.findById(subjectId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    if (student.subjects.some(s => s.toString() === subjectId))
      return res.status(400).json({ message: "Student already enrolled in this subject" });
    student.subjects.push(subjectId);
    await student.save();
    await Subject.findByIdAndUpdate(subjectId, { $addToSet: { students: studentId } });
    res.json({ message: `${student.rollNumber} enrolled in ${subject.name}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const removeSubjectFromStudent = async (req, res) => {
  try {
    const { studentId, subjectId } = req.body;
    await Student.findByIdAndUpdate(studentId, { $pull: { subjects: subjectId } });
    await Subject.findByIdAndUpdate(subjectId, { $pull: { students: studentId } });
    res.json({ message: "Subject removed from student" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getStudentsWithSubjects = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("userId", "name email isActive")
      .populate("subjects", "name code");
    res.json(students.map(s => ({
      _id: s._id,
      name: s.userId?.name,
      email: s.userId?.email,
      isActive: s.userId?.isActive,
      rollNumber: s.rollNumber,
      subjects: s.subjects,
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/* ── BULK CSV ENROLL ────────────────────────────────────── */
export const bulkEnrollCSV = async (req, res) => {
  try {
    // Expects body: { subjectId, rows: [{email or rollNumber}] }
    const { subjectId, rows } = req.body;

    if (!subjectId) return res.status(400).json({ message: "subjectId is required" });
    if (!Array.isArray(rows) || rows.length === 0)
      return res.status(400).json({ message: "No rows provided" });

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const results = { enrolled: [], alreadyEnrolled: [], notFound: [] };

    for (const row of rows) {
      const identifier = (row.email || row.rollNumber || "").trim().toLowerCase();
      if (!identifier) continue;

      let student = null;

      if (row.email) {
        const user = await User.findOne({ email: identifier, role: "student" });
        if (user) student = await Student.findOne({ userId: user._id });
      } else if (row.rollNumber) {
        student = await Student.findOne({ rollNumber: { $regex: new RegExp(`^${row.rollNumber.trim()}$`, "i") } });
      }

      if (!student) { results.notFound.push(identifier); continue; }

      const alreadyIn = student.subjects.some(s => s.toString() === subjectId);
      if (alreadyIn) { results.alreadyEnrolled.push(identifier); continue; }

      student.subjects.push(subjectId);
      await student.save();
      await Subject.findByIdAndUpdate(subjectId, { $addToSet: { students: student._id } });
      results.enrolled.push(identifier);
    }

    res.json({
      message: `Bulk enroll complete`,
      subjectName: subject.name,
      enrolled: results.enrolled.length,
      alreadyEnrolled: results.alreadyEnrolled.length,
      notFound: results.notFound.length,
      details: results,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
