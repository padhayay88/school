import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Topbar = ({ title }) => {
  const { owner, logout } = useAuth();

  return (
    <div className="topbar">
      <div>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Welcome back, {owner?.email}
        </div>
      </div>
      <button className="secondary" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Topbar;
