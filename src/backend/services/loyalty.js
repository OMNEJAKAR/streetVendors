const LEVELS = [
  { name: "Bronze",  minXp: 0,    limitBonus: 0 },
  { name: "Silver",  minXp: 1000, limitBonus: 2000 },
  { name: "Gold",    minXp: 3000, limitBonus: 6000 },
  { name: "Platinum",minXp: 8000, limitBonus: 15000 },
];

function getLevelFromXp(xp) {
  let current = LEVELS[0];
  for (const L of LEVELS) if (xp >= L.minXp) current = L;
  return current;
}

// coins: 1 coin per ₹100 spent; surplus deals 2x
function coinsForOrder({ amount, isSurplus }) {
  const base = Math.floor(amount / 100);
  return isSurplus ? base * 2 : base;
}

// xp: ₹10 = 1 xp
function xpForOrder(amount) {
  return Math.floor(amount / 10);
}

function onTimeRepayRewards(amount) {
  return {
    xp: Math.floor(amount / 20),
    coins: Math.floor(amount / 200),
  };
}

module.exports = {
  LEVELS,
  getLevelFromXp,
  coinsForOrder,
  xpForOrder,
  onTimeRepayRewards,
};
