// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import api from "../../api/axios";
// import Layout from "../../components/Layout";
// import PageHeader from "../../components/PageHeader";

// const navItems = [
//   { path: "/student",             label: "Dashboard",  icon: "🏠" },
//   { path: "/student/attendance",  label: "Attendance", icon: "📋" },
//   { path: "/student/assignments", label: "Assignments",icon: "📝" },
//   { path: "/student/marks",       label: "Marks",      icon: "📊" },
//   { path: "/student/timetable",   label: "Timetable",  icon: "🗓️" },
//   { path: "/student/lectures",    label: "Lectures",   icon: "🎬" },
//   { path: "/student/subjects",    label: "Subjects",   icon: "📚" },
//   { path: "/student/alerts",      label: "Alerts",     icon: "🔔" },
// ];

// const card = { background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 };

// /* ─── ASSIGNMENTS ─────────────────────────────────────── */
// export function StudentAssignments() {
//   const [data, setData]             = useState([]);
//   const [loading, setLoading]       = useState(true);
//   const [submitting, setSubmitting] = useState(null); // assignmentId being submitted
//   const [texts, setTexts]           = useState({});   // { assignmentId: text }
//   const [expanded, setExpanded]     = useState(null); // which card is expanded

//   const fetchAssignments = () => {
//     api.get("/student/assignments")
//       .then(r => setData(r.data))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => { fetchAssignments(); }, []);

//   const handleSubmit = async (assignmentId) => {
//     const text = texts[assignmentId] || "";
//     if (!text.trim()) { toast.error("Please write your answer before submitting"); return; }
//     setSubmitting(assignmentId);
//     try {
//       const res = await api.post("/student/assignments/submit", { assignmentId, submissionText: text });
//       toast.success(res.data.message || "Submitted successfully!");
//       setExpanded(null);
//       setTexts(prev => ({ ...prev, [assignmentId]: "" }));
//       fetchAssignments(); // refresh status
//     } catch {} finally { setSubmitting(null); }
//   };

//   const pending   = data.filter(a => a.status === "Pending").length;
//   const submitted = data.filter(a => a.status === "Submitted").length;

//   return (
//     <Layout navItems={navItems}>
//       <PageHeader title="Assignments" subtitle={`${pending} pending · ${submitted} submitted`} />
//       {loading ? (
//         <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//           {data.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No assignments found.</div>}

//           {data.map((a) => {
//             const isPending = a.status === "Pending";
//             const overdue   = isPending && new Date(a.dueDate) < new Date();
//             const isOpen    = expanded === a.assignmentId;

//             return (
//               <div key={a.assignmentId} style={{ ...card, padding: 0, overflow: "hidden" }}>
//                 {/* Header row */}
//                 <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//                     <div style={{
//                       width: 46, height: 46, borderRadius: 12, flexShrink: 0,
//                       background: isPending ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
//                       display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
//                     }}>📝</div>
//                     <div>
//                       <div style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600 }}>{a.title}</div>
//                       <div style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>
//                         {a.subject} · Max: {a.maxMarks} marks
//                       </div>
//                       <div style={{ color: overdue ? "#ef4444" : "#64748b", fontSize: 12, marginTop: 2 }}>
//                         {overdue ? "⚠️ Overdue · " : "📅 Due: "}
//                         {new Date(a.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
//                       </div>
//                     </div>
//                   </div>

//                   <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
//                     <span style={{
//                       padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
//                       background: isPending ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)",
//                       color: isPending ? "#f59e0b" : "#10b981",
//                       border: `1px solid ${isPending ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`,
//                     }}>{a.status}</span>

//                     {isPending && (
//                       <button
//                         onClick={() => setExpanded(isOpen ? null : a.assignmentId)}
//                         style={{
//                           padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
//                           background: isOpen ? "rgba(239,68,68,0.1)" : "linear-gradient(135deg,#3b82f6,#6366f1)",
//                           border: isOpen ? "1px solid rgba(239,68,68,0.3)" : "none",
//                           color: isOpen ? "#ef4444" : "#fff",
//                         }}>
//                         {isOpen ? "Cancel" : "Submit ↑"}
//                       </button>
//                     )}
//                   </div>
//                 </div>

