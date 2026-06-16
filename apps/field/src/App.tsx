import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "https://cima-api.vercel.app";

type Item = {
  id: string;
  itemName: string;
  weight: number;
  shape: string;
  cost: number;
  test: boolean;
  testStatus: string | null;
  result: number;
};

export default function App() {
  const [tab, setTab] = useState<"cima" | "lab">("cima");
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({ itemName: "", weight: "", cost: "", shape: "cube" });
  const [error, setError] = useState("");

  async function load() {
    const path = tab === "lab" ? "/items/test-queue" : "/items";
    const res = await fetch(`${API}${path}`);
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    load().catch(() => setError("API unavailable — deploy cima-api or run locally on :4010"));
  }, [tab]);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch(`${API}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemName: form.itemName,
        weight: Number(form.weight),
        cost: Number(form.cost),
        shape: form.shape,
      }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.message || "Failed to add item");
      return;
    }
    setForm({ itemName: "", weight: "", cost: "", shape: "cube" });
    load();
  }

  async function submitResult(id: string, result: number) {
    await fetch(`${API}/items/${id}/test-result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result }),
    });
    load();
  }

  return (
    <div className="shell">
      <header>
        <strong>CIMA Field</strong>
        <a href="/">← Site</a>
      </header>
      <nav>
        <button type="button" className={tab === "cima" ? "active" : ""} onClick={() => setTab("cima")}>
          Delivery
        </button>
        <button type="button" className={tab === "lab" ? "active" : ""} onClick={() => setTab("lab")}>
          Lab queue
        </button>
      </nav>
      {error && <p className="error">{error}</p>}
      {tab === "cima" && (
        <form className="form" onSubmit={addItem}>
          <h2>New delivery</h2>
          <input placeholder="Item name" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} required />
          <input type="number" placeholder="Weight (kg)" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required />
          <input type="number" placeholder="Cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} required />
          <select value={form.shape} onChange={(e) => setForm({ ...form, shape: e.target.value })}>
            <option value="cube">Cube</option>
            <option value="cone">Cone</option>
            <option value="sphere">Sphere</option>
          </select>
          <button type="submit">Add item</button>
        </form>
      )}
      <ul className="list">
        {items.map((i) => (
          <li key={i.id}>
            <div>
              <strong>{i.itemName}</strong>
              <span>{i.weight}kg · {i.shape} · ${i.cost}</span>
              {i.test && <span className="tag">{i.testStatus || "pending test"}</span>}
            </div>
            {tab === "lab" && !i.testStatus && (
              <button type="button" onClick={() => submitResult(i.id, 55)}>
                Submit 55% (FAIL demo)
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
