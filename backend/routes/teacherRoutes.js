// import express from "express";
// import {
//   getTeacherDashboard,
//   createSession, markManualAttendance, closeSession, editAttendance, getAttendanceBySubject,
//   createAssignment, viewSubmissions, getTeacherAssignments, getSubmissionsByAssignment, gradeSubmission,
//   enterMarks,
//   uploadLecture,
//   allocateResource, releaseResource, getResources,
//   getTeacherSubjects, getTeacherStudents, getStudentsBySubject,
//   createAnnouncement, getTeacherAnnouncements, deleteAnnouncement,
// } from "../controllers/teacherController.js";
// import { protect }   from "../middleware/authMiddleware.js";
// import { authorize } from "../middleware/roleMiddleware.js";

// const router = express.Router();
// router.use(protect, authorize("teacher"));

// router.get("/dashboard", getTeacherDashboard);

// router.get("/attendance/:subjectId",               getAttendanceBySubject);
// router.post("/attendance/session",                 createSession);
// router.post("/attendance/session/close/:sessionId",closeSession);
// router.post("/attendance/manual",                  markManualAttendance);
// router.put("/attendance/edit",                     editAttendance);

// router.post("/assignments",                        createAssignment);
// router.get("/assignments",                         getTeacherAssignments);
// router.get("/submissions/:assignmentId",           getSubmissionsByAssignment);
// router.patch("/submissions/:submissionId/grade",   gradeSubmission);

// router.post("/marks",                              enterMarks);
// router.post("/lectures",                           uploadLecture);

// router.get("/resources",                           getResources);
// router.post("/resources/:resourceId/allocate",     allocateResource);
// router.post("/resources/:resourceId/release",      releaseResource);

// router.get("/subjects",                            getTeacherSubjects);
// router.get("/subjects/:subjectId/students",        getStudentsBySubject);
// router.get("/students",                            getTeacherStudents);

// router.post("/announcements",                      createAnnouncement);
// router.get("/announcements",                       getTeacherAnnouncements);
// router.delete("/announcements/:id",                deleteAnnouncement);

// export default router;

import express from "express";
import {
  getTeacherDashboard,
  createSession, markManualAttendance, closeSession, editAttendance, getAttendanceBySubject,
  createAssignment, viewSubmissions, getTeacherAssignments, getSubmissionsByAssignment, gradeSubmission,
  getSubmissionStatus,
  enterMarks,
  uploadLecture,
  allocateResource, releaseResource, getResources,
  getTeacherSubjects, getTeacherStudents, getStudentsBySubject,
  createAnnouncement, getTeacherAnnouncements, deleteAnnouncement,
  toggleResubmission,
  createTeacherAlert, getTeacherAlerts,
  getStudentDetail,
} from "../controllers/teacherController.js";
import { protect }   from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(protect, authorize("teacher"));

router.get("/dashboard",                             getTeacherDashboard);

router.get("/attendance/:subjectId",                 getAttendanceBySubject);
router.post("/attendance/session",                   createSession);
router.post("/attendance/session/close/:sessionId",  closeSession);
router.post("/attendance/manual",                    markManualAttendance);
router.put("/attendance/edit",                       editAttendance);

router.post("/assignments",                          createAssignment);
router.get("/assignments",                           getTeacherAssignments);
router.get("/submissions/:assignmentId",             getSubmissionsByAssignment);
router.patch("/submissions/:submissionId/grade",     gradeSubmission);
router.patch("/assignments/:assignmentId/resubmission", toggleResubmission);
router.get("/assignments/:assignmentId/status",      getSubmissionStatus);

router.post("/marks",                                enterMarks);
router.post("/lectures",                             uploadLecture);

router.get("/resources",                             getResources);
router.post("/resources/:resourceId/allocate",       allocateResource);
router.post("/resources/:resourceId/release",        releaseResource);

router.get("/subjects",                              getTeacherSubjects);
router.get("/subjects/:subjectId/students",          getStudentsBySubject);
router.get("/students",                              getTeacherStudents);
router.get("/students/:studentId/detail",            getStudentDetail);

router.post("/announcements",                        createAnnouncement);
router.get("/announcements",                         getTeacherAnnouncements);
router.delete("/announcements/:id",                  deleteAnnouncement);

router.post("/alerts",                               createTeacherAlert);
router.get("/alerts",                                getTeacherAlerts);

export default router;
