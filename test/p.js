const crypto = require('crypto');
    let str = 'company end boat vicious pulp trade segment';
    const password = 'FnJL7EDzjqWjcaY9';
    const iv = 'FnJL7EDzjqWjcaY9';
    // 加密
    const cipher = crypto.createCipheriv('aes-128-cbc', password, iv);
    cipher.update(str,'utf8', 'hex')
    let data3 = cipher.final('hex');
    console.log(data3);

    // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', password, iv);
    decipher.update(data3, 'hex', 'utf8')
    let data4 = decipher.final().toString();
    console.log(data4);