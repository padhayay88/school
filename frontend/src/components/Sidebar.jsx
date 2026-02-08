import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-logo">
      <span>SO</span>
      <div>
        <div>School Owner</div>
        <small>ERP Console</small>
      </div>
    </div>
    <nav className="nav-links">
      <NavLink className="nav-link" to="/dashboard">
        Dashboard
      </NavLink>
      <NavLink className="nav-link" to="/students">
        Students
      </NavLink>
      <NavLink className="nav-link" to="/teachers">
        Teachers
      </NavLink>
      <NavLink className="nav-link" to="/fees">
        Fees
      </NavLink>
      <NavLink className="nav-link" to="/reports">
        Reports
      </NavLink>
    </nav>
    <div style={{ marginTop: "auto", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
      Private owner-only portal.
    </div>
  </aside>
);

export default Sidebar;
