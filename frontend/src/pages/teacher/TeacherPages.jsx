// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import Layout from "../../components/Layout";
// import PageHeader from "../../components/PageHeader";
// import toast from "react-hot-toast";

// export const teacherNav = [
//   { path: "/teacher",               label: "Dashboard",     icon: "🏠" },
//   { path: "/teacher/subjects",      label: "Subjects",      icon: "📚" },
//   { path: "/teacher/students",      label: "Students",      icon: "👥" },
//   { path: "/teacher/assignments",   label: "Assignments",   icon: "📝" },
//   { path: "/teacher/attendance",    label: "Attendance",    icon: "📋" },
//   { path: "/teacher/marks",         label: "Enter Marks",   icon: "📊" },
//   { path: "/teacher/lectures",      label: "Lectures",      icon: "🎬" },
//   { path: "/teacher/announcements", label: "Announcements", icon: "📢" },
//   { path: "/teacher/resources",     label: "Resources",     icon: "🖥️" },
// ];

// const card = { background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 };
// const input = { width: "100%", padding: "11px 14px", background: "rgba(30,41,59,0.8)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 8, color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
// const btn = (color = "#3b82f6") => ({ padding: "10px 20px", background: `linear-gradient(135deg, ${color}, ${color}99)`, border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" });

// export function TeacherSubjects() {
//   const [subjects, setSubjects]       = useState([]);
//   const [loading, setLoading]         = useState(true);
//   const [expanded, setExpanded]       = useState(null);   // subject._id being expanded
//   const [studentsMap, setStudentsMap] = useState({});     // { subjectId: { loading, students } }
//   const colors = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"];

//   useEffect(() => {
//     api.get("/teacher/subjects").then(r => setSubjects(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const toggleStudents = async (subjectId) => {
//     if (expanded === subjectId) { setExpanded(null); return; }
//     setExpanded(subjectId);

//     // Already fetched
//     if (studentsMap[subjectId]) return;

//     setStudentsMap(prev => ({ ...prev, [subjectId]: { loading: true, students: [] } }));
//     try {
//       const res = await api.get(`/teacher/subjects/${subjectId}/students`);
//       setStudentsMap(prev => ({ ...prev, [subjectId]: { loading: false, students: res.data.students || [] } }));
//     } catch {
//       setStudentsMap(prev => ({ ...prev, [subjectId]: { loading: false, students: [] } }));
//     }
//   };

//   return (
//     <Layout navItems={teacherNav}>
//       <PageHeader title="My Subjects" subtitle={`Teaching ${subjects.length} subjects`} />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//           {subjects.length === 0 && <div style={{ ...card, color: "#64748b" }}>No subjects assigned.</div>}
//           {subjects.map((s, i) => {
//             const color      = colors[i % colors.length];
//             const isExpanded = expanded === s._id;
//             const subData    = studentsMap[s._id];

//             return (
//               <div key={s._id} style={{ ...card, padding: 0, overflow: "hidden" }}>
//                 {/* Subject header */}
//                 <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: `4px solid ${color}` }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//                     <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📚</div>
//                     <div>
//                       <div style={{ color: "#e2e8f0", fontSize: 16, fontWeight: 700 }}>{s.name}</div>
//                       <div style={{ color, fontSize: 13, marginTop: 3 }}>{s.code}</div>
//                     </div>
//                   </div>

//                   <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                     <div style={{ textAlign: "right" }}>
//                       <div style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 700 }}>{s.students?.length || 0}</div>
//                       <div style={{ color: "#64748b", fontSize: 11 }}>students</div>
//                     </div>
//                     <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: s.isActive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", borderRadius: 20 }}>
//                       <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.isActive ? "#10b981" : "#ef4444" }} />
//                       <span style={{ color: s.isActive ? "#10b981" : "#ef4444", fontSize: 12 }}>{s.isActive ? "Active" : "Inactive"}</span>
//                     </div>
//                     <button onClick={() => toggleStudents(s._id)}
//                       style={{
//                         padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
//                         background: isExpanded ? `${color}22` : `${color}`,
//                         border: isExpanded ? `1px solid ${color}55` : "none",
//                         color: isExpanded ? color : "#fff",
//                         transition: "all 0.2s",
//                       }}>
//                       {isExpanded ? "Hide Students ▲" : "View Students ▼"}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Students list */}
//                 {isExpanded && (
//                   <div style={{ borderTop: `1px solid ${color}22`, padding: "16px 24px", background: `${color}06` }}>
//                     {subData?.loading && <div style={{ color: "#64748b", padding: "10px 0" }}>Loading students...</div>}
//                     {!subData?.loading && subData?.students?.length === 0 && (
//                       <div style={{ color: "#64748b", padding: "10px 0" }}>No students enrolled in this subject yet.</div>
//                     )}
//                     {!subData?.loading && subData?.students?.length > 0 && (
//                       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
//                         {subData.students.map((st, j) => (
//                           <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
//                             <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", color, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
//                               {st.name?.[0]?.toUpperCase()}
//                             </div>
//                             <div>
//                               <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{st.name}</div>
//                               <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{st.rollNumber} · {st.email}</div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
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

// export function TeacherStudents() {
//   const [data, setData]         = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [search, setSearch]     = useState("");
//   const [selected, setSelected] = useState(null);   // student detail
//   const [detail, setDetail]     = useState(null);
//   const [detailLoading, setDetailLoading] = useState(false);
//   const [detailTab, setDetailTab] = useState("overview"); // overview | marks | attendance | submissions

//   useEffect(() => {
//     api.get("/teacher/students").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const openDetail = async (studentId) => {
//     setSelected(studentId);
//     setDetail(null);
//     setDetailTab("overview");
//     setDetailLoading(true);
//     try {
//       const res = await api.get(`/teacher/students/${studentId}/detail`);
//       setDetail(res.data);
//     } catch {} finally { setDetailLoading(false); }
//   };

//   const filtered = data.filter(s =>
//     s.name?.toLowerCase().includes(search.toLowerCase()) ||
//     s.email?.toLowerCase().includes(search.toLowerCase())
//   );

//   const overlayBg = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
//   const modalBg   = { background: "#0d1628", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 20, width: "100%", maxWidth: 760, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" };

//   return (
//     <Layout navItems={teacherNav}>
//       <PageHeader title="Students" subtitle={`${data.length} students across your subjects`} />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <>
//           <input value={search} onChange={e => setSearch(e.target.value)}
//             placeholder="🔍 Search by name or email..."
//             style={{ ...input, marginBottom: 16, maxWidth: 400 }} />

//           <div style={card}>
//             <table style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr>
//                   {["Student", "Email", "Action"].map(h => (
//                     <th key={h} style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 16px 14px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filtered.length === 0 && (
//                   <tr><td colSpan={3} style={{ color: "#64748b", textAlign: "center", padding: 30 }}>No students found</td></tr>
//                 )}
//                 {filtered.map((s, i) => (
//                   <tr key={i}>
//                     <td style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                         <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
//                           {s.name?.[0]?.toUpperCase()}
//                         </div>
//                         <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{s.name}</span>
//                       </div>
//                     </td>
//                     <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{s.email}</td>
//                     <td style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
//                       <button onClick={() => openDetail(s._id)}
//                         style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
//                         View Details →
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Detail Modal */}
//           {selected && (
//             <div style={overlayBg} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
//               <div style={modalBg}>
//                 {/* Modal header */}
//                 <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//                     <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18 }}>
//                       {detail?.name?.[0]?.toUpperCase() || "?"}
//                     </div>
//                     <div>
//                       <div style={{ color: "#f0f4ff", fontSize: 17, fontWeight: 700 }}>{detail?.name || "Loading..."}</div>
//                       <div style={{ color: "#64748b", fontSize: 13 }}>{detail?.rollNumber} · {detail?.email}</div>
//                     </div>
//                   </div>
//                   <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#64748b", fontSize: 22, cursor: "pointer" }}>✕</button>
//                 </div>

//                 {detailLoading && <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div>}

