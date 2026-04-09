import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/Login";

import StudentDashboard  from "./pages/student/Dashboard";
import StudentAttendance from "./pages/student/Attendance";
import {
  StudentAssignments, StudentMarks, StudentTimetable,
  StudentLectures, StudentSubjects, StudentAlerts,
} from "./pages/student/StudentPages";
import StudentProfile       from "./pages/student/StudentProfile";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";

import TeacherDashboard from "./pages/teacher/Dashboard";
import {
  TeacherSubjects, TeacherStudents, TeacherAssignments,
  TeacherAttendance, TeacherMarks, TeacherLectures, TeacherResources,
  TeacherAnnouncements, TeacherAlerts,
} from "./pages/teacher/TeacherPages";

import AdminDashboard, {
  AdminUsers, AdminSubjects, AdminTimetable,
  AdminAlerts, AdminResources, AdminEnrollments,
} from "./pages/admin/AdminPages";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />

      {/* Student */}
      <Route path="/student"              element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/attendance"   element={<ProtectedRoute role="student"><StudentAttendance /></ProtectedRoute>} />
      <Route path="/student/assignments"  element={<ProtectedRoute role="student"><StudentAssignments /></ProtectedRoute>} />
      <Route path="/student/marks"        element={<ProtectedRoute role="student"><StudentMarks /></ProtectedRoute>} />
      <Route path="/student/timetable"    element={<ProtectedRoute role="student"><StudentTimetable /></ProtectedRoute>} />
      <Route path="/student/lectures"     element={<ProtectedRoute role="student"><StudentLectures /></ProtectedRoute>} />
      <Route path="/student/subjects"     element={<ProtectedRoute role="student"><StudentSubjects /></ProtectedRoute>} />
      <Route path="/student/alerts"       element={<ProtectedRoute role="student"><StudentAlerts /></ProtectedRoute>} />
      <Route path="/student/profile"      element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/announcements"element={<ProtectedRoute role="student"><StudentAnnouncements /></ProtectedRoute>} />

      {/* Teacher */}
      <Route path="/teacher"              element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/subjects"     element={<ProtectedRoute role="teacher"><TeacherSubjects /></ProtectedRoute>} />
      <Route path="/teacher/students"     element={<ProtectedRoute role="teacher"><TeacherStudents /></ProtectedRoute>} />
      <Route path="/teacher/assignments"  element={<ProtectedRoute role="teacher"><TeacherAssignments /></ProtectedRoute>} />
      <Route path="/teacher/attendance"   element={<ProtectedRoute role="teacher"><TeacherAttendance /></ProtectedRoute>} />
      <Route path="/teacher/marks"        element={<ProtectedRoute role="teacher"><TeacherMarks /></ProtectedRoute>} />
      <Route path="/teacher/lectures"     element={<ProtectedRoute role="teacher"><TeacherLectures /></ProtectedRoute>} />
      <Route path="/teacher/resources"    element={<ProtectedRoute role="teacher"><TeacherResources /></ProtectedRoute>} />
      <Route path="/teacher/announcements"element={<ProtectedRoute role="teacher"><TeacherAnnouncements /></ProtectedRoute>} />
      <Route path="/teacher/alerts"        element={<ProtectedRoute role="teacher"><TeacherAlerts /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin"                element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users"          element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/subjects"       element={<ProtectedRoute role="admin"><AdminSubjects /></ProtectedRoute>} />
      <Route path="/admin/timetable"      element={<ProtectedRoute role="admin"><AdminTimetable /></ProtectedRoute>} />
      <Route path="/admin/alerts"         element={<ProtectedRoute role="admin"><AdminAlerts /></ProtectedRoute>} />
      <Route path="/admin/resources"      element={<ProtectedRoute role="admin"><AdminResources /></ProtectedRoute>} />
      <Route path="/admin/enrollments"    element={<ProtectedRoute role="admin"><AdminEnrollments /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#0f172a", color: "#e2e8f0", border: "1px solid rgba(59,130,246,0.3)" },
              success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
              error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
