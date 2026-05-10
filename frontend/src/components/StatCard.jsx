export default function StatCard({ icon, label, value, color = "#4f46e5", sub }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 12, padding: "20px 22px",
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ fontSize:22 }}>{icon}</div>
        <div style={{ fontSize:11, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.8px", fontWeight:600 }}>{label}</div>
      </div>
      <div style={{ color:"#0f172a", fontSize:30, fontWeight:700, letterSpacing:"-1px", lineHeight:1 }}>{value ?? "—"}</div>
      {sub && <div style={{ color:"#94a3b8", fontSize:12, marginTop:8 }}>{sub}</div>}
    </div>
  );
}
