const Automation = {
    cards: [],
    links: [],
    nextCardId: 1,
    selectedCard: null,
    draggingCard: null,
    dragOffset: { x: 0, y: 0 },
    connectingFrom: null,
    tempLink: null,
    scale: 1,
    translateX: 0,
    translateY: 0,
    
    cardTypes: {
        source: {
            name: '来源',
            color: '#4CAF50',
            outputs: ['输出'],
            inputs: [],
            needsTool: false
        },
        process: {
            name: '加工',
            color: '#2196F3',
            outputs: ['输出'],
            inputs: ['输入'],
            needsTool: true
        }
    },
    
    itemTypes: ['虫子', '荷叶', '虫虫串', '苹果', '香蕉', '西瓜', '辣椒', '胡萝卜', '土豆', '咻咻辣辣串', '荷包', '小存钱罐', '暗淡的珍珠'],
    
    toolTypes: ['捕虫网', '烤虫机', '锄头'],
    
    init() {
        this.canvas = document.getElementById('automationCanvas');
        this.content = document.getElementById('automationContent');
        this.cardsContainer = document.getElementById('automationCards');
        this.linksContainer = document.getElementById('automationLinks');
        this.hint = document.getElementById('automationHint');
        this.zoomDisplay = document.getElementById('automationZoom');
        
        if (!this.canvas) return;
        
        this.bindEvents();
        this.loadFromState();
        this.render();
    },
    
    bindEvents() {
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.translateX) / this.scale;
            const y = (e.clientY - rect.top - this.translateY) / this.scale;
            this.showContextMenu(e.clientX, e.clientY, x, y);
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.hideContextMenu();
            }
        });
        
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.scale = Math.max(0.5, Math.min(2, this.scale + delta));
            this.updateTransform();
        });
        
        document.getElementById('automationResetBtn').addEventListener('click', () => {
            this.resetView();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.draggingCard) {
                this.onDragCard(e);
            }
            if (this.connectingFrom) {
                this.onDragLink(e);
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (this.draggingCard) {
                this.endDragCard();
            }
            if (this.connectingFrom) {
                this.endDragLink(e);
            }
        });
    },
    
    updateTransform() {
        this.content.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
        this.zoomDisplay.textContent = Math.round(this.scale * 100) + '%';
    },
    
    resetView() {
        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    },
    
    showContextMenu(x, y, canvasX, canvasY) {
        this.hideContextMenu();
        
        const menu = document.createElement('div');
        menu.id = 'automationContextMenu';
        menu.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
            z-index: 1000;
            min-width: 120px;
            padding: 4px 0;
        `;
        
        Object.entries(this.cardTypes).forEach(([type, config]) => {
            const item = document.createElement('div');
            item.textContent = config.name;
            item.style.cssText = `
                padding: 8px 16px;
                cursor: pointer;
                font-size: 13px;
            `;
            item.onmouseenter = () => item.style.background = '#f0f0f0';
            item.onmouseleave = () => item.style.background = '';
            item.onclick = () => {
                this.addCard(type, canvasX, canvasY);
                this.hideContextMenu();
            };
            menu.appendChild(item);
        });
        
        document.body.appendChild(menu);
        
        const closeHandler = (e) => {
            if (!menu.contains(e.target)) {
                this.hideContextMenu();
                document.removeEventListener('mousedown', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('mousedown', closeHandler), 0);
    },
    
    hideContextMenu() {
        const menu = document.getElementById('automationContextMenu');
        if (menu) menu.remove();
    },
    
    addCard(type, x, y) {
        const config = this.cardTypes[type];
        const card = {
            id: this.nextCardId++,
            type: type,
            x: x - 80,
            y: y - 40,
            itemType: this.itemTypes[0],
            amount: 1,
            toolType: config.needsTool ? '' : null,
            active: false
        };
        
        this.cards.push(card);
        this.saveToState();
        this.render();
    },
    
    deleteCard(cardId) {
        this.cards = this.cards.filter(c => c.id !== cardId);
        this.links = this.links.filter(l => l.fromCard !== cardId && l.toCard !== cardId);
        this.saveToState();
        this.render();
    },
    
    render() {
        if (this.hint) {
            this.hint.style.display = this.cards.length === 0 ? 'block' : 'none';
        }
        this.renderLinks();
        this.renderCards();
    },
    
    renderCards() {
        this.cardsContainer.innerHTML = '';
        
        this.cards.forEach(card => {
            const config = this.cardTypes[card.type];
            const el = document.createElement('div');
            el.className = 'automation-card';
            el.dataset.cardId = card.id;
            el.style.cssText = `
                position: absolute;
                left: ${card.x}px;
                top: ${card.y}px;
                width: 160px;
                background: white;
                border: 2px solid ${config.color};
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                cursor: move;
                user-select: none;
                pointer-events: auto;
            `;
            
            let html = `
                <div style="background: ${config.color}; color: white; padding: 6px 8px; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px; font-weight: bold;">${config.name}</span>
                    <span class="delete-card" style="cursor: pointer; opacity: 0.7;">×</span>
                </div>
                <div style="padding: 8px;">
                    <select class="card-item-type" style="width: 100%; padding: 4px; border: 1px solid #ddd; border-radius: 4px; font-size: 11px; margin-bottom: 4px;">
                        ${this.itemTypes.map(t => `<option value="${t}" ${t === card.itemType ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="font-size: 11px;">数量:</span>
                        <input type="number" class="card-amount" value="${card.amount}" min="1" max="100" style="width: 50px; padding: 2px 4px; border: 1px solid #ddd; border-radius: 4px; font-size: 11px;">
                    </div>
                    ${config.needsTool ? `
                    <div style="margin-top: 4px;">
                        <select class="card-tool-type" style="width: 100%; padding: 4px; border: 1px solid #ddd; border-radius: 4px; font-size: 11px;">
                            <option value="">选择工具</option>
                            ${this.toolTypes.map(t => `<option value="${t}" ${t === card.toolType ? 'selected' : ''}>${t}</option>`).join('')}
                        </select>
                    </div>
                    ` : ''}
                    <div style="margin-top: 6px; display: flex; align-items: center; gap: 4px;">
                        <label style="display: flex; align-items: center; gap: 2px; font-size: 11px;">
                            <input type="checkbox" class="card-active" ${card.active ? 'checked' : ''}>
                            启用
                        </label>
                    </div>
                </div>
            `;
            
            if (config.inputs.length > 0) {
                html += `<div class="input-point" style="position: absolute; left: -8px; top: 50%; width: 16px; height: 16px; background: ${config.color}; border-radius: 50%; cursor: crosshair; transform: translateY(-50%); border: 2px solid white;"></div>`;
            }
            
            if (config.outputs.length > 0) {
                html += `<div class="output-point" style="position: absolute; right: -8px; top: 50%; width: 16px; height: 16px; background: ${config.color}; border-radius: 50%; cursor: crosshair; transform: translateY(-50%); border: 2px solid white;"></div>`;
            }
            
            el.innerHTML = html;
            
            el.querySelector('.delete-card').onclick = (e) => {
                e.stopPropagation();
                this.deleteCard(card.id);
            };
            
            el.querySelector('.card-item-type').onchange = (e) => {
                card.itemType = e.target.value;
                this.saveToState();
            };
            
            el.querySelector('.card-amount').onchange = (e) => {
                card.amount = parseInt(e.target.value) || 1;
                this.saveToState();
            };
            
            const toolSelect = el.querySelector('.card-tool-type');
            if (toolSelect) {
                toolSelect.onchange = (e) => {
                    card.toolType = e.target.value;
                    this.saveToState();
                };
            }
            
            el.querySelector('.card-active').onchange = (e) => {
                card.active = e.target.checked;
                this.saveToState();
            };
            
            el.onmousedown = (e) => {
                e.stopPropagation();
                if (e.target.classList.contains('output-point')) {
                    this.startConnect(card.id, 'output', e);
                } else if (e.target.classList.contains('input-point')) {
                    this.startConnect(card.id, 'input', e);
                } else if (!e.target.matches('select, input, .delete-card, label')) {
                    this.startDragCard(card, e);
                }
            };
            
            this.cardsContainer.appendChild(el);
        });
    },
    
    renderLinks() {
        let svg = '';
        
        this.links.forEach(link => {
            const fromCard = this.cards.find(c => c.id === link.fromCard);
            const toCard = this.cards.find(c => c.id === link.toCard);
            
            if (fromCard && toCard) {
                const fromX = fromCard.x + 160 + 8;
                const fromY = fromCard.y + 50;
                const toX = toCard.x - 8;
                const toY = toCard.y + 50;
                
                const midX = (fromX + toX) / 2;
                
                svg += `<path d="M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}" 
                    stroke="#2196F3" stroke-width="2" fill="none" class="automation-link" 
                    data-from="${link.fromCard}" data-to="${link.toCard}"
                    style="cursor: pointer;"/>`;
            }
        });
        
        if (this.tempLink) {
            svg += `<path d="${this.tempLink.path}" stroke="#2196F3" stroke-width="2" fill="none" stroke-dasharray="5,5"/>`;
        }
        
        this.linksContainer.innerHTML = svg;
        
        this.linksContainer.querySelectorAll('.automation-link').forEach(path => {
            path.onclick = () => {
                const from = parseInt(path.dataset.from);
                const to = parseInt(path.dataset.to);
                this.links = this.links.filter(l => !(l.fromCard === from && l.toCard === to));
                this.saveToState();
                this.render();
            };
        });
    },
    
    startDragCard(card, e) {
        e.preventDefault();
        this.draggingCard = card;
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - this.translateX) / this.scale;
        const mouseY = (e.clientY - rect.top - this.translateY) / this.scale;
        this.dragOffset = {
            x: mouseX - card.x,
            y: mouseY - card.y
        };
    },
    
    onDragCard(e) {
        if (!this.draggingCard) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - this.translateX) / this.scale;
        const mouseY = (e.clientY - rect.top - this.translateY) / this.scale;
        
        this.draggingCard.x = mouseX - this.dragOffset.x;
        this.draggingCard.y = mouseY - this.dragOffset.y;
        
        this.render();
    },
    
    endDragCard() {
        if (this.draggingCard) {
            this.saveToState();
        }
        this.draggingCard = null;
    },
    
    startConnect(cardId, pointType, e) {
        e.preventDefault();
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;
        
        this.connectingFrom = { cardId, pointType };
        
        const startX = card.x + (pointType === 'output' ? 160 + 8 : -8);
        const startY = card.y + 50;
        
        this.tempLink = {
            startX,
            startY,
            path: `M ${startX} ${startY} L ${startX} ${startY}`
        };
    },
    
    onDragLink(e) {
        if (!this.connectingFrom || !this.tempLink) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const endX = (e.clientX - rect.left - this.translateX) / this.scale;
        const endY = (e.clientY - rect.top - this.translateY) / this.scale;
        
        const midX = (this.tempLink.startX + endX) / 2;
        
        this.tempLink.path = `M ${this.tempLink.startX} ${this.tempLink.startY} C ${midX} ${this.tempLink.startY}, ${midX} ${endY}, ${endX} ${endY}`;
        this.renderLinks();
    },
    
    endDragLink(e) {
        if (!this.connectingFrom) return;
        
        const target = e.target;
        if (target.classList.contains('input-point') || target.classList.contains('output-point')) {
            const cardEl = target.closest('.automation-card');
            if (cardEl) {
                const toCardId = parseInt(cardEl.dataset.cardId);
                
                if (toCardId && toCardId !== this.connectingFrom.cardId) {
                    if (this.connectingFrom.pointType === 'output') {
                        this.links = this.links.filter(l => l.toCard !== toCardId);
                        this.links.push({
                            fromCard: this.connectingFrom.cardId,
                            toCard: toCardId
                        });
                    } else {
                        this.links = this.links.filter(l => l.toCard !== this.connectingFrom.cardId);
                        this.links.push({
                            fromCard: toCardId,
                            toCard: this.connectingFrom.cardId
                        });
                    }
                    this.saveToState();
                }
            }
        }
        
        this.connectingFrom = null;
        this.tempLink = null;
        this.render();
    },
    
    saveToState() {
        State.automationCards = this.cards.map(c => ({
            id: c.id,
            type: c.type,
            x: c.x,
            y: c.y,
            itemType: c.itemType,
            amount: c.amount,
            active: c.active
        }));
        State.automationLinks = this.links.map(l => ({
            fromCard: l.fromCard,
            toCard: l.toCard
        }));
        State.automationNextId = this.nextCardId;
        Save.auto();
    },
    
    loadFromState() {
        if (State.automationCards) {
            this.cards = State.automationCards.map(c => ({
                ...c,
                id: c.id || this.nextCardId++
            }));
        }
        if (State.automationLinks) {
            this.links = State.automationLinks;
        }
        if (State.automationNextId) {
            this.nextCardId = State.automationNextId;
        }
    },
    
    process() {
        this.cards.filter(c => c.active).forEach(card => {
            const config = this.cardTypes[card.type];
            const inputLinks = this.links.filter(l => l.toCard === card.id);
            const outputLinks = this.links.filter(l => l.fromCard === card.id);
            
            if (config.needsTool && card.toolType) {
                if (!Tool.hasTool(card.toolType)) {
                    return;
                }
            }
            
            if (card.type === 'source') {
                const type = ItemTypeMap[card.itemType];
                if (type && Backpack.canAddItem(type, card.amount)) {
                    Backpack.addResource(type, card.amount);
                    Log.add(`自动获取 ${card.amount} 个${card.itemType}`);
                }
            } else if (card.type === 'process') {
                const inputType = ItemTypeMap[card.itemType];
                const inputCount = ItemManager.getCount(inputType);
                
                if (inputCount >= card.amount) {
                    const outputCard = this.cards.find(c => c.id === outputLinks[0]?.toCard);
                    if (outputCard) {
                        const outputType = ItemTypeMap[outputCard.itemType];
                        if (outputType && Backpack.canAddItem(outputType, card.amount)) {
                            State[ItemManager.getStateKey(inputType)] -= card.amount;
                            Backpack.addResource(outputType, card.amount);
                            Log.add(`自动加工 ${card.amount} 个${card.itemType} -> ${outputCard.itemType}`);
                        }
                    }
                }
            }
        });
        
        UI.update();
    }
};
