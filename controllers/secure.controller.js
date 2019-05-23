const bcrypt = require('bcrypt');

const saltRounds = 10;

var encryptPassword = (password) => {
    var salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
};

var decryptPassword = (password, defaltPassword) => {
    return bcrypt.compareSync(password, defaltPassword);
}

module.exports = {
    encryptPassword: encryptPassword,
    decryptPassword: decryptPassword
}