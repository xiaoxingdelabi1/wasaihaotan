const Automation = {
    cards: [],
    links: [],
    nextCardId: 1,
    selectedCard: null,
    draggingCard: null,
    draggingCanvas: false,
    canvasDragStart: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
    connectingFrom: null,
    tempLink: null,
    scale: 1,
    translateX: 0,
    translateY: 0,
    
    cardTypes: {
        tool: {
            name: '工具',
            outputs: [],
            inputs: [],
            needsTool: true
        }
    },
    
    toolTypes: ['捕虫网'],
    
    runningCards: {},
    
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
                
                const isOnCard = e.target.closest('.automation-card');
                if (!isOnCard) {
                    this.draggingCanvas = true;
                    this.canvasDragStart = { x: e.clientX - this.translateX, y: e.clientY - this.translateY };
                    this.canvas.style.cursor = 'grabbing';
                }
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
            if (this.draggingCanvas) {
                this.translateX = e.clientX - this.canvasDragStart.x;
                this.translateY = e.clientY - this.canvasDragStart.y;
                this.updateTransform();
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (this.draggingCard) {
                this.endDragCard();
            }
            if (this.draggingCanvas) {
                this.draggingCanvas = false;
                this.canvas.style.cursor = '';
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
        const card = {
            id: this.nextCardId++,
            type: type,
            x: x - 80,
            y: y - 40,
            toolType: '捕虫网',
            active: false
        };
        
        this.cards.push(card);
        this.saveToState();
        this.render();
    },
    
    deleteCard(cardId) {
        this.cards = this.cards.filter(c => c.id !== cardId);
        this.links = this.links.filter(l => l.fromCard !== cardId && l.toCard !== cardId);
        this.stopCard({ id: cardId });
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
            const config = this.cardTypes[card.type] || { name: '工具' };
            const el = document.createElement('div');
            el.className = 'automation-card';
            el.dataset.cardId = card.id;
            
            const progress = this.runningCards[card.id]?.progress || 0;
            const progressAngle = (progress / 100) * 360;
            
            let borderStyle = '';
            if (card.active) {
                borderStyle = `border: 3px solid transparent; background: linear-gradient(white, white) padding-box, conic-gradient(#4CAF50 ${progressAngle}deg, #ddd ${progressAngle}deg) border-box;`;
            } else {
                borderStyle = 'border: 2px solid #ddd;';
            }
            
            el.style.cssText = `
                position: absolute;
                left: ${card.x}px;
                top: ${card.y}px;
                width: 160px;
                background: white;
                ${borderStyle}
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                cursor: pointer;
                user-select: none;
                pointer-events: auto;
            `;
            
            let html = `
                <div style="padding: 8px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee;">
                    <span style="font-size: 12px; font-weight: bold; color: #333;">${config.name}</span>
                    <span class="delete-card" style="cursor: pointer; opacity: 0.5; font-size: 16px;">×</span>
                </div>
                <div style="padding: 8px;">
                    <select class="card-tool-type" style="width: 100%; padding: 4px; border: 1px solid #ddd; border-radius: 4px; font-size: 11px;">
                        ${this.toolTypes.map(t => `<option value="${t}" ${t === card.toolType ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                    <div class="card-status" style="margin-top: 6px; font-size: 10px; color: ${card.active ? '#4CAF50' : '#999'}; text-align: center;">
                        ${card.active ? '● 运行中' : '○ 点击启动'}
                    </div>
                </div>
            `;
            
            el.innerHTML = html;
            
            el.querySelector('.delete-card').onclick = (e) => {
                e.stopPropagation();
                this.deleteCard(card.id);
            };
            
            const toolSelect = el.querySelector('.card-tool-type');
            if (toolSelect) {
                toolSelect.onchange = (e) => {
                    e.stopPropagation();
                    card.toolType = e.target.value;
                    this.saveToState();
                };
            }
            
            el.onclick = (e) => {
                if (e.target.tagName === 'SELECT' || e.target.classList.contains('delete-card')) return;
                
                if (!Tool.hasTool(card.toolType)) {
                    Log.add('需要装备 ' + card.toolType);
                    return;
                }
                
                card.active = !card.active;
                if (card.active) {
                    this.startCard(card);
                } else {
                    this.stopCard(card);
                }
                this.saveToState();
                this.updateCardStyle(card);
            };
            
            el.onmousedown = (e) => {
                e.stopPropagation();
                if (!e.target.matches('select, input, .delete-card')) {
                    this.startDragCard(card, e);
                }
            };
            
            this.cardsContainer.appendChild(el);
        });
    },
    
    updateCardStyle(card) {
        const el = this.cardsContainer.querySelector(`[data-card-id="${card.id}"]`);
        if (!el) return;
        
        const progress = this.runningCards[card.id]?.progress || 0;
        const progressAngle = (progress / 100) * 360;
        
        if (card.active) {
            el.style.border = '3px solid transparent';
            el.style.background = `linear-gradient(white, white) padding-box, conic-gradient(#4CAF50 ${progressAngle}deg, #ddd ${progressAngle}deg) border-box`;
        } else {
            el.style.border = '2px solid #ddd';
            el.style.background = 'white';
        }
        
        const statusEl = el.querySelector('.card-status');
        if (statusEl) {
            statusEl.style.color = card.active ? '#4CAF50' : '#999';
            statusEl.textContent = card.active ? '● 运行中' : '○ 点击启动';
        }
    },
    
    startCard(card) {
        if (this.runningCards[card.id]) return;
        
        this.runningCards[card.id] = {
            progress: 0,
            interval: null
        };
        
        const runCard = () => {
            const cardData = this.cards.find(c => c.id === card.id);
            if (!cardData || !cardData.active) {
                this.stopCard(card);
                return;
            }
            
            if (!Tool.hasTool(cardData.toolType)) {
                Log.add(cardData.toolType + ' 已卸下，停止运行');
                this.stopCard(card);
                cardData.active = false;
                this.saveToState();
                this.updateCardStyle(cardData);
                return;
            }
            
            this.runningCards[card.id].progress += 10;
            
            if (this.runningCards[card.id].progress >= 100) {
                this.runningCards[card.id].progress = 0;
                State.bugs++;
                Log.add('捕获 1 只虫子');
            }
            
            this.updateCardStyle(cardData);
            UI.update();
        };
        
        this.runningCards[card.id].interval = setInterval(runCard, 100);
    },
    
    stopCard(card) {
        if (this.runningCards[card.id]) {
            if (this.runningCards[card.id].interval) {
                clearInterval(this.runningCards[card.id].interval);
            }
            delete this.runningCards[card.id];
        }
    },
    
    renderLinks() {
        this.linksContainer.innerHTML = '';
    },
    
    startDragCard(card, e) {
        e.preventDefault();
        this.draggingCard = card;
        const rect = this.canvas.getBoundingClientRect();
        this.dragOffset = {
            x: (e.clientX - rect.left - this.translateX) / this.scale - card.x,
            y: (e.clientY - rect.top - this.translateY) / this.scale - card.y
        };
    },
    
    onDragCard(e) {
        if (!this.draggingCard) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - this.translateX) / this.scale;
        const mouseY = (e.clientY - rect.top - this.translateY) / this.scale;
        
        this.draggingCard.x = mouseX - this.dragOffset.x;
        this.draggingCard.y = mouseY - this.dragOffset.y;
        
        const el = this.cardsContainer.querySelector(`[data-card-id="${this.draggingCard.id}"]`);
        if (el) {
            el.style.left = this.draggingCard.x + 'px';
            el.style.top = this.draggingCard.y + 'px';
        }
    },
    
    endDragCard() {
        if (this.draggingCard) {
            this.saveToState();
        }
        this.draggingCard = null;
    },
    
    saveToState() {
        State.automationCards = this.cards.map(c => ({
            id: c.id,
            type: c.type,
            x: c.x,
            y: c.y,
            toolType: c.toolType,
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
    }
};
