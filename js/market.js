const Market = {
    streetItems: {
        east: [],
        west: [],
        south: [],
        north: []
    },

    currentStreet: 'east',
    initialized: false,

    init() {
        if (this.initialized) return;
        this.initialized = true;
        this.bindStreetEvents();
        this.generateAllShops();
        this.render();
    },

    generateAllShops() {
        ['east', 'west', 'south', 'north'].forEach(street => {
            if (!State.streetShops[street] || State.streetShops[street].length === 0) {
                State.streetShops[street] = ShopGenerator.generateShops(street, ShopGeneratorConfig.shopsPerStreet);
            }
        });
    },

    bindStreetEvents() {
        const streetBtns = document.querySelectorAll('.market-street-tab');
        if (streetBtns.length === 0) return;

        streetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const street = e.target.dataset.street;
                this.switchStreet(street);
            });
        });
    },

    switchStreet(street) {
        this.currentStreet = street;

        const streetBtns = document.querySelectorAll('.market-street-tab');
        if (streetBtns.length > 0) {
            streetBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.street === street);
            });
        }

        const streetPanels = document.querySelectorAll('.market-street-panel');
        if (streetPanels.length > 0) {
            streetPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === `${street}StreetPanel`);
            });
        }
    },

    classifyItems() {
        this.streetItems.east = [];
        this.streetItems.west = [];
        this.streetItems.south = [];
        this.streetItems.north = [];

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
                this.streetItems.east.push(itemWithType);
            } else if (item.type === 'upgrade' || item.type === 'treasure' || item.type === 'material') {
                this.streetItems.west.push(itemWithType);
            } else {
                this.streetItems.east.push(itemWithType);
            }
        });

        Equipment.generateAllSetEquipment().forEach(equip => {
            const setItem = {
                ...equip,
                itemType: 'setEquipment',
                source: 'set',
                quality: equip.quality || 'common',
                currentPrice: equip.value || this.getEquipmentValue(equip)
            };
            this.streetItems.south.push(setItem);
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
                this.streetItems.north.push(ownedItem);
            }
        });

        Shop.shopCategories.blacksmith.items.forEach(item => {
            this.streetItems.north.push({
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
    },

    render() {
        this.generateAllShops();
        this.renderStreet('east');
        this.renderStreet('west');
        this.renderStreet('south');
        this.renderStreet('north');
    },

    renderStreet(street) {
        const listId = `${street}StreetItemList`;
        const list = document.getElementById(listId);
        if (!list) return;

        const shops = State.streetShops[street] || [];

        if (shops.length === 0) {
            let emptyMsg = '';
            switch(street) {
                case 'east':
                    emptyMsg = '东街空空，下次再来';
                    break;
                case 'west':
                    emptyMsg = '西街空空，下次再来';
                    break;
                case 'south':
                    emptyMsg = '暂无装备，可从冒险中获得';
                    break;
                case 'north':
                    emptyMsg = '暂无工具，可从工具店购买';
                    break;
            }
            list.innerHTML = `<div style="color:#999; padding:20px; text-align:center;">${emptyMsg}</div>`;
            return;
        }

        let html = '';
        shops.forEach((shop, index) => {
            const visitedClass = shop.visited ? 'shop-visited' : '';
            const markClass = shop.mark ? `mark-${shop.mark}` : '';
            html += `
                <div class="market-shop-row ${visitedClass} ${markClass}" data-street="${street}" data-shop-index="${index}">
                    <span class="market-shop-name">${shop.name}</span>
                    <span class="market-shop-info">${shop.items.length}件商品</span>
                </div>
            `;
        });
        list.innerHTML = html;

        this.bindShopClickEvents(street);
    },

    bindShopClickEvents(street) {
        const listId = `${street}StreetItemList`;
        const list = document.getElementById(listId);
        if (!list) return;

        list.querySelectorAll('.market-shop-row').forEach(el => {
            el.addEventListener('click', (e) => {
                const shopIndex = parseInt(el.dataset.shopIndex);
                this.showShopDetail(street, shopIndex);
            });
            el.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const shopIndex = parseInt(el.dataset.shopIndex);
                this.showMarkMenu(e, street, shopIndex);
            });
        });
    },

    showMarkMenu(e, street, shopIndex) {
        let menu = document.getElementById('shopMarkMenu');
        if (menu) menu.remove();

        menu = document.createElement('div');
        menu.id = 'shopMarkMenu';
        menu.className = 'shop-mark-menu';
        menu.innerHTML = `
            <div class="mark-option" data-color="yellow"><span class="mark-square mark-square-yellow"></span></div>
            <div class="mark-option" data-color="green"><span class="mark-square mark-square-green"></span></div>
            <div class="mark-option" data-color="red"><span class="mark-square mark-square-red"></span></div>
            <div class="mark-option" data-color="blue"><span class="mark-square mark-square-blue"></span></div>
            <div class="mark-option" data-color="none">取消</div>
        `;
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
        document.body.appendChild(menu);

        menu.querySelectorAll('.mark-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const color = opt.dataset.color;
                this.setShopMark(street, shopIndex, color);
                menu.remove();
            });
        });

        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            });
        }, 10);
    },

    setShopMark(street, shopIndex, color) {
        const shop = State.streetShops[street][shopIndex];
        if (!shop) return;

        if (color === 'none') {
            shop.mark = null;
        } else {
            shop.mark = color;
        }

        const shopRow = document.querySelector(`.market-shop-row[data-street="${street}"][data-shop-index="${shopIndex}"]`);
        if (shopRow) {
            shopRow.classList.remove('mark-yellow', 'mark-green', 'mark-red', 'mark-blue');
            if (shop.mark) {
                shopRow.classList.add(`mark-${shop.mark}`);
            }
        }
        Save.auto();
    },

    showShopDetail(street, shopIndex) {
        const shop = State.streetShops[street][shopIndex];
        if (!shop) return;

        shop.visited = true;

        const shopRow = document.querySelector(`.market-shop-row[data-street="${street}"][data-shop-index="${shopIndex}"]`);
        if (shopRow) {
            shopRow.classList.add('shop-visited');
        }

        const modal = document.getElementById('shopDetailModal');
        const titleEl = document.getElementById('shopDetailTitle');
        const contentEl = document.getElementById('shopDetailContent');

        if (!modal || !titleEl || !contentEl) return;

        titleEl.textContent = shop.name;
        
        let html = '<div class="shop-detail-items">';
        shop.items.forEach((item, index) => {
            html += `
                <div class="shop-detail-item" data-street="${street}" data-shop-index="${shopIndex}" data-item-index="${index}">
                    <span class="shop-item-name">${item.name}</span>
                    <span class="shop-item-price">${Currency.formatShort(item.price)}</span>
                    <span class="shop-item-quantity">x${item.quantity}</span>
                </div>
            `;
        });
        html += '</div>';
        contentEl.innerHTML = html;

        modal.classList.add('active');

        this.bindShopDetailBuyEvents();
        this.initModalDrag(modal);
        this.bindMessageBoardToggle();
    },

    bindMessageBoardToggle() {
        const btn = document.getElementById('shopMessageBoardBtn');
        if (!btn) return;

        btn.onclick = () => {
            const board = document.getElementById('shopMessageBoard');
            const content = document.getElementById('shopDetailContent');
            if (!board || !content) return;

            if (board.style.display === 'none') {
                board.style.display = 'block';
                btn.textContent = '[商品]';
            } else {
                board.style.display = 'none';
                btn.textContent = '[留言板]';
            }
        };
    },

    initModalDrag(modal) {
        const content = modal.querySelector('.shop-modal-content');
        const header = modal.querySelector('.shop-modal-header');
        if (!header || !content) return;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.style.cursor = 'move';
        header.style.userSelect = 'none';

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('shop-close-link')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = content.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            content.style.position = 'fixed';
            content.style.left = startLeft + 'px';
            content.style.top = startTop + 'px';
            content.style.margin = '0';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            content.style.left = (startLeft + deltaX) + 'px';
            content.style.top = (startTop + deltaY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    },

    closeShopDetail() {
        const modal = document.getElementById('shopDetailModal');
        const content = modal ? modal.querySelector('.shop-modal-content') : null;
        const board = document.getElementById('shopMessageBoard');
        const btn = document.getElementById('shopMessageBoardBtn');
        
        if (modal) {
            modal.classList.remove('active');
        }
        if (content) {
            content.style.position = '';
            content.style.left = '';
            content.style.top = '';
            content.style.margin = '';
        }
        if (board) {
            board.style.display = 'none';
        }
        if (btn) {
            btn.textContent = '[留言板]';
        }
    },

    bindShopDetailBuyEvents() {
        document.querySelectorAll('.shop-detail-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const street = el.dataset.street;
                const shopIndex = parseInt(el.dataset.shopIndex);
                const itemIndex = parseInt(el.dataset.itemIndex);
                this.buyFromShop(street, shopIndex, itemIndex);
            });
        });
    },

    buyFromShop(street, shopIndex, itemIndex) {
        const shop = State.streetShops[street][shopIndex];
        if (!shop) return;

        const item = shop.items[itemIndex];
        if (!item || item.quantity <= 0) return;

        if (!Currency.canAfford(item.price)) {
            alert('货币不足');
            return;
        }

        if (!Backpack.canAddItem(item.type, 1)) {
            alert('背包空间不足');
            return;
        }

        Currency.subtractWen(item.price);
        Backpack.addResource(item.type, 1);
        item.quantity--;
        State.shopBuyCount++;

        if (item.quantity <= 0) {
            shop.items.splice(itemIndex, 1);
        }

        UI.update();
        this.showShopDetail(street, shopIndex);
        Achievement.render();
        Log.add(`从${shop.name}购买了1个${item.name}`);
        Save.auto();
    },

    bindStreetTooltipEvents(street) {
        const listId = `${street}StreetItemList`;
        const list = document.getElementById(listId);
        if (!list) return;
        const items = this.streetItems[street] || [];

        list.querySelectorAll('.market-item-row').forEach(el => {
            const index = parseInt(el.dataset.index);
            const itemData = items[index];
            if (!itemData) return;

            el.addEventListener('mouseenter', (e) => {
                const itemType = itemData.itemType || itemData.type || 'unknown';
                ItemTooltip.show(e.clientX, e.clientY, itemType, itemData);
            });

            el.addEventListener('mouseleave', () => {
                ItemTooltip.hide();
            });

            el.addEventListener('mousemove', (e) => {
                const itemType = itemData.itemType || itemData.type || 'unknown';
                ItemTooltip.show(e.clientX, e.clientY, itemType, itemData);
            });
        });
    },

    getSourceLabel(source) {
        return '';
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
        this.updatePricesOnly();
    },

    updatePricesOnly() {
        this.classifyItems();
        ['east', 'west', 'south', 'north'].forEach(street => {
            const listId = `${street}StreetList`;
            const list = document.getElementById(listId);
            if (!list) return;
            const items = this.streetItems[street];

            items.forEach((item, index) => {
                const el = list.querySelector(`.market-item[data-index="${index}"]`);
                if (el) {
                    const priceEl = el.querySelector('.market-item-price');
                    if (priceEl && priceEl.textContent !== `${item.currentPrice} 金币`) {
                        priceEl.textContent = `${item.currentPrice} 金币`;
                    }
                }
            });
        });
    },

    addItem(item) {
        State.marketItems.push(item);
        this.render();
    },

    removeItem(index) {
        State.marketItems.splice(index, 1);
        this.render();
    },

    updateItem(index, data) {
        Object.assign(State.marketItems[index], data);
        this.render();
    }
};

