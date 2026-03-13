const Config = {
    MAX_BUGS: 5000,
    MAX_COINS: 1000,
    MAX_LEAVES: 16,
    MAX_PURSES: 16,
    MAX_SKEWERS: 100,
    MAX_PEPPERS: 60,
    MAX_LOGS: 50,
    MAX_EQUIPMENT: 50,
    TAX_RATE: 0.05,
    HOTEL_COST: 100,
    PIGGY_BANK_VALUE: 500,
    SAVE_KEY: 'frogStallSave'
};

const SeasonNames = ["春", "雨", "秋", "冬"];

const Items = {
    bug: {
        name: '虫子',
        type: 'consumable',
        minPrice: 1,
        maxPrice: 3,
        currentPrice: 1,
        volatility: 1,
        capacity: 60,
        properties: { heal: 1 },
        inMarket: true,
        inShop: true,
        shopQuantity: 5
    },
    leaf: {
        name: '荷叶',
        type: 'upgrade',
        minPrice: 80,
        maxPrice: 150,
        currentPrice: 100,
        volatility: 10,
        capacity: 16,
        properties: { stallCapacity: 1 },
        inMarket: true,
        inShop: true,
        shopQuantity: 3
    },
    skewer: {
        name: '虫虫串',
        type: 'consumable',
        minPrice: 15,
        maxPrice: 45,
        currentPrice: 25,
        volatility: 5,
        capacity: 10,
        properties: { heal: 15 },
        inMarket: true,
        inShop: true,
        shopQuantity: 2
    },
    apple: {
        name: '苹果',
        type: 'consumable',
        minPrice: 3,
        maxPrice: 8,
        currentPrice: 5,
        volatility: 2,
        capacity: 10,
        properties: { heal: 5 },
        inMarket: true,
        inShop: true,
        shopQuantity: 3
    },
    banana: {
        name: '香蕉',
        type: 'consumable',
        minPrice: 5,
        maxPrice: 12,
        currentPrice: 8,
        volatility: 2,
        capacity: 10,
        properties: { heal: 8 },
        inMarket: true,
        inShop: true,
        shopQuantity: 3
    },
    watermelon: {
        name: '西瓜',
        type: 'consumable',
        minPrice: 10,
        maxPrice: 20,
        currentPrice: 15,
        volatility: 3,
        capacity: 5,
        properties: { heal: 15 },
        inMarket: true,
        inShop: true,
        shopQuantity: 2
    },
    pepper: {
        name: '辣椒',
        type: 'ingredient',
        minPrice: 8,
        maxPrice: 15,
        currentPrice: 10,
        volatility: 3,
        capacity: 10,
        properties: {},
        inMarket: true,
        inShop: true,
        shopQuantity: 3
    },
    carrot: {
        name: '胡萝卜',
        type: 'ingredient',
        minPrice: 5,
        maxPrice: 10,
        currentPrice: 7,
        volatility: 2,
        capacity: 10,
        properties: {},
        inMarket: true,
        inShop: true,
        shopQuantity: 3
    },
    potato: {
        name: '土豆',
        type: 'ingredient',
        minPrice: 4,
        maxPrice: 8,
        currentPrice: 5,
        volatility: 2,
        capacity: 10,
        properties: {},
        inMarket: true,
        inShop: true,
        shopQuantity: 3
    },
    spicySkewer: {
        name: '咻咻辣辣串',
        type: 'consumable',
        minPrice: 50,
        maxPrice: 100,
        currentPrice: 75,
        volatility: 10,
        capacity: 5,
        properties: { heal: 50 },
        inMarket: true,
        inShop: false,
        shopQuantity: 0
    },
    purse: {
        name: '荷包',
        type: 'upgrade',
        minPrice: 120,
        maxPrice: 180,
        currentPrice: 150,
        volatility: 10,
        capacity: 16,
        properties: { backpackCapacity: 1 },
        inMarket: true,
        inShop: true,
        shopQuantity: 2
    },
    piggyBank: {
        name: '小存钱罐',
        type: 'upgrade',
        minPrice: 280,
        maxPrice: 320,
        currentPrice: 300,
        volatility: 20,
        capacity: 1,
        properties: { maxCoins: 500 },
        inMarket: true,
        inShop: true,
        shopQuantity: 1
    },
    diamond: {
        name: '钻石',
        type: 'treasure',
        minPrice: 1000,
        maxPrice: 2000,
        currentPrice: 1500,
        volatility: 100,
        capacity: 1,
        properties: {},
        inMarket: true,
        inShop: false,
        shopQuantity: 0
    },
    godFruit: {
        name: '神果',
        type: 'consumable',
        minPrice: 8000,
        maxPrice: 15000,
        currentPrice: 12000,
        volatility: 500,
        capacity: 1,
        properties: { heal: 100, experience: 500 },
        inMarket: true,
        inShop: false,
        shopQuantity: 0
    },
    dragonScale: {
        name: '龙鳞',
        type: 'material',
        minPrice: 40000,
        maxPrice: 60000,
        currentPrice: 50000,
        volatility: 2000,
        capacity: 1,
        properties: {},
        inMarket: true,
        inShop: false,
        shopQuantity: 0
    },
    phoenixFeather: {
        name: '凤凰羽',
        type: 'material',
        minPrice: 150000,
        maxPrice: 250000,
        currentPrice: 200000,
        volatility: 10000,
        capacity: 1,
        properties: {},
        inMarket: true,
        inShop: false,
        shopQuantity: 0
    },
    dullPearl: {
        name: '暗淡的珍珠',
        type: 'material',
        minPrice: 50,
        maxPrice: 100,
        currentPrice: 75,
        volatility: 10,
        capacity: 10,
        properties: {},
        inMarket: true,
        inShop: false,
        shopQuantity: 0
    },

    getName(type) {
        return this[type]?.name || type;
    },
    
    getType(name) {
        for (let key in this) {
            if (typeof this[key] === 'object' && this[key].name === name) {
                return key;
            }
        }
        return name;
    },
    
    getMarketItems() {
        const items = [];
        for (let key in this) {
            if (typeof this[key] === 'object' && this[key].inMarket) {
                items.push({
                    id: key,
                    name: this[key].name,
                    type: this[key].type,
                    minPrice: this[key].minPrice,
                    maxPrice: this[key].maxPrice,
                    currentPrice: this[key].currentPrice,
                    volatility: this[key].volatility,
                    capacity: this[key].capacity,
                    properties: this[key].properties
                });
            }
        }
        return items;
    },
    
    getShopItems() {
        const items = [];
        for (let key in this) {
            if (typeof this[key] === 'object' && this[key].inShop) {
                items.push({
                    id: key,
                    name: this[key].name,
                    type: key,
                    baseQuantity: this[key].shopQuantity
                });
            }
        }
        return items;
    },
    
    getItem(type) {
        return this[type] || null;
    },
    
    getCapacity(type) {
        return this[type]?.capacity || 1;
    }
};

