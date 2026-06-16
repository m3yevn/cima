const { cors, handleOptions } = require("./lib/http");

module.exports = (req, res) => {
  if (handleOptions(req, res)) return;
  cors(res);
  res.json({
    success: true,
    service: "cima-api",
    mode: "colocated",
    database: "in-memory-demo",
  });
};
