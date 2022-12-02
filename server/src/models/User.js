const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
        firstName: {
            type: String,
            maxLength: 50
        },
        lastName: {
            type: String,
            maxLength: 50
        },
        phoneNo: {
            type: String,
            maxLength: 15
        },
        email: {
            type: String,
            minLength: 6,
            unique: true
        },
        password: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("users", userSchema);
module.exports = { User };