const InitialMarketItems = Items.getMarketItems();

const ShopInit = Items.getShopItems();

const RegionAchievements = {
    '池塘': [
        { id: 'pond_1', name: '初出茅庐', desc: '提交10只虫子', itemType: 'bug', count: 10, rewardCoins: 50, rewardItems: [] },
        { id: 'pond_2', name: '初试摆摊', desc: '成功上架1件物品', itemType: 'stall', count: 1, rewardCoins: 100, rewardItems: [] },
        { id: 'pond_3', name: '捕虫新手', desc: '提交30只虫子', itemType: 'bug', count: 30, rewardCoins: 150, rewardItems: [] },
        { id: 'pond_4', name: '串虫达人', desc: '提交5个虫虫串', itemType: 'skewer', count: 5, rewardCoins: 200, rewardItems: [{ name: '荷叶', count: 2 }] },
        { id: 'pond_5', name: '池塘富豪', desc: '使用1次荷叶', itemType: 'usedLeaf', count: 1, rewardCoins: 250, rewardItems: [{ name: '荷包', count: 1 }] },
        { id: 'pond_6', name: '集市常客', desc: '在集市购买1件物品', itemType: 'shopBuy', count: 1, rewardCoins: 50, rewardItems: [{ name: '荷包', count: 1 }] },
        { id: 'pond_6b', name: '捕虫装备', desc: '装备一个捕虫网', itemType: 'equipBugNet', count: 1, rewardCoins: 20, rewardItems: [] },
        { id: 'pond_7', name: '背包达人', desc: '使用1次荷包', itemType: 'usedPurse', count: 1, rewardCoins: 100, rewardItems: [{ name: '荷叶', count: 1 }] },
        { id: 'pond_8', name: '小有积蓄', desc: '累计出售价值500金币物品', itemType: 'soldValue', count: 500, rewardCoins: 0, rewardItems: [{ name: '小存钱罐', count: 1 }] },
        { id: 'pond_9', name: '初露锋芒', desc: '在冒险中击败1只妖怪', itemType: 'monsterKill', count: 1, rewardCoins: 0, rewardItems: [{ name: '虫虫串', count: 10 }] },
        { id: 'pond_10', name: '池塘之王', desc: '击败池塘霸主·水蛇王', itemType: 'bossKill', bossArea: 'pond', count: 1, rewardCoins: 1000, rewardItems: [{ name: '荷叶', count: 5 }, { name: '荷包', count: 2 }] }
    ],
    '森林': [
        { id: 'forest_1', name: '森林探索者', desc: '提交20只虫子', itemType: 'bug', count: 20, rewardCoins: 100, rewardItems: [] },
        { id: 'forest_2', name: '森林商人', desc: '提交50只虫子', itemType: 'bug', count: 50, rewardCoins: 300, rewardItems: [{ name: '荷叶', count: 3 }] },
        { id: 'forest_3', name: '串虫大师', desc: '提交20个虫虫串', itemType: 'skewer', count: 20, rewardCoins: 800, rewardItems: [{ name: '荷包', count: 2 }] }
    ],
    '沼泽': [
        { id: 'swamp_1', name: '沼泽行者', desc: '提交100只虫子', itemType: 'bug', count: 100, rewardCoins: 500, rewardItems: [{ name: '荷叶', count: 5 }] },
        { id: 'swamp_2', name: '沼泽大亨', desc: '提交50个虫虫串', itemType: 'skewer', count: 50, rewardCoins: 2000, rewardItems: [{ name: '荷包', count: 5 }] }
    ]
};

