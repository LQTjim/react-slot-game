import { describe, it, expect } from "vitest";
import { SYMBOLS, PAYOUTS, checkWin } from "./gameLogic";

describe("gameLogic", () => {
  describe("checkWin", () => {
    it("應該返回 500 倍當三個都是 SEVEN", () => {
      const result = checkWin([
        SYMBOLS.SEVEN,
        SYMBOLS.SEVEN,
        SYMBOLS.SEVEN,
      ]);
      expect(result).toBe(PAYOUTS.THREE_SEVENS);
    });

    it("應該返回 350 倍當三個都是 BAR", () => {
      const result = checkWin([SYMBOLS.BAR, SYMBOLS.BAR, SYMBOLS.BAR]);
      expect(result).toBe(PAYOUTS.THREE_BARS);
    });

    it("應該返回 300 倍當三個都是 CROWN", () => {
      const result = checkWin([
        SYMBOLS.CROWN,
        SYMBOLS.CROWN,
        SYMBOLS.CROWN,
      ]);
      expect(result).toBe(PAYOUTS.THREE_CROWNS);
    });

    it("應該返回 0 當沒有中獎", () => {
      const result = checkWin([SYMBOLS.SEVEN, SYMBOLS.BAR, SYMBOLS.CROWN]);
      expect(result).toBe(0);
    });

    it("應該返回 0 當只有兩個相同", () => {
      const result = checkWin([SYMBOLS.SEVEN, SYMBOLS.SEVEN, SYMBOLS.BAR]);
      expect(result).toBe(0);
    });
  });
});

