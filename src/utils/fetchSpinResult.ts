import { selectRandomSymbol } from "./randomSymbol";
import { Symbol } from "./gameLogic";

export interface Reel {
  id: string;
  symbols: Symbol[];
}

export interface SpinResult {
  targets: [Symbol, Symbol, Symbol][];
  durations: [number, number, number];
}

// 可被測試 mock 的 fetch 函數
export const fetchSpinResult = async (
  reels: Reel[]
): Promise<SpinResult> => {
  // 模擬 API 延遲
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 使用權重系統返回隨機結果
  const newTargets: [Symbol, Symbol, Symbol][] = reels.map(() => {
    return [
      selectRandomSymbol(),
      selectRandomSymbol(),
      selectRandomSymbol(),
    ];
  });

  return {
    targets: newTargets,
    durations: [
      2000 + Math.random() * 2000,
      2000 + Math.random() * 2000,
      2000 + Math.random() * 2000,
    ],
  };
};

