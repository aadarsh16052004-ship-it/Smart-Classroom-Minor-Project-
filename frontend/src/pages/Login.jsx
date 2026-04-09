import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

const inputStyle = {
  width: "100%", padding: "12px 16px",
  background: "rgba(30,41,59,0.8)",
  border: "1px solid rgba(59,130,246,0.2)",
  borderRadius: 10, color: "#e2e8f0",
  fontSize: 15, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit",
};

const btnStyle = (disabled) => ({
  width: "100%", padding: "14px",
  background: disabled ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg, #3b82f6, #6366f1)",
  border: "none", borderRadius: 10, color: "#fff",
  fontSize: 16, fontWeight: 600,
  cursor: disabled ? "not-allowed" : "pointer",
  fontFamily: "inherit",
  boxShadow: disabled ? "none" : "0 4px 20px rgba(59,130,246,0.35)",
  letterSpacing: "0.3px",
});

export default function Login() {
  const [mode, setMode]       = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  // Login fields
  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regName, setRegName]         = useState("");
  const [regEmail, setRegEmail]       = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole]         = useState("student");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email: loginEmail, password: loginPassword });
      login(res.data.user, res.data.token);
      const role = res.data.user.role;
      navigate(role === "admin" ? "/admin" : role === "teacher" ? "/teacher" : "/student");
    } catch {} finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName.trim()) { toast.error("Enter your name"); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: regName, email: regEmail, password: regPassword, role: regRole,
      });
      login(res.data.user, res.data.token);
      toast.success(`Account created! Welcome, ${res.data.user.name} 🎉`);
      navigate(res.data.user.role === "teacher" ? "/teacher" : "/student");
    } catch {} finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0e1a 0%, #0d1628 50%, #0a1020 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460, margin: "20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 0 30px rgba(59,130,246,0.4)", fontSize: 26 }}>🎓</div>
          <h1 style={{ color: "#f0f4ff", fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: "-0.5px" }}>Smart Classroom</h1>
          <p style={{ color: "#64748b", margin: "6px 0 0", fontSize: 14 }}>Management System</p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", background: "rgba(15,23,42,0.8)", borderRadius: 12, padding: 4, marginBottom: 20, border: "1px solid rgba(255,255,255,0.07)" }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{
                flex: 1, padding: "10px", border: "none", borderRadius: 9,
                background: mode === m ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "transparent",
                color: mode === m ? "#fff" : "#64748b",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                textTransform: "capitalize", fontFamily: "inherit",
              }}>
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 20, padding: "32px 32px", backdropFilter: "blur(20px)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>

          {/* ── LOGIN FORM ── */}
          {mode === "login" && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</label>
                <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                  placeholder="you@cms.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(59,130,246,0.2)"} />
              </div>
              <div style={{ marginBottom: 26 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
                <input type="password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(59,130,246,0.2)"} />
              </div>
              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? "Signing in..." : "Sign In →"}
              </button>

              {/* Demo credentials */}
              <div style={{ marginTop: 22, padding: 16, background: "rgba(30,41,59,0.5)", borderRadius: 10, border: "1px solid rgba(59,130,246,0.1)" }}>
                <p style={{ color: "#64748b", fontSize: 11, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Demo Credentials (password: password123)</p>
                {[["Admin","admin@cms.com"],["Teacher","teacher@cms.com"],["Student","rahul@cms.com"]].map(([r,e]) => (
                  <div key={r} style={{ display:"flex", justifyContent:"space-between", marginTop: 5, cursor:"pointer" }}
                    onClick={() => { setLoginEmail(e); setLoginPassword("password123"); }}>
                    <span style={{ color: "#64748b", fontSize: 13 }}>{r}</span>
                    <span style={{ color: "#60a5fa", fontSize: 13 }}>{e}</span>
                  </div>
                ))}
                <p style={{ color: "#475569", fontSize: 11, marginTop: 8 }}>💡 Click a row to auto-fill</p>
              </div>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {mode === "register" && (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</label>
                <input type="text" required value={regName} onChange={e => setRegName(e.target.value)}
                  placeholder="Your full name" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(59,130,246,0.2)"} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</label>
                <input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)}
                  placeholder="you@example.com" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(59,130,246,0.2)"} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Password</label>
                <input type="password" required value={regPassword} onChange={e => setRegPassword(e.target.value)}
                  placeholder="Min. 6 characters" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "rgba(59,130,246,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(59,130,246,0.2)"} />
              </div>
              <div style={{ marginBottom: 26 }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>I am a...</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[["student","🎓 Student"],["teacher","📖 Teacher"]].map(([val, label]) => (
                    <button type="button" key={val} onClick={() => setRegRole(val)}
                      style={{
                        padding: "12px", border: `2px solid ${regRole === val ? "#3b82f6" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 10, background: regRole === val ? "rgba(59,130,246,0.15)" : "rgba(30,41,59,0.5)",
                        color: regRole === val ? "#60a5fa" : "#64748b",
                        fontSize: 14, fontWeight: regRole === val ? 700 : 400, cursor: "pointer",
                        fontFamily: "inherit", transition: "all 0.15s",
                      }}>{label}</button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>
              <p style={{ color: "#475569", fontSize: 12, textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
                 New accounts start with no subjects assigned.<br/>An admin will enroll you in subjects.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
