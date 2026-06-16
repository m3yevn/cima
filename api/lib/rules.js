export function needsLabTest(item) {
  return item.shape === "cube" && item.weight > 10;
}

export function testStatusFromResult(resultPercent) {
  return resultPercent > 50 ? "FAIL" : "PASS";
}

export function adjustCostAfterTest(cost, status) {
  return status === "FAIL" ? cost / 2 : cost;
}
