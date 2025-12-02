# React Slot Game

一個經典的三轉輪老虎機遊戲，使用 React + TypeScript + Vite 構建。

## 功能特色

- 三個轉輪，每個轉輪顯示三個符號
- 流暢的 CSS keyframe 動畫效果
- 多種符號組合和賠率系統
- 拉桿控制轉動
- 右側賠率表顯示所有獲勝組合
- 餘額管理和下注系統
- 中獎高亮顯示和音效

## 技術棧

- **React 18** - UI 框架
- **TypeScript** - 類型安全
- **Vite** - 構建工具
- **Vitest** - 測試框架
- **Testing Library** - React 組件測試

## 項目結構

```
src/
├── components/          # React 組件
│   ├── SlotMachine.tsx  # 主遊戲組件
│   ├── Reel.tsx         # 轉輪組件（使用 CSS keyframe 動畫）
│   ├── Lever.tsx        # 拉桿組件
│   ├── BetSelector.tsx  # 下注選擇器
│   ├── Paytable.tsx     # 賠率表
│   └── Symbol.tsx       # 符號顯示組件
├── utils/               # 工具函數
│   ├── gameLogic.ts     # 遊戲邏輯（符號、權重、賠率）
│   ├── randomSymbol.ts  # 權重隨機符號選擇
│   ├── fetchSpinResult.ts # 模擬 API 獲取轉動結果
│   └── sound.ts         # 音效生成（Web Audio API）
└── test/                # 測試工具
    ├── setup.ts         # 測試環境設置
    └── test-utils.tsx   # 測試工具函數
```

## 安裝與運行

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview

# 運行測試
npm test

# 運行測試（單次）
npm run test:run
```

## 遊戲規則

1. 選擇下注金額（$10, $20, $50, $100, $200）
2. 點擊左側拉桿開始轉動
3. 三個轉輪會隨機停止
4. 如果中間一行的三個符號相同，即可獲得對應的獎金倍數
5. 獎金 = 倍數 × 下注金額

## 符號類型

- **7** (SEVEN) - 最稀有，權重 1
- **BAR** - 權重 2
- **皇冠** (CROWN) - 權重 3
- **獎盃** (TROPHY) - 權重 4
- **西瓜** (WATERMELON) - 權重 5
- **橘子** (ORANGE) - 權重 6
- **鈴鐺** (BELL) - 權重 7
- **櫻桃** (CHERRY) - 最常見，權重 8

## 賠率表

- 三個 7：500x
- 三個 BAR：350x
- 三個皇冠：300x
- 三個獎盃：250x
- 三個西瓜：200x
- 三個橘子：150x
- 三個鈴鐺：100x
- 三個櫻桃：50x
- 三個橫線：10x

## 技術實現細節

### 權重隨機系統

使用權重系統來控制符號出現機率：

- 總權重 = 36 (1+2+3+4+5+6+7+8)
- 每個符號的出現機率 = 其權重 / 總權重
- 例如：SEVEN 出現機率 = 1/36 ≈ 2.78%，CHERRY 出現機率 = 8/36 ≈ 22.22%

### 動畫系統

- 使用 CSS keyframe 動畫實現轉輪滾動效果
- 動畫結束後自動停在最後三個符號位置
- 避免使用直接 DOM 操作，完全使用 React state 和 CSS

### 測試覆蓋

- 組件測試：使用 Testing Library 測試用戶交互
- 邏輯測試：測試權重分佈、中獎判斷等核心邏輯
- 權重測試：10000 次測試驗證權重分佈準確性

## 開發規範

- 使用 TypeScript 確保類型安全
- 組件化設計，職責分離
- 使用 React Hooks 管理狀態
- 避免直接 DOM 操作
- 完整的測試覆蓋

## GitHub Pages 部署

項目已配置 GitHub Actions，當推送到 `main` 分支時會自動構建並部署到 GitHub Pages。

### 設置步驟

1. 在 GitHub 倉庫設置中啟用 GitHub Pages：

   - 進入 Settings > Pages
   - Source 選擇 "GitHub Actions"

2. 推送代碼到 `main` 分支：

   ```bash
   git push origin main
   ```

3. GitHub Actions 會自動：

   - 運行測試
   - 構建項目
   - 部署到 GitHub Pages

4. 部署完成後，訪問：`https://LQTjim.github.io/react-slot-game/`

### 手動觸發部署

也可以在 GitHub Actions 頁面手動觸發 workflow。

## License

MIT
