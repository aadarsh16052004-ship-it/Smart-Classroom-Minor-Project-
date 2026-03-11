// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import Layout from "../../components/Layout";
// import StatCard from "../../components/StatCard";
// import PageHeader from "../../components/PageHeader";
// import { useAuth } from "../../context/AuthContext";

// export const teacherNav = [
//   { path: "/teacher", label: "Dashboard", icon: "🏠" },
//   { path: "/teacher/subjects", label: "Subjects", icon: "📚" },
//   { path: "/teacher/students", label: "Students", icon: "👥" },
//   { path: "/teacher/assignments", label: "Assignments", icon: "📝" },
//   { path: "/teacher/attendance", label: "Attendance", icon: "📋" },
//   { path: "/teacher/marks", label: "Enter Marks", icon: "📊" },
//   { path: "/teacher/lectures", label: "Lectures", icon: "🎬" },
//   { path: "/teacher/resources", label: "Resources", icon: "🖥️" },
// ];

// export default function TeacherDashboard() {
//   const { user } = useAuth();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("/teacher/dashboard").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   return (
//     <Layout navItems={teacherNav}>
//       <PageHeader title={`Welcome, ${user?.name} 👋`} subtitle="Your teaching overview" />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
//           <StatCard icon="📚" label="Subjects Teaching" value={data?.subjectsTeaching} color="#10b981" />
//           <StatCard icon="👥" label="Total Students" value={data?.totalStudents} color="#3b82f6" />
//           <StatCard icon="📝" label="Assignments Issued" value={data?.assignmentsIssued} color="#f59e0b" />
//           <StatCard icon="📋" label="Attendance Sessions" value={data?.attendanceSessions} color="#6366f1" />
//         </div>
//       )}
//     </Layout>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";

export const teacherNav = [
  { path: "/teacher",               label: "Dashboard",     icon: "🏠" },
  { path: "/teacher/subjects",      label: "Subjects",      icon: "📚" },
  { path: "/teacher/students",      label: "Students",      icon: "👥" },
  { path: "/teacher/assignments",   label: "Assignments",   icon: "📝" },
  { path: "/teacher/attendance",    label: "Attendance",    icon: "📋" },
  { path: "/teacher/marks",         label: "Enter Marks",   icon: "📊" },
  { path: "/teacher/lectures",      label: "Lectures",      icon: "🎬" },
  { path: "/teacher/announcements", label: "Announcements", icon: "📢" },
  { path: "/teacher/alerts",        label: "Alerts",        icon: "🚨" },
  { path: "/teacher/resources",     label: "Resources",     icon: "🖥️" },
];

const card = { background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 22 };

const StatBox = ({ icon, label, value, color, sub }) => (
  <div style={{ ...card, display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</div>
      <div style={{ color: "#f0f4ff", fontSize: 26, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1 }}>{value ?? "—"}</div>
      {sub && <div style={{ color: color, fontSize: 11, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

export default function TeacherDashboard() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/teacher/dashboard").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout navItems={teacherNav}><div style={{ color: "#64748b", textAlign: "center", padding: 80 }}>Loading dashboard...</div></Layout>;

  return (
    <Layout navItems={teacherNav}>
      <PageHeader title={`Welcome back, ${user?.name?.split(" ")[0]} 👋`} subtitle="Here's your teaching overview for today" />

      {/* Stat grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatBox icon="📚" label="Subjects" value={data?.subjectsTeaching} color="#10b981" />
        <StatBox icon="👥" label="Students" value={data?.totalStudents} color="#3b82f6" />
        <StatBox icon="📝" label="Assignments" value={data?.assignmentsIssued} color="#f59e0b" />
        <StatBox icon="⏳" label="Pending Grading" value={data?.pendingGrading} color="#ef4444" sub={data?.pendingGrading > 0 ? "Need your attention" : "All graded ✓"} />
        <StatBox icon="🎬" label="Lectures" value={data?.lecturesUploaded} color="#6366f1" />
        <StatBox icon="📢" label="Announcements" value={data?.announcementsCount} color="#ec4899" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Subject enrollment bar chart */}
        <div style={card}>
          <h3 style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>Students per Subject</h3>
          {data?.subjectStats?.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.subjectStats} barSize={36}>
                <XAxis dataKey="code" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, color: "#e2e8f0" }} formatter={v => [v, "Students"]} />
                <Bar dataKey="studentCount" radius={[6,6,0,0]}>
                  {data.subjectStats.map((_, i) => (
                    <Cell key={i} fill={["#10b981","#3b82f6","#f59e0b","#6366f1"][i % 4]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ color: "#64748b", textAlign: "center", padding: 40 }}>No subjects assigned yet</div>}
        </div>

        {/* Today's sessions */}
        <div style={card}>
          <h3 style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 16px" }}>Today's Sessions</h3>
          {data?.todaySessions?.length === 0 && <div style={{ color: "#64748b", fontSize: 13, textAlign: "center", padding: 30 }}>No sessions created today</div>}
          {data?.todaySessions?.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{s.subject}</div>
                <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>Code: <span style={{ color: "#10b981", fontFamily: "monospace", letterSpacing: "2px" }}>{s.code}</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#3b82f6", fontSize: 13, fontWeight: 600 }}>{s.joinedCount} joined</div>
                <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 11, background: s.isActive ? "rgba(16,185,129,0.15)" : "rgba(100,116,139,0.15)", color: s.isActive ? "#10b981" : "#64748b" }}>
                  {s.isActive ? "● Live" : "Closed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent submissions */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>Recent Submissions</h3>
          <button onClick={() => navigate("/teacher/assignments")} style={{ background: "none", border: "none", color: "#3b82f6", fontSize: 13, cursor: "pointer" }}>View All →</button>
        </div>
        {data?.recentSubmissions?.length === 0 && <div style={{ color: "#64748b", fontSize: 13, textAlign: "center", padding: 20 }}>No submissions yet</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data?.recentSubmissions?.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, background: "rgba(30,41,59,0.4)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>
                  {s.studentName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{s.studentName}</div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>{s.assignmentTitle}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.graded ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: s.graded ? "#10b981" : "#f59e0b" }}>
                  {s.graded ? "✓ Graded" : "Pending grade"}
                </span>
                <div style={{ color: "#475569", fontSize: 11, marginTop: 3 }}>{new Date(s.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