const Shop = {
    shopCategories: {
        general: {
            name: '物品',
            filter: item => !['辣椒', '胡萝卜', '荷叶', '荷包', '小存钱罐'].includes(item.name)
        },
        fruit: {
            name: '道具',
            filter: item => ['辣椒', '胡萝卜', '荷叶', '荷包', '小存钱罐'].includes(item.name)
        },
        blacksmith: {
            name: '工具',
            items: [
                { id: 'hoe', name: '锄头', price: 10, durability: 10, type: 'tool' },
                { id: 'bugNet', name: '捕虫网', price: 15, durability: 100, type: 'tool' },
                { id: 'toaster', name: '烤虫机', price: 100, type: 'machine' }
            ]
        }
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
                        <span>价格: <span class="shop-item-price">${Currency.formatShort(item.price)}</span></span>
                        ${item.durability ? `<span>耐久: ${item.durability}</span>` : ''}
                    </div>
                    <button class="buy-btn" data-item-id="${item.id}" ${!Currency.canAfford(item.price) ? 'disabled' : ''}>购买</button>
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
                    <span>单价: <span class="shop-item-price">${item.price}</span> 金币</span>
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
        if (!Currency.canAfford(item.price)) {
            alert('货币不足');
            return;
        }
        if (!Backpack.canAddItem(item.type, 1)) {
            alert('背包空间不足');
            return;
        }
        Currency.subtractWen(item.price);
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

        if (!Currency.canAfford(item.price)) {
            alert('货币不足');
            return;
        }

        Currency.subtractWen(item.price);

        if (item.id === 'hoe') {
            const hoe = Equipment.createHoe();
            const result = Equipment.addToBackpack(hoe);
            if (result.success) {
                Log.add(`从工具店购买了锄头`);
            } else {
                Currency.addWen(item.price);
                alert(result.message);
                return;
            }
        } else if (item.id === 'bugNet') {
            const bugNet = Equipment.createBugNet();
            const result = Equipment.addToBackpack(bugNet);
            if (result.success) {
                Log.add(`从工具店购买了捕虫网`);
            } else {
                Currency.addWen(item.price);
                alert(result.message);
                return;
            }
        } else if (item.id === 'toaster') {
            State.hasToaster = true;
            Log.add(`从工具店购买了烤虫机，解锁自动化功能`);
        }

        State.shopBuyCount++;
        UI.update();
        this.renderBlacksmithShop();
        Achievement.render();
        Save.auto();
    }
};

