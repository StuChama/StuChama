const jwt = require('jsonwebtoken');


const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // accepts seconds, or string with a number and a time unit aswell.
    });
}

module.exports = { generateToken };