const Combat = {
    isInCombat: false,
    currentMonster: null,
    currentMonsterType: null,
    combatLog: [],
    isSweeping: false,
    sweepInterval: null,
    
    // 战斗属性
    combatTurnCount: 0,
    
    // 开始战斗
    startCombat(monster, monsterType) {
        if (this.isInCombat) return false;
        
        if (Character.isDead()) {
            Log.add('⚠️ 请回满血量后战斗');
            return false;
        }
        
        this.isInCombat = true;
        this.currentMonster = monster;
        this.currentMonsterType = monsterType;
        this.combatLog = [];
        this.combatTurnCount = 0;
        
        // 城堡地区精英怪物
        const currentArea = Areas.getCurrentArea();
        if (currentArea && currentArea.id === 'castle' && !monster.isBoss) {
            if (Math.random() < 0.4) {
                monster.name = `精英 ${monster.name}`;
                monster.health = Math.floor(monster.health * 1.8);
                monster.maxHealth = monster.health;
                monster.attack = Math.floor(monster.attack * 1.8);
                monster.defense = Math.floor(monster.defense * 1.8);
                monster.experience = Math.floor(monster.experience * 2);
                this.log(`⚠️ 遭遇精英怪物！`);
            }
        }
        
        this.log(`战斗开始！面对 ${monster.name}`);
        
        // 战斗循环
        this.startCombatLoop();
        
        return true;
    },
    
    // 战斗循环
    startCombatLoop() {
        const combatInterval = setInterval(() => {
            if (!this.isInCombat) {
                clearInterval(combatInterval);
                return;
            }
            
            this.combatTurnCount++;
            
            // 玩家回合
            this.playerTurn();
            
            // 更新战斗面板
            if (this.currentMonsterType) {
                document.getElementById(`combatMonsterHealth_${this.currentMonsterType}`).textContent = this.currentMonster.health;
                document.getElementById(`combatCharacterHealth_${this.currentMonsterType}`).textContent = Character.currentHealth;
            }
            
            // 同步更新角色信息面板
            RPGUI.updateCharacterInfo();
            
            if (this.currentMonster.health <= 0) {
                this.endCombat(true);
                clearInterval(combatInterval);
                return;
            }
            
            // 怪物回合
            this.monsterTurn();
            
            // 更新战斗面板
            if (this.currentMonsterType) {
                document.getElementById(`combatCharacterHealth_${this.currentMonsterType}`).textContent = Character.currentHealth;
            }
            
            // 同步更新角色信息面板
            RPGUI.updateCharacterInfo();
            
            if (Character.isDead()) {
                this.endCombat(false);
                clearInterval(combatInterval);
                return;
            }
        }, 1000);
    },
    
    // 玩家回合
    playerTurn() {
        // 检查技能冷却
        Object.values(Character.skills).forEach(skill => {
            if (skill.cooldown > 0) {
                skill.cooldown--;
            }
        });
        
        // 使用技能（这里简单实现，实际可以让玩家选择）
        if (Character.skills.powerStrike.level > 0 && Character.skills.powerStrike.cooldown === 0) {
            this.useSkill('powerStrike');
        } else {
            this.basicAttack();
        }
    },
    
    // 基础攻击
    basicAttack() {
        // 计算基础伤害
        let damage = Character.attack;
        
        // 怪物伤害加成
        if (Character.monsterDamage > 0) {
            damage = Math.floor(damage * (1 + Character.monsterDamage / 100));
        }
        
        // 暴击检查
        if (Math.random() * 100 < Character.criticalChance) {
            damage = Math.floor(damage * (Character.criticalDamage / 100));
            this.log(`💥 暴击！造成 ${damage} 点伤害`);
        } else {
            this.log(`造成 ${damage} 点伤害`);
        }
        
        this.currentMonster.health = Math.max(0, this.currentMonster.health - damage);
    },
    
    // 使用技能
    useSkill(skillName) {
        const skill = Character.skills[skillName];
        if (!skill || skill.cooldown > 0 || skill.level === 0) return;
        
        skill.cooldown = skill === Character.skills.basicAttack ? 0 : 
                        skill === Character.skills.powerStrike ? 3 : 
                        skill === Character.skills.healingPotion ? 5 : 0;
        
        if (skillName === 'powerStrike') {
            let damage = Math.floor(Character.attack * 1.5);
            
            // 怪物伤害加成
            if (Character.monsterDamage > 0) {
                damage = Math.floor(damage * (1 + Character.monsterDamage / 100));
            }
            
            this.currentMonster.health = Math.max(0, this.currentMonster.health - damage);
            this.log(`🔥 强力攻击！造成 ${damage} 点伤害`);
        } else if (skillName === 'healingPotion') {
            const healAmount = Math.floor(Character.maxHealth * 0.3);
            Character.heal(healAmount);
            this.log(`💖 治疗 ${healAmount} 点生命值`);
        }
    },
    
    // 怪物回合
    monsterTurn() {
        if (Math.random() * 100 < Character.dodge) {
            this.log(`✅ 闪避了攻击！`);
            return;
        }
        
        let damage = Math.max(1, this.currentMonster.attack - Character.defense);
        
        // 城堡Boss技能：每3回合强力攻击
        if (this.currentMonster.isBoss && this.currentMonster.name.includes('魔王')) {
            if (this.combatTurnCount % 3 === 0) {
                damage = Math.floor(damage * 1.5);
                this.log(`💀 魔王释放毁灭之击！`);
            }
        }
        
        Character.takeDamage(damage);
        
        this.log(`🐉 ${this.currentMonster.name} 造成 ${damage} 点伤害`);
    },
    
    // 结束战斗
    endCombat(victory) {
        this.isInCombat = false;
        
        if (this.isSweeping) {
            this.endSweepCombat(victory);
            return;
        }
        
        if (victory) {
            const monster = this.currentMonster;
            const monsterType = this.currentMonsterType;
            const exp = monster.experience;
            const gold = monster.gold;
            
            Character.gainExperience(exp);
            State.coins = Math.min(State.coins + gold, Config.MAX_COINS);
            
            if (monster.drops && monster.drops.length > 0) {
                monster.drops.forEach(drop => {
                    if (Math.random() < drop.chance) {
                        const dropType = ItemTypeMap[drop.name];
                        if (dropType && Backpack.canAddItem(dropType, 1)) {
                            Backpack.addResource(dropType, 1);
                            Log.add(`获得掉落物：${drop.name}`);
                        } else if (dropType) {
                            Log.add(`获得掉落物：${drop.name}，但背包已满`);
                        }
                    }
                });
            }
            
            Log.add(`击败了 ${monster.name}`);
            State.monsterKillCount++;
            
            const currentArea = Areas.getCurrentArea();
            if (currentArea) {
                if (monster.isBoss) {
                    if (Math.random() < 0.05) {
                        const equipment = Equipment.generateSetEquipment(currentArea.id);
                        if (equipment) {
                            if (State.equipmentBackpack.length < Config.MAX_EQUIPMENT) {
                                State.equipmentBackpack.push(equipment);
                                Log.add(`🎉 Boss掉落了 ${equipment.name}！`);
                            } else {
                                Log.add(`获得了 ${equipment.name}，但装备背包已满`);
                            }
                        }
                    }
                    if (!State.bossKillCount[currentArea.id]) {
                        State.bossKillCount[currentArea.id] = 0;
                    }
                    State.bossKillCount[currentArea.id]++;
                    State.bossDefeated[currentArea.id] = false;
                    Log.add(`🏆 击败了Boss！该地区怪物重新刷新！`);
                    State.defeatedMonsters[currentArea.id] = [];
                    State.areaKillCount[currentArea.id] = 0;
                } else {
                    if (!State.defeatedMonsters[currentArea.id]) {
                        State.defeatedMonsters[currentArea.id] = [];
                    }
                    if (!State.defeatedMonsters[currentArea.id].includes(monsterType)) {
                        State.defeatedMonsters[currentArea.id].push(monsterType);
                    }
                    
                    if (!State.areaKillCount[currentArea.id]) {
                        State.areaKillCount[currentArea.id] = 0;
                    }
                    State.areaKillCount[currentArea.id]++;
                    
                    if (State.areaKillCount[currentArea.id] >= 3 && !State.bossDefeated[currentArea.id]) {
                        Log.add(`⚠️ Boss出现了！`);
                    }
                    
                    const allDefeated = currentArea.monsters.every(m => 
                        State.defeatedMonsters[currentArea.id].includes(m)
                    );
                    
                    if (allDefeated) {
                        State.defeatedMonsters[currentArea.id] = [];
                        Log.add(`该地区的怪物已全部击败，怪物重新刷新！`);
                    }
                }
                
                RPGUI.renderAreaMonsters();
            }
            
            this.log(`🏆 战斗胜利！获得 ${exp} 经验和 ${gold} 金币`);
            Achievement.render();
            RPGUI.renderAreaMonsters();
        } else {
            this.log(`💀 战斗失败！`);
            const goldLoss = Math.floor(State.coins * 0.1);
            State.coins = Math.max(0, State.coins - goldLoss);
            Log.add(`损失了 ${goldLoss} 金币，请使用道具恢复血量后继续战斗`);
        }
        
        this.currentMonster = null;
        this.currentMonsterType = null;
        this.combatLog = [];
        
        UI.update();
    },
    
    // 记录战斗日志
    log(message) {
        this.combatLog.push(message);
        if (this.combatLog.length > 20) {
            this.combatLog.shift();
        }
        
        // 将战斗记录保存到主日志
        Log.add(message);
        
        // 更新战斗日志UI
        this.updateCombatLog();
    },
    
    // 更新战斗日志
    updateCombatLog() {
        const combatLogElement = this.currentMonsterType ? 
            document.getElementById(`combatLog_${this.currentMonsterType}`) : 
            document.getElementById('combatLog');
        
        if (combatLogElement) {
            let html = '';
            this.combatLog.forEach(message => {
                html += `<p>${message}</p>`;
            });
            combatLogElement.innerHTML = html;
        }
    },
    
    // 逃跑
    flee() {
        if (!this.isInCombat) return false;
        
        if (Math.random() < 0.7) {
            this.log(`🏃 成功逃跑！`);
            this.isInCombat = false;
            this.currentMonster = null;
            this.combatLog = [];
            return true;
        } else {
            this.log(`❌ 逃跑失败！`);
            return false;
        }
    },
    
    startSweep() {
        if (this.isSweeping || this.isInCombat) return;
        
        if (Character.isDead()) {
            Log.add('⚠️ 请回满血量后战斗');
            return;
        }
        
        const currentArea = Areas.getCurrentArea();
        if (!currentArea || !currentArea.monsters || currentArea.monsters.length === 0) {
            Log.add('该地区没有怪物可以扫荡');
            return;
        }
        
        this.isSweeping = true;
        Log.add('开始扫荡该地区怪物...');
        this.updateSweepButton();
        this.sweepNextMonster();
    },
    
    stopSweep() {
        this.isSweeping = false;
        if (this.sweepInterval) {
            clearTimeout(this.sweepInterval);
            this.sweepInterval = null;
        }
        this.isInCombat = false;
        if (this.currentMonsterType) {
            RPGUI.hideCombatPanel(this.currentMonsterType);
        }
        Log.add('停止扫荡');
        this.updateSweepButton();
    },
    
    sweepNextMonster() {
        if (!this.isSweeping) return;
        
        if (Character.isDead()) {
            Log.add('角色已死亡，停止扫荡，请使用道具恢复血量后继续');
            this.stopSweep();
            return;
        }
        
        const currentArea = Areas.getCurrentArea();
        if (!currentArea) {
            this.stopSweep();
            return;
        }
        
        const areaKillCount = State.areaKillCount[currentArea.id] || 0;
        const bossDefeated = State.bossDefeated[currentArea.id] || false;
        const showBoss = areaKillCount >= 3 && !bossDefeated;
        
        let monsterType;
        let baseMonster;
        
        if (showBoss) {
            monsterType = `${currentArea.id}_boss`;
            baseMonster = Monsters.getMonsterInfo(monsterType);
            if (!baseMonster) {
                this.stopSweep();
                return;
            }
        } else {
            const defeatedInArea = State.defeatedMonsters[currentArea.id] || [];
            const availableMonsters = currentArea.monsters.filter(m => !defeatedInArea.includes(m));
            
            if (availableMonsters.length === 0) {
                State.defeatedMonsters[currentArea.id] = [];
                Log.add('该地区怪物已全部击败，重新刷新继续扫荡...');
                RPGUI.renderAreaMonsters();
                this.sweepInterval = setTimeout(() => this.sweepNextMonster(), 1000);
                return;
            }
            
            monsterType = availableMonsters[0];
            baseMonster = Monsters.getMonsterInfo(monsterType);
            if (!baseMonster) {
                this.stopSweep();
                return;
            }
        }
        
        const monster = JSON.parse(JSON.stringify(baseMonster));
        const levelAdjustment = currentArea.level / monster.level;
        if (levelAdjustment > 1) {
            monster.health = Math.floor(monster.health * levelAdjustment);
            monster.attack = Math.floor(monster.attack * levelAdjustment);
            monster.defense = Math.floor(monster.defense * levelAdjustment);
            monster.experience = Math.floor(monster.experience * levelAdjustment);
            monster.gold = Math.floor(monster.gold * levelAdjustment);
        }
        
        // 城堡地区精英怪物
        if (currentArea.id === 'castle' && !monster.isBoss) {
            if (Math.random() < 0.4) {
                monster.name = `精英 ${monster.name}`;
                monster.health = Math.floor(monster.health * 1.8);
                monster.maxHealth = monster.health;
                monster.attack = Math.floor(monster.attack * 1.8);
                monster.defense = Math.floor(monster.defense * 1.8);
                monster.experience = Math.floor(monster.experience * 2);
                Log.add(`⚠️ 遭遇精英怪物！`);
            }
        }
        
        this.currentMonster = monster;
        this.currentMonsterType = monsterType;
        this.isInCombat = true;
        this.combatLog = [];
        this.combatTurnCount = 0;
        
        RPGUI.renderAreaMonsters();
        
        setTimeout(() => {
            RPGUI.showCombatPanel(monsterType);
            RPGUI.updateCombatPanel(monster, monsterType);
            this.log(`战斗开始！面对 ${monster.name}`);
            this.startCombatLoop();
        }, 50);
    },
    
    endSweepCombat(victory) {
        this.isInCombat = false;
        
        if (victory) {
            const monster = this.currentMonster;
            const monsterType = this.currentMonsterType;
            const exp = monster.experience;
            const gold = monster.gold;
            
            Character.gainExperience(exp);
            State.coins = Math.min(State.coins + gold, Config.MAX_COINS);
            
            if (monster.drops && monster.drops.length > 0) {
                monster.drops.forEach(drop => {
                    if (Math.random() < drop.chance) {
                        const dropType = ItemTypeMap[drop.name];
                        if (dropType) {
                            if (Backpack.canAddItem(dropType, 1)) {
                                Backpack.addResource(dropType, 1);
                                Log.add(`获得掉落物：${drop.name}`);
                            } else {
                                Log.add(`获得掉落物：${drop.name}，但背包已满`);
                            }
                        }
                    }
                });
            }
            
            Log.add(`击败了 ${monster.name}`);
            State.monsterKillCount++;
            
            const currentArea = Areas.getCurrentArea();
            if (currentArea) {
                if (monster.isBoss) {
                    if (Math.random() < 0.05) {
                        const equipment = Equipment.generateSetEquipment(currentArea.id);
                        if (equipment) {
                            if (State.equipmentBackpack.length < Config.MAX_EQUIPMENT) {
                                State.equipmentBackpack.push(equipment);
                                Log.add(`🎉 Boss掉落了 ${equipment.name}！`);
                            } else {
                                Log.add(`获得了 ${equipment.name}，但装备背包已满`);
                            }
                        }
                    }
                    if (!State.bossKillCount[currentArea.id]) {
                        State.bossKillCount[currentArea.id] = 0;
                    }
                    State.bossKillCount[currentArea.id]++;
                    State.bossDefeated[currentArea.id] = false;
                    Log.add(`🏆 击败了Boss！该地区怪物重新刷新！`);
                    State.defeatedMonsters[currentArea.id] = [];
                    State.areaKillCount[currentArea.id] = 0;
                } else {
                    if (!State.defeatedMonsters[currentArea.id]) {
                        State.defeatedMonsters[currentArea.id] = [];
                    }
                    if (!State.defeatedMonsters[currentArea.id].includes(monsterType)) {
                        State.defeatedMonsters[currentArea.id].push(monsterType);
                    }
                    
                    if (!State.areaKillCount[currentArea.id]) {
                        State.areaKillCount[currentArea.id] = 0;
                    }
                    State.areaKillCount[currentArea.id]++;
                    
                    const allDefeated = currentArea.monsters.every(m => 
                        State.defeatedMonsters[currentArea.id].includes(m)
                    );
                    
                    if (allDefeated) {
                        State.defeatedMonsters[currentArea.id] = [];
                    }
                }
            }
            
            this.currentMonster = null;
            this.currentMonsterType = null;
            
            Settings.checkAutoHeal();
            
            UI.update();
            Achievement.render();
            RPGUI.renderAreaMonsters();
            
            this.sweepInterval = setTimeout(() => this.sweepNextMonster(), 1000);
        } else {
            Log.add(`扫荡失败，角色死亡，请使用道具恢复血量后继续战斗`);
            this.stopSweep();
            UI.update();
        }
    },
    
    updateSweepButton() {
        const btn = document.getElementById('sweepBtn');
        if (btn) {
            if (this.isSweeping) {
                btn.textContent = '停止扫荡';
                btn.style.background = '#f44336';
            } else {
                btn.textContent = '扫荡';
                btn.style.background = '#4CAF50';
            }
        }
    }
};
