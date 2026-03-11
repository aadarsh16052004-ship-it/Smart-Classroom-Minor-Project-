export default function StatCard({ icon, label, value, color = "#3b82f6", sub }) {
  return (
    <div style={{
      background: "rgba(15,23,42,0.9)",
      border: `1px solid ${color}33`,
      borderRadius: 16, padding: "22px 24px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${color}22, transparent 70%)`,
      }} />
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <div style={{ color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 }}>{label}</div>
      <div style={{ color: "#f0f4ff", fontSize: 32, fontWeight: 700, letterSpacing: "-1px" }}>{value ?? "—"}</div>
      {sub && <div style={{ color: "#475569", fontSize: 12, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
