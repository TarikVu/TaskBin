const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Use bcryptjs

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, auto: true }  // Automatically generated
});

// Middleware to hash password before saving user to the database
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) { // prevent hashing again.
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (err) {
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
