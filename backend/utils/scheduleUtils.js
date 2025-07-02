// backend/utils/scheduleUtils.js

/**
 * Generate an array of due‐date slots from startDate up to (and including) deadline.
 * periodicity: 'daily' | 'weekly' | 'monthly'
 */
function generateSlots(startDate, deadline, periodicity) {
  const slots = [];
  const cursor = new Date(startDate);
  const end = new Date(deadline);

  // Advance one “step” per slot
  const advance = {
    daily:   date => date.setDate(date.getDate() + 1),
    weekly:  date => date.setDate(date.getDate() + 7),
    monthly: date => date.setMonth(date.getMonth() + 1),
  }[periodicity];

  while (cursor < end) {
    slots.push(new Date(cursor));
    advance(cursor);
  }

  // Ensure the final deadline is included exactly
  if (slots.length === 0 || slots[slots.length - 1].getTime() !== end.getTime()) {
    slots.push(end);
  }

  return slots;
}

/**
 * Compute the full installment plan:
 * Returns an array of { dueDate, groupAmount, memberAmount }.
 */
function computeInstallments({ startDate, deadline, periodicity, totalGoal, memberCount }) {
  const slotDates = generateSlots(startDate, deadline, periodicity);
  const numSlots = slotDates.length;

  // Group total per slot
  const groupPerSlot  = totalGoal / numSlots;
  // Each member’s share per slot
  const memberPerSlot = groupPerSlot / memberCount;

  return slotDates.map(dueDate => ({
    dueDate,
    groupAmount:  parseFloat(groupPerSlot.toFixed(2)),
    memberAmount: parseFloat(memberPerSlot.toFixed(2)),
  }));
}

module.exports = {
  generateSlots,
  computeInstallments,
};
