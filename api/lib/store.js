const items = new Map();

function seed() {
  if (items.size > 0) return;
  const demos = [
    {
      id: "demo-rebar-a",
      itemName: "WSR Rebar Bundle A",
      description: "Standard delivery — under test threshold",
      cost: 1200,
      weight: 8,
      shape: "cube",
      test: false,
      testStatus: null,
      result: 0,
      image: null,
      createDate: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "demo-rebar-b",
      itemName: "WSR Rebar Bundle B",
      description: "Cube over 10kg — pending lab test",
      cost: 2400,
      weight: 14,
      shape: "cube",
      test: true,
      testStatus: null,
      result: 0,
      image: null,
      createDate: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "demo-cone-c",
      itemName: "Cone sample C",
      description: "Cone shape — no lab queue",
      cost: 800,
      weight: 22,
      shape: "cone",
      test: false,
      testStatus: null,
      result: 0,
      image: null,
      createDate: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
  for (const item of demos) items.set(item.id, item);
}

function getStore() {
  seed();
  return items;
}

module.exports = { getStore };
