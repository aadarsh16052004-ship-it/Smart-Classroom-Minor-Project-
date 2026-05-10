import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Chatbot from "./Chatbot";

const T = {
  sidebar:"#0f172a", sideHover:"rgba(255,255,255,0.06)", sideActive:"rgba(255,255,255,0.12)",
  sideText:"#94a3b8", sideActiveText:"#f1f5f9", border:"rgba(255,255,255,0.08)",
  pageBg:"#f8f9fb", topbar:"#ffffff", topBorder:"#e2e8f0",
  textMain:"#1e293b", textSub:"#64748b",
};
const roleAccent = { admin:"#f59e0b", teacher:"#10b981", student:"#4f46e5" };

export default function Layout({ children, navItems }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const accent = roleAccent[user?.role] || "#4f46e5";

  useEffect(() => {
    if (user?.role !== "student") return;
    const fetch = () => api.get("/student/notifications/count").then(r => setNotifCount(r.data.count)).catch(()=>{});
    fetch();
    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, [user]);

  const openNotifications = async () => {
    setShowNotif(s => !s);
    if (!showNotif && user?.role === "student") {
      try {
        const [ar, anr] = await Promise.all([api.get("/student/alerts"), api.get("/student/announcements")]);
        const combined = [
          ...ar.data.map(a => ({ ...a, _type:"alert" })),
          ...anr.data.map(a => ({ ...a, _type:"announcement" })),
        ].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,8);
        setNotifications(combined);
      } catch {}
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:T.pageBg, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width:collapsed?64:232, background:T.sidebar, display:"flex", flexDirection:"column", transition:"width 0.25s ease", overflow:"hidden", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
        <div style={{ padding:collapsed?"18px 0":"18px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:10, justifyContent:collapsed?"center":"flex-start" }}>
          <div style={{ width:34, height:34, borderRadius:20, flexShrink:0, background:accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}></div>
          {!collapsed && (
            <div>
              <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:14 }}>SmartCMS</div>
              <div style={{ color:accent, fontSize:10, textTransform:"uppercase", letterSpacing:"1.2px", marginTop:1 }}>{user?.role}</div>
            </div>
          )}
        </div>

        <nav style={{ flex:1, padding:"10px 0", overflowY:"auto" }}>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} title={collapsed ? item.label : ""}
                style={{ width:"100%", padding:collapsed?"11px 0":"10px 16px", display:"flex", alignItems:"center", gap:10, justifyContent:collapsed?"center":"flex-start", background:active?T.sideActive:"transparent", border:"none", cursor:"pointer", borderLeft:active?`3px solid ${accent}`:"3px solid transparent", color:active?T.sideActiveText:T.sideText, fontSize:13.5, fontWeight:active?600:400, transition:"background 0.12s", textAlign:"left" }}
                onMouseEnter={e=>{ if(!active) e.currentTarget.style.background=T.sideHover; }}
                onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}
              >
                <span style={{ fontSize:17, flexShrink:0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ borderTop:`1px solid ${T.border}`, padding:"10px" }}>
          {!collapsed && (
            <div style={{ padding:"8px 10px", borderRadius:8, background:"rgba(255,255,255,0.05)", marginBottom:8 }}>
              <div style={{ color:"#f1f5f9", fontSize:12.5, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name}</div>
              <div style={{ color:T.sideText, fontSize:11, marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.email}</div>
            </div>
          )}
          {user?.role === "student" && !collapsed && (
            <button onClick={() => navigate("/student/profile")}
              style={{ width:"100%", padding:"8px 10px", marginBottom:6, background:"transparent", border:`1px solid ${T.border}`, borderRadius:7, color:T.sideText, fontSize:12.5, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <span></span> My Profile
            </button>
          )}
          <button onClick={() => { logout(); navigate("/"); }}
            style={{ width:"100%", padding:"8px 10px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:7, color:"#f87171", fontSize:12.5, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginBottom:6 }}>
            <span></span>{!collapsed && "Logout"}
          </button>
          <button onClick={() => setCollapsed(!collapsed)}
            style={{ width:"100%", padding:"7px", background:"transparent", border:"none", color:T.sideText, fontSize:16, cursor:"pointer", opacity:0.5 }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Topbar */}
        <div style={{ padding:"12px 28px", borderBottom:`1px solid ${T.topBorder}`, background:T.topbar, display:"flex", justifyContent:"flex-end", alignItems:"center", gap:10, position:"sticky", top:0, zIndex:100 }}>
          {user?.role === "student" && (
            <div style={{ position:"relative" }}>
              <button onClick={openNotifications} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:19, padding:"4px 6px", borderRadius:7, position:"relative", display:"flex", alignItems:"center" }}>
                
                {notifCount > 0 && (
                  <span style={{ position:"absolute", top:0, right:0, background:"#ef4444", color:"#fff", fontSize:9, fontWeight:700, borderRadius:10, padding:"1px 4px", minWidth:14, textAlign:"center", lineHeight:"14px" }}>
                    {notifCount > 99 ? "99+" : notifCount}
                  </span>
                )}
              </button>
              {showNotif && (
                <div style={{ position:"absolute", right:0, top:"110%", width:310, maxHeight:380, overflowY:"auto", background:"#fff", border:`1px solid ${T.topBorder}`, borderRadius:12, boxShadow:"0 10px 40px rgba(0,0,0,0.12)", zIndex:200 }}>
                  <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.topBorder}`, color:T.textMain, fontWeight:600, fontSize:13 }}>Notifications</div>
                  {notifications.length === 0 && <div style={{ padding:20, color:T.textSub, fontSize:13, textAlign:"center" }}>No notifications</div>}
                  {notifications.map((n,i) => (
                    <div key={i} style={{ padding:"11px 16px", borderBottom:"1px solid #f1f5f9", display:"flex", gap:10, alignItems:"flex-start" }}>
                      <span style={{ fontSize:17, flexShrink:0 }}>{n._type==="alert"?(n.level==="Emergency"?"":n.level==="Warning"?"":""):""}</span>
                      <div>
                        {n._type==="announcement" && <div style={{ color:accent, fontSize:12, fontWeight:600, marginBottom:2 }}>{n.title}</div>}
                        <div style={{ color:T.textMain, fontSize:12.5, lineHeight:1.5 }}>{n._type==="alert"?n.message:n.content?.slice(0,80)+(n.content?.length>80?"...":"")}</div>
                        <div style={{ color:T.textSub, fontSize:11, marginTop:2 }}>{new Date(n.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={{ width:30, height:30, borderRadius:"50%", background:accent, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:13 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>
        <main style={{ flex:1, overflow:"auto", padding:"28px 32px" }}>
          {children}
        </main>
      </div>

      <Chatbot />
    </div>
  );
}
