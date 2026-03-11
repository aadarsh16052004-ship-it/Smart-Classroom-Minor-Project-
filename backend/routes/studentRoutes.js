// import express from "express";
// import {
//   getStudentDashboard,
//   getStudentAttendance,
//   getStudentAssignments,
//   getStudentMarks,
//   getStudentTimetable,
//   getStudentLectures,
//   getStudentAlerts,
//   getMySubjects,
//   getStudentSubmissions,
//   joinSession,
//   submitAssignment,
// } from "../controllers/studentController.js";

// import { protect } from "../middleware/authMiddleware.js";
// import { authorize } from "../middleware/roleMiddleware.js";

// const router = express.Router();

// router.use(protect, authorize("student"));

// router.get("/dashboard",          getStudentDashboard);
// router.get("/attendance",         getStudentAttendance);
// router.post("/attendance/join",   joinSession);
// router.get("/assignments",        getStudentAssignments);
// router.post("/assignments/submit",submitAssignment);
// router.get("/marks",              getStudentMarks);
// router.get("/timetable",          getStudentTimetable);
// router.get("/lectures",           getStudentLectures);
// router.get("/alerts",             getStudentAlerts);
// router.get("/subjects",           getMySubjects);
// router.get("/submissions",        getStudentSubmissions);

// export default router;



import express from "express";
import {
  getStudentDashboard, getStudentAttendance, joinSession,
  getStudentAssignments, submitAssignment,
  getStudentMarks, getStudentTimetable, getStudentLectures,
  getStudentAlerts, getMySubjects, getStudentSubmissions,
  getStudentAnnouncements, markAnnouncementRead,
  getNotificationsCount,
  getStudentProfile, updateStudentProfile,
} from "../controllers/studentController.js";
import { protect }   from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(protect, authorize("student"));

router.get("/dashboard",                    getStudentDashboard);
router.get("/attendance",                   getStudentAttendance);
router.post("/attendance/join",             joinSession);
router.get("/assignments",                  getStudentAssignments);
router.post("/assignments/submit",          submitAssignment);
router.get("/marks",                        getStudentMarks);
router.get("/timetable",                    getStudentTimetable);
router.get("/lectures",                     getStudentLectures);
router.get("/alerts",                       getStudentAlerts);
router.get("/subjects",                     getMySubjects);
router.get("/submissions",                  getStudentSubmissions);
router.get("/announcements",                getStudentAnnouncements);
router.patch("/announcements/:id/read",     markAnnouncementRead);
router.get("/notifications/count",          getNotificationsCount);
router.get("/profile",                      getStudentProfile);
router.patch("/profile",                    updateStudentProfile);

export default router;
