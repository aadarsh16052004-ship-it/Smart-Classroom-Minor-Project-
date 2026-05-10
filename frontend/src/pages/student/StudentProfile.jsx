import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import toast from "react-hot-toast";

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

const inp = { width:"100%", padding:"10px 13px", background:"#f8f9fb", border:"1px solid #e2e8f0", borderRadius:8, color:"#1e293b", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };

export default function StudentProfile() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [name, setName]               = useState("");
  const [currentPwd, setCurrentPwd]   = useState("");
  const [newPwd, setNewPwd]           = useState("");
  const [confirmPwd, setConfirmPwd]   = useState("");

  useEffect(() => {
    api.get("/student/profile").then(r=>{ setProfile(r.data); setName(r.data.name||""); }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (newPwd && newPwd !== confirmPwd) { toast.error("Passwords don't match"); return; }
    setSaving(true);
    try {
      const payload = { name };
      if (currentPwd && newPwd) { payload.currentPassword = currentPwd; payload.newPassword = newPwd; }
      const res = await api.put("/student/profile", payload);
      toast.success("Profile updated!");
      login(res.data.user, localStorage.getItem("token"));
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch {} finally { setSaving(false); }
  };

  return (
    <Layout navItems={navItems}>
      <PageHeader title="My Profile" subtitle="Update your personal information" />
      {loading ? <div style={{ color:"#94a3b8", textAlign:"center", padding:60 }}>Loading...</div> : (
        <div style={{ maxWidth:520 }}>
          <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:14, padding:28 }}>
            {/* Avatar */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28, paddingBottom:24, borderBottom:"1px solid #f1f5f9" }}>
              <div style={{ width:60, height:60, borderRadius:"50%", background:"#4f46e5", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:26 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ color:"#0f172a", fontSize:16, fontWeight:700 }}>{user?.name}</div>
                <div style={{ color:"#64748b", fontSize:13, marginTop:2 }}>{user?.email}</div>
                <div style={{ display:"inline-block", marginTop:6, padding:"2px 10px", borderRadius:20, background:"#eff6ff", color:"#4f46e5", fontSize:12, fontWeight:600, textTransform:"capitalize" }}>{user?.role}</div>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ marginBottom:18 }}>
                <label style={{ display:"block", color:"#475569", fontSize:12.5, marginBottom:7, fontWeight:600 }}>Full Name</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} style={inp}
                  onFocus={e=>e.target.style.borderColor="#4f46e5"} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={{ display:"block", color:"#475569", fontSize:12.5, marginBottom:7, fontWeight:600 }}>Email Address</label>
                <input type="email" value={profile?.email||""} disabled style={{ ...inp, background:"#f8f9fb", color:"#94a3b8", cursor:"not-allowed" }} />
              </div>

              <div style={{ height:1, background:"#f1f5f9", margin:"20px 0" }} />
              <p style={{ color:"#94a3b8", fontSize:12.5, margin:"0 0 14px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px" }}>Change Password (optional)</p>

              {[["Current Password",currentPwd,setCurrentPwd],["New Password",newPwd,setNewPwd],["Confirm New Password",confirmPwd,setConfirmPwd]].map(([label,val,set])=>(
                <div key={label} style={{ marginBottom:14 }}>
                  <label style={{ display:"block", color:"#475569", fontSize:12.5, marginBottom:7, fontWeight:600 }}>{label}</label>
                  <input type="password" value={val} onChange={e=>set(e.target.value)} placeholder="••••••••" style={inp}
                    onFocus={e=>e.target.style.borderColor="#4f46e5"} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
                </div>
              ))}

              <button type="submit" disabled={saving}
                style={{ marginTop:8, padding:"10px 24px", background:saving?"#c7d2fe":"#4f46e5", border:"none", borderRadius:8, color:"#fff", fontSize:14, fontWeight:600, cursor:saving?"not-allowed":"pointer" }}>
                {saving?"Saving...":"Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
