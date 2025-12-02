import React from "react";
import { GAME_CONFIG } from "../utils/gameLogic";
import "./BetSelector.css";

interface BetSelectorProps {
  betAmount: number;
  onBetChange: (amount: number) => void;
  disabled?: boolean;
  balance: number;
}

const BetSelector: React.FC<BetSelectorProps> = ({
  betAmount,
  onBetChange,
  disabled = false,
  balance,
}) => {
  return (
    <div className="bet-selector">
      <div className="bet-label">下注金額</div>
      <div className="bet-buttons">
        {GAME_CONFIG.BET_OPTIONS.map((amount) => (
          <button
            key={amount}
            className={`bet-button ${betAmount === amount ? "active" : ""}`}
            onClick={() => onBetChange(amount)}
            disabled={disabled || balance < amount}
          >
            ${amount}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BetSelector;

