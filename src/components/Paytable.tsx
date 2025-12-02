import React from "react";
import { PAYOUTS } from "../utils/gameLogic";
import "./Paytable.css";

const Paytable: React.FC = () => {
  const payoutEntries = [
    { symbols: ["7", "7", "7"], payout: PAYOUTS.THREE_SEVENS },
    { symbols: ["BAR", "BAR", "BAR"], payout: PAYOUTS.THREE_BARS },
    { symbols: ["👑", "👑", "👑"], payout: PAYOUTS.THREE_CROWNS },
    { symbols: ["🏆", "🏆", "🏆"], payout: PAYOUTS.THREE_TROPHIES },
    { symbols: ["🍉", "🍉", "🍉"], payout: PAYOUTS.THREE_WATERMELONS },
    { symbols: ["🍊", "🍊", "🍊"], payout: PAYOUTS.THREE_ORANGES },
    { symbols: ["🔔", "🔔", "🔔"], payout: PAYOUTS.THREE_BELLS },
    { symbols: ["🍒", "🍒", "🍒"], payout: PAYOUTS.THREE_CHERRIES },
    { symbols: ["-", "-", "-"], payout: PAYOUTS.THREE_DASHES },
  ];

  return (
    <div className="paytable">
      <div className="paytable-header">賠率表</div>
      <div className="paytable-content">
        {payoutEntries.map((entry, index) => (
          <div key={index} className="paytable-row">
            <div className="paytable-symbols">
              {entry.symbols.map((symbol, i) => (
                <span
                  key={i}
                  className={`paytable-symbol ${
                    symbol === "7" ? "symbol-seven" : ""
                  } ${symbol === "BAR" ? "symbol-bar" : ""}`}
                >
                  {symbol}
                </span>
              ))}
            </div>
            <div className="paytable-payout">{entry.payout}x</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Paytable;

