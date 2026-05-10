import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";

const navItems = [
  { path:"/student",              label:"Dashboard",      },
  { path:"/student/attendance",   label:"Attendance",     },
  { path:"/student/assignments",  label:"Assignments",    },
  { path:"/student/marks",        label:"Marks",          },
  { path:"/student/timetable",    label:"Timetable",      },
  { path:"/student/lectures",     label:"Lectures",       },
  { path:"/student/subjects",     label:"Subjects",       },
  { path:"/student/announcements",label:"Announcements",  },
  { path:"/student/alerts",       label:"Alerts",         },
  { path:"/student/profile",      label:"Profile",        },
  { path:"/student/chat",          label:"SmartBot",      },
];

const card = { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:24 };

export default function StudentAttendance() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [code, setCode]       = useState("");

  useEffect(() => {
    api.get("/student/attendance").then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const joinSession = async () => {
    if (!code.trim()) { toast.error("Enter a session code"); return; }
    setJoining(true);
    try {
      const res = await api.post("/student/attendance/join", { code:code.toUpperCase() });
      toast.success(res.data.message || "Attendance marked as Present!");
      setCode("");
    } catch {} finally { setJoining(false); }
  };

  const overall = data?.overallPercentage ?? 0;
  const safe = overall >= 75;

  return (
    <Layout navItems={navItems}>
      <PageHeader title="Attendance" subtitle="Track your attendance across all subjects" />
      {loading ? (
        <div style={{ color:"#94a3b8", textAlign:"center", padding:60 }}>Loading...</div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
            {/* Overall % */}
            <div style={card}>
              <p style={{ color:"#64748b", fontSize:12, textTransform:"uppercase", letterSpacing:"0.8px", margin:"0 0 10px", fontWeight:600 }}>Overall Attendance</p>
              <div style={{ fontSize:52, fontWeight:800, letterSpacing:"-2px", color:safe?"#10b981":"#ef4444", lineHeight:1 }}>{overall}%</div>
              {!safe && (
                <div style={{ marginTop:12, padding:"8px 12px", background:"#fef2f2", borderRadius:8, border:"1px solid #fecaca", color:"#ef4444", fontSize:13 }}>
                   Below 75% — Risk of detention
                </div>
              )}
              {safe && <div style={{ color:"#10b981", fontSize:13, marginTop:10 }}> You're on track</div>}
            </div>

            {/* Join Session */}
            <div style={card}>
              <p style={{ color:"#64748b", fontSize:12, textTransform:"uppercase", letterSpacing:"0.8px", margin:"0 0 10px", fontWeight:600 }}>Join Live Session</p>
              <p style={{ color:"#94a3b8", fontSize:13, margin:"0 0 14px", lineHeight:1.6 }}>Enter the 4-digit code given by your teacher to mark attendance.</p>
              <div style={{ display:"flex", gap:10 }}>
                <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="CODE" maxLength={6}
                  style={{ flex:1, padding:"10px 13px", background:"#f8f9fb", border:"1px solid #e2e8f0", borderRadius:8, color:"#0f172a", fontSize:18, outline:"none", letterSpacing:"6px", fontFamily:"monospace", textTransform:"uppercase" }}
                  onFocus={e=>e.target.style.borderColor="#4f46e5"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}
                  onKeyDown={e => e.key==="Enter" && joinSession()} />
                <button onClick={joinSession} disabled={joining}
                  style={{ padding:"10px 18px", background:joining?"#c7d2fe":"#4f46e5", border:"none", borderRadius:8, color:"#fff", fontSize:13.5, fontWeight:600, cursor:joining?"not-allowed":"pointer", whiteSpace:"nowrap" }}>
                  {joining ? "Joining..." : "Mark Present"}
                </button>
              </div>
            </div>
          </div>

          {/* Subject-wise chart + table */}
          {data?.subjectWise?.length > 0 && (
            <div style={card}>
              <p style={{ color:"#64748b", fontSize:12, textTransform:"uppercase", letterSpacing:"0.8px", margin:"0 0 18px", fontWeight:600 }}>Subject-wise Attendance</p>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={data.subjectWise} barSize={44}>
                  <XAxis dataKey="subject" tick={{ fill:"#94a3b8", fontSize:12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0,100]} tick={{ fill:"#94a3b8", fontSize:12 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip contentStyle={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, color:"#1e293b", fontSize:13 }} formatter={v=>[`${v}%`,"Attendance"]} />
                  <Bar dataKey="percentage" radius={[5,5,0,0]}>
                    {data.subjectWise.map((e,i) => <Cell key={i} fill={e.percentage>=75?"#10b981":"#ef4444"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <table style={{ width:"100%", borderCollapse:"collapse", marginTop:18 }}>
                <thead>
                  <tr>
                    {["Subject","Attendance %","Status"].map(h => (
                      <th key={h} style={{ color:"#94a3b8", fontSize:11, textTransform:"uppercase", letterSpacing:"0.8px", padding:"0 14px 10px", textAlign:"left", borderBottom:"1px solid #f1f5f9", fontWeight:600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.subjectWise.map((s,i) => (
                    <tr key={i}>
                      <td style={{ padding:"11px 14px", color:"#1e293b", fontSize:13.5, borderBottom:"1px solid #f8f9fb" }}>{s.subject}</td>
                      <td style={{ padding:"11px 14px", borderBottom:"1px solid #f8f9fb" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ flex:1, height:5, background:"#f1f5f9", borderRadius:3 }}>
                            <div style={{ height:"100%", width:`${s.percentage}%`, borderRadius:3, background:s.percentage>=75?"#10b981":"#ef4444" }} />
                          </div>
                          <span style={{ color:s.percentage>=75?"#10b981":"#ef4444", fontSize:13, fontWeight:700, minWidth:42 }}>{s.percentage}%</span>
                        </div>
                      </td>
                      <td style={{ padding:"11px 14px", borderBottom:"1px solid #f8f9fb" }}>
                        <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11.5, fontWeight:600, background:s.percentage>=75?"#f0fdf4":"#fef2f2", color:s.percentage>=75?"#10b981":"#ef4444", border:`1px solid ${s.percentage>=75?"#bbf7d0":"#fecaca"}` }}>
                          {s.percentage>=75?" Safe":" At Risk"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {data?.subjectWise?.length === 0 && <div style={{ ...card, textAlign:"center", color:"#94a3b8" }}>No attendance records yet.</div>}
        </div>
      )}
    </Layout>
  );
}
