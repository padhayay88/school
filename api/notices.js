const { setCorsHeaders } = require("./_utils");

module.exports = (req, res) => {
  const origin = req.headers.origin;
  setCorsHeaders(res, origin);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Mock notices data (public endpoint)
  const notices = [
    { _id: "1", title: "School Reopening", content: "School will reopen on Monday", date: new Date().toISOString(), important: true },
    { _id: "2", title: "Annual Day", content: "Annual day celebration on 15th March", date: new Date().toISOString(), important: false },
  ];

  return res.status(200).json(notices);
};
