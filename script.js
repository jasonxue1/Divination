// 加载算命内容
async function loadFortuneContent() {
    const response = await fetch('fortune-content.json');
    const data = await response.json();
    return data;
}

async function getFortune() {
    // 获取用户输入的姓名、出生日期、幸运颜色和数字
    const name = document.getElementById("name").value;
    const birthdate = document.getElementById("birthdate").value;
    const color = document.getElementById("color").value;
    const number = parseInt(document.getElementById("number").value);

    // 如果输入为空，提示用户填写
    if (!name || !birthdate || !number) {
        alert("请填写所有字段！");
        return;
    }

    // 获取当前时间（小时、星期几）
    const currentDate = new Date();
    const currentHour = currentDate.getHours(); // 当前小时
    const currentDay = currentDate.getDay(); // 当前星期几

    // 加载算命内容
    const fortuneData = await loadFortuneContent();
    
    // 结合用户输入和当前时间来生成算命结果
    const month = new Date(birthdate).getMonth();
    const fortuneIndex = (month + number + currentDay) % fortuneData.fortunes.length;

    let fortuneMessage = fortuneData.fortunes[fortuneIndex];

    // 根据当前时间添加更多个性化内容
    if (currentHour >= 6 && currentHour < 12) {
        fortuneMessage += " 早晨的阳光照亮了你的未来，今天是一个充满活力的一天！";
    } else if (currentHour >= 12 && currentHour < 18) {
        fortuneMessage += " 下午的时光提醒你要多思考和积累，未来的成就来源于当下的努力！";
    } else {
        fortuneMessage += " 夜晚来临时，记得放松心情，调整状态，为明天的挑战做好准备。";
    }

    // 显示算命结果
    document.getElementById("fortune-result").textContent = fortuneMessage;
}