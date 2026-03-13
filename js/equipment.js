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
            pieces2: { health: 20 },
            pieces4: { defensePercent: 5, health: 50 }
        },
        '森林猎手': {
            pieces2: { attack: 5 },
            pieces4: { criticalChance: 5, attack: 10 }
        },
        '山洞探险家': {
            pieces2: { criticalDamage: 15 },
            pieces4: { criticalChance: 8, criticalDamage: 25 }
        },
        '城堡勇士': {
            pieces2: { monsterDamage: 8 },
            pieces4: { monsterDamage: 15, attack: 15 }
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
        1: { health: 10, defense: 2, attack: 1, criticalChance: 1, criticalDamage: 5, monsterDamage: 2, dodge: 1 },
        5: { health: 25, defense: 5, attack: 2, criticalChance: 2, criticalDamage: 10, monsterDamage: 4, dodge: 2 },
        10: { health: 50, defense: 10, attack: 4, criticalChance: 3, criticalDamage: 15, monsterDamage: 6, dodge: 3 },
        15: { health: 80, defense: 15, attack: 6, criticalChance: 5, criticalDamage: 20, monsterDamage: 8, dodge: 4 }
    },
    
    setEquipment: {
        'pond': { setName: '池塘行者', level: 1, types: ['armor', 'helmet', 'boots', 'gloves', 'pants'] },
        'forest': { setName: '森林猎手', level: 5, types: ['armor', 'helmet', 'boots', 'gloves', 'pants'] },
        'cave': { setName: '山洞探险家', level: 10, types: ['armor', 'helmet', 'boots', 'gloves', 'pants'] },
        'castle': { setName: '城堡勇士', level: 15, types: ['armor', 'helmet', 'boots', 'gloves', 'pants'] }
    },
    
    equipmentPool: {
        weapon: [
            { name: '木棍', level: 1, attack: 5, quality: 'common' },
            { name: '铁剑', level: 5, attack: 12, quality: 'uncommon' },
            { name: '钢剑', level: 10, attack: 20, quality: 'rare' },
            { name: '火焰剑', level: 15, attack: 30, quality: 'epic' },
            { name: '王者之剑', level: 20, attack: 45, quality: 'legendary' }
        ],
        armor: [
            { name: '布甲', level: 1, defense: 3, quality: 'common' },
            { name: '皮甲', level: 5, defense: 8, quality: 'uncommon' },
            { name: '铁甲', level: 10, defense: 15, quality: 'rare' },
            { name: '钢甲', level: 15, defense: 25, quality: 'epic' },
            { name: '龙鳞甲', level: 20, defense: 40, quality: 'legendary' }
        ],
        helmet: [
            { name: '布帽', level: 1, defense: 1, quality: 'common' },
            { name: '皮帽', level: 5, defense: 3, quality: 'uncommon' },
            { name: '铁盔', level: 10, defense: 6, quality: 'rare' },
            { name: '钢盔', level: 15, defense: 10, quality: 'epic' },
            { name: '龙首盔', level: 20, defense: 15, quality: 'legendary' }
        ],
        boots: [
            { name: '布鞋', level: 1, defense: 1, dodge: 1, quality: 'common' },
            { name: '皮靴', level: 5, defense: 2, dodge: 2, quality: 'uncommon' },
            { name: '铁靴', level: 10, defense: 4, dodge: 3, quality: 'rare' },
            { name: '钢靴', level: 15, defense: 6, dodge: 4, quality: 'epic' },
            { name: '龙靴', level: 20, defense: 10, dodge: 6, quality: 'legendary' }
        ],
        gloves: [
            { name: '布手套', level: 1, attack: 1, quality: 'common' },
            { name: '皮手套', level: 5, attack: 2, quality: 'uncommon' },
            { name: '铁手套', level: 10, attack: 4, quality: 'rare' },
            { name: '钢手套', level: 15, attack: 6, quality: 'epic' },
            { name: '龙爪手套', level: 20, attack: 10, quality: 'legendary' }
        ],
        pants: [
            { name: '布裤', level: 1, defense: 2, quality: 'common' },
            { name: '皮裤', level: 5, defense: 5, quality: 'uncommon' },
            { name: '铁裤', level: 10, defense: 10, quality: 'rare' },
            { name: '钢裤', level: 15, defense: 15, quality: 'epic' },
            { name: '龙鳞裤', level: 20, defense: 25, quality: 'legendary' }
        ],
        tool: [
            { name: '锄头', level: 1, durability: 10, value: 10, quality: 'common' },
            { name: '捕虫网', level: 1, durability: 100, value: 15, quality: 'common' }
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
        
        // 根据区域等级选择装备
        const eligibleItems = pool.filter(item => item.level <= areaLevel + 5);
        if (eligibleItems.length === 0) {
            return null;
        }
        
        const baseItem = eligibleItems[Math.floor(Math.random() * eligibleItems.length)];
        
        // 随机品质
        const qualityKeys = Object.keys(this.qualities);
        const quality = qualityKeys[Math.floor(Math.random() * qualityKeys.length)];
        const qualityData = this.qualities[quality];
        
        // 生成装备
        const equipment = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: `${qualityData.name} ${baseItem.name}`,
            type: type,
            level: baseItem.level,
            quality: quality,
            attack: baseItem.attack ? Math.floor(baseItem.attack * qualityData.multiplier) : 0,
            defense: baseItem.defense ? Math.floor(baseItem.defense * qualityData.multiplier) : 0,
            agility: baseItem.agility ? Math.floor(baseItem.agility * qualityData.multiplier) : 0,
            intelligence: baseItem.intelligence ? Math.floor(baseItem.intelligence * qualityData.multiplier) : 0,
            vitality: baseItem.vitality ? Math.floor(baseItem.vitality * qualityData.multiplier) : 0,
            criticalChance: baseItem.criticalChance ? Math.floor(baseItem.criticalChance * qualityData.multiplier) : 0,
            criticalDamage: baseItem.criticalDamage ? Math.floor(baseItem.criticalDamage * qualityData.multiplier) : 0,
            dodge: baseItem.dodge ? Math.floor(baseItem.dodge * qualityData.multiplier) : 0,
            value: Math.floor((baseItem.attack || 0 + baseItem.defense || 0) * qualityData.multiplier * 10)
        };
        
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
            attack: baseItem.attack ? Math.floor(baseItem.attack * qualityData.multiplier) : 0,
            defense: baseItem.defense ? Math.floor(baseItem.defense * qualityData.multiplier) : 0,
            agility: baseItem.agility ? Math.floor(baseItem.agility * qualityData.multiplier) : 0,
            intelligence: baseItem.intelligence ? Math.floor(baseItem.intelligence * qualityData.multiplier) : 0,
            vitality: baseItem.vitality ? Math.floor(baseItem.vitality * qualityData.multiplier) : 0,
            criticalChance: baseItem.criticalChance ? Math.floor(baseItem.criticalChance * qualityData.multiplier) : 0,
            criticalDamage: baseItem.criticalDamage ? Math.floor(baseItem.criticalDamage * qualityData.multiplier) : 0,
            dodge: baseItem.dodge ? Math.floor(baseItem.dodge * qualityData.multiplier) : 0,
            value: Math.floor((baseItem.attack || 0 + baseItem.defense || 0) * qualityData.multiplier * 10)
        };
        
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
        common: 3,
        uncommon: 5,
        rare: 8,
        epic: 12
    },
    
    refineSuccessRates: {
        common: 0.8,
        uncommon: 0.6,
        rare: 0.4,
        epic: 0.2
    },
    
    canRefine(equipment) {
        if (!equipment) return false;
        const qualityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        const currentIndex = qualityOrder.indexOf(equipment.quality);
        return currentIndex < qualityOrder.length - 1;
    },
    
    getRefineCost(equipment) {
        if (!equipment) return 0;
        return this.refineCosts[equipment.quality] || 0;
    },
    
    getRefineSuccessRate(equipment) {
        if (!equipment) return 0;
        return this.refineSuccessRates[equipment.quality] || 0;
    },
    
    refine(equipmentIndex) {
        const equipment = State.equipmentBackpack[equipmentIndex];
        if (!equipment) {
            return { success: false, message: '装备不存在' };
        }
        
        if (!this.canRefine(equipment)) {
            return { success: false, message: '该装备已达到最高品质，无法精炼' };
        }
        
        const cost = this.getRefineCost(equipment);
        if (State.dullPearls < cost) {
            return { success: false, message: `暗淡的珍珠不足，需要 ${cost} 个` };
        }
        
        const successRate = this.getRefineSuccessRate(equipment);
        const success = Math.random() < successRate;
        
        State.dullPearls -= cost;
        
        if (success) {
            const qualityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
            const currentIndex = qualityOrder.indexOf(equipment.quality);
            const newQuality = qualityOrder[currentIndex + 1];
            const qualityData = this.qualities[newQuality];
            
            const oldName = equipment.name;
            equipment.quality = newQuality;
            equipment.name = equipment.name.replace(/^(普通|优秀|稀有|史诗|传说)\s*/, qualityData.name + ' ');
            
            if (equipment.attack) {
                equipment.attack = Math.floor(equipment.attack * 1.3);
            }
            if (equipment.defense) {
                equipment.defense = Math.floor(equipment.defense * 1.3);
            }
            if (equipment.agility) {
                equipment.agility = Math.floor(equipment.agility * 1.3);
            }
            if (equipment.intelligence) {
                equipment.intelligence = Math.floor(equipment.intelligence * 1.3);
            }
            if (equipment.vitality) {
                equipment.vitality = Math.floor(equipment.vitality * 1.3);
            }
            
            equipment.value = Math.floor(equipment.value * 1.5);
            
            Log.add(`精炼成功！${oldName} → ${equipment.name}`);
            Save.auto();
            return { success: true, message: `精炼成功！装备品质提升为${qualityData.name}` };
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
        
        if (pieceCount >= 4) {
            return { ...bonus.pieces2, ...bonus.pieces4 };
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
