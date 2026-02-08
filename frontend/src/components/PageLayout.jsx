import React from "react";
import Sidebar from "./Sidebar.jsx";

const PageLayout = ({ children }) => (
  <div className="app-shell">
    <Sidebar />
    <main className="content">{children}</main>
  </div>
);

export default PageLayout;
