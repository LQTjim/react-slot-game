import { screen, act } from "@testing-library/react";
import { vi } from "vitest";
import { SYMBOLS } from "../utils/gameLogic";
import type { SpinResult } from "../utils/fetchSpinResult";

// Mock crypto.randomUUID
let uuidCounter = 0;
export const setupCryptoMock = () => {
  Object.defineProperty(global, "crypto", {
    value: {
      randomUUID: () => `test-uuid-${++uuidCounter}`,
    },
    writable: true,
  });
};

// 測試數據
export const TEST_DATA = {
  WINNING_SEVENS: {
    targets: [
      [SYMBOLS.SEVEN, SYMBOLS.SEVEN, SYMBOLS.SEVEN],
      [SYMBOLS.SEVEN, SYMBOLS.SEVEN, SYMBOLS.SEVEN],
      [SYMBOLS.SEVEN, SYMBOLS.SEVEN, SYMBOLS.SEVEN],
    ],
    durations: [3000, 3000, 3000],
  } as SpinResult,
  NO_WIN: {
    targets: [
      [SYMBOLS.CHERRY, SYMBOLS.ORANGE, SYMBOLS.BELL],
      [SYMBOLS.WATERMELON, SYMBOLS.BAR, SYMBOLS.CROWN],
      [SYMBOLS.TROPHY, SYMBOLS.CHERRY, SYMBOLS.ORANGE],
    ],
    durations: [3000, 3000, 3000],
  } as SpinResult,
};

// 找到拉桿按鈕
export const getLeverButton = (): HTMLElement | null => {
  const allButtons = screen.getAllByRole("button");
  const leverButton = allButtons.find(
    (btn) => !btn.classList.contains("bet-button")
  );
  return leverButton instanceof HTMLElement ? leverButton : null;
};

// 點擊拉桿並等待動畫完成
export const clickLeverAndWait = async (): Promise<void> => {
  const leverButton = getLeverButton();
  if (!leverButton) {
    throw new Error("找不到拉桿按鈕");
  }

  // 點擊拉桿
  act(() => {
    leverButton.click();
  });

  // 等待載入完成
  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  // 等待動畫完成
  await act(async () => {
    vi.advanceTimersByTime(5000);
    await vi.runAllTimersAsync();
  });

  // 再推進一點時間確保 React 狀態更新完成
  await act(async () => {
    vi.advanceTimersByTime(100);
    await vi.runAllTimersAsync();
  });
};

// 獲取餘額數字
export const getBalance = (): number => {
  const balanceText = document.querySelector(".balance-amount");
  return parseInt(balanceText?.textContent?.replace(/[$,]/g, "") || "0");
};

// 檢查是否有中獎訊息
export const hasWinMessage = (): boolean => {
  const winMessage = screen.queryByText(/恭喜！獲得.*倍獎金/i);
  return winMessage !== null;
};

// 檢查是否有中獎連線 UI
export const hasWinningUI = (): boolean => {
  const reelsContainer = document.querySelector(".reels-container");
  return reelsContainer?.classList.contains("has-winning") ?? false;
};
