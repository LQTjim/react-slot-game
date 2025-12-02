import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import SlotMachine from "./SlotMachine";
import { PAYOUTS } from "../utils/gameLogic";
import * as fetchSpinResultModule from "../utils/fetchSpinResult";
import {
  setupCryptoMock,
  TEST_DATA,
  clickLeverAndWait,
  getBalance,
  hasWinMessage,
  hasWinningUI,
} from "../test/test-utils";

// Mock crypto.randomUUID
beforeAll(() => {
  setupCryptoMock();
});

describe("SlotMachine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("應該顯示初始餘額", () => {
    render(<SlotMachine />);
    expect(screen.getByText("$1,000")).toBeInTheDocument();
  });

  it("應該顯示下注金額選擇按鈕", () => {
    render(<SlotMachine />);
    expect(screen.getByText("$10")).toBeInTheDocument();
    expect(screen.getByText("$20")).toBeInTheDocument();
    expect(screen.getByText("$50")).toBeInTheDocument();
  });

  it("應該可以選擇下注金額", () => {
    render(<SlotMachine />);

    const bet50Button = screen.getByText("$50");
    act(() => {
      bet50Button.click();
    });

    expect(bet50Button).toHaveClass("active");
  });

  it("應該在中獎時顯示中獎訊息、連線 UI 並增加餘額", async () => {
    vi.spyOn(fetchSpinResultModule, "fetchSpinResult").mockResolvedValue(
      TEST_DATA.WINNING_SEVENS
    );

    render(<SlotMachine />);

    // 初始餘額應該是 $1,000
    expect(screen.getByText("$1,000")).toBeInTheDocument();
    expect(getBalance()).toBe(1000);

    // 點擊拉桿並等待動畫完成
    await clickLeverAndWait();

    // 切換回真實 timers，讓 waitFor 可以正常工作
    vi.useRealTimers();

    // 等待中獎訊息出現
    await waitFor(
      () => {
        expect(hasWinMessage()).toBe(true);
      },
      { timeout: 1000 }
    );

    // 檢查中獎訊息包含正確的倍數
    const winMessage = screen.getByText(/恭喜！獲得.*倍獎金/i);
    expect(winMessage).toHaveTextContent(`${PAYOUTS.THREE_SEVENS}`);

    // 檢查餘額增加
    expect(getBalance()).toBeGreaterThan(1000);

    // 檢查連線 UI
    await waitFor(
      () => {
        expect(hasWinningUI()).toBe(true);
      },
      { timeout: 1000 }
    );
  }, 10000);

  it("應該在未中獎時不顯示中獎訊息", async () => {
    vi.spyOn(fetchSpinResultModule, "fetchSpinResult").mockResolvedValue(
      TEST_DATA.NO_WIN
    );

    render(<SlotMachine />);

    // 點擊拉桿並等待動畫完成
    await clickLeverAndWait();

    // 切換回真實 timers
    vi.useRealTimers();

    // 不應該有中獎訊息和連線 UI
    expect(hasWinMessage()).toBe(false);
    expect(hasWinningUI()).toBe(false);
  }, 10000);

  // 註：
  // 1. 餘額不足的情況已經通過 UI 禁用來防止（下注按鈕和拉桿都會被禁用）
  //    因此不需要測試這個情況，因為用戶無法觸發它
  // 2. fetchSpinResult 是 happy path，不會拋出錯誤，因此不需要測試錯誤處理
});
