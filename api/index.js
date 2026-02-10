const jwt = require("jsonwebtoken");

// --------------------- CONFIG ---------------------
const OWNER_EMAIL = process.env.OWNER_EMAIL || "owner@school.local";
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "ChangeMe123!";
const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "simple-secret-key-12345";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "simple-refresh-key-12345";

// --------------------- MOCK DATA ---------------------
let students = [];
let teachers = [];
let feeStructures = [];
let payments = [];
let mobileVersionEnabled = true;
    // ===================== MOBILE VERSION TOGGLE =====================
    if (resource === "mobile-version") {
      if (req.method === "GET") {
        return res.status(200).json({ mobileVersion: mobileVersionEnabled });
      }
      if (req.method === "POST") {
        const { enabled } = req.body || {};
        if (typeof enabled === "boolean") {
          mobileVersionEnabled = enabled;
          return res.status(200).json({ mobileVersion: mobileVersionEnabled });
        }
        return res.status(400).json({ message: "Missing or invalid 'enabled' boolean" });
      }
      return res.status(405).json({ message: "Method not allowed" });
    }

let teachers = [
  { _id: "1", fullName: "Mr. Rajesh Gupta", subject: "Mathematics", classesAssigned: ["9th", "10th"], salary: 35000, status: "active" },
  { _id: "2", fullName: "Mrs. Sunita Devi", subject: "Science", classesAssigned: ["10th"], salary: 32000, status: "active" },
  { _id: "3", fullName: "Mr. Arun Verma", subject: "Hindi", classesAssigned: ["8th", "9th"], salary: 28000, status: "active" },
];

let feeStructures = [
  { _id: "1", className: "9th", amount: 25000 },
  { _id: "2", className: "10th", amount: 30000 },
];

let payments = [
  { _id: "1", studentId: { _id: "1", fullName: "Rahul Kumar" }, amountPaid: 15000, paidOn: new Date().toISOString(), status: "paid" },
  { _id: "2", studentId: { _id: "2", fullName: "Priya Sharma" }, amountPaid: 30000, paidOn: new Date().toISOString(), status: "paid" },
];

// --------------------- HELPERS ---------------------
const setCorsHeaders = (res, origin) => {
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
};

const parseCookies = (req) => {
  const cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      cookies[name] = decodeURIComponent(value || "");
    });
  }
  return cookies;
};

