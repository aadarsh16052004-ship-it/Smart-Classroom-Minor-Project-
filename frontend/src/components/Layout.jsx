import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";

const roleColors = {
  admin:   { accent: "#f59e0b", light: "rgba(245,158,11,0.12)", badge: "#f59e0b" },
  teacher: { accent: "#10b981", light: "rgba(16,185,129,0.12)", badge: "#10b981" },
  student: { accent: "#3b82f6", light: "rgba(59,130,246,0.12)", badge: "#3b82f6" },
};

export default function Layout({ children, navItems }) {
  const { user, logout }     = useAuth();
  const { dark, toggle }     = useTheme();
  const navigate             = useNavigate();
  const location             = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotif, setShowNotif]   = useState(false);
  const [notifications, setNotifications] = useState([]);
  const colors = roleColors[user?.role] || roleColors.student;

  const bg   = dark ? "#070c18"               : "#f1f5f9";
  const side = dark ? "rgba(10,16,32,0.98)"   : "#ffffff";
  const bord = dark ? "rgba(255,255,255,0.07)": "rgba(0,0,0,0.08)";
  const navInactive = dark ? "#64748b" : "#94a3b8";
  const textMain    = dark ? "#e2e8f0"  : "#1e293b";
  const mainBg      = dark ? "#070c18"  : "#f1f5f9";

  useEffect(() => {
    if (user?.role !== "student") return;
    const fetchCount = () => {
      api.get("/student/notifications/count")
        .then(r => setNotifCount(r.data.count))
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const openNotifications = async () => {
    setShowNotif(s => !s);
    if (!showNotif && user?.role === "student") {
      try {
        const [alertsRes, annsRes] = await Promise.all([
          api.get("/student/alerts"),
          api.get("/student/announcements"),
        ]);
        const alerts = alertsRes.data.map(a => ({ ...a, _type: "alert" }));
        const anns   = annsRes.data.map(a => ({ ...a, _type: "announcement" }));
        const combined = [...alerts, ...anns].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
        setNotifications(combined);
      } catch {}
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const profilePath = user?.role === "student" ? "/student/profile" : null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: mainBg, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 70 : 240,
        background: side,
        borderRight: `1px solid ${bord}`,
        display: "flex", flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh",
        boxShadow: dark ? "none" : "2px 0 12px rgba(0,0,0,0.06)",
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? "20px 0" : "20px", borderBottom: `1px solid ${bord}`, display: "flex", alignItems: "center", gap: 12, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: `linear-gradient(135deg,${colors.accent},${colors.accent}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: `0 0 20px ${colors.accent}44` }}>🎓</div>
          {!collapsed && (
            <div>
              <div style={{ color: textMain, fontWeight: 700, fontSize: 15 }}>SmartCMS</div>
              <div style={{ color: colors.accent, fontSize: 11, textTransform: "uppercase", letterSpacing: "1px" }}>{user?.role}</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} title={collapsed ? item.label : ""}
                style={{
                  width: "100%", padding: collapsed ? "12px 0" : "11px 20px",
                  display: "flex", alignItems: "center", gap: 12,
                  justifyContent: collapsed ? "center" : "flex-start",
                  background: active ? colors.light : "transparent",
                  border: "none", cursor: "pointer",
                  borderLeft: active ? `3px solid ${colors.accent}` : "3px solid transparent",
                  color: active ? colors.accent : navInactive,
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  transition: "all 0.15s", textAlign: "left",
                }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: `1px solid ${bord}`, padding: "12px" }}>
          {!collapsed && (
            <div style={{ padding: "10px 12px", borderRadius: 10, background: dark ? "rgba(30,41,59,0.5)" : "rgba(0,0,0,0.04)", marginBottom: 8 }}>
              <div style={{ color: textMain, fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: navInactive, fontSize: 11, marginTop: 2 }}>{user?.email}</div>
            </div>
          )}

          {/* Theme toggle */}
          <button onClick={toggle} style={{ width: "100%", padding: "8px", marginBottom: 6, background: dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.08)", border: `1px solid rgba(99,102,241,0.2)`, borderRadius: 8, color: "#818cf8", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span>{dark ? "☀️" : "🌙"}</span>{!collapsed && (dark ? "Light Mode" : "Dark Mode")}
          </button>

          {profilePath && !collapsed && (
            <button onClick={() => navigate(profilePath)} style={{ width: "100%", padding: "8px", marginBottom: 6, background: "transparent", border: `1px solid ${bord}`, borderRadius: 8, color: navInactive, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span>👤</span> My Profile
            </button>
          )}

          <button onClick={handleLogout} style={{ width: "100%", padding: "9px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#ef4444", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span>🚪</span>{!collapsed && "Logout"}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} style={{ width: "100%", padding: "8px", marginTop: 6, background: "transparent", border: "none", color: navInactive, fontSize: 18, cursor: "pointer" }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar with notification bell */}
        <div style={{ padding: "14px 32px", borderBottom: `1px solid ${bord}`, background: side, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
          {/* Notification Bell */}
          <div style={{ position: "relative" }}>
            <button onClick={openNotifications}
              style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 22, position: "relative", padding: 4 }}>
              🔔
              {notifCount > 0 && (
                <span style={{ position: "absolute", top: 0, right: 0, background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 5px", minWidth: 16, textAlign: "center" }}>
                  {notifCount > 99 ? "99+" : notifCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotif && (
              <div style={{
                position: "absolute", right: 0, top: "110%", width: 320, maxHeight: 400, overflowY: "auto",
                background: dark ? "rgba(10,16,32,0.98)" : "#fff",
                border: `1px solid ${bord}`, borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                zIndex: 200,
              }}>
                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${bord}`, color: textMain, fontWeight: 600, fontSize: 14 }}>
                  Notifications
                </div>
                {notifications.length === 0 && <div style={{ padding: 20, color: navInactive, fontSize: 13, textAlign: "center" }}>No notifications</div>}
                {notifications.map((n, i) => (
                  <div key={i} style={{ padding: "12px 18px", borderBottom: `1px solid ${bord}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{n._type === "alert" ? (n.level === "Emergency" ? "🚨" : n.level === "Warning" ? "⚠️" : "ℹ️") : "📢"}</span>
                    <div>
                      {n._type === "announcement" && <div style={{ color: colors.accent, fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{n.title}</div>}
                      <div style={{ color: textMain, fontSize: 13, lineHeight: 1.5 }}>{n._type === "alert" ? n.message : n.content?.slice(0, 80) + (n.content?.length > 80 ? "..." : "")}</div>
                      <div style={{ color: navInactive, fontSize: 11, marginTop: 3 }}>{new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${colors.accent},${colors.accent}88)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflow: "auto", padding: "28px 32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
