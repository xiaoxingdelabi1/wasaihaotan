const Adventure = {
    isAutoFighting: false,
    isDead: false,
    currentMonster: null,
    currentAreaId: 'pond',
    fightInterval: null,
    killCount: 0,
    bossKilled: false,
    miniBossKilled: {},
    
    init() {
        this.currentAreaId = Areas.currentArea || 'pond';
        this.bindEvents();
        this.updateAreaSelect();
        
        // 恢复保存的怪物状态
        if (State.currentMonster) {
            this.currentMonster = State.currentMonster;
            this.updateMonsterUI();
            this.addLog(`继续战斗：${this.currentMonster.name}`, '#ff6b6b');
        }
        
        // 根据保存的状态决定是否自动开始战斗
        if (!State.autoFightPaused) {
            this.startAutoFight();
        } else {
            this.updateUI();
        }
    },
    
    bindEvents() {
        document.getElementById('autoFightBtn').addEventListener('click', () => {
            if (this.isAutoFighting) {
                this.stopAutoFight();
            } else {
                this.startAutoFight();
            }
        });
        
        document.getElementById('adventureAreaSelect').addEventListener('change', (e) => {
            const areaId = e.target.value;
            const area = Areas.areas.find(a => a.id === areaId);
            if (area && area.isUnlocked) {
                this.currentAreaId = areaId;
                Areas.currentArea = areaId;
                State.currentRegion = area.name;
                State.adventureCurrentRepeatCount = 0;
                if (typeof Achievement !== 'undefined') {
                    Achievement.renderRegion();
                }
                if (this.isAutoFighting) {
                    this.stopAutoFight();
                    this.startAutoFight();
                }
            } else {
                alert('该地区未解锁！');
                e.target.value = this.currentAreaId;
            }
        });
        
        document.getElementById('adventureRepeatSelect').addEventListener('change', (e) => {
            State.adventureRepeatCount = parseInt(e.target.value);
            State.adventureCurrentRepeatCount = 0;
            Save.auto();
        });

        const repeatSelect = document.getElementById('adventureRepeatSelect');
        if (repeatSelect) {
            repeatSelect.value = (State.adventureRepeatCount !== undefined) ? State.adventureRepeatCount : 1;
        }
    },
    
    startAutoFight() {
        if (Character.isDead()) {
            this.addLog('角色已死亡，请恢复血量！', '#ff6b6b');
            if (Settings.autoHeal) {
                this.autoHealUntil80();
            }
            return;
        }

        if (Settings.autoHeal) {
            const healthPercent = (Character.currentHealth / Character.maxHealth) * 100;
            if (healthPercent < 80) {
                this.addLog('血量低于80%，自动恢复中...', '#4CAF50');
                this.autoHealUntil80();
                return;
            }
        }

        this.isAutoFighting = true;
        State.autoFightPaused = false; // 保存状态：正在战斗
        Save.auto();

        const btn = document.getElementById('autoFightBtn');
        btn.textContent = '||';
        btn.classList.add('active');

        this.killCount = 0;
        this.bossKilled = false;
        State.adventureCurrentRepeatCount = 0;

        this.updateAreaSelect();

        const repeatSelect = document.getElementById('adventureRepeatSelect');
        if (repeatSelect) {
            State.adventureRepeatCount = parseInt(repeatSelect.value);
        }

        // 如果没有保存的怪物，才生成新怪物
        if (!this.currentMonster) {
            this.spawnMonster();
        }
        this.fightInterval = setInterval(() => this.fightTurn(), 500);
    },
    
    stopAutoFight() {
        this.isAutoFighting = false;
        State.autoFightPaused = true; // 保存状态：已暂停
        Save.auto();
        
        if (this.fightInterval) {
            clearInterval(this.fightInterval);
            this.fightInterval = null;
        }
        
        const btn = document.getElementById('autoFightBtn');
        btn.textContent = '>';
        btn.classList.remove('active');
        
        document.getElementById('adventureMonsterName').textContent = '等待战斗...';
        document.getElementById('adventureMonsterLevel').textContent = '';
        document.getElementById('adventureMonsterHp').textContent = '0';
        document.getElementById('adventureMonsterMaxHp').textContent = '0';
        document.getElementById('adventureMonsterHpBar').style.width = '0%';
        document.getElementById('adventureDropPreview').textContent = '';
    },
    
    spawnMonster() {
        const area = Areas.areas.find(a => a.id === this.currentAreaId);
        if (!area || !area.monsters || area.monsters.length === 0) return;

        const areaMiniBosses = area.miniBosses || [];
        const areaBoss = area.boss;

        if (!this.miniBossKilled[this.currentAreaId]) {
            this.miniBossKilled[this.currentAreaId] = [];
        }
        const killedMiniBosses = this.miniBossKilled[this.currentAreaId];

        if (areaBoss && killedMiniBosses.length >= 3 && !this.bossKilled) {
            this.spawnBoss(area);
            return;
        }

        if (this.killCount > 0 && this.killCount % 20 === 0 && killedMiniBosses.length < 3) {
            const availableMiniBosses = areaMiniBosses.filter(mb => !killedMiniBosses.includes(mb));
            if (availableMiniBosses.length > 0) {
                const miniBossType = availableMiniBosses[Math.floor(Math.random() * availableMiniBosses.length)];
                const baseMiniBoss = Monsters.getMonsterInfo(miniBossType);
                if (baseMiniBoss) {
                    const miniBoss = JSON.parse(JSON.stringify(baseMiniBoss));
                    miniBoss.type = miniBossType;
                    miniBoss.maxHealth = miniBoss.health;
                    this.currentMonster = miniBoss;
                    this.updateMonsterUI();
                    this.addLog(`⚠️ 小BOSS出现：${miniBoss.name}！`, '#ff6600');
                    return;
                }
            }
        }

        const monsterType = area.monsters[Math.floor(Math.random() * area.monsters.length)];
        const baseMonster = Monsters.getMonsterInfo(monsterType);
        if (!baseMonster) return;

        const monster = JSON.parse(JSON.stringify(baseMonster));
        monster.maxHealth = monster.health;

        if (this.currentAreaId === 'castle' && !monster.isBoss && Math.random() < 0.3) {
            monster.name = `精英 ${monster.name}`;
            monster.health = Math.floor(monster.health * 1.5);
            monster.maxHealth = monster.health;
            monster.attack = Math.floor(monster.attack * 1.5);
            monster.defense = Math.floor(monster.defense * 1.5);
            monster.experience = Math.floor(monster.experience * 2);
            monster.gold = Math.floor(monster.gold * 2);
            monster.isElite = true;
        }

        this.currentMonster = monster;
        this.updateMonsterUI();
        this.addLog(`遭遇 ${monster.name}！`, '#ff6b6b');
    },
    
    spawnBoss(area) {
        const bossType = area.boss;
        const baseMonster = Monsters.getMonsterInfo(bossType);
        if (!baseMonster) {
            this.bossKilled = true;
            this.spawnMonster();
            return;
        }

        const boss = JSON.parse(JSON.stringify(baseMonster));
        boss.type = bossType;
        boss.name = `大BOSS - ${boss.name}`;
        boss.health = Math.floor(boss.health * 3);
        boss.maxHealth = boss.health;
        boss.attack = Math.floor(boss.attack * 2);
        boss.defense = Math.floor(boss.defense * 2);
        boss.experience = Math.floor(boss.experience * 5);
        boss.gold = Math.floor(boss.gold * 5);
        boss.isBoss = true;

        this.currentMonster = boss;
        this.updateMonsterUI();
        this.addLog(`⚠️ BOSS 战！${boss.name} 出现了！`, '#ff0000');
    },
    
    fightTurn() {
        if (!this.isAutoFighting || !this.currentMonster) return;
        
        if (Character.isDead()) {
            this.onPlayerDeath();
            return;
        }
        
        let playerDamage = Character.attack;
        if (Character.monsterDamage > 0) {
            playerDamage = Math.floor(playerDamage * (1 + Character.monsterDamage / 100));
        }
        
        if (Math.random() * 100 < Character.criticalChance) {
            playerDamage = Math.floor(playerDamage * (Character.criticalDamage / 100));
        }
        
        this.currentMonster.health = Math.max(0, this.currentMonster.health - playerDamage);
        this.updateMonsterUI();
        
        // 保存当前怪物状态
        State.currentMonster = this.currentMonster;
        Save.auto();
        
        if (this.currentMonster.health <= 0) {
            this.monsterDefeated();
            return;
        }
        
        if (Math.random() * 100 >= Character.dodge) {
            let monsterDamage = Math.max(1, this.currentMonster.attack - Character.defense);
            Character.takeDamage(monsterDamage);
        }
        
        this.updatePlayerUI();
        
        if (Character.isDead()) {
            this.onPlayerDeath();
        }
    },
    
    onPlayerDeath() {
        this.addLog('角色死亡！', '#ff6b6b');
        this.isDead = true;

        const hpBar = document.getElementById('adventurePlayerHpBar');
        if (hpBar) {
            hpBar.style.background = '#ccc';
            hpBar.style.filter = 'grayscale(100%)';
        }

        this.stopAutoFight();

        if (Settings.autoHeal) {
            this.addLog('自动恢复中...', '#4CAF50');
            setTimeout(() => {
                this.autoHealUntil80();
            }, 3000);
        } else {
            setTimeout(() => {
                const currentIndex = Areas.areas.findIndex(a => a.id === this.currentAreaId);

                if (currentIndex > 0) {
                    const previousArea = Areas.areas[currentIndex - 1];
                    this.currentAreaId = previousArea.id;
                    Areas.currentArea = previousArea.id;
                    State.currentRegion = previousArea.name;
                    this.addLog(`返回 ${previousArea.name}！`, '#ff6b6b');
                } else {
                    this.addLog(`在池塘复活！`, '#ff6b6b');
                }

                this.killCount = 0;
                this.bossKilled = false;
                this.miniBossKilled[this.currentAreaId] = [];
                State.currentMonster = null;
                this.currentMonster = null;
                State.adventureCurrentRepeatCount = 0;

                Character.currentHealth = Character.maxHealth;
                this.isDead = false;
                this.addLog(`自动复活，满血继续战斗！`, '#4CAF50');

                this.updatePlayerUI();
                this.updateAreaSelect();
                UI.update();
                if (typeof Achievement !== 'undefined') {
                    Achievement.renderRegion();
                }
                Save.auto();

                setTimeout(() => {
                    this.startAutoFight();
                }, 500);
            }, 3000);
        }
    },

    autoHealUntil80() {
        const targetHealthPercent = 80;

        if (Character.currentHealth >= Character.maxHealth * targetHealthPercent / 100) {
            this.isDead = false;
            this.addLog(`生命值已恢复到80%以上！`, '#4CAF50');

            const currentIndex = Areas.areas.findIndex(a => a.id === this.currentAreaId);

            if (currentIndex > 0) {
                const previousArea = Areas.areas[currentIndex - 1];
                this.currentAreaId = previousArea.id;
                Areas.currentArea = previousArea.id;
                State.currentRegion = previousArea.name;
                this.addLog(`返回 ${previousArea.name}重新开始！`, '#ff6b6b');
            } else {
                this.addLog(`在池塘复活重新开始！`, '#ff6b6b');
            }

            this.killCount = 0;
            this.bossKilled = false;
            this.miniBossKilled[this.currentAreaId] = [];
            State.currentMonster = null;
            this.currentMonster = null;

            Character.currentHealth = Character.maxHealth;
            this.updatePlayerUI();
            this.updateAreaSelect();
            UI.update();
            if (typeof Achievement !== 'undefined') {
                Achievement.renderRegion();
            }
            Save.auto();
            setTimeout(() => {
                this.startAutoFight();
            }, 500);
            return;
        }

        const healItems = [
            { type: 'spicySkewer', name: '咻咻辣辣串', heal: 500, count: () => State.spicySkewers },
            { type: 'skewer', name: '虫虫串', heal: 150, count: () => State.skewers },
            { type: 'bug', name: '虫子', heal: 10, count: () => State.bugs }
        ];

        let healed = false;
        for (const item of healItems) {
            if (item.count() > 0) {
                Backpack.useItem(item.type);
                healed = true;
                break;
            }
        }

        if (healed) {
            this.updatePlayerUI();
            UI.update();
            setTimeout(() => {
                this.autoHealUntil80();
            }, 30);
        } else {
            this.addLog('没有回血道具，需要手动恢复！', '#ff6b6b');
            const currentIndex = Areas.areas.findIndex(a => a.id === this.currentAreaId);
            if (currentIndex > 0) {
                const previousArea = Areas.areas[currentIndex - 1];
                this.currentAreaId = previousArea.id;
                Areas.currentArea = previousArea.id;
                State.currentRegion = previousArea.name;
                this.addLog(`返回 ${previousArea.name}进行恢复...`, '#ff6b6b');
            } else {
                this.addLog(`在池塘等待恢复...`, '#ff6b6b');
            }
            this.updateAreaSelect();
            UI.update();
        }
    },
    
    monsterDefeated() {
        const monster = this.currentMonster;

        if (!monster || monster.health > 0) {
            return;
        }

        this.currentMonster = null;
        State.currentMonster = null;
        Save.auto();

        Character.gainExperience(monster.experience);
        Currency.addWen(monster.gold);
        State.monsterKillCount++;

        if (monster.isMiniBoss) {
            if (!this.miniBossKilled[this.currentAreaId]) {
                this.miniBossKilled[this.currentAreaId] = [];
            }
            if (!this.miniBossKilled[this.currentAreaId].includes(monster.type)) {
                this.miniBossKilled[this.currentAreaId].push(monster.type);
            }
            this.addLog(`🎉 击败小BOSS ${monster.name}！(${this.miniBossKilled[this.currentAreaId].length}/3)`, '#ff6600');
            this.killCount++;
        } else if (monster.isBoss) {
            this.bossKilled = true;
            State.adventureCurrentRepeatCount++;
            this.addLog(`🎉 击败大BOSS ${monster.name}！(${State.adventureCurrentRepeatCount}/${State.adventureRepeatCount})`, '#ffd700');

            if (State.adventureRepeatCount > 0 && State.adventureCurrentRepeatCount >= State.adventureRepeatCount) {
                this.addLog(`已完成 ${State.adventureRepeatCount} 次，前往下一地区！`, '#4CAF50');
                State.adventureCurrentRepeatCount = 0;
                setTimeout(() => this.advanceToNextArea(), 500);
            } else {
                setTimeout(() => this.advanceToNextArea(), 500);
            }
            return;
        } else {
            this.killCount++;
        }

        if (monster.drops && monster.drops.length > 0) {
            monster.drops.forEach(drop => {
                if (Math.random() < drop.chance) {
                    const dropType = ItemTypeMap[drop.name];
                    if (dropType) {
                        if (Backpack.canAddItem(dropType, 1)) {
                            Backpack.addResource(dropType, 1);
                            this.addLog(`获得 ${drop.name}`, '#4CAF50');
                        }
                    }
                }
            });
        }

        const dropChance = monster.isBoss ? 0.05 : (monster.isMiniBoss ? 0.02 : 0);
        if (dropChance > 0 && Math.random() < dropChance) {
            const area = Areas.areas.find(a => a.id === this.currentAreaId);
            if (area) {
                const equipment = Equipment.generateSetEquipment(this.currentAreaId);
                if (equipment) {
                    const result = Equipment.addToBackpack(equipment);
                    if (result.success) {
                        this.addLog(`获得装备：${equipment.name}！`, '#ffd700');
                    }
                }
            }
        }

        this.updatePlayerUI();
        UI.update();
        Save.auto();
        
        const healthPercent = (Character.currentHealth / Character.maxHealth) * 100;
        if (Settings.autoHeal || healthPercent < 80) {
            Settings.checkAutoHeal(healthPercent < 80);
        }

        setTimeout(() => {
            if (this.isAutoFighting) {
                this.spawnMonster();
            }
        }, 300);
    },
    
    advanceToNextArea() {
        const currentIndex = Areas.areas.findIndex(a => a.id === this.currentAreaId);

        if (currentIndex < Areas.areas.length - 1) {
            const nextArea = Areas.areas[currentIndex + 1];

            nextArea.isUnlocked = true;
            this.currentAreaId = nextArea.id;
            Areas.currentArea = nextArea.id;
            State.currentRegion = nextArea.name;
            this.addLog(`→ 前进到 ${nextArea.name}！`, '#4CAF50');

            this.killCount = 0;
            this.bossKilled = false;
            State.adventureCurrentRepeatCount = 0;

            this.updateAreaSelect();
            UI.update();
            if (typeof Achievement !== 'undefined') {
                Achievement.renderRegion();
            }
            Save.auto();

            setTimeout(() => {
                if (this.isAutoFighting) {
                    this.spawnMonster();
                }
            }, 1000);
        } else {
            this.addLog(`🏆 已通关所有地区！继续挑战...`, '#ffd700');
            this.bossKilled = false;
            this.miniBossKilled[this.currentAreaId] = [];
            this.killCount = 0;
            State.adventureCurrentRepeatCount = 0;
            setTimeout(() => this.spawnMonster(), 500);
        }
    },
    
    updateMonsterUI() {
        if (!this.currentMonster) return;
        const m = this.currentMonster;
        document.getElementById('adventureMonsterName').textContent = m.name;
        document.getElementById('adventureMonsterLevel').textContent = `Lv.${m.level}`;
        document.getElementById('adventureMonsterHp').textContent = Math.max(0, m.health);
        document.getElementById('adventureMonsterMaxHp').textContent = m.maxHealth;
        const hpPercent = Math.max(0, (m.health / m.maxHealth) * 100);
        document.getElementById('adventureMonsterHpBar').style.width = hpPercent + '%';

        const dropPreview = document.getElementById('adventureDropPreview');
        let htmlParts = [];

        if (m.drops && m.drops.length > 0) {
            const dropHtml = m.drops.map(d => {
                const dropType = ItemTypeMap[d.name];
                const itemData = dropType ? Items[dropType] : null;
                let color = '#888';
                if (itemData) {
                    if (itemData.type === 'tool' || itemData.type === 'equipment') {
                        color = '#1565c0';
                    } else if (itemData.type === 'consumable' || itemData.type === 'ingredient' || itemData.type === 'material') {
                        color = '#4CAF50';
                    }
                }
                return `<span style="color: ${color};">${d.name}</span>`;
            }).join(' ');
            htmlParts.push(`掉落: ${dropHtml}`);
        }

        if (m.isBoss || m.isMiniBoss) {
            const setData = Equipment.setEquipment[this.currentAreaId];
            if (setData) {
                htmlParts.push(`<span style="color: #1565c0;">${setData.setName}套装</span>`);
            }
        }

        dropPreview.innerHTML = htmlParts.length > 0 ? htmlParts.join(' | ') : '';
    },
    
    updatePlayerUI() {
        document.getElementById('adventurePlayerLevel').textContent = Character.level;
        document.getElementById('adventurePlayerExp').textContent = `${Character.experience}/${Character.experienceToNext}`;
        document.getElementById('adventurePlayerHp').textContent = Character.currentHealth;
        document.getElementById('adventurePlayerMaxHp').textContent = Character.maxHealth;
        const hpPercent = (Character.currentHealth / Character.maxHealth) * 100;
        const hpBar = document.getElementById('adventurePlayerHpBar');
        hpBar.style.width = hpPercent + '%';
        if (!this.isDead) {
            hpBar.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
            hpBar.style.filter = 'none';
        }
    },
    
    updateUI() {
        this.updatePlayerUI();
        this.updateAreaSelect();
        const btn = document.getElementById('autoFightBtn');
        if (this.isAutoFighting) {
            btn.textContent = '||';
            btn.classList.add('active');
        } else {
            btn.textContent = '>';
            btn.classList.remove('active');
        }
    },
    
    updateAreaSelect() {
        const select = document.getElementById('adventureAreaSelect');
        if (!select) return;

        const currentArea = this.currentAreaId;
        select.innerHTML = '';
        Areas.areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area.id;
            option.textContent = `${area.name} (Lv.${area.level})`;
            option.disabled = !area.isUnlocked;
            select.appendChild(option);
        });

        select.value = currentArea;
    },
    
    addLog(message, color = '#ccc') {
        Log.add(message);
    }
};
