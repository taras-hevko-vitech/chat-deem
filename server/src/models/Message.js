const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    content: String,
    senderEmail: String,
    receiverEmail: String,
    timestamp: Number
});

const Message = mongoose.model("message", messageSchema);
module.exports = { Message };