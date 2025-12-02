import React from "react";
import { Symbol as SymbolType } from "../utils/gameLogic";
import "./Symbol.css";

interface SymbolProps {
  type: SymbolType;
}

const Symbol: React.FC<SymbolProps> = ({ type }) => {
  const renderSymbol = () => {
    switch (type) {
      case "SEVEN":
        return <div className="symbol seven">7</div>;
      case "BAR":
        return <div className="symbol bar">BAR</div>;
      case "CROWN":
        return <div className="symbol crown">👑</div>;
      case "TROPHY":
        return <div className="symbol trophy">🏆</div>;
      case "WATERMELON":
        return <div className="symbol watermelon">🍉</div>;
      case "ORANGE":
        return <div className="symbol orange">🍊</div>;
      case "BELL":
        return <div className="symbol bell">🔔</div>;
      case "CHERRY":
        return <div className="symbol cherry">🍒</div>;
      default:
        return <div className="symbol">-</div>;
    }
  };

  return <div className="symbol-container">{renderSymbol()}</div>;
};

export default Symbol;

