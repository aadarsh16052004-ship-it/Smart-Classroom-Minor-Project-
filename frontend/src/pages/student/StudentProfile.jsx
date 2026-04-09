import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import toast from "react-hot-toast";

const navItems = [
  { path: "/student",              label: "Dashboard" },
  { path: "/student/attendance",   label: "Attendance" },
  { path: "/student/assignments",  label: "Assignments" },
  { path: "/student/marks",        label: "Marks" },
  { path: "/student/timetable",    label: "Timetable" },
  { path: "/student/lectures",     label: "Lectures" },
  { path: "/student/subjects",     label: "Subjects"},
  { path: "/student/announcements",label: "Announcements" },
  { path: "/student/alerts",       label: "Alerts" },
  { path: "/student/profile",      label: "Profile"},
];

export default function StudentProfile() {
  const { user, login } = useAuth();
  const { dark } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  const [name, setName]                = useState("");
  const [currentPwd, setCurrentPwd]   = useState("");
  const [newPwd, setNewPwd]           = useState("");
  const [confirmPwd, setConfirmPwd]   = useState("");
  const [pwdSection, setPwdSection]   = useState(false);

  const card  = { background: dark ? "rgba(15,23,42,0.9)" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}`, borderRadius: 16, padding: 24 };
  const input = { width: "100%", padding: "11px 14px", background: dark ? "rgba(30,41,59,0.8)" : "#f8fafc", border: `1px solid ${dark ? "rgba(59,130,246,0.2)" : "rgba(0,0,0,0.12)"}`, borderRadius: 8, color: dark ? "#e2e8f0" : "#1e293b", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const label = { display: "block", color: dark ? "#94a3b8" : "#64748b", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" };

  useEffect(() => {
    api.get("/student/profile").then(r => {
      setProfile(r.data);
      setName(r.data.name || "");
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Name cannot be empty"); return; }
    if (pwdSection) {
      if (!currentPwd) { toast.error("Enter your current password"); return; }
      if (newPwd.length < 6) { toast.error("New password must be at least 6 characters"); return; }
      if (newPwd !== confirmPwd) { toast.error("Passwords do not match"); return; }
    }
    setSaving(true);
    try {
      const payload = { name };
      if (pwdSection && newPwd) { payload.currentPassword = currentPwd; payload.newPassword = newPwd; }
      const res = await api.patch("/student/profile", payload);
      toast.success("Profile updated!");
      // Update auth context name
      login({ ...user, name: res.data.user.name }, localStorage.getItem("token"));
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd(""); setPwdSection(false);
    } catch {} finally { setSaving(false); }
  };

  if (loading) return <Layout navItems={navItems}><div style={{ color: "#64748b", textAlign: "center", padding: 60 }}>Loading...</div></Layout>;

  return (
    <Layout navItems={navItems}>
      <PageHeader title="My Profile" subtitle="Manage your account details" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, maxWidth: 860 }}>

        {/* Left — avatar card */}
        <div style={{ ...card, textAlign: "center", padding: 36 }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 38, fontWeight: 700, color: "#fff", boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}>
            {name?.[0]?.toUpperCase()}
          </div>
          <div style={{ color: dark ? "#e2e8f0" : "#1e293b", fontSize: 20, fontWeight: 700 }}>{name}</div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{profile?.email}</div>
          <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", background: "rgba(59,130,246,0.12)", borderRadius: 20, border: "1px solid rgba(59,130,246,0.3)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6" }} />
            <span style={{ color: "#3b82f6", fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{profile?.role}</span>
          </div>
          {profile?.rollNumber && (
            <div style={{ marginTop: 12, color: "#64748b", fontSize: 13 }}>Roll No: <strong style={{ color: dark ? "#e2e8f0" : "#1e293b" }}>{profile.rollNumber}</strong></div>
          )}
        </div>

        {/* Right — edit form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={card}>
            <h3 style={{ color: dark ? "#e2e8f0" : "#1e293b", fontSize: 15, fontWeight: 700, margin: "0 0 20px" }}>Account Information</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} style={input} placeholder="Your full name" />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={label}>Email Address</label>
              <input value={profile?.email || ""} disabled style={{ ...input, opacity: 0.5, cursor: "not-allowed" }} />
              <p style={{ color: "#475569", fontSize: 12, marginTop: 6 }}>Email cannot be changed.</p>
            </div>
          </div>

          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: pwdSection ? 20 : 0 }}>
              <h3 style={{ color: dark ? "#e2e8f0" : "#1e293b", fontSize: 15, fontWeight: 700, margin: 0 }}>Change Password</h3>
              <button onClick={() => setPwdSection(s => !s)}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", background: pwdSection ? "rgba(239,68,68,0.1)" : "rgba(59,130,246,0.1)", border: `1px solid ${pwdSection ? "rgba(239,68,68,0.3)" : "rgba(59,130,246,0.3)"}`, color: pwdSection ? "#ef4444" : "#60a5fa" }}>
                {pwdSection ? "Cancel" : "Change Password"}
              </button>
            </div>
            {pwdSection && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div><label style={label}>Current Password</label><input type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} style={input} placeholder="••••••••" /></div>
                <div><label style={label}>New Password</label><input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} style={input} placeholder="Min. 6 characters" /></div>
                <div><label style={label}>Confirm New Password</label><input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} style={input} placeholder="Repeat new password" /></div>
              </div>
            )}
          </div>

          <button onClick={handleSave} disabled={saving}
            style={{ padding: "14px", background: saving ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", boxShadow: saving ? "none" : "0 4px 20px rgba(59,130,246,0.3)" }}>
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      </div>
    </Layout>
  );
}
