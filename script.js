// 引入加密模块，用于生成 SHA-256 哈希
function sha256(message) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(message))
        .then(hashBuffer => {
            let hashArray = Array.from(new Uint8Array(hashBuffer));
            let hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
            return hashHex;
        });
}

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

    // 获取今天的日期
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0]; // 只取日期部分 (yyyy-mm-dd)

    // 拼接所有输入项和今天的日期
    const combinedString = name + birthdate + color + number + todayDate;

    // 生成该拼接字符串的 SHA-256 哈希
    const combinedHash = await sha256(combinedString);

    // 将哈希值转换为数字，并确保能够生成32个结果
    const hashIndex = parseInt(combinedHash.slice(0, 2), 16);

    // 加载算命内容
    const fortuneData = await loadFortuneContent();

    // 根据哈希值计算索引并选择算命内容（确保有32个结果）
    const fortuneIndex = hashIndex % fortuneData.fortunes.length;

    // 获取第一句：来自 fortune-content.json
    let fortuneMessage = fortuneData.fortunes[fortuneIndex];

    // 获取当前时间（小时）
    const currentHour = today.getHours();

    // 获取第二句：根据时间
    let timeMessage;
    if (currentHour >= 6 && currentHour < 12) {
        timeMessage = "早晨的阳光照亮了你的未来，今天是一个充满活力的一天！";
    } else if (currentHour >= 12 && currentHour < 18) {
        timeMessage = "下午的时光提醒你要多思考和积累，未来的成就来源于当下的努力！";
    } else {
        timeMessage = "夜晚来临时，记得放松心情，调整状态，为明天的挑战做好准备。";
    }

    // 输出结果：第一句 + 第二句
    document.getElementById("fortune-result").innerHTML = fortuneMessage + "<br><br>" + timeMessage;
}