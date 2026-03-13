# 套装名称显示优化

## 需求
1. 套装名称（如"池塘行者"）只在套装效果区域显示，不在其他地方显示
2. 套装效果区域的颜色改为蓝色

## 需要修改的文件
1. `js/rpg-ui.js` - 移除装备页面上的套装名称显示，套装效果改为蓝色
2. `js/backpack.js` - 移除背包中的套装名称显示

## 详细修改

### 1. rpg-ui.js 修改

**第43行** - 移除装备页面上的套装名称显示：
```javascript
// 删除这行
const setName = item.setName ? `<div style="color: #FFD700; font-size: 11px;">[${item.setName}]</div>` : '';

// 删除第59行的 ${setName}
```

**第92行** - 套装效果颜色改为蓝色：
```javascript
// 原来
<div style="color: #FFD700; font-weight: bold;">${setName} (${count}/5)</div>

// 改为
<div style="color: #4169E1; font-weight: bold;">${setName} (${count}/5)</div>
```

### 2. backpack.js 修改

**第249行** - 移除背包中的套装名称显示：
```javascript
// 删除这行
let setName = slot.item && slot.item.setName ? `<br><span style="color: #FFD700; font-size: 10px;">[${slot.item.setName}]</span>` : '';

// 删除第270和272行的 ${setName}
```

## 效果
- 装备名称不再显示套装名称前缀
- 套装效果区域显示套装名称，颜色为蓝色
- 玩家可以通过套装效果区域了解装备属于哪个套装