//                 {/* Submission panel — only for pending */}
//                 {isPending && isOpen && (
//                   <div style={{ borderTop: "1px solid rgba(59,130,246,0.15)", padding: "20px 22px", background: "rgba(59,130,246,0.03)" }}>
//                     <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                       Your Answer / Submission
//                     </label>
//                     <textarea
//                       value={texts[a.assignmentId] || ""}
//                       onChange={e => setTexts(prev => ({ ...prev, [a.assignmentId]: e.target.value }))}
//                       placeholder="Write your answer here... (paste links, code, explanation, etc.)"
//                       rows={6}
//                       style={{
//                         width: "100%", padding: "12px 14px",
//                         background: "rgba(15,23,42,0.8)",
//                         border: "1px solid rgba(59,130,246,0.25)",
//                         borderRadius: 10, color: "#e2e8f0",
//                         fontSize: 14, lineHeight: 1.6,
//                         resize: "vertical", outline: "none",
//                         fontFamily: "inherit", boxSizing: "border-box",
//                       }}
//                     />
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
//                       <span style={{ color: "#475569", fontSize: 12 }}>
//                         {(texts[a.assignmentId] || "").length} characters
//                       </span>
//                       <button
//                         onClick={() => handleSubmit(a.assignmentId)}
//                         disabled={submitting === a.assignmentId}
//                         style={{
//                           padding: "10px 24px",
//                           background: submitting === a.assignmentId ? "rgba(16,185,129,0.4)" : "linear-gradient(135deg,#10b981,#059669)",
//                           border: "none", borderRadius: 8,
//                           color: "#fff", fontSize: 14, fontWeight: 600,
//                           cursor: submitting === a.assignmentId ? "not-allowed" : "pointer",
//                         }}>
//                         {submitting === a.assignmentId ? "Submitting..." : "✓ Submit Assignment"}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Already submitted indicator */}
//                 {!isPending && (
//                   <div style={{ borderTop: "1px solid rgba(16,185,129,0.1)", padding: "12px 22px", background: "rgba(16,185,129,0.03)", display: "flex", alignItems: "center", gap: 8 }}>
//                     <span style={{ color: "#10b981", fontSize: 13 }}>✓ Assignment submitted successfully</span>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </Layout>
//   );
// }

// /* ─── MARKS ───────────────────────────────────────────── */
// export function StudentMarks() {
//   const [data, setData]     = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     api.get("/student/marks").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const examTypes = ["All", "MST1", "MST2", "FINAL"];
//   const filtered  = filter === "All" ? data : data.filter(m => m.examType === filter);

//   return (
//     <Layout navItems={navItems}>
//       <PageHeader title="Marks" subtitle="Your exam results across all subjects" />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <>
//           <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
//             {examTypes.map(t => (
//               <button key={t} onClick={() => setFilter(t)} style={{
//                 padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
//                 background: filter === t ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "rgba(30,41,59,0.8)",
//                 border: filter === t ? "none" : "1px solid rgba(255,255,255,0.08)",
//                 color: filter === t ? "#fff" : "#64748b",
//               }}>{t}</button>
//             ))}
//           </div>
//           <div style={card}>
//             {filtered.length === 0 && <div style={{ color: "#64748b", textAlign: "center", padding: 20 }}>No marks found.</div>}
//             {filtered.length > 0 && (
//               <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                 <thead>
//                   <tr>
//                     {["Subject","Exam","Obtained","Max","Percentage"].map(h => (
//                       <th key={h} style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 16px 14px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((m, i) => {
//                     const pct   = Math.round((m.marksObtained / m.maxMarks) * 100);
//                     const color = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";
//                     return (
//                       <tr key={i}>
//                         <td style={{ padding: "14px 16px", color: "#e2e8f0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{m.subject}</td>
//                         <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
//                           <span style={{ padding: "3px 10px", borderRadius: 6, background: "rgba(99,102,241,0.15)", color: "#818cf8", fontSize: 12, fontWeight: 600 }}>{m.examType}</span>
//                         </td>
//                         <td style={{ padding: "14px 16px", color: "#f0f4ff", fontWeight: 700, fontSize: 16, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{m.marksObtained}</td>
//                         <td style={{ padding: "14px 16px", color: "#64748b", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{m.maxMarks}</td>
//                         <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                             <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
//                               <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: color }} />
//                             </div>
//                             <span style={{ color, fontSize: 13, fontWeight: 700, minWidth: 45 }}>{pct}%</span>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </>
//       )}
//     </Layout>
//   );
// }

