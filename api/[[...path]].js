import { getStore } from "./lib/store.js";
import { needsLabTest, testStatusFromResult, adjustCostAfterTest } from "./lib/rules.js";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const segments = req.query.path || [];
  const route = segments.join("/");
  const items = getStore();

  if (route === "health" && req.method === "GET") {
    return res.json({
      success: true,
      service: "cima-api",
      mode: "colocated",
      database: "in-memory-demo",
    });
  }

  if (route === "items" && req.method === "GET") {
    return res.json({ success: true, items: [...items.values()] });
  }

  if (route === "items/test-queue" && req.method === "GET") {
    const queue = [...items.values()].filter(
      (i) => i.test && i.shape === "cube" && !i.testStatus
    );
    return res.json({ success: true, items: queue });
  }

  if (route === "items" && req.method === "POST") {
    const body = req.body || {};
    const id = crypto.randomUUID();
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

  const testMatch = route.match(/^items\/([^/]+)\/test-result$/);
  if (testMatch && req.method === "POST") {
    const item = items.get(testMatch[1]);
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
    return res.json({ success: true, item });
  }

  if (route === "cron/reminders" && req.method === "GET") {
    const overdue = [...items.values()].filter((i) => {
      const created = new Date(i.createDate);
      const ms = Date.now() - created.getTime();
      return i.test && i.shape === "cube" && !i.testStatus && ms >= 2 * 86400000;
    });
    return res.json({ success: true, overdueCount: overdue.length, overdue });
  }

  return res.status(404).json({ error: "NOT_FOUND", route });
}
