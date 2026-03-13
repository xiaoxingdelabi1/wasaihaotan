# 可加工页面自动化改造

## 需求
将"可加工"页面改为自动化加工系统：
1. 添加自动化开关按钮，可以开启/关闭自动加工
2. 开启后，当材料足够时自动合成

## 当前加工配方
1. **虫虫串**：10只虫子 → 1个虫虫串
2. **咻咻辣辣串**：1个山椒 + 1个虫虫串 → 1个咻咻辣辣串

## 需要修改的文件
1. `js/state.js` - 添加自动化加工状态
2. `js/game.js` - 添加自动化加工逻辑和按钮事件
3. `index.html` - 添加自动化加工按钮

## 详细修改

### 1. state.js 修改
添加自动化加工状态：
```javascript
autoProcess: {
    skewer: false,      // 自动串虫虫串
    spicySkewer: false  // 自动制作咻咻辣辣串
}
```

在 save/load 中添加 autoProcess 的保存和加载

### 2. index.html 修改
在加工按钮旁边添加自动化开关按钮：
```html
<div style="display: flex; gap: 4px; align-items: center;">
    <button class="action-btn disabled" id="skewerBtn" disabled>串虫虫串</button>
    <button class="action-btn" id="autoSkewerBtn" style="background-color: #666; font-size: 12px;">自</button>
</div>
<div style="display: flex; gap: 4px; align-items: center;">
    <button class="action-btn disabled" id="spicySkewerBtn" disabled>制作咻咻辣辣串</button>
    <button class="action-btn" id="autoSpicySkewerBtn" style="background-color: #666; font-size: 12px;">自</button>
</div>
```

### 3. game.js 修改

**添加自动化加工定时器：**
```javascript
Game.autoProcessInterval = null;

Game.startAutoProcess() {
    if (this.autoProcessInterval) return;
    
    this.autoProcessInterval = setInterval(() => {
        // 自动串虫虫串
        if (State.autoProcess.skewer) {
            if (State.bugs >= 10 && State.skewers < Config.MAX_SKEWERS && Backpack.canAddItem('skewer', 1)) {
                State.bugs -= 10;
                State.skewers++;
                Log.add('自动串了1个虫虫串');
                UI.update();
                Save.auto();
            }
        }
        
        // 自动制作咻咻辣辣串
        if (State.autoProcess.spicySkewer) {
            if (State.peppers >= 1 && State.skewers >= 1 && State.spicySkewers < 50 && Backpack.canAddItem('spicySkewer', 1)) {
                State.peppers -= 1;
                State.skewers -= 1;
                State.spicySkewers++;
                Log.add('自动制作了1个咻咻辣辣串');
                UI.update();
                Save.auto();
            }
        }
    }, 2000); // 每2秒检查一次
}
```

**添加按钮事件：**
```javascript
document.getElementById('autoSkewerBtn').addEventListener('click', () => {
    State.autoProcess.skewer = !State.autoProcess.skewer;
    const btn = document.getElementById('autoSkewerBtn');
    btn.textContent = State.autoProcess.skewer ? '停' : '自';
    btn.style.backgroundColor = State.autoProcess.skewer ? '#4CAF50' : '#666';
    Save.auto();
});

document.getElementById('autoSpicySkewerBtn').addEventListener('click', () => {
    State.autoProcess.spicySkewer = !State.autoProcess.spicySkewer;
    const btn = document.getElementById('autoSpicySkewerBtn');
    btn.textContent = State.autoProcess.spicySkewer ? '停' : '自';
    btn.style.backgroundColor = State.autoProcess.spicySkewer ? '#4CAF50' : '#666';
    Save.auto();
});

// 在 init 中启动自动化
this.startAutoProcess();
```

## 效果
- 每个加工按钮旁边有一个"自"按钮
- 点击"自"按钮开启自动化，按钮变为"停"，颜色变绿
- 开启后每2秒检查材料，足够时自动合成
- 点击"停"按钮关闭自动化