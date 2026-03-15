# 战斗时血量同步到角色信息

## 问题
战斗时血量变化只更新战斗面板，没有同步到角色信息面板

## 解决方案
在战斗循环中调用 `RPGUI.updateCharacterInfo()` 同步更新角色信息

## 需要修改的文件
1. `js/combat.js` - 在战斗循环中同步更新角色信息

## 详细修改

### combat.js 修改

在 `startCombatLoop` 中，每次更新战斗面板后，同时调用 `RPGUI.updateCharacterInfo()` 更新角色信息面板：

```javascript
// 更新战斗面板
if (this.currentMonsterType) {
    document.getElementById(`combatMonsterHealth_${this.currentMonsterType}`).textContent = this.currentMonster.health;
    document.getElementById(`combatCharacterHealth_${this.currentMonsterType}`).textContent = Character.currentHealth;
}

// 同步更新角色信息面板
RPGUI.updateCharacterInfo();
```

### 修改位置
1. 玩家回合后更新
2. 怪物回合后更新
3. 战斗结束时更新