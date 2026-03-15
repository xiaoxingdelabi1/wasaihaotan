const ItemManager = {
    typeToState: {
        'bug': 'bugs',
        'leaf': 'leaves',
        'skewer': 'skewers',
        'apple': 'apples',
        'banana': 'bananas',
        'watermelon': 'watermelons',
        'pepper': 'peppers',
        'carrot': 'carrots',
        'potato': 'potatoes',
        'spicySkewer': 'spicySkewers',
        'purse': 'purses',
        'piggyBank': 'piggyBanks',
        'dullPearl': 'dullPearls'
    },
    
    stateToType: {},
    
    init() {
        for (const [type, state] of Object.entries(this.typeToState)) {
            this.stateToType[state] = type;
        }
    },
    
    getStateKey(type) {
        return this.typeToState[type] || type;
    },
    
    getType(stateKey) {
        return this.stateToType[stateKey] || stateKey;
    },
    
    getCount(type) {
        const stateKey = this.getStateKey(type);
        return State[stateKey] || 0;
    },
    
    setCount(type, count) {
        const stateKey = this.getStateKey(type);
        if (stateKey && State.hasOwnProperty(stateKey)) {
            State[stateKey] = count;
        }
    },
    
    addCount(type, amount) {
        const stateKey = this.getStateKey(type);
        if (stateKey && State.hasOwnProperty(stateKey)) {
            State[stateKey] = (State[stateKey] || 0) + amount;
        }
    },
    
    getCapacity(type) {
        return Items.getCapacity(type);
    },
    
    getName(type) {
        return Items.getName(type);
    },
    
    getItem(type) {
        return Items.getItem(type);
    },
    
    canAdd(type, amount) {
        const current = this.getCount(type);
        const capacity = this.getCapacity(type);
        return current + amount <= capacity;
    },
    
    getStallTypes() {
        return ['bug', 'leaf', 'skewer', 'apple', 'banana', 'watermelon', 'pepper', 'carrot', 'potato', 'spicySkewer', 'purse', 'piggyBank'];
    },
    
    getAllItemTypes() {
        return Object.keys(this.typeToState);
    },
    
    hasItem(type, minCount = 1) {
        return this.getCount(type) >= minCount;
    }
};

ItemManager.init();
