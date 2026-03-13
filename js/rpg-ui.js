const RPGUI = {
    // 初始化RPG界面
    init() {
        // 面板已在HTML中定义
    },

    
    // 更新角色信息
    updateCharacterInfo() {
        const info = Character.getInfo();
        
        if (document.getElementById('characterLevel')) {
            document.getElementById('characterLevel').textContent = info.level;
            document.getElementById('characterExp').textContent = info.experience;
            document.getElementById('characterExpToNext').textContent = info.experienceToNext;
            document.getElementById('characterHealth').textContent = info.currentHealth;
            document.getElementById('characterMaxHealth').textContent = info.maxHealth;
            document.getElementById('characterDefense').textContent = info.defense;
            document.getElementById('characterAttack').textContent = info.attack;
            document.getElementById('characterCritical').textContent = `${info.criticalChance}%`;
            document.getElementById('characterCriticalDamage').textContent = `${info.criticalDamage}%`;
            document.getElementById('characterMonsterDamage').textContent = `${info.monsterDamage}%`;
            document.getElementById('characterDodge').textContent = `${info.dodge}%`;
            document.getElementById('dullPearlCount').textContent = State.dullPearls;
        }
        
        if (document.getElementById('combatCharacterHealth')) {
            document.getElementById('combatCharacterHealth').textContent = info.currentHealth;
            document.getElementById('combatCharacterMaxHealth').textContent = info.maxHealth;
        }
    },
    
    // 更新装备信息
    updateEquipment() {
        const equipment = Character.equipment;
        
        Object.keys(equipment).forEach(slot => {
            const element = document.getElementById(`${slot}Slot`);
            if (element) {
                if (equipment[slot]) {
                    const item = equipment[slot];
                    const qualityColor = Equipment.getQualityColor(item.quality);
                    const canRefine = Equipment.canRefine(item);
                    const refineBtn = canRefine ? 
                        `<button class="use-btn" style="margin-top: 4px; background-color: #9c27b0;" onclick="RPGUI.showRefineModalForEquipped('${slot}')">精炼</button>` : '';
                    
                    let statsHtml = '';
                    if (item.health) statsHtml += `生命: +${item.health}<br>`;
                    if (item.defense) statsHtml += `防御: +${item.defense}<br>`;
                    if (item.attack) statsHtml += `攻击: +${item.attack}<br>`;
                    if (item.criticalChance) statsHtml += `暴击率: +${item.criticalChance}%<br>`;
                    if (item.criticalDamage) statsHtml += `暴击伤害: +${item.criticalDamage}%<br>`;
                    if (item.monsterDamage) statsHtml += `怪物伤害: +${item.monsterDamage}%<br>`;
                    if (item.dodge) statsHtml += `闪避: +${item.dodge}%<br>`;
                    if (item.durability) statsHtml += `耐久: ${item.durability}<br>`;
                    
                    element.innerHTML = `
                        <div style="color: ${qualityColor};">${item.name}</div>
                        <div style="font-size: 12px; margin-top: 4px;">
                            ${statsHtml}
                        </div>
                        <button class="use-btn" style="margin-top: 8px;" onclick="RPGUI.unequipItem('${slot}')">取下</button>
                        ${refineBtn}
                    `;
                } else {
                    element.innerHTML = '<span>未装备</span>';
                }
            }
        });
        
        this.updateSetBonusDisplay();
    },
    
    updateSetBonusDisplay() {
        const setCounts = {};
        Object.values(Character.equipment).forEach(item => {
            if (item && item.setName) {
                setCounts[item.setName] = (setCounts[item.setName] || 0) + 1;
            }
        });
        
        let setBonusHtml = '';
        Object.entries(setCounts).forEach(([setName, count]) => {
            const bonus = Equipment.setBonuses[setName];
            if (bonus) {
                const pieces2Active = count >= 2;
                const pieces4Active = count >= 4;
                setBonusHtml += `
                    <div style="margin-top: 8px; padding: 8px; border: 1px solid ${pieces4Active ? '#4169E1' : pieces2Active ? '#4CAF50' : '#666'}; border-radius: 4px;">
                        <div style="color: #4169E1; font-weight: bold;">${setName} (${count}/5)</div>
                        <div style="font-size: 11px; color: ${pieces2Active ? '#4CAF50' : '#666'};">
                            (2) ${this.formatSetBonus(bonus.pieces2)} ${pieces2Active ? '✓' : ''}
                        </div>
                        <div style="font-size: 11px; color: ${pieces4Active ? '#4169E1' : '#666'};">
                            (4) ${this.formatSetBonus(bonus.pieces4)} ${pieces4Active ? '✓' : ''}
                        </div>
                    </div>
                `;
            }
        });
        
        let setBonusContainer = document.getElementById('setBonusDisplay');
        if (!setBonusContainer) {
            const equipmentPane = document.getElementById('equipmentPane');
            if (equipmentPane) {
                setBonusContainer = document.createElement('div');
                setBonusContainer.id = 'setBonusDisplay';
                setBonusContainer.style.marginTop = '16px';
                equipmentPane.appendChild(setBonusContainer);
            }
        }
        
        if (setBonusContainer) {
            setBonusContainer.innerHTML = setBonusHtml ? `<h4>套装效果</h4>${setBonusHtml}` : '';
        }
    },
    
    formatSetBonus(bonus) {
        if (!bonus) return '';
        const parts = [];
        if (bonus.health) parts.push(`生命+${bonus.health}`);
        if (bonus.defense) parts.push(`防御+${bonus.defense}`);
        if (bonus.defensePercent) parts.push(`防御+${bonus.defensePercent}%`);
        if (bonus.attack) parts.push(`攻击+${bonus.attack}`);
        if (bonus.criticalChance) parts.push(`暴击率+${bonus.criticalChance}%`);
        if (bonus.criticalDamage) parts.push(`暴击伤害+${bonus.criticalDamage}%`);
        if (bonus.monsterDamage) parts.push(`怪物伤害+${bonus.monsterDamage}%`);
        if (bonus.dodge) parts.push(`闪避+${bonus.dodge}%`);
        return parts.join(', ');
    },
    
    // 更新地区列表
    updateAreaList() {
        const areaList = document.getElementById('areaList');
        if (!areaList) return;
        
        let html = '';
        Areas.getAreas().forEach(area => {
            const isUnlocked = area.isUnlocked;
            html += `
                <div style="padding: 8px; margin-bottom: 8px; border: 1px solid ${isUnlocked ? '#4CAF50' : '#ccc'}; border-radius: 4px;">
                    <h4>${area.name} ${isUnlocked ? '🔓' : '🔒'}</h4>
                    <p>${area.description}</p>
                    <div>推荐等级: ${area.requiredLevel}</div>
                    ${isUnlocked ? 
                        `<button class="action-btn" style="margin-top: 8px;" onclick="Areas.switchArea('${area.id}')">前往</button>` : 
                        `<div style="color: #999; margin-top: 8px;">需要完成特定成就</div>`
                    }
                </div>
            `;
        });
        
        areaList.innerHTML = html;
    },
    
    // 更新战斗面板
    updateCombatPanel(monster, monsterType) {
        if (!monster || !monsterType) return;
        
        document.getElementById(`combatMonsterName_${monsterType}`).textContent = monster.name;
        document.getElementById(`combatMonsterHealth_${monsterType}`).textContent = monster.health;
        document.getElementById(`combatMonsterMaxHealth_${monsterType}`).textContent = monster.health;
        
        // 更新角色信息
        const info = Character.getInfo();
        document.getElementById(`combatCharacterHealth_${monsterType}`).textContent = info.currentHealth;
        document.getElementById(`combatCharacterMaxHealth_${monsterType}`).textContent = info.maxHealth;
    },
    
    // 显示战斗面板
    showCombatPanel(monsterType) {
        if (monsterType) {
            document.getElementById(`combatContainer_${monsterType}`).style.display = 'block';
        } else {
            document.getElementById('combatContainer').style.display = 'block';
        }
    },
    
    // 隐藏战斗面板
    hideCombatPanel(monsterType) {
        if (monsterType) {
            document.getElementById(`combatContainer_${monsterType}`).style.display = 'none';
        } else {
            document.getElementById('combatContainer').style.display = 'none';
        }
    },
    
    currentRefineTarget: null,
    currentRefineType: null,
    
    showRefineModalForEquipped(slot) {
        const item = Character.equipment[slot];
        if (!item) return;
        this.currentRefineTarget = slot;
        this.currentRefineType = 'equipped';
        this.showRefineModal(item);
    },
    
    showRefineModalForBackpack(index) {
        const item = State.equipmentBackpack[index];
        if (!item) return;
        this.currentRefineTarget = index;
        this.currentRefineType = 'backpack';
        this.showRefineModal(item);
    },
    
    showRefineModal(item) {
        if (!item) return;
        
        const cost = Equipment.getRefineCost(item);
        const successRate = Math.round(Equipment.getRefineSuccessRate(item) * 100);
        const qualityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        const currentIndex = qualityOrder.indexOf(item.quality);
        const nextQuality = qualityOrder[currentIndex + 1];
        const nextQualityName = Equipment.qualities[nextQuality]?.name || '未知';
        const nextQualityColor = Equipment.getQualityColor(nextQuality);
        
        document.getElementById('refineItemName').textContent = item.name;
        document.getElementById('refineItemName').style.color = Equipment.getQualityColor(item.quality);
        
        let stats = '';
        if (item.attack > 0) stats += `攻击: +${item.attack} `;
        if (item.defense > 0) stats += `防御: +${item.defense} `;
        if (item.agility > 0) stats += `敏捷: +${item.agility} `;
        document.getElementById('refineItemStats').textContent = stats;
        
        document.getElementById('refineTargetQuality').textContent = nextQualityName;
        document.getElementById('refineTargetQuality').style.color = nextQualityColor;
        document.getElementById('refineCost').textContent = `${cost} 个暗淡的珍珠 (当前: ${State.dullPearls})`;
        document.getElementById('refineSuccessRate').textContent = `${successRate}%`;
        
        const confirmBtn = document.getElementById('refineConfirmBtn');
        if (State.dullPearls < cost) {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            confirmBtn.textContent = '材料不足';
        } else {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
            confirmBtn.textContent = '精炼';
        }
        
        document.getElementById('refineModal').style.display = 'block';
    },
    
    closeRefineModal() {
        document.getElementById('refineModal').style.display = 'none';
        this.currentRefineTarget = null;
        this.currentRefineType = null;
    },
    
    confirmRefine() {
        if (this.currentRefineTarget === null) return;
        
        let result;
        if (this.currentRefineType === 'equipped') {
            const item = Character.equipment[this.currentRefineTarget];
            const cost = Equipment.getRefineCost(item);
            if (State.dullPearls < cost) {
                alert('材料不足');
                return;
            }
            State.dullPearls -= cost;
            const success = Math.random() < Equipment.getRefineSuccessRate(item);
            
            if (success) {
                const qualityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
                const currentIndex = qualityOrder.indexOf(item.quality);
                const newQuality = qualityOrder[currentIndex + 1];
                const qualityData = Equipment.qualities[newQuality];
                
                item.quality = newQuality;
                item.name = item.name.replace(/^(普通|优秀|稀有|史诗|传说)\s*/, qualityData.name + ' ');
                if (item.attack) item.attack = Math.floor(item.attack * 1.3);
                if (item.defense) item.defense = Math.floor(item.defense * 1.3);
                if (item.agility) item.agility = Math.floor(item.agility * 1.3);
                if (item.intelligence) item.intelligence = Math.floor(item.intelligence * 1.3);
                if (item.vitality) item.vitality = Math.floor(item.vitality * 1.3);
                item.value = Math.floor(item.value * 1.5);
                
                Log.add(`精炼成功！装备品质提升为${qualityData.name}`);
                result = { success: true, message: `精炼成功！装备品质提升为${qualityData.name}` };
            } else {
                Log.add(`精炼失败！消耗了 ${cost} 个暗淡的珍珠`);
                result = { success: false, message: '精炼失败，材料已消耗' };
            }
        } else {
            result = Equipment.refine(this.currentRefineTarget);
        }
        
        this.closeRefineModal();
        alert(result.message);
        Character.calculateStats();
        UI.update();
        Save.auto();
    },
    
    bindEvents() {
        // 装备标签页
        document.getElementById('tabEquipment').addEventListener('click', (e) => {
            e.preventDefault();
            UI.hideAllMainPanes();
            document.getElementById('equipmentPane').style.display = 'block';
            
            // 切换到角色页面
            document.getElementById('backpackTab').classList.remove('active');
            document.getElementById('characterTab').classList.add('active');
            document.getElementById('backpackContent').style.display = 'none';
            document.getElementById('characterContent').style.display = 'block';
        });
        
        // 冒险标签页
        document.getElementById('tabCombat').addEventListener('click', (e) => {
            e.preventDefault();
            UI.hideAllMainPanes();
            document.getElementById('combatPane').style.display = 'block';
            this.updateCurrentAreaInfo();
        });
        
        // 地区标签页
        document.getElementById('tabAreas').addEventListener('click', (e) => {
            e.preventDefault();
            UI.hideAllMainPanes();
            document.getElementById('areaPane').style.display = 'block';
            this.updateAreaList();
        });
        
        // 集市子标签页
        document.getElementById('generalShopTab').addEventListener('click', () => {
            document.getElementById('generalShopTab').classList.add('active');
            document.getElementById('blacksmithTab').classList.remove('active');
            document.getElementById('fruitShopTab').classList.remove('active');
            document.getElementById('generalShopContent').style.display = 'block';
            document.getElementById('blacksmithContent').style.display = 'none';
            document.getElementById('fruitShopContent').style.display = 'none';
        });
        
        document.getElementById('blacksmithTab').addEventListener('click', () => {
            document.getElementById('blacksmithTab').classList.add('active');
            document.getElementById('generalShopTab').classList.remove('active');
            document.getElementById('fruitShopTab').classList.remove('active');
            document.getElementById('blacksmithContent').style.display = 'block';
            document.getElementById('generalShopContent').style.display = 'none';
            document.getElementById('fruitShopContent').style.display = 'none';
        });
        
        document.getElementById('fruitShopTab').addEventListener('click', () => {
            document.getElementById('fruitShopTab').classList.add('active');
            document.getElementById('generalShopTab').classList.remove('active');
            document.getElementById('blacksmithTab').classList.remove('active');
            document.getElementById('fruitShopContent').style.display = 'block';
            document.getElementById('generalShopContent').style.display = 'none';
            document.getElementById('blacksmithContent').style.display = 'none';
        });
        


    },
    
    // 更新当前地区信息
    updateCurrentAreaInfo() {
        const area = Areas.getCurrentArea();
        if (area) {
            // 渲染地区怪物列表
            this.renderAreaMonsters();
        }
    },
    
    // 探索 - 展示该地区所有怪物
    explore() {
        const area = Areas.getCurrentArea();
        if (!area) return;
        
        this.renderAreaMonsters();
    },
    
    // 渲染地区怪物列表
    renderAreaMonsters() {
        console.log('renderAreaMonsters called');
        const area = Areas.getCurrentArea();
        console.log('Current area:', area);
        if (!area) return;
        
        const combatPane = document.getElementById('combatPane');
        console.log('Combat pane:', combatPane);
        if (!combatPane) return;
        
        // 清空现有的内容，保留 combatContainer
        // 检查是否击败过Boss，显示前往下一地区按钮
        const bossKillCount = State.bossKillCount[area.id] || 0;
        const currentIndex = Areas.areas.findIndex(a => a.id === area.id);
        let nextAreaBtnHtml = '';
        if (bossKillCount > 0 && currentIndex < Areas.areas.length - 1) {
            const nextArea = Areas.areas[currentIndex + 1];
            nextAreaBtnHtml = `<button class="action-btn" id="nextAreaBtn" style="background: #FF9800; padding: 4px 12px; font-size: 12px;">前往${nextArea.name}</button>`;
        }
        
        let html = `
            <h3>⚔️ 冒险</h3>
            <div style="margin-top: 16px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 id="currentAreaName" style="margin: 0;">${area.name}</h4>
                    <p id="currentAreaDesc" style="margin: 4px 0 0 0;">${area.description}</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button id="sweepBtn" class="action-btn" style="background: #4CAF50; padding: 4px 12px; font-size: 12px;">扫荡</button>
                    ${nextAreaBtnHtml}
                </div>
            </div>
            <div style="margin-top: 16px;">
                <h4>该地区的怪物</h4>
                <div id="monsterList" style="margin-top: 8px;">
        `;
        
        // 检查该地区是否有已击败的怪物
        const defeatedInArea = State.defeatedMonsters[area.id] || [];
        const areaKillCount = State.areaKillCount[area.id] || 0;
        const bossDefeated = State.bossDefeated[area.id] || false;
        const showBoss = areaKillCount >= 3 && !bossDefeated;
        
        // 生成该地区的所有怪物
        if (area.monsters && area.monsters.length > 0) {
            let hasMonsters = false;
            
            if (showBoss) {
                const bossType = `${area.id}_boss`;
                const baseBoss = Monsters.getMonsterInfo(bossType);
                if (baseBoss) {
                    hasMonsters = true;
                    const levelAdjustment = area.level / baseBoss.level;
                    const adjustedHealth = levelAdjustment > 1 ? Math.floor(baseBoss.health * levelAdjustment) : baseBoss.health;
                    
                    let dropsText = '';
                    if (baseBoss.drops && baseBoss.drops.length > 0) {
                        const dropStrings = baseBoss.drops.map(d => `${d.name}(${Math.round(d.chance * 100)}%)`);
                        dropsText = `<div style="color: #FF5722;">掉落: ${dropStrings.join(', ')}</div>`;
                    }
                    
                    html += `
                        <div style="padding: 8px; margin-bottom: 8px; border: 2px solid #FF5722; border-radius: 4px; background: #fff3e0;">
                            <h5 style="color: #FF5722;">👑 ${baseBoss.name}</h5>
                            <div>等级: ${baseBoss.level}</div>
                            <div>生命值: ${adjustedHealth}</div>
                            <div>攻击力: ${baseBoss.attack}</div>
                            <div>防御力: ${baseBoss.defense}</div>
                            <div style="color: #4CAF50;">经验: ${baseBoss.experience} | 金币: ${baseBoss.gold}</div>
                            ${dropsText}
                            <div style="color: #FF5722; font-size: 12px; margin-top: 4px;">装备掉落率: 5%</div>
                            <button class="action-btn challenge-btn" style="margin-top: 8px; background: #FF5722;" data-monster-type="${bossType}">挑战Boss</button>
                            <div id="combatContainer_${bossType}" style="margin-top: 16px; display: none;">
                                <h4>战斗</h4>
                                <div style="display: flex; gap: 16px;">
                                    <div style="flex: 1;">
                                        <h5>角色</h5>
                                        <div>生命值: <span id="combatCharacterHealth_${bossType}">100</span>/<span id="combatCharacterMaxHealth_${bossType}">100</span></div>
                                    </div>
                                    <div style="flex: 1;">
                                        <h5 id="combatMonsterName_${bossType}">怪物</h5>
                                        <div>生命值: <span id="combatMonsterHealth_${bossType}">50</span>/<span id="combatMonsterMaxHealth_${bossType}">50</span></div>
                                    </div>
                                </div>
                                <div id="combatLog_${bossType}" style="margin-top: 16px; padding: 8px; background: #f0f0f0; border-radius: 4px; max-height: 200px; overflow-y: auto;"></div>
                            </div>
                        </div>
                    `;
                }
            } else {
                area.monsters.forEach(monsterType => {
                    if (defeatedInArea.includes(monsterType)) {
                        return;
                    }
                    
                    const baseMonster = Monsters.getMonsterInfo(monsterType);
                    if (baseMonster) {
                        hasMonsters = true;
                        const levelAdjustment = area.level / baseMonster.level;
                        const adjustedHealth = levelAdjustment > 1 ? Math.floor(baseMonster.health * levelAdjustment) : baseMonster.health;
                        
                        let dropsText = '';
                        if (baseMonster.drops && baseMonster.drops.length > 0) {
                            const dropStrings = baseMonster.drops.map(d => `${d.name}(${Math.round(d.chance * 100)}%)`);
                            dropsText = `<div style="color: #2196F3;">掉落: ${dropStrings.join(', ')}</div>`;
                        }
                        
                        html += `
                            <div style="padding: 8px; margin-bottom: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <h5>${baseMonster.name}</h5>
                                <div>等级: ${baseMonster.level}</div>
                                <div>生命值: ${adjustedHealth}</div>
                                <div>攻击力: ${baseMonster.attack}</div>
                                <div>防御力: ${baseMonster.defense}</div>
                                <div style="color: #4CAF50;">经验: ${baseMonster.experience} | 金币: ${baseMonster.gold}</div>
                                ${dropsText}
                                <button class="action-btn challenge-btn" style="margin-top: 8px;" data-monster-type="${monsterType}">挑战怪物</button>
                                <div id="combatContainer_${monsterType}" style="margin-top: 16px; display: none;">
                                    <h4>战斗</h4>
                                    <div style="display: flex; gap: 16px;">
                                        <div style="flex: 1;">
                                            <h5>角色</h5>
                                            <div>生命值: <span id="combatCharacterHealth_${monsterType}">100</span>/<span id="combatCharacterMaxHealth_${monsterType}">100</span></div>
                                        </div>
                                        <div style="flex: 1;">
                                            <h5 id="combatMonsterName_${monsterType}">怪物</h5>
                                            <div>生命值: <span id="combatMonsterHealth_${monsterType}">50</span>/<span id="combatMonsterMaxHealth_${monsterType}">50</span></div>
                                        </div>
                                    </div>
                                    <div id="combatLog_${monsterType}" style="margin-top: 16px; padding: 8px; background: #f0f0f0; border-radius: 4px; max-height: 200px; overflow-y: auto;"></div>
                                </div>
                            </div>
                        `;
                    }
                });
                
                if (!hasMonsters) {
                    html += '<div style="color: #999;">该地区的怪物已全部被击败，正在重新刷新...</div>';
                }
            }
        } else {
            html += '<div style="color: #999;">该地区暂无怪物</div>';
        }
        
        html += `
                </div>
            </div>
        `;
        
        // 保存 combatContainer 元素
        const combatContainer = document.getElementById('combatContainer');
        
        // 替换内容，保留 combatContainer
        combatPane.innerHTML = html;
        
        // 如果 combatContainer 存在，将其添加回 combatPane，放在怪物列表内部
        if (combatContainer) {
            const monsterList = document.getElementById('monsterList');
            if (monsterList) {
                monsterList.appendChild(combatContainer);
            } else {
                combatPane.appendChild(combatContainer);
            }
        }
        
        // 绑定挑战怪物按钮的点击事件
        document.querySelectorAll('.challenge-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const monsterType = e.target.dataset.monsterType;
                this.startFightWithMonster(monsterType);
            });
        });
        
        // 绑定扫荡按钮
        const sweepBtn = document.getElementById('sweepBtn');
        if (sweepBtn) {
            sweepBtn.addEventListener('click', () => {
                if (Combat.isSweeping) {
                    Combat.stopSweep();
                } else {
                    Combat.startSweep();
                }
            });
            Combat.updateSweepButton();
        }
        
        // 绑定前往下一地区按钮
        const nextAreaBtn = document.getElementById('nextAreaBtn');
        if (nextAreaBtn) {
            nextAreaBtn.addEventListener('click', () => {
                const currentArea = Areas.getCurrentArea();
                const currentIndex = Areas.areas.findIndex(a => a.id === currentArea.id);
                if (currentIndex < Areas.areas.length - 1) {
                    const nextArea = Areas.areas[currentIndex + 1];
                    nextArea.isUnlocked = true;
                    Areas.currentArea = nextArea.id;
                    State.currentRegion = nextArea.name;
                    Log.add(`已前往${nextArea.name}！`);
                    RPGUI.renderAreaMonsters();
                    RPGUI.updateAreaList();
                    UI.update();
                    Save.auto();
                }
            });
        }
    },
    
    // 开始与特定怪物的战斗
    startFightWithMonster(monsterType) {
        if (Combat.isSweeping) {
            Log.add('正在扫荡中，请先停止扫荡');
            return;
        }
        
        console.log('startFightWithMonster called with monsterType:', monsterType);
        const area = Areas.getCurrentArea();
        console.log('Current area:', area);
        if (!area) return;
        
        const baseMonster = Monsters.getMonsterInfo(monsterType);
        console.log('Base monster:', baseMonster);
        if (!baseMonster) return;
        
        // 克隆怪物对象
        const monster = JSON.parse(JSON.stringify(baseMonster));
        
        // 根据地区等级调整怪物属性
        const levelAdjustment = area.level / monster.level;
        if (levelAdjustment > 1) {
            monster.health = Math.floor(monster.health * levelAdjustment);
            monster.attack = Math.floor(monster.attack * levelAdjustment);
            monster.defense = Math.floor(monster.defense * levelAdjustment);
            monster.experience = Math.floor(monster.experience * levelAdjustment);
            monster.gold = Math.floor(monster.gold * levelAdjustment);
        }
        
        // 切换到角色页面
        document.getElementById('backpackTab').classList.remove('active');
        document.getElementById('characterTab').classList.add('active');
        document.getElementById('backpackContent').style.display = 'none';
        document.getElementById('characterContent').style.display = 'block';
        
        if (monster) {
            this.showCombatPanel(monsterType);
            this.updateCombatPanel(monster, monsterType);
            Combat.startCombat(monster, monsterType);
            
            // 监听战斗结束
            const checkCombatEnd = setInterval(() => {
                if (!Combat.isInCombat) {
                    clearInterval(checkCombatEnd);
                    this.hideCombatPanel(monsterType);
                }
            }, 1000);
        }
    },
    
    // 取下装备
    unequipItem(slot) {
        const item = Character.unequip(slot);
        if (!item) return;
        
        // 检查背包空间
        if (!Backpack.canAddItem('equipment', 1)) {
            // 背包空间不足，重新装备
            Character.equip(item);
            alert('背包空间不足，无法取下装备');
            return;
        }
        
        // 将装备添加到装备背包
        State.equipmentBackpack.push(item);
        Log.add(`取下了 ${item.name}`);
        UI.update();
        Save.auto();
    }
};
