import { useEffect, useState } from "react";
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
  { path:"/student/chat",          label:"SmartBot",       },
];

export default function StudentAnnouncements() {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get("/student/announcements").then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  return (
    <Layout navItems={navItems}>
      <PageHeader title="Announcements" subtitle={`${data.length} announcements`} />
      {loading ? <div style={{ color:"#94a3b8", textAlign:"center", padding:60 }}>Loading...</div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {data.length===0 && <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:24, textAlign:"center", color:"#94a3b8" }}>No announcements yet.</div>}
          {data.map((ann, i) => {
            const isOpen = expanded===i;
            return (
              <div key={i} style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, overflow:"hidden" }}>
                <div style={{ padding:"15px 20px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:14, cursor:"pointer" }}
                  onClick={() => setExpanded(isOpen?null:i)}>
                  <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div>
                      <div style={{ color:"#0f172a", fontSize:14.5, fontWeight:600 }}>{ann.title}</div>
                      <div style={{ color:"#94a3b8", fontSize:12, marginTop:2 }}>
                        {ann.postedBy?.name||"Staff"} · {new Date(ann.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                      </div>
                    </div>
                  </div>
                  <span style={{ color:"#94a3b8", fontSize:18, flexShrink:0, marginTop:2 }}>{isOpen?"▲":"▼"}</span>
                </div>
                {isOpen && (
                  <div style={{ padding:"0 20px 18px 20px", borderTop:"1px solid #f1f5f9" }}>
                    <p style={{ color:"#475569", fontSize:13.5, lineHeight:1.7, margin:"14px 0 0" }}>{ann.content}</p>
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
