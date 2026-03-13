const Settings = {
    autoHeal: false,
    healThreshold: 30,
    autoSellType: 'all',
    autoSellMinPrice: 0,
    
    init() {
        this.load();
        try {
            this.bindEvents();
        } catch(e) {
            console.error('Settings bindEvents error:', e);
        }
    },
    
    bindEvents() {
        const settingsLink = document.getElementById('settingsLink');
        if (settingsLink) {
            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        }
        
        const autoHealToggle = document.getElementById('autoHealToggle');
        if (autoHealToggle) {
            autoHealToggle.addEventListener('change', (e) => {
                const row = document.getElementById('healThresholdRow');
                if (row) {
                    row.style.display = e.target.checked ? 'flex' : 'none';
                }
            });
        }
    },
    
    open() {
        document.getElementById('autoHealToggle').checked = this.autoHeal;
        document.getElementById('healThreshold').value = this.healThreshold;
        document.getElementById('healThresholdRow').style.display = this.autoHeal ? 'flex' : 'none';
        document.getElementById('autoSellType').value = this.autoSellType;
        document.getElementById('autoSellMinPrice').value = this.autoSellMinPrice;
        document.getElementById('settingsModal').style.display = 'block';
    },
    
    save() {
        this.autoHeal = document.getElementById('autoHealToggle').checked;
        this.healThreshold = parseInt(document.getElementById('healThreshold').value) || 30;
        this.healThreshold = Math.max(10, Math.min(90, this.healThreshold));
        this.autoSellType = document.getElementById('autoSellType').value;
        this.autoSellMinPrice = parseInt(document.getElementById('autoSellMinPrice').value) || 0;
        this.autoSellMinPrice = Math.max(0, this.autoSellMinPrice);
        this.saveToStorage();
        document.getElementById('settingsModal').style.display = 'none';
        Log.add(this.autoHeal ? `已开启自动用药（血量低于${this.healThreshold}%时触发）` : '已关闭自动用药');
    },
    
    saveToStorage() {
        localStorage.setItem('gameSettings', JSON.stringify({
            autoHeal: this.autoHeal,
            healThreshold: this.healThreshold,
            autoSellType: this.autoSellType,
            autoSellMinPrice: this.autoSellMinPrice
        }));
    },
    
    load() {
        const saved = localStorage.getItem('gameSettings');
        if (saved) {
            const data = JSON.parse(saved);
            this.autoHeal = data.autoHeal || false;
            this.healThreshold = data.healThreshold || 30;
            this.autoSellType = data.autoSellType || 'all';
            this.autoSellMinPrice = data.autoSellMinPrice || 0;
        }
    },
    
    checkAutoHeal() {
        if (!this.autoHeal) return false;
        
        const healthPercent = (Character.currentHealth / Character.maxHealth) * 100;
        if (healthPercent >= this.healThreshold) return false;
        
        const healItems = [
            { type: 'bug', name: '虫子', heal: 1, state: 'bugs' },
            { type: 'apple', name: '苹果', heal: 5, state: 'apples' },
            { type: 'banana', name: '香蕉', heal: 8, state: 'bananas' },
            { type: 'skewer', name: '虫虫串', heal: 15, state: 'skewers' },
            { type: 'watermelon', name: '西瓜', heal: 15, state: 'watermelons' },
            { type: 'spicySkewer', name: '咻咻辣辣串', heal: 50, state: 'spicySkewers' }
        ];
        
        let healed = false;
        
        while (Character.currentHealth < Character.maxHealth) {
            let usedItem = false;
            for (const item of healItems) {
                if (State[item.state] > 0) {
                    State[item.state]--;
                    Character.heal(item.heal);
                    Log.add(`自动使用${item.name}，恢复${item.heal}生命`);
                    healed = true;
                    usedItem = true;
                    break;
                }
            }
            
            if (!usedItem) break;
        }
        
        return healed;
    }
};
