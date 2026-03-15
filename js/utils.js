const Utils = {
    normalRandom(mean, std) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return mean + std * z;
    },
    
    generateSaleTime(meanTime) {
        if (meanTime <= 0) return 0.1;
        const std = meanTime / 3;
        let t;
        do {
            t = this.normalRandom(meanTime, std);
        } while (t < 0.1 || t > 2 * meanTime);
        return t;
    },
    
    getQualityText(price) {
        if (price >= 100000) return '红';
        if (price >= 10000) return '金';
        if (price >= 1000) return '紫';
        if (price >= 100) return '蓝';
        if (price >= 10) return '绿';
        return '白';
    },
    
    getQualityClass(price) {
        if (price >= 100000) return 'quality-red';
        if (price >= 10000) return 'quality-gold';
        if (price >= 1000) return 'quality-purple';
        if (price >= 100) return 'quality-blue';
        if (price >= 10) return 'quality-green';
        return 'quality-white';
    },
    
    calculateTax(salePrice) {
        const rawTax = Math.floor(salePrice * Config.TAX_RATE);
        if (salePrice < 10 && rawTax < 1) {
            return 0;
        }
        if (salePrice >= 10 && rawTax < 1) {
            return 1;
        }
        return rawTax;
    },
    
    getNextPurseUpgradeCost() {
        return 2 * State.backpackUpgradeCount + 1;
    },
    
    getNextLeafUpgradeCost() {
        return 2 * State.usedLeaves + 1;
    },
    
    getItemCapacity(name) {
        const type = Items.getType(name);
        return Items.getCapacity(type);
    },
    
    getMaxStalls() {
        return 5 + State.usedLeaves;
    }
};
