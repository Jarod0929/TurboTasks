const encryptPassword = text => {
    let aesjs = require('aes-js');
    let key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
    let textBytes = aesjs.utils.utf8.toBytes(text);
    let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    let encryptedBytes = aesCtr.encrypt(textBytes);
    return aesjs.utils.hex.fromBytes(encryptedBytes);
  };

exports.encryptPassword = encryptPassword;