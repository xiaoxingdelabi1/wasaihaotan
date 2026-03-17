const Market = {
    render(type = 'all') {
        const marketList = document.getElementById('marketList');
        if (!marketList) return;
        
        let items = [];
        let props = [];
        let equipments = [];
        let tools = [];
        
        State.marketItems.forEach(item => {
            let itemKey = null;
            if (Items) {
                for (let key in Items) {
                    if (Items[key] && Items[key].name === item.name) {
                        itemKey = key;
                        break;
                    }
                }
            }
            
            const itemWithType = {
                ...item,
                itemType: itemKey || 'marketItem',
                source: 'market',
                quality: this.getItemQuality(item)
            };
            
            if (item.type === 'consumable' || item.type === 'ingredient') {
                items.push(itemWithType);
            } else if (item.type === 'upgrade' || item.type === 'treasure' || item.type === 'material') {
                props.push(itemWithType);
            }
        });
        

        
        Shop.shopCategories.blacksmith.items.forEach(item => {
            tools.push({
                id: item.id,
                name: item.name,
                itemType: 'tool',
                source: 'blacksmith',
                quality: 'common',
                currentPrice: item.price,
                durability: item.durability,
                maxDurability: item.durability,
                type: item.type
            });
        });
        
        Equipment.generateAllSetEquipment().forEach(equip => {
            const setItem = {
                ...equip,
                itemType: 'setEquipment',
                source: 'set',
                quality: equip.quality || 'common',
                currentPrice: equip.value || this.getEquipmentValue(equip)
            };
            equipments.push(setItem);
        });

        State.equipmentBackpack.forEach(equip => {
            if (equip.type === 'tool') {
                const ownedItem = {
                    ...equip,
                    itemType: 'playerEquipment',
                    source: 'backpack',
                    quality: equip.quality || 'common',
                    currentPrice: equip.value || this.getEquipmentValue(equip)
                };
                tools.push(ownedItem);
            }
        });
        
        let displayItems = [];
        if (type === 'all') {
            displayItems = [...items, ...props, ...equipments, ...tools];
        } else if (type === 'items') {
            displayItems = items;
        } else if (type === 'props') {
            displayItems = props;
        } else if (type === 'equipment') {
            displayItems = equipments;
        } else if (type === 'tools') {
            displayItems = tools;
        }
        
        this.currentDisplayItems = displayItems;
        
        if (displayItems.length === 0) {
            let emptyMsg = '市场空空，下次再来';
            if (type === 'equipment') {
                emptyMsg = '暂无装备，可从冒险中获得';
            } else if (type === 'items') {
                emptyMsg = '暂无物品，请稍后再来';
            } else if (type === 'props') {
                emptyMsg = '暂无道具，请稍后再来';
            } else if (type === 'tools') {
                emptyMsg = '暂无工具，可从铁匠铺购买';
            }
            marketList.innerHTML = `<div style="color:#999; padding:8px; text-align:center;">${emptyMsg}</div>`;
            return;
        }
        
        let html = '';
        displayItems.forEach((item, index) => {
            const qualityName = this.getQualityDisplayName(item.quality);
            const qualityClass = this.getQualityClass(item.quality);
            const sourceLabel = this.getSourceLabel(item.source);
            const showQuality = item.type !== 'tool';
            html += `
                <div class="market-item" data-index="${index}" data-type="${item.itemType}" data-source="${item.source}">
                    <span class="market-item-name">${item.name}${sourceLabel}</span>
                    ${showQuality ? `<span class="${qualityClass}">${qualityName}</span>` : '<span></span>'}
                    <span class="market-item-price">${item.currentPrice} 金币</span>
                </div>
            `;
        });
        marketList.innerHTML = html;
        
        this.bindTooltipEvents();
    },
    
    getSourceLabel(source) {
        return '';
    },
    
    bindTooltipEvents() {
        const marketList = document.getElementById('marketList');
        if (!marketList) return;
        
        // 复用背包逻辑：每次渲染重新绑定事件
        document.querySelectorAll('.market-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                const index = parseInt(item.dataset.index);
                const itemData = this.currentDisplayItems[index];
                if (itemData) {
                    const itemType = itemData.itemType || itemData.type || 'unknown';
                    ItemTooltip.show(e.clientX, e.clientY, itemType, itemData);
                }
            });
            
            item.addEventListener('mouseleave', () => {
                ItemTooltip.hide();
            });
            
            item.addEventListener('mousemove', (e) => {
                const index = parseInt(item.dataset.index);
                const itemData = this.currentDisplayItems[index];
                if (itemData) {
                    const itemType = itemData.itemType || itemData.type || 'unknown';
                    ItemTooltip.show(e.clientX, e.clientY, itemType, itemData);
                }
            });
        });
    },
    
    getItemQuality(item) {
        const typeQualityMap = {
            'consumable': '普通',
            'upgrade': '稀有',
            'ingredient': '普通',
            'treasure': '传说',
            'material': '优秀'
        };
        return typeQualityMap[item.type] || '普通';
    },
    
    getQualityDisplayName(quality) {
        const qualityNames = {
            'common': '普通',
            'uncommon': '优秀',
            'rare': '稀有',
            'epic': '史诗',
            'legendary': '传说',
            '普通': '普通',
            '优秀': '优秀',
            '稀有': '稀有',
            '史诗': '史诗',
            '传说': '传说'
        };
        return qualityNames[quality] || '普通';
    },
    
    getQualityClass(quality) {
        const qualityClasses = {
            'common': 'quality-white',
            'uncommon': 'quality-green',
            'rare': 'quality-blue',
            'epic': 'quality-purple',
            'legendary': 'quality-gold',
            '普通': 'quality-white',
            '优秀': 'quality-green',
            '稀有': 'quality-blue',
            '史诗': 'quality-purple',
            '传说': 'quality-gold'
        };
        return qualityClasses[quality] || 'quality-white';
    },
    
    getEquipmentValue(equipment) {
        if (equipment.value) return equipment.value;
        const baseValue = (equipment.attack || 0) + (equipment.defense || 0) + (equipment.agility || 0);
        const qualityMultiplier = {
            'common': 1,
            'uncommon': 1.5,
            'rare': 2,
            'epic': 3,
            'legendary': 5
        };
        return Math.floor(baseValue * (qualityMultiplier[equipment.quality] || 1) * 10);
    },
    
    fluctuatePrices() {
        State.marketItems.forEach(item => {
            const change = (Math.random() - 0.5) * 2 * item.volatility * State.globalVolatility;
            item.currentPrice = Math.max(item.minPrice, Math.min(item.maxPrice, Math.round(item.currentPrice + change)));
        });
        // 只更新价格，不重新渲染整个列表，避免闪烁
        this.updatePricesOnly();
    },
    
    updatePricesOnly() {
        const marketList = document.getElementById('marketList');
        if (!marketList) return;
        
        // 只更新价格文本，不重新渲染整个列表
        // 使用 data-index 来匹配元素，避免通过文本内容匹配
        this.currentDisplayItems.forEach((item, index) => {
            const el = marketList.querySelector(`.market-item[data-index="${index}"]`);
            if (el) {
                const priceEl = el.querySelector('.market-item-price');
                if (priceEl && priceEl.textContent !== `${item.currentPrice} 金币`) {
                    priceEl.textContent = `${item.currentPrice} 金币`;
                }
            }
        });
    },
    
    addItem(item) {
        State.marketItems.push(item);
        this.render('all');
    },
    
    removeItem(index) {
        State.marketItems.splice(index, 1);
        this.render('all');
    },
    
    updateItem(index, data) {
        Object.assign(State.marketItems[index], data);
        this.render('all');
    }
};

