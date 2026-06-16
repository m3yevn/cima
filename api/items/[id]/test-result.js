const { cors, handleOptions } = require("../../lib/http");
const { getStore } = require("../../lib/store");
const { testStatusFromResult, adjustCostAfterTest } = require("../../lib/rules");

module.exports = (req, res) => {
  if (handleOptions(req, res)) return;
  cors(res);
  if (req.method !== "POST") return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });

  const items = getStore();
  const item = items.get(req.query.id);
  if (!item) return res.status(404).json({ error: "NOT_FOUND" });

  const result = Number(req.body?.result);
  if (Number.isNaN(result)) {
    return res.status(400).json({ error: "VALIDATION", message: "result required" });
  }

  const testStatus = testStatusFromResult(result);
  item.result = result;
  item.testStatus = testStatus;
  item.cost = adjustCostAfterTest(item.cost, testStatus);
  items.set(item.id, item);
  res.json({ success: true, item });
};
