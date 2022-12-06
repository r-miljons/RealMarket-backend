const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

// signup static method
usersSchema.statics.signup = async function (username, password) {
    // validate inputs
    if (!username || !password) {
        throw Error("All fields must be provided");
    }
    if (!validator.isAlphanumeric(username)) {
        throw Error("Username can only contain letters and numbers");
    }
    if (!validator.isStrongPassword(password, {
        minLength: 4,
        minLowercase: 0,
        minUppercase: 0,
        minSymbols: 0,
        minNumbers: 0,
    })) {
    throw Error("Password must be at least 4 characters long");
    }

    // check if username is taken
    const exists = await this.findOne({ username });
    if (exists) {
        throw Error("Username already taken");
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // add user to db
    const user = await this.create({ username, password: hash });
    return user;
};

// login static method
usersSchema.statics.login = async function(username, password) {

    // validate inputs 
    if (!username || !password) {
        throw Error("All fields must be provided");
    }
    // check if registered
    const user = await this.findOne({ username });
    if (!user) {
        throw Error("Invalid username or password");
    }

    // check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error("Invalid username or password");
    }

    return user;
};

module.exports = mongoose.model.User || mongoose.model("User", usersSchema);