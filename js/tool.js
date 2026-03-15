const Tool = {
    maxTools: 5,
    
    render() {
        this.renderEquippedTools();
        this.renderToolBackpack();
    },
    
    renderEquippedTools() {
        const container = document.getElementById('toolSlotMain');
        if (!container) return;
        
        const tools = Character.equipment.tools || [];
        
        let html = '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
        
        for (let i = 0; i < this.maxTools; i++) {
            const tool = tools[i];
            if (tool) {
                html += `
                    <div class="equipped-tool" data-index="${i}" style="border: 1px solid #4CAF50; border-radius: 8px; padding: 8px; background: #f0fff0; min-width: 100px;">
                        <div style="font-weight: bold; font-size: 12px; color: #333;">${tool.name}</div>
                        <button class="unequip-tool-btn" data-index="${i}" style="margin-top: 4px; padding: 2px 6px; font-size: 10px; cursor: pointer;">卸下</button>
                    </div>
                `;
            } else {
                html += `
                    <div class="empty-tool-slot" data-index="${i}" style="border: 1px dashed #ccc; border-radius: 8px; padding: 8px; background: #fafafa; min-width: 100px; text-align: center;">
                        <span style="color: #999; font-size: 11px;">空槽位</span>
                    </div>
                `;
            }
        }
        
        html += '</div>';
        html += `<div style="margin-top: 8px; font-size: 11px; color: #666;">已装备 ${tools.length}/${this.maxTools} 个工具</div>`;
        container.innerHTML = html;
        
        container.querySelectorAll('.unequip-tool-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.unequipTool(index);
            };
        });
    },
    
    renderToolBackpack() {
        const container = document.getElementById('toolBackpack');
        if (!container) return;
        
        const tools = State.equipmentBackpack.filter(item => item.type === 'tool');
        
        if (tools.length === 0) {
            container.innerHTML = '<span style="color: #999;">暂无工具</span>';
            return;
        }
        
        let html = '';
        tools.forEach((tool) => {
            const originalIndex = State.equipmentBackpack.indexOf(tool);
            const isEquipped = (Character.equipment.tools || []).some(t => t && t.id === tool.id);
            
            html += `
                <div class="tool-item" data-index="${originalIndex}" style="border: 1px solid ${isEquipped ? '#4CAF50' : '#ddd'}; border-radius: 8px; padding: 8px; background: ${isEquipped ? '#f0fff0' : 'white'}; min-width: 120px; cursor: ${isEquipped ? 'default' : 'pointer'}; opacity: ${isEquipped ? 0.6 : 1};">
                    <div style="font-weight: bold; font-size: 12px;">${tool.name}</div>
                    <div style="font-size: 10px; color: #666; margin-top: 4px;">${tool.description || '工具'}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        container.querySelectorAll('.tool-item').forEach(el => {
            el.onclick = () => {
                const index = parseInt(el.dataset.index);
                const tool = State.equipmentBackpack[index];
                const isEquipped = (Character.equipment.tools || []).some(t => t && t.id === tool.id);
                if (!isEquipped) {
                    this.equipTool(index);
                }
            };
        });
    },
    
    equipTool(index) {
        const tool = State.equipmentBackpack[index];
        if (!tool || tool.type !== 'tool') return;
        
        if (!Character.equipment.tools) {
            Character.equipment.tools = [];
        }
        
        if (Character.equipment.tools.length >= this.maxTools) {
            alert('工具槽已满，请先卸下一个工具');
            return;
        }
        
        const isAlreadyEquipped = Character.equipment.tools.some(t => t && t.id === tool.id);
        if (isAlreadyEquipped) {
            alert('该工具已装备');
            return;
        }
        
        Character.equipment.tools.push(tool);
        State.equipmentBackpack.splice(index, 1);
        Log.add(`装备了 ${tool.name}`);
        
        this.render();
        UI.update();
        Save.auto();
    },
    
    unequipTool(index) {
        if (!Character.equipment.tools || !Character.equipment.tools[index]) return;
        
        const tool = Character.equipment.tools[index];
        
        if (State.equipmentBackpack.length >= Config.MAX_EQUIPMENT) {
            alert('装备背包已满，无法卸下工具');
            return;
        }
        
        State.equipmentBackpack.push(tool);
        Character.equipment.tools.splice(index, 1);
        Log.add(`卸下了 ${tool.name}`);
        
        this.render();
        UI.update();
        Save.auto();
    },
    
    hasTool(toolName) {
        const tools = Character.equipment.tools || [];
        return tools.some(t => t && t.name.includes(toolName));
    },
    
    getTool(toolName) {
        const tools = Character.equipment.tools || [];
        return tools.find(t => t && t.name.includes(toolName));
    }
};