// /* ─── TIMETABLE ───────────────────────────────────────── */
// const DAYS       = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
// const DAY_COLORS = ["#3b82f6","#10b981","#f59e0b","#6366f1","#ec4899","#14b8a6"];

// export function StudentTimetable() {
//   const [data, setData]       = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("/student/timetable").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const byDay = DAYS.reduce((acc, d) => { acc[d] = data.filter(t => t.day === d); return acc; }, {});
//   const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

//   return (
//     <Layout navItems={navItems}>
//       <PageHeader title="Timetable" subtitle="Your weekly class schedule" />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//           {data.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No timetable entries found.</div>}
//           {DAYS.map((day, di) => byDay[day]?.length > 0 && (
//             <div key={day} style={{ ...card, border: day === today ? `1px solid ${DAY_COLORS[di]}55` : "1px solid rgba(255,255,255,0.07)" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
//                 <span style={{ width: 10, height: 10, borderRadius: "50%", background: DAY_COLORS[di], flexShrink: 0 }} />
//                 <h3 style={{ color: day === today ? DAY_COLORS[di] : "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
//                   {day} {day === today && "· Today"}
//                 </h3>
//               </div>
//               <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//                 {byDay[day].map((t, i) => (
//                   <div key={i} style={{ padding: "12px 18px", borderRadius: 10, background: `${DAY_COLORS[di]}15`, border: `1px solid ${DAY_COLORS[di]}30`, minWidth: 160 }}>
//                     <div style={{ color: DAY_COLORS[di], fontSize: 14, fontWeight: 600 }}>{t.subject}</div>
//                     <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>🕐 {t.startTime} – {t.endTime}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </Layout>
//   );
// }

// /* ─── LECTURES ────────────────────────────────────────── */
// export function StudentLectures() {
//   const [data, setData]       = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter]   = useState("All");

//   useEffect(() => {
//     api.get("/student/lectures").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const subjects = ["All", ...new Set(data.map(l => l.subject))];
//   const filtered  = filter === "All" ? data : data.filter(l => l.subject === filter);

//   return (
//     <Layout navItems={navItems}>
//       <PageHeader title="Lectures" subtitle={`${data.length} lectures available`} />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <>
//           <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
//             {subjects.map(s => (
//               <button key={s} onClick={() => setFilter(s)} style={{
//                 padding: "7px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
//                 background: filter === s ? "linear-gradient(135deg,#6366f1,#3b82f6)" : "rgba(30,41,59,0.8)",
//                 border: filter === s ? "none" : "1px solid rgba(255,255,255,0.08)",
//                 color: filter === s ? "#fff" : "#64748b", fontWeight: filter === s ? 600 : 400,
//               }}>{s}</button>
//             ))}
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
//             {filtered.length === 0 && <div style={{ ...card, color: "#64748b" }}>No lectures found.</div>}
//             {filtered.map((l, i) => (
//               <div key={i} style={card}>
//                 <div style={{ width: "100%", height: 90, borderRadius: 10, background: "rgba(99,102,241,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 16, border: "1px solid rgba(99,102,241,0.15)" }}>🎬</div>
//                 <div style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{l.title}</div>
//                 <div style={{ color: "#6366f1", fontSize: 12, marginBottom: 8 }}>{l.subject}</div>
//                 {l.description && <div style={{ color: "#64748b", fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>{l.description}</div>}
//                 {l.resourceUrl && (
//                   <a href={l.resourceUrl} target="_blank" rel="noreferrer"
//                     style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "linear-gradient(135deg,#6366f1,#3b82f6)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
//                     ▶ View Lecture
//                   </a>
//                 )}
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </Layout>
//   );
// }

// /* ─── SUBJECTS ────────────────────────────────────────── */
// export function StudentSubjects() {
//   const [data, setData]       = useState([]);
//   const [loading, setLoading] = useState(true);
//   const colors = ["#3b82f6","#10b981","#f59e0b","#6366f1","#ec4899"];

