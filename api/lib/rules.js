function needsLabTest(item) {
  return item.shape === "cube" && item.weight > 10;
}

function testStatusFromResult(resultPercent) {
  return resultPercent > 50 ? "FAIL" : "PASS";
}

function adjustCostAfterTest(cost, status) {
  return status === "FAIL" ? cost / 2 : cost;
}

module.exports = { needsLabTest, testStatusFromResult, adjustCostAfterTest };
