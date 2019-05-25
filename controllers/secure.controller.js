const bcrypt = require('bcrypt');

const saltRounds = 10;


var encryptPassword = (password) => {
    var salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password.trim(), salt);
};

var decryptPassword = (password, defaltPassword) => {
    return bcrypt.compareSync(password.trim(), defaltPassword.trim());
}

module.exports = {
    encryptPassword: encryptPassword,
    decryptPassword: decryptPassword
}