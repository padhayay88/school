import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout.jsx";
import Topbar from "../components/Topbar.jsx";
import api from "../api";

const Reports = () => {
  const [studentReport, setStudentReport] = useState([]);
  const [feeReport, setFeeReport] = useState([]);
  const [pendingReport, setPendingReport] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [studentsRes, feesRes, pendingRes] = await Promise.all([
          api.get("/reports/students"),
          api.get("/reports/fees"),
          api.get("/reports/pending-dues"),
        ]);
        setStudentReport(studentsRes.data);
        setFeeReport(feesRes.data);
        setPendingReport(pendingRes.data);
      } catch (error) {
        console.error("Failed to load reports:", error);
        setStudentReport([]);
        setFeeReport([]);
        setPendingReport([]);
      }
    };
    load();
  }, []);

  return (
    <PageLayout>
      <Topbar title="Reports" />
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Student List Report</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Roll</th>
              <th>Parent</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {studentReport.map((row, index) => (
              <tr key={`${row.rollNumber}-${index}`}>
                <td>{row.fullName}</td>
                <td>{row.className}</td>
                <td>{row.section || "-"}</td>
                <td>{row.rollNumber}</td>
                <td>{row.parentContact || "-"}</td>
                <td>
                  <span className={`badge ${row.status}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>Fee Collection Report</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {feeReport.map((row) => (
              <tr key={row._id}>
                <td>{row.studentId?.fullName || "Unknown"}</td>
                <td>{row.studentId?.className || "N/A"}</td>
                <td>Rs {row.amountPaid}</td>
                <td>{new Date(row.paidOn).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${row.status}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>Pending Dues Report</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Total Fee</th>
              <th>Paid</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {pendingReport.map((row) => (
              <tr key={row.fullName}>
                <td>{row.fullName}</td>
                <td>{row.className}</td>
                <td>Rs {row.totalFee}</td>
                <td>Rs {row.paid}</td>
                <td>Rs {row.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
};

export default Reports;
