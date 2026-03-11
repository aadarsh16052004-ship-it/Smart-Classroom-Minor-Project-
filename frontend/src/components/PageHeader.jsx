export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start",
      justifyContent: "space-between", marginBottom: 28,
      flexWrap: "wrap", gap: 12,
    }}>
      <div>
        <h1 style={{
          color: "#f0f4ff", fontSize: 26, fontWeight: 700,
          margin: 0, letterSpacing: "-0.5px",
        }}>{title}</h1>
        {subtitle && <p style={{ color: "#64748b", margin: "6px 0 0", fontSize: 14 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
