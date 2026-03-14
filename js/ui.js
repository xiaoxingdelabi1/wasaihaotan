const UI = {
    update() {
        document.getElementById('coinCount').textContent = State.coins;
        document.querySelector('.resource-max').textContent = `/${Config.MAX_COINS}`;

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

        const netCatchBugBtn = document.getElementById('netCatchBugBtn');
        const equippedBugNet = Character.equipment.tool;
        if (equippedBugNet && equippedBugNet.name.includes('捕虫网') && equippedBugNet.durability > 0) {
            netCatchBugBtn.disabled = false;
            netCatchBugBtn.classList.remove('disabled');
            netCatchBugBtn.style.display = 'block';
            if (!Game.isNetCatching()) {
                netCatchBugBtn.innerHTML = `捕虫网捕虫`;
                netCatchBugBtn.style.background = '';
            }
        } else {
            netCatchBugBtn.disabled = true;
            netCatchBugBtn.classList.add('disabled');
            netCatchBugBtn.style.display = 'none';
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

        const backpackHeader = document.getElementById('backpackHeader');
        const nextPurseCost = Utils.getNextPurseUpgradeCost();
        backpackHeader.title = `升级需${nextPurseCost}荷包`;
        
        document.getElementById('regionDisplay').textContent = `地区：${State.currentRegion}`;
        
        this.updateAutoProcessPane();
        
        if (typeof RPGUI !== 'undefined') {
            RPGUI.updateCharacterInfo();
            RPGUI.updateEquipment();
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
    },
    
    hideAllMainPanes() {
        document.getElementById('mainButtonGroup').style.display = 'none';
        document.getElementById('stallBackpackPane').style.display = 'none';
        document.getElementById('marketShopPane').style.display = 'none';
        document.getElementById('hotelPane').style.display = 'none';
        document.getElementById('equipmentPane').style.display = 'none';
        document.getElementById('autoProcessPane').style.display = 'none';
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
    }
};
