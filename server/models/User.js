const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    name: { type: String },
    created_at: { type: Date, default: Date.now }
}, { collection: 'users' });

module.exports = mongoose.model('User', userSchema);
