const { randomUUID } = require("crypto");
const { cors, handleOptions } = require("./lib/http");
const { getStore } = require("./lib/store");
const { needsLabTest } = require("./lib/rules");

module.exports = (req, res) => {
  if (handleOptions(req, res)) return;
  cors(res);
  const items = getStore();

  if (req.method === "GET") {
    return res.json({ success: true, items: [...items.values()] });
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const id = randomUUID();
    const test = needsLabTest({
      shape: body.shape || "cube",
      weight: Number(body.weight) || 0,
    });
    const item = {
      id,
      itemName: String(body.itemName || "").trim(),
      description: String(body.description || ""),
      cost: Number(body.cost) || 0,
      weight: Number(body.weight) || 0,
      shape: body.shape || "cube",
      test,
      testStatus: null,
      result: 0,
      image: body.image || null,
      createDate: new Date().toISOString(),
    };
    if (!item.itemName) {
      return res.status(400).json({ error: "VALIDATION", message: "itemName required" });
    }
    items.set(id, item);
    return res.status(201).json({ success: true, item });
  }

  return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
};
