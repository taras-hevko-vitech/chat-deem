const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    content: String,
    senderId: String,
    chatId: String,
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("message", messageSchema);
module.exports = { Message };