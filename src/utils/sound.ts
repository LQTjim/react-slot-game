/**
 * 聲音工具模組
 * 提供兩種實現方式：
 * 1. HTMLAudioElement - 播放音頻文件（需要音頻文件）
 * 2. Web Audio API - 程式化生成音頻（無需文件）
 */

// ========== 方案 1: HTMLAudioElement (需要音頻文件) ==========
// 適合：有音頻文件資源的情況
// 使用方式：
// import { playLeverSound, playReelSpinSound } from './utils/sound';
// playLeverSound();
// playReelSpinSound();

/**
 * 播放拉桿聲音（HTMLAudioElement 方式）
 * 需要準備音頻文件：public/sounds/lever-pull.mp3
 */
export const playLeverSound = (): void => {
  try {
    // 每次創建新實例，避免重複播放問題
    const audio = new Audio("/sounds/lever-pull.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.warn("無法播放拉桿聲音:", err);
    });
  } catch (error) {
    console.warn("創建音頻對象失敗:", error);
  }
};

/**
 * 播放輪盤轉動聲音（HTMLAudioElement 方式）
 * 需要準備音頻文件：public/sounds/reel-spin.mp3
 * @returns Audio 對象，用於後續停止播放
 */
export const playReelSpinSound = (): HTMLAudioElement | null => {
  try {
    const audio = new Audio("/sounds/reel-spin.mp3");
    audio.volume = 0.3;
    audio.loop = true; // 轉動時循環播放
    audio.play().catch((err) => {
      console.warn("無法播放轉動聲音:", err);
    });
    return audio; // 返回 audio 對象以便後續停止
  } catch (error) {
    console.warn("創建音頻對象失敗:", error);
    return null;
  }
};

/**
 * 停止輪盤轉動聲音
 */
export const stopReelSpinSound = (audio: HTMLAudioElement | null): void => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};

// ========== 方案 2: Web Audio API (程式化生成，無需文件) ==========
// 適合：不想依賴音頻文件，想要程式化生成音效

let audioContext: AudioContext | null = null;

/**
 * 獲取或創建 AudioContext
 * 注意：瀏覽器要求用戶交互後才能創建 AudioContext
 */
const getAudioContext = (): AudioContext | null => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn("無法創建 AudioContext:", error);
      return null;
    }
  }
  // 如果 AudioContext 被暫停，恢復它（某些瀏覽器需要）
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
};

/**
 * 生成拉桿聲音（Web Audio API 方式）
 * 生成一個短暫的「咔噠」聲
 */
export const playLeverSoundGenerated = (): void => {
  const ctx = getAudioContext();
  if (!ctx) return;

  // 創建一個短暫的噪音作為「咔噠」聲
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // 設置頻率和類型
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.type = "square";

  // 快速衰減的包絡
  gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.1);
};

/**
 * 生成輪盤轉動聲音（Web Audio API 方式）
 * 生成持續的滾動聲
 */
export const playReelSpinSoundGenerated = (): {
  stop: () => void;
} => {
  const ctx = getAudioContext();
  if (!ctx) {
    return { stop: () => {} };
  }

  // 創建多個振盪器模擬滾動聲
  const oscillators: OscillatorNode[] = [];
  const gainNodes: GainNode[] = [];

  // 創建 3 個不同頻率的振盪器
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // 不同頻率產生更豐富的聲音
    osc.frequency.setValueAtTime(100 + i * 50, ctx.currentTime);
    osc.type = "sawtooth";

    // 設置音量
    gain.gain.setValueAtTime(0.02, ctx.currentTime);

    osc.start(ctx.currentTime);
    oscillators.push(osc);
    gainNodes.push(gain);
  }

  return {
    stop: () => {
      oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch (e) {
          // 忽略已停止的錯誤
        }
      });
    },
  };
};

/**
 * 生成中獎聲音（Web Audio API 方式）
 * 生成一個上升的音調
 */
export const playWinSound = (): void => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // 上升的音調
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.3);
};
