const Backpack = {
    canAddItem(type, amount) {
        let newBugs = State.bugs;
        let newLeaves = State.leaves;
        let newSkewers = State.skewers;
        let newApples = State.apples;
        let newBananas = State.bananas;
        let newWatermelons = State.watermelons;
        let newPeppers = State.peppers;
        let newCarrots = State.carrots;
        let newPotatoes = State.potatoes;
        let newSpicySkewers = State.spicySkewers;
        let newPurses = State.purses;
        let newPiggyBanks = State.piggyBanks;
        let newEquipment = 0;
        
        if (type === 'bug') newBugs += amount;
        else if (type === 'leaf') newLeaves += amount;
        else if (type === 'skewer') newSkewers += amount;
        else if (type === 'apple') newApples += amount;
        else if (type === 'banana') newBananas += amount;
        else if (type === 'watermelon') newWatermelons += amount;
        else if (type === 'pepper') newPeppers += amount;
        else if (type === 'carrot') newCarrots += amount;
        else if (type === 'potato') newPotatoes += amount;
        else if (type === 'spicySkewer') newSpicySkewers += amount;
        else if (type === 'purse') newPurses += amount;
        else if (type === 'piggyBank') newPiggyBanks += amount;
        else if (type === 'equipment') newEquipment += amount;

        let bugSlots = 0;
        if (newBugs > 0) {
            const bugCap = Utils.getItemCapacity('虫子');
            bugSlots = Math.ceil(newBugs / bugCap);
        }
        let leafSlots = 0;
        if (newLeaves > 0) {
            const leafCap = Utils.getItemCapacity('荷叶');
            leafSlots = Math.ceil(newLeaves / leafCap);
        }
        let skewerSlots = 0;
        if (newSkewers > 0) {
            const skewerCap = Utils.getItemCapacity('虫虫串');
            skewerSlots = Math.ceil(newSkewers / skewerCap);
        }
        let appleSlots = 0;
        if (newApples > 0) {
            const appleCap = Utils.getItemCapacity('苹果');
            appleSlots = Math.ceil(newApples / appleCap);
        }
        let bananaSlots = 0;
        if (newBananas > 0) {
            const bananaCap = Utils.getItemCapacity('香蕉');
            bananaSlots = Math.ceil(newBananas / bananaCap);
        }
        let watermelonSlots = 0;
        if (newWatermelons > 0) {
            const watermelonCap = Utils.getItemCapacity('西瓜');
            watermelonSlots = Math.ceil(newWatermelons / watermelonCap);
        }
        let pepperSlots = 0;
        if (newPeppers > 0) {
            const pepperCap = Utils.getItemCapacity('辣椒');
            pepperSlots = Math.ceil(newPeppers / pepperCap);
        }
        let carrotSlots = 0;
        if (newCarrots > 0) {
            const carrotCap = Utils.getItemCapacity('胡萝卜');
            carrotSlots = Math.ceil(newCarrots / carrotCap);
        }
        let potatoSlots = 0;
        if (newPotatoes > 0) {
            const potatoCap = Utils.getItemCapacity('土豆');
            potatoSlots = Math.ceil(newPotatoes / potatoCap);
        }
        let spicySkewerSlots = 0;
        if (newSpicySkewers > 0) {
            const spicySkewerCap = Utils.getItemCapacity('咻咻辣辣串');
            spicySkewerSlots = Math.ceil(newSpicySkewers / spicySkewerCap);
        }
        let purseSlots = newPurses;
        let piggyBankSlots = newPiggyBanks;
        let dullPearlSlots = 0;
        if (State.dullPearls > 0) {
            const dullPearlCap = Utils.getItemCapacity('暗淡的珍珠');
            dullPearlSlots = Math.ceil(State.dullPearls / dullPearlCap);
        }
        return (bugSlots + leafSlots + skewerSlots + appleSlots + bananaSlots + watermelonSlots + pepperSlots + carrotSlots + potatoSlots + spicySkewerSlots + purseSlots + piggyBankSlots + dullPearlSlots + newEquipment) <= State.backpackCapacity;
    },
    
    addResource(type, amount) {
        if (type === 'bug') {
            State.bugs = Math.min(State.bugs + amount, Config.MAX_BUGS);
        } else if (type === 'leaf') {
            State.leaves = Math.min(State.leaves + amount, Config.MAX_LEAVES);
        } else if (type === 'skewer') {
            State.skewers = Math.min(State.skewers + amount, Config.MAX_SKEWERS);
        } else if (type === 'apple') {
            State.apples = Math.min(State.apples + amount, 100);
        } else if (type === 'banana') {
            State.bananas = Math.min(State.bananas + amount, 100);
        } else if (type === 'watermelon') {
            State.watermelons = Math.min(State.watermelons + amount, 50);
        } else if (type === 'pepper') {
            State.peppers = Math.min(State.peppers + amount, 100);
        } else if (type === 'carrot') {
            State.carrots = Math.min(State.carrots + amount, 100);
        } else if (type === 'potato') {
            State.potatoes = Math.min(State.potatoes + amount, 100);
        } else if (type === 'spicySkewer') {
            State.spicySkewers = Math.min(State.spicySkewers + amount, 50);
        } else if (type === 'purse') {
            State.purses = Math.min(State.purses + amount, Config.MAX_PURSES);
        } else if (type === 'piggyBank') {
            State.piggyBanks += amount;
        } else if (type === 'dullPearl') {
            State.dullPearls = Math.min(State.dullPearls + amount, 100);
        }
    },
    
    render() {
        const backpackUsedSpan = document.getElementById('backpackUsed');
        const backpackCapacitySpan = document.getElementById('backpackCapacity');
        const backpackGrid = document.getElementById('backpackGrid');
        
        let slots = [];
        if (State.bugs > 0) {
            const bugCap = Utils.getItemCapacity('虫子');
            let remaining = State.bugs;
            while (remaining > 0) {
                let count = Math.min(remaining, bugCap);
                slots.push({ type: 'bug', count: count });
                remaining -= count;
            }
        }
        if (State.leaves > 0) {
            const leafCap = Utils.getItemCapacity('荷叶');
            let remaining = State.leaves;
            while (remaining > 0) {
                let count = Math.min(remaining, leafCap);
                slots.push({ type: 'leaf', count: count });
                remaining -= count;
            }
        }
        if (State.skewers > 0) {
            const skewerCap = Utils.getItemCapacity('虫虫串');
            let remaining = State.skewers;
            while (remaining > 0) {
                let count = Math.min(remaining, skewerCap);
                slots.push({ type: 'skewer', count: count });
                remaining -= count;
            }
        }
        if (State.apples > 0) {
            const appleCap = Utils.getItemCapacity('苹果');
            let remaining = State.apples;
            while (remaining > 0) {
                let count = Math.min(remaining, appleCap);
                slots.push({ type: 'apple', count: count });
                remaining -= count;
            }
        }
        if (State.bananas > 0) {
            const bananaCap = Utils.getItemCapacity('香蕉');
            let remaining = State.bananas;
            while (remaining > 0) {
                let count = Math.min(remaining, bananaCap);
                slots.push({ type: 'banana', count: count });
                remaining -= count;
            }
        }
        if (State.watermelons > 0) {
            const watermelonCap = Utils.getItemCapacity('西瓜');
            let remaining = State.watermelons;
            while (remaining > 0) {
                let count = Math.min(remaining, watermelonCap);
                slots.push({ type: 'watermelon', count: count });
                remaining -= count;
            }
        }
        if (State.peppers > 0) {
            const pepperCap = Utils.getItemCapacity('辣椒');
            let remaining = State.peppers;
            while (remaining > 0) {
                let count = Math.min(remaining, pepperCap);
                slots.push({ type: 'pepper', count: count });
                remaining -= count;
            }
        }
        if (State.carrots > 0) {
            const carrotCap = Utils.getItemCapacity('胡萝卜');
            let remaining = State.carrots;
            while (remaining > 0) {
                let count = Math.min(remaining, carrotCap);
                slots.push({ type: 'carrot', count: count });
                remaining -= count;
            }
        }
        if (State.potatoes > 0) {
            const potatoCap = Utils.getItemCapacity('土豆');
            let remaining = State.potatoes;
            while (remaining > 0) {
                let count = Math.min(remaining, potatoCap);
                slots.push({ type: 'potato', count: count });
                remaining -= count;
            }
        }
        if (State.spicySkewers > 0) {
            const spicySkewerCap = Utils.getItemCapacity('咻咻辣辣串');
            let remaining = State.spicySkewers;
            while (remaining > 0) {
                let count = Math.min(remaining, spicySkewerCap);
                slots.push({ type: 'spicySkewer', count: count });
                remaining -= count;
            }
        }
        if (State.purses > 0) {
            const purseCap = Utils.getItemCapacity('荷包');
            let remaining = State.purses;
            while (remaining > 0) {
                let count = Math.min(remaining, purseCap);
                slots.push({ type: 'purse', count: count });
                remaining -= count;
            }
        }
        for (let i = 0; i < State.piggyBanks; i++) {
            slots.push({ type: 'piggyBank', count: 1 });
        }
        if (State.dullPearls > 0) {
            const dullPearlCap = Utils.getItemCapacity('暗淡的珍珠');
            let remaining = State.dullPearls;
            while (remaining > 0) {
                let count = Math.min(remaining, dullPearlCap);
                slots.push({ type: 'dullPearl', count: count });
                remaining -= count;
            }
        }
        State.equipmentBackpack.forEach((item, index) => {
            slots.push({ type: 'equipment', count: 1, item: item });
        });

        backpackUsedSpan.textContent = slots.length;
        backpackCapacitySpan.textContent = State.backpackCapacity;

        let html = '';
        slots.forEach((slot, index) => {
            let typeName = TypeNameMap[slot.type] || slot.type;
            let itemName = slot.item ? slot.item.name : typeName;
            let buttons = '';
            if (slot.type === 'leaf' || slot.type === 'purse' || slot.type === 'piggyBank' || slot.type === 'bug' || slot.type === 'skewer' || slot.type === 'apple' || slot.type === 'banana' || slot.type === 'watermelon' || slot.type === 'pepper' || slot.type === 'carrot' || slot.type === 'spicySkewer') {
                if (slot.type === 'bug' || slot.type === 'leaf' || slot.type === 'skewer' || slot.type === 'apple' || slot.type === 'banana' || slot.type === 'watermelon' || slot.type === 'pepper' || slot.type === 'carrot' || slot.type === 'spicySkewer' || slot.type === 'purse') {
                    const totalCount = ItemManager.getCount(slot.type);
                    buttons = `<button class="use-btn" data-index="${index}" data-type="${slot.type}" onclick="Stall.openModalForItem('${slot.type}', ${slot.count}, ${totalCount})")">售</button>`;
                }
                buttons += `<button class="use-btn" data-index="${index}" data-type="${slot.type}">使</button>`;
            } else if (slot.type === 'equipment') {
                const equipmentIndex = State.equipmentBackpack.indexOf(slot.item);
                const isTool = slot.item && slot.item.type === 'tool';
                if (!isTool) {
                    buttons = `<button class="use-btn" data-index="${index}" data-type="equipment" data-equipment-index="${equipmentIndex}" onclick="Stall.openModalForItem('equipment', 1, 1, ${equipmentIndex})")">售</button>`;
                }
                buttons += `<button class="use-btn" data-index="${index}" data-type="equipment" data-equipment-index="${equipmentIndex}">装</button>`;
            }
            let slotInfo = '';
            if (slot.item && slot.item.type === 'tool') {
                slotInfo = `<span>${itemName}</span><span></span>`;
            } else {
                slotInfo = `<span>${itemName}</span><span>${slot.count}</span>`;
            }
            html += `
                <div class="backpack-slot" data-slot-index="${index}">
                    <div class="slot-info">
                        ${slotInfo}
                    </div>
                    ${buttons}
                </div>
            `;
        });
        backpackGrid.innerHTML = html;

        document.querySelectorAll('.use-btn').forEach(btn => {
            // 只为没有onclick属性的按钮添加事件监听器
            if (!btn.hasAttribute('onclick')) {
                btn.addEventListener('click', (e) => {
                    const type = e.target.dataset.type;
                    if (type === 'equipment') {
                        const equipmentIndex = parseInt(e.target.dataset.equipmentIndex);
                        this.equipFromBackpack(equipmentIndex);
                        // 切换到角色页面
                        document.getElementById('backpackTab').classList.remove('active');
                        document.getElementById('characterTab').classList.add('active');
                        document.getElementById('backpackContent').style.display = 'none';
                        document.getElementById('characterContent').style.display = 'block';
                    } else {
                        this.useItem(type);
                    }
                });
            }
        });
    },
    
    useItem(type) {
        if (type === 'leaf') {
            const nextCost = Utils.getNextLeafUpgradeCost();
            if (State.leaves < nextCost) {
                alert(`升级需要 ${nextCost} 片荷叶，当前只有 ${State.leaves} 片，无法升级`);
                return;
            }
            State.leaves -= nextCost;
            State.usedLeaves++;
            Log.add(`使用了${nextCost}个荷叶，摊位上限+1`);
            UI.update();
            Achievement.render();
            Save.auto();
        } else if (type === 'purse') {
            const nextCost = Utils.getNextPurseUpgradeCost();
            if (State.purses < nextCost) {
                alert(`升级背包需要 ${nextCost} 个荷包，当前只有 ${State.purses} 个`);
                return;
            }
            State.purses -= nextCost;
            State.backpackUpgradeCount++;
            State.backpackCapacity++;
            Log.add(`使用了${nextCost}个荷包，背包容量+1`);
            UI.update();
            Achievement.render();
            Save.auto();
        } else if (type === 'piggyBank') {
            if (State.piggyBanks < 1) {
                alert('没有小存钱罐可用');
                return;
            }
            State.piggyBanks--;
            Config.MAX_COINS += 500;
            Log.add(`使用小存钱罐，金币上限增加500（当前上限：${Config.MAX_COINS}）`);
            UI.update();
            Save.auto();
        } else if (type === 'bug') {
            if (State.bugs < 1) {
                alert('没有虫子可用');
                return;
            }
            if (Character.currentHealth >= Character.maxHealth) {
                alert('血量已满，无需使用回血道具');
                return;
            }
            State.bugs--;
            const healAmount = 1;
            Character.heal(healAmount);
            Log.add(`使用虫子，恢复了 ${healAmount} 点生命值`);
            UI.update();
            Save.auto();
        } else if (type === 'skewer') {
            if (State.skewers < 1) {
                alert('没有虫虫串可用');
                return;
            }
            if (Character.currentHealth >= Character.maxHealth) {
                alert('血量已满，无需使用回血道具');
                return;
            }
            State.skewers--;
            const healAmount = 15;
            Character.heal(healAmount);
            Log.add(`使用虫虫串，恢复了 ${healAmount} 点生命值`);
            UI.update();
            Save.auto();
        } else if (type === 'pepper') {
            if (State.peppers < 1) {
                alert('没有辣椒可用');
                return;
            }
            State.peppers--;
            Log.add(`使用了1个辣椒`);
            UI.update();
            Save.auto();
        } else if (type === 'carrot') {
            if (State.carrots < 1) {
                alert('没有胡萝卜可用');
                return;
            }
            State.carrots--;
            Log.add(`使用了1个胡萝卜`);
            UI.update();
            Save.auto();
        } else if (type === 'potato') {
            if (State.potatoes < 1) {
                alert('没有土豆可用');
                return;
            }
            State.potatoes--;
            Log.add(`使用了1个土豆`);
            UI.update();
            Save.auto();
        } else if (type === 'spicySkewer') {
            if (State.spicySkewers < 1) {
                alert('没有咻咻辣辣串可用');
                return;
            }
            if (Character.currentHealth >= Character.maxHealth) {
                alert('血量已满，无需使用回血道具');
                return;
            }
            State.spicySkewers--;
            const healAmount = 50;
            Character.heal(healAmount);
            Log.add(`使用咻咻辣辣串，恢复了 ${healAmount} 点生命值`);
            UI.update();
            Save.auto();
        } else if (type === 'apple') {
            if (State.apples < 1) {
                alert('没有苹果可用');
                return;
            }
            if (Character.currentHealth >= Character.maxHealth) {
                alert('血量已满，无需使用回血道具');
                return;
            }
            State.apples--;
            const healAmount = 5;
            Character.heal(healAmount);
            Log.add(`使用苹果，恢复了 ${healAmount} 点生命值`);
            UI.update();
            Save.auto();
        } else if (type === 'banana') {
            if (State.bananas < 1) {
                alert('没有香蕉可用');
                return;
            }
            if (Character.currentHealth >= Character.maxHealth) {
                alert('血量已满，无需使用回血道具');
                return;
            }
            State.bananas--;
            const healAmount = 8;
            Character.heal(healAmount);
            Log.add(`使用香蕉，恢复了 ${healAmount} 点生命值`);
            UI.update();
            Save.auto();
        } else if (type === 'watermelon') {
            if (State.watermelons < 1) {
                alert('没有西瓜可用');
                return;
            }
            if (Character.currentHealth >= Character.maxHealth) {
                alert('血量已满，无需使用回血道具');
                return;
            }
            State.watermelons--;
            const healAmount = 15;
            Character.heal(healAmount);
            Log.add(`使用西瓜，恢复了 ${healAmount} 点生命值`);
            UI.update();
            Save.auto();
        }
    },
    
    renderStallBackpack() {
        const stallBackpackGrid = document.getElementById('stallBackpackGrid');
        let slots = [];
        if (State.bugs > 0) {
            const bugCap = Utils.getItemCapacity('虫子');
            let remaining = State.bugs;
            while (remaining > 0) {
                let count = Math.min(remaining, bugCap);
                slots.push({ type: 'bug', count: count });
                remaining -= count;
            }
        }
        if (State.leaves > 0) {
            const leafCap = Utils.getItemCapacity('荷叶');
            let remaining = State.leaves;
            while (remaining > 0) {
                let count = Math.min(remaining, leafCap);
                slots.push({ type: 'leaf', count: count });
                remaining -= count;
            }
        }
        if (State.skewers > 0) {
            const skewerCap = Utils.getItemCapacity('虫虫串');
            let remaining = State.skewers;
            while (remaining > 0) {
                let count = Math.min(remaining, skewerCap);
                slots.push({ type: 'skewer', count: count });
                remaining -= count;
            }
        }
        if (State.apples > 0) {
            const appleCap = Utils.getItemCapacity('苹果');
            let remaining = State.apples;
            while (remaining > 0) {
                let count = Math.min(remaining, appleCap);
                slots.push({ type: 'apple', count: count });
                remaining -= count;
            }
        }
        if (State.bananas > 0) {
            const bananaCap = Utils.getItemCapacity('香蕉');
            let remaining = State.bananas;
            while (remaining > 0) {
                let count = Math.min(remaining, bananaCap);
                slots.push({ type: 'banana', count: count });
                remaining -= count;
            }
        }
        if (State.watermelons > 0) {
            const watermelonCap = Utils.getItemCapacity('西瓜');
            let remaining = State.watermelons;
            while (remaining > 0) {
                let count = Math.min(remaining, watermelonCap);
                slots.push({ type: 'watermelon', count: count });
                remaining -= count;
            }
        }
        if (State.peppers > 0) {
            const pepperCap = Utils.getItemCapacity('辣椒');
            let remaining = State.peppers;
            while (remaining > 0) {
                let count = Math.min(remaining, pepperCap);
                slots.push({ type: 'pepper', count: count });
                remaining -= count;
            }
        }
        if (State.carrots > 0) {
            const carrotCap = Utils.getItemCapacity('胡萝卜');
            let remaining = State.carrots;
            while (remaining > 0) {
                let count = Math.min(remaining, carrotCap);
                slots.push({ type: 'carrot', count: count });
                remaining -= count;
            }
        }
        if (State.skewers > 0) {
            const skewerCap = Utils.getItemCapacity('虫虫串');
            let remaining = State.skewers;
            while (remaining > 0) {
                let count = Math.min(remaining, skewerCap);
                slots.push({ type: 'skewer', count: count });
                remaining -= count;
            }
        }
        if (State.spicySkewers > 0) {
            const spicySkewerCap = Utils.getItemCapacity('咻咻辣辣串');
            let remaining = State.spicySkewers;
            while (remaining > 0) {
                let count = Math.min(remaining, spicySkewerCap);
                slots.push({ type: 'spicySkewer', count: count });
                remaining -= count;
            }
        }

        let html = '';
        slots.forEach((slot, index) => {
            let typeName = TypeNameMap[slot.type] || slot.type;
            html += `
                <div class="backpack-main-slot" data-slot-type="${slot.type}" data-slot-count="${slot.count}">
                    <span>${typeName}</span>
                    <span>${slot.count}</span>
                </div>
            `;
        });
        stallBackpackGrid.innerHTML = html;

        document.querySelectorAll('.backpack-main-slot').forEach(el => {
            el.addEventListener('click', () => {
                const type = el.dataset.slotType;
                const slotCount = parseInt(el.dataset.slotCount, 10);
                const total = ItemManager.getCount(type);
                if (total <= 0) return;
                Stall.openModalForItem(type, slotCount, total);
            });
        });
    },
    
    // 从背包装备物品
    equipFromBackpack(equipmentIndex) {
        if (equipmentIndex < 0 || equipmentIndex >= State.equipmentBackpack.length) {
            return;
        }
        
        const item = State.equipmentBackpack[equipmentIndex];
        if (!item) return;
        
        const oldItem = Character.equip(item);
        if (oldItem) {
            State.equipmentBackpack[equipmentIndex] = oldItem;
        } else {
            State.equipmentBackpack.splice(equipmentIndex, 1);
        }
        
        UI.update();
        Save.auto();
    }
};
