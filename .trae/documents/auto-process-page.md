# 自动化页面改造

## 需求
1. 将"可加工"标签改名为"自动化"
2. 创建专门的"自动化"页面（pane），将自动化按钮放在这个页面中
3. 不改动"食材收集"页面的内容

## 需要修改的文件
1. `index.html` - 修改标签名称，创建自动化页面，移动按钮
2. `js/game.js` - 修改事件绑定，添加显示/隐藏逻辑
3. `js/ui.js` - 添加隐藏autoProcessPane的逻辑

## 详细修改

### 1. index.html 修改

**修改标签名称（第72行）：**
```html
<!-- 原来 -->
<a href="#" id="tabProcess">可加工</a> ·

<!-- 改为 -->
<a href="#" id="tabProcess">自动化</a> ·
```

**从mainButtonGroup中移除自动化按钮（第82-84行）：**
```html
<!-- 移除这两行 -->
<button class="action-btn" id="autoSkewerBtn" style="background-color: #666; font-size: 12px; padding: 2px 4px;">自</button>
<button class="action-btn" id="autoSpicySkewerBtn" style="background-color: #666; font-size: 12px; padding: 2px 4px;">自</button>
```

**在hotelPane之后添加自动化页面：**
```html
<div id="autoProcessPane" style="display: none; padding: 16px;">
    <h3>⚙️ 自动化加工</h3>
    <p style="color: #666; font-size: 12px; margin-bottom: 16px;">开启后自动加工材料</p>
    <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 120px;">虫虫串：</span>
            <span style="color: #666; font-size: 12px;">10虫子 → 1虫虫串</span>
            <button class="action-btn" id="autoSkewerBtn" style="background-color: #666; font-size: 12px; padding: 4px 8px;">自</button>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 120px;">咻咻辣辣串：</span>
            <span style="color: #666; font-size: 12px;">1山椒+1虫虫串 → 1咻咻辣辣串</span>
            <button class="action-btn" id="autoSpicySkewerBtn" style="background-color: #666; font-size: 12px; padding: 4px 8px;">自</button>
        </div>
    </div>
</div>
```

### 2. game.js 修改

**修改tabProcess点击事件：**
```javascript
document.getElementById('tabProcess').addEventListener('click', (e) => {
    e.preventDefault();
    UI.hideAllMainPanes();
    document.getElementById('autoProcessPane').style.display = 'block';
});
```

### 3. ui.js 修改

**在hideAllMainPanes方法中添加隐藏autoProcessPane：**
```javascript
document.getElementById('autoProcessPane').style.display = 'none';
```

## 效果
- "可加工"标签改名为"自动化"
- 点击"自动化"标签显示专门的自动化页面
- 自动化页面有加工配方说明和开关按钮
- "食材收集"页面保持原样