//   useEffect(() => {
//     api.get("/student/subjects").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   return (
//     <Layout navItems={navItems}>
//       <PageHeader title="My Subjects" subtitle={`Enrolled in ${data.length} subjects`} />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
//           {data.length === 0 && <div style={{ ...card, color: "#64748b" }}>No subjects found.</div>}
//           {data.map((s, i) => (
//             <div key={i} style={{ ...card, borderTop: `3px solid ${colors[i%colors.length]}`, paddingTop: 20 }}>
//               <div style={{ fontSize: 32, marginBottom: 14 }}>📚</div>
//               <div style={{ color: "#e2e8f0", fontSize: 16, fontWeight: 700 }}>{s.name}</div>
//               <div style={{ color: colors[i%colors.length], fontSize: 13, marginTop: 4, fontWeight: 600 }}>{s.code}</div>
//               <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "14px 0" }} />
//               <div style={{ color: "#64748b", fontSize: 13 }}>👨‍🏫 {s.teacher?.userId?.name || "N/A"}</div>
//               <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>👥 {s.students?.length || 0} students</div>
//               <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
//                 <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.isActive ? "#10b981" : "#ef4444" }} />
//                 <span style={{ color: s.isActive ? "#10b981" : "#ef4444", fontSize: 12 }}>{s.isActive ? "Active" : "Inactive"}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </Layout>
//   );
// }

// /* ─── ALERTS ──────────────────────────────────────────── */
// export function StudentAlerts() {
//   const [data, setData]       = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("/student/alerts").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const levelConfig = {
//     Emergency: { icon: "🚨", color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.3)"  },
//     Warning:   { icon: "⚠️", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)" },
//     Info:      { icon: "ℹ️", color: "#3b82f6", bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.3)" },
//   };

//   return (
//     <Layout navItems={navItems}>
//       <PageHeader title="Alerts & Notices" subtitle="Stay updated with important announcements" />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//           {data.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No alerts at this time.</div>}
//           {data.map((a, i) => {
//             const cfg = levelConfig[a.level] || levelConfig.Info;
//             return (
//               <div key={i} style={{ padding: "18px 22px", borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
//                 <span style={{ fontSize: 24, flexShrink: 0 }}>{cfg.icon}</span>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
//                     <span style={{ color: cfg.color, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>{a.level}</span>
//                     <span style={{ color: "#475569", fontSize: 12 }}>{new Date(a.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>
//                   </div>
//                   <p style={{ color: "#e2e8f0", margin: 0, fontSize: 14, lineHeight: 1.7 }}>{a.message}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </Layout>
//   );
// }

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";

const navItems = [
  { path: "/student",             label: "Dashboard",  icon: "🏠" },
  { path: "/student/attendance",  label: "Attendance", icon: "📋" },
  { path: "/student/assignments", label: "Assignments",icon: "📝" },
  { path: "/student/marks",       label: "Marks",      icon: "📊" },
  { path: "/student/timetable",   label: "Timetable",  icon: "🗓️" },
  { path: "/student/lectures",    label: "Lectures",   icon: "🎬" },
  { path: "/student/subjects",    label: "Subjects",   icon: "📚" },
  { path: "/student/alerts",      label: "Alerts",     icon: "🔔" },
];

const card = { background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 };

