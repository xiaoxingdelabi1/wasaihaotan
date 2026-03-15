const RPGIntegration = {
    // 初始化集成
    init() {
        this.setupEventListeners();
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 监听摆摊收入
        this.setupStallListeners();
        
        // 监听地区切换
        this.setupAreaListeners();
        
        // 监听装备变化
        this.setupEquipmentListeners();
    },
    
    // 设置摆摊监听器
    setupStallListeners() {
        // 监听摊位销售
        const originalStartSaleTimer = Stall.startSaleTimer;
        const self = this;
        Stall.startSaleTimer = function() {
            const interval = setInterval(() => {
                if (State.stallItems.length === 0) return;
                
                let changed = false;
                for (let i = State.stallItems.length - 1; i >= 0; i--) {
                    const item = State.stallItems[i];
                    item.timeRemaining -= 1;
                    
                    while (item.timeRemaining <= 0) {
                        item.remaining -= 1;
                        
                        const tax = Utils.calculateTax(item.customPrice);
                        const actualIncome = item.customPrice - tax;
                        
                        // 应用角色加成
                        const incomeWithBonus = RPGIntegration.applyIncomeBonus(actualIncome);
                        State.coins = Math.min(State.coins + incomeWithBonus, Config.MAX_COINS);
                        State.totalSoldValue += incomeWithBonus;
                        
                        const typeName = TypeNameMap[item.type] || item.type;
                        
                        if (tax > 0) {
                            Log.add(`售出1个${typeName}，收入${incomeWithBonus}金币（税${tax}）`);
                        } else {
                            Log.add(`售出1个${typeName}，收入${incomeWithBonus}金币（免税）`);
                        }
                        
                        if (item.remaining <= 0) {
                            State.stallItems.splice(i, 1);
                            changed = true;
                            break;
                        } else {
                            // 应用销售速度加成
                            const timeWithBonus = RPGIntegration.applySpeedBonus(item.meanTime);
                            item.timeRemaining += Utils.generateSaleTime(timeWithBonus);
                        }
                    }
                    if (item.remaining > 0) {
                        changed = true;
                    }
                }
                if (changed) {
                    UI.update();
                    Achievement.render();
                    Save.auto();
                }
            }, 1000);
            
            // 自动上架定时器（每5秒）
            setInterval(() => {
                if (State.autoSellEnabled) {
                    Stall.doAutoSell();
                }
            }, 5000);
            
            // 初始化时检查自动上架
            if (State.autoSellEnabled) {
                Stall.doAutoSell();
            }
        };
    },
    
    // 设置地区监听器
    setupAreaListeners() {
        // 监听地区切换对市场的影响
        const originalSwitchArea = Areas.switchArea;
        Areas.switchArea = function(areaId) {
            const result = originalSwitchArea.call(this, areaId);
            return result;
        };
    },
    
    // 设置装备监听器
    setupEquipmentListeners() {
        // 监听装备变化对摆摊的影响
        const originalEquip = Character.equip;
        Character.equip = function(item) {
            const result = originalEquip.call(this, item);
            if (result) {
                RPGIntegration.updateStallEfficiency();
            }
            return result;
        };
        
        const originalUnequip = Character.unequip;
        Character.unequip = function(slot) {
            const result = originalUnequip.call(this, slot);
            if (result) {
                RPGIntegration.updateStallEfficiency();
            }
            return result;
        };
    },
    
    // 应用收入加成
    applyIncomeBonus(baseIncome) {
        let bonus = 1.0;
        
        // 角色等级加成
        bonus += Character.level * 0.02; // 每级2%
        
        // 装备加成
        Object.values(Character.equipment).forEach(item => {
            if (item && item.intelligence) {
                bonus += item.intelligence * 0.01; // 每点智力1%
            }
        });
        
        // 地区加成
        const area = Areas.getCurrentArea();
        if (area) {
            bonus += area.level * 0.01; // 每级地区1%
        }
        
        return Math.floor(baseIncome * bonus);
    },
    
    // 应用销售速度加成
    applySpeedBonus(baseTime) {
        let bonus = 1.0;
        
        // 角色敏捷加成
        bonus -= Character.agility * 0.01; // 每点敏捷减少1%时间
        
        // 装备加成
        Object.values(Character.equipment).forEach(item => {
            if (item && item.agility) {
                bonus -= item.agility * 0.005; // 每点敏捷减少0.5%时间
            }
        });
        
        // 最低时间限制
        bonus = Math.max(0.5, bonus); // 最低50%时间
        
        return baseTime * bonus;
    },
    
    // 更新摊位效率
    updateStallEfficiency() {
        // 这里可以添加摊位效率的更新逻辑
        // 例如根据角色属性和装备调整摊位上限等
    },
    
    // 检查是否有新地区可以解锁
    checkAreaUnlock() {
        Areas.areas.forEach(area => {
            if (!area.isUnlocked) {
                Areas.checkUnlock(area.id);
            }
        });
    },
    
    // 完成地区任务
    completeAreaQuest(areaId) {
        const area = Areas.areas.find(a => a.id === areaId);
        if (!area) return;
        
        // 给予奖励
        const expReward = area.level * 100;
        const goldReward = area.level * 50;
        
        Character.gainExperience(expReward);
        State.coins = Math.min(State.coins + goldReward, Config.MAX_COINS);
        
        Log.add(`完成了${area.name}的任务，获得${expReward}经验和${goldReward}金币`);
        
        // 解锁下一个地区
        const nextAreaIndex = Areas.areas.indexOf(area) + 1;
        if (nextAreaIndex < Areas.areas.length) {
            const nextArea = Areas.areas[nextAreaIndex];
            Areas.unlockArea(nextArea.id);
        }
        
        UI.update();
    }
};