const ShopGenerator = {
    generateShops(street, count) {
        const shops = [];
        const config = ShopNameConfig[street];
        
        for (let i = 0; i < count; i++) {
            const shop = this.generateShop(street, config, i);
            shops.push(shop);
        }
        
        return shops;
    },

    generateShop(street, config, index) {
        const name = this.generateShopName(config);
        const items = this.generateShopItems(street, config);
        
        return {
            id: `shop_${street}_${index}`,
            name: name,
            street: street,
            level: Math.floor(Math.random() * 5) + 1,
            items: items
        };
    },

    generateShopName(config) {
        const prefix = config.prefixes[Math.floor(Math.random() * config.prefixes.length)];
        const name = config.names[Math.floor(Math.random() * config.names.length)];
        const suffix = config.suffixes[Math.floor(Math.random() * config.suffixes.length)];
        return prefix + name + suffix;
    },

    generateShopItems(street, config) {
        const items = [];
        const itemCount = Math.floor(Math.random() * (ShopGeneratorConfig.maxItemsPerShop - ShopGeneratorConfig.minItemsPerShop + 1)) + ShopGeneratorConfig.minItemsPerShop;
        
        const availableItems = this.getAvailableItemsForStreet(street, config);
        
        if (availableItems.length === 0) return items;

        const shuffled = [...availableItems].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < Math.min(itemCount, shuffled.length); i++) {
            const baseItem = shuffled[i];
            const marketItem = State.marketItems.find(m => m.name === baseItem.name);
            
            if (marketItem) {
                const priceVariation = 1 + (Math.random() - 0.5) * 2 * ShopGeneratorConfig.priceVariation;
                const price = Math.round(marketItem.currentPrice * priceVariation);
                
                items.push({
                    name: baseItem.name,
                    type: baseItem.type,
                    price: price,
                    quantity: Math.floor(Math.random() * 10) + 1
                });
            }
        }
        
        return items;
    },

    getAvailableItemsForStreet(street, config) {
        const items = [];
        
        for (let key in Items) {
            if (typeof Items[key] === 'object' && Items[key].name) {
                const item = Items[key];
                if (config.itemTypes.includes(item.type)) {
                    items.push({
                        name: item.name,
                        type: key
                    });
                }
            }
        }
        
        if (street === 'south') {
            const equipment = Equipment.generateAllSetEquipment();
            equipment.forEach(equip => {
                items.push({
                    name: equip.name,
                    type: 'equipment'
                });
            });
        }
        
        if (street === 'north') {
            items.push(
                { name: '锄头', type: 'hoe' },
                { name: '捕虫网', type: 'bugNet' }
            );
        }
        
        return items;
    }
};
