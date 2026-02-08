import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Form submitted with:", { email, password: "***" });
      await login({ email, password });
      console.log("Login successful, redirecting...");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      const userData = { email, password: "***" };
      setError(`Login failed. Please check your credentials. (${err.response?.status || err.message})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Link to="/" className="login-home-link">← Back to Home</Link>
      <form className="login-card" onSubmit={handleSubmit}>
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <h2 style={{ margin: 0, color: "#0a1f44" }}>Unique English Boarding School</h2>
          <p style={{ margin: "4px 0", color: "#64748b", fontSize: "0.9rem" }}>Admin Dashboard</p>
        </div>
        <h1>Owner Login</h1>
        <p>Secure console for school owner only.</p>
        <div className="form-grid">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
