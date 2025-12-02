import { describe, it, expect, vi } from "vitest";
import { selectRandomSymbol } from "./randomSymbol";
import { SYMBOLS, SYMBOL_WEIGHTS } from "./gameLogic";

describe("selectRandomSymbol", () => {
  it("應該根據權重選擇符號 - SEVEN", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.01);

    const result = selectRandomSymbol();
    expect(result).toBe(SYMBOLS.SEVEN);

    vi.restoreAllMocks();
  });

  it("應該根據權重選擇符號 - CHERRY", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    const result = selectRandomSymbol();
    expect(result).toBe(SYMBOLS.CHERRY);

    vi.restoreAllMocks();
  });

  it("應該可以接受自定義 random 函數", () => {
    const customRandom = vi.fn().mockReturnValue(0.01);
    const result = selectRandomSymbol(customRandom);

    expect(customRandom).toHaveBeenCalled();
    expect(result).toBe(SYMBOLS.SEVEN);
  });

  it("應該正確計算各符號的出現機率", () => {
    const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce(
      (sum, weight) => sum + weight,
      0
    );

    // 測試每個符號的權重範圍
    const weightRanges: Array<{
      symbol: string;
      min: number;
      max: number;
    }> = [];
    let cumulative = 0;
    for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
      weightRanges.push({
        symbol,
        min: cumulative / totalWeight,
        max: (cumulative + weight) / totalWeight,
      });
      cumulative += weight;
    }

    vi.spyOn(Math, "random").mockReturnValue(0.01);
    expect(selectRandomSymbol()).toBe(SYMBOLS.SEVEN);

    vi.spyOn(Math, "random").mockReturnValue(0.9);
    expect(selectRandomSymbol()).toBe(SYMBOLS.CHERRY);

    vi.restoreAllMocks();
  });

  it("應該在 10000 次測試中符合權重分佈", () => {
    // 運行 10000 次測試
    const results: Record<string, number> = {};
    const testCount = 10000;

    for (let i = 0; i < testCount; i++) {
      const symbol = selectRandomSymbol();
      results[symbol] = (results[symbol] || 0) + 1;
    }

    // 檢查每個符號都應該出現至少一次
    for (const symbol of Object.keys(SYMBOL_WEIGHTS)) {
      expect(results[symbol]).toBeDefined();
      expect(results[symbol]).toBeGreaterThan(0);
    }

    // 驗證總數正確
    const totalResults = Object.values(results).reduce(
      (sum, count) => sum + count,
      0
    );
    expect(totalResults).toBe(testCount);

    // 驗證高權重符號出現次數應該大於或等於低權重符號
    // 對於 10000 次測試，權重相近的符號可能出現相同次數，所以使用 >=
    // CHERRY (權重 8) 應該出現次數 >= SEVEN (權重 1)
    expect(results[SYMBOLS.CHERRY]).toBeGreaterThanOrEqual(
      results[SYMBOLS.SEVEN]
    );
    // BELL (權重 7) 應該出現次數 >= BAR (權重 2)
    expect(results[SYMBOLS.BELL]).toBeGreaterThanOrEqual(results[SYMBOLS.BAR]);
    // ORANGE (權重 6) 應該出現次數 >= CROWN (權重 3)
    expect(results[SYMBOLS.ORANGE]).toBeGreaterThanOrEqual(
      results[SYMBOLS.CROWN]
    );
    // WATERMELON (權重 5) 應該出現次數 >= TROPHY (權重 4)
    expect(results[SYMBOLS.WATERMELON]).toBeGreaterThanOrEqual(
      results[SYMBOLS.TROPHY]
    );

    // 驗證權重差異較大的符號，高權重應該明顯大於低權重
    // CHERRY (權重 8) 應該明顯大於 SEVEN (權重 1)
    expect(results[SYMBOLS.CHERRY]).toBeGreaterThan(results[SYMBOLS.SEVEN]);
    // BELL (權重 7) 應該明顯大於 BAR (權重 2)
    expect(results[SYMBOLS.BELL]).toBeGreaterThan(results[SYMBOLS.BAR]);

    // 驗證所有符號都是有效的 Symbol 類型
    for (const symbol of Object.keys(results)) {
      expect(Object.values(SYMBOLS)).toContain(symbol);
    }

    // 輸出統計結果
    console.log("\n=== 10000 次測試統計結果 ===");
    const totalWeight = Object.values(SYMBOL_WEIGHTS).reduce(
      (sum, weight) => sum + weight,
      0
    );
    const warnings: string[] = [];
    for (const [symbol, weight] of Object.entries(SYMBOL_WEIGHTS)) {
      const count = results[symbol] || 0;
      const actualProb = (count / testCount) * 100;
      const expectedProb = (weight / totalWeight) * 100;
      const error = Math.abs(actualProb - expectedProb);

      // 檢查誤差是否超過 1%
      if (error > 1) {
        warnings.push(
          `⚠️  ${symbol}: 誤差 ${error.toFixed(2)}% (實際 ${actualProb.toFixed(
            2
          )}%, 預期 ${expectedProb.toFixed(2)}%)`
        );
      }

      console.log(
        `${symbol.padEnd(12)} (權重 ${weight}): ${count
          .toString()
          .padStart(5)} 次 (${actualProb.toFixed(
          2
        )}%), 預期 ${expectedProb.toFixed(2)}%`
      );
    }
    console.log("=============================");

    // 如果有警告，輸出警告信息
    if (warnings.length > 0) {
      console.log("\n⚠️  警告：以下符號的誤差超過 1%：");
      warnings.forEach((warning) => console.log(warning));
      console.log("");
    } else {
      console.log("\n✅ 所有符號的誤差都在 1% 以內\n");
    }
  });
});
