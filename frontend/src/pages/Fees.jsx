import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout.jsx";
import Topbar from "../components/Topbar.jsx";
import api from "../api";

const Fees = () => {
  const [structures, setStructures] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [structureForm, setStructureForm] = useState({ className: "", amount: "" });
  const [editingStructureId, setEditingStructureId] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    studentId: "",
    amountPaid: "",
    paidOn: "",
    status: "paid",
  });

  const load = async () => {
    try {
      const [structuresRes, paymentsRes, studentsRes] = await Promise.all([
        api.get("/fees/structures"),
        api.get("/fees/payments"),
        api.get("/students"),
      ]);
      setStructures(structuresRes.data);
      setPayments(paymentsRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error("Failed to load fees:", error);
      setStructures([]);
      setPayments([]);
      setStudents([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStructureSubmit = async (event) => {
    event.preventDefault();
    if (editingStructureId) {
      await api.put(`/fees/structures/${editingStructureId}`, {
        className: structureForm.className,
        amount: Number(structureForm.amount),
      });
    } else {
      await api.post("/fees/structures", {
        className: structureForm.className,
        amount: Number(structureForm.amount),
      });
    }
    setStructureForm({ className: "", amount: "" });
    setEditingStructureId(null);
    load();
  };

  const startEditStructure = (item) => {
    setEditingStructureId(item._id);
    setStructureForm({ className: item.className, amount: item.amount });
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    await api.post("/fees/payments", {
      studentId: paymentForm.studentId,
      amountPaid: Number(paymentForm.amountPaid),
      paidOn: paymentForm.paidOn,
      status: paymentForm.status,
    });
    setPaymentForm({ studentId: "", amountPaid: "", paidOn: "", status: "paid" });
    load();
  };

  return (
    <PageLayout>
      <Topbar title="Fee Management" />
      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          {editingStructureId ? "Edit Fee Structure" : "Define Fee Structure"}
        </h3>
        <form onSubmit={handleStructureSubmit}>
          <div className="form-grid">
            <input
              placeholder="Class name"
              value={structureForm.className}
              onChange={(event) =>
                setStructureForm({ ...structureForm, className: event.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Fee amount"
              value={structureForm.amount}
              onChange={(event) =>
                setStructureForm({ ...structureForm, amount: event.target.value })
              }
              required
            />
          </div>
          <button type="submit">{editingStructureId ? "Update" : "Add"}</button>
          {editingStructureId && (
            <button
              type="button"
              className="secondary"
              style={{ marginLeft: 10 }}
              onClick={() => {
                setEditingStructureId(null);
                setStructureForm({ className: "", amount: "" });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>Fee Structures</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {structures.map((item) => (
              <tr key={item._id}>
                <td>{item.className}</td>
                <td>Rs {item.amount}</td>
                <td>
                  <button className="secondary" onClick={() => startEditStructure(item)}>
                    Edit
                  </button>
                  <button
                    style={{ marginLeft: 8, background: "#ef4444", color: "white" }}
                    onClick={async () => {
                      if (window.confirm("Delete this fee structure?")) {
                        try {
                          await api.delete(`/fees/structures/${item._id}`);
                          load();
                        } catch (err) {
                          alert("Failed to delete fee structure");
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>Record Payment</h3>
        <form onSubmit={handlePaymentSubmit}>
          <div className="form-grid">
            <select
              value={paymentForm.studentId}
              onChange={(event) =>
                setPaymentForm({ ...paymentForm, studentId: event.target.value })
              }
              required
            >
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.fullName} - {student.className}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount paid"
              value={paymentForm.amountPaid}
              onChange={(event) =>
                setPaymentForm({ ...paymentForm, amountPaid: event.target.value })
              }
              required
            />
            <input
              type="date"
              value={paymentForm.paidOn}
              onChange={(event) =>
                setPaymentForm({ ...paymentForm, paidOn: event.target.value })
              }
            />
            <select
              value={paymentForm.status}
              onChange={(event) =>
                setPaymentForm({ ...paymentForm, status: event.target.value })
              }
            >
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
          <button type="submit">Record</button>
        </form>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3 style={{ marginTop: 0 }}>Payment History</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Amount</th>
              <th>Paid On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td>{p.studentId?.fullName || 'N/A'}</td>
                <td>Rs {p.amountPaid}</td>
                <td>{new Date(p.paidOn).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${p.status}`}>{p.status}</span>
                </td>
                <td>
                  <button
                    style={{ marginLeft: 8, background: "#ef4444", color: "white" }}
                    onClick={async () => {
                      if (window.confirm("Delete this payment?")) {
                        try {
                          await api.delete(`/fees/payments/${p._id}`);
                          load();
                        } catch (err) {
                          alert("Failed to delete payment");
                        }
                      }
                    }}
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

export default Fees;
