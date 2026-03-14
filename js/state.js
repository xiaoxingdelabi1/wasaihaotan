const State = {
    bugs: 0,
    coins: 0,
    leaves: 0,
    skewers: 0,
    apples: 0,
    bananas: 0,
    watermelons: 0,
    peppers: 0,
    carrots: 0,
    potatoes: 0,
    spicySkewers: 0,
    purses: 0,
    piggyBanks: 0,
    dullPearls: 0,
    usedLeaves: 0,
    backpackUpgradeCount: 0,
    backpackCapacity: 10,
    stallCount: 0,
    shopBuyCount: 0,
    totalSoldValue: 0,
    monsterKillCount: 0,
    bossKillCount: {},
    hasToaster: false,
    
    equipmentBackpack: [],
    
    stallItems: [],
    marketItems: [],
    shopItems: [],
    globalVolatility: 1,
    
    autoSellEnabled: false,
    autoProcess: {
        skewer: false,
        spicySkewer: false
    },
    
    logs: [],
    
    currentRegion: '池塘',
    completedAchievements: [],
    completedLongTermAchievements: [],
    defeatedMonsters: {},
    areaKillCount: {},
    bossDefeated: {},
    
    startTimestamp: Date.now(),
    initialDays: 4.0,
    lastDayNumber: 5,
    
    reset() {
        this.bugs = 0;
        this.coins = 0;
        this.leaves = 0;
        this.skewers = 0;
        this.apples = 0;
        this.bananas = 0;
        this.watermelons = 0;
        this.peppers = 0;
        this.carrots = 0;
        this.potatoes = 0;
        this.spicySkewers = 0;
        this.purses = 0;
        this.piggyBanks = 0;
        this.dullPearls = 0;
        this.usedLeaves = 0;
        this.backpackUpgradeCount = 0;
        this.backpackCapacity = 10;
        this.stallCount = 0;
        this.shopBuyCount = 0;
        this.totalSoldValue = 0;
        this.monsterKillCount = 0;
        this.bossKillCount = {};
        this.hasToaster = false;
        this.equipmentBackpack = [];
        this.stallItems = [];
        this.marketItems = JSON.parse(JSON.stringify(InitialMarketItems));
        this.shopItems = [];
        this.globalVolatility = 1;
        this.autoSellEnabled = false;
        this.autoProcess = {
            skewer: false,
            spicySkewer: false
        };
        this.logs = [];
        this.currentRegion = '池塘';
        this.completedAchievements = [];
        this.completedLongTermAchievements = [];
        this.defeatedMonsters = {};
        this.areaKillCount = {};
        this.bossDefeated = {};
        this.startTimestamp = Date.now();
        this.initialDays = 4.0;
        this.lastDayNumber = 5;
    },
    
    getSaveData() {
        return {
            bugs: this.bugs,
            coins: this.coins,
            leaves: this.leaves,
            skewers: this.skewers,
            apples: this.apples,
            bananas: this.bananas,
            watermelons: this.watermelons,
            peppers: this.peppers,
            carrots: this.carrots,
            potatoes: this.potatoes,
            spicySkewers: this.spicySkewers,
            purses: this.purses,
            piggyBanks: this.piggyBanks,
            dullPearls: this.dullPearls,
            usedLeaves: this.usedLeaves,
            backpackUpgradeCount: this.backpackUpgradeCount,
            backpackCapacity: this.backpackCapacity,
            stallCount: this.stallCount,
            shopBuyCount: this.shopBuyCount,
            totalSoldValue: this.totalSoldValue,
            monsterKillCount: this.monsterKillCount,
            equipmentBackpack: this.equipmentBackpack,
            stallItems: this.stallItems,
            marketItems: this.marketItems,
            shopItems: this.shopItems,
            globalVolatility: this.globalVolatility,
            initialDays: this.initialDays,
            startTimestamp: this.startTimestamp,
            lastDayNumber: this.lastDayNumber,
            currentRegion: this.currentRegion,
            completedAchievements: this.completedAchievements,
            completedLongTermAchievements: this.completedLongTermAchievements,
            defeatedMonsters: this.defeatedMonsters,
            areaKillCount: this.areaKillCount,
            bossDefeated: this.bossDefeated,
            bossKillCount: this.bossKillCount,
            logs: this.logs,
            maxCoins: Config.MAX_COINS,
            character: Character.getInfo(),
            currentArea: Areas.currentArea,
            unlockedAreas: Areas.areas.filter(a => a.isUnlocked).map(a => a.id),
            autoSellEnabled: this.autoSellEnabled,
            autoProcess: this.autoProcess,
            hasToaster: this.hasToaster
        };
    },
    
    loadSaveData(data) {
        this.bugs = data.bugs || 0;
        this.coins = data.coins || 0;
        this.leaves = data.leaves || 0;
        this.skewers = data.skewers || 0;
        this.apples = data.apples || 0;
        this.bananas = data.bananas || 0;
        this.watermelons = data.watermelons || 0;
        this.peppers = data.peppers || 0;
        this.carrots = data.carrots || 0;
        this.potatoes = data.potatoes || 0;
        this.spicySkewers = data.spicySkewers || 0;
        this.purses = data.purses || 0;
        this.piggyBanks = data.piggyBanks || 0;
        this.dullPearls = data.dullPearls || 0;
        this.usedLeaves = data.usedLeaves || 0;
        this.backpackUpgradeCount = data.backpackUpgradeCount || 0;
        this.backpackCapacity = data.backpackCapacity || 10;
        this.stallCount = data.stallCount || 0;
        this.shopBuyCount = data.shopBuyCount || 0;
        this.totalSoldValue = data.totalSoldValue || 0;
        this.monsterKillCount = data.monsterKillCount || 0;
        this.equipmentBackpack = data.equipmentBackpack || [];
        this.stallItems = data.stallItems || [];
        
        if (data.marketItems && data.marketItems.length > 0) {
            this.marketItems = data.marketItems;
            const existingNames = new Set(this.marketItems.map(item => item.name));
            const newItems = InitialMarketItems.filter(item => !existingNames.has(item.name));
            if (newItems.length > 0) {
                this.marketItems.push(...newItems);
            }
        } else {
            this.marketItems = JSON.parse(JSON.stringify(InitialMarketItems));
        }
        
        this.shopItems = data.shopItems || [];
        this.globalVolatility = data.globalVolatility !== undefined ? data.globalVolatility : 1;
        this.initialDays = data.initialDays !== undefined ? data.initialDays : 4.0;
        this.startTimestamp = data.startTimestamp || Date.now();
        this.lastDayNumber = data.lastDayNumber || 5;
        this.currentRegion = data.currentRegion || '池塘';
        this.completedAchievements = data.completedAchievements || [];
        this.completedLongTermAchievements = data.completedLongTermAchievements || [];
        this.defeatedMonsters = data.defeatedMonsters || {};
        this.areaKillCount = data.areaKillCount || {};
        this.bossDefeated = data.bossDefeated || {};
        this.bossKillCount = data.bossKillCount || {};
        this.logs = data.logs || [];
        this.autoSellEnabled = data.autoSellEnabled || false;
        this.autoProcess = data.autoProcess || { skewer: false, spicySkewer: false };
        this.hasToaster = data.hasToaster || false;
        if (data.maxCoins) {
            Config.MAX_COINS = data.maxCoins;
        }
        
        if (data.character) {
            Object.assign(Character, data.character);
            if (!Character.equipment) {
                Character.equipment = {
                    weapon: null,
                    armor: null,
                    helmet: null,
                    boots: null,
                    gloves: null,
                    pants: null,
                    tool: null
                };
            } else {
                if (!Character.equipment.pants) Character.equipment.pants = null;
                if (!Character.equipment.tool) Character.equipment.tool = null;
            }
            Character.calculateStats();
        }
        
        if (data.currentArea) {
            Areas.currentArea = data.currentArea;
        }
        
        if (data.unlockedAreas) {
            console.log('Loading unlocked areas:', data.unlockedAreas);
            data.unlockedAreas.forEach(areaId => {
                const area = Areas.areas.find(a => a.id === areaId);
                if (area) {
                    area.isUnlocked = true;
                    console.log('Unlocked area:', areaId);
                }
            });
        }
        console.log('Areas after load:', Areas.areas.map(a => ({ id: a.id, isUnlocked: a.isUnlocked })));
    }
};