const LongTermAchievements = [
    { id: 'lt_1', name: '摆摊达人', desc: '累计上架100件物品', itemType: 'stall', count: 100, rewardCoins: 500, rewardItems: [{ name: '荷包', count: 3 }] },
    { id: 'lt_2', name: '购物狂', desc: '在集市购买50件物品', itemType: 'shopBuy', count: 50, rewardCoins: 300, rewardItems: [{ name: '荷叶', count: 5 }] },
    { id: 'lt_3', name: '富豪之路', desc: '累计出售价值5000金币物品', itemType: 'soldValue', count: 5000, rewardCoins: 0, rewardItems: [{ name: '小存钱罐', count: 3 }] },
    { id: 'lt_4', name: '妖魔克星', desc: '击败50只妖怪', itemType: 'monsterKill', count: 50, rewardCoins: 1000, rewardItems: [{ name: '荷叶', count: 10 }, { name: '荷包', count: 5 }] },
    { id: 'lt_5', name: '荷叶大师', desc: '使用10次荷叶', itemType: 'usedLeaf', count: 10, rewardCoins: 500, rewardItems: [{ name: '荷包', count: 5 }] },
    { id: 'lt_6', name: '背包专家', desc: '使用10次荷包', itemType: 'usedPurse', count: 10, rewardCoins: 500, rewardItems: [{ name: '荷叶', count: 5 }] }
];

const ItemTypeMap = {};
const TypeNameMap = {};
for (let key in Items) {
    if (typeof Items[key] === 'object' && Items[key].name) {
        ItemTypeMap[Items[key].name] = key;
        TypeNameMap[key] = Items[key].name;
    }
}
