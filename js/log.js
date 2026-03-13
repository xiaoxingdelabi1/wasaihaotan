const Log = {
    add(message) {
        const timeStr = document.getElementById('gameTimeDisplay').textContent + ' ' + document.getElementById('clockDisplay').textContent;
        State.logs.push(timeStr + '，' + message);
        if (State.logs.length > 50) State.logs.shift();
        this.render();
    },
    
    render() {
        const logList = document.getElementById('logList');
        if (State.logs.length === 0) {
            logList.innerHTML = '<p>暂无日志</p>';
            return;
        }
        let html = '';
        State.logs.forEach(log => {
            html += `<p>${log}</p>`;
        });
        logList.innerHTML = html;
        // 滚动到底部
        logList.scrollTop = logList.scrollHeight;
    }
};
