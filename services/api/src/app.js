import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { needsLabTest, testStatusFromResult, adjustCostAfterTest } from "../../../packages/shared/itemRules.js";

configDotenv();

const items = new Map();

export async function createApp() {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      service: "cima-api",
      database: process.env.MONGODB_STRING ? "configured" : "NOT_CONFIGURED",
    });
  });

  app.get("/items", (_req, res) => {
    res.json({ success: true, items: [...items.values()] });
  });

  app.get("/items/test-queue", (_req, res) => {
    const queue = [...items.values()].filter(
      (i) => i.test && i.shape === "cube" && !i.testStatus
    );
    res.json({ success: true, items: queue });
  });

  app.post("/items", (req, res) => {
    const body = req.body || {};
    const id = crypto.randomUUID();
    const test = needsLabTest({ shape: body.shape || "cube", weight: Number(body.weight) || 0 });
    const item = {
      id,
      itemName: String(body.itemName || "").trim(),
      description: String(body.description || ""),
      cost: Number(body.cost) || 0,
      weight: Number(body.weight) || 0,
      shape: body.shape || "cube",
      test,
      testStatus: test ? null : null,
      result: 0,
      image: body.image || null,
      createDate: new Date().toISOString(),
    };
    if (!item.itemName) {
      return res.status(400).json({ error: "VALIDATION", message: "itemName required" });
    }
    items.set(id, item);
    res.status(201).json({ success: true, item });
  });

  app.post("/items/:id/test-result", (req, res) => {
    const item = items.get(req.params.id);
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
  });

  app.get("/cron/reminders", (_req, res) => {
    const overdue = [...items.values()].filter((i) => {
      const created = new Date(i.createDate);
      const ms = Date.now() - created.getTime();
      return i.test && i.shape === "cube" && !i.testStatus && ms >= 2 * 86400000;
    });
    res.json({ success: true, overdueCount: overdue.length, overdue });
  });

  return app;
}
