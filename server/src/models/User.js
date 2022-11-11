const mongoose = require("mongoose")
const Schema = mongoose.Schema


const userSchema = Schema({
    firstName: {
        type: String,
        maxLength: 50,
    },
    lastName: {
        type: String,
        maxLength: 50,
    },
    phoneNo: {
        type: String,
        maxLength: 15,
    },
    email: {
        type: String,
        minLength: 6,
    },
    password: {
        type: String,
    },
})

const User = mongoose.model("users", userSchema)
module.exports = { User };