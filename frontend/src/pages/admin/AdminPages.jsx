import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import StatCard from "../../components/StatCard";
import PageHeader from "../../components/PageHeader";
import toast from "react-hot-toast";

export const adminNav = [
  { path: "/admin",              label: "Dashboard",    },
  { path: "/admin/users",        label: "Users",        },
  { path: "/admin/enrollments",  label: "Enrollments",  },
  { path: "/admin/subjects",     label: "Subjects",     },
  { path: "/admin/timetable",    label: "Timetable",    },
  { path: "/admin/resources",    label: "Resources",    },
  { path: "/admin/alerts",       label: "Alerts",       },
  { path: "/admin/chat",         label: "SmartBot",     },
];

const card = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 22 };
const input = { width: "100%", padding: "11px 14px", background: "#f8f9fb", border: "1px solid #e2e8f0", borderRadius: 8, color: "#1e293b", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const btn = (color = "#f59e0b") => ({ padding: "10px 20px", background: color, border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" });

export default function AdminDashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/admin/dashboard").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const StatBox = ({  label, value, color, sub }) => (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      {/* <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{icon}</div> */}
      <div>
        <div style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</div>
        <div style={{ color: "#0f172a", fontSize: 24, fontWeight: 800, letterSpacing: "-1px" }}>{value ?? "—"}</div>
        {sub && <div style={{ color, fontSize: 11, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );

  if (loading) return <Layout navItems={adminNav}><div style={{ color: "#64748b", textAlign: "center", padding: 80 }}>Loading dashboard...</div></Layout>;

  return (
    <Layout navItems={adminNav}>
      <PageHeader title="Admin Dashboard" subtitle="Complete system overview and management" />

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 12, marginBottom: 22 }}>
        <StatBox  label="Total Users" value={data?.users} color="#f59e0b" sub={`${data?.activeUsers} active`} />
        <StatBox  label="Students" value={data?.students} color="#3b82f6" sub={data?.unenrolledStudents > 0 ? `${data.unenrolledStudents} unenrolled` : "All enrolled ✓"} />
        <StatBox  label="Teachers" value={data?.teachers} color="#10b981" />
        <StatBox  label="Subjects" value={data?.subjects} color="#6366f1" />
        <StatBox  label="Resources" value={data?.resources} color="#ec4899" sub={`${data?.availableResources} available`} />
        <StatBox  label="Alerts Issued" value={data?.alerts} color="#ef4444" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Subject enrollment bar */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 22 }}>
          <h3 style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 16px", fontWeight: 600 }}>Subject Enrollment</h3>
          {data?.subjectEnrollments?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.subjectEnrollments.map((s, i) => {
                const colors = ["#f59e0b","#10b981","#3b82f6","#6366f1","#ec4899"];
                const c = colors[i % colors.length];
                const max = Math.max(...data.subjectEnrollments.map(x => x.students));
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ color: "#1e293b", fontSize: 13 }}>{s.name} <span style={{ color: "#475569", fontSize: 11 }}>({s.code})</span></span>
                      <span style={{ color: c, fontSize: 13, fontWeight: 700 }}>{s.students}</span>
                    </div>
                    <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4 }}>
                      <div style={{ height: "100%", width: `${max > 0 ? (s.students/max)*100 : 0}%`, background: c, borderRadius: 4, transition: "width 0.5s" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <div style={{ color: "#64748b", textAlign: "center", padding: 30 }}>No subjects created yet</div>}
        </div>

        {/* Resource status + Recent users */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 14px", fontWeight: 600 }}>Resource Status</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["Available","#10b981",data?.availableResources],["Allocated","#ef4444",data?.allocatedResources]].map(([label,c,v]) => (
                <div key={label} style={{ padding: "14px", borderRadius: 10, background: `${c}10`, border: `1px solid ${c}25`, textAlign: "center" }}>
                  <div style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>{label}</div>
                  <div style={{ color: c, fontSize: 22, fontWeight: 800 }}>{v ?? 0}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, flex: 1 }}>
            <h3 style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 12px" }}>User Distribution</h3>
            {[[" Students","#3b82f6",data?.students],[" Teachers","#10b981",data?.teachers]].map(([label,c,v]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f8f9fb" }}>
                <span style={{ color: "#64748b", fontSize: 13 }}>{label}</span>
                <span style={{ color: c, fontWeight: 700, fontSize: 15 }}>{v ?? 0}</span>
              </div>
            ))}
            {data?.unenrolledStudents > 0 && (
              <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(245,158,11,0.08)", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                <span style={{ color: "#f59e0b", fontSize: 12 }}>⚠️ {data.unenrolledStudents} student(s) have no subjects assigned</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent registrations */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 22 }}>
        <h3 style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 16px" }}>Recent Registrations</h3>
        {data?.recentUsers?.length === 0 && <div style={{ color: "#64748b", textAlign: "center", padding: 20 }}>No users yet</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {data?.recentUsers?.map((u, i) => {
            const rc = { admin: "#f59e0b", teacher: "#10b981", student: "#3b82f6" };
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 10, background: "rgba(30,41,59,0.35)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${rc[u.role]}22`, border: `1px solid ${rc[u.role]}44`, display: "flex", alignItems: "center", justifyContent: "center", color: rc[u.role], fontWeight: 700, fontSize: 12 }}>
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: "#1e293b", fontSize: 13, fontWeight: 600 }}>{u.name}</div>
                    <div style={{ color: "#475569", fontSize: 11 }}>{u.email}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ padding: "2px 10px", borderRadius: 20, background: `${rc[u.role]}15`, color: rc[u.role], fontSize: 11, fontWeight: 700, textTransform: "capitalize" }}>{u.role}</span>
                  <span style={{ color: "#475569", fontSize: 11 }}>{new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export function AdminUsers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => api.get("/admin/users").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (id, current) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { isActive: !current });
      toast.success("Status updated!");
      fetchUsers();
    } catch {}
  };

  const roleColor = { admin: "#f59e0b", teacher: "#10b981", student: "#3b82f6" };

  return (
    <Layout navItems={adminNav}>
      <PageHeader title="User Management" subtitle={`${data.length} total users in the system`} />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={card}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["User", "Email", "Role", "Status", "Action"].map(h => (
                  <th key={h} style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 16px 14px", textAlign: "left", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u._id}>
                  <td style={{ padding: "14px 16px", borderBottom: "1px solid #f8f9fb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${roleColor[u.role]}22`, border: `1px solid ${roleColor[u.role]}44`, display: "flex", alignItems: "center", justifyContent: "center", color: roleColor[u.role], fontWeight: 700, fontSize: 13 }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ color: "#1e293b", fontSize: 14, fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#64748b", fontSize: 13, borderBottom: "1px solid #f8f9fb" }}>{u.email}</td>
                  <td style={{ padding: "14px 16px", borderBottom: "1px solid #f8f9fb" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 6, background: `${roleColor[u.role]}18`, color: roleColor[u.role], fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>{u.role}</span>
                  </td>
                  <td style={{ padding: "14px 16px", borderBottom: "1px solid #f8f9fb" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: u.isActive ? "#10b981" : "#ef4444" }} />
                      <span style={{ color: u.isActive ? "#10b981" : "#ef4444", fontSize: 13 }}>{u.isActive ? "Active" : "Inactive"}</span>
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", borderBottom: "1px solid #f8f9fb" }}>
                    <button onClick={() => toggleStatus(u._id, u.isActive)}
                      style={{ padding: "6px 14px", background: u.isActive ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${u.isActive ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`, borderRadius: 6, color: u.isActive ? "#ef4444" : "#10b981", fontSize: 12, cursor: "pointer" }}>
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

export function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", code: "", teacherId: "", studentIds: [] });
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = () => Promise.all([
    api.get("/admin/subjects"),
    api.get("/admin/users"),
  ]).then(([s, u]) => {
    setSubjects(s.data);
    setUsers(u.data);
    setStudents(u.data.filter(u => u.role === "student"));
  }).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchAll(); }, []);

  const teachers = users.filter(u => u.role === "teacher");

  const handleSubmit = async () => {
    if (!form.name || !form.code || !form.teacherId) { toast.error("Fill required fields"); return; }
    setSubmitting(true);
    try {
      await api.post("/admin/subjects", form);
      toast.success("Subject created!");
      setForm({ name: "", code: "", teacherId: "", studentIds: [] });
      fetchAll();
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <Layout navItems={adminNav}>
      <PageHeader title="Subjects" subtitle="Manage subjects and their assignments" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}>
          <div style={card}>
            <h3 style={{ color: "#64748b", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>Create Subject</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input style={input} placeholder="Subject Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input style={input} placeholder="Subject Code * (e.g. CS301)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
              <select style={input} value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })}>
                <option value="">Assign Teacher *</option>
                {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
              <button onClick={handleSubmit} disabled={submitting} style={btn()}>{submitting ? "Creating..." : "Create Subject"}</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {subjects.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No subjects yet.</div>}
            {subjects.map((s, i) => (
              <div key={i} style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ color: "#1e293b", fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                    <div style={{ color: "#f59e0b", fontSize: 13, marginTop: 4 }}>{s.code}</div>
                  </div>
                  <span style={{ padding: "3px 10px", background: "rgba(59,130,246,0.15)", color: "#60a5fa", borderRadius: 6, fontSize: 12 }}>{s.students?.length || 0} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

export function AdminTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ day: "Monday", subjectId: "", teacherId: "", startTime: "", endTime: "" });
  const [submitting, setSubmitting] = useState(false);
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    Promise.all([api.get("/admin/timetable"), api.get("/admin/subjects"), api.get("/admin/users")])
      .then(([t, s, u]) => {
        setTimetable(t.data);
        setSubjects(s.data);
        setTeachers(u.data.filter(u => u.role === "teacher"));
      }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!form.subjectId || !form.teacherId || !form.startTime || !form.endTime) { toast.error("Fill all fields"); return; }
    setSubmitting(true);
    try {
      await api.post("/admin/timetable", form);
      toast.success("Timetable entry added!");
      const res = await api.get("/admin/timetable");
      setTimetable(res.data);
      setForm({ day: "Monday", subjectId: "", teacherId: "", startTime: "", endTime: "" });
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <Layout navItems={adminNav}>
      <PageHeader title="Timetable" subtitle="Schedule classes across the week" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}>
          <div style={card}>
            <h3 style={{ color: "#64748b", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>Add Entry</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <select style={input} value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
              <select style={input} value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <select style={input} value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })}>
                <option value="">Select Teacher</option>
                {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input style={input} type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
                <input style={input} type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
              </div>
              <button onClick={handleSubmit} disabled={submitting} style={btn()}>{submitting ? "Adding..." : "Add Entry"}</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {timetable.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No timetable yet.</div>}
            {timetable.map((t, i) => (
              <div key={i} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#1e293b", fontWeight: 600, fontSize: 14 }}>{t.subject?.name}</div>
                  <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{t.day} • {t.startTime} – {t.endTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

export function AdminAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ message: "", level: "Info", targetRole: "student" });
  const [submitting, setSubmitting] = useState(false);

  const fetchAlerts = () => api.get("/admin/alerts").then(r => setAlerts(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchAlerts(); }, []);

  const handleSubmit = async () => {
    if (!form.message) { toast.error("Enter a message"); return; }
    setSubmitting(true);
    try {
      await api.post("/admin/alerts", form);
      toast.success("Alert sent!");
      setForm({ message: "", level: "Info", targetRole: "student" });
      fetchAlerts();
    } catch {} finally { setSubmitting(false); }
  };

  const levelConfig = {
    Emergency: { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.3)",  },
    Warning: { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)",  },
    Info: { color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.3)",  },
  };

  return (
    <Layout navItems={adminNav}>
      <PageHeader title="Alerts & Notices" subtitle="Broadcast alerts to students and teachers" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}>
          <div style={card}>
            <h3 style={{ color: "#64748b", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>New Alert</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <textarea style={{ ...input, minHeight: 90, resize: "vertical" }} placeholder="Alert message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              <select style={input} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                <option value="Info">Info</option>
                <option value="Warning">Warning</option>
                <option value="Emergency">Emergency</option>
              </select>
              <select style={input} value={form.targetRole} onChange={e => setForm({ ...form, targetRole: e.target.value })}>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="all">Everyone</option>
              </select>
              <button onClick={handleSubmit} disabled={submitting} style={btn()}>{submitting ? "Sending..." : "Send Alert"}</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {alerts.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No alerts sent yet.</div>}
            {alerts.map((a, i) => {
              const cfg = levelConfig[a.level] || levelConfig.Info;
              return (
                <div key={i} style={{ padding: "16px 20px", borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", gap: 14 }}>
                  <span style={{ fontSize: 22 }}>{cfg.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: cfg.color, fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>{a.level} → {a.targetRole}</span>
                      <span style={{ color: "#475569", fontSize: 12 }}>{new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ color: "#1e293b", margin: 0, fontSize: 14, lineHeight: 1.6 }}>{a.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Layout>
  );
}

export function AdminResources() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", type: "Hardware" });
  const [submitting, setSubmitting] = useState(false);

  const fetchResources = () => api.get("/admin/resources").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchResources(); }, []);

  const handleSubmit = async () => {
    if (!form.name) { toast.error("Enter resource name"); return; }
    setSubmitting(true);
    try {
      await api.post("/admin/resources", form);
      toast.success("Resource created!");
      setForm({ name: "", type: "Hardware" });
      fetchResources();
    } catch {} finally { setSubmitting(false); }
  };

  const deleteResource = async (id) => {
    try {
      await api.delete(`/admin/resources/${id}`);
      toast.success("Resource deleted.");
      fetchResources();
    } catch {}
  };


  return (
    <Layout navItems={adminNav}>
      <PageHeader title="Resources" subtitle="Manage infrastructure and equipment" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}>
          <div style={card}>
            <h3 style={{ color: "#64748b", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>Add Resource</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input style={input} placeholder="Resource Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <select style={input} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Room">Room</option>
              </select>
              <button onClick={handleSubmit} disabled={submitting} style={btn()}>{submitting ? "Adding..." : "Add Resource"}</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {data.length === 0 && <div style={{ ...card, color: "#64748b" }}>No resources found.</div>}
            {data.map((r) => (
              <div key={r._id} style={card}>
                <div style={{ color: "#1e293b", fontWeight: 600 }}>{r.name}</div>
                <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{r.type}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <span style={{ color: r.status === "Available" ? "#10b981" : "#f59e0b", fontSize: 13 }}>{r.status}</span>
                  <button onClick={() => deleteResource(r._id)}
                    style={{ padding: "5px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, color: "#ef4444", fontSize: 12, cursor: "pointer" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

/* ─── ENROLLMENTS ─────────────────────────────────────── */
export function AdminEnrollments() {
  const [students, setStudents]   = useState([]);
  const [subjects, setSubjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [assigning, setAssigning] = useState(null);

  // CSV bulk enroll state
  const [tab, setTab]               = useState("manual");   // "manual" | "csv"
  const [csvSubject, setCsvSubject] = useState("");
  const [csvText, setCsvText]       = useState("");
  const [csvPreview, setCsvPreview] = useState(null);       // parsed rows
  const [csvResult, setCsvResult]   = useState(null);       // server response
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchAll = () =>
    Promise.all([api.get("/admin/enrollments"), api.get("/admin/subjects")])
      .then(([s, sub]) => { setStudents(s.data); setSubjects(sub.data); })
      .catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchAll(); }, []);

  /* ── Manual enroll ── */
  const assign = async (studentId, subjectId) => {
    const key = `${studentId}-${subjectId}`;
    setAssigning(key);
    try {
      const res = await api.post("/admin/enrollments/assign", { studentId, subjectId });
      toast.success(res.data.message);
      fetchAll();
    } catch {} finally { setAssigning(null); }
  };

  const remove = async (studentId, subjectId) => {
    const key = `${studentId}-${subjectId}-r`;
    setAssigning(key);
    try {
      await api.post("/admin/enrollments/remove", { studentId, subjectId });
      toast.success("Subject removed");
      fetchAll();
    } catch {} finally { setAssigning(null); }
  };

  /* ── CSV parse & preview ── */
  const parseCSV = (text) => {
    const lines = text.trim().split(/[\r\n]+/).filter(l => l.trim());
    if (lines.length === 0) return [];
    const header = lines[0].toLowerCase().split(",").map(h => h.trim());
    const emailIdx = header.indexOf("email");
    const rollIdx  = header.indexOf("rollnumber");
    if (emailIdx === -1 && rollIdx === -1) return null; // bad format

    return lines.slice(1).map(line => {
      const cols = line.split(",").map(c => c.trim());
      const row  = {};
      if (emailIdx !== -1 && cols[emailIdx]) row.email = cols[emailIdx];
      if (rollIdx  !== -1 && cols[rollIdx])  row.rollNumber = cols[rollIdx];
      return row;
    }).filter(r => r.email || r.rollNumber);
  };

  const handleCSVPreview = () => {
    if (!csvSubject) { toast.error("Select a subject first"); return; }
    if (!csvText.trim()) { toast.error("Paste CSV data first"); return; }
    const rows = parseCSV(csvText);
    if (rows === null) { toast.error("CSV must have an 'email' or 'rollNumber' column header"); return; }
    if (rows.length === 0) { toast.error("No valid rows found in CSV"); return; }
    setCsvPreview(rows);
    setCsvResult(null);
  };

  const handleBulkEnroll = async () => {
    if (!csvPreview?.length) return;
    setBulkLoading(true);
    try {
      const res = await api.post("/admin/enrollments/bulk", { subjectId: csvSubject, rows: csvPreview });
      setCsvResult(res.data);
      toast.success(`Enrolled ${res.data.enrolled} student(s)!`);
      fetchAll();
    } catch {} finally { setBulkLoading(false); }
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const cardStyle = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 };
  const inputStyle = { padding: "10px 14px", background: "#f8f9fb", border: "1px solid #e2e8f0", borderRadius: 8, color: "#1e293b", fontSize: 14, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" };

  return (
    <Layout navItems={adminNav}>
      <PageHeader title="Enrollments" subtitle="Assign subjects to students manually or via CSV" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Tab switcher */}
          <div style={{ display: "flex", background: "#f8f9fb", borderRadius: 12, padding: 4, border: "1px solid rgba(255,255,255,0.07)", maxWidth: 360 }}>
            {[["manual"," Manual Enroll"],["csv"," Bulk CSV Upload"]].map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex: 1, padding: "9px 12px", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  background: tab === t ? "linear-gradient(135deg,#f59e0b,#f59e0b88)" : "transparent",
                  color: tab === t ? "#fff" : "#64748b" }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── MANUAL TAB ── */}
          {tab === "manual" && (
            <>
              <input style={inputStyle} placeholder=" Search by name, email or roll number..." value={search} onChange={e => setSearch(e.target.value)} />
              {filtered.length === 0 && <div style={{ ...cardStyle, color: "#64748b", textAlign: "center" }}>No students found.</div>}
              {filtered.map(s => (
                <div key={s._id} style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
                  <div style={{ padding: "16px 22px", borderBottom: "1px solid #f8f9fb", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#f59e0b88)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                      {s.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: "#1e293b", fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                      <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{s.rollNumber} · {s.email}</div>
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.isActive ? "#10b981" : "#ef4444" }} />
                      <span style={{ color: s.isActive ? "#10b981" : "#64748b", fontSize: 12 }}>{s.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                  <div style={{ padding: "16px 22px" }}>
                    <div style={{ color: "#64748b", fontSize: 12, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Subject Enrollment ({s.subjects?.length || 0} assigned)
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {subjects.map(sub => {
                        const enrolled  = s.subjects?.some(es => es._id === sub._id);
                        const assignKey = `${s._id}-${sub._id}`;
                        const removeKey = `${s._id}-${sub._id}-r`;
                        const busy = assigning === assignKey || assigning === removeKey;
                        return (
                          <div key={sub._id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8, background: enrolled ? "rgba(16,185,129,0.1)" : "#f1f5f9", border: `1px solid ${enrolled ? "rgba(16,185,129,0.3)" : "#f1f5f9"}` }}>
                            <span style={{ color: enrolled ? "#10b981" : "#64748b", fontSize: 13 }}>{sub.name}</span>
                            <button onClick={() => enrolled ? remove(s._id, sub._id) : assign(s._id, sub._id)} disabled={busy}
                              style={{ padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer", background: enrolled ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", border: `1px solid ${enrolled ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`, color: enrolled ? "#ef4444" : "#10b981" }}>
                              {busy ? "..." : enrolled ? "Remove" : "+ Add"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ── CSV TAB ── */}
          {tab === "csv" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

              {/* Left: Input panel */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={cardStyle}>
                  <h3 style={{ color: "#64748b", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 16px" }}>Step 1 — Select Subject</h3>
                  <select style={inputStyle} value={csvSubject} onChange={e => { setCsvSubject(e.target.value); setCsvPreview(null); setCsvResult(null); }}>
                    <option value="">Choose subject to enroll into...</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                  </select>
                </div>

                <div style={cardStyle}>
                  <h3 style={{ color: "#64748b", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 8px" }}>Step 2 — Paste CSV Data</h3>
                  <p style={{ color: "#475569", fontSize: 12, margin: "0 0 12px", lineHeight: 1.6 }}>
                    CSV must have a header row with <code style={{ color: "#f59e0b" }}>email</code> or <code style={{ color: "#f59e0b" }}>rollNumber</code> column (or both).
                  </p>
                  <div style={{ padding: "10px 14px", background: "rgba(245,158,11,0.06)", borderRadius: 8, border: "1px solid rgba(245,158,11,0.15)", marginBottom: 12, fontSize: 12, color: "#64748b", fontFamily: "monospace", lineHeight: 1.8 }}>
                    email,rollNumber<br/>
                    rahul@cms.com,STU001<br/>
                    aman@cms.com,STU002<br/>
                    priya@cms.com,
                  </div>
                  <textarea
                    rows={7} value={csvText} onChange={e => { setCsvText(e.target.value); setCsvPreview(null); setCsvResult(null); }}
                    placeholder={"email,rollNumberrahul@cms.com,STU001aman@cms.com,STU002"}
                    style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 13 }}
                  />
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <button onClick={handleCSVPreview}
                      style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg,#f59e0b,#f59e0b88)", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                       Preview ({csvText.trim().split("").length - 1} rows)
                    </button>
                    {csvPreview && (
                      <button onClick={() => { setCsvPreview(null); setCsvResult(null); }}
                        style={{ padding: "10px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#ef4444", fontSize: 13, cursor: "pointer" }}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Preview & Results */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {!csvPreview && !csvResult && (
                  <div style={{ ...cardStyle, textAlign: "center", color: "#475569", padding: 40 }}>
                    
                    <p style={{ margin: 0, fontSize: 14 }}>Paste your CSV and click Preview to see the student list before enrolling.</p>
                  </div>
                )}

                {csvPreview && !csvResult && (
                  <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <h3 style={{ color: "#64748b", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
                        Preview — {csvPreview.length} students
                      </h3>
                      <span style={{ color: "#f59e0b", fontSize: 12 }}>
                        Subject: {subjects.find(s => s._id === csvSubject)?.name}
                      </span>
                    </div>
                    <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                      {csvPreview.map((row, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: "#f1f5f9" }}>
                          <span style={{ color: "#475569", fontSize: 12, minWidth: 20 }}>{i + 1}.</span>
                          {row.email && <span style={{ color: "#60a5fa", fontSize: 13 }}>{row.email}</span>}
                          {row.rollNumber && <span style={{ color: "#f59e0b", fontSize: 12, marginLeft: "auto" }}>{row.rollNumber}</span>}
                        </div>
                      ))}
                    </div>
                    <button onClick={handleBulkEnroll} disabled={bulkLoading}
                      style={{ width: "100%", padding: "12px", background: bulkLoading ? "rgba(16,185,129,0.3)" : "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, cursor: bulkLoading ? "not-allowed" : "pointer" }}>
                      {bulkLoading ? "Enrolling..." : `✓ Enroll ${csvPreview.length} Students`}
                    </button>
                  </div>
                )}

                {csvResult && (
                  <div style={cardStyle}>
                    <h3 style={{ color: "#10b981", fontSize: 14, fontWeight: 700, margin: "0 0 16px" }}>✓ Bulk Enroll Complete</h3>
                    <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 16px" }}>Subject: <strong style={{ color: "#1e293b" }}>{csvResult.subjectName}</strong></p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                      {[["Enrolled","#10b981",csvResult.enrolled],["Already In","#f59e0b",csvResult.alreadyEnrolled],["Not Found","#ef4444",csvResult.notFound]].map(([label,c,v]) => (
                        <div key={label} style={{ padding: "14px 10px", borderRadius: 10, background: `${c}10`, border: `1px solid ${c}25`, textAlign: "center" }}>
                          <div style={{ color: "#64748b", fontSize: 11, marginBottom: 4 }}>{label}</div>
                          <div style={{ color: c, fontSize: 22, fontWeight: 800 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {csvResult.details?.notFound?.length > 0 && (
                      <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.07)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)" }}>
                        <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Not found in system:</div>
                        {csvResult.details.notFound.map((e, i) => (
                          <div key={i} style={{ color: "#64748b", fontSize: 12 }}>{e}</div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => { setCsvPreview(null); setCsvResult(null); setCsvText(""); setCsvSubject(""); }}
                      style={{ marginTop: 14, width: "100%", padding: "9px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#64748b", fontSize: 13, cursor: "pointer" }}>
                      Start Another Bulk Enroll
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
