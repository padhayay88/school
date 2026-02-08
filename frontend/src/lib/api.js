import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export const getMe = () => api.get("/auth/me");
export const login = (payload) => api.post("/auth/login", payload);
export const logout = () => api.post("/auth/logout");
export const refresh = () => api.post("/auth/refresh");

export const fetchDashboard = () => api.get("/dashboard/summary");
export const fetchMonthlyFees = () => api.get("/dashboard/monthly-fees");

export const fetchStudents = () => api.get("/students");
export const createStudent = (payload) => api.post("/students", payload);
export const updateStudent = (id, payload) => api.put(`/students/${id}`, payload);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

export const fetchTeachers = () => api.get("/teachers");
export const createTeacher = (payload) => api.post("/teachers", payload);
export const updateTeacher = (id, payload) => api.put(`/teachers/${id}`, payload);
export const deleteTeacher = (id) => api.delete(`/teachers/${id}`);

export const fetchFeeStructures = () => api.get("/fees/structures");
export const createFeeStructure = (payload) => api.post("/fees/structures", payload);
export const updateFeeStructure = (id, payload) => api.put(`/fees/structures/${id}`, payload);

export const fetchPayments = () => api.get("/fees/payments");
export const recordPayment = (payload) => api.post("/fees/payments", payload);
export const fetchStudentPayments = (studentId) => api.get(`/fees/payments/student/${studentId}`);

export const reportStudents = () => api.get("/reports/students");
export const reportFees = () => api.get("/reports/fees");
export const reportPending = () => api.get("/reports/pending-dues");

export default api;
