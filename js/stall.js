const Stall = {
    getStallCapacity(type) {
        return Items.getCapacity(type);
    },
    
    getMarketPrice(type) {
        const itemName = Items.getName(type);
        const marketItem = State.marketItems.find(m => m.name === itemName);
        return marketItem ? marketItem.currentPrice : (Items.getItem(type)?.currentPrice || 1);
    },
    
    autoSellAll() {
        const maxStalls = Utils.getMaxStalls();
        let listed = 0;
        let messages = [];
        
        if (State.autoSellEnabled) {
            this.stopAutoSell();
            return;
        }
        
        ItemManager.getStallTypes().forEach(type => {
            if (State.stallItems.length >= maxStalls) return;
            
            const count = ItemManager.getCount(type);
            if (count <= 0) return;
            
            const stallCap = this.getStallCapacity(type);
            const marketPrice = this.getMarketPrice(type);
            const itemName = Items.getName(type);
            
            const qty = Math.min(count, stallCap);
            
            const meanTime = 5;
            const firstTime = Utils.generateSaleTime(meanTime);
            
            State.stallItems.push({
                type: type,
                remaining: qty,
                total: qty,
                basePrice: marketPrice,
                customPrice: marketPrice,
                baseSpeed: 5,
                meanTime: meanTime,
                timeRemaining: firstTime
            });
            
            ItemManager.addCount(type, -qty);
            State.stallCount++;
            listed++;
            messages.push(`${itemName}x${qty}`);
        });
        
        State.equipmentBackpack.forEach((equipment, index) => {
            if (State.stallItems.length >= maxStalls) return;
            
            const marketPrice = equipment.value || 10;
            
            State.stallItems.push({
                type: `equipment_${index}`,
                remaining: 1,
                total: 1,
                basePrice: marketPrice,
                customPrice: marketPrice,
                baseSpeed: 5,
                meanTime: 5,
                timeRemaining: Utils.generateSaleTime(5)
            });
            
            State.stallCount++;
            listed++;
            messages.push(`${equipment.name}x1`);
        });
        
        State.equipmentBackpack = [];
        
        if (listed > 0) {
            Log.add(`自动上架了 ${messages.join('、')}`);
            UI.update();
            Achievement.render();
            Save.auto();
            UI.setActiveTab(document.getElementById('stallTabBtn'), document.getElementById('stallPane'));
        } else {
            Log.add('没有可上架的物品');
        }
    },
    
    startAutoSell() {
        State.autoSellEnabled = true;
        this.updateAutoSellButton();
        this.doAutoSell();
    },
    
    stopAutoSell() {
        State.autoSellEnabled = false;
        this.updateAutoSellButton();
    },
    
    updateAutoSellButton() {
        const btn = document.getElementById('autoSellBtn');
        if (State.autoSellEnabled) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    },
    
    doAutoSell() {
        if (!State.autoSellEnabled) return;
        
        const maxStalls = Utils.getMaxStalls();
        if (State.stallItems.length >= maxStalls) return;
        
        const filterType = Settings.autoSellType;
        const minPrice = Settings.autoSellMinPrice;
        
        let listed = false;
        let messages = [];
        
        ItemManager.getStallTypes().forEach(type => {
            if (State.stallItems.length >= maxStalls) return;
            
            const count = ItemManager.getCount(type);
            if (count <= 0) return;
            
            const item = Items.getItem(type);
            if (!item) return;
            
            if (filterType !== 'all' && item.type !== filterType) return;
            
            const marketPrice = this.getMarketPrice(type);
            if (marketPrice > minPrice) return;
            
            const stallCap = this.getStallCapacity(type);
            const itemName = ItemManager.getName(type);
            
            const qty = Math.min(count, stallCap);
            
            const meanTime = 5;
            const firstTime = Utils.generateSaleTime(meanTime);
            
            State.stallItems.push({
                type: type,
                remaining: qty,
                total: qty,
                basePrice: marketPrice,
                customPrice: marketPrice,
                baseSpeed: 5,
                meanTime: meanTime,
                timeRemaining: firstTime
            });
            
            ItemManager.addCount(type, -qty);
            State.stallCount++;
            listed = true;
            messages.push(`${itemName}x${qty}`);
        });
        
        if (listed) {
            Log.add(`自动上架了 ${messages.join('、')}`);
            UI.update();
            Achievement.render();
            Save.auto();
        }
    },
    
    openModalForItem(type, defaultQty, maxQty, equipmentIndex) {
        const itemSelect = document.getElementById('itemSelect');
        const itemPrice = document.getElementById('itemPrice');
        const itemQuantity = document.getElementById('itemQuantity');
        
        const options = [];
        let marketPrice = 1;
        const stallCap = this.getStallCapacity(type);
        
        if (type === 'equipment' && equipmentIndex !== undefined) {
            const equipment = State.equipmentBackpack[equipmentIndex];
            if (equipment) {
                marketPrice = equipment.value;
                options.push({ value: `equipment_${equipmentIndex}`, text: `${equipment.name} (装备)`, marketPrice: marketPrice, capacity: 1 });
            }
        } else {
            const item = ItemManager.getItem(type);
            if (item) {
                marketPrice = this.getMarketPrice(type);
                const count = ItemManager.getCount(type);
                options.push({ value: type, text: `${item.name} (${count})`, marketPrice: marketPrice, capacity: stallCap });
            }
        }

        if (options.length === 0) return;

        itemSelect.innerHTML = '';
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            option.dataset.marketPrice = opt.marketPrice;
            option.dataset.capacity = opt.capacity;
            itemSelect.appendChild(option);
        });

        itemPrice.value = options[0].marketPrice;
        const actualMax = Math.min(maxQty, stallCap);
        itemQuantity.max = actualMax;
        itemQuantity.value = Math.min(defaultQty, actualMax);
        itemQuantity.min = 1;

        document.getElementById('stallModal').style.display = 'block';
    },
    
    openModal() {
        const itemSelect = document.getElementById('itemSelect');
        const itemPrice = document.getElementById('itemPrice');
        const itemQuantity = document.getElementById('itemQuantity');
        
        const options = [];
        
        ItemManager.getStallTypes().forEach(type => {
            const item = ItemManager.getItem(type);
            if (!item) return;
            const count = ItemManager.getCount(type);
            if (count > 0) {
                const cap = this.getStallCapacity(type);
                const marketPrice = this.getMarketPrice(type);
                options.push({ value: type, text: `${item.name} (${count})`, marketPrice: marketPrice, capacity: cap });
            }
        });
        
        State.equipmentBackpack.forEach((equipment, index) => {
            options.push({ value: `equipment_${index}`, text: `${equipment.name} (装备)`, marketPrice: equipment.value, capacity: 1 });
        });

        if (options.length === 0) {
            alert('没有可上架的物品');
            return;
        }

        itemSelect.innerHTML = '';
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.text;
            option.dataset.marketPrice = opt.marketPrice;
            option.dataset.capacity = opt.capacity;
            itemSelect.appendChild(option);
        });

        itemPrice.value = options[0].marketPrice;

        const selected = itemSelect.value;
        let available = this.getAvailableCount(selected);
        const stallCap = parseInt(itemSelect.selectedOptions[0]?.dataset.capacity || 1);
        const actualMax = Math.min(available, stallCap);
        itemQuantity.max = actualMax;
        itemQuantity.value = actualMax;
        itemQuantity.min = 1;

        const self = this;
        itemSelect.onchange = function() {
            const newSelected = itemSelect.value;
            const marketPrice = parseFloat(itemSelect.selectedOptions[0]?.dataset.marketPrice || 1);
            const newCap = parseInt(itemSelect.selectedOptions[0]?.dataset.capacity || 1);
            itemPrice.value = marketPrice;
            let newAvailable = self.getAvailableCount(newSelected);
            const newActualMax = Math.min(newAvailable, newCap);
            itemQuantity.max = newActualMax;
            itemQuantity.value = newActualMax;
        };

        document.getElementById('stallModal').style.display = 'block';
    },
    
    getAvailableCount(selected) {
        if (selected.startsWith('equipment_')) return 1;
        return ItemManager.getCount(selected);
    },
    
    confirmModal() {
        const itemSelect = document.getElementById('itemSelect');
        const itemPrice = document.getElementById('itemPrice');
        const itemQuantity = document.getElementById('itemQuantity');
        
        const selected = itemSelect.value;
        let qty = parseInt(itemQuantity.value, 10);
        const customPrice = parseInt(itemPrice.value, 10);
        const stallCap = parseInt(itemSelect.selectedOptions[0]?.dataset.capacity || 1);

        if (isNaN(qty) || qty <= 0) {
            alert('请输入有效数量');
            return;
        }
        if (isNaN(customPrice) || customPrice <= 0) {
            alert('售价必须为正整数');
            return;
        }

        let available = 0;
        let itemName = '';
        let basePrice = 1;
        let baseSpeed = 5;
        let equipmentIndex = -1;
        
        if (selected.startsWith('equipment_')) {
            available = 1;
            equipmentIndex = parseInt(selected.split('_')[1]);
            const equipment = State.equipmentBackpack[equipmentIndex];
            if (equipment) {
                itemName = equipment.name;
                basePrice = equipment.value;
                baseSpeed = 5;
            } else {
                alert('装备不存在');
                return;
            }
        } else {
            available = this.getAvailableCount(selected);
            const item = ItemManager.getItem(selected);
            if (item) {
                itemName = item.name;
                basePrice = this.getMarketPrice(selected);
                baseSpeed = 5;
            }
        }

        if (qty > available) {
            alert('数量不足');
            return;
        }
        
        if (qty > stallCap) {
            alert(`单个摊位上架数量不能超过${stallCap}个（该物品堆叠上限)`);
            return;
        }

        const maxStalls = Utils.getMaxStalls();
        if (State.stallItems.length >= maxStalls) {
            alert(`摊位已满 (${State.stallItems.length}/${maxStalls})，无法上架新物品`);
            return;
        }

        if (selected.startsWith('equipment_') && equipmentIndex !== -1) {
            State.equipmentBackpack.splice(equipmentIndex, 1);
        } else {
            ItemManager.addCount(selected, -qty);
        }

        const meanTime = baseSpeed * (customPrice / basePrice);

        const firstTime = Utils.generateSaleTime(meanTime);

        State.stallItems.push({
            type: selected,
            remaining: qty,
            total: qty,
            basePrice: basePrice,
            customPrice: customPrice,
            baseSpeed: baseSpeed,
            meanTime: meanTime,
            timeRemaining: firstTime
        });
        
        State.stallCount++;

        Log.add(`上架了${qty}个${itemName}，售价${customPrice}金币`);
        UI.update();
        Achievement.render();
        document.getElementById('stallModal').style.display = 'none';
        
        UI.setActiveTab(document.getElementById('stallTabBtn'), document.getElementById('stallPane'));
        
        Save.auto();
    },
    
    remove(index) {
        const item = State.stallItems[index];
        if (!item) return;
        
        if (item.type.startsWith('equipment_')) {
            const equipment = {
                name: TypeNameMap[item.type] || item.type,
                type: 'equipment',
                level: 1,
                quality: 'common',
                attack: 0,
                defense: 0,
                agility: 0,
                value: item.basePrice
            };
            if (!Backpack.canAddItem('equipment', 1)) {
                alert('背包空间不足，无法下架！');
                return;
            }
            State.equipmentBackpack.push(equipment);
            State.stallItems.splice(index, 1);
            Log.add(`下架了${item.remaining}个${equipment.name}`);
        } else {
            if (!Backpack.canAddItem(item.type, item.remaining)) {
                alert('背包空间不足，无法下架！');
                return;
            }
            Backpack.addResource(item.type, item.remaining);
            State.stallItems.splice(index, 1);
            Log.add(`下架了${item.remaining}个${TypeNameMap[item.type]}`);
        }
        UI.update();
        Save.auto();
    },
    
    clearAll() {
        let totalBugs = 0, totalLeaves = 0, totalSkewers = 0, totalEquipment = 0;
        const equipmentToAdd = [];
        
        State.stallItems.forEach(item => {
            if (item.type === 'bug') totalBugs += item.remaining;
            else if (item.type === 'leaf') totalLeaves += item.remaining;
            else if (item.type === 'skewer') totalSkewers += item.remaining;
            else if (item.type.startsWith('equipment_')) {
                totalEquipment += 1;
                const equipment = {
                    name: TypeNameMap[item.type] || item.type,
                    type: 'equipment',
                    level: 1,
                    quality: 'common',
                    attack: 0,
                    defense: 0,
                    agility: 0,
                    value: item.basePrice
                };
                equipmentToAdd.push(equipment);
            }
        });
        
        let newBugs = State.bugs + totalBugs;
        let newLeaves = State.leaves + totalLeaves;
        let newSkewers = State.skewers + totalSkewers;

        const bugCap = ItemManager.getCapacity('bug');
        const leafCap = ItemManager.getCapacity('leaf');
        const skewerCap = ItemManager.getCapacity('skewer');
        let bugSlots = newBugs > 0 ? Math.ceil(newBugs / bugCap) : 0;
        let leafSlots = newLeaves > 0 ? Math.ceil(newLeaves / leafCap) : 0;
        let skewerSlots = newSkewers > 0 ? Math.ceil(newSkewers / skewerCap) : 0;
        
        if (bugSlots + leafSlots + skewerSlots + totalEquipment + State.purses + State.piggyBanks > State.backpackCapacity) {
            alert('背包空间不足，无法全部下架！');
            return;
        }
        
        for (let i = State.stallItems.length - 1; i >= 0; i--) {
            const item = State.stallItems[i];
            if (item.type.startsWith('equipment_')) {
            } else {
                Backpack.addResource(item.type, item.remaining);
            }
        }
        
        equipmentToAdd.forEach(equipment => {
            State.equipmentBackpack.push(equipment);
        });
        
        State.stallItems = [];
        Log.add('收摊：全部下架');
        UI.update();
        Save.auto();
    },
    
    render() {
        const stallList = document.getElementById('stallList');
        if (State.stallItems.length === 0) {
            stallList.innerHTML = '<div style="color:#999; padding:4px;">摊位空空，快上架吧</div>';
            return;
        }
        let html = '';
        State.stallItems.forEach((item, index) => {
            let typeName = '';
            if (item.type.startsWith('equipment_')) {
                typeName = `装备 (${item.basePrice}金)`;
            } else {
                typeName = TypeNameMap[item.type] || item.type;
            }
            const remainingSeconds = item.timeRemaining.toFixed(2);
            html += `
                <div class="stall-item" data-index="${index}">
                    <div class="stall-info">
                        <span>${typeName}</span>
                        <span>${item.remaining}/${item.total}</span>
                        <span>售价:${item.customPrice}</span>
                        <span>市场价:${item.basePrice}</span>
                        <span>⏳ ${remainingSeconds}秒</span>
                    </div>
                    <button class="remove-stall-btn" data-index="${index}">下架</button>
                </div>
            `;
        });
        stallList.innerHTML = html;
    },
    
    updateTabLabel() {
        const stallTabCount = document.getElementById('stallTabCount');
        const upgradeCostDisplay = document.getElementById('upgradeCostDisplay');
        const maxStalls = Utils.getMaxStalls();
        stallTabCount.textContent = `${State.stallItems.length}/${maxStalls}`;
        const nextLeafCost = Utils.getNextLeafUpgradeCost();
        upgradeCostDisplay.textContent = `升级需${nextLeafCost}荷叶`;
    },
    
    startSaleTimer() {
        const self = this;
        
        if (State.autoSellEnabled) {
            self.doAutoSell();
        }
        
        setInterval(() => {
            if (State.stallItems.length === 0 && !State.autoSellEnabled) return;

            let changed = false;
            for (let i = State.stallItems.length - 1; i >= 0; i--) {
                const item = State.stallItems[i];
                item.timeRemaining -= 1;

                while (item.timeRemaining <= 0) {
                    item.remaining -= 1;
                    
                    const tax = Utils.calculateTax(item.customPrice);
                    const actualIncome = item.customPrice - tax;
                    State.coins = Math.min(State.coins + actualIncome, Config.MAX_COINS);
                    State.totalSoldValue += actualIncome;

                    const typeName = TypeNameMap[item.type] || item.type;
                    
                    if (tax > 0) {
                        Log.add(`售出1个${typeName}，收入${actualIncome}金币（税${tax})`);
                    } else {
                        Log.add(`售出1个${typeName}，收入${actualIncome}金币（免税)`);
                    }

                    if (item.remaining <= 0) {
                        State.stallItems.splice(i, 1);
                        changed = true;
                        break;
                    } else {
                        item.timeRemaining += Utils.generateSaleTime(item.meanTime);
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
        
        setInterval(() => {
            if (State.autoSellEnabled) {
                self.doAutoSell();
            }
        }, 5000);
    }
};
