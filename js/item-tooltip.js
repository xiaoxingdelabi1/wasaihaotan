const ItemTooltip = {
    init() {
        this.tooltip = document.createElement('div');
        this.tooltip.id = 'itemTooltip';
        this.tooltip.style.cssText = `
            position: fixed;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            font-size: 12px;
            display: none;
        `;
        document.body.appendChild(this.tooltip);
        
        // 鼠标进入tooltip时不隐藏
        this.tooltip.addEventListener('mouseenter', () => {
            this.isOverTooltip = true;
        });
        
        this.tooltip.addEventListener('mouseleave', () => {
            this.isOverTooltip = false;
            this.hide();
        });
    },
    
    getItemInfo(itemType, itemData) {
        // 如果 itemData 直接有 description 且不是特殊类型，优先使用
        if (itemData && itemData.description && !itemData.setName && !(itemData.type === 'tool' && itemData.durability)) {
            const propInfo = [];
            if (itemData.properties && itemData.properties.heal) propInfo.push(`恢复: ${itemData.properties.heal}HP`);
            if (itemData.properties && itemData.properties.experience) propInfo.push(`经验: +${itemData.properties.experience}`);
            if (itemData.properties && itemData.properties.stallCapacity) propInfo.push(`摊位上限: +${itemData.properties.stallCapacity}`);
            if (itemData.properties && itemData.properties.backpackCapacity) propInfo.push(`背包上限: +${itemData.properties.backpackCapacity}`);
            if (itemData.properties && itemData.properties.maxCoins) propInfo.push(`金币上限: +${itemData.properties.maxCoins}`);
            
            return {
                name: itemData.name,
                description: itemData.description,
                function: propInfo.join(' · ')
            };
        }
        
        if (itemData && itemData.setName) {
            const attrInfo = [];
            if (itemData.health) attrInfo.push(`生命: ${itemData.health}`);
            if (itemData.defense) attrInfo.push(`防御: ${itemData.defense}`);
            if (itemData.attack) attrInfo.push(`攻击: ${itemData.attack}`);
            if (itemData.criticalChance) attrInfo.push(`暴击率: ${itemData.criticalChance}%`);
            if (itemData.criticalDamage) attrInfo.push(`暴击伤害: ${itemData.criticalDamage}%`);
            if (itemData.monsterDamage) attrInfo.push(`怪物伤害: ${itemData.monsterDamage}%`);
            if (itemData.dodge) attrInfo.push(`闪避: ${itemData.dodge}%`);
            
            return {
                name: itemData.name,
                description: `${itemData.setName}套装部件`,
                function: attrInfo.join(' · ')
            };
        }
        
        if (itemData && itemData.type === 'tool' && itemData.durability) {
            return {
                name: itemData.name,
                description: itemData.name === '锄头' ? '可以用来锄地种田' : '可以用来捕捉虫子',
                function: `耐久: ${itemData.durability}/${itemData.maxDurability || itemData.durability}`
            };
        }
        
        if (Items && Items[itemType]) {
            const item = Items[itemType];
            const propInfo = [];
            if (item.properties && item.properties.heal) propInfo.push(`恢复: ${item.properties.heal}HP`);
            if (item.properties && item.properties.experience) propInfo.push(`经验: +${item.properties.experience}`);
            if (item.properties && item.properties.stallCapacity) propInfo.push(`摊位上限: +${item.properties.stallCapacity}`);
            if (item.properties && item.properties.backpackCapacity) propInfo.push(`背包上限: +${item.properties.backpackCapacity}`);
            if (item.properties && item.properties.maxCoins) propInfo.push(`金币上限: +${item.properties.maxCoins}`);
            
            const typeDescs = {
                'consumable': '消耗品',
                'ingredient': '食材',
                'upgrade': '升级道具',
                'treasure': '宝物',
                'material': '材料'
            };
            
            const description = (itemData && itemData.description) || item.description || typeDescs[item.type] || '物品';
            
            return {
                name: item.name,
                description: description,
                function: propInfo.join(' · ')
            };
        }
        
        const typeInfo = {
            'bug': {
            name: '虫子',
            description: '可以制作虫虫串的基本材料',
            function: '食材：10只可合成虫虫串'
        },
        'leaf': {
            name: '荷叶',
            description: '可以包裹虫虫串的材料',
            function: '食材：与虫子+10只合成虫虫串'
        },
        'skewer': {
            name: '虫虫串',
            description: '用10只虫子+1片荷叶合成',
            function: '可直接出售'
        },
        'apple': {
            name: '苹果',
            description: '好吃的苹果',
            function: '可直接出售'
        },
        'banana': {
            name: '香蕉',
            description: '香甜的香蕉',
            function: '可直接出售'
        },
        'watermelon': {
            name: '西瓜',
            description: '大西瓜',
            function: '可直接出售'
        },
        'pepper': {
            name: '山椒',
            description: '很辣的山椒',
            function: '食材：与虫虫串+1个山椒可制作咻咻辣辣串'
        },
        'carrot': {
            name: '胡萝卜',
            description: '营养丰富的胡萝卜',
            function: '可直接出售'
        },
        'spicySkewer': {
            name: '咻咻辣辣串',
            description: '用1个虫虫串+1个山椒制作',
            function: '可直接出售，售价高'
        },
        'purse': {
            name: '荷包',
            description: '小小的荷包',
            function: '可直接出售'
        },
        'piggyBank': {
            name: '小存钱罐',
            description: '可爱的小存钱罐',
            function: '可直接出售'
        }
    };
        
        if (itemData && itemData.name) {
            return {
                name: itemData.name,
                description: itemData.description || '',
                function: itemData.function || ''
            };
        }
        
        return typeInfo[itemType] || {
            name: itemType,
            description: '',
            function: ''
        };
    },
    
    show(x, y, itemType, itemData) {
        const info = this.getItemInfo(itemType, itemData);
        
        // 获取市价
        let marketPrice = null;
        if (itemData && itemData.basePrice) {
            marketPrice = itemData.basePrice;
        } else if (itemData && itemData.price) {
            marketPrice = itemData.price;
        } else if (itemData && itemData.currentPrice) {
            marketPrice = itemData.currentPrice;
        } else if (Items && Items[itemType] && Items[itemType].currentPrice) {
            marketPrice = Items[itemType].currentPrice;
        }
        
        let html = `
            <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px;">${info.name}</div>
        `;

        if (info.description) {
            html += `
                <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                    <strong>介绍：</strong>${info.description}
                </div>
            `;
        }

        if (info.function) {
            html += `
                <div style="font-size: 12px; color: #4CAF50;">
                    <strong>功能：</strong>${info.function}
                </div>
            `;
        }

        if (marketPrice !== null && marketPrice !== undefined) {
            html += `
                <div style="font-size: 12px; margin-top: 8px;">
                    <strong>市价：</strong><span style="color: #DAA520;">${marketPrice}</span> 金币
                </div>
            `;
        }
        
        this.tooltip.innerHTML = html;
        
        this.tooltip.style.display = 'block';
        
        const tooltipRect = this.tooltip.getBoundingClientRect();
        let finalX = x + 10;
        let finalY = y + 10;
        
        if (finalX + tooltipRect.width > window.innerWidth) {
            finalX = x - tooltipRect.width - 10;
        }
        
        if (finalY + tooltipRect.height > window.innerHeight) {
            finalY = y - tooltipRect.height - 10;
        }
        
        this.tooltip.style.left = finalX + 'px';
        this.tooltip.style.top = finalY + 'px';
    },
    
    hide() {
        // 如果鼠标在tooltip上，不隐藏
        if (this.isOverTooltip) return;
        if (this.tooltip) {
            this.tooltip.style.display = 'none';
        }
    }
};
