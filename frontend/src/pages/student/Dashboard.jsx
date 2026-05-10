import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import StatCard from "../../components/StatCard";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";

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

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/dashboard").then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour<12?"Good Morning":hour<17?"Good Afternoon":"Good Evening";
  const attColor = data?.attendancePercentage >= 75 ? "#10b981" : "#ef4444";

  return (
    <Layout navItems={navItems}>
      <PageHeader title={`${greeting}, ${user?.name?.split(" ")[0]} 👋`} subtitle="Here's your academic overview for today" />
      {loading ? (
        <div style={{ color:"#94a3b8", textAlign:"center", padding:60 }}>Loading dashboard...</div>
      ) : (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:14, marginBottom:24 }}>
            <StatCard icon="" label="Enrolled Subjects" value={data?.subjects} color="#4f46e5" />
            <StatCard icon="" label="Attendance" value={`${data?.attendancePercentage}%`} color={attColor} sub={data?.attendancePercentage < 75 ? " Below 75% threshold" : "On track"} />
            <StatCard icon="" label="Pending Assignments" value={data?.pendingAssignments} color="#f59e0b" />
            <StatCard icon="" label="Average Marks" value={`${data?.averageMarks}%`} color="#6366f1" />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
            {/* Attendance Gauge */}
            <div style={card}>
              <h3 style={{ color:"#64748b", fontSize:12, textTransform:"uppercase", letterSpacing:"0.8px", margin:"0 0 14px", fontWeight:600 }}>Attendance Gauge</h3>
              <div style={{ height:200, position:"relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="70%" innerRadius="60%" outerRadius="100%" startAngle={180} endAngle={0}
                    data={[{ value:data?.attendancePercentage||0, fill:attColor }]}>
                    <RadialBar dataKey="value" cornerRadius={6} background={{ fill:"#f1f5f9" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div style={{ position:"absolute", bottom:20, left:"50%", transform:"translateX(-50%)", textAlign:"center" }}>
                  <div style={{ color:"#0f172a", fontSize:34, fontWeight:700, lineHeight:1 }}>{data?.attendancePercentage}%</div>
                  <div style={{ color:"#94a3b8", fontSize:12, marginTop:3 }}>Overall</div>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div style={card}>
              <h3 style={{ color:"#64748b", fontSize:12, textTransform:"uppercase", letterSpacing:"0.8px", margin:"0 0 14px", fontWeight:600 }}>Recent Alerts</h3>
              {data?.alerts?.length === 0 && <p style={{ color:"#94a3b8", fontSize:13 }}>No active alerts.</p>}
              {data?.alerts?.map((a, i) => {
                const cfg = { Emergency:{bg:"#fef2f2",border:"#fecaca",color:"#ef4444",icon:""}, Warning:{bg:"#fffbeb",border:"#fde68a",color:"#f59e0b",icon:""}, Info:{bg:"#eff6ff",border:"#bfdbfe",color:"#3b82f6",icon:""} }[a.level] || { bg:"#f8fafc",border:"#e2e8f0",color:"#64748b",icon:"" };
                return (
                  <div key={i} style={{ padding:"10px 13px", borderRadius:9, marginBottom:8, background:cfg.bg, border:`1px solid ${cfg.border}`, display:"flex", alignItems:"flex-start", gap:9 }}>
                    <span style={{ flexShrink:0 }}>{cfg.icon}</span>
                    <p style={{ color:"#1e293b", fontSize:13, margin:0, lineHeight:1.5 }}>{a.message}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
