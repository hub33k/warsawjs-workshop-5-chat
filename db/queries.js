const db = require('./db.js');
const createHash = require('sha.js');

function _hashPassword(password) {
    let sha256 = createHash('sha256');
    return sha256.update(password, 'utf8').digest('hex');
}

function _getUser(username) {
    return db.table('users').where({username}).first()
}

function _isUsernameTaken(username) {
    return _getUser(username)
        .then((user) => Boolean(user));
}

function registerUser(username, password) {
    return _isUsernameTaken(username)
        .then((isTaken) => {
            if (isTaken) {
                return false;
            } else {
                return db.table('users').insert({username, password: _hashPassword(password)})
                    .then((insertedIDs) => insertedIDs[0]);
            }
        });
}

function loginUser(username, password) {
    return _getUser(username)
        .then((user) => {
            if (user) {
                return user.password === _hashPassword(password);
            } else {
                return false
            }
        });
}

module.exports = {
    registerUser,
    loginUser
};
