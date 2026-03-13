# 战斗/扫荡时保持角色页面

## 问题
战斗和扫荡过程中，获得物品时会自动切换到背包页面，打断玩家体验

## 根本原因
`Backpack.addResource()` 函数在添加物品后会自动切换到背包页面，而战斗掉落物品时会调用这个函数

## 需要修改的文件
1. `js/backpack.js` - 移除 `addResource` 中的自动切换
2. `js/game.js` - 移除制作物品后的自动切换
3. `js/rpg-ui.js` - 移除取下装备时的自动切换

## 详细修改

### 1. backpack.js 修改

**第120-123行** - `addResource` 函数中移除切换代码：
```javascript
// 删除以下代码
document.getElementById('backpackTab').classList.add('active');
document.getElementById('characterTab').classList.remove('active');
document.getElementById('backpackContent').style.display = 'block';
document.getElementById('characterContent').style.display = 'none';
```

**第466-470行** - `useItem` 函数中使用西瓜后移除切换代码

### 2. game.js 修改

**第236-240行** - 串虫虫串后移除切换代码
**第278-282行** - 制作咻咻辣辣串后移除切换代码

### 3. rpg-ui.js 修改

**第656-658行** - 取下装备时移除切换到背包页面的代码

## 保留的切换
以下切换应该保留（用户主动操作后需要看到结果）：
- 用户点击"背包"标签页
- 用户点击"角色"标签页
- 用户主动装备物品后切换到角色页面（backpack.js:299-300, rpg-ui.js:308-309, rpg-ui.js:617-618）