//                 {detail && !detailLoading && (
//                   <>
//                     {/* Tabs */}
//                     <div style={{ display: "flex", gap: 4, padding: "12px 24px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
//                       {["overview","marks","attendance","submissions"].map(tab => (
//                         <button key={tab} onClick={() => setDetailTab(tab)}
//                           style={{ padding: "8px 16px", border: "none", borderRadius: "8px 8px 0 0", fontSize: 13, fontWeight: detailTab === tab ? 600 : 400, cursor: "pointer", background: detailTab === tab ? "rgba(59,130,246,0.15)" : "transparent", color: detailTab === tab ? "#60a5fa" : "#64748b", textTransform: "capitalize", borderBottom: detailTab === tab ? "2px solid #3b82f6" : "2px solid transparent" }}>
//                           {tab}
//                         </button>
//                       ))}
//                     </div>

//                     {/* Tab content */}
//                     <div style={{ overflowY: "auto", padding: "20px 24px", flex: 1 }}>

//                       {/* OVERVIEW */}
//                       {detailTab === "overview" && (
//                         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//                           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
//                             {[
//                               ["📚 Subjects", detail.subjects?.length || 0, "#3b82f6"],
//                               ["📝 Submissions", detail.submissions?.length || 0, "#10b981"],
//                               ["📊 Avg Marks", detail.marks?.length > 0 ? Math.round(detail.marks.reduce((s,m) => s + (m.marksObtained/m.maxMarks)*100, 0)/detail.marks.length) + "%" : "N/A", "#f59e0b"],
//                             ].map(([label, val, color]) => (
//                               <div key={label} style={{ padding: "14px", borderRadius: 10, background: `${color}10`, border: `1px solid ${color}25`, textAlign: "center" }}>
//                                 <div style={{ color: "#64748b", fontSize: 11, marginBottom: 6 }}>{label}</div>
//                                 <div style={{ color, fontSize: 22, fontWeight: 800 }}>{val}</div>
//                               </div>
//                             ))}
//                           </div>
//                           <div>
//                             <div style={{ color: "#64748b", fontSize: 12, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Enrolled Subjects</div>
//                             <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                               {detail.subjects?.map((s, i) => (
//                                 <span key={i} style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", fontSize: 13 }}>{s.name}</span>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* MARKS */}
//                       {detailTab === "marks" && (
//                         <div>
//                           {detail.marks?.length === 0 && <div style={{ color: "#64748b", textAlign: "center", padding: 30 }}>No marks recorded yet</div>}
//                           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                             <thead>
//                               <tr>{["Subject","Exam","Obtained","Max","%"].map(h => (
//                                 <th key={h} style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", padding: "0 12px 12px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
//                               ))}</tr>
//                             </thead>
//                             <tbody>
//                               {detail.marks?.map((m, i) => {
//                                 const pct = Math.round((m.marksObtained/m.maxMarks)*100);
//                                 const c = pct>=75?"#10b981":pct>=50?"#f59e0b":"#ef4444";
//                                 return (
//                                   <tr key={i}>
//                                     <td style={{ padding: "10px 12px", color: "#e2e8f0", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{m.subject}</td>
//                                     <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}><span style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(99,102,241,0.15)", color: "#818cf8", fontSize: 11 }}>{m.examType}</span></td>
//                                     <td style={{ padding: "10px 12px", color: "#f0f4ff", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{m.marksObtained}</td>
//                                     <td style={{ padding: "10px 12px", color: "#64748b", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{m.maxMarks}</td>
//                                     <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
//                                       <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                                         <div style={{ width: 50, height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
//                                           <div style={{ height: "100%", width: `${pct}%`, background: c, borderRadius: 3 }} />
//                                         </div>
//                                         <span style={{ color: c, fontSize: 12, fontWeight: 700 }}>{pct}%</span>
//                                       </div>
//                                     </td>
//                                   </tr>
//                                 );
//                               })}
//                             </tbody>
//                           </table>
//                         </div>
//                       )}

//                       {/* ATTENDANCE */}
//                       {detailTab === "attendance" && (
//                         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                           {detail.attendanceStats?.length === 0 && <div style={{ color: "#64748b", textAlign: "center", padding: 30 }}>No attendance records</div>}
//                           {detail.attendanceStats?.map((a, i) => (
//                             <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, background: "rgba(30,41,59,0.4)" }}>
//                               <div style={{ flex: 1 }}>
//                                 <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{a.subject}</div>
//                                 <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{a.present}/{a.total} classes attended</div>
//                               </div>
//                               <div style={{ width: 120 }}>
//                                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
//                                   <span style={{ color: "#64748b", fontSize: 11 }}> </span>
//                                   <span style={{ color: a.percentage >= 75 ? "#10b981" : "#ef4444", fontSize: 13, fontWeight: 700 }}>{a.percentage}%</span>
//                                 </div>
//                                 <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
//                                   <div style={{ height: "100%", width: `${a.percentage}%`, background: a.percentage >= 75 ? "#10b981" : "#ef4444", borderRadius: 3 }} />
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       {/* SUBMISSIONS */}
//                       {detailTab === "submissions" && (
//                         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                           {detail.submissions?.length === 0 && <div style={{ color: "#64748b", textAlign: "center", padding: 30 }}>No submissions yet</div>}
//                           {detail.submissions?.map((s, i) => (
//                             <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(30,41,59,0.4)" }}>
//                               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                                 <div>
//                                   <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{s.assignment}</div>
//                                   <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{s.subject} · {new Date(s.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
//                                 </div>
//                                 {s.marks !== null ? (
//                                   <span style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 12, fontWeight: 700 }}>✓ {s.marks} marks</span>
//                                 ) : (
//                                   <span style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(245,158,11,0.15)", color: "#f59e0b", fontSize: 12 }}>Ungraded</span>
//                                 )}
//                               </div>
//                               {s.remarks && <div style={{ color: "#475569", fontSize: 12, marginTop: 6, fontStyle: "italic" }}>"{s.remarks}"</div>}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </Layout>
//   );
// }

// export function TeacherAssignments() {
//   const [assignments, setAssignments]   = useState([]);
//   const [subjects, setSubjects]         = useState([]);
//   const [loading, setLoading]           = useState(true);
//   const [form, setForm]                 = useState({ title: "", description: "", subjectId: "", dueDate: "", maxMarks: "" });
//   const [submitting, setSubmitting]     = useState(false);
//   const [viewSubs, setViewSubs]         = useState(null);  // assignmentId whose submissions are open
//   const [submissions, setSubmissions]   = useState([]);
//   const [subsLoading, setSubsLoading]   = useState(false);
//   const [grading, setGrading]           = useState({});    // { subId: { marks, remarks } }
//   const [gradingSaving, setGradingSaving] = useState(null);

//   useEffect(() => {
//     Promise.all([api.get("/teacher/assignments"), api.get("/teacher/subjects")])
//       .then(([a, s]) => { setAssignments(a.data); setSubjects(s.data); })
//       .catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const handleCreate = async () => {
//     if (!form.title || !form.subjectId || !form.dueDate || !form.maxMarks) { toast.error("Fill all fields"); return; }
//     setSubmitting(true);
//     try {
//       await api.post("/teacher/assignments", form);
//       toast.success("Assignment created!");
//       const res = await api.get("/teacher/assignments");
//       setAssignments(res.data);
//       setForm({ title: "", description: "", subjectId: "", dueDate: "", maxMarks: "" });
//     } catch {} finally { setSubmitting(false); }
//   };

//   const openSubmissions = async (assignmentId) => {
//     if (viewSubs === assignmentId) { setViewSubs(null); return; }
//     setViewSubs(assignmentId);
//     setSubsLoading(true);
//     try {
//       const res = await api.get(`/teacher/submissions/${assignmentId}`);
//       setSubmissions(res.data);
//       const g = {};
//       res.data.forEach(s => { g[s._id] = { marks: s.marks ?? "", remarks: s.remarks ?? "" }; });
//       setGrading(g);
//     } catch {} finally { setSubsLoading(false); }
//   };

//   const saveGrade = async (subId) => {
//     const { marks, remarks } = grading[subId] || {};
//     if (marks === "" || marks === null) { toast.error("Enter marks"); return; }
//     setGradingSaving(subId);
//     try {
//       await api.patch(`/teacher/submissions/${subId}/grade`, { marksObtained: Number(marks), remarks });
//       toast.success("Grade saved!");
//       setSubmissions(prev => prev.map(s => s._id === subId ? { ...s, marks: Number(marks), remarks } : s));
//     } catch {} finally { setGradingSaving(null); }
//   };

