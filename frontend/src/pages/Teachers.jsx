import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout.jsx";
import Topbar from "../components/Topbar.jsx";
import api from "../api";

const emptyForm = {
  fullName: "",
  subject: "",
  classesAssigned: "",
  salary: "",
  status: "active",
};

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/teachers");
      setTeachers(data);
    } catch (error) {
      console.error("Failed to load teachers:", error);
      setTeachers([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const payload = { ...form, salary: form.salary ? Number(form.salary) : null };
    try {
      if (editingId) {
        await api.put(`/teachers/${editingId}`, payload);
      } else {
        await api.post("/teachers", payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add teacher. Please check backend/API.");
    }
  };

  const startEdit = (teacher) => {
    setEditingId(teacher._id);
    setForm({
      fullName: teacher.fullName,
      subject: teacher.subject,
      classesAssigned: teacher.classesAssigned || "",
      salary: teacher.salary || "",
      status: teacher.status,
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/teachers/${id}`);
    load();
  };

  return (
    <PageLayout>
      <Topbar title="Teacher Management" />
      <div className="card">
        <h3 style={{ marginTop: 0 }}>{editingId ? "Edit Teacher" : "Add Teacher"}</h3>
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
              placeholder="Subject"
              value={form.subject}
              onChange={(event) => setForm({ ...form, subject: event.target.value })}
              required
            />
            <input
              placeholder="Classes assigned"
              value={form.classesAssigned}
              onChange={(event) =>
                setForm({ ...form, classesAssigned: event.target.value })
              }
            />
            <input
              placeholder="Salary (optional)"
              value={form.salary}
              onChange={(event) => setForm({ ...form, salary: event.target.value })}
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
        <h3 style={{ marginTop: 0 }}>Teachers</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Classes</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td>{teacher.fullName}</td>
                <td>{teacher.subject}</td>
                <td>{teacher.classesAssigned || "-"}</td>
                <td>{teacher.salary ? `$${teacher.salary}` : "-"}</td>
                <td>
                  <span className={`badge ${teacher.status}`}>{teacher.status}</span>
                </td>
                <td>
                  <button className="secondary" onClick={() => startEdit(teacher)}>
                    Edit
                  </button>
                  <button
                    style={{ marginLeft: 8 }}
                    onClick={() => handleDelete(teacher._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageLayout>
  );
};

export default Teachers;
