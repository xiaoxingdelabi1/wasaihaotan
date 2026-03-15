const Monsters = {
    monsters: {
        frog: {
            name: '巡塘小虾精',
            level: 1,
            health: 30,
            attack: 5,
            defense: 0,
            experience: 10,
            gold: 1,
            drops: [
                { name: '虫子', chance: 0.2 }
            ]
        },
        fish: {
            name: '盘丝小蜘蛛',
            level: 2,
            health: 35,
            attack: 6,
            defense: 0,
            experience: 15,
            gold: 1,
            drops: [
                { name: '虫子', chance: 0.25 }
            ]
        },
        bug: {
            name: '水底蜈蚣精',
            level: 3,
            health: 45,
            attack: 8,
            defense: 1,
            experience: 20,
            gold: 1,
            drops: [
                { name: '虫子', chance: 0.3 },
                { name: '暗淡的珍珠', chance: 0.05 }
            ]
        },
        
        wolf: {
            name: '巡山小钻风',
            level: 4,
            health: 50,
            attack: 10,
            defense: 1,
            experience: 30,
            gold: 1,
            drops: [
                { name: '暗淡的珍珠', chance: 0.1 }
            ]
        },
        bear: {
            name: '黑风小妖',
            level: 6,
            health: 80,
            attack: 15,
            defense: 2,
            experience: 45,
            gold: 1,
            drops: [
                { name: '暗淡的珍珠', chance: 0.15 }
            ]
        },
        goblin: {
            name: '巡山喽啰',
            level: 5,
            health: 60,
            attack: 12,
            defense: 1,
            experience: 35,
            gold: 1,
            drops: [
                { name: '暗淡的珍珠', chance: 0.12 }
            ]
        },
        
        goblin_leader: {
            name: '黄风小将',
            level: 8,
            health: 100,
            attack: 15,
            defense: 2,
            experience: 60,
            gold: 1
        },
        troll: {
            name: '狮驼小妖',
            level: 9,
            health: 120,
            attack: 18,
            defense: 3,
            experience: 70,
            gold: 1
        },
        dragon: {
            name: '碧波小龙',
            level: 10,
            health: 150,
            attack: 22,
            defense: 4,
            experience: 100,
            gold: 1
        },
        
        knight: {
            name: '天庭力士',
            level: 12,
            health: 600,
            attack: 70,
            defense: 35,
            experience: 120,
            gold: 1
        },
        wizard: {
            name: '方术道人',
            level: 13,
            health: 500,
            attack: 85,
            defense: 20,
            experience: 140,
            gold: 1
        },
        demon: {
            name: '魔界先锋',
            level: 15,
            health: 800,
            attack: 100,
            defense: 45,
            experience: 200,
            gold: 1
        },
        
        pond_boss: {
            name: '池塘霸主·水蛇王',
            level: 3,
            health: 80,
            attack: 12,
            defense: 2,
            experience: 80,
            gold: 5,
            isBoss: true,
            drops: [
                { name: '虫子', chance: 0.5 },
                { name: '暗淡的珍珠', chance: 0.3 }
            ]
        },
        forest_boss: {
            name: '森林之王·黑熊精',
            level: 7,
            health: 150,
            attack: 20,
            defense: 5,
            experience: 150,
            gold: 5,
            isBoss: true,
            drops: [
                { name: '暗淡的珍珠', chance: 0.5 }
            ]
        },
        cave_boss: {
            name: '山洞领主·蛟龙',
            level: 10,
            health: 250,
            attack: 28,
            defense: 6,
            experience: 250,
            gold: 5,
            isBoss: true,
            drops: [
                { name: '暗淡的珍珠', chance: 0.8 }
            ]
        },
        castle_boss: {
            name: '城堡主宰·魔王',
            level: 20,
            health: 2000,
            attack: 150,
            defense: 60,
            experience: 500,
            gold: 5,
            isBoss: true,
            drops: [
                { name: '暗淡的珍珠', chance: 1.0 }
            ]
        }
    },
    
    generateMonster(areaId) {
        const area = Areas.areas.find(a => a.id === areaId);
        if (!area) return null;
        
        const monsterType = area.monsters[Math.floor(Math.random() * area.monsters.length)];
        const baseMonster = this.monsters[monsterType];
        
        const monster = JSON.parse(JSON.stringify(baseMonster));
        
        const levelAdjustment = area.level / monster.level;
        if (levelAdjustment > 1) {
            monster.health = Math.floor(monster.health * levelAdjustment);
            monster.attack = Math.floor(monster.attack * levelAdjustment);
            monster.defense = Math.floor(monster.defense * levelAdjustment);
            monster.experience = Math.floor(monster.experience * levelAdjustment);
            monster.gold = Math.floor(monster.gold * levelAdjustment);
        }
        
        return monster;
    },
    
    generateEliteMonster(areaId) {
        const baseMonster = this.generateMonster(areaId);
        if (!baseMonster) return null;
        
        baseMonster.name = `精英 ${baseMonster.name}`;
        baseMonster.health = Math.floor(baseMonster.health * 1.5);
        baseMonster.attack = Math.floor(baseMonster.attack * 1.3);
        baseMonster.defense = Math.floor(baseMonster.defense * 1.2);
        baseMonster.experience = Math.floor(baseMonster.experience * 2);
        baseMonster.gold = Math.floor(baseMonster.gold * 2);
        
        return baseMonster;
    },
    
    getMonsterInfo(monsterId) {
        return this.monsters[monsterId];
    }
};
