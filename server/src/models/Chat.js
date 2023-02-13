const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const chatSchema = new Schema({
    users: Array,
    timestamp: { type: Date, default: Date.now },
});


const Chat = mongoose.model("chats", chatSchema);
module.exports = { Chat };