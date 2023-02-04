const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    content: String,
    senderId: String,
    chatId: String,
    timestamp: Number
});

const Message = mongoose.model("message", messageSchema);
module.exports = { Message };