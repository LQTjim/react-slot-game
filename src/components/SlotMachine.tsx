import React, { useState, useCallback, useMemo } from "react";
import Reel from "./Reel";
import Lever from "./Lever";
import Paytable from "./Paytable";
import BetSelector from "./BetSelector";
import { SYMBOLS, checkWin, Symbol, GAME_CONFIG } from "../utils/gameLogic";
import { fetchSpinResult, Reel as ReelType } from "../utils/fetchSpinResult";
import { selectRandomSymbol } from "../utils/randomSymbol";
import { playWinSound } from "../utils/sound";
import "./SlotMachine.css";

type WinningPositions = [number, number, number] | null;

// 生成 UUID（使用 Web Crypto API）
const generateUUID = (): string => {
  return crypto.randomUUID();
};
// 生成 20 個符號的陣列（17個隨機 + 3個目標）
const generateReelSymbols = (
  targetSymbols: [Symbol, Symbol, Symbol]
): Symbol[] => {
  const randomSymbols = Array.from({ length: 17 }, () => selectRandomSymbol());
  return [...randomSymbols, ...targetSymbols];
};

const SlotMachine: React.FC = () => {
  // 初始化 3 個轉輪，每個都是 20 個符號
  const initialReels = useMemo<ReelType[]>(() => {
    const initialTargets: [Symbol, Symbol, Symbol][] = [
      [SYMBOLS.SEVEN, SYMBOLS.CROWN, SYMBOLS.BAR],
      [SYMBOLS.BELL, SYMBOLS.CHERRY, SYMBOLS.ORANGE],
      [SYMBOLS.SEVEN, SYMBOLS.TROPHY, SYMBOLS.SEVEN],
    ];
    return initialTargets.map((targets) => ({
      id: generateUUID(),
      symbols: generateReelSymbols(targets),
    }));
  }, []);

  const [reels, setReels] = useState<ReelType[]>(initialReels);
  const [targetReels, setTargetReels] = useState<
    [Symbol, Symbol, Symbol][] | null
  >(null);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [spinDurations, setSpinDurations] = useState<[number, number, number]>([
    GAME_CONFIG.DEFAULT_SPIN_DURATION,
    GAME_CONFIG.DEFAULT_SPIN_DURATION,
    GAME_CONFIG.DEFAULT_SPIN_DURATION,
  ]);
  const [loading, setLoading] = useState<boolean>(false); // 載入中狀態
  const [balance, setBalance] = useState<number>(GAME_CONFIG.INITIAL_BALANCE); // 初始金額
  const [betAmount, setBetAmount] = useState<number>(GAME_CONFIG.DEFAULT_BET); // 下注金額
  const [winningPositions, setWinningPositions] =
    useState<WinningPositions>(null); // 中獎位置 [rowIndex, reelIndex]
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 錯誤訊息

  const spin = useCallback(async () => {
    if (spinning || loading) return;

    // 註：餘額不足的情況理論上不會發生，因為 UI 已經通過禁用來防止：
    // - BetSelector 中，下注按鈕在 balance < amount 時會被禁用
    // - Lever 組件在 balance < betAmount 時會被禁用
    // 此處保留作為防禦性檢查，以防未來有程式化調用的情況
    if (balance < betAmount) {
      setErrorMessage("餘額不足！");
      // 3 秒後自動清除錯誤訊息
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // 清除錯誤訊息
    setErrorMessage(null);

    // 立即清除中獎 UI
    setWinningPositions(null);
    setWinAmount(0);

    // 扣除下注金額
    setBalance((prev) => prev - betAmount);
    setSpinning(true);
    setLoading(true); // 開始載入

    try {
      // 從後端獲取結果（模擬 fetch）
      const result = await fetchSpinResult(reels);
      setLoading(false); // 載入完成

      // 設置轉動時間
      setSpinDurations(result.durations);

      // 設置目標符號
      setTargetReels(result.targets);

      // 等待所有轉輪停止後再更新結果和檢查獲勝
      const maxDuration = Math.max(...result.durations);
      setTimeout(() => {
        // 更新 reels，每個都是 20 個符號（17個隨機 + 3個目標）
        // 創建新的 UUID 以強制 React 重新渲染 Reel 組件
        setReels(
          result.targets.map((targets) => ({
            id: generateUUID(),
            symbols: generateReelSymbols(targets),
          }))
        );
        setTargetReels(null);
        const middleRow: [Symbol, Symbol, Symbol] = [
          result.targets[0][1],
          result.targets[1][1],
          result.targets[2][1],
        ];
        const win = checkWin(middleRow);
        const winPayout = win * betAmount; // 獎金 = 倍數 × 下注金額
        setWinAmount(win);
        if (winPayout > 0) {
          setBalance((prev) => prev + winPayout);
          // 設置中獎位置：中間行（rowIndex = 1）的三個轉輪
          setWinningPositions([1, 1, 1]); // [rowIndex, rowIndex, rowIndex] 對應三個轉輪
          // 播放中獎聲音
          playWinSound();
        }
        setSpinning(false);
      }, maxDuration);
    } catch (error) {
      // 註：fetchSpinResult 目前是 happy path，不會拋出錯誤
      // 此處保留錯誤處理作為防禦性編程，以防未來改為真實 API 調用時可能發生的網絡錯誤
      console.error("獲取結果失敗:", error);
      setSpinning(false);
      setLoading(false);
      // 發生錯誤時退還下注金額
      setBalance((prev) => prev + betAmount);
      // 顯示錯誤訊息
      setErrorMessage("遊戲載入失敗，請稍後再試");
      // 3 秒後自動清除錯誤訊息
      setTimeout(() => setErrorMessage(null), 3000);
    }
  }, [spinning, loading, reels, balance, betAmount]);
  console.log(reels, "Reels");
  return (
    <div className="slot-machine-container">
      <div className="game-info">
        <div className="balance-display">
          <div className="balance-label">餘額</div>
          <div className="balance-amount">${balance.toLocaleString()}</div>
        </div>
        <BetSelector
          betAmount={betAmount}
          onBetChange={setBetAmount}
          disabled={spinning || loading}
          balance={balance}
        />
      </div>
      <Lever
        onPull={spin}
        disabled={spinning || loading || balance < betAmount}
      />
      <div className="slot-machine">
        {loading && <div className="loading-message">載入中...</div>}
        <div className="machine-frame">
          <div
            className={`reels-container ${
              winningPositions ? "has-winning" : ""
            }`}
          >
            {reels.map((reel, index) => (
              <Reel
                key={reel.id}
                symbols={reel.symbols}
                targetSymbols={targetReels ? targetReels[index] : null}
                spinning={spinning}
                spinDuration={spinDurations[index]}
                isWinning={
                  winningPositions ? winningPositions[index] !== null : false
                }
                winningRowIndex={
                  winningPositions ? winningPositions[index] : null
                }
              />
            ))}
          </div>
        </div>
        {winAmount > 0 && (
          <div className="win-message">
            恭喜！獲得 {winAmount} 倍獎金！ (+$
            {(winAmount * betAmount).toLocaleString()})
          </div>
        )}
        {errorMessage && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
      <Paytable />
    </div>
  );
};

export default SlotMachine;
