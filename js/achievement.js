const Achievement = {
    hasEnoughItems(achievement) {
        if (achievement.itemType === 'mixed') {
            if (achievement.id === 'pond_10') {
                return State.bugs >= 50 && State.skewers >= 10;
            }
            return false;
        }
        if (achievement.itemType === 'stall') {
            return State.stallCount >= achievement.count;
        }
        if (achievement.itemType === 'usedLeaf') {
            return State.usedLeaves >= achievement.count;
        }
        if (achievement.itemType === 'shopBuy') {
            return State.shopBuyCount >= achievement.count;
        }
        if (achievement.itemType === 'usedPurse') {
            return State.backpackUpgradeCount >= achievement.count;
        }
        if (achievement.itemType === 'soldValue') {
            return State.totalSoldValue >= achievement.count;
        }
        if (achievement.itemType === 'monsterKill') {
            return State.monsterKillCount >= achievement.count;
        }
        if (achievement.itemType === 'bossKill') {
            const bossArea = achievement.bossArea;
            const killCount = State.bossKillCount[bossArea] || 0;
            return killCount >= achievement.count;
        }
        if (achievement.itemType === 'equipBugNet') {
            return Character.equipment.tool && Character.equipment.tool.name.includes('捕虫网');
        }
        let currentCount = 0;
        if (achievement.itemType === 'bug') currentCount = State.bugs;
        else if (achievement.itemType === 'leaf') currentCount = State.leaves;
        else if (achievement.itemType === 'skewer') currentCount = State.skewers;
        return currentCount >= achievement.count;
    },
    
    getCurrentCount(achievement) {
        if (achievement.itemType === 'mixed') {
            if (achievement.id === 'pond_10') {
                return `${State.bugs}/50虫子, ${State.skewers}/10虫虫串`;
            }
            return '0';
        }
        if (achievement.itemType === 'stall') {
            return State.stallCount;
        }
        if (achievement.itemType === 'usedLeaf') {
            return State.usedLeaves;
        }
        if (achievement.itemType === 'shopBuy') {
            return State.shopBuyCount;
        }
        if (achievement.itemType === 'usedPurse') {
            return State.backpackUpgradeCount;
        }
        if (achievement.itemType === 'soldValue') {
            return State.totalSoldValue;
        }
        if (achievement.itemType === 'monsterKill') {
            return State.monsterKillCount;
        }
        if (achievement.itemType === 'bossKill') {
            const bossArea = achievement.bossArea;
            return State.bossKillCount[bossArea] || 0;
        }
        if (achievement.itemType === 'equipBugNet') {
            return (Character.equipment.tool && Character.equipment.tool.name.includes('捕虫网')) ? 1 : 0;
        }
        if (achievement.itemType === 'bug') return State.bugs;
        if (achievement.itemType === 'leaf') return State.leaves;
        if (achievement.itemType === 'skewer') return State.skewers;
        return 0;
    },
    
    submit(achievementId) {
        const achievements = RegionAchievements[State.currentRegion] || [];
        const achievement = achievements.find(a => a.id === achievementId);
        if (!achievement) return;
        
        if (achievement.itemType === 'mixed') {
            if (achievement.id === 'pond_10') {
                State.bugs -= 50;
                State.skewers -= 10;
            }
        } else if (achievement.itemType === 'stall' || achievement.itemType === 'usedLeaf' || achievement.itemType === 'shopBuy' || achievement.itemType === 'usedPurse' || achievement.itemType === 'soldValue' || achievement.itemType === 'monsterKill' || achievement.itemType === 'bossKill' || achievement.itemType === 'equipBugNet') {
        } else {
            if (achievement.itemType === 'bug') State.bugs -= achievement.count;
            else if (achievement.itemType === 'leaf') State.leaves -= achievement.count;
            else if (achievement.itemType === 'skewer') State.skewers -= achievement.count;
        }
        
        State.coins = Math.min(State.coins + achievement.rewardCoins, Config.MAX_COINS);
        if (achievement.rewardItems) {
            achievement.rewardItems.forEach(item => {
                if (item.name === '荷叶') State.leaves = Math.min(State.leaves + item.count, Config.MAX_LEAVES);
                else if (item.name === '荷包') State.purses = Math.min(State.purses + item.count, Config.MAX_PURSES);
                else if (item.name === '小存钱罐') State.piggyBanks += item.count;
                else if (item.name === '虫虫串') State.skewers = Math.min(State.skewers + item.count, Config.MAX_SKEWERS);
            });
        }
        
        State.completedAchievements.push(achievementId);
        Log.add(`完成成就「${achievement.name}」，获得${achievement.rewardCoins}金币奖励！`);
        UI.update();
        this.render();
        Save.auto();
    },
    
    submitLongTerm(achievementId) {
        const achievement = LongTermAchievements.find(a => a.id === achievementId);
        if (!achievement) return;
        
        State.coins = Math.min(State.coins + achievement.rewardCoins, Config.MAX_COINS);
        if (achievement.rewardItems) {
            achievement.rewardItems.forEach(item => {
                if (item.name === '荷叶') State.leaves = Math.min(State.leaves + item.count, Config.MAX_LEAVES);
                else if (item.name === '荷包') State.purses = Math.min(State.purses + item.count, Config.MAX_PURSES);
                else if (item.name === '小存钱罐') State.piggyBanks += item.count;
                else if (item.name === '虫虫串') State.skewers = Math.min(State.skewers + item.count, Config.MAX_SKEWERS);
            });
        }
        
        State.completedLongTermAchievements.push(achievementId);
        Log.add(`完成长期成就「${achievement.name}」，获得${achievement.rewardCoins}金币奖励！`);
        UI.update();
        this.render();
        Save.auto();
    },
    
    render() {
        this.renderRegion();
        this.renderLongTerm();
        this.bindTabEvents();
    },
    
    bindTabEvents() {
        const regionTab = document.getElementById('regionAchievementTab');
        const longTermTab = document.getElementById('longTermAchievementTab');
        const regionContent = document.getElementById('regionAchievementContent');
        const longTermContent = document.getElementById('longTermAchievementContent');
        
        if (regionTab && longTermTab) {
            regionTab.onclick = () => {
                regionTab.classList.add('active');
                longTermTab.classList.remove('active');
                regionContent.style.display = 'block';
                longTermContent.style.display = 'none';
            };
            
            longTermTab.onclick = () => {
                longTermTab.classList.add('active');
                regionTab.classList.remove('active');
                longTermContent.style.display = 'block';
                regionContent.style.display = 'none';
            };
        }
    },
    
    renderRegion() {
        const achievements = RegionAchievements[State.currentRegion] || [];
        const completedCount = achievements.filter(a => State.completedAchievements.includes(a.id)).length;
        document.getElementById('achievementRegionTitle').textContent = `🏆 ${State.currentRegion}成就`;
        document.getElementById('achievementProgress').textContent = `${completedCount}/${achievements.length}`;
        
        const achievementList = document.getElementById('achievementList');
        if (achievements.length === 0) {
            achievementList.innerHTML = '<div style="color:#999; padding:8px; text-align:center;">该地区暂无成就</div>';
            return;
        }
        
        let html = '';
        achievements.forEach((achievement, index) => {
            const isCompleted = State.completedAchievements.includes(achievement.id);
            
            let itemClass = isCompleted ? 'completed' : '';
            
            let rewardText = `${achievement.rewardCoins}金币`;
            if (achievement.rewardItems && achievement.rewardItems.length > 0) {
                achievement.rewardItems.forEach(item => {
                    rewardText += ` +${item.count}${item.name}`;
                });
            }
            
            let canSubmit = !isCompleted && this.hasEnoughItems(achievement);
            let currentCount = this.getCurrentCount(achievement);
            
            let btnText = canSubmit ? '提交' : '未完成';
            
            html += `
                <div class="achievement-item ${itemClass}">
                    <div class="achievement-name">${isCompleted ? '✓' : '○'} ${achievement.name}</div>
                    <div class="achievement-desc">${achievement.desc}</div>
                    <div class="achievement-progress">进度: ${currentCount}/${achievement.count} | 奖励: ${rewardText}</div>
                    ${!isCompleted ? `<button class="achievement-submit-btn" data-id="${achievement.id}" ${!canSubmit ? 'disabled' : ''}>${btnText}</button>` : ''}
                </div>
            `;
        });
        achievementList.innerHTML = html;
        
        document.querySelectorAll('.achievement-submit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.submit(e.target.dataset.id);
            });
        });
    },
    
    renderLongTerm() {
        const completedCount = LongTermAchievements.filter(a => State.completedLongTermAchievements.includes(a.id)).length;
        document.getElementById('longTermAchievementProgress').textContent = `${completedCount}/${LongTermAchievements.length}`;
        
        const achievementList = document.getElementById('longTermAchievementList');
        if (LongTermAchievements.length === 0) {
            achievementList.innerHTML = '<div style="color:#999; padding:8px; text-align:center;">暂无长期成就</div>';
            return;
        }
        
        let html = '';
        LongTermAchievements.forEach((achievement, index) => {
            const isCompleted = State.completedLongTermAchievements.includes(achievement.id);
            
            let itemClass = isCompleted ? 'completed' : '';
            
            let rewardText = `${achievement.rewardCoins}金币`;
            if (achievement.rewardItems && achievement.rewardItems.length > 0) {
                achievement.rewardItems.forEach(item => {
                    rewardText += ` +${item.count}${item.name}`;
                });
            }
            
            let canSubmit = !isCompleted && this.hasEnoughItems(achievement);
            let currentCount = this.getCurrentCount(achievement);
            
            let btnText = canSubmit ? '提交' : '未完成';
            
            html += `
                <div class="achievement-item ${itemClass}">
                    <div class="achievement-name">${isCompleted ? '✓' : '○'} ${achievement.name}</div>
                    <div class="achievement-desc">${achievement.desc}</div>
                    <div class="achievement-progress">进度: ${currentCount}/${achievement.count} | 奖励: ${rewardText}</div>
                    ${!isCompleted ? `<button class="long-term-achievement-submit-btn" data-id="${achievement.id}" ${!canSubmit ? 'disabled' : ''}>${btnText}</button>` : ''}
                </div>
            `;
        });
        achievementList.innerHTML = html;
        
        document.querySelectorAll('.long-term-achievement-submit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.submitLongTerm(e.target.dataset.id);
            });
        });
    }
};
