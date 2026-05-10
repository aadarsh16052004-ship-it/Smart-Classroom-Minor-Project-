import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const inp = {
  width:"100%", padding:"10px 13px", background:"#f8f9fb",
  border:"1px solid #e2e8f0", borderRadius:8, color:"#1e293b",
  fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit",
  transition:"border-color 0.15s",
};

export default function Login() {
  const [mode, setMode]         = useState("login");
  const [loading, setLoading]   = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [regName, setRegName]   = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPwd, setRegPwd]     = useState("");
  const [regRole, setRegRole]   = useState("student");
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      const r = res.data.user.role;
      navigate(r==="admin"?"/admin":r==="teacher"?"/teacher":"/student");
    } catch {} finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName.trim()) { toast.error("Enter your name"); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name:regName, email:regEmail, password:regPwd, role:regRole });
      login(res.data.user, res.data.token);
      toast.success(`Welcome, ${res.data.user.name}!`);
      navigate(res.data.user.role==="teacher"?"/teacher":"/student");
    } catch {} finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f8f9fb", display:"flex", fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      {/* Left panel */}
      <div style={{ flex:"0 0 420px", background:"#0f172a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 48px" }}>
        {/* <div style={{ width:48, height:48, borderRadius:12, background:"#4f46e5", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:20 }}>🎓</div> */}
        <h1 style={{ color:"#f1f5f9", fontSize:26, fontWeight:700, margin:"0 0 8px", letterSpacing:"-0.5px", textAlign:"center" }}>SmartCMS</h1>
        <p style={{ color:"#64748b", fontSize:14, margin:"0 0 40px", textAlign:"center" }}>Smart Classroom Management System</p>
        <div style={{ width:"100%", borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:28 }}>
          {[["","Students","Track attendance, assignments & marks"],["","Teachers","Manage classes, grades & resources"],["","Admins","Oversee users, subjects & system"]].map(([icon,title,desc]) => (
            <div key={title} style={{ display:"flex", gap:12, marginBottom:18, alignItems:"flex-start" }}>
              <span style={{ fontSize:18, flexShrink:0, marginTop:1 }}>{icon}</span>
              <div>
                <div style={{ color:"#e2e8f0", fontWeight:600, fontSize:13.5 }}>{title}</div>
                <div style={{ color:"#475569", fontSize:12, marginTop:2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
        <div style={{ width:"100%", maxWidth:380 }}>
          {/* Tab toggle */}
          <div style={{ display:"flex", background:"#e2e8f0", borderRadius:10, padding:3, marginBottom:28 }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{ flex:1, padding:"9px", border:"none", borderRadius:8, background:mode===m?"#fff":"transparent", color:mode===m?"#0f172a":"#64748b", fontSize:13.5, fontWeight:mode===m?700:400, cursor:"pointer", fontFamily:"inherit", boxShadow:mode===m?"0 1px 6px rgba(0,0,0,0.1)":"none", transition:"all 0.15s" }}>
                {m==="login"?"Sign In":"Create Account"}
              </button>
            ))}
          </div>

          <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:14, padding:"28px 28px", boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
            {mode === "login" ? (
              <form onSubmit={handleLogin}>
                <h2 style={{ color:"#0f172a", fontSize:18, fontWeight:700, margin:"0 0 20px" }}>Welcome back</h2>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", color:"#475569", fontSize:12, marginBottom:6, fontWeight:600 }}>Email Address</label>
                  <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@cms.com" style={inp}
                    onFocus={e=>e.target.style.borderColor="#4f46e5"} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
                </div>
                <div style={{ marginBottom:22 }}>
                  <label style={{ display:"block", color:"#475569", fontSize:12, marginBottom:6, fontWeight:600 }}>Password</label>
                  <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={inp}
                    onFocus={e=>e.target.style.borderColor="#4f46e5"} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
                </div>
                <button type="submit" disabled={loading}
                  style={{ width:"100%", padding:"11px", background:loading?"#c7d2fe":"#4f46e5", border:"none", borderRadius:8, color:"#fff", fontSize:14, fontWeight:600, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit" }}>
                  {loading ? "Signing in..." : "Sign In →"}
                </button>
                {/* Demo credentials */}
                <div style={{ marginTop:18, padding:14, background:"#f8f9fb", borderRadius:8, border:"1px solid #e2e8f0" }}>
                  <p style={{ color:"#94a3b8", fontSize:11, margin:"0 0 8px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px" }}>Demo — click to fill</p>
                  {[["Admin","admin@cms.com"],["Teacher","teacher@cms.com"],["Student","rahul@cms.com"]].map(([r,e]) => (
                    <div key={r} onClick={()=>{setEmail(e);setPassword("password123");}} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", cursor:"pointer", borderBottom:"1px solid #f1f5f9" }}>
                      <span style={{ color:"#64748b", fontSize:12 }}>{r}</span>
                      <span style={{ color:"#4f46e5", fontSize:12 }}>{e}</span>
                    </div>
                  ))}
                  <p style={{ color:"#94a3b8", fontSize:11, margin:"8px 0 0" }}>Password: password123</p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <h2 style={{ color:"#0f172a", fontSize:18, fontWeight:700, margin:"0 0 20px" }}>Create your account</h2>
                {[["Full Name","text",regName,setRegName,"Your full name"],["Email","email",regEmail,setRegEmail,"you@example.com"],["Password","password",regPwd,setRegPwd,"Min. 6 characters"]].map(([label,type,val,set,ph]) => (
                  <div key={label} style={{ marginBottom:14 }}>
                    <label style={{ display:"block", color:"#475569", fontSize:12, marginBottom:6, fontWeight:600 }}>{label}</label>
                    <input type={type} required value={val} onChange={e=>set(e.target.value)} placeholder={ph} style={inp}
                      onFocus={e=>e.target.style.borderColor="#4f46e5"} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
                  </div>
                ))}
                <div style={{ marginBottom:22 }}>
                  <label style={{ display:"block", color:"#475569", fontSize:12, marginBottom:8, fontWeight:600 }}>I am a...</label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {[["student"," Student"],["teacher"," Teacher"]].map(([val,label]) => (
                      <button type="button" key={val} onClick={()=>setRegRole(val)}
                        style={{ padding:"10px 8px", border:`2px solid ${regRole===val?"#4f46e5":"#e2e8f0"}`, borderRadius:8, background:regRole===val?"#eef2ff":"#fff", color:regRole===val?"#4f46e5":"#64748b", fontSize:13.5, fontWeight:regRole===val?700:400, cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  style={{ width:"100%", padding:"11px", background:loading?"#c7d2fe":"#4f46e5", border:"none", borderRadius:8, color:"#fff", fontSize:14, fontWeight:600, cursor:loading?"not-allowed":"pointer", fontFamily:"inherit" }}>
                  {loading ? "Creating account..." : "Create Account →"}
                </button>
                <p style={{ color:"#94a3b8", fontSize:12, textAlign:"center", marginTop:14, lineHeight:1.6 }}>
                  New accounts start with no subjects.<br/>An admin will enroll you.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
