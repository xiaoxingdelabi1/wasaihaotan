const Areas = {
    // 地区列表
    areas: [
        {
            id: 'pond',
            name: '池塘',
            level: 1,
            description: '宁静的池塘，适合新手练级',
            monsters: ['frog', 'fish', 'bug'],
            requiredLevel: 1,
            requiredAchievements: [],
            isUnlocked: true
        },
        {
            id: 'forest',
            name: '森林',
            level: 5,
            description: '茂密的森林，有更多危险的怪物',
            monsters: ['wolf', 'bear', 'goblin'],
            requiredLevel: 3,
            requiredAchievements: ['pond_3'],
            isUnlocked: false
        },
        {
            id: 'cave',
            name: '山洞',
            level: 10,
            description: '黑暗的山洞，充满了强大的怪物',
            monsters: ['goblin_leader', 'troll', 'dragon'],
            requiredLevel: 8,
            requiredAchievements: ['forest_3'],
            isUnlocked: false
        },
        {
            id: 'castle',
            name: '城堡',
            level: 15,
            description: '古老的城堡，最终的挑战',
            monsters: ['knight', 'wizard', 'demon'],
            requiredLevel: 12,
            requiredAchievements: ['cave_3'],
            isUnlocked: false
        }
    ],
    
    // 当前地区
    currentArea: 'pond',
    
    // 检查地区是否解锁
    checkUnlock(areaId) {
        const area = this.areas.find(a => a.id === areaId);
        if (!area) return false;
        
        // 检查成就要求
        for (const achievementId of area.requiredAchievements) {
            if (!State.completedAchievements.includes(achievementId)) {
                return false;
            }
        }
        
        area.isUnlocked = true;
        return true;
    },
    
    // 解锁地区
    unlockArea(areaId) {
        const area = this.areas.find(a => a.id === areaId);
        if (area && this.checkUnlock(areaId)) {
            area.isUnlocked = true;
            Log.add(`解锁了新地区：${area.name}`);
            return true;
        }
        return false;
    },
    
    // 切换地区
    switchArea(areaId) {
        const area = this.areas.find(a => a.id === areaId);
        if (!area || !area.isUnlocked) {
            alert('该地区未解锁');
            return false;
        }
        
        this.currentArea = areaId;
        State.currentRegion = area.name;
        Log.add(`移动到 ${area.name}`);
        UI.update();
        return true;
    },
    
    // 获取当前地区信息
    getCurrentArea() {
        return this.areas.find(a => a.id === this.currentArea);
    },
    
    // 获取地区列表
    getAreas() {
        return this.areas;
    },
    
    // 检查是否所有地区都已解锁
    isAllUnlocked() {
        return this.areas.every(area => area.isUnlocked);
    }
};
