const { OWNER_EMAIL, OWNER_PASSWORD, generateAccessToken, generateRefreshToken, setCorsHeaders } = require("../_utils");

module.exports = (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
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

    // Set cookies
    const cookieOptions = "Path=/; HttpOnly; SameSite=Lax" + (process.env.COOKIE_SECURE === "true" ? "; Secure" : "");
    res.setHeader("Set-Cookie", [
      `accessToken=${accessToken}; Max-Age=900; ${cookieOptions}`,
      `refreshToken=${refreshToken}; Max-Age=604800; ${cookieOptions}`,
    ]);

    return res.status(200).json({
      owner: { id: owner.id, email: owner.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
