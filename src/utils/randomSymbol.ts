import { SYMBOLS, SYMBOL_WEIGHTS, Symbol } from "./gameLogic";

/**
 * 根據權重隨機選擇一個符號
 *
 * 計算邏輯：
 * 1. 計算總權重（例如：1+2+3+4+5+6+7+8 = 36）
 * 2. 生成 0 到 totalWeight 之間的隨機數（例如：random = 0.5 * 36 = 18）
 * 3. 根據累積權重區間決定選中哪個符號：
 *    - SEVEN:   0  ~ 1   (權重 1)
 *    - BAR:     1  ~ 3   (累積權重 1+2=3)
 *    - CROWN:   3  ~ 6   (累積權重 1+2+3=6)
 *    - TROPHY:  6  ~ 10  (累積權重 1+2+3+4=10)
 *    - WATERMELON: 10 ~ 15 (累積權重 1+2+3+4+5=15)
 *    - ORANGE:  15 ~ 21  (累積權重 1+2+3+4+5+6=21)
 *    - BELL:    21 ~ 28  (累積權重 1+2+3+4+5+6+7=28)
 *    - CHERRY:  28 ~ 36  (累積權重 1+2+3+4+5+6+7+8=36)
 *
 * 例如：random = 18，落在 ORANGE 的區間（15-21），所以選中 ORANGE
 *
 * @param randomFn - 隨機數生成函數（預設為 Math.random，測試時可 mock）
 * @returns 選中的符號
 */
export const selectRandomSymbol = (
  randomFn: () => number = Math.random
): Symbol => {
  // 步驟 1: 計算總權重
  // 例如：1+2+3+4+5+6+7+8 = 36
  const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce(
    (sum, weight) => sum + weight,
    0
  );

  // 步驟 2: 生成 0 到 totalWeight 之間的隨機數
  // 例如：Math.random() = 0.5，則 random = 0.5 * 36 = 18
  let random = randomFn() * totalWeight;

  // 步驟 3: 根據累積權重區間選擇符號
  // 從 random 中減去每個符號的權重，當 random <= 0 時就選中該符號
  let cumulativeWeight = 0;
  for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
    cumulativeWeight += weight;
    if (random <= cumulativeWeight) {
      return symbol as Symbol;
    }
  }

  // 理論上不會執行到這裡，但為了安全起見返回最後一個符號
  return SYMBOLS.CHERRY;
};

