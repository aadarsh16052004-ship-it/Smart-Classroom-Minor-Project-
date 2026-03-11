import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import StatCard from "../../components/StatCard";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { path: "/student", label: "Dashboard", icon: "🏠" },
  { path: "/student/attendance", label: "Attendance", icon: "📋" },
  { path: "/student/assignments", label: "Assignments", icon: "📝" },
  { path: "/student/marks", label: "Marks", icon: "📊" },
  { path: "/student/timetable", label: "Timetable", icon: "🗓️" },
  { path: "/student/lectures", label: "Lectures", icon: "🎬" },
  { path: "/student/subjects", label: "Subjects", icon: "📚" },
  { path: "/student/alerts", label: "Alerts", icon: "🔔" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/dashboard")
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <Layout navItems={navItems}>
      <PageHeader
        title={`${greeting}, ${user?.name?.split(" ")[0]} 👋`}
        subtitle="Here's your academic overview for today"
      />

      {loading ? (
        <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading dashboard...</div>
      ) : (
        <>
          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
            <StatCard icon="📚" label="Enrolled Subjects" value={data?.subjects} color="#3b82f6" />
            <StatCard icon="✅" label="Attendance" value={`${data?.attendancePercentage}%`} color={data?.attendancePercentage >= 75 ? "#10b981" : "#ef4444"} sub={data?.attendancePercentage < 75 ? "⚠️ Below 75% threshold" : "On track"} />
            <StatCard icon="📝" label="Pending Assignments" value={data?.pendingAssignments} color="#f59e0b" />
            <StatCard icon="🎯" label="Average Marks" value={`${data?.averageMarks}%`} color="#6366f1" />
          </div>

          {/* Attendance gauge + Alerts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 16, padding: 24 }}>
              <h3 style={{ color: "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 16px" }}>Attendance Gauge</h3>
              <div style={{ height: 200, position: "relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="70%" innerRadius="60%" outerRadius="100%" startAngle={180} endAngle={0}
                    data={[{ value: data?.attendancePercentage || 0, fill: data?.attendancePercentage >= 75 ? "#10b981" : "#ef4444" }]}>
                    <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "rgba(30,41,59,0.8)" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
                  <div style={{ color: "#f0f4ff", fontSize: 36, fontWeight: 700 }}>{data?.attendancePercentage}%</div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>Overall</div>
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 }}>
              <h3 style={{ color: "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 16px" }}>Recent Alerts</h3>
              {data?.alerts?.length === 0 && <p style={{ color: "#475569", fontSize: 14 }}>No alerts at this time.</p>}
              {data?.alerts?.map((a, i) => (
                <div key={i} style={{
                  padding: "12px 14px", borderRadius: 10, marginBottom: 10,
                  background: a.level === "Emergency" ? "rgba(239,68,68,0.1)" : a.level === "Warning" ? "rgba(245,158,11,0.1)" : "rgba(59,130,246,0.1)",
                  border: `1px solid ${a.level === "Emergency" ? "rgba(239,68,68,0.3)" : a.level === "Warning" ? "rgba(245,158,11,0.3)" : "rgba(59,130,246,0.3)"}`,
                  display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                  <span>{a.level === "Emergency" ? "🚨" : a.level === "Warning" ? "⚠️" : "ℹ️"}</span>
                  <p style={{ color: "#e2e8f0", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{a.message}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
