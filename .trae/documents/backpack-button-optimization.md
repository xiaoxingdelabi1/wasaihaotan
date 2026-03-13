# 背包按钮文字优化

## 需求
1. "装备" 改为 "装"
2. "上架" 改为 "售"
3. "精"（精炼）按钮隐藏

## 需要修改的文件
1. `js/backpack.js` - 修改按钮文字和隐藏精炼按钮

## 详细修改

### backpack.js 修改

**第253行** - 普通物品"上架"改为"售"：
```javascript
// 原来
buttons = `<button class="use-btn" data-index="${index}" data-type="${slot.type}" onclick="Stall.openModalForItem('${slot.type}', ${slot.count}, ${totalCount})")">上</button>`;

// 改为
buttons = `<button class="use-btn" data-index="${index}" data-type="${slot.type}" onclick="Stall.openModalForItem('${slot.type}', ${slot.count}, ${totalCount})")">售</button>`;
```

**第260行** - 装备"上架"改为"售"：
```javascript
// 原来
buttons = `<button class="use-btn" data-index="${index}" data-type="equipment" data-equipment-index="${equipmentIndex}" onclick="Stall.openModalForItem('equipment', 1, 1, ${equipmentIndex})")">上</button>`;

// 改为
buttons = `<button class="use-btn" data-index="${index}" data-type="equipment" data-equipment-index="${equipmentIndex}" onclick="Stall.openModalForItem('equipment', 1, 1, ${equipmentIndex})")">售</button>`;
```

**第262行** - "装备"改为"装"：
```javascript
// 原来
buttons += `<button class="use-btn" data-index="${index}" data-type="equipment" data-equipment-index="${equipmentIndex}">装备</button>`;

// 改为
buttons += `<button class="use-btn" data-index="${index}" data-type="equipment" data-equipment-index="${equipmentIndex}">装</button>`;
```

**第263-265行** - 删除精炼按钮代码：
```javascript
// 删除以下代码
if (Equipment.canRefine(slot.item)) {
    buttons += `<button class="use-btn" style="background-color: #9c27b0;" onclick="RPGUI.showRefineModalForBackpack(${equipmentIndex})">精</button>`;
}
```

## 效果
- 背包物品按钮：售、使
- 背包装备按钮：售、装
- 精炼按钮隐藏