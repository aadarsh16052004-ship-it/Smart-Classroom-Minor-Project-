// import { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
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

// const card = {
//   background: "rgba(15,23,42,0.9)",
//   border: "1px solid rgba(255,255,255,0.07)",
//   borderRadius: 16, padding: 24,
// };

// export default function StudentAttendance() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [joining, setJoining] = useState(false);
//   const [code, setCode] = useState("");

//   useEffect(() => {
//     api.get("/student/attendance")
//       .then(r => setData(r.data))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const joinSession = async () => {
//     if (!code.trim()) { toast.error("Enter a session code"); return; }
//     setJoining(true);
//     try {
//       const res = await api.post("/student/attendance/join", { code: code.toUpperCase() });
//       toast.success(res.data.message || "Attendance marked as Present!");
//       setCode("");
//     } catch {
//       // error toast handled by axios interceptor
//     } finally {
//       setJoining(false);
//     }
//   };

//   return (
//     <Layout navItems={navItems}>
//       <PageHeader title="Attendance" subtitle="Track your attendance across all subjects" />

//       {loading ? (
//         <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

//           {/* Overall % + Join Session */}
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
//             <div style={card}>
//               <p style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 10px" }}>
//                 Overall Attendance
//               </p>
//               <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-2px", color: (data?.overallPercentage ?? 0) >= 75 ? "#10b981" : "#ef4444" }}>
//                 {data?.overallPercentage ?? 0}%
//               </div>
//               {(data?.overallPercentage ?? 0) < 75 && (
//                 <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(239,68,68,0.1)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 13 }}>
//                   ⚠️ Below 75% — Risk of detention
//                 </div>
//               )}
//             </div>

//             <div style={card}>
//               <p style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 16px" }}>
//                 Join Live Session
//               </p>
//               <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 12px" }}>
//                 Enter the code given by your teacher to mark attendance.
//               </p>
//               <div style={{ display: "flex", gap: 10 }}>
//                 <input
//                   value={code}
//                   onChange={e => setCode(e.target.value.toUpperCase())}
//                   placeholder="e.g. ABC123"
//                   maxLength={6}
//                   style={{
//                     flex: 1, padding: "11px 14px",
//                     background: "rgba(30,41,59,0.8)",
//                     border: "1px solid rgba(59,130,246,0.3)",
//                     borderRadius: 8, color: "#e2e8f0",
//                     fontSize: 16, outline: "none",
//                     letterSpacing: "4px", fontFamily: "monospace",
//                     textTransform: "uppercase",
//                   }}
//                   onKeyDown={e => e.key === "Enter" && joinSession()}
//                 />
//                 <button
//                   onClick={joinSession}
//                   disabled={joining}
//                   style={{
//                     padding: "11px 20px",
//                     background: joining ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg, #3b82f6, #6366f1)",
//                     border: "none", borderRadius: 8, color: "#fff",
//                     fontSize: 14, fontWeight: 600,
//                     cursor: joining ? "not-allowed" : "pointer",
//                     whiteSpace: "nowrap",
//                   }}>
//                   {joining ? "Joining..." : "Mark Present"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Subject-wise bar chart */}
//           {data?.subjectWise?.length > 0 && (
//             <div style={card}>
//               <p style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 20px" }}>
//                 Subject-wise Attendance
//               </p>
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={data.subjectWise} barSize={50}>
//                   <XAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
//                   <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
//                   <Tooltip
//                     contentStyle={{ background: "#0f172a", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, color: "#e2e8f0" }}
//                     formatter={v => [`${v}%`, "Attendance"]}
//                   />
//                   <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
//                     {data.subjectWise.map((entry, i) => (
//                       <Cell key={i} fill={entry.percentage >= 75 ? "#10b981" : "#ef4444"} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>

//               {/* Table below chart */}
//               <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
//                 <thead>
//                   <tr>
//                     {["Subject", "Attendance %", "Status"].map(h => (
//                       <th key={h} style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 16px 12px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.subjectWise.map((s, i) => (
//                     <tr key={i}>
//                       <td style={{ padding: "12px 16px", color: "#e2e8f0", fontSize: 14, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{s.subject}</td>
//                       <td style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
//                         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                           <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
//                             <div style={{ height: "100%", width: `${s.percentage}%`, borderRadius: 3, background: s.percentage >= 75 ? "#10b981" : "#ef4444" }} />
//                           </div>
//                           <span style={{ color: s.percentage >= 75 ? "#10b981" : "#ef4444", fontSize: 14, fontWeight: 700, minWidth: 45 }}>{s.percentage}%</span>
//                         </div>
//                       </td>
//                       <td style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
//                         <span style={{
//                           padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
//                           background: s.percentage >= 75 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
//                           color: s.percentage >= 75 ? "#10b981" : "#ef4444",
//                         }}>
//                           {s.percentage >= 75 ? "✓ Safe" : "⚠ At Risk"}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {data?.subjectWise?.length === 0 && (
//             <div style={{ ...card, textAlign: "center", color: "#64748b" }}>
//               No attendance records found yet.
//             </div>
//           )}

//         </div>
//       )}
//     </Layout>
//   );
// }


import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
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

const card = {
  background: "rgba(15,23,42,0.9)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 16, padding: 24,
};

export default function StudentAttendance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    api.get("/student/attendance")
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const joinSession = async () => {
    if (!code.trim()) { toast.error("Enter a session code"); return; }
    setJoining(true);
    try {
      const res = await api.post("/student/attendance/join", { code: code.toUpperCase() });
      toast.success(res.data.message || "Attendance marked as Present!");
      setCode("");
    } catch {
      // error toast handled by axios interceptor
    } finally {
      setJoining(false);
    }
  };

  return (
    <Layout navItems={navItems}>
      <PageHeader title="Attendance" subtitle="Track your attendance across all subjects" />

      {loading ? (
        <div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Overall % + Join Session */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={card}>
              <p style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 10px" }}>
                Overall Attendance
              </p>
              <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-2px", color: (data?.overallPercentage ?? 0) >= 75 ? "#10b981" : "#ef4444" }}>
                {data?.overallPercentage ?? 0}%
              </div>
              {(data?.overallPercentage ?? 0) < 75 && (
                <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(239,68,68,0.1)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 13 }}>
                  ⚠️ Below 75% — Risk of detention
                </div>
              )}
            </div>

            <div style={card}>
              <p style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 16px" }}>
                Join Live Session
              </p>
              <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 12px" }}>
                Enter the code given by your teacher to mark attendance.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ABC123"
                  maxLength={6}
                  style={{
                    flex: 1, padding: "11px 14px",
                    background: "rgba(30,41,59,0.8)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    borderRadius: 8, color: "#e2e8f0",
                    fontSize: 16, outline: "none",
                    letterSpacing: "4px", fontFamily: "monospace",
                    textTransform: "uppercase",
                  }}
                  onKeyDown={e => e.key === "Enter" && joinSession()}
                />
                <button
                  onClick={joinSession}
                  disabled={joining}
                  style={{
                    padding: "11px 20px",
                    background: joining ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg, #3b82f6, #6366f1)",
                    border: "none", borderRadius: 8, color: "#fff",
                    fontSize: 14, fontWeight: 600,
                    cursor: joining ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                  }}>
                  {joining ? "Joining..." : "Mark Present"}
                </button>
              </div>
            </div>
          </div>

          {/* Subject-wise bar chart */}
          {data?.subjectWise?.length > 0 && (
            <div style={card}>
              <p style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 20px" }}>
                Subject-wise Attendance
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.subjectWise} barSize={50}>
                  <XAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 8, color: "#e2e8f0" }}
                    formatter={v => [`${v}%`, "Attendance"]}
                  />
                  <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                    {data.subjectWise.map((entry, i) => (
                      <Cell key={i} fill={entry.percentage >= 75 ? "#10b981" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Table below chart */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
                <thead>
                  <tr>
                    {["Subject", "Attendance %", "Status"].map(h => (
                      <th key={h} style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 16px 12px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.subjectWise.map((s, i) => (
                    <tr key={i}>
                      <td style={{ padding: "12px 16px", color: "#e2e8f0", fontSize: 14, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{s.subject}</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.07)", borderRadius: 3 }}>
                            <div style={{ height: "100%", width: `${s.percentage}%`, borderRadius: 3, background: s.percentage >= 75 ? "#10b981" : "#ef4444" }} />
                          </div>
                          <span style={{ color: s.percentage >= 75 ? "#10b981" : "#ef4444", fontSize: 14, fontWeight: 700, minWidth: 45 }}>{s.percentage}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: s.percentage >= 75 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                          color: s.percentage >= 75 ? "#10b981" : "#ef4444",
                        }}>
                          {s.percentage >= 75 ? "✓ Safe" : "⚠ At Risk"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data?.subjectWise?.length === 0 && (
            <div style={{ ...card, textAlign: "center", color: "#64748b" }}>
              No attendance records found yet.
            </div>
          )}

        </div>
      )}
    </Layout>
  );
}