/* ─── ASSIGNMENTS ─────────────────────────────────────── */
export function StudentAssignments() {
  const [data, setData]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(null); // assignmentId being submitted
  const [texts, setTexts]           = useState({});   // { assignmentId: text }
  const [expanded, setExpanded]     = useState(null); // which card is expanded

  const fetchAssignments = () => {
    api.get("/student/assignments")
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAssignments(); }, []);

  const handleSubmit = async (assignmentId) => {
    const text = texts[assignmentId] || "";
    if (!text.trim()) { toast.error("Please write your answer before submitting"); return; }
    setSubmitting(assignmentId);
    try {
      const res = await api.post("/student/assignments/submit", { assignmentId, submissionText: text });
      toast.success(res.data.message || "Submitted successfully!");
      setExpanded(null);
      setTexts(prev => ({ ...prev, [assignmentId]: "" }));
      fetchAssignments(); // refresh status
    } catch {} finally { setSubmitting(null); }
  };

  const pending   = data.filter(a => a.status === "Pending").length;
  const submitted = data.filter(a => a.status === "Submitted").length;

  return (
    <Layout navItems={navItems}>
      <PageHeader title="Assignments" subtitle={`${pending} pending · ${submitted} submitted`} />
      {loading ? (
        <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {data.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No assignments found.</div>}

          {data.map((a) => {
            const isPending = a.status === "Pending";
            const overdue   = isPending && new Date(a.dueDate) < new Date();
            const isOpen    = expanded === a.assignmentId;

            return (
              <div key={a.assignmentId} style={{ ...card, padding: 0, overflow: "hidden" }}>
                {/* Header row */}
                <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                      background: isPending ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                    }}>📝</div>
                    <div>
                      <div style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600 }}>{a.title}</div>
                      <div style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>
                        {a.subject} · Max: {a.maxMarks} marks
                      </div>
                      <div style={{ color: overdue ? "#ef4444" : "#64748b", fontSize: 12, marginTop: 2 }}>
                        {overdue ? "⚠️ Overdue · " : "📅 Due: "}
                        {new Date(a.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <span style={{
                      padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: isPending ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)",
                      color: isPending ? "#f59e0b" : "#10b981",
                      border: `1px solid ${isPending ? "rgba(245,158,11,0.3)" : "rgba(16,185,129,0.3)"}`,
                    }}>{a.status}</span>

                    {(isPending || a.allowResubmission) && (
                      <button
                        onClick={() => setExpanded(isOpen ? null : a.assignmentId)}
                        style={{
                          padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                          background: isOpen ? "rgba(239,68,68,0.1)" : isPending ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                          border: isOpen ? "1px solid rgba(239,68,68,0.3)" : "none",
                          color: isOpen ? "#ef4444" : "#fff",
                        }}>
                        {isOpen ? "Cancel" : isPending ? "Submit ↑" : "🔄 Resubmit"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Submission panel — for pending OR allowed resubmission */}
                {(isPending || a.allowResubmission) && isOpen && (
                  <div style={{ borderTop: "1px solid rgba(59,130,246,0.15)", padding: "20px 22px", background: "rgba(59,130,246,0.03)" }}>
                    <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Your Answer / Submission
                    </label>
                    {!isPending && a.submission?.text && !texts[a.assignmentId] && (
                      <div style={{ padding: "8px 12px", background: "rgba(99,102,241,0.08)", borderRadius: 8, border: "1px solid rgba(99,102,241,0.2)", marginBottom: 10, fontSize: 13, color: "#94a3b8" }}>
                        <span style={{ color: "#818cf8", fontWeight: 600 }}>Previous submission:</span> {a.submission.text.slice(0, 120)}{a.submission.text.length > 120 ? "..." : ""}
                      </div>
                    )}
                    <textarea
                      value={texts[a.assignmentId] || ""}
                      onChange={e => setTexts(prev => ({ ...prev, [a.assignmentId]: e.target.value }))}
                      placeholder={isPending ? "Write your answer here..." : "Write your updated answer here..."}
                      rows={6}
                      style={{
                        width: "100%", padding: "12px 14px",
                        background: "rgba(15,23,42,0.8)",
                        border: "1px solid rgba(59,130,246,0.25)",
                        borderRadius: 10, color: "#e2e8f0",
                        fontSize: 14, lineHeight: 1.6,
                        resize: "vertical", outline: "none",
                        fontFamily: "inherit", boxSizing: "border-box",
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                      <span style={{ color: "#475569", fontSize: 12 }}>
                        {(texts[a.assignmentId] || "").length} characters
                      </span>
                      <button
                        onClick={() => handleSubmit(a.assignmentId)}
                        disabled={submitting === a.assignmentId}
                        style={{
                          padding: "10px 24px",
                          background: submitting === a.assignmentId ? "rgba(16,185,129,0.4)" : "linear-gradient(135deg,#10b981,#059669)",
                          border: "none", borderRadius: 8,
                          color: "#fff", fontSize: 14, fontWeight: 600,
                          cursor: submitting === a.assignmentId ? "not-allowed" : "pointer",
                        }}>
                        {submitting === a.assignmentId ? "Submitting..." : isPending ? "✓ Submit Assignment" : "🔄 Update Submission"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Already submitted indicator */}
                {!isPending && !isOpen && (
                  <div style={{ borderTop: "1px solid rgba(16,185,129,0.1)", padding: "12px 22px", background: "rgba(16,185,129,0.03)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#10b981", fontSize: 13 }}>✓ Submitted</span>
                      {a.submission?.marks !== null && a.submission?.marks !== undefined && (
                        <span style={{ padding: "2px 10px", borderRadius: 20, background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 12, fontWeight: 700 }}>
                          {a.submission.marks}/{a.maxMarks} marks
                        </span>
                      )}
                      {a.submission?.remarks && (
                        <span style={{ color: "#64748b", fontSize: 12, fontStyle: "italic" }}>"{a.submission.remarks}"</span>
                      )}
                    </div>
                    {a.allowResubmission && (
                      <span style={{ padding: "2px 10px", borderRadius: 20, background: "rgba(99,102,241,0.12)", color: "#818cf8", fontSize: 11, border: "1px solid rgba(99,102,241,0.2)" }}>🔄 Resubmission allowed</span>
                    )}
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

/* ─── MARKS ───────────────────────────────────────────── */
export function StudentMarks() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.get("/student/marks").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const examTypes = ["All", "MST1", "MST2", "FINAL"];
  const filtered  = filter === "All" ? data : data.filter(m => m.examType === filter);

  return (
    <Layout navItems={navItems}>
      <PageHeader title="Marks" subtitle="Your exam results across all subjects" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {examTypes.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{
                padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: filter === t ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "rgba(30,41,59,0.8)",
                border: filter === t ? "none" : "1px solid rgba(255,255,255,0.08)",
                color: filter === t ? "#fff" : "#64748b",
              }}>{t}</button>
            ))}
          </div>
          <div style={card}>
            {filtered.length === 0 && <div style={{ color: "#64748b", textAlign: "center", padding: 20 }}>No marks found.</div>}
            {filtered.length > 0 && (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Subject","Exam","Obtained","Max","Percentage"].map(h => (
                      <th key={h} style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 16px 14px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => {
                    const pct   = Math.round((m.marksObtained / m.maxMarks) * 100);
                    const color = pct >= 75 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";
                    return (
                      <tr key={i}>
                        <td style={{ padding: "14px 16px", color: "#e2e8f0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{m.subject}</td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 6, background: "rgba(99,102,241,0.15)", color: "#818cf8", fontSize: 12, fontWeight: 600 }}>{m.examType}</span>
                        </td>
                        <td style={{ padding: "14px 16px", color: "#f0f4ff", fontWeight: 700, fontSize: 16, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{m.marksObtained}</td>
                        <td style={{ padding: "14px 16px", color: "#64748b", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{m.maxMarks}</td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
                              <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: color }} />
                            </div>
                            <span style={{ color, fontSize: 13, fontWeight: 700, minWidth: 45 }}>{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}

/* ─── TIMETABLE ───────────────────────────────────────── */
const DAYS       = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAY_COLORS = ["#3b82f6","#10b981","#f59e0b","#6366f1","#ec4899","#14b8a6"];

export function StudentTimetable() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/timetable").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const byDay = DAYS.reduce((acc, d) => { acc[d] = data.filter(t => t.day === d); return acc; }, {});
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <Layout navItems={navItems}>
      <PageHeader title="Timetable" subtitle="Your weekly class schedule" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {data.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No timetable entries found.</div>}
          {DAYS.map((day, di) => byDay[day]?.length > 0 && (
            <div key={day} style={{ ...card, border: day === today ? `1px solid ${DAY_COLORS[di]}55` : "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: DAY_COLORS[di], flexShrink: 0 }} />
                <h3 style={{ color: day === today ? DAY_COLORS[di] : "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                  {day} {day === today && "· Today"}
                </h3>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {byDay[day].map((t, i) => (
                  <div key={i} style={{ padding: "12px 18px", borderRadius: 10, background: `${DAY_COLORS[di]}15`, border: `1px solid ${DAY_COLORS[di]}30`, minWidth: 160 }}>
                    <div style={{ color: DAY_COLORS[di], fontSize: 14, fontWeight: 600 }}>{t.subject}</div>
                    <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>🕐 {t.startTime} – {t.endTime}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

/* ─── LECTURES ────────────────────────────────────────── */
export function StudentLectures() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("All");

  useEffect(() => {
    api.get("/student/lectures").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const subjects = ["All", ...new Set(data.map(l => l.subject))];
  const filtered  = filter === "All" ? data : data.filter(l => l.subject === filter);

  return (
    <Layout navItems={navItems}>
      <PageHeader title="Lectures" subtitle={`${data.length} lectures available`} />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {subjects.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: "7px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                background: filter === s ? "linear-gradient(135deg,#6366f1,#3b82f6)" : "rgba(30,41,59,0.8)",
                border: filter === s ? "none" : "1px solid rgba(255,255,255,0.08)",
                color: filter === s ? "#fff" : "#64748b", fontWeight: filter === s ? 600 : 400,
              }}>{s}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {filtered.length === 0 && <div style={{ ...card, color: "#64748b" }}>No lectures found.</div>}
            {filtered.map((l, i) => (
              <div key={i} style={card}>
                <div style={{ width: "100%", height: 90, borderRadius: 10, background: "rgba(99,102,241,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 16, border: "1px solid rgba(99,102,241,0.15)" }}>🎬</div>
                <div style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{l.title}</div>
                <div style={{ color: "#6366f1", fontSize: 12, marginBottom: 8 }}>{l.subject}</div>
                {l.description && <div style={{ color: "#64748b", fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>{l.description}</div>}
                {l.resourceUrl && (
                  <a href={l.resourceUrl} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "linear-gradient(135deg,#6366f1,#3b82f6)", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    ▶ View Lecture
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}

/* ─── SUBJECTS ────────────────────────────────────────── */
export function StudentSubjects() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const colors = ["#3b82f6","#10b981","#f59e0b","#6366f1","#ec4899"];

  useEffect(() => {
    api.get("/student/subjects").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <Layout navItems={navItems}>
      <PageHeader title="My Subjects" subtitle={`Enrolled in ${data.length} subjects`} />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
          {data.length === 0 && <div style={{ ...card, color: "#64748b" }}>No subjects found.</div>}
          {data.map((s, i) => (
            <div key={i} style={{ ...card, borderTop: `3px solid ${colors[i%colors.length]}`, paddingTop: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>📚</div>
              <div style={{ color: "#e2e8f0", fontSize: 16, fontWeight: 700 }}>{s.name}</div>
              <div style={{ color: colors[i%colors.length], fontSize: 13, marginTop: 4, fontWeight: 600 }}>{s.code}</div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "14px 0" }} />
              <div style={{ color: "#64748b", fontSize: 13 }}>👨‍🏫 {s.teacher?.userId?.name || "N/A"}</div>
              <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>👥 {s.students?.length || 0} students</div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.isActive ? "#10b981" : "#ef4444" }} />
                <span style={{ color: s.isActive ? "#10b981" : "#ef4444", fontSize: 12 }}>{s.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

/* ─── ALERTS ──────────────────────────────────────────── */
export function StudentAlerts() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/alerts").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const levelConfig = {
    Emergency: { icon: "🚨", color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.3)"  },
    Warning:   { icon: "⚠️", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)" },
    Info:      { icon: "ℹ️", color: "#3b82f6", bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.3)" },
  };

  return (
    <Layout navItems={navItems}>
      <PageHeader title="Alerts & Notices" subtitle="Stay updated with important announcements" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No alerts at this time.</div>}
          {data.map((a, i) => {
            const cfg = levelConfig[a.level] || levelConfig.Info;
            return (
              <div key={i} style={{ padding: "18px 22px", borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{cfg.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                    <span style={{ color: cfg.color, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>{a.level}</span>
                    <span style={{ color: "#475569", fontSize: 12 }}>{new Date(a.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>
                  </div>
                  <p style={{ color: "#e2e8f0", margin: 0, fontSize: 14, lineHeight: 1.7 }}>{a.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
