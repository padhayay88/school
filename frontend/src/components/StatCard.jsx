import React from "react";

const StatCard = ({ title, value }) => {
  // Icon mapping for different stat types
  const getIcon = (title) => {
    if (title.includes("Student")) return "👥";
    if (title.includes("Teacher")) return "🎓";
    if (title.includes("Collection")) return "💰";
    if (title.includes("Pending")) return "⏳";
    return "📊";
  };

  return (
    <div className="card" style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: "140px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background accent */}
      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        fontSize: "4rem",
        opacity: 0.08,
      }}>
        {getIcon(title)}
      </div>
      
      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}>
          <span style={{ fontSize: "1.5rem" }}>{getIcon(title)}</span>
          <div className="card-title" style={{ margin: 0 }}>{title}</div>
        </div>
        <div className="card-value" style={{ margin: 0 }}>{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
