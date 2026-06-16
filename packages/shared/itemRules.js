/** @typedef {"cube" | "cone" | "sphere"} ItemShape */
/** @typedef {"CIMA_SUPERVISOR" | "LAB_SUPERVISOR" | "ADMIN"} UserRole */
/** @typedef {"PASS" | "FAIL" | null} TestStatus */

/**
 * @param {{ shape: ItemShape, weight: number }} item
 */
export function needsLabTest(item) {
  return item.shape === "cube" && item.weight > 10;
}

/**
 * @param {number} resultPercent
 * @returns {TestStatus}
 */
export function testStatusFromResult(resultPercent) {
  return resultPercent > 50 ? "FAIL" : "PASS";
}

/**
 * @param {number} cost
 * @param {TestStatus} status
 */
export function adjustCostAfterTest(cost, status) {
  return status === "FAIL" ? cost / 2 : cost;
}

/**
 * @param {{ test: boolean, shape: ItemShape, testStatus: TestStatus | undefined, createDate: Date }} item
 * @param {Date} now
 */
export function isOverdueForReminder(item, now = new Date()) {
  if (!item.test || item.shape !== "cube" || item.testStatus) return false;
  const created = item.createDate instanceof Date ? item.createDate : new Date(item.createDate);
  const ms = now.getTime() - created.getTime();
  return ms >= 2 * 24 * 60 * 60 * 1000;
}
