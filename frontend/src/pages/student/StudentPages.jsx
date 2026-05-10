import { useEffect, useState } from "react";
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
  { path:"/student/chat",          label:"SmartBot",       },
];

const card = { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:24 };
const inp  = { width:"100%", padding:"10px 13px", background:"#f8f9fb", border:"1px solid #e2e8f0", borderRadius:8, color:"#1e293b", fontSize:13.5, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };
const btn  = (c="#4f46e5",dis=false) => ({ padding:"9px 20px", background:dis?`${c}88`:c, border:"none", borderRadius:8, color:"#fff", fontSize:13.5, fontWeight:600, cursor:dis?"not-allowed":"pointer" });
const chip = (active,c="#4f46e5") => ({ padding:"6px 16px", borderRadius:8, fontSize:13, fontWeight:active?600:400, cursor:"pointer", background:active?c:"#fff", border:`1px solid ${active?c:"#e2e8f0"}`, color:active?"#fff":"#64748b" });

/* ─── ASSIGNMENTS ───────────────────────────────────────── */
export function StudentAssignments() {
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [texts, setTexts]       = useState({});
  const [expanded, setExpanded] = useState(null);

  const fetch = () => api.get("/student/assignments").then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (id) => {
    if (!(texts[id]||"").trim()) { toast.error("Write your answer first"); return; }
    setSubmitting(id);
    try {
      const res = await api.post("/student/assignments/submit", { assignmentId:id, submissionText:texts[id] });
      toast.success(res.data.message || "Submitted!");
      setExpanded(null); setTexts(p=>({...p,[id]:""})); fetch();
    } catch {} finally { setSubmitting(null); }
  };

  const pending   = data.filter(a=>a.status==="Pending").length;
  const submitted = data.filter(a=>a.status!=="Pending").length;

  return (
    <Layout navItems={navItems}>
      <PageHeader title="Assignments" subtitle={`${pending} pending · ${submitted} submitted`} />
      {loading ? <div style={{ color:"#94a3b8", textAlign:"center", padding:60 }}>Loading...</div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {data.length===0 && <div style={{ ...card, textAlign:"center", color:"#94a3b8" }}>No assignments found.</div>}
          {data.map(a => {
            const isPending = a.status==="Pending";
            const overdue   = isPending && new Date(a.dueDate)<new Date();
            const isOpen    = expanded===a.assignmentId;
            return (
              <div key={a.assignmentId} style={{ ...card, padding:0, overflow:"hidden" }}>
                <div style={{ padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:14 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div>
                      <div style={{ color:"#0f172a", fontSize:14.5, fontWeight:600 }}>{a.title}</div>
                      <div style={{ color:"#64748b", fontSize:12.5, marginTop:2 }}>{a.subject} · Max: {a.maxMarks} marks</div>
                      <div style={{ color:overdue?"#ef4444":"#94a3b8", fontSize:12, marginTop:2 }}>
                        {overdue?" Overdue · ":" Due: "}{new Date(a.dueDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                    <span style={{ padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:600, background:isPending?"#fffbeb":"#f0fdf4", color:isPending?"#f59e0b":"#10b981", border:`1px solid ${isPending?"#fde68a":"#bbf7d0"}` }}>{a.status}</span>
                    {(isPending || a.allowResubmission) && (
                      <button onClick={()=>setExpanded(isOpen?null:a.assignmentId)}
                        style={{ padding:"6px 14px", borderRadius:7, fontSize:12.5, fontWeight:600, cursor:"pointer", background:isOpen?"#fef2f2":isPending?"#4f46e5":"#6366f1", border:isOpen?"1px solid #fecaca":"none", color:isOpen?"#ef4444":"#fff" }}>
                        {isOpen?"Cancel":isPending?"Submit ↑":" Resubmit"}
                      </button>
                    )}
                  </div>
                </div>

                {(isPending||a.allowResubmission) && isOpen && (
                  <div style={{ borderTop:"1px solid #f1f5f9", padding:"18px 20px", background:"#fafbff" }}>
                    {!isPending && a.submission?.text && !texts[a.assignmentId] && (
                      <div style={{ padding:"8px 12px", background:"#eff6ff", borderRadius:7, border:"1px solid #bfdbfe", marginBottom:10, fontSize:12.5, color:"#475569" }}>
                        <span style={{ color:"#4f46e5", fontWeight:600 }}>Previous: </span>{a.submission.text.slice(0,120)}{a.submission.text.length>120?"...":""}
                      </div>
                    )}
                    <textarea value={texts[a.assignmentId]||""} onChange={e=>setTexts(p=>({...p,[a.assignmentId]:e.target.value}))}
                      placeholder={isPending?"Write your answer here...":"Write your updated answer..."} rows={5}
                      style={{ ...inp, resize:"vertical", lineHeight:1.6, padding:"11px 13px" }} />
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
                      <span style={{ color:"#94a3b8", fontSize:12 }}>{(texts[a.assignmentId]||"").length} chars</span>
                      <button onClick={()=>handleSubmit(a.assignmentId)} disabled={submitting===a.assignmentId}
                        style={btn("#10b981", submitting===a.assignmentId)}>
                        {submitting===a.assignmentId?"Submitting...":isPending?" Submit":" Update"}
                      </button>
                    </div>
                  </div>
                )}

                {!isPending && !isOpen && (
                  <div style={{ borderTop:"1px solid #f0fdf4", padding:"10px 20px", background:"#fafffe", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ color:"#10b981", fontSize:12.5 }}>✓ Submitted</span>
                      {a.submission?.marks!=null && <span style={{ padding:"2px 9px", borderRadius:20, background:"#f0fdf4", color:"#10b981", fontSize:12, fontWeight:700, border:"1px solid #bbf7d0" }}>{a.submission.marks}/{a.maxMarks} marks</span>}
                      {a.submission?.remarks && <span style={{ color:"#64748b", fontSize:12, fontStyle:"italic" }}>"{a.submission.remarks}"</span>}
                    </div>
                    {a.allowResubmission && <span style={{ padding:"2px 9px", borderRadius:20, background:"#eff6ff", color:"#4f46e5", fontSize:11, border:"1px solid #bfdbfe" }}>🔄 Resubmission allowed</span>}
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

/* ─── MARKS ─────────────────────────────────────────────── */
export function StudentMarks() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  useEffect(() => { api.get("/student/marks").then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); }, []);
  const examTypes = ["All","MST1","MST2","FINAL"];
  const filtered  = filter==="All"?data:data.filter(m=>m.examType===filter);
  return (
    <Layout navItems={navItems}>
      <PageHeader title="Marks" subtitle="Your exam results across all subjects" />
      {loading ? <div style={{ color:"#94a3b8", textAlign:"center", padding:60 }}>Loading...</div> : (
        <>
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            {examTypes.map(t => <button key={t} onClick={()=>setFilter(t)} style={chip(filter===t)}>{t}</button>)}
          </div>
          <div style={card}>
            {filtered.length===0 && <div style={{ color:"#94a3b8", textAlign:"center", padding:20 }}>No marks found.</div>}
            {filtered.length>0 && (
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr>{["Subject","Exam","Obtained","Max","Percentage"].map(h=>(
                    <th key={h} style={{ color:"#94a3b8", fontSize:11, textTransform:"uppercase", letterSpacing:"0.8px", padding:"0 14px 12px", textAlign:"left", borderBottom:"1px solid #f1f5f9", fontWeight:600 }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.map((m,i)=>{
                    const pct = Math.round((m.marksObtained/m.maxMarks)*100);
                    const c   = pct>=75?"#10b981":pct>=50?"#f59e0b":"#ef4444";
                    return (
                      <tr key={i}>
                        <td style={{ padding:"12px 14px", color:"#1e293b", borderBottom:"1px solid #f8f9fb", fontSize:13.5 }}>{m.subject}</td>
                        <td style={{ padding:"12px 14px", borderBottom:"1px solid #f8f9fb" }}>
                          <span style={{ padding:"3px 9px", borderRadius:6, background:"#eff6ff", color:"#4f46e5", fontSize:12, fontWeight:600 }}>{m.examType}</span>
                        </td>
                        <td style={{ padding:"12px 14px", color:"#0f172a", fontWeight:700, fontSize:16, borderBottom:"1px solid #f8f9fb" }}>{m.marksObtained}</td>
                        <td style={{ padding:"12px 14px", color:"#94a3b8", borderBottom:"1px solid #f8f9fb" }}>{m.maxMarks}</td>
                        <td style={{ padding:"12px 14px", borderBottom:"1px solid #f8f9fb" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <div style={{ flex:1, height:5, background:"#f1f5f9", borderRadius:3 }}>
                              <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:c }} />
                            </div>
                            <span style={{ color:c, fontSize:12.5, fontWeight:700, minWidth:40 }}>{pct}%</span>
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

/* ─── TIMETABLE ─────────────────────────────────────────── */
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAY_COLORS = ["#4f46e5","#10b981","#f59e0b","#6366f1","#ec4899","#14b8a6"];

export function StudentTimetable() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/student/timetable").then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); }, []);
  const byDay = DAYS.reduce((acc,d)=>{ acc[d]=data.filter(t=>t.day===d); return acc; },{});
  const today = new Date().toLocaleDateString("en-US",{weekday:"long"});
  return (
    <Layout navItems={navItems}>
      <PageHeader title="Timetable" subtitle="Your weekly class schedule" />
      {loading ? <div style={{ color:"#94a3b8", textAlign:"center", padding:60 }}>Loading...</div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {data.length===0 && <div style={{ ...card, textAlign:"center", color:"#94a3b8" }}>No timetable found.</div>}
          {DAYS.map((day,di) => byDay[day]?.length>0 && (
            <div key={day} style={{ ...card, borderLeft:`4px solid ${DAY_COLORS[di]}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <h3 style={{ color:day===today?DAY_COLORS[di]:"#1e293b", fontSize:13.5, fontWeight:700, margin:0, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                  {day}{day===today && <span style={{ marginLeft:8, fontSize:11, color:DAY_COLORS[di], background:`${DAY_COLORS[di]}18`, padding:"2px 8px", borderRadius:20 }}>Today</span>}
                </h3>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {byDay[day].map((t,i) => (
                  <div key={i} style={{ padding:"11px 16px", borderRadius:9, background:`${DAY_COLORS[di]}0f`, border:`1px solid ${DAY_COLORS[di]}28`, minWidth:155 }}>
                    <div style={{ color:DAY_COLORS[di], fontSize:13.5, fontWeight:600 }}>{t.subject}</div>
                    <div style={{ color:"#64748b", fontSize:12, marginTop:4 }}> {t.startTime} – {t.endTime}</div>
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

/* ─── LECTURES ──────────────────────────────────────────── */
export function StudentLectures() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  useEffect(() => { api.get("/student/lectures").then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); }, []);
  const subjects = ["All",...new Set(data.map(l=>l.subject))];
  const filtered  = filter==="All"?data:data.filter(l=>l.subject===filter);
  return (
    <Layout navItems={navItems}>
      <PageHeader title="Lectures" subtitle={`${data.length} lectures available`} />
      {loading ? <div style={{ color:"#94a3b8", textAlign:"center", padding:60 }}>Loading...</div> : (
        <>
          <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
            {subjects.map(s => <button key={s} onClick={()=>setFilter(s)} style={chip(filter===s,"#6366f1")}>{s}</button>)}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:14 }}>
            {filtered.length===0 && <div style={{ ...card, color:"#94a3b8" }}>No lectures found.</div>}
            {filtered.map((l,i) => (
              <div key={i} style={card}>
                <div style={{ width:"100%", height:80, borderRadius:9, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:14, border:"1px solid #bfdbfe" }}></div>
                <div style={{ color:"#0f172a", fontSize:14.5, fontWeight:600, marginBottom:3 }}>{l.title}</div>
                <div style={{ color:"#6366f1", fontSize:12.5, marginBottom:10 }}>{l.subject}</div>
                {l.description && <div style={{ color:"#64748b", fontSize:13, marginBottom:14, lineHeight:1.5 }}>{l.description}</div>}
                {l.resourceUrl && (
                  <a href={l.resourceUrl} target="_blank" rel="noreferrer"
                    style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"7px 15px", background:"#4f46e5", borderRadius:7, color:"#fff", fontSize:13, fontWeight:600, textDecoration:"none" }}>
                     View Lecture
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

/* ─── SUBJECTS ──────────────────────────────────────────── */
export function StudentSubjects() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const colors = ["#4f46e5","#10b981","#f59e0b","#6366f1","#ec4899"];
  useEffect(() => { api.get("/student/subjects").then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); }, []);
  return (
    <Layout navItems={navItems}>
      <PageHeader title="My Subjects" subtitle={`Enrolled in ${data.length} subjects`} />
      {loading ? <div style={{ color:"#94a3b8", textAlign:"center", padding:60 }}>Loading...</div> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
          {data.length===0 && <div style={{ ...card, color:"#94a3b8" }}>No subjects found.</div>}
          {data.map((s,i) => (
            <div key={i} style={{ ...card, borderTop:`3px solid ${colors[i%colors.length]}`, paddingTop:20 }}>
              <div style={{ fontSize:30, marginBottom:12 }}></div>
              <div style={{ color:"#0f172a", fontSize:15.5, fontWeight:700 }}>{s.name}</div>
              <div style={{ color:colors[i%colors.length], fontSize:13, marginTop:3, fontWeight:600 }}>{s.code}</div>
              <div style={{ height:1, background:"#f1f5f9", margin:"12px 0" }} />
              <div style={{ color:"#64748b", fontSize:12.5 }}> {s.teacher?.userId?.name||"N/A"}</div>
              <div style={{ color:"#64748b", fontSize:12.5, marginTop:4 }}> {s.students?.length||0} students</div>
              <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:s.isActive?"#10b981":"#ef4444" }} />
                <span style={{ color:s.isActive?"#10b981":"#ef4444", fontSize:12 }}>{s.isActive?"Active":"Inactive"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

/* ─── ALERTS ────────────────────────────────────────────── */
export function StudentAlerts() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/student/alerts").then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false)); }, []);
  const lvl = {
    Emergency:{  color:"#ef4444", bg:"#fef2f2", border:"#fecaca" },
    Warning:  {  color:"#f59e0b", bg:"#fffbeb", border:"#fde68a" },
    Info:     {  color:"#3b82f6", bg:"#eff6ff", border:"#bfdbfe" },
  };
  return (
    <Layout navItems={navItems}>
      <PageHeader title="Alerts & Notices" subtitle="Stay updated with important announcements" />
      {loading ? <div style={{ color:"#94a3b8", textAlign:"center", padding:60 }}>Loading...</div> : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {data.length===0 && <div style={{ ...card, textAlign:"center", color:"#94a3b8" }}>No alerts at this time.</div>}
          {data.map((a,i) => {
            const c = lvl[a.level]||lvl.Info;
            return (
              <div key={i} style={{ padding:"16px 20px", borderRadius:11, background:c.bg, border:`1px solid ${c.border}`, display:"flex", gap:14, alignItems:"flex-start" }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{c.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6, flexWrap:"wrap", gap:4 }}>
                    <span style={{ color:c.color, fontSize:11.5, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px" }}>{a.level}</span>
                    <span style={{ color:"#94a3b8", fontSize:11.5 }}>{new Date(a.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
                  </div>
                  <p style={{ color:"#1e293b", margin:0, fontSize:13.5, lineHeight:1.65 }}>{a.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
