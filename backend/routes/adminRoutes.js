// import express from "express";
// import {
//   getAdminDashboard,
//   getUsers,
//   updateUserStatus,
//   createSubject,
//   getSubjects,
//   createTimetableEntry,
//   getTimetable,
//   createResource,
//   getResources,
//   deleteResource,
//   createAlert,
//   getAlerts,
// } from "../controllers/adminController.js";

// import { protect } from "../middleware/authMiddleware.js";
// import { authorize } from "../middleware/roleMiddleware.js";

// const router = express.Router();

// router.use(protect, authorize("admin"));

// router.get("/dashboard", getAdminDashboard);

// /* USERS */
// router.get("/users", getUsers);
// router.patch("/users/:id/status", updateUserStatus);

// /* SUBJECTS */
// router.post("/subjects", createSubject);
// router.get("/subjects", getSubjects);

// /* TIMETABLE */
// router.post("/timetable", createTimetableEntry);
// router.get("/timetable",getTimetable);

// /* RESOURCES */
// router.post("/resources", createResource);
// router.get("/resources", getResources);
// router.delete("/resources/:id", deleteResource);

// /* ALERTS */
// router.post("/alerts", createAlert);
// router.get("/alerts", getAlerts);

// export default router;

import express from "express";
import {
  getAdminDashboard, getUsers, updateUserStatus,
  createSubject, getSubjects,
  createTimetableEntry, getTimetable,
  createResource, getResources, deleteResource,
  createAlert, getAlerts,
  assignSubjectToStudent, removeSubjectFromStudent, getStudentsWithSubjects, bulkEnrollCSV,
} from "../controllers/adminController.js";
import { protect }   from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(protect, authorize("admin"));

router.get("/dashboard", getAdminDashboard);

router.get("/users",              getUsers);
router.patch("/users/:id/status", updateUserStatus);

router.post("/subjects",          createSubject);
router.get("/subjects",           getSubjects);

router.post("/timetable",         createTimetableEntry);
router.get("/timetable",          getTimetable);

router.post("/resources",         createResource);
router.get("/resources",          getResources);
router.delete("/resources/:id",   deleteResource);

router.post("/alerts",            createAlert);
router.get("/alerts",             getAlerts);

router.get("/enrollments",              getStudentsWithSubjects);
router.post("/enrollments/assign",      assignSubjectToStudent);
router.post("/enrollments/remove",      removeSubjectFromStudent);
router.post("/enrollments/bulk",        bulkEnrollCSV);

export default router;