//   return (
//     <Layout navItems={teacherNav}>
//       <PageHeader title="Assignments" subtitle="Create, view submissions, and grade" />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//           {/* Create form */}
//           <div style={card}>
//             <h3 style={{ color: "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>Create New Assignment</h3>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//               <input style={input} placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
//               <select style={input} value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
//                 <option value="">Select Subject</option>
//                 {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//               </select>
//               <input style={input} type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
//               <input style={input} type="number" placeholder="Max Marks" value={form.maxMarks} onChange={e => setForm({...form, maxMarks: e.target.value})} />
//               <textarea style={{ ...input, resize: "vertical", minHeight: 60, gridColumn: "1/-1" }} placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
//               <button onClick={handleCreate} disabled={submitting} style={{ ...btn("#10b981"), gridColumn: "1/-1" }}>{submitting ? "Creating..." : "✓ Create Assignment"}</button>
//             </div>
//           </div>

//           {/* Assignment list with submissions */}
//           {assignments.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No assignments yet.</div>}
//           {assignments.map(a => (
//             <div key={a.id} style={{ ...card, padding: 0, overflow: "hidden" }}>
//               <div style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
//                 <div>
//                   <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 15 }}>{a.title}</div>
//                   <div style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>{a.subject} · Max: {a.maxMarks} · Due: {new Date(a.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
//                 </div>
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   <span style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(59,130,246,0.15)", color: "#60a5fa", fontSize: 13 }}>{a.submissionsCount} submitted</span>
//                   <button onClick={() => openSubmissions(a.id)}
//                     style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: viewSubs === a.id ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${viewSubs === a.id ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`, color: viewSubs === a.id ? "#ef4444" : "#10b981" }}>
//                     {viewSubs === a.id ? "Close ▲" : "Grade ▼"}
//                   </button>
//                 </div>
//               </div>

//               {/* Submissions panel */}
//               {viewSubs === a.id && (
//                 <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "16px 22px", background: "rgba(16,185,129,0.02)" }}>
//                   {subsLoading && <div style={{ color: "#64748b", padding: "10px 0" }}>Loading submissions...</div>}
//                   {!subsLoading && submissions.length === 0 && <div style={{ color: "#64748b" }}>No submissions yet.</div>}
//                   {!subsLoading && submissions.map(s => (
//                     <div key={s._id} style={{ marginBottom: 16, padding: 16, borderRadius: 10, background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
//                         <div>
//                           <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{s.student} <span style={{ color: "#64748b", fontSize: 12 }}>({s.rollNumber})</span></div>
//                           <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>Submitted: {new Date(s.submittedAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
//                         </div>
//                         {s.marks !== null && s.marks !== undefined && (
//                           <span style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 13, fontWeight: 700 }}>✓ {s.marks}/{a.maxMarks}</span>
//                         )}
//                       </div>
//                       <div style={{ background: "rgba(30,41,59,0.6)", borderRadius: 8, padding: "10px 12px", color: "#94a3b8", fontSize: 13, lineHeight: 1.6, marginBottom: 12, maxHeight: 100, overflowY: "auto", whiteSpace: "pre-wrap" }}>
//                         {s.submissionText || "No submission text"}
//                       </div>
//                       <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//                         <input type="number" placeholder="Marks" min={0} max={a.maxMarks}
//                           value={grading[s._id]?.marks ?? ""} onChange={e => setGrading(g => ({ ...g, [s._id]: { ...g[s._id], marks: e.target.value } }))}
//                           style={{ ...input, width: 90, padding: "8px 10px" }} />
//                         <input placeholder="Remarks (optional)"
//                           value={grading[s._id]?.remarks ?? ""} onChange={e => setGrading(g => ({ ...g, [s._id]: { ...g[s._id], remarks: e.target.value } }))}
//                           style={{ ...input, flex: 1, padding: "8px 10px" }} />
//                         <button onClick={() => saveGrade(s._id)} disabled={gradingSaving === s._id}
//                           style={{ padding: "8px 16px", background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: gradingSaving === s._id ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
//                           {gradingSaving === s._id ? "..." : "Save Grade"}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </Layout>
//   );
// }

// export function TeacherAttendance() {
//   const [subjects, setSubjects] = useState([]);
//   const [session, setSession] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [creating, setCreating] = useState(false);
//   const [closing, setClosing] = useState(false);
//   const [form, setForm] = useState({ subjectId: "", timeSlot: "" });

//   useEffect(() => {
//     api.get("/teacher/subjects").then(r => setSubjects(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const createSession = async () => {
//     if (!form.subjectId || !form.timeSlot) { toast.error("Fill all fields"); return; }
//     setCreating(true);
//     try {
//       const res = await api.post("/teacher/attendance/session", form);
//       setSession(res.data);
//       toast.success("Session created!");
//     } catch {} finally { setCreating(false); }
//   };

//   const closeSession = async () => {
//     if (!session?.sessionId) return;
//     setClosing(true);
//     try {
//       const res = await api.post(`/teacher/attendance/session/close/${session.sessionId}`);
//       toast.success(`Attendance finalized! ${res.data.totalStudents} students processed.`);
//       setSession(null);
//     } catch {} finally { setClosing(false); }
//   };

//   return (
//     <Layout navItems={teacherNav}>
//       <PageHeader title="Attendance" subtitle="Create sessions for students to join" />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
//           <div style={card}>
//             <h3 style={{ color: "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>Create Session</h3>
//             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//               <select style={input} value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
//                 <option value="">Select Subject</option>
//                 {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//               </select>
//               <input style={input} placeholder="Time Slot (e.g. 10:00-11:00)" value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })} />
//               <button onClick={createSession} disabled={creating} style={btn("#10b981")}>{creating ? "Creating..." : "Create Session"}</button>
//             </div>
//           </div>

//           {session && (
//             <div style={{ ...card, border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.05)" }}>
//               <h3 style={{ color: "#10b981", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>Active Session</h3>
//               <div style={{ textAlign: "center", marginBottom: 20 }}>
//                 <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 8px" }}>Share this code with students</p>
//                 <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "8px", color: "#10b981", fontFamily: "monospace" }}>{session.code}</div>
//                 <p style={{ color: "#64748b", fontSize: 12, marginTop: 8 }}>Expires: {new Date(session.expiresAt).toLocaleTimeString()}</p>
//               </div>
//               <button onClick={closeSession} disabled={closing} style={{ ...btn("#ef4444"), width: "100%" }}>
//                 {closing ? "Closing..." : "Close Session & Finalize Attendance"}
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </Layout>
//   );
// }

// export function TeacherMarks() {
//   const [subjects, setSubjects] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ studentId: "", subjectId: "", examType: "MST1", marksObtained: "", maxMarks: "" });
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     Promise.all([api.get("/teacher/subjects"), api.get("/teacher/students")])
//       .then(([s, st]) => { setSubjects(s.data); setStudents(st.data); })
//       .catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const handleSubmit = async () => {
//     setSubmitting(true);
//     try {
//       await api.post("/teacher/marks", form);
//       toast.success("Marks saved successfully!");
//       setForm({ studentId: "", subjectId: "", examType: "MST1", marksObtained: "", maxMarks: "" });
//     } catch {} finally { setSubmitting(false); }
//   };

//   return (
//     <Layout navItems={teacherNav}>
//       <PageHeader title="Enter Marks" subtitle="Record exam marks for students" />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <div style={{ maxWidth: 500 }}>
//           <div style={card}>
//             <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//               <div>
//                 <label style={{ color: "#64748b", fontSize: 12, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Student</label>
//                 <select style={input} value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}>
//                   <option value="">Select Student</option>
//                   {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label style={{ color: "#64748b", fontSize: 12, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Subject</label>
//                 <select style={input} value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
//                   <option value="">Select Subject</option>
//                   {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label style={{ color: "#64748b", fontSize: 12, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Exam Type</label>
//                 <select style={input} value={form.examType} onChange={e => setForm({ ...form, examType: e.target.value })}>
//                   <option value="MST1">MST1</option>
//                   <option value="MST2">MST2</option>
//                   <option value="FINAL">FINAL</option>
//                 </select>
//               </div>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                 <div>
//                   <label style={{ color: "#64748b", fontSize: 12, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Marks Obtained</label>
//                   <input style={input} type="number" placeholder="e.g. 18" value={form.marksObtained} onChange={e => setForm({ ...form, marksObtained: e.target.value })} />
//                 </div>
//                 <div>
//                   <label style={{ color: "#64748b", fontSize: 12, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Max Marks</label>
//                   <input style={input} type="number" placeholder="e.g. 25" value={form.maxMarks} onChange={e => setForm({ ...form, maxMarks: e.target.value })} />
//                 </div>
//               </div>
//               <button onClick={handleSubmit} disabled={submitting} style={{ ...btn("#6366f1"), marginTop: 4 }}>{submitting ? "Saving..." : "Save Marks"}</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// }

