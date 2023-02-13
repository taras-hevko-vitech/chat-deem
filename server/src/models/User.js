const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
        firstName: String,
        lastName: String,
        phoneNo: {
            type: String,
            maxLength: 15
        },
        email: {
            type: String,
            minLength: 6,
            unique: true
        },
        password: String,
        timestamp: { type: Date, default: Date.now },
    });

const User = mongoose.model("users", userSchema);
module.exports = { User };