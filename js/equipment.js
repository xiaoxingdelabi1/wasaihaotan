const Equipment = {
    types: ['weapon', 'armor', 'helmet', 'boots', 'gloves', 'pants', 'tool'],
    
    qualities: {
        common: { name: '普通', color: '#808080', multiplier: 1.0 },
        uncommon: { name: '优秀', color: '#008000', multiplier: 1.2 },
        rare: { name: '稀有', color: '#0000FF', multiplier: 1.5 },
        epic: { name: '史诗', color: '#800080', multiplier: 2.0 },
        legendary: { name: '传说', color: '#FF8C00', multiplier: 2.5 }
    },
    
    setBonuses: {
        '池塘行者': {
            pieces2: { health: 150, defense: 25 },
            pieces5: { defensePercent: 15, health: 200, defense: 30 }
        },
        '森林猎手': {
            pieces2: { attack: 40, criticalChance: 8 },
            pieces5: { criticalChance: 12, attack: 50, monsterDamage: 20 }
        },
        '山洞探险家': {
            pieces2: { attack: 30, defense: 15, health: 100, criticalDamage: 25 },
            pieces5: { criticalChance: 10, criticalDamage: 35, attack: 30, health: 150 }
        },
        '城堡勇士': {
            pieces2: { monsterDamage: 20, attack: 35 },
            pieces5: { monsterDamage: 40, attack: 60, health: 300 }
        }
    },
    
    attributeTypes: ['health', 'defense', 'attack', 'criticalChance', 'criticalDamage', 'monsterDamage', 'dodge'],
    
    attributeNames: {
        health: '生命',
        defense: '防御',
        attack: '攻击',
        criticalChance: '暴击率',
        criticalDamage: '暴击伤害',
        monsterDamage: '怪物伤害',
        dodge: '闪避'
    },
    
    attributeValues: {
        1: { health: 150, defense: 20, attack: 25, criticalChance: 3, criticalDamage: 15, monsterDamage: 5, dodge: 4 },
        5: { health: 150, defense: 20, attack: 25, criticalChance: 3, criticalDamage: 15, monsterDamage: 5, dodge: 4 },
        10: { health: 150, defense: 20, attack: 25, criticalChance: 3, criticalDamage: 15, monsterDamage: 5, dodge: 4 },
        15: { health: 350, defense: 50, attack: 40, criticalChance: 6, criticalDamage: 30, monsterDamage: 15, dodge: 8 }
    },
    
    setEquipment: {
        'pond': { setName: '池塘行者', level: 1, types: ['armor', 'helmet', 'boots', 'gloves', 'pants'] },
        'forest': { setName: '森林猎手', level: 5, types: ['armor', 'helmet', 'boots', 'gloves', 'pants'] },
        'cave': { setName: '山洞探险家', level: 10, types: ['armor', 'helmet', 'boots', 'gloves', 'pants'] },
        'castle': { setName: '城堡勇士', level: 15, types: ['armor', 'helmet', 'boots', 'gloves', 'pants'] }
    },
    
    equipmentPool: {
        weapon: [
            { name: '木棍', level: 1 },
            { name: '铁剑', level: 5 },
            { name: '钢剑', level: 10 },
            { name: '火焰剑', level: 15 },
            { name: '王者之剑', level: 20 }
        ],
        armor: [
            { name: '布甲', level: 1 },
            { name: '皮甲', level: 5 },
            { name: '铁甲', level: 10 },
            { name: '钢甲', level: 15 },
            { name: '龙鳞甲', level: 20 }
        ],
        helmet: [
            { name: '布帽', level: 1 },
            { name: '皮帽', level: 5 },
            { name: '铁盔', level: 10 },
            { name: '钢盔', level: 15 },
            { name: '龙首盔', level: 20 }
        ],
        boots: [
            { name: '布鞋', level: 1 },
            { name: '皮靴', level: 5 },
            { name: '铁靴', level: 10 },
            { name: '钢靴', level: 15 },
            { name: '龙靴', level: 20 }
        ],
        gloves: [
            { name: '布手套', level: 1 },
            { name: '皮手套', level: 5 },
            { name: '铁手套', level: 10 },
            { name: '钢手套', level: 15 },
            { name: '龙爪手套', level: 20 }
        ],
        pants: [
            { name: '布裤', level: 1 },
            { name: '皮裤', level: 5 },
            { name: '铁裤', level: 10 },
            { name: '钢裤', level: 15 },
            { name: '龙鳞裤', level: 20 }
        ],
        tool: [
            { name: '锄头', level: 1, durability: 10, value: 10 },
            { name: '捕虫网', level: 1, durability: 100, value: 15 }
        ]
    },
    
    typeNames: {
        weapon: '武器',
        armor: '护甲',
        helmet: '头盔',
        boots: '鞋子',
        gloves: '手套',
        pants: '裤子',
        tool: '工具'
    },
    
    // 生成装备
    generateEquipment(areaLevel) {
        const type = this.types[Math.floor(Math.random() * this.types.length)];
        const pool = this.equipmentPool[type];
        
        const eligibleItems = pool.filter(item => item.level <= areaLevel + 5);
        if (eligibleItems.length === 0) {
            return null;
        }
        
        const baseItem = eligibleItems[Math.floor(Math.random() * eligibleItems.length)];
        
        const qualityKeys = Object.keys(this.qualities);
        const quality = qualityKeys[Math.floor(Math.random() * qualityKeys.length)];
        const qualityData = this.qualities[quality];
        
        const equipment = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: `${qualityData.name} ${baseItem.name}`,
            type: type,
            level: baseItem.level,
            quality: quality,
            value: 10
        };
        
        if (type === 'tool' && baseItem.durability) {
            equipment.durability = baseItem.durability;
            equipment.maxDurability = baseItem.durability;
            equipment.value = baseItem.value;
        } else {
            const attrType = this.attributeTypes[Math.floor(Math.random() * this.attributeTypes.length)];
            const attrValue = this.attributeValues[baseItem.level] ? this.attributeValues[baseItem.level][attrType] : this.attributeValues[1][attrType];
            equipment[attrType] = Math.floor(attrValue * qualityData.multiplier);
            equipment.value = Math.floor(attrValue * qualityData.multiplier * 5);
        }
        
        return equipment;
    },
    
    generateEquipmentWithQuality(areaLevel, fixedQuality) {
        const type = this.types[Math.floor(Math.random() * this.types.length)];
        const pool = this.equipmentPool[type];
        
        const eligibleItems = pool.filter(item => item.level <= areaLevel + 5);
        if (eligibleItems.length === 0) {
            return null;
        }
        
        const baseItem = eligibleItems[Math.floor(Math.random() * eligibleItems.length)];
        const quality = fixedQuality || 'common';
        const qualityData = this.qualities[quality];
        
        const equipment = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: `${qualityData.name} ${baseItem.name}`,
            type: type,
            level: baseItem.level,
            quality: quality,
            value: 10
        };
        
        if (type === 'tool' && baseItem.durability) {
            equipment.durability = baseItem.durability;
            equipment.maxDurability = baseItem.durability;
            equipment.value = baseItem.value;
        } else {
            const attrType = this.attributeTypes[Math.floor(Math.random() * this.attributeTypes.length)];
            const attrValue = this.attributeValues[baseItem.level] ? this.attributeValues[baseItem.level][attrType] : this.attributeValues[1][attrType];
            equipment[attrType] = Math.floor(attrValue * qualityData.multiplier);
            equipment.value = Math.floor(attrValue * qualityData.multiplier * 5);
        }
        
        return equipment;
    },
    
    // 获得装备品质颜色
    getQualityColor(quality) {
        return this.qualities[quality]?.color || '#808080';
    },
    
    // 获得装备品质名称
    getQualityName(quality) {
        return this.qualities[quality]?.name || '普通';
    },
    
    // 装备比较
    compare(item1, item2) {
        if (!item1 || !item2) return false;
        
        const qualityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        const qualityDiff = qualityOrder.indexOf(item1.quality) - qualityOrder.indexOf(item2.quality);
        
        if (qualityDiff !== 0) {
            return qualityDiff > 0;
        }
        
        const item1Score = (item1.attack || 0) + (item1.defense || 0) + (item1.agility || 0) * 2 + (item1.intelligence || 0) * 2 + (item1.vitality || 0) * 2;
        const item2Score = (item2.attack || 0) + (item2.defense || 0) + (item2.agility || 0) * 2 + (item2.intelligence || 0) * 2 + (item2.vitality || 0) * 2;
        
        return item1Score > item2Score;
    },
    
    refineCosts: {
        0: 1, 1: 2, 2: 3, 3: 4, 4: 5,
        5: 6, 6: 7, 7: 8, 8: 10, 9: 12,
        10: 15, 11: 18, 12: 22, 13: 26, 14: 30
    },
    
    refineSuccessRates: {
        0: 1.0, 1: 1.0, 2: 0.9, 3: 0.85, 4: 0.8,
        5: 0.7, 6: 0.6, 7: 0.5, 8: 0.4, 9: 0.35,
        10: 0.3, 11: 0.25, 12: 0.2, 13: 0.15, 14: 0.1
    },
    
    MAX_REFINE_LEVEL: 15,
    REFINE_BONUS_PER_LEVEL: 0.04,
    
    canRefine(equipment) {
        if (!equipment) return false;
        const refineLevel = equipment.refineLevel || 0;
        return refineLevel < this.MAX_REFINE_LEVEL;
    },
    
    getRefineCost(equipment) {
        if (!equipment) return 0;
        const refineLevel = equipment.refineLevel || 0;
        return this.refineCosts[refineLevel] || 999;
    },
    
    getRefineSuccessRate(equipment) {
        if (!equipment) return 0;
        const refineLevel = equipment.refineLevel || 0;
        return this.refineSuccessRates[refineLevel] || 0;
    },
    
    getRefineBonus(refineLevel) {
        return (refineLevel || 0) * this.REFINE_BONUS_PER_LEVEL;
    },
    
    refine(equipmentIndex) {
        const equipment = State.equipmentBackpack[equipmentIndex];
        if (!equipment) {
            return { success: false, message: '装备不存在' };
        }
        
        if (!this.canRefine(equipment)) {
            return { success: false, message: '该装备已达到最高精炼等级+15' };
        }
        
        const cost = this.getRefineCost(equipment);
        if (State.dullPearls < cost) {
            return { success: false, message: `暗淡的珍珠不足，需要 ${cost} 个` };
        }
        
        const successRate = this.getRefineSuccessRate(equipment);
        const success = Math.random() < successRate;
        
        State.dullPearls -= cost;
        
        if (success) {
            const oldRefineLevel = equipment.refineLevel || 0;
            const newRefineLevel = oldRefineLevel + 1;
            equipment.refineLevel = newRefineLevel;
            
            const bonusMultiplier = 1 + this.REFINE_BONUS_PER_LEVEL;
            
            if (equipment.attack) {
                equipment.attack = Math.ceil(equipment.attack * bonusMultiplier * 100) / 100;
            }
            if (equipment.defense) {
                equipment.defense = Math.ceil(equipment.defense * bonusMultiplier * 100) / 100;
            }
            if (equipment.agility) {
                equipment.agility = Math.ceil(equipment.agility * bonusMultiplier * 100) / 100;
            }
            if (equipment.intelligence) {
                equipment.intelligence = Math.ceil(equipment.intelligence * bonusMultiplier * 100) / 100;
            }
            if (equipment.vitality) {
                equipment.vitality = Math.ceil(equipment.vitality * bonusMultiplier * 100) / 100;
            }
            if (equipment.health) {
                equipment.health = Math.ceil(equipment.health * bonusMultiplier * 100) / 100;
            }
            if (equipment.criticalChance) {
                equipment.criticalChance = Math.ceil(equipment.criticalChance * bonusMultiplier * 100) / 100;
            }
            if (equipment.criticalDamage) {
                equipment.criticalDamage = Math.ceil(equipment.criticalDamage * bonusMultiplier * 100) / 100;
            }
            if (equipment.monsterDamage) {
                equipment.monsterDamage = Math.ceil(equipment.monsterDamage * bonusMultiplier * 100) / 100;
            }
            if (equipment.dodge) {
                equipment.dodge = Math.ceil(equipment.dodge * bonusMultiplier * 100) / 100;
            }
            
            equipment.value = Math.floor(equipment.value * 1.1);
            
            Log.add(`精炼成功！装备精炼等级 +${newRefineLevel}`);
            Save.auto();
            return { success: true, message: `精炼成功！装备精炼等级提升为+${newRefineLevel}` };
        } else {
            Log.add(`精炼失败！消耗了 ${cost} 个暗淡的珍珠`);
            Save.auto();
            return { success: false, message: '精炼失败，材料已消耗' };
        }
    },
    
    createHoe() {
        return {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: '普通 锄头',
            type: 'tool',
            level: 1,
            quality: 'common',
            durability: 10,
            maxDurability: 10,
            value: 10
        };
    },
    
    createBugNet() {
        return {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: '普通 捕虫网',
            type: 'tool',
            level: 1,
            quality: 'common',
            durability: 100,
            maxDurability: 100,
            value: 15
        };
    },
    
    generateSetEquipment(areaId) {
        const setData = this.setEquipment[areaId];
        if (!setData) return null;
        
        const type = setData.types[Math.floor(Math.random() * setData.types.length)];
        const setName = setData.setName;
        const level = setData.level;
        
        const attrType = this.attributeTypes[Math.floor(Math.random() * this.attributeTypes.length)];
        const attrValue = this.attributeValues[level][attrType];
        
        const typeNames = {
            armor: '护甲',
            helmet: '头盔',
            boots: '鞋子',
            gloves: '手套',
            pants: '裤子'
        };
        
        const equipment = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: `${setName}${typeNames[type]}`,
            type: type,
            level: level,
            quality: 'common',
            setName: setName,
            value: attrValue * 5
        };
        
        equipment[attrType] = attrValue;
        
        return equipment;
    },
    
    getSetBonus(setName, pieceCount) {
        const bonus = this.setBonuses[setName];
        if (!bonus) return null;
        
        if (pieceCount >= 5) {
            return { ...bonus.pieces2, ...bonus.pieces5 };
        } else if (pieceCount >= 2) {
            return bonus.pieces2;
        }
        return null;
    },
    
    calculateSetBonuses(equipment) {
        const setCounts = {};
        
        Object.values(equipment).forEach(item => {
            if (item && item.setName) {
                setCounts[item.setName] = (setCounts[item.setName] || 0) + 1;
            }
        });
        
        const bonuses = {};
        Object.entries(setCounts).forEach(([setName, count]) => {
            const bonus = this.getSetBonus(setName, count);
            if (bonus) {
                Object.entries(bonus).forEach(([attr, value]) => {
                    bonuses[attr] = (bonuses[attr] || 0) + value;
                });
            }
        });
        
        return bonuses;
    },
    
    randomizeAttribute(equipment) {
        if (!equipment || equipment.quality !== 'common') return equipment;
        
        const level = equipment.level || 1;
        const attrType = this.attributeTypes[Math.floor(Math.random() * this.attributeTypes.length)];
        const attrValue = this.attributeValues[level][attrType];
        
        this.attributeTypes.forEach(attr => {
            delete equipment[attr];
        });
        
        equipment[attrType] = attrValue;
        
        return equipment;
    }
};