// export function TeacherLectures() {
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ title: "", description: "", subjectId: "", resourceUrl: "" });
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     api.get("/teacher/subjects").then(r => setSubjects(r.data)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const handleSubmit = async () => {
//     if (!form.title || !form.subjectId) { toast.error("Fill required fields"); return; }
//     setSubmitting(true);
//     try {
//       await api.post("/teacher/lectures", form);
//       toast.success("Lecture uploaded!");
//       setForm({ title: "", description: "", subjectId: "", resourceUrl: "" });
//     } catch {} finally { setSubmitting(false); }
//   };

//   return (
//     <Layout navItems={teacherNav}>
//       <PageHeader title="Upload Lecture" subtitle="Add lecture resources for students" />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <div style={{ maxWidth: 500 }}>
//           <div style={card}>
//             <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//               <input style={input} placeholder="Lecture Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
//               <textarea style={{ ...input, minHeight: 80, resize: "vertical" }} placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
//               <select style={input} value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
//                 <option value="">Select Subject *</option>
//                 {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//               </select>
//               <input style={input} placeholder="Resource URL (optional)" value={form.resourceUrl} onChange={e => setForm({ ...form, resourceUrl: e.target.value })} />
//               <button onClick={handleSubmit} disabled={submitting} style={btn("#f59e0b")}>{submitting ? "Uploading..." : "Upload Lecture"}</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// }

// export function TeacherResources() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchResources = () => {
//     api.get("/teacher/resources").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
//   };

//   useEffect(() => { fetchResources(); }, []);

//   const allocate = async (id) => {
//     try {
//       await api.post(`/teacher/resources/${id}/allocate`);
//       toast.success("Resource allocated!");
//       fetchResources();
//     } catch {}
//   };

//   const release = async (id) => {
//     try {
//       await api.post(`/teacher/resources/${id}/release`);
//       toast.success("Resource released!");
//       fetchResources();
//     } catch {}
//   };

//   const typeIcon = { Hardware: "🖥️", Software: "💿", Room: "🏫" };

//   return (
//     <Layout navItems={teacherNav}>
//       <PageHeader title="Resources" subtitle="Manage classroom resources" />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
//           {data.length === 0 && <div style={{ ...card, color: "#64748b" }}>No resources found.</div>}
//           {data.map((r) => (
//             <div key={r._id} style={card}>
//               <div style={{ fontSize: 32, marginBottom: 12 }}>{typeIcon[r.type] || "📦"}</div>
//               <div style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600 }}>{r.name}</div>
//               <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{r.type}</div>
//               <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, marginBottom: 14 }}>
//                 <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.status === "Available" ? "#10b981" : "#f59e0b" }} />
//                 <span style={{ color: r.status === "Available" ? "#10b981" : "#f59e0b", fontSize: 13 }}>{r.status}</span>
//                 {r.allocatedToMe && <span style={{ color: "#64748b", fontSize: 12 }}>(yours)</span>}
//               </div>
//               {r.status === "Available"
//                 ? <button onClick={() => allocate(r._id)} style={{ ...btn("#10b981"), fontSize: 13, padding: "8px 16px" }}>Allocate</button>
//                 : r.allocatedToMe
//                   ? <button onClick={() => release(r._id)} style={{ ...btn("#ef4444"), fontSize: 13, padding: "8px 16px" }}>Release</button>
//                   : <span style={{ color: "#475569", fontSize: 13 }}>Allocated to another</span>
//               }
//             </div>
//           ))}
//         </div>
//       )}
//     </Layout>
//   );
// }

// /* ─── ANNOUNCEMENTS ──────────────────────────────────── */
// export function TeacherAnnouncements() {
//   const [anns, setAnns]         = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [form, setForm]         = useState({ title: "", content: "", subjectId: "" });
//   const [posting, setPosting]   = useState(false);

//   const fetchAll = () =>
//     Promise.all([api.get("/teacher/announcements"), api.get("/teacher/subjects")])
//       .then(([a, s]) => { setAnns(a.data); setSubjects(s.data); })
//       .catch(() => {}).finally(() => setLoading(false));

//   useEffect(() => { fetchAll(); }, []);

//   const handlePost = async () => {
//     if (!form.title || !form.content || !form.subjectId) { toast.error("Fill all fields"); return; }
//     setPosting(true);
//     try {
//       await api.post("/teacher/announcements", form);
//       toast.success("Announcement posted!");
//       setForm({ title: "", content: "", subjectId: "" });
//       fetchAll();
//     } catch {} finally { setPosting(false); }
//   };

//   const handleDelete = async (id) => {
//     await api.delete(`/teacher/announcements/${id}`).catch(() => {});
//     toast.success("Deleted");
//     setAnns(prev => prev.filter(a => a._id !== id));
//   };

//   return (
//     <Layout navItems={teacherNav}>
//       <PageHeader title="Announcements" subtitle="Post subject-wise updates to your students" />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}>
//           {/* Post form */}
//           <div style={card}>
//             <h3 style={{ color: "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>Post Announcement</h3>
//             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//               <input style={input} placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
//               <select style={input} value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
//                 <option value="">Select Subject</option>
//                 {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//               </select>
//               <textarea rows={5} style={{ ...input, resize: "vertical" }} placeholder="Write your announcement..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
//               <button onClick={handlePost} disabled={posting} style={btn("#6366f1")}>{posting ? "Posting..." : "📢 Post Announcement"}</button>
//             </div>
//           </div>

//           {/* Announcements list */}
//           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//             {anns.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No announcements posted yet.</div>}
//             {anns.map(a => (
//               <div key={a._id} style={{ ...card, padding: "18px 20px" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
//                   <div>
//                     <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 15 }}>{a.title}</div>
//                     <div style={{ color: "#6366f1", fontSize: 12, marginTop: 3 }}>📚 {a.subject?.name} · {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
//                   </div>
//                   <button onClick={() => handleDelete(a._id)}
//                     style={{ padding: "5px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#ef4444", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>
//                     🗑 Delete
//                   </button>
//                 </div>
//                 <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{a.content}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// }

// /* ─── TEACHER ALERTS ─────────────────────────────────── */
// export function TeacherAlerts() {
//   const [alerts, setAlerts]     = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [form, setForm]         = useState({ message: "", level: "Info", targetRole: "student" });
//   const [posting, setPosting]   = useState(false);

//   const fetchAlerts = () =>
//     api.get("/teacher/alerts").then(r => setAlerts(r.data)).catch(() => {}).finally(() => setLoading(false));

//   useEffect(() => { fetchAlerts(); }, []);

//   const handlePost = async () => {
//     if (!form.message.trim()) { toast.error("Message cannot be empty"); return; }
//     setPosting(true);
//     try {
//       await api.post("/teacher/alerts", form);
//       toast.success("Alert broadcast!");
//       setForm({ message: "", level: "Info", targetRole: "student" });
//       fetchAlerts();
//     } catch {} finally { setPosting(false); }
//   };

//   const levelConfig = {
//     Emergency: { icon: "🚨", color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.3)"  },
//     Warning:   { icon: "⚠️", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)" },
//     Info:      { icon: "ℹ️", color: "#3b82f6", bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.3)" },
//   };

//   return (
//     <Layout navItems={teacherNav}>
//       <PageHeader title="Broadcast Alerts" subtitle="Send important notices to students or all users" />
//       {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}>
//           {/* Create form */}
//           <div style={card}>
//             <h3 style={{ color: "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>New Alert</h3>
//             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//               <div>
//                 <label style={{ display: "block", color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Level</label>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
//                   {["Info","Warning","Emergency"].map(l => {
//                     const cfg = levelConfig[l];
//                     return (
//                       <button key={l} onClick={() => setForm(f => ({...f, level: l}))}
//                         style={{ padding: "8px 4px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `2px solid ${form.level === l ? cfg.color : "rgba(255,255,255,0.08)"}`, background: form.level === l ? cfg.bg : "rgba(30,41,59,0.5)", color: form.level === l ? cfg.color : "#64748b" }}>
//                         {cfg.icon} {l}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//               <div>
//                 <label style={{ display: "block", color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Send To</label>
//                 <select style={input} value={form.targetRole} onChange={e => setForm(f => ({...f, targetRole: e.target.value}))}>
//                   <option value="student">Students Only</option>
//                   <option value="teacher">Teachers Only</option>
//                   <option value="all">Everyone</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display: "block", color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Message</label>
//                 <textarea rows={4} style={{ ...input, resize: "vertical" }} placeholder="Write your alert message..." value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} />
//               </div>
//               <button onClick={handlePost} disabled={posting}
//                 style={{ padding: "12px", background: posting ? "rgba(239,68,68,0.4)" : "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: posting ? "not-allowed" : "pointer" }}>
//                 {posting ? "Broadcasting..." : "🚨 Broadcast Alert"}
//               </button>
//             </div>
//           </div>

//           {/* Alerts list */}
//           <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//             {alerts.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No alerts yet.</div>}
//             {alerts.map((a, i) => {
//               const cfg = levelConfig[a.level] || levelConfig.Info;
//               return (
//                 <div key={i} style={{ padding: "16px 20px", borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", gap: 14 }}>
//                   <span style={{ fontSize: 22, flexShrink: 0 }}>{cfg.icon}</span>
//                   <div style={{ flex: 1 }}>
//                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
//                       <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//                         <span style={{ color: cfg.color, fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>{a.level}</span>
//                         <span style={{ padding: "1px 7px", borderRadius: 20, background: "rgba(255,255,255,0.07)", color: "#64748b", fontSize: 11 }}>→ {a.targetRole}</span>
//                       </div>
//                       <span style={{ color: "#475569", fontSize: 12 }}>{new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
//                     </div>
//                     <p style={{ color: "#e2e8f0", margin: 0, fontSize: 14, lineHeight: 1.6 }}>{a.message}</p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </Layout>
//   );
// }

import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import toast from "react-hot-toast";

export const teacherNav = [
  { path: "/teacher",               label: "Dashboard",     icon: "🏠" },
  { path: "/teacher/subjects",      label: "Subjects",      icon: "📚" },
  { path: "/teacher/students",      label: "Students",      icon: "👥" },
  { path: "/teacher/assignments",   label: "Assignments",   icon: "📝" },
  { path: "/teacher/attendance",    label: "Attendance",    icon: "📋" },
  { path: "/teacher/marks",         label: "Enter Marks",   icon: "📊" },
  { path: "/teacher/lectures",      label: "Lectures",      icon: "🎬" },
  { path: "/teacher/announcements", label: "Announcements", icon: "📢" },
  { path: "/teacher/resources",     label: "Resources",     icon: "🖥️" },
];

const card = { background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 24 };
const input = { width: "100%", padding: "11px 14px", background: "rgba(30,41,59,0.8)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 8, color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const btn = (color = "#3b82f6") => ({ padding: "10px 20px", background: `linear-gradient(135deg, ${color}, ${color}99)`, border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" });

export function TeacherSubjects() {
  const [subjects, setSubjects]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [expanded, setExpanded]       = useState(null);   // subject._id being expanded
  const [studentsMap, setStudentsMap] = useState({});     // { subjectId: { loading, students } }
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"];

  useEffect(() => {
    api.get("/teacher/subjects").then(r => setSubjects(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleStudents = async (subjectId) => {
    if (expanded === subjectId) { setExpanded(null); return; }
    setExpanded(subjectId);

    // Already fetched
    if (studentsMap[subjectId]) return;

    setStudentsMap(prev => ({ ...prev, [subjectId]: { loading: true, students: [] } }));
    try {
      const res = await api.get(`/teacher/subjects/${subjectId}/students`);
      setStudentsMap(prev => ({ ...prev, [subjectId]: { loading: false, students: res.data.students || [] } }));
    } catch {
      setStudentsMap(prev => ({ ...prev, [subjectId]: { loading: false, students: [] } }));
    }
  };

  return (
    <Layout navItems={teacherNav}>
      <PageHeader title="My Subjects" subtitle={`Teaching ${subjects.length} subjects`} />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {subjects.length === 0 && <div style={{ ...card, color: "#64748b" }}>No subjects assigned.</div>}
          {subjects.map((s, i) => {
            const color      = colors[i % colors.length];
            const isExpanded = expanded === s._id;
            const subData    = studentsMap[s._id];

            return (
              <div key={s._id} style={{ ...card, padding: 0, overflow: "hidden" }}>
                {/* Subject header */}
                <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderLeft: `4px solid ${color}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📚</div>
                    <div>
                      <div style={{ color: "#e2e8f0", fontSize: 16, fontWeight: 700 }}>{s.name}</div>
                      <div style={{ color, fontSize: 13, marginTop: 3 }}>{s.code}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 700 }}>{s.students?.length || 0}</div>
                      <div style={{ color: "#64748b", fontSize: 11 }}>students</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: s.isActive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", borderRadius: 20 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.isActive ? "#10b981" : "#ef4444" }} />
                      <span style={{ color: s.isActive ? "#10b981" : "#ef4444", fontSize: 12 }}>{s.isActive ? "Active" : "Inactive"}</span>
                    </div>
                    <button onClick={() => toggleStudents(s._id)}
                      style={{
                        padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                        background: isExpanded ? `${color}22` : `${color}`,
                        border: isExpanded ? `1px solid ${color}55` : "none",
                        color: isExpanded ? color : "#fff",
                        transition: "all 0.2s",
                      }}>
                      {isExpanded ? "Hide Students ▲" : "View Students ▼"}
                    </button>
                  </div>
                </div>

                {/* Students list */}
                {isExpanded && (
                  <div style={{ borderTop: `1px solid ${color}22`, padding: "16px 24px", background: `${color}06` }}>
                    {subData?.loading && <div style={{ color: "#64748b", padding: "10px 0" }}>Loading students...</div>}
                    {!subData?.loading && subData?.students?.length === 0 && (
                      <div style={{ color: "#64748b", padding: "10px 0" }}>No students enrolled in this subject yet.</div>
                    )}
                    {!subData?.loading && subData?.students?.length > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                        {subData.students.map((st, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", color, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                              {st.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{st.name}</div>
                              <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{st.rollNumber} · {st.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
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

export function TeacherStudents() {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);   // student detail
  const [detail, setDetail]     = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTab, setDetailTab] = useState("overview"); // overview | marks | attendance | submissions

  useEffect(() => {
    api.get("/teacher/students").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const openDetail = async (studentId) => {
    setSelected(studentId);
    setDetail(null);
    setDetailTab("overview");
    setDetailLoading(true);
    try {
      const res = await api.get(`/teacher/students/${studentId}/detail`);
      setDetail(res.data);
    } catch {} finally { setDetailLoading(false); }
  };

  const filtered = data.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const overlayBg = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
  const modalBg   = { background: "#0d1628", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 20, width: "100%", maxWidth: 760, maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" };

  return (
    <Layout navItems={teacherNav}>
      <PageHeader title="Students" subtitle={`${data.length} students across your subjects`} />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search by name or email..."
            style={{ ...input, marginBottom: 16, maxWidth: 400 }} />

          <div style={card}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Student", "Email", "Action"].map(h => (
                    <th key={h} style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 16px 14px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={3} style={{ color: "#64748b", textAlign: "center", padding: 30 }}>No students found</td></tr>
                )}
                {filtered.map((s, i) => (
                  <tr key={i}>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                          {s.name?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{s.email}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <button onClick={() => openDetail(s._id)}
                        style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail Modal */}
          {selected && (
            <div style={overlayBg} onClick={() => setSelected(null)}>
              <div style={modalBg} onClick={e => e.stopPropagation()}>
                {/* Modal header */}
                <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18 }}>
                      {detail?.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <div style={{ color: "#f0f4ff", fontSize: 17, fontWeight: 700 }}>{detail?.name || "Loading..."}</div>
                      <div style={{ color: "#64748b", fontSize: 13 }}>{detail?.rollNumber} · {detail?.email}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#64748b", fontSize: 22, cursor: "pointer" }}>✕</button>
                </div>

                {detailLoading && <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div>}

                {detail && !detailLoading && (
                  <>
                    {/* Tabs */}
                    <div style={{ display: "flex", gap: 4, padding: "12px 24px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      {["overview","marks","attendance","submissions"].map(tab => (
                        <button key={tab} onClick={() => setDetailTab(tab)}
                          style={{ padding: "8px 16px", border: "none", borderRadius: "8px 8px 0 0", fontSize: 13, fontWeight: detailTab === tab ? 600 : 400, cursor: "pointer", background: detailTab === tab ? "rgba(59,130,246,0.15)" : "transparent", color: detailTab === tab ? "#60a5fa" : "#64748b", textTransform: "capitalize", borderBottom: detailTab === tab ? "2px solid #3b82f6" : "2px solid transparent" }}>
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab content */}
                    <div style={{ overflowY: "auto", padding: "20px 24px", flex: 1 }}>

                      {/* OVERVIEW */}
                      {detailTab === "overview" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                            {[
                              ["📚 Subjects", detail.subjects?.length || 0, "#3b82f6"],
                              ["📝 Submissions", detail.submissions?.length || 0, "#10b981"],
                              ["📊 Avg Marks", detail.marks?.length > 0 ? Math.round(detail.marks.reduce((s,m) => s + (m.marksObtained/m.maxMarks)*100, 0)/detail.marks.length) + "%" : "N/A", "#f59e0b"],
                            ].map(([label, val, color]) => (
                              <div key={label} style={{ padding: "14px", borderRadius: 10, background: `${color}10`, border: `1px solid ${color}25`, textAlign: "center" }}>
                                <div style={{ color: "#64748b", fontSize: 11, marginBottom: 6 }}>{label}</div>
                                <div style={{ color, fontSize: 22, fontWeight: 800 }}>{val}</div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Enrolled Subjects</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                              {detail.subjects?.map((s, i) => (
                                <span key={i} style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa", fontSize: 13 }}>{s.name}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* MARKS */}
                      {detailTab === "marks" && (
                        <div>
                          {detail.marks?.length === 0 && <div style={{ color: "#64748b", textAlign: "center", padding: 30 }}>No marks recorded yet</div>}
                          <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                              <tr>{["Subject","Exam","Obtained","Max","%"].map(h => (
                                <th key={h} style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", padding: "0 12px 12px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                              ))}</tr>
                            </thead>
                            <tbody>
                              {detail.marks?.map((m, i) => {
                                const pct = Math.round((m.marksObtained/m.maxMarks)*100);
                                const c = pct>=75?"#10b981":pct>=50?"#f59e0b":"#ef4444";
                                return (
                                  <tr key={i}>
                                    <td style={{ padding: "10px 12px", color: "#e2e8f0", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{m.subject}</td>
                                    <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}><span style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(99,102,241,0.15)", color: "#818cf8", fontSize: 11 }}>{m.examType}</span></td>
                                    <td style={{ padding: "10px 12px", color: "#f0f4ff", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{m.marksObtained}</td>
                                    <td style={{ padding: "10px 12px", color: "#64748b", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{m.maxMarks}</td>
                                    <td style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <div style={{ width: 50, height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
                                          <div style={{ height: "100%", width: `${pct}%`, background: c, borderRadius: 3 }} />
                                        </div>
                                        <span style={{ color: c, fontSize: 12, fontWeight: 700 }}>{pct}%</span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* ATTENDANCE */}
                      {detailTab === "attendance" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {detail.attendanceStats?.length === 0 && <div style={{ color: "#64748b", textAlign: "center", padding: 30 }}>No attendance records</div>}
                          {detail.attendanceStats?.map((a, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 10, background: "rgba(30,41,59,0.4)" }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{a.subject}</div>
                                <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{a.present}/{a.total} classes attended</div>
                              </div>
                              <div style={{ width: 120 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                  <span style={{ color: "#64748b", fontSize: 11 }}> </span>
                                  <span style={{ color: a.percentage >= 75 ? "#10b981" : "#ef4444", fontSize: 13, fontWeight: 700 }}>{a.percentage}%</span>
                                </div>
                                <div style={{ height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
                                  <div style={{ height: "100%", width: `${a.percentage}%`, background: a.percentage >= 75 ? "#10b981" : "#ef4444", borderRadius: 3 }} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* SUBMISSIONS */}
                      {detailTab === "submissions" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {detail.submissions?.length === 0 && <div style={{ color: "#64748b", textAlign: "center", padding: 30 }}>No submissions yet</div>}
                          {detail.submissions?.map((s, i) => (
                            <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(30,41,59,0.4)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                  <div style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{s.assignment}</div>
                                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{s.subject} · {new Date(s.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                                </div>
                                {s.marks !== null ? (
                                  <span style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 12, fontWeight: 700 }}>✓ {s.marks} marks</span>
                                ) : (
                                  <span style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(245,158,11,0.15)", color: "#f59e0b", fontSize: 12 }}>Ungraded</span>
                                )}
                              </div>
                              {s.remarks && <div style={{ color: "#475569", fontSize: 12, marginTop: 6, fontStyle: "italic" }}>"{s.remarks}"</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}

export function TeacherAssignments() {
  const [assignments, setAssignments]   = useState([]);
  const [subjects, setSubjects]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [form, setForm]                 = useState({ title: "", description: "", subjectId: "", dueDate: "", maxMarks: "" });
  const [submitting, setSubmitting]     = useState(false);
  const [viewSubs, setViewSubs]         = useState(null);  // assignmentId whose submissions are open
  const [submissions, setSubmissions]   = useState([]);
  const [subsLoading, setSubsLoading]   = useState(false);
  const [grading, setGrading]           = useState({});    // { subId: { marks, remarks } }
  const [gradingSaving, setGradingSaving] = useState(null);

  useEffect(() => {
    Promise.all([api.get("/teacher/assignments"), api.get("/teacher/subjects")])
      .then(([a, s]) => { setAssignments(a.data); setSubjects(s.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleResub = async (assignmentId, current) => {
    try {
      const res = await api.patch(`/teacher/assignments/${assignmentId}/resubmission`);
      toast.success(res.data.message);
      setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, allowResubmission: res.data.allowResubmission } : a));
    } catch {}
  };

  const handleCreate = async () => {
    if (!form.title || !form.subjectId || !form.dueDate || !form.maxMarks) { toast.error("Fill all fields"); return; }
    setSubmitting(true);
    try {
      await api.post("/teacher/assignments", form);
      toast.success("Assignment created!");
      const res = await api.get("/teacher/assignments");
      setAssignments(res.data);
      setForm({ title: "", description: "", subjectId: "", dueDate: "", maxMarks: "" });
    } catch {} finally { setSubmitting(false); }
  };

  const openSubmissions = async (assignmentId) => {
    if (viewSubs === assignmentId) { setViewSubs(null); return; }
    setViewSubs(assignmentId);
    setSubsLoading(true);
    try {
      const res = await api.get(`/teacher/submissions/${assignmentId}`);
      setSubmissions(res.data);
      const g = {};
      res.data.forEach(s => { g[s._id] = { marks: s.marks ?? "", remarks: s.remarks ?? "" }; });
      setGrading(g);
    } catch {} finally { setSubsLoading(false); }
  };

  const saveGrade = async (subId) => {
    const { marks, remarks } = grading[subId] || {};
    if (marks === "" || marks === null) { toast.error("Enter marks"); return; }
    setGradingSaving(subId);
    try {
      await api.patch(`/teacher/submissions/${subId}/grade`, { marksObtained: Number(marks), remarks });
      toast.success("Grade saved!");
      setSubmissions(prev => prev.map(s => s._id === subId ? { ...s, marks: Number(marks), remarks } : s));
    } catch {} finally { setGradingSaving(null); }
  };

  return (
    <Layout navItems={teacherNav}>
      <PageHeader title="Assignments" subtitle="Create, view submissions, and grade" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Create form */}
          <div style={card}>
            <h3 style={{ color: "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>Create New Assignment</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input style={input} placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              <select style={input} value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <input style={input} type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
              <input style={input} type="number" placeholder="Max Marks" value={form.maxMarks} onChange={e => setForm({...form, maxMarks: e.target.value})} />
              <textarea style={{ ...input, resize: "vertical", minHeight: 60, gridColumn: "1/-1" }} placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <button onClick={handleCreate} disabled={submitting} style={{ ...btn("#10b981"), gridColumn: "1/-1" }}>{submitting ? "Creating..." : "✓ Create Assignment"}</button>
            </div>
          </div>

          {/* Assignment list with submissions */}
          {assignments.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No assignments yet.</div>}
          {assignments.map(a => (
            <div key={a.id} style={{ ...card, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                  <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 15 }}>{a.title}</div>
                  <div style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>{a.subject} · Max: {a.maxMarks} · Due: {new Date(a.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(59,130,246,0.15)", color: "#60a5fa", fontSize: 13 }}>{a.submissionsCount} submitted</span>
                  <button onClick={() => openSubmissions(a.id)}
                    style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", background: viewSubs === a.id ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", border: `1px solid ${viewSubs === a.id ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)"}`, color: viewSubs === a.id ? "#ef4444" : "#10b981" }}>
                    {viewSubs === a.id ? "Close ▲" : "Grade ▼"}
                  </button>
                  <button onClick={() => toggleResub(a.id, a.allowResubmission)}
                    title="Toggle whether students can resubmit this assignment"
                    style={{ padding: "7px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: a.allowResubmission ? "rgba(99,102,241,0.15)" : "rgba(30,41,59,0.6)", border: `1px solid ${a.allowResubmission ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`, color: a.allowResubmission ? "#818cf8" : "#64748b", whiteSpace: "nowrap" }}>
                    {a.allowResubmission ? "🔄 Resub ON" : "🔒 Resub OFF"}
                  </button>
                </div>
              </div>

              {/* Submissions panel */}
              {viewSubs === a.id && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "16px 22px", background: "rgba(16,185,129,0.02)" }}>
                  {subsLoading && <div style={{ color: "#64748b", padding: "10px 0" }}>Loading submissions...</div>}
                  {!subsLoading && submissions.length === 0 && <div style={{ color: "#64748b" }}>No submissions yet.</div>}
                  {!subsLoading && submissions.map(s => (
                    <div key={s._id} style={{ marginBottom: 16, padding: 16, borderRadius: 10, background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                        <div>
                          <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>{s.student} <span style={{ color: "#64748b", fontSize: 12 }}>({s.rollNumber})</span></div>
                          <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>Submitted: {new Date(s.submittedAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                        </div>
                        {s.marks !== null && s.marks !== undefined && (
                          <span style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 13, fontWeight: 700 }}>✓ {s.marks}/{a.maxMarks}</span>
                        )}
                      </div>
                      <div style={{ background: "rgba(30,41,59,0.6)", borderRadius: 8, padding: "10px 12px", color: "#94a3b8", fontSize: 13, lineHeight: 1.6, marginBottom: 12, maxHeight: 100, overflowY: "auto", whiteSpace: "pre-wrap" }}>
                        {s.submissionText || "No submission text"}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="number" placeholder="Marks" min={0} max={a.maxMarks}
                          value={grading[s._id]?.marks ?? ""} onChange={e => setGrading(g => ({ ...g, [s._id]: { ...g[s._id], marks: e.target.value } }))}
                          style={{ ...input, width: 90, padding: "8px 10px" }} />
                        <input placeholder="Remarks (optional)"
                          value={grading[s._id]?.remarks ?? ""} onChange={e => setGrading(g => ({ ...g, [s._id]: { ...g[s._id], remarks: e.target.value } }))}
                          style={{ ...input, flex: 1, padding: "8px 10px" }} />
                        <button onClick={() => saveGrade(s._id)} disabled={gradingSaving === s._id}
                          style={{ padding: "8px 16px", background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, cursor: gradingSaving === s._id ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
                          {gradingSaving === s._id ? "..." : "Save Grade"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export function TeacherAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [closing, setClosing] = useState(false);
  const [form, setForm] = useState({ subjectId: "", timeSlot: "" });

  useEffect(() => {
    api.get("/teacher/subjects").then(r => setSubjects(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const createSession = async () => {
    if (!form.subjectId || !form.timeSlot) { toast.error("Fill all fields"); return; }
    setCreating(true);
    try {
      const res = await api.post("/teacher/attendance/session", form);
      setSession(res.data);
      toast.success("Session created!");
    } catch {} finally { setCreating(false); }
  };

  const closeSession = async () => {
    if (!session?.sessionId) return;
    setClosing(true);
    try {
      const res = await api.post(`/teacher/attendance/session/close/${session.sessionId}`);
      toast.success(`Attendance finalized! ${res.data.totalStudents} students processed.`);
      setSession(null);
    } catch {} finally { setClosing(false); }
  };

  return (
    <Layout navItems={teacherNav}>
      <PageHeader title="Attendance" subtitle="Create sessions for students to join" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={card}>
            <h3 style={{ color: "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>Create Session</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <select style={input} value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <input style={input} placeholder="Time Slot (e.g. 10:00-11:00)" value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })} />
              <button onClick={createSession} disabled={creating} style={btn("#10b981")}>{creating ? "Creating..." : "Create Session"}</button>
            </div>
          </div>

          {session && (
            <div style={{ ...card, border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.05)" }}>
              <h3 style={{ color: "#10b981", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>Active Session</h3>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 8px" }}>Share this code with students</p>
                <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "8px", color: "#10b981", fontFamily: "monospace" }}>{session.code}</div>
                <p style={{ color: "#64748b", fontSize: 12, marginTop: 8 }}>Expires: {new Date(session.expiresAt).toLocaleTimeString()}</p>
              </div>
              <button onClick={closeSession} disabled={closing} style={{ ...btn("#ef4444"), width: "100%" }}>
                {closing ? "Closing..." : "Close Session & Finalize Attendance"}
              </button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

export function TeacherMarks() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ studentId: "", subjectId: "", examType: "MST1", marksObtained: "", maxMarks: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/teacher/subjects"), api.get("/teacher/students")])
      .then(([s, st]) => { setSubjects(s.data); setStudents(st.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.post("/teacher/marks", form);
      toast.success("Marks saved successfully!");
      setForm({ studentId: "", subjectId: "", examType: "MST1", marksObtained: "", maxMarks: "" });
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <Layout navItems={teacherNav}>
      <PageHeader title="Enter Marks" subtitle="Record exam marks for students" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ maxWidth: 500 }}>
          <div style={card}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ color: "#64748b", fontSize: 12, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Student</label>
                <select style={input} value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })}>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: "#64748b", fontSize: 12, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Subject</label>
                <select style={input} value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: "#64748b", fontSize: 12, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Exam Type</label>
                <select style={input} value={form.examType} onChange={e => setForm({ ...form, examType: e.target.value })}>
                  <option value="MST1">MST1</option>
                  <option value="MST2">MST2</option>
                  <option value="FINAL">FINAL</option>
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ color: "#64748b", fontSize: 12, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Marks Obtained</label>
                  <input style={input} type="number" placeholder="e.g. 18" value={form.marksObtained} onChange={e => setForm({ ...form, marksObtained: e.target.value })} />
                </div>
                <div>
                  <label style={{ color: "#64748b", fontSize: 12, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Max Marks</label>
                  <input style={input} type="number" placeholder="e.g. 25" value={form.maxMarks} onChange={e => setForm({ ...form, maxMarks: e.target.value })} />
                </div>
              </div>
              <button onClick={handleSubmit} disabled={submitting} style={{ ...btn("#6366f1"), marginTop: 4 }}>{submitting ? "Saving..." : "Save Marks"}</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export function TeacherLectures() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", subjectId: "", resourceUrl: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/teacher/subjects").then(r => setSubjects(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.subjectId) { toast.error("Fill required fields"); return; }
    setSubmitting(true);
    try {
      await api.post("/teacher/lectures", form);
      toast.success("Lecture uploaded!");
      setForm({ title: "", description: "", subjectId: "", resourceUrl: "" });
    } catch {} finally { setSubmitting(false); }
  };

  return (
    <Layout navItems={teacherNav}>
      <PageHeader title="Upload Lecture" subtitle="Add lecture resources for students" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ maxWidth: 500 }}>
          <div style={card}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input style={input} placeholder="Lecture Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <textarea style={{ ...input, minHeight: 80, resize: "vertical" }} placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <select style={input} value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
                <option value="">Select Subject *</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <input style={input} placeholder="Resource URL (optional)" value={form.resourceUrl} onChange={e => setForm({ ...form, resourceUrl: e.target.value })} />
              <button onClick={handleSubmit} disabled={submitting} style={btn("#f59e0b")}>{submitting ? "Uploading..." : "Upload Lecture"}</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export function TeacherResources() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = () => {
    api.get("/teacher/resources").then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchResources(); }, []);

  const allocate = async (id) => {
    try {
      await api.post(`/teacher/resources/${id}/allocate`);
      toast.success("Resource allocated!");
      fetchResources();
    } catch {}
  };

  const release = async (id) => {
    try {
      await api.post(`/teacher/resources/${id}/release`);
      toast.success("Resource released!");
      fetchResources();
    } catch {}
  };

  const typeIcon = { Hardware: "🖥️", Software: "💿", Room: "🏫" };

  return (
    <Layout navItems={teacherNav}>
      <PageHeader title="Resources" subtitle="Manage classroom resources" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {data.length === 0 && <div style={{ ...card, color: "#64748b" }}>No resources found.</div>}
          {data.map((r) => (
            <div key={r._id} style={card}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{typeIcon[r.type] || "📦"}</div>
              <div style={{ color: "#e2e8f0", fontSize: 15, fontWeight: 600 }}>{r.name}</div>
              <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{r.type}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, marginBottom: 14 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.status === "Available" ? "#10b981" : "#f59e0b" }} />
                <span style={{ color: r.status === "Available" ? "#10b981" : "#f59e0b", fontSize: 13 }}>{r.status}</span>
                {r.allocatedToMe && <span style={{ color: "#64748b", fontSize: 12 }}>(yours)</span>}
              </div>
              {r.status === "Available"
                ? <button onClick={() => allocate(r._id)} style={{ ...btn("#10b981"), fontSize: 13, padding: "8px 16px" }}>Allocate</button>
                : r.allocatedToMe
                  ? <button onClick={() => release(r._id)} style={{ ...btn("#ef4444"), fontSize: 13, padding: "8px 16px" }}>Release</button>
                  : <span style={{ color: "#475569", fontSize: 13 }}>Allocated to another</span>
              }
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

/* ─── ANNOUNCEMENTS ──────────────────────────────────── */
export function TeacherAnnouncements() {
  const [anns, setAnns]         = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ title: "", content: "", subjectId: "" });
  const [posting, setPosting]   = useState(false);

  const fetchAll = () =>
    Promise.all([api.get("/teacher/announcements"), api.get("/teacher/subjects")])
      .then(([a, s]) => { setAnns(a.data); setSubjects(s.data); })
      .catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchAll(); }, []);

  const handlePost = async () => {
    if (!form.title || !form.content || !form.subjectId) { toast.error("Fill all fields"); return; }
    setPosting(true);
    try {
      await api.post("/teacher/announcements", form);
      toast.success("Announcement posted!");
      setForm({ title: "", content: "", subjectId: "" });
      fetchAll();
    } catch {} finally { setPosting(false); }
  };

  const handleDelete = async (id) => {
    await api.delete(`/teacher/announcements/${id}`).catch(() => {});
    toast.success("Deleted");
    setAnns(prev => prev.filter(a => a._id !== id));
  };

  return (
    <Layout navItems={teacherNav}>
      <PageHeader title="Announcements" subtitle="Post subject-wise updates to your students" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}>
          {/* Post form */}
          <div style={card}>
            <h3 style={{ color: "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>Post Announcement</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input style={input} placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              <select style={input} value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <textarea rows={5} style={{ ...input, resize: "vertical" }} placeholder="Write your announcement..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
              <button onClick={handlePost} disabled={posting} style={btn("#6366f1")}>{posting ? "Posting..." : "📢 Post Announcement"}</button>
            </div>
          </div>

          {/* Announcements list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {anns.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No announcements posted yet.</div>}
            {anns.map(a => (
              <div key={a._id} style={{ ...card, padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 15 }}>{a.title}</div>
                    <div style={{ color: "#6366f1", fontSize: 12, marginTop: 3 }}>📚 {a.subject?.name} · {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                  <button onClick={() => handleDelete(a._id)}
                    style={{ padding: "5px 12px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#ef4444", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>
                    🗑 Delete
                  </button>
                </div>
                <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}

/* ─── TEACHER ALERTS ─────────────────────────────────── */
export function TeacherAlerts() {
  const [alerts, setAlerts]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState({ message: "", level: "Info", targetRole: "student" });
  const [posting, setPosting]   = useState(false);

  const fetchAlerts = () =>
    api.get("/teacher/alerts").then(r => setAlerts(r.data)).catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { fetchAlerts(); }, []);

  const handlePost = async () => {
    if (!form.message.trim()) { toast.error("Message cannot be empty"); return; }
    setPosting(true);
    try {
      await api.post("/teacher/alerts", form);
      toast.success("Alert broadcast!");
      setForm({ message: "", level: "Info", targetRole: "student" });
      fetchAlerts();
    } catch {} finally { setPosting(false); }
  };

  const levelConfig = {
    Emergency: { icon: "🚨", color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.3)"  },
    Warning:   { icon: "⚠️", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)" },
    Info:      { icon: "ℹ️", color: "#3b82f6", bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.3)" },
  };

  return (
    <Layout navItems={teacherNav}>
      <PageHeader title="Broadcast Alerts" subtitle="Send important notices to students or all users" />
      {loading ? <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 20, alignItems: "start" }}>
          {/* Create form */}
          <div style={card}>
            <h3 style={{ color: "#94a3b8", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 18px" }}>New Alert</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Level</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                  {["Info","Warning","Emergency"].map(l => {
                    const cfg = levelConfig[l];
                    return (
                      <button key={l} onClick={() => setForm(f => ({...f, level: l}))}
                        style={{ padding: "8px 4px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `2px solid ${form.level === l ? cfg.color : "rgba(255,255,255,0.08)"}`, background: form.level === l ? cfg.bg : "rgba(30,41,59,0.5)", color: form.level === l ? cfg.color : "#64748b" }}>
                        {cfg.icon} {l}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Send To</label>
                <select style={input} value={form.targetRole} onChange={e => setForm(f => ({...f, targetRole: e.target.value}))}>
                  <option value="student">Students Only</option>
                  <option value="teacher">Teachers Only</option>
                  <option value="all">Everyone</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Message</label>
                <textarea rows={4} style={{ ...input, resize: "vertical" }} placeholder="Write your alert message..." value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} />
              </div>
              <button onClick={handlePost} disabled={posting}
                style={{ padding: "12px", background: posting ? "rgba(239,68,68,0.4)" : "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: posting ? "not-allowed" : "pointer" }}>
                {posting ? "Broadcasting..." : "🚨 Broadcast Alert"}
              </button>
            </div>
          </div>

          {/* Alerts list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alerts.length === 0 && <div style={{ ...card, color: "#64748b", textAlign: "center" }}>No alerts yet.</div>}
            {alerts.map((a, i) => {
              const cfg = levelConfig[a.level] || levelConfig.Info;
              return (
                <div key={i} style={{ padding: "16px 20px", borderRadius: 12, background: cfg.bg, border: `1px solid ${cfg.border}`, display: "flex", gap: 14 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{cfg.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color: cfg.color, fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>{a.level}</span>
                        <span style={{ padding: "1px 7px", borderRadius: 20, background: "rgba(255,255,255,0.07)", color: "#64748b", fontSize: 11 }}>→ {a.targetRole}</span>
                      </div>
                      <span style={{ color: "#475569", fontSize: 12 }}>{new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <p style={{ color: "#e2e8f0", margin: 0, fontSize: 14, lineHeight: 1.6 }}>{a.message}</p>
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
