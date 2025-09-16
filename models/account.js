const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    date: {
        type: String,
    },
});

const Account = mongoose.model('account', accountSchema);

module.exports = Account;