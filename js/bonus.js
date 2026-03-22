const Bonus = {
    render() {
        this.renderIncomeBonus();
        this.renderSpeedBonus();
        this.renderCombatStats();
        this.renderSetBonuses();
    },

    renderIncomeBonus() {
        let levelBonus = Character.level * 2;
        document.getElementById('bonusLevelIncome').textContent = `+${levelBonus}%`;

        let intBonus = 0;
        for (let slot in Character.equipment) {
            const item = Character.equipment[slot];
            if (item && item.intelligence) {
                intBonus += item.intelligence;
            }
        }
        document.getElementById('bonusIntelligenceIncome').textContent = `+${intBonus}%`;

        let areaBonus = 0;
        const currentAreaId = State.currentArea || 'pond';
        const area = Areas.areas.find(a => a.id === currentAreaId);
        if (area) {
            areaBonus = area.level;
        }
        document.getElementById('bonusAreaIncome').textContent = `+${areaBonus}%`;

        const totalBonus = 100 + levelBonus + intBonus + areaBonus;
        document.getElementById('bonusTotalIncome').textContent = `${totalBonus}%`;
    },

    renderSpeedBonus() {
        let agilityBonus = Character.agility;
        document.getElementById('bonusAgilitySpeed').textContent = `-${agilityBonus}%`;

        let equipAgilityBonus = 0;
        for (let slot in Character.equipment) {
            const item = Character.equipment[slot];
            if (item && item.agility) {
                equipAgilityBonus += item.agility * 0.5;
            }
        }
        document.getElementById('bonusEquipAgilitySpeed').textContent = `-${equipAgilityBonus.toFixed(1)}%`;

        const totalReduction = Math.min(50, agilityBonus + equipAgilityBonus);
        document.getElementById('bonusTotalSpeed').textContent = `-${totalReduction.toFixed(1)}%`;
    },

    renderCombatStats() {
        Character.recalculateStats();

        document.getElementById('bonusHealth').textContent = Math.floor(Character.maxHealth);
        document.getElementById('bonusAttack').textContent = Math.floor(Character.attack);
        document.getElementById('bonusDefense').textContent = Math.floor(Character.defense);
        document.getElementById('bonusCriticalChance').textContent = `${Character.criticalChance.toFixed(1)}%`;
        document.getElementById('bonusCriticalDamage').textContent = `${Character.criticalDamage.toFixed(1)}%`;
        document.getElementById('bonusMonsterDamage').textContent = `${Character.monsterDamage.toFixed(1)}%`;
        document.getElementById('bonusDodge').textContent = `${Character.dodge.toFixed(1)}%`;
    },

    renderSetBonuses() {
        const container = document.getElementById('bonusSetBonuses');
        if (!container) return;

        const setCounts = {};
        for (let slot in Character.equipment) {
            const item = Character.equipment[slot];
            if (item && item.setName) {
                setCounts[item.setName] = (setCounts[item.setName] || 0) + 1;
            }
        }

        let html = '';
        for (const setName in setCounts) {
            const count = setCounts[setName];
            const bonus = Equipment.setBonuses[setName];
            if (!bonus) continue;

            const pieces2Active = count >= 2;
            const pieces5Active = count >= 5;

            html += `
                <div class="set-bonus-item">
                    <div class="set-bonus-name">${setName} (${count}/5)</div>
                    <div class="set-bonus-effects">
                        <div class="${pieces2Active ? 'active' : 'inactive'}">
                            (2) ${this.formatSetBonus(bonus.pieces2)} ${pieces2Active ? '✓' : ''}
                        </div>
                        <div class="${pieces5Active ? 'active' : 'inactive'}">
                            (5) ${this.formatSetBonus(bonus.pieces5)} ${pieces5Active ? '✓' : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html || '<div class="no-set-bonus">未装备套装</div>';
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
    }
};
