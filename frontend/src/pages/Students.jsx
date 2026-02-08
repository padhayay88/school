import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout.jsx";
import Topbar from "../components/Topbar.jsx";
import api from "../api";

const emptyForm = {
  fullName: "",
  className: "",
  section: "",
  rollNumber: "",
  parentContact: "",
  status: "active",
};

const Students = () => {
  const [detailsStudent, setDetailsStudent] = useState(null);
  const [pendingFees, setPendingFees] = useState(null);
  const [classReport, setClassReport] = useState([]);
  const [detailsError, setDetailsError] = useState("");
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/students");
      setStudents(data);
    } catch (error) {
      console.error("Failed to load students:", error);
      setStudents([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, form);
      } else {
        await api.post("/students", form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add student. Please check backend/API.");
    }
  };

  const startEdit = (student) => {
    setEditingId(student._id);
    setForm({
      fullName: student.fullName,
      className: student.className,
      section: student.section || "",
      rollNumber: student.rollNumber,
      parentContact: student.parentContact || "",
      status: student.status,
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/students/${id}`);
    load();
  };

  const handleViewDetails = async (student) => {
    setDetailsStudent(student);
    setDetailsError("");
    setPendingFees(null);
    setClassReport([]);
    try {
      // Fetch pending fees for this student
      const feesRes = await api.get(`/fees/payments/student/${student._id}`);
      setPendingFees(feesRes.data);
      // Fetch class report (all students in this class)
      const allStudents = students.filter(s => s.className === student.className);
      setClassReport(allStudents);
    } catch (err) {
      setDetailsError("Failed to load details. Please check backend/API.");
    }
  };

  return (
    <PageLayout>
      <Topbar title="Student Management" />
      <div className="card">
        <h3 style={{ marginTop: 0 }}>{editingId ? "Edit Student" : "Add Student"}</h3>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input
              placeholder="Full name"
              value={form.fullName}
              onChange={(event) => setForm({ ...form, fullName: event.target.value })}
              required
            />
            <input
              placeholder="Class"
              value={form.className}
              onChange={(event) => setForm({ ...form, className: event.target.value })}
              required
            />
            <input
              placeholder="Section"
              value={form.section}
              onChange={(event) => setForm({ ...form, section: event.target.value })}
            />
            <input
              placeholder="Roll number"
              value={form.rollNumber}
              onChange={(event) => setForm({ ...form, rollNumber: event.target.value })}
              required
            />
            <input
              placeholder="Parent contact"
              value={form.parentContact}
              onChange={(event) => setForm({ ...form, parentContact: event.target.value })}
            />
            <select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button type="submit">{editingId ? "Update" : "Add"}</button>
          {editingId && (
            <button
              type="button"
              className="secondary"
              style={{ marginLeft: 10 }}
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>Students</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Roll</th>
              <th>Parent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.fullName}</td>
                <td>{student.className}</td>
                <td>{student.section || "-"}</td>
                <td>{student.rollNumber}</td>
                <td>{student.parentContact || "-"}</td>
                <td>
                  <span className={`badge ${student.status}`}>{student.status}</span>
                </td>
                <td>
                  <button className="secondary" onClick={() => startEdit(student)}>
                    Edit
                  </button>
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => handleDelete(student._id)}
                  >
                    Delete
                  </button>
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => handleViewDetails(student)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detailsStudent && (
        <div className="card" style={{ marginTop: 18, background: "#f9f9f9" }}>
          <h3>Details for {detailsStudent.fullName} (Roll: {detailsStudent.rollNumber})</h3>
          {detailsError && <div style={{ color: "red" }}>{detailsError}</div>}
          <div>
            <strong>Pending Fees:</strong>
            <ul>
              {pendingFees && pendingFees.length > 0 ? (
                pendingFees.map((fee) => (
                  <li key={fee.id}>
                    Amount: {fee.amount_paid}, Paid On: {fee.paid_on}, Status: {fee.status}
                  </li>
                ))
              ) : (
                <li>No pending fees found.</li>
              )}
            </ul>
          </div>
          <div>
            <strong>Class Report ({detailsStudent.class_name}):</strong>
            <ul>
              {classReport.map((s) => (
                <li key={s.id}>
                  {s.full_name} (Roll: {s.roll_number}) - Status: {s.status}
                </li>
              ))}
            </ul>
          </div>
          <button style={{ marginTop: 10 }} onClick={() => setDetailsStudent(null)}>
            Close
          </button>
        </div>
      )}
    </PageLayout>
  );
};

export default Students;
