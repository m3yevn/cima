const { cors, handleOptions } = require("../lib/http");
const { getStore } = require("../lib/store");

module.exports = (req, res) => {
  if (handleOptions(req, res)) return;
  cors(res);
  if (req.method !== "GET") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

  const items = getStore();
  const queue = [...items.values()].filter(
    (i) => i.test && i.shape === "cube" && !i.testStatus
  );
  res.json({ success: true, items: queue });
};
