export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
      <div>
        <h1 style={{ color:"#0f172a", fontSize:22, fontWeight:700, margin:0, letterSpacing:"-0.3px" }}>{title}</h1>
        {subtitle && <p style={{ color:"#64748b", margin:"5px 0 0", fontSize:13.5 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
