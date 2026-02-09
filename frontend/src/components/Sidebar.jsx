import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>SO</span>
        <div>
          <div>School Owner</div>
          <small>ERP Console</small>
        </div>
      </div>
      
      <button className="hamburger" onClick={toggleMobileMenu} title="Menu">
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
        <NavLink 
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/dashboard"
          onClick={() => setMobileMenuOpen(false)}
        >
          📊 Dashboard
        </NavLink>
        <NavLink 
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/students"
          onClick={() => setMobileMenuOpen(false)}
        >
          👨‍🎓 Students
        </NavLink>
        <NavLink 
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/teachers"
          onClick={() => setMobileMenuOpen(false)}
        >
          👨‍🏫 Teachers
        </NavLink>
        <NavLink 
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/fees"
          onClick={() => setMobileMenuOpen(false)}
        >
          💳 Fees
        </NavLink>
        <NavLink 
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          to="/reports"
          onClick={() => setMobileMenuOpen(false)}
        >
          📈 Reports
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button 
          onClick={handleLogout}
          style={{ width: "100%", background: "rgba(255,255,255,0.2)", color: "#fff" }}
        >
          🚪 Logout
        </button>
        <div style={{ marginTop: "12px", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
          Private owner-only portal.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
