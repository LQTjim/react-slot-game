export const SYMBOLS = {
  SEVEN: "SEVEN",
  BAR: "BAR",
  CROWN: "CROWN",
  TROPHY: "TROPHY",
  WATERMELON: "WATERMELON",
  ORANGE: "ORANGE",
  BELL: "BELL",
  CHERRY: "CHERRY",
} as const;

export type Symbol = typeof SYMBOLS[keyof typeof SYMBOLS];

// 符號權重配置（權重越高，出現機率越高）
// 高價值符號（SEVEN, BAR）權重較低，低價值符號（CHERRY, BELL）權重較高
export const SYMBOL_WEIGHTS: Record<Symbol, number> = {
  [SYMBOLS.SEVEN]: 1, // 最稀有
  [SYMBOLS.BAR]: 2,
  [SYMBOLS.CROWN]: 3,
  [SYMBOLS.TROPHY]: 4,
  [SYMBOLS.WATERMELON]: 5,
  [SYMBOLS.ORANGE]: 6,
  [SYMBOLS.BELL]: 7,
  [SYMBOLS.CHERRY]: 8, // 最常見
};

export const PAYOUTS = {
  THREE_SEVENS: 500,
  THREE_BARS: 350,
  THREE_CROWNS: 300,
  THREE_TROPHIES: 250,
  THREE_WATERMELONS: 200,
  THREE_ORANGES: 150,
  THREE_BELLS: 100,
  THREE_CHERRIES: 50,
  THREE_DASHES: 10,
} as const;

export type Payout = typeof PAYOUTS[keyof typeof PAYOUTS];

// 遊戲配置
export const GAME_CONFIG = {
  INITIAL_BALANCE: 1000,
  DEFAULT_BET: 10,
  BET_OPTIONS: [10, 20, 50, 100, 200] as const,
  DEFAULT_SPIN_DURATION: 3000,
} as const;

export const checkWin = (symbols: [Symbol, Symbol, Symbol]): Payout | 0 => {
  const [a, b, c] = symbols;

  if (a === SYMBOLS.SEVEN && b === SYMBOLS.SEVEN && c === SYMBOLS.SEVEN) {
    return PAYOUTS.THREE_SEVENS;
  }
  if (a === SYMBOLS.BAR && b === SYMBOLS.BAR && c === SYMBOLS.BAR) {
    return PAYOUTS.THREE_BARS;
  }
  if (a === SYMBOLS.CROWN && b === SYMBOLS.CROWN && c === SYMBOLS.CROWN) {
    return PAYOUTS.THREE_CROWNS;
  }
  if (a === SYMBOLS.TROPHY && b === SYMBOLS.TROPHY && c === SYMBOLS.TROPHY) {
    return PAYOUTS.THREE_TROPHIES;
  }
  if (
    a === SYMBOLS.WATERMELON &&
    b === SYMBOLS.WATERMELON &&
    c === SYMBOLS.WATERMELON
  ) {
    return PAYOUTS.THREE_WATERMELONS;
  }
  if (a === SYMBOLS.ORANGE && b === SYMBOLS.ORANGE && c === SYMBOLS.ORANGE) {
    return PAYOUTS.THREE_ORANGES;
  }
  if (a === SYMBOLS.BELL && b === SYMBOLS.BELL && c === SYMBOLS.BELL) {
    return PAYOUTS.THREE_BELLS;
  }
  if (a === SYMBOLS.CHERRY && b === SYMBOLS.CHERRY && c === SYMBOLS.CHERRY) {
    return PAYOUTS.THREE_CHERRIES;
  }

  return 0;
};

