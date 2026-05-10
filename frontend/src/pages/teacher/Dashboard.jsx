import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import StatCard from "../../components/StatCard";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";

export const teacherNav = [
  { path:"/teacher",               label:"Dashboard",      },
  { path:"/teacher/subjects",      label:"Subjects",       },
  { path:"/teacher/students",      label:"Students",       },
  { path:"/teacher/assignments",   label:"Assignments",    },
  { path:"/teacher/attendance",    label:"Attendance",     },
  { path:"/teacher/marks",         label:"Enter Marks",    },
  { path:"/teacher/lectures",      label:"Lectures",       },
  { path:"/teacher/announcements", label:"Announcements",  },
  { path:"/teacher/resources",     label:"Resources",      },
  { path:"/teacher/alerts",        label:"Alerts",         },
];

const card = { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:22 };

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/teacher/dashboard").then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); }, []);
  const hour = new Date().getHours();
  const greeting = hour<12?"Good Morning":hour<17?"Good Afternoon":"Good Evening";
  return (
    <Layout navItems={teacherNav}>
      <PageHeader title={`${greeting}, ${user?.name?.split(" ")[0]} `} subtitle="Your teaching overview for today" />
      {loading ? <div style={{ color:"#94a3b8", textAlign:"center", padding:60 }}>Loading...</div> : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))", gap:13, marginBottom:22 }}>
            <StatCard icon="" label="Subjects Teaching" value={data?.subjectsTeaching} color="#10b981" />
            <StatCard icon="" label="Total Students"    value={data?.totalStudents}    color="#4f46e5" />
            <StatCard icon="" label="Assignments"       value={data?.assignmentsIssued} color="#f59e0b" />
            <StatCard icon="" label="Pending Grading"   value={data?.pendingGrading}   color="#ef4444" sub={data?.pendingGrading>0?"Need attention":"All graded ✓"} />
            <StatCard icon="" label="Lectures"          value={data?.lecturesUploaded} color="#6366f1" />
            <StatCard icon="" label="Announcements"     value={data?.announcementsCount} color="#ec4899" />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:18, marginBottom:18 }}>
            <div style={card}>
              <h3 style={{ color:"#64748b", fontSize:12, textTransform:"uppercase", letterSpacing:"0.8px", margin:"0 0 16px", fontWeight:600 }}>Students per Subject</h3>
              {data?.subjectStats?.length>0 ? (
                <ResponsiveContainer width="100%" height={175}>
                  <BarChart data={data.subjectStats} barSize={36}>
                    <XAxis dataKey="code" tick={{ fill:"#94a3b8", fontSize:12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:"#94a3b8", fontSize:11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, color:"#1e293b", fontSize:13 }} formatter={v=>[v,"Students"]} />
                    <Bar dataKey="studentCount" radius={[5,5,0,0]}>
                      {data.subjectStats.map((_,i) => <Cell key={i} fill={["#10b981","#4f46e5","#f59e0b","#6366f1"][i%4]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <div style={{ color:"#94a3b8", textAlign:"center", padding:40, fontSize:13 }}>No subjects assigned yet</div>}
            </div>
            <div style={card}>
              <h3 style={{ color:"#64748b", fontSize:12, textTransform:"uppercase", letterSpacing:"0.8px", margin:"0 0 14px", fontWeight:600 }}>Today's Sessions</h3>
              {data?.todaySessions?.length===0 && <div style={{ color:"#94a3b8", fontSize:13, textAlign:"center", padding:28 }}>No sessions today</div>}
              {data?.todaySessions?.map((s,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #f8f9fb" }}>
                  <div>
                    <div style={{ color:"#1e293b", fontSize:13.5, fontWeight:600 }}>{s.subject}</div>
                    <div style={{ color:"#94a3b8", fontSize:12, marginTop:2 }}>Code: <span style={{ color:"#10b981", fontFamily:"monospace", letterSpacing:"2px" }}>{s.code}</span></div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color:"#4f46e5", fontSize:13, fontWeight:600 }}>{s.joinedCount} joined</div>
                    <span style={{ padding:"2px 8px", borderRadius:20, fontSize:11, background:s.isActive?"#f0fdf4":"#f8fafc", color:s.isActive?"#10b981":"#94a3b8", border:`1px solid ${s.isActive?"#bbf7d0":"#e2e8f0"}` }}>
                      {s.isActive?"● Live":"Closed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h3 style={{ color:"#64748b", fontSize:12, textTransform:"uppercase", letterSpacing:"0.8px", margin:0, fontWeight:600 }}>Recent Submissions</h3>
              <button onClick={()=>navigate("/teacher/assignments")} style={{ background:"none", border:"none", color:"#4f46e5", fontSize:13, cursor:"pointer" }}>View All →</button>
            </div>
            {data?.recentSubmissions?.length===0 && <div style={{ color:"#94a3b8", fontSize:13, textAlign:"center", padding:20 }}>No submissions yet</div>}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {data?.recentSubmissions?.map((s,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 13px", borderRadius:9, background:"#f8f9fb" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:"#4f46e5", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:13 }}>
                      {s.studentName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color:"#1e293b", fontSize:13, fontWeight:600 }}>{s.studentName}</div>
                      <div style={{ color:"#94a3b8", fontSize:12 }}>{s.assignmentTitle}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <span style={{ padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:600, background:s.graded?"#f0fdf4":"#fffbeb", color:s.graded?"#10b981":"#f59e0b", border:`1px solid ${s.graded?"#bbf7d0":"#fde68a"}` }}>
                      {s.graded?"✓ Graded":"Pending"}
                    </span>
                    <div style={{ color:"#94a3b8", fontSize:11, marginTop:3 }}>{new Date(s.submittedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
