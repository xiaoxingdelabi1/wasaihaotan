/*
 * 蛙噻！好摊 - 版权所有 2026
 * 未经许可禁止复制、修改、分发
 */
const Game = {
    init() {
        State.reset();
        
        const saved = localStorage.getItem(Config.SAVE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                State.loadSaveData(data);
            } catch(e) {
                // 加载失败时初始化角色
            }
        } else {
            Character.init();
        }
        
        Settings.init();
        RPGUI.init();
        RPGIntegration.init();
        Adventure.init();
        Automation.init();
        ItemTooltip.init();
        
        Stall.updateAutoSellButton();
        Market.render('all');
        Shop.refresh();
        Shop.render();
        Backpack.render();
        Stall.render();
        Time.update();
        Achievement.render();
        Log.render();
        UI.update();
        
        this.bindEvents();
        this.startTimers();
        
        if (!saved) {
            Log.add('游戏开始');
            Log.add('欢迎来到蛙噻！好摊RPG版');
            Log.add('你可以通过冒险提升等级，获得装备，提高摆摊效率');
        }
    },
    
    bindEvents() {
        // 绑定RPG UI事件
        if (typeof RPGUI !== 'undefined') {
            RPGUI.bindEvents();
        }
        
        // 背包和角色标签页切换
        document.getElementById('backpackTab').addEventListener('click', () => {
            document.getElementById('backpackTab').classList.add('active');
            document.getElementById('characterTab').classList.remove('active');
            document.getElementById('backpackContent').style.display = 'block';
            document.getElementById('characterContent').style.display = 'none';
        });
        
        document.getElementById('characterTab').addEventListener('click', () => {
            document.getElementById('characterTab').classList.add('active');
            document.getElementById('backpackTab').classList.remove('active');
            document.getElementById('characterContent').style.display = 'block';
            document.getElementById('backpackContent').style.display = 'none';
        });
        
        document.getElementById('autoSellBtn').addEventListener('click', () => {
            if (State.autoSellEnabled) {
                Stall.stopAutoSell();
                Log.add('自动上架已关闭');
            } else {
                Stall.startAutoSell();
                Log.add('自动上架已开启');
            }
            Save.auto();
        });
        
        // 市场标签页切换
        const marketTabs = ['marketAllTab', 'marketItemsTab', 'marketPropsTab', 'marketEquipmentTab', 'marketToolsTab'];
        
        document.getElementById('marketAllTab').addEventListener('click', () => {
            marketTabs.forEach(id => document.getElementById(id).classList.remove('active'));
            document.getElementById('marketAllTab').classList.add('active');
            Market.render('all');
        });
        
        document.getElementById('marketItemsTab').addEventListener('click', () => {
            marketTabs.forEach(id => document.getElementById(id).classList.remove('active'));
            document.getElementById('marketItemsTab').classList.add('active');
            Market.render('items');
        });
        
        document.getElementById('marketPropsTab').addEventListener('click', () => {
            marketTabs.forEach(id => document.getElementById(id).classList.remove('active'));
            document.getElementById('marketPropsTab').classList.add('active');
            Market.render('props');
        });
        
        document.getElementById('marketEquipmentTab').addEventListener('click', () => {
            marketTabs.forEach(id => document.getElementById(id).classList.remove('active'));
            document.getElementById('marketEquipmentTab').classList.add('active');
            Market.render('equipment');
        });
        
        document.getElementById('marketToolsTab').addEventListener('click', () => {
            marketTabs.forEach(id => document.getElementById(id).classList.remove('active'));
            document.getElementById('marketToolsTab').classList.add('active');
            Market.render('tools');
        });
        
        document.getElementById('catchBugBtn').addEventListener('click', () => {
            const result = Backpack.addResource('bug', 1);
            if (!result.success) {
                alert(result.message);
                return;
            }
            Log.add('捕捉了1只虫子');
            UI.update();
            Achievement.render();
            Save.auto();
        });
        
        document.getElementById('skewerBtn').addEventListener('click', () => {
            if (State.bugs < 10) return;
            const result = Backpack.addResource('skewer', 1);
            if (!result.success) {
                alert(result.message);
                return;
            }
            State.bugs -= 10;
            Log.add('将10只虫子串成1个虫虫串');
            UI.update();
            Save.auto();
        });
        
        document.getElementById('pickPepperBtn').addEventListener('click', () => {
            const result = Backpack.addResource('pepper', 1);
            if (!result.success) {
                alert(result.message);
                return;
            }
            Log.add('采摘了1个山椒');
            UI.update();
            Save.auto();
        });
        
        document.getElementById('spicySkewerBtn').addEventListener('click', () => {
            if (State.peppers < 1 || State.skewers < 1) return;
            const result = Backpack.addResource('spicySkewer', 1);
            if (!result.success) {
                alert(result.message);
                return;
            }
            State.peppers -= 1;
            State.skewers -= 1;
            Log.add('制作了1个咻咻辣辣串');
            UI.update();
            Save.auto();
        });
        
        document.getElementById('modalCancel').addEventListener('click', () => {
            document.getElementById('stallModal').style.display = 'none';
        });
        
        document.getElementById('modalConfirm').addEventListener('click', () => {
            Stall.confirmModal();
        });
        
        window.addEventListener('click', (event) => {
            if (event.target === document.getElementById('stallModal')) {
                document.getElementById('stallModal').style.display = 'none';
            }
        });
        
        document.getElementById('stallList').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-stall-btn')) {
                Stall.remove(parseInt(e.target.dataset.index, 10));
            }
        });
        
        document.getElementById('clearStallBtn').addEventListener('click', () => {
            if (State.stallItems.length === 0) return;
            Stall.clearAll();
        });
        
        document.getElementById('stallTabBtn').addEventListener('click', () => {
            UI.setActiveTab(document.getElementById('stallTabBtn'), document.getElementById('stallPane'));
        });
        
        document.getElementById('marketTabBtn').addEventListener('click', () => {
            UI.setActiveTab(document.getElementById('marketTabBtn'), document.getElementById('marketPane'));
        });
        
        document.getElementById('tabAll').addEventListener('click', (e) => {
            e.preventDefault();
            UI.hideAllMainPanes();
            document.getElementById('mainButtonGroup').style.display = 'flex';
        });
        
        document.getElementById('tabProcess').addEventListener('click', (e) => {
            e.preventDefault();
            UI.hideAllMainPanes();
            document.getElementById('autoProcessPane').style.display = 'block';
        });
        
        document.getElementById('tabTool').addEventListener('click', (e) => {
            e.preventDefault();
            UI.hideAllMainPanes();
            document.getElementById('toolPane').style.display = 'block';
            Tool.render();
        });
        
        document.getElementById('tabStall').addEventListener('click', (e) => {
            e.preventDefault();
            UI.showStallBackpack();
        });
        
        document.getElementById('tabMarketShop').addEventListener('click', (e) => {
            e.preventDefault();
            UI.showMarketShop();
        });
        
        document.getElementById('tabHotel').addEventListener('click', (e) => {
            e.preventDefault();
            UI.showHotel();
        });
        
        document.getElementById('hotelStayBtn').addEventListener('click', () => {
            if (confirm('确定要花费100金币借宿过夜吗？')) {
                Time.hotelStay();
            }
        });
        
        const deleteSaveLink = document.getElementById('deleteSaveLink');
        if (deleteSaveLink) {
            deleteSaveLink.addEventListener('click', (e) => {
                e.preventDefault();
                Save.delete();
            });
        }
        
        const saveGameLink = document.getElementById('saveGameLink');
        if (saveGameLink) {
            saveGameLink.addEventListener('click', (e) => {
                e.preventDefault();
                const status = Save.save();
                const saveStatus = document.getElementById('saveStatus');
                if (saveStatus) {
                    saveStatus.textContent = status;
                    setTimeout(() => saveStatus.textContent = '', 2000);
                }
            });
        }
        
        const loadGameLink = document.getElementById('loadGameLink');
        if (loadGameLink) {
            loadGameLink.addEventListener('click', (e) => {
                e.preventDefault();
                const status = Save.load();
                const saveStatus = document.getElementById('saveStatus');
                if (saveStatus) {
                    saveStatus.textContent = status;
                    setTimeout(() => saveStatus.textContent = '', 2000);
                }
            });
        }
        
        this.bindDevEvents();
        
        UI.hideAllMainPanes();
        document.getElementById('mainButtonGroup').style.display = 'flex';
    },
    
    bindDevEvents() {
        document.getElementById('devLink').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('devPanel').style.display = 'flex';
            this.refreshDevItemList();
            this.refreshDevStateInfo();
        });
        
        document.getElementById('closeDevPanel').addEventListener('click', () => {
            document.getElementById('devPanel').style.display = 'none';
        });
        
        document.getElementById('devPanel').addEventListener('click', (e) => {
            if (e.target === document.getElementById('devPanel')) {
                document.getElementById('devPanel').style.display = 'none';
            }
        });
        
        setInterval(() => {
            if (document.getElementById('devPanel').style.display === 'flex') {
                this.refreshDevStateInfo();
            }
        }, 1000);
        
        document.getElementById('devAddCoinsBtn').addEventListener('click', () => {
            let amount = parseInt(document.getElementById('devAddCoins').value);
            if (isNaN(amount) || amount < 1) amount = 1;
            State.coins = Math.min(State.coins + amount, Config.MAX_COINS);
            Log.add(`开发者增加了${amount}金币`);
            UI.update();
            Save.auto();
            document.getElementById('saveStatus').textContent = '金币已增加';
            setTimeout(() => document.getElementById('saveStatus').textContent = '', 2000);
        });
        
        document.getElementById('devSetCoinsBtn').addEventListener('click', () => {
            let amount = parseInt(document.getElementById('devSetCoins').value);
            if (isNaN(amount) || amount < 0) amount = 0;
            State.coins = Math.min(amount, Config.MAX_COINS);
            Log.add(`开发者设置金币为${amount}`);
            UI.update();
            Save.auto();
            document.getElementById('saveStatus').textContent = '金币已设置';
            setTimeout(() => document.getElementById('saveStatus').textContent = '', 2000);
        });
        
        document.getElementById('setVolatilityBtn').addEventListener('click', () => {
            let v = parseInt(document.getElementById('globalVolatility').value);
            if (isNaN(v) || v < 0) v = 0;
            State.globalVolatility = v;
            alert(`全局波动金额已设为 ${v}`);
            Save.auto();
        });
        
        document.getElementById('addItemBtn').addEventListener('click', () => {
            const name = document.getElementById('newItemName').value.trim();
            const min = parseInt(document.getElementById('newItemMin').value);
            const max = parseInt(document.getElementById('newItemMax').value);
            const price = parseInt(document.getElementById('newItemPrice').value);
            const vol = parseInt(document.getElementById('newItemVolatility').value);
            const speed = parseInt(document.getElementById('newItemSpeed').value);
            const cap = parseInt(document.getElementById('newItemCapacity').value);
            
            if (!name) { alert('请输入名称'); return; }
            if (isNaN(min) || min < 1) { alert('最低价必须为正整数'); return; }
            if (isNaN(max) || max < min) { alert('最高价必须 ≥ 最低价'); return; }
            if (isNaN(price) || price < min || price > max) { alert('初始价必须在范围内'); return; }
            if (isNaN(vol) || vol < 0) { alert('波动金额必须为非负整数'); return; }
            if (isNaN(speed) || speed < 1) { alert('速度必须为正整数'); return; }
            if (isNaN(cap) || cap < 1) { alert('容量必须为正整数'); return; }
            
            Market.addItem({ name, minPrice: min, maxPrice: max, currentPrice: price, volatility: vol, baseSpeed: speed, capacity: cap });
            this.refreshDevItemList();
            Save.auto();
        });
        
        document.getElementById('nextDayBtn').addEventListener('click', () => {
            Time.nextDay();
        });
        
        document.getElementById('addToBackpackBtn').addEventListener('click', () => {
            const name = document.getElementById('devItemName').value.trim();
            const qty = parseInt(document.getElementById('devItemQty').value);
            if (!name) { alert('请输入物品名称'); return; }
            if (isNaN(qty) || qty <= 0) { alert('数量必须为正整数'); return; }
            
            const type = ItemTypeMap[name];
            if (!type) {
                alert('只支持添加虫子、荷叶、虫虫串、辣椒、胡萝卜、咻咻辣辣串、荷包、小存钱罐');
                return;
            }
            
            if (!Backpack.canAddItem(type, qty)) {
                alert('背包空间不足');
                return;
            }
            Backpack.addResource(type, qty);
            
            Log.add(`开发者添加了${qty}个${name}`);
            UI.update();
            Save.auto();
            document.getElementById('devItemName').value = '';
            document.getElementById('devItemQty').value = 1;
        });
        
        document.getElementById('setTimeBtn').addEventListener('click', () => {
            const year = parseInt(document.getElementById('setYear').value);
            const seasonIdx = parseInt(document.getElementById('setSeason').value);
            const day = parseInt(document.getElementById('setDay').value);
            const hour = parseInt(document.getElementById('setHour').value);
            
            if (isNaN(year) || year < 1) { alert('年份必须≥1'); return; }
            if (isNaN(day) || day < 1 || day > 4) { alert('日必须1-4'); return; }
            if (isNaN(hour) || hour < 8 || hour > 20) { alert('小时必须8-20'); return; }
            
            Time.set(year, seasonIdx, day, hour);
        });
        
        document.getElementById('saveGameBtn').addEventListener('click', () => {
            const status = Save.save();
            document.getElementById('saveStatus').textContent = status;
            setTimeout(() => document.getElementById('saveStatus').textContent = '', 2000);
        });
        
        document.getElementById('loadGameBtn').addEventListener('click', () => {
            const status = Save.load();
            document.getElementById('saveStatus').textContent = status;
            setTimeout(() => document.getElementById('saveStatus').textContent = '', 2000);
        });
        
        document.getElementById('exportGameBtn').addEventListener('click', () => {
            const status = Save.export();
            document.getElementById('saveStatus').textContent = status;
            setTimeout(() => document.getElementById('saveStatus').textContent = '', 2000);
        });
        
        document.getElementById('importGameBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        
        document.getElementById('importFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            Save.import(file);
            e.target.value = '';
        });
        
        document.getElementById('getPondSetBtn').addEventListener('click', () => {
            this.giveSetEquipment('pond');
        });
        
        document.getElementById('getForestSetBtn').addEventListener('click', () => {
            this.giveSetEquipment('forest');
        });
        
        document.getElementById('getCaveSetBtn').addEventListener('click', () => {
            this.giveSetEquipment('cave');
        });
        
        document.getElementById('getCastleSetBtn').addEventListener('click', () => {
            this.giveSetEquipment('castle');
        });
    },
    
    refreshDevItemList() {
        const devItemList = document.getElementById('devItemList');
        let html = '';
        State.marketItems.forEach((item, index) => {
            html += `
                <div class="dev-item-row">
                    <span>${item.name}</span>
                    <input type="number" class="dev-min" data-index="${index}" value="${item.minPrice}" style="width:90px;" placeholder="最低">
                    <input type="number" class="dev-max" data-index="${index}" value="${item.maxPrice}" style="width:90px;" placeholder="最高">
                    <input type="number" class="dev-price" data-index="${index}" value="${item.currentPrice}" style="width:90px;" placeholder="当前">
                    <input type="number" class="dev-vol" data-index="${index}" value="${item.volatility}" step="1" min="0" style="width:90px;" placeholder="波动额">
                    <input type="number" class="dev-speed" data-index="${index}" value="${item.baseSpeed}" min="1" step="1" style="width:90px;" placeholder="速度">
                    <input type="number" class="dev-cap" data-index="${index}" value="${item.capacity}" min="1" step="1" style="width:90px;" placeholder="容量">
                    <button class="dev-update" data-index="${index}">更新</button>
                    <button class="dev-delete" data-index="${index}">删除</button>
                </div>
            `;
        });
        devItemList.innerHTML = html;

        document.querySelectorAll('.dev-update').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.index;
                const min = parseInt(document.querySelector(`.dev-min[data-index="${idx}"]`).value);
                const max = parseInt(document.querySelector(`.dev-max[data-index="${idx}"]`).value);
                const price = parseInt(document.querySelector(`.dev-price[data-index="${idx}"]`).value);
                const vol = parseInt(document.querySelector(`.dev-vol[data-index="${idx}"]`).value);
                const speed = parseInt(document.querySelector(`.dev-speed[data-index="${idx}"]`).value);
                const cap = parseInt(document.querySelector(`.dev-cap[data-index="${idx}"]`).value);
                
                if (isNaN(min) || isNaN(max) || isNaN(price) || isNaN(vol) || isNaN(speed) || isNaN(cap) ||
                    min < 1 || max < min || price < min || price > max || vol < 0 || speed < 1 || cap < 1) {
                    alert('数值无效');
                    return;
                }
                
                Market.updateItem(idx, { minPrice: min, maxPrice: max, currentPrice: price, volatility: vol, baseSpeed: speed, capacity: cap });
                this.refreshDevItemList();
                Save.auto();
            });
        });

        document.querySelectorAll('.dev-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.index;
                if (confirm(`确定删除 ${State.marketItems[idx].name} 吗？`)) {
                    Market.removeItem(idx);
                    this.refreshDevItemList();
                    Save.auto();
                }
            });
        });
    },
    
    refreshDevStateInfo() {
        const stateInfo = document.getElementById('devStateInfo');
        if (!stateInfo) return;
        
        const info = {
            '金币': State.coins,
            '虫子': State.bugs,
            '荷叶': State.leaves,
            '虫虫串': State.skewers,
            '荷包': State.purses,
            '小存钱罐': State.piggyBanks,
            '---': '---',
            '摊位上架次数': State.stallCount,
            '集市购买次数': State.shopBuyCount,
            '累计出售价值': State.totalSoldValue,
            '荷叶使用次数': State.usedLeaves,
            '荷包使用次数': State.backpackUpgradeCount,
            '击败妖怪次数': State.monsterKillCount
        };
        
        let html = '';
        for (const [key, value] of Object.entries(info)) {
            html += `<div><b>${key}:</b> ${value}</div>`;
        }
        stateInfo.innerHTML = html;
    },
    
    giveSetEquipment(areaId) {
        const setData = Equipment.setEquipment[areaId];
        if (!setData) {
            alert('未找到该套装配置');
            return;
        }
        
        const setName = setData.setName;
        const level = setData.level;
        const types = setData.types;
        
        const typeNames = {
            armor: '护甲',
            helmet: '头盔',
            boots: '鞋子',
            gloves: '手套',
            pants: '裤子'
        };
        
        let addedCount = 0;
        let failedCount = 0;
        types.forEach(type => {
            const attrType = Equipment.attributeTypes[Math.floor(Math.random() * Equipment.attributeTypes.length)];
            const attrValue = Equipment.attributeValues[level][attrType];
            
            const equipment = {
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                name: `${setName}${typeNames[type]}`,
                type: type,
                level: level,
                quality: 'common',
                setName: setName,
                value: attrValue * 5
            };
            
            equipment[attrType] = attrValue;
            
            const result = Equipment.addToBackpack(equipment);
            if (result.success) {
                addedCount++;
            } else {
                failedCount++;
            }
        });
        
        if (addedCount > 0) {
            Log.add(`开发者获得${setName}套装 (${addedCount}件)`);
            UI.update();
            Backpack.render();
            Save.auto();
        }
        if (failedCount > 0) {
            alert(`装备背包已满，${failedCount}件装备未能添加！`);
        }
    },
    
    startTimers() {
        Time.startTimer();
        Stall.startSaleTimer();
        this.startAutoProcess();
    },
    
    autoProcessInterval: null,
    
    startAutoProcess() {
        // Automation now uses per-card intervals instead of global process
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Game.init();
    
    document.getElementById('donateLink').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('donateModal').style.display = 'block';
    });
});