const generateAccessToken = (owner) =>
  jwt.sign({ ownerId: owner.id, email: owner.email }, JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (owner) =>
  jwt.sign({ ownerId: owner.id, tokenVersion: 1 }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

const verifyToken = (token, secret) => {
  try { return jwt.verify(token, secret); } catch { return null; }
};

const requireAuth = (req) => {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = parseCookies(req).accessToken;
  }
  if (!token) return null;
  const payload = verifyToken(token, JWT_SECRET);
  return payload ? { id: payload.ownerId, email: payload.email } : null;
};

// --------------------- HANDLER ---------------------
module.exports = (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);
  
  if (req.method === "OPTIONS") return res.status(200).end();

  const url = req.url.split("?")[0];
  const parts = url.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const resource = parts[0] || "";
  const subPath = parts.slice(1).join("/");

  try {
    // ===================== HEALTH =====================
    if (resource === "health") {
      return res.status(200).json({ status: "ok", timestamp: new Date().toISOString(), mobileVersion: mobileVersionEnabled });
    }

    // ===================== NOTICES (public) =====================
    if (resource === "notices") {
      return res.status(200).json({ notices: [], mobileVersion: mobileVersionEnabled });
    }

    // ===================== AUTH =====================
    if (resource === "auth") {
      // POST /api/auth/login
      if (subPath === "login" && req.method === "POST") {
        const { email, password } = req.body || {};
        if (!email || !password) {
          return res.status(400).json({ message: "Email and password required" });
        }
        if (email !== OWNER_EMAIL || password !== OWNER_PASSWORD) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        const owner = { id: "owner-1", email: OWNER_EMAIL };
        const accessToken = generateAccessToken(owner);
        const refreshToken = generateRefreshToken(owner);
        const cookieOpts = "Path=/; HttpOnly; SameSite=Lax";
        res.setHeader("Set-Cookie", [
          `accessToken=${accessToken}; Max-Age=900; ${cookieOpts}`,
          `refreshToken=${refreshToken}; Max-Age=604800; ${cookieOpts}`,
        ]);
        return res.status(200).json({ owner: { id: owner.id, email: owner.email }, accessToken, refreshToken });
        return res.status(200).json({ owner: { id: owner.id, email: owner.email }, accessToken, refreshToken, mobileVersion: mobileVersionEnabled });
      }

      // POST /api/auth/logout
      if (subPath === "logout") {
        res.setHeader("Set-Cookie", [
          "accessToken=; Path=/; HttpOnly; Max-Age=0",
          "refreshToken=; Path=/; HttpOnly; Max-Age=0",
        ]);
        return res.status(200).json({ message: "Logged out" });
      }

      // POST /api/auth/refresh
      if (subPath === "refresh" && req.method === "POST") {
        const token = (req.body && req.body.refreshToken) || parseCookies(req).refreshToken;
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        const payload = verifyToken(token, JWT_REFRESH_SECRET);
        if (!payload) return res.status(401).json({ message: "Unauthorized" });
        const owner = { id: payload.ownerId, email: OWNER_EMAIL };
        const accessToken = generateAccessToken(owner);
        res.setHeader("Set-Cookie", `accessToken=${accessToken}; Max-Age=900; Path=/; HttpOnly; SameSite=Lax`);
        return res.status(200).json({ owner: { id: owner.id, email: owner.email }, accessToken });
        return res.status(200).json({ owner: { id: owner.id, email: owner.email }, accessToken, mobileVersion: mobileVersionEnabled });
      }

      // GET /api/auth/me
      if (subPath === "me" && req.method === "GET") {
        const owner = requireAuth(req);
        if (!owner) return res.status(401).json({ message: "Unauthorized" });
        return res.status(200).json({ owner });
        return res.status(200).json({ owner, mobileVersion: mobileVersionEnabled });
      }

      return res.status(404).json({ message: "Auth endpoint not found" });
    }

    // ===================== PROTECTED ROUTES =====================
    const owner = requireAuth(req);
    if (!owner) return res.status(401).json({ message: "Unauthorized" });

    // ===================== DASHBOARD =====================
    if (resource === "dashboard") {
      if (subPath === "summary" || subPath === "") {
        return res.status(200).json({
          students: students.length,
          teachers: teachers.length,
          totalFeesCollected: payments.reduce((sum, p) => sum + p.amountPaid, 0),
          totalPendingFees: 0,
          mobileVersion: mobileVersionEnabled
        });
      }
      if (subPath === "monthly-fees") {
        return res.status(200).json([
        return res.status(200).json({ monthly: [], mobileVersion: mobileVersionEnabled });
      }
      return res.status(404).json({ message: "Not found" });
    }

    // ===================== STUDENTS =====================
    if (resource === "students") {
      const id = parts[1] || null;
      
      if (!id && req.method === "GET") {
        return res.status(200).json(students);
        return res.status(200).json({ students, mobileVersion: mobileVersionEnabled });
      }
      if (!id && req.method === "POST") {
        const { fullName, className, section, rollNumber, parentContact, status } = req.body || {};
        if (!fullName || !className || !rollNumber) {
          return res.status(400).json({ message: "Required fields missing" });
        }
        const student = { _id: Date.now().toString(), fullName, className, section, rollNumber, parentContact, status: status || "active" };
        students.push(student);
        return res.status(201).json(student);
        return res.status(201).json({ student, mobileVersion: mobileVersionEnabled });
      }
      if (id && req.method === "GET") {
        const student = students.find(s => s._id === id);
        if (!student) return res.status(404).json({ message: "Not found" });
        return res.status(200).json(student);
        return res.status(200).json({ student, mobileVersion: mobileVersionEnabled });
      }
      if (id && req.method === "PUT") {
        const idx = students.findIndex(s => s._id === id);
        if (idx === -1) return res.status(404).json({ message: "Not found" });
        students[idx] = { ...students[idx], ...req.body };
        return res.status(200).json(students[idx]);
        return res.status(200).json({ student: students[idx], mobileVersion: mobileVersionEnabled });
      }
      if (id && req.method === "DELETE") {
        students = students.filter(s => s._id !== id);
        return res.status(200).json({ message: "Deleted" });
        return res.status(200).json({ message: "Deleted", mobileVersion: mobileVersionEnabled });
      }
      return res.status(405).json({ message: "Method not allowed" });
    }

    // ===================== TEACHERS =====================
    if (resource === "teachers") {
      const id = parts[1] || null;
      
      if (!id && req.method === "GET") {
        return res.status(200).json(teachers);
        return res.status(200).json({ teachers, mobileVersion: mobileVersionEnabled });
      }
      if (!id && req.method === "POST") {
        const { fullName, subject, classesAssigned, salary, status } = req.body || {};
        if (!fullName || !subject) {
          return res.status(400).json({ message: "Required fields missing" });
        }
        const teacher = { _id: Date.now().toString(), fullName, subject, classesAssigned, salary, status: status || "active" };
        teachers.push(teacher);
        return res.status(201).json(teacher);
        return res.status(201).json({ teacher, mobileVersion: mobileVersionEnabled });
      }
      if (id && req.method === "GET") {
        const teacher = teachers.find(t => t._id === id);
        if (!teacher) return res.status(404).json({ message: "Not found" });
        return res.status(200).json(teacher);
        return res.status(200).json({ teacher, mobileVersion: mobileVersionEnabled });
      }
      if (id && req.method === "PUT") {
        const idx = teachers.findIndex(t => t._id === id);
        if (idx === -1) return res.status(404).json({ message: "Not found" });
        teachers[idx] = { ...teachers[idx], ...req.body };
        return res.status(200).json(teachers[idx]);
        return res.status(200).json({ teacher: teachers[idx], mobileVersion: mobileVersionEnabled });
        return res.status(200).json({ message: "Deleted", mobileVersion: mobileVersionEnabled });
      }
      if (id && req.method === "DELETE") {
        teachers = teachers.filter(t => t._id !== id);
        return res.status(200).json({ message: "Deleted" });
      }
      return res.status(405).json({ message: "Method not allowed" });
    }

    // ===================== FEES =====================
    if (resource === "fees") {
      // GET/POST /api/fees/structures
      if (parts[1] === "structures") {
        const structureId = parts[2] || null;
        
        if (!structureId && req.method === "GET") {
          return res.status(200).json(feeStructures);
          return res.status(200).json({ feeStructures, mobileVersion: mobileVersionEnabled });
        }
        if (!structureId && req.method === "POST") {
          const { className, amount } = req.body || {};
          if (!className || amount === undefined) {
            return res.status(400).json({ message: "Required fields missing" });
          }
          const structure = { _id: Date.now().toString(), className, amount };
          feeStructures.push(structure);
          return res.status(201).json(structure);
          return res.status(201).json({ structure, mobileVersion: mobileVersionEnabled });
        }
        if (structureId && req.method === "PUT") {
          const idx = feeStructures.findIndex(f => f._id === structureId);
          if (idx === -1) return res.status(404).json({ message: "Not found" });
          feeStructures[idx] = { ...feeStructures[idx], ...req.body };
          return res.status(200).json(feeStructures[idx]);
          return res.status(200).json({ structure: feeStructures[idx], mobileVersion: mobileVersionEnabled });
          return res.status(200).json({ message: "Deleted", mobileVersion: mobileVersionEnabled });
        }
        if (structureId && req.method === "DELETE") {
          feeStructures = feeStructures.filter(f => f._id !== structureId);
          return res.status(200).json({ message: "Deleted" });
        }
      }

      // GET/POST /api/fees/payments
      if (parts[1] === "payments") {
        // GET /api/fees/payments/student/:studentId
        if (parts[2] === "student" && parts[3]) {
          const studentPayments = payments.filter(p => 
            (p.studentId._id === parts[3]) || (p.studentId === parts[3])
          );
          return res.status(200).json(studentPayments);
        }
        
        const paymentId = parts[2] || null;
        
        if (!paymentId && req.method === "GET") {
          return res.status(200).json(payments);
          return res.status(200).json({ payments, mobileVersion: mobileVersionEnabled });
        }
        if (!paymentId && req.method === "POST") {
          const { studentId, amountPaid, paidOn, status } = req.body || {};
          if (!studentId || amountPaid === undefined) {
            return res.status(400).json({ message: "Required fields missing" });
          }
          const payment = { _id: Date.now().toString(), studentId, amountPaid, paidOn: paidOn || new Date().toISOString(), status: status || "paid" };
          payments.push(payment);
          return res.status(201).json(payment);
          return res.status(201).json({ payment, mobileVersion: mobileVersionEnabled });
          return res.status(200).json({ message: "Deleted", mobileVersion: mobileVersionEnabled });
          return res.status(200).json({ payments: studentPayments, mobileVersion: mobileVersionEnabled });
          return res.status(200).json({ students, mobileVersion: mobileVersionEnabled });
          return res.status(200).json({ payments, mobileVersion: mobileVersionEnabled });
        }
        if (paymentId && req.method === "DELETE") {
          payments = payments.filter(p => p._id !== paymentId);
          return res.status(200).json({ message: "Deleted" });
        }
      }

      return res.status(404).json({ message: "Not found" });
    }

    // ===================== REPORTS =====================
    if (resource === "reports") {
      if (parts[1] === "students") {
        return res.status(200).json(students);
      }
      if (parts[1] === "fees") {
        return res.status(200).json(payments);
      }
      if (parts[1] === "pending-dues") {
        return res.status(200).json([
        return res.status(200).json({ pendingDues: [], mobileVersion: mobileVersionEnabled });
      }
      return res.status(404).json({ message: "Not found" });
    }

    // ===================== NOT FOUND =====================
    return res.status(404).json({ message: "Endpoint not found" });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
