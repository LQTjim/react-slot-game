import React, { useEffect, useRef, useState, useMemo } from "react";
import { Symbol } from "../utils/gameLogic";
import { selectRandomSymbol } from "../utils/randomSymbol";
import { playReelSpinSoundGenerated } from "../utils/sound";
import SymbolComponent from "./Symbol";
import "./Reel.css";
import "./Symbol.css";

interface ReelProps {
  symbols: Symbol[];
  targetSymbols: [Symbol, Symbol, Symbol] | null;
  spinning: boolean;
  spinDuration: number;
  isWinning: boolean;
  winningRowIndex: number | null;
}

const Reel: React.FC<ReelProps> = ({
  symbols,
  targetSymbols,
  spinning,
  spinDuration,
  isWinning,
  winningRowIndex,
}) => {
  const reelContentRef = useRef<HTMLDivElement>(null);
  const isSpinningRef = useRef<boolean>(false);
  const spinSoundRef = useRef<{ stop: () => void } | null>(null);

  // 使用 state 管理符號陣列
  // symbols prop 已經是 20 個元素的陣列（17個隨機 + 3個目標符號）
  const [allSymbols, setAllSymbols] = useState<Symbol[]>(symbols);
  // 使用 state 管理 spinning 狀態（用於 CSS class 和動畫）
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // 始終渲染所有 20 個 slot，避免陣列縮減導致的 layout reflow 和閃爍
  // 使用 CSS 控制可見性而不是動態改變陣列長度

  // 計算中獎的 slot 索引
  const winningSlotIndex = useMemo(() => {
    if (isWinning && winningRowIndex !== null && !isSpinning) {
      // 在靜止狀態下，最後3個 slot（index 17, 18, 19）
      // 它們對應 row 0, 1, 2（top, middle, bottom）
      // winningRowIndex 是 1（中間行），對應 index 18
      return 17 + winningRowIndex;
    }
    return null;
  }, [isWinning, winningRowIndex, isSpinning]);

  // 當 symbols prop 改變時更新 allSymbols（只在非 spinning 狀態下）
  // symbols prop 已經是 20 個元素的陣列
  useEffect(() => {
    if (!spinning && symbols.length === 20) {
      setAllSymbols(symbols);
    }
  }, [symbols, spinning]);

  // 動畫控制：當 spinning 變為 true 時，更新陣列並開始 CSS 動畫
  useEffect(() => {
    if (spinning && !isSpinningRef.current && targetSymbols) {
      isSpinningRef.current = true;
      setIsSpinning(true);

      // 開始播放轉動聲音
      spinSoundRef.current = playReelSpinSoundGenerated();

      // 動畫開始前：決定好最終陣列（17個隨機 + 3個目標符號）
      const spinningSymbols = Array.from({ length: 17 }, () =>
        selectRandomSymbol()
      );
      const finalSymbols = targetSymbols;
      const allSymbolsToShow = [...spinningSymbols, ...finalSymbols];

      // 更新符號陣列
      setAllSymbols(allSymbolsToShow);

      // CSS keyframe 動畫會自動處理滾動
      // 動畫結束後，通過 animationend 事件處理
    } else if (!spinning && isSpinningRef.current) {
      // 外部強制停止
      isSpinningRef.current = false;
      setIsSpinning(false);

      // 停止轉動聲音
      if (spinSoundRef.current) {
        spinSoundRef.current.stop();
        spinSoundRef.current = null;
      }
    }

    return () => {
      // 清理時停止聲音
      if (spinSoundRef.current) {
        spinSoundRef.current.stop();
        spinSoundRef.current = null;
      }
    };
  }, [spinning, targetSymbols]);

  // 監聽動畫結束事件
  useEffect(() => {
    const reelContent = reelContentRef.current;
    if (!reelContent) return;

    const handleAnimationEnd = () => {
      isSpinningRef.current = false;
      setIsSpinning(false);

      // 停止轉動聲音
      if (spinSoundRef.current) {
        spinSoundRef.current.stop();
        spinSoundRef.current = null;
      }
    };

    reelContent.addEventListener("animationend", handleAnimationEnd);
    return () => {
      reelContent.removeEventListener("animationend", handleAnimationEnd);
    };
  }, []);

  return (
    <div className="reel">
      <div
        ref={reelContentRef}
        className={`reel-content ${isSpinning ? "spinning" : ""}`}
        style={
          isSpinning
            ? {
                animation: `reelSpin ${spinDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
              }
            : {
                transform: "translateY(-2040px)", // 顯示最後 3 個 slot
              }
        }
      >
        {allSymbols.map((symbol, index) => {
          const isWinningSlot = winningSlotIndex === index;

          // 使用穩定的 key：symbol + index 組合，確保 React 不會重新創建元素
          return (
            <div
              key={`${symbol}-${index}`}
              className={`reel-slot ${isWinningSlot ? "winning" : ""}`}
            >
              <SymbolComponent type={symbol} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reel;
