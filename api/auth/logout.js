const { setCorsHeaders } = require("../_utils");

module.exports = (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Clear cookies
  const cookieOptions = "Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
  res.setHeader("Set-Cookie", [
    `accessToken=; ${cookieOptions}`,
    `refreshToken=; ${cookieOptions}`,
  ]);

  return res.status(200).json({ message: "Logged out" });
};
