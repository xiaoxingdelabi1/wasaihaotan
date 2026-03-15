const Time = {
    update() {
        const now = Date.now();
        const elapsedHours = (now - State.startTimestamp) / 3600000;
        const totalDays = State.initialDays + elapsedHours;
        const currentDayNumber = Math.floor(totalDays) + 1;

        const dayFraction = totalDays - Math.floor(totalDays);
        let hourFloat = 8 + 12 * dayFraction;
        let hour = Math.floor(hourFloat);
        let minute = Math.floor((hourFloat - hour) * 60);
        if (hour < 8) hour = 8;
        if (hour > 20) hour = 20;
        const timeStr = `${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}`;
        document.getElementById('clockDisplay').textContent = timeStr;

        const year = Math.floor((currentDayNumber - 1) / 16) + 1;
        const seasonIndex = Math.floor(((currentDayNumber - 1) % 16) / 4);
        const dayOfSeason = ((currentDayNumber - 1) % 4) + 1;

        const seasonName = SeasonNames[seasonIndex];
        document.getElementById('gameTimeDisplay').textContent = `第${year}年 ${seasonName}季 第${dayOfSeason}天`;

        if (currentDayNumber !== State.lastDayNumber) {
            State.lastDayNumber = currentDayNumber;
            Market.fluctuatePrices();
            Shop.refresh();
            // 重置已击败的怪物列表
            State.defeatedMonsters = {};
            Log.add('新的一天开始了，怪物已重新刷新');
        }
    },
    
    nextDay() {
        const now = Date.now();
        const elapsedHours = (now - State.startTimestamp) / 3600000;
        const totalDays = State.initialDays + elapsedHours;
        const currentDayNumber = Math.floor(totalDays) + 1;
        const newTotalDays = currentDayNumber;
        State.initialDays = newTotalDays;
        State.startTimestamp = Date.now();
        State.lastDayNumber = newTotalDays;
        this.update();
        Market.fluctuatePrices();
        Shop.refresh();
        // 重置已击败的怪物列表
        State.defeatedMonsters = {};
        Log.add('开发者跳转到次日，怪物已重新刷新');
        Save.auto();
    },
    
    set(year, seasonIdx, day, hour) {
        const totalDays = (year - 1) * 16 + seasonIdx * 4 + day;
        const dayFraction = (hour - 8) / 12;
        State.initialDays = (totalDays - 1) + dayFraction;
        State.startTimestamp = Date.now();
        State.lastDayNumber = totalDays;
        this.update();
        Market.fluctuatePrices();
        Shop.refresh();
        Save.auto();
        Log.add(`开发者将时间设为第${year}年 ${SeasonNames[seasonIdx]}季 第${day}天 ${hour}:00`);
        alert(`时间已设为第${year}年 ${SeasonNames[seasonIdx]}季 第${day}天 ${hour}:00`);
    },
    
    hotelStay() {
        if (State.coins < Config.HOTEL_COST) {
            alert(`金币不足 ${Config.HOTEL_COST}，无法借宿`);
            return;
        }
        State.coins -= Config.HOTEL_COST;
        Log.add(`花费${Config.HOTEL_COST}金币借宿一晚`);

        const now = Date.now();
        const elapsedHours = (now - State.startTimestamp) / 3600000;
        const totalDays = State.initialDays + elapsedHours;
        const currentDayInt = Math.floor(totalDays);
        const targetDay = currentDayInt + 1;
        State.initialDays = targetDay;
        State.startTimestamp = Date.now();
        State.lastDayNumber = targetDay + 1;
        this.update();
        Market.fluctuatePrices();
        Shop.refresh();
        // 重置已击败的怪物列表
        State.defeatedMonsters = {};
        Log.add('借宿一晚，怪物已重新刷新');
        UI.update();
        Save.auto();
    },
    
    startTimer() {
        setInterval(() => this.update(), 1000);
        this.update();
    }
};
