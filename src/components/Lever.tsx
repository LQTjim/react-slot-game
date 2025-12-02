import React, { useState } from "react";
import { playLeverSoundGenerated } from "../utils/sound";
import "./Lever.css";

interface LeverProps {
  onPull: () => void;
  disabled?: boolean;
}

const Lever: React.FC<LeverProps> = ({ onPull, disabled = false }) => {
  const [pulling, setPulling] = useState<boolean>(false);

  const handleClick = (): void => {
    if (disabled) return;
    // 播放拉桿聲音
    playLeverSoundGenerated();
    setPulling(true);
    onPull();
    // 延長動畫時間，讓拉動效果更明顯
    setTimeout(() => setPulling(false), 400);
  };

  return (
    <div className="lever-container">
      <button
        className={`lever ${pulling ? "pulling" : ""} ${
          disabled ? "disabled" : ""
        }`}
        onClick={handleClick}
        disabled={disabled}
      >
        <div className="lever-handle"></div>
        <div className="lever-base"></div>
      </button>
    </div>
  );
};

export default Lever;

