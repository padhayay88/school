const { OWNER_EMAIL, generateAccessToken, verifyRefreshToken, parseCookies, setCorsHeaders } = require("../_utils");

module.exports = (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const cookies = parseCookies(req);
    const token = (req.body && req.body.refreshToken) || cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = verifyRefreshToken(token);
    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const owner = { id: payload.ownerId, email: OWNER_EMAIL };
    const accessToken = generateAccessToken(owner);

    const cookieOptions = "Path=/; HttpOnly; SameSite=Lax" + (process.env.COOKIE_SECURE === "true" ? "; Secure" : "");
    res.setHeader("Set-Cookie", `accessToken=${accessToken}; Max-Age=900; ${cookieOptions}`);

    return res.status(200).json({
      owner: { id: owner.id, email: owner.email },
      accessToken,
    });
  } catch (error) {
    console.error("Refresh error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
