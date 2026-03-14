const Character = {
    level: 1,
    experience: 0,
    experienceToNext: 200,
    
    // 基础属性
    strength: 10,      // 影响攻击力
    agility: 8,        // 影响暴击率和闪避
    intelligence: 5,   // 影响技能效果
    vitality: 12,      // 影响生命值
    
    // 战斗属性
    maxHealth: 100,
    currentHealth: 100,
    attack: 20,
    defense: 5,
    criticalChance: 5,  // 百分比
    criticalDamage: 150, // 百分比
    monsterDamage: 0,   // 对怪物伤害加成（百分比）
    dodge: 3,          // 百分比
    
    // 装备
    equipment: {
        weapon: null,
        armor: null,
        helmet: null,
        boots: null,
        gloves: null,
        pants: null,
        tool: null
    },
    
    // 技能
    skills: {
        basicAttack: { level: 1, maxLevel: 10, cooldown: 0 },
        powerStrike: { level: 0, maxLevel: 5, cooldown: 3 },
        healingPotion: { level: 0, maxLevel: 3, cooldown: 5 }
    },
    
    // 状态
    statusEffects: [],
    
    // 初始化
    init() {
        // 重置角色基础属性
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 200;
        
        // 基础属性
        this.strength = 10;      // 影响攻击力
        this.agility = 8;        // 影响暴击率和闪避
        this.intelligence = 5;   // 影响技能效果
        this.vitality = 12;      // 影响生命值
        
        // 战斗属性
        this.maxHealth = 100;
        this.currentHealth = 100;
        this.attack = 20;
        this.defense = 5;
        this.criticalChance = 5;  // 百分比
        this.criticalDamage = 150; // 百分比
        this.monsterDamage = 0;   // 对怪物伤害加成（百分比）
        this.dodge = 3;          // 百分比
        
        // 装备
        this.equipment = {
            weapon: null,
            armor: null,
            helmet: null,
            boots: null,
            gloves: null,
            pants: null,
            tool: null
        };
        
        // 技能
        this.skills = {
            basicAttack: { level: 1, maxLevel: 10, cooldown: 0 },
            powerStrike: { level: 0, maxLevel: 5, cooldown: 3 },
            healingPotion: { level: 0, maxLevel: 3, cooldown: 5 }
        };
        
        // 状态
        this.statusEffects = [];
        
        this.calculateStats();
    },
    
    // 计算战斗属性
    calculateStats() {
        let baseAttack = 10 + this.strength * 2;
        let baseDefense = 5 + this.vitality * 0.5;
        let baseCriticalChance = 5 + this.agility * 0.5;
        let baseDodge = 3 + this.agility * 0.3;
        let baseMonsterDamage = 0;
        let baseHealth = 80 + this.vitality * 10;
        
        // 装备加成
        Object.values(this.equipment).forEach(item => {
            if (item) {
                baseAttack += item.attack || 0;
                baseDefense += item.defense || 0;
                baseHealth += item.health || 0;
                baseCriticalChance += item.criticalChance || 0;
                baseDodge += item.dodge || 0;
                baseMonsterDamage += item.monsterDamage || 0;
            }
        });
        
        // 套装加成
        const setBonuses = Equipment.calculateSetBonuses(this.equipment);
        if (setBonuses.health) {
            baseHealth += setBonuses.health;
        }
        if (setBonuses.defense) {
            baseDefense += setBonuses.defense;
        }
        if (setBonuses.defensePercent) {
            baseDefense *= (1 + setBonuses.defensePercent / 100);
        }
        if (setBonuses.attack) {
            baseAttack += setBonuses.attack;
        }
        if (setBonuses.criticalChance) {
            baseCriticalChance += setBonuses.criticalChance;
        }
        if (setBonuses.criticalDamage) {
            this.criticalDamage += setBonuses.criticalDamage;
        }
        if (setBonuses.monsterDamage) {
            baseMonsterDamage += setBonuses.monsterDamage;
        }
        if (setBonuses.dodge) {
            baseDodge += setBonuses.dodge;
        }
        
        this.attack = Math.floor(baseAttack);
        this.defense = Math.floor(baseDefense);
        this.criticalChance = Math.min(baseCriticalChance, 50);
        this.criticalDamage = 150;
        this.monsterDamage = Math.floor(baseMonsterDamage);
        this.dodge = Math.min(baseDodge, 30);
        this.maxHealth = Math.floor(baseHealth);
        this.currentHealth = Math.min(this.currentHealth, this.maxHealth);
    },
    
    // 获得经验
    gainExperience(amount) {
        this.experience += amount;
        while (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
    },
    
    // 升级
    levelUp() {
        this.level++;
        this.experience -= this.experienceToNext;
        let baseExp = Math.floor(this.experienceToNext * 1.5);
        if (this.level < 10) {
            this.experienceToNext = baseExp * 2;
        } else {
            this.experienceToNext = baseExp;
        }
        
        // 分配属性点
        this.strength += 2;
        this.agility += 1;
        this.intelligence += 1;
        this.vitality += 2;
        
        // 恢复生命值
        this.currentHealth = this.maxHealth;
        
        Log.add(`升级了！现在等级 ${this.level}`);
        this.calculateStats();
    },
    
    // 装备物品
    equip(item) {
        if (item.type === 'weapon' || item.type === 'armor' || 
            item.type === 'helmet' || item.type === 'boots' || 
            item.type === 'gloves' || item.type === 'pants' || item.type === 'tool') {
            
            const oldItem = this.equipment[item.type];
            this.equipment[item.type] = item;
            this.calculateStats();
            
            if (oldItem) {
                Log.add(`更换了${item.type}：${oldItem.name} → ${item.name}`);
            } else {
                Log.add(`装备了${item.name}`);
            }
            
            return oldItem;
        }
        return null;
    },
    
    // 卸下装备
    unequip(slot) {
        const item = this.equipment[slot];
        if (item) {
            this.equipment[slot] = null;
            this.calculateStats();
            Log.add(`卸下了${item.name}`);
            return item;
        }
        return null;
    },
    
    // 获得伤害
    takeDamage(amount) {
        const damage = Math.max(1, amount - this.defense);
        this.currentHealth = Math.max(0, this.currentHealth - damage);
        return damage;
    },
    
    // 恢复生命值
    heal(amount) {
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
        return amount;
    },
    
    // 检查是否死亡
    isDead() {
        return this.currentHealth <= 0;
    },
    
    // 重置状态
    reset() {
        this.currentHealth = this.maxHealth;
        this.statusEffects = [];
        Object.values(this.skills).forEach(skill => {
            skill.cooldown = 0;
        });
    },
    
    // 获得角色信息
    getInfo() {
        return {
            level: this.level,
            experience: this.experience,
            experienceToNext: this.experienceToNext,
            strength: this.strength,
            agility: this.agility,
            intelligence: this.intelligence,
            vitality: this.vitality,
            maxHealth: this.maxHealth,
            currentHealth: this.currentHealth,
            attack: this.attack,
            defense: this.defense,
            criticalChance: this.criticalChance,
            criticalDamage: this.criticalDamage,
            monsterDamage: this.monsterDamage,
            dodge: this.dodge,
            equipment: this.equipment,
            skills: this.skills
        };
    }
};
