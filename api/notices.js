module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  
  if (req.method === "OPTIONS") return res.status(200).end();

  // Mock notices (public endpoint)
  const notices = [
    { _id: "1", title: "School Reopening", content: "School will reopen on Monday", date: new Date().toISOString(), important: true },
    { _id: "2", title: "Annual Day", content: "Annual day celebration on 15th March", date: new Date().toISOString(), important: false },
  ];

  return res.status(200).json(notices);
};
