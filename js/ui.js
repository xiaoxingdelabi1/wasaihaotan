const UI = {
    currentMarketFilter: 'all',

    update() {
        try {
        document.getElementById('wenCount').textContent = State.wen || 0;
        document.getElementById('copperCount').textContent = State.copper || 0;
        document.getElementById('silverCount').textContent = State.silver || 0;
        document.getElementById('goldCount').textContent = State.gold || 0;
        document.getElementById('cakeCount').textContent = State.cake || 0;

        const skewerBtn = document.getElementById('skewerBtn');
        if (State.bugs >= 10 && State.skewers < Config.MAX_SKEWERS) {
            skewerBtn.disabled = false;
            skewerBtn.classList.remove('disabled');
            skewerBtn.style.display = 'block';
        } else {
            skewerBtn.disabled = true;
            skewerBtn.classList.add('disabled');
            skewerBtn.style.display = 'none';
        }

        const spicySkewerBtn = document.getElementById('spicySkewerBtn');
        if (State.peppers >= 1 && State.skewers >= 1 && State.spicySkewers < 50) {
            spicySkewerBtn.disabled = false;
            spicySkewerBtn.classList.remove('disabled');
            spicySkewerBtn.style.display = 'block';
        } else {
            spicySkewerBtn.disabled = true;
            spicySkewerBtn.classList.add('disabled');
            spicySkewerBtn.style.display = 'none';
        }

        const pickPepperBtn = document.getElementById('pickPepperBtn');
        const forestArea = Areas.areas.find(a => a.id === 'forest');
        if (forestArea && forestArea.isUnlocked) {
            pickPepperBtn.disabled = false;
            pickPepperBtn.classList.remove('disabled');
            pickPepperBtn.style.display = 'block';
        } else {
            pickPepperBtn.disabled = true;
            pickPepperBtn.classList.add('disabled');
            pickPepperBtn.style.display = 'none';
        }

        Stall.render();
        Backpack.render();
        Backpack.renderStallBackpack();
        Stall.updateTabLabel();
        Stall.updateAutoSellButton();
        Bonus.render();

        const backpackHeader = document.getElementById('backpackHeader');
        const nextPurseCost = Utils.getNextPurseUpgradeCost();
        backpackHeader.title = `升级需${nextPurseCost}荷包`;
        
        document.getElementById('regionDisplay').textContent = `地区：${State.currentRegion}`;

        const repeatSelect = document.getElementById('adventureRepeatSelect');
        if (repeatSelect) {
            repeatSelect.value = (State.adventureRepeatCount !== undefined) ? State.adventureRepeatCount : 1;
        }

        this.updateAutoProcessPane();

        if (typeof RPGUI !== 'undefined') {
            RPGUI.updateCharacterInfo();
            RPGUI.updateEquipment();
        }
        } catch (e) {
            console.error('UI update error:', e);
        }
    },
    
    setActiveTab(activeBtn, activePane) {
        const tabBtns = [document.getElementById('stallTabBtn'),
                        document.getElementById('marketTabBtn')];
        const tabPanes = [document.getElementById('stallPane'),
                         document.getElementById('marketPane')];

        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            pane.style.display = '';
        });
        activeBtn.classList.add('active');
        activePane.classList.add('active');

        if (activePane.id === 'marketPane') {
            Market.render('all');
            Shop.render();
            Stall.render();
            Stall.updateTabLabel();
            this.renderMarketList(this.currentMarketFilter);
        } else if (activePane.id === 'stallPane') {
            Stall.render();
            Stall.updateTabLabel();
        }
    },
    
    hideAllMainPanes() {
        document.getElementById('mainButtonGroup').style.display = 'none';
        document.getElementById('stallBackpackPane').style.display = 'none';
        document.getElementById('marketShopPane').style.display = 'none';
        document.getElementById('hotelPane').style.display = 'none';
        document.getElementById('equipmentPane').style.display = 'none';
        document.getElementById('autoProcessPane').style.display = 'none';
        document.getElementById('toolPane').style.display = 'none';
    },
    
    showStallBackpack() {
        this.hideAllMainPanes();
        document.getElementById('stallBackpackPane').style.display = 'block';
        Backpack.renderStallBackpack();
    },
    
    updateAutoProcessPane() {
        const autoSkewerBtn = document.getElementById('autoSkewerBtn');
        const autoSpicySkewerBtn = document.getElementById('autoSpicySkewerBtn');
        const skewerStatus = document.getElementById('skewerNodeStatus');
        const spicySkewerStatus = document.getElementById('spicySkewerNodeStatus');
        
        // 虫虫串默认解锁
        if (autoSkewerBtn) {
            autoSkewerBtn.disabled = false;
            autoSkewerBtn.textContent = State.autoProcess.skewer ? '停止' : '自动化';
        }
        if (skewerStatus) {
            skewerStatus.textContent = '已解锁';
            skewerStatus.style.color = '#4CAF50';
        }
        
        // 咻咻辣辣串需要烤虫机
        if (State.hasToaster) {
            if (autoSpicySkewerBtn) {
                autoSpicySkewerBtn.disabled = false;
                autoSpicySkewerBtn.textContent = State.autoProcess.spicySkewer ? '停止' : '自动化';
            }
            if (spicySkewerStatus) {
                spicySkewerStatus.textContent = '已解锁';
                spicySkewerStatus.style.color = '#4CAF50';
            }
        } else {
            if (autoSpicySkewerBtn) autoSpicySkewerBtn.disabled = true;
            if (spicySkewerStatus) {
                spicySkewerStatus.textContent = '需要烤虫机';
                spicySkewerStatus.style.color = '#999';
            }
        }
    },
    
    showMarketShop() {
        this.hideAllMainPanes();
        document.getElementById('marketShopPane').style.display = 'block';
        Shop.render();
    },
    
    showHotel() {
        this.hideAllMainPanes();
        document.getElementById('hotelPane').style.display = 'block';
    },

    renderMarketList(filter = 'all') {
        const marketList = document.getElementById('marketList');
        if (!marketList) return;

        const allItems = [];
        State.marketItems.forEach(item => {
            allItems.push({ ...item, source: 'market' });
        });
        State.equipmentBackpack.forEach((equip, index) => {
            if (equip.type === 'tool' || equip.type === 'equipment') {
                allItems.push({
                    ...equip,
                    itemType: 'equipment',
                    source: 'backpack',
                    currentPrice: equip.value || 10
                });
            }
        });

        let filteredItems = allItems;
        if (filter === 'items') {
            filteredItems = allItems.filter(item => item.type === 'consumable');
        } else if (filter === 'props') {
            filteredItems = allItems.filter(item => item.type === 'ingredient');
        } else if (filter === 'equipment') {
            filteredItems = allItems.filter(item => item.type === 'upgrade' || item.type === 'treasure' || item.type === 'material');
        } else if (filter === 'tools') {
            filteredItems = allItems.filter(item => item.type === 'tool' || item.itemType === 'equipment');
        }

        if (filteredItems.length === 0) {
            marketList.innerHTML = '<div style="color:#999; padding:8px; text-align:center;">暂无物品</div>';
            return;
        }

        const sorted = filteredItems.sort((a, b) => a.currentPrice - b.currentPrice);
        let html = '';
        sorted.forEach(item => {
            const qualityClass = this.getQualityClass(item.quality || item.type);
            const qualityText = this.getQualityDisplayName(item.quality || item.type);
            html += `<div class="market-item">
                <span class="${qualityClass}">${item.name}</span>
                <span class="${qualityClass}">${qualityText}</span>
                <span>${item.currentPrice} 金币</span>
            </div>`;
        });
        marketList.innerHTML = html;
    },

    getQualityDisplayName(quality) {
        const qualityNames = {
            'common': '普通',
            'uncommon': '优秀',
            'rare': '稀有',
            'epic': '史诗',
            'legendary': '传说',
            'consumable': '普通',
            'ingredient': '普通',
            'upgrade': '稀有',
            'treasure': '传说',
            'material': '优秀',
            'tool': '普通',
            'equipment': '普通'
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
            'consumable': 'quality-white',
            'ingredient': 'quality-white',
            'upgrade': 'quality-blue',
            'treasure': 'quality-gold',
            'material': 'quality-green',
            'tool': 'quality-white',
            'equipment': 'quality-white'
        };
        return qualityClasses[quality] || 'quality-white';
    },

    bindMarketFilterEvents() {
        const filterMap = {
            'marketAllTab': 'all',
            'marketItemsTab': 'items',
            'marketPropsTab': 'props',
            'marketEquipmentTab': 'equipment',
            'marketToolsTab': 'tools'
        };

        Object.keys(filterMap).forEach(tabId => {
            const tab = document.getElementById(tabId);
            if (tab) {
                tab.addEventListener('click', () => {
                    document.querySelectorAll('#marketPane .tab-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    tab.classList.add('active');
                    this.currentMarketFilter = filterMap[tabId];
                    this.renderMarketList(filterMap[tabId]);
                });
            }
        });
    }
};
