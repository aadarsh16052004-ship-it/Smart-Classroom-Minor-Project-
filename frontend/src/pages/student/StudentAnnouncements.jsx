import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";

const navItems = [
  { path: "/student",              label: "Dashboard" },
  { path: "/student/attendance",   label: "Attendance" },
  { path: "/student/assignments",  label: "Assignments"},
  { path: "/student/marks",        label: "Marks"},
  { path: "/student/timetable",    label: "Timetable" },
  { path: "/student/lectures",     label: "Lectures" },
  { path: "/student/subjects",     label: "Subjects" },
  { path: "/student/announcements",label: "Announcements" },
  { path: "/student/alerts",       label: "Alerts" },
  { path: "/student/profile",      label: "Profile" },
];

export default function StudentAnnouncements() {
  const { dark } = useTheme();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const card = { background: dark ? "rgba(15,23,42,0.9)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`, borderRadius: 14, overflow: "hidden" };
  const text = { color: dark ? "#e2e8f0" : "#1e293b" };
  const sub  = { color: dark ? "#64748b" : "#94a3b8" };

  useEffect(() => {
    api.get("/student/announcements")
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExpand = async (ann) => {
    const id = ann._id;
    setExpanded(e => e === id ? null : id);
    if (!ann.isRead) {
      await api.patch(`/student/announcements/${id}/read`).catch(() => {});
      setData(prev => prev.map(a => a._id === id ? { ...a, isRead: true } : a));
    }
  };

  return (
    <Layout navItems={navItems}>
      <PageHeader title="Announcements" subtitle="Updates from your teachers" />
      {loading ? (
        <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.length === 0 && (
            <div style={{ ...card, padding: 24, ...sub, textAlign: "center" }}>No announcements yet.</div>
          )}
          {data.map((a) => {
            const isOpen = expanded === a._id;
            return (
              <div key={a._id} style={{ ...card, border: !a.isRead ? "1px solid rgba(59,130,246,0.35)" : card.border }}>
                <div onClick={() => handleExpand(a)}
                  style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, position: "relative" }}>
                      
                      {!a.isRead && <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "#3b82f6" }} />}
                    </div>
                    <div>
                      <div style={{ ...text, fontSize: 14, fontWeight: a.isRead ? 500 : 700 }}>{a.title}</div>
                      <div style={{ ...sub, fontSize: 12, marginTop: 3 }}>
                         {a.subject?.name} · {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {!a.isRead && <span style={{ padding: "2px 8px", background: "rgba(59,130,246,0.15)", color: "#60a5fa", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>NEW</span>}
                    <span style={{ ...sub, fontSize: 18 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ padding: "0 20px 18px 72px", borderTop: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                    <p style={{ ...text, fontSize: 14, lineHeight: 1.8, margin: "14px 0 0", whiteSpace: "pre-wrap" }}>{a.content}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
