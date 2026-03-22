const Currency = {
    UNITS: ['wen', 'copper', 'silver', 'gold', 'cake'],
    UNIT_NAMES: ['文', '铜', '银', '金', '饼'],
    RATIO: 1000,

    toWen(amount) {
        return Math.floor(amount * Math.pow(this.RATIO, 0));
    },

    toCopper(wen) {
        return Math.floor(wen / this.RATIO);
    },

    toSilver(wen) {
        return Math.floor(wen / Math.pow(this.RATIO, 2));
    },

    toGold(wen) {
        return Math.floor(wen / Math.pow(this.RATIO, 3));
    },

    toCake(wen) {
        return Math.floor(wen / Math.pow(this.RATIO, 4));
    },

    getTotalWen() {
        let total = 0;
        total += State.wen || 0;
        total += (State.copper || 0) * this.RATIO;
        total += (State.silver || 0) * Math.pow(this.RATIO, 2);
        total += (State.gold || 0) * Math.pow(this.RATIO, 3);
        total += (State.cake || 0) * Math.pow(this.RATIO, 4);
        return total;
    },

    addWen(amount) {
        let remaining = amount;
        
        State.wen = (State.wen || 0) + remaining;
        
        while (State.wen >= this.RATIO) {
            State.wen -= this.RATIO;
            State.copper = (State.copper || 0) + 1;
        }
        
        while (State.copper >= this.RATIO) {
            State.copper -= this.RATIO;
            State.silver = (State.silver || 0) + 1;
        }
        
        while (State.silver >= this.RATIO) {
            State.silver -= this.RATIO;
            State.gold = (State.gold || 0) + 1;
        }
        
        while (State.gold >= this.RATIO) {
            State.gold -= this.RATIO;
            State.cake = (State.cake || 0) + 1;
        }
    },

    subtractWen(amount) {
        let total = this.getTotalWen();
        if (total < amount) return false;
        
        let newTotal = total - amount;
        
        State.cake = Math.floor(newTotal / Math.pow(this.RATIO, 4));
        newTotal %= Math.pow(this.RATIO, 4);
        
        State.gold = Math.floor(newTotal / Math.pow(this.RATIO, 3));
        newTotal %= Math.pow(this.RATIO, 3);
        
        State.silver = Math.floor(newTotal / Math.pow(this.RATIO, 2));
        newTotal %= Math.pow(this.RATIO, 2);
        
        State.copper = Math.floor(newTotal / this.RATIO);
        newTotal %= this.RATIO;
        
        State.wen = newTotal;
        
        return true;
    },

    canAfford(wenAmount) {
        return this.getTotalWen() >= wenAmount;
    },

    format(wen, showAll = false) {
        const cake = Math.floor(wen / Math.pow(this.RATIO, 4));
        wen %= Math.pow(this.RATIO, 4);
        
        const gold = Math.floor(wen / Math.pow(this.RATIO, 3));
        wen %= Math.pow(this.RATIO, 3);
        
        const silver = Math.floor(wen / Math.pow(this.RATIO, 2));
        wen %= Math.pow(this.RATIO, 2);
        
        const copper = Math.floor(wen / this.RATIO);
        wen %= this.RATIO;
        
        const parts = [];
        if (cake > 0) parts.push(`${cake}饼`);
        if (gold > 0) parts.push(`${gold}金`);
        if (silver > 0) parts.push(`${silver}银`);
        if (copper > 0) parts.push(`${copper}铜`);
        if (wen > 0 || parts.length === 0) parts.push(`${wen}文`);
        
        if (showAll) {
            return parts.join(' ');
        }
        
        const nonZero = parts.filter(p => {
            const num = parseInt(p);
            return num > 0;
        });
        
        return nonZero.length > 0 ? nonZero.join(' ') : '0文';
    },

    formatState() {
        return this.format(this.getTotalWen());
    },

    formatShort(wen) {
        if (wen >= Math.pow(this.RATIO, 4)) {
            return `${Math.floor(wen / Math.pow(this.RATIO, 4))}饼`;
        }
        if (wen >= Math.pow(this.RATIO, 3)) {
            return `${Math.floor(wen / Math.pow(this.RATIO, 3))}金`;
        }
        if (wen >= Math.pow(this.RATIO, 2)) {
            return `${Math.floor(wen / Math.pow(this.RATIO, 2))}银`;
        }
        if (wen >= this.RATIO) {
            return `${Math.floor(wen / this.RATIO)}铜`;
        }
        return `${wen}文`;
    }
};