const Shop = {
    shopCategories: {
        general: { name: '杂货铺', filter: item => !['辣椒', '胡萝卜'].includes(item.name) },
        fruit: { name: '水果铺', filter: item => ['辣椒', '胡萝卜'].includes(item.name) },
        blacksmith: { name: '铁匠铺', items: [
            { id: 'hoe', name: '锄头', price: 10, durability: 10, type: 'tool' },
            { id: 'bugNet', name: '捕虫网', price: 15, durability: 100, type: 'tool' },
            { id: 'toaster', name: '烤虫机', price: 100, type: 'machine' }
        ]}
    },
    
    refresh() {
        const newShop = [];
        ShopInit.forEach(s => {
            const marketItem = State.marketItems.find(m => m.name === s.name);
            if (marketItem) {
                const price = Math.round(marketItem.currentPrice * 1.5);
                newShop.push({
                    name: s.name,
                    type: s.type,
                    price: price,
                    quantity: s.baseQuantity,
                    capacity: marketItem.capacity
                });
            }
        });
        State.shopItems = newShop;
    },
    
    render() {
        this.renderGeneralShop();
        this.renderFruitShop();
        this.renderBlacksmithShop();
    },
    
    renderGeneralShop() {
        const container = document.getElementById('marketShopList');
        if (!container) return;
        
        const items = State.shopItems.filter(this.shopCategories.general.filter);
        
        if (items.length === 0) {
            container.innerHTML = '<div style="color:#999; padding:4px;">店铺空空，下次再来</div>';
            return;
        }
        
        let html = '';
        items.forEach((item) => {
            const index = State.shopItems.indexOf(item);
            html += this.createShopItemHTML(item, index);
        });
        container.innerHTML = html;
        this.bindBuyButtons(container, 'general');
        this.bindShopTooltipEvents(container, items);
    },
    
    renderFruitShop() {
        const container = document.getElementById('fruitShopList');
        if (!container) return;
        
        const items = State.shopItems.filter(this.shopCategories.fruit.filter);
        
        if (items.length === 0) {
            container.innerHTML = '<div style="color:#999; padding:4px;">店铺空空，下次再来</div>';
            return;
        }
        
        let html = '';
        items.forEach((item) => {
            const index = State.shopItems.indexOf(item);
            html += this.createShopItemHTML(item, index);
        });
        container.innerHTML = html;
        this.bindBuyButtons(container, 'fruit');
        this.bindShopTooltipEvents(container, items);
    },
    
    renderBlacksmithShop() {
        const container = document.getElementById('blacksmithShopList');
        if (!container) return;
        
        const items = this.shopCategories.blacksmith.items;
        let html = '';
        items.forEach(item => {
            html += `
                <div class="shop-item" data-item-id="${item.id}">
                    <div class="shop-item-info">
                        <span class="shop-item-name">${item.name}</span>
                        <span class="shop-item-price">价格: ${item.price} 金币</span>
                        ${item.durability ? `<span>耐久: ${item.durability}</span>` : ''}
                    </div>
                    <button class="buy-btn" data-item-id="${item.id}" ${State.coins < item.price ? 'disabled' : ''}>购买</button>
                </div>
            `;
        });
        container.innerHTML = html;
        this.bindBlacksmithBuyButtons(container);
        this.bindBlacksmithTooltipEvents(container);
    },
    
    createShopItemHTML(item, index) {
        return `
            <div class="shop-item" data-index="${index}">
                <div class="shop-item-info">
                    <span class="shop-item-name">${item.name}</span>
                    <span>单价: ${item.price} 金币</span>
                    <span>剩余: ${item.quantity}</span>
                </div>
                <button class="buy-btn" data-index="${index}" ${item.quantity <= 0 ? 'disabled' : ''}>购买</button>
            </div>
        `;
    },
    
    bindBuyButtons(container, category) {
        container.querySelectorAll('.buy-btn[data-index]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.buy(index);
            });
        });
    },
    
    bindBlacksmithBuyButtons(container) {
        container.querySelectorAll('.buy-btn[data-item-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.itemId;
                this.buyBlacksmithItem(itemId);
            });
        });
    },
    
    bindShopTooltipEvents(container, items) {
        // 复用背包逻辑：每次渲染重新绑定事件
        container.querySelectorAll('.shop-item').forEach((el, idx) => {
            const item = items[idx];
            if (!item) return;
            
            el.addEventListener('mouseenter', (e) => {
                ItemTooltip.show(e.clientX, e.clientY, item.type, item);
            });
            
            el.addEventListener('mouseleave', () => {
                ItemTooltip.hide();
            });
            
            el.addEventListener('mousemove', (e) => {
                ItemTooltip.show(e.clientX, e.clientY, item.type, item);
            });
        });
    },
    
    bindBlacksmithTooltipEvents(container) {
        // 复用背包逻辑：每次渲染重新绑定事件
        const items = this.shopCategories.blacksmith.items;
        container.querySelectorAll('.shop-item').forEach((el, idx) => {
            const item = items[idx];
            if (!item) return;
            
            el.addEventListener('mouseenter', (e) => {
                ItemTooltip.show(e.clientX, e.clientY, 'tool', item);
            });
            
            el.addEventListener('mouseleave', () => {
                ItemTooltip.hide();
            });
            
            el.addEventListener('mousemove', (e) => {
                ItemTooltip.show(e.clientX, e.clientY, 'tool', item);
            });
        });
    },
    
    buy(index) {
        const item = State.shopItems[index];
        if (!item || item.quantity <= 0) return;
        if (State.coins < item.price) {
            alert('金币不足');
            return;
        }
        if (!Backpack.canAddItem(item.type, 1)) {
            alert('背包空间不足');
            return;
        }
        State.coins -= item.price;
        Backpack.addResource(item.type, 1);
        item.quantity--;
        State.shopBuyCount++;
        if (item.quantity <= 0) {
            State.shopItems.splice(index, 1);
        }
        UI.update();
        this.render();
        Achievement.render();
        Log.add(`从集市购买了1个${item.name}`);
        Save.auto();
    },
    
    buyBlacksmithItem(itemId) {
        const item = this.shopCategories.blacksmith.items.find(i => i.id === itemId);
        if (!item) return;
        
        if (State.coins < item.price) {
            alert('金币不足');
            return;
        }
        
        State.coins -= item.price;
        
        if (item.id === 'hoe') {
            const hoe = Equipment.createHoe();
            const result = Equipment.addToBackpack(hoe);
            if (result.success) {
                Log.add(`从铁匠铺购买了锄头`);
            } else {
                State.coins += item.price;
                alert(result.message);
                return;
            }
        } else if (item.id === 'bugNet') {
            const bugNet = Equipment.createBugNet();
            const result = Equipment.addToBackpack(bugNet);
            if (result.success) {
                Log.add(`从铁匠铺购买了捕虫网`);
            } else {
                State.coins += item.price;
                alert(result.message);
                return;
            }
        } else if (item.id === 'toaster') {
            State.hasToaster = true;
            Log.add(`从铁匠铺购买了烤虫机，解锁自动化功能`);
        }
        
        State.shopBuyCount++;
        UI.update();
        this.renderBlacksmithShop();
        Achievement.render();
        Save.auto();
    }
};
