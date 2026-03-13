const Save = {
    auto() {
        localStorage.setItem(Config.SAVE_KEY, JSON.stringify(State.getSaveData()));
    },
    
    save() {
        this.auto();
        Log.add('游戏已保存');
        return '已保存到浏览器';
    },
    
    load() {
        const saved = localStorage.getItem(Config.SAVE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                State.loadSaveData(data);
                Market.render();
                Shop.render();
                UI.update();
                Time.update();
                Log.add('存档已加载');
                return '已从浏览器加载';
            } catch(e) {
                alert('存档损坏');
                return '存档损坏';
            }
        }
        return '无存档';
    },
    
    delete() {
        if (confirm('确定要删除所有存档数据并恢复初始状态吗？')) {
            localStorage.removeItem(Config.SAVE_KEY);
            // 重置角色信息
            Character.init();
            location.reload();
        }
    },
    
    export() {
        const dataStr = JSON.stringify(State.getSaveData(), null, 2);
        const blob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `frog_stall_save_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Log.add('存档已导出');
        return '存档已导出';
    },
    
    import(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                State.loadSaveData(data);
                Market.render();
                Shop.render();
                UI.update();
                Time.update();
                Log.add('存档已导入');
                return '存档已导入';
            } catch(e) {
                alert('无效的存档文件');
                return '无效的存档文件';
            }
        };
        reader.readAsText(file);
    }
};
