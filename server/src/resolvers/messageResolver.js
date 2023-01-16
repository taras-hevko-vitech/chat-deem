const { Message } = require("../models/Message");
const { PubSub, withFilter } = require("graphql-subscriptions");

const MESSAGE_ADDED = "newMessage"
const USER_TYPING = "userTyping"
const pubsub = new PubSub()

const Query = {
    messageByUser: async (_, {receiverId}, {context}) => {
        const { user } = context
        if (!user) throw new Error("You have to log in")
        const messages = await Message.find({$or: [
            {senderId: receiverId, receiverId: user.id},
            {senderId: user.id, receiverId: receiverId}
        ]})
        return messages

    }
};
const Mutation = {
    sendMessage: async (_, args, {context}) => {
        const { user } = context
        const { receiverId, content, timestamp} = args
        const userText = new Message({
            senderId: user.id,
            receiverId,
            content,
            timestamp,
        })
        await userText.save()
        await pubsub.publish(MESSAGE_ADDED, {
            newMessage: userText
        })
        return userText
    },

    userTyping: async (_, { receiverId }, {context}) => {
        const { user } = context
        await pubsub.publish(USER_TYPING, { userTyping: user.id, receiverId });
        return true;
    },
    updateMessage: async (_, { id, content }) => {
        const userText = await Message.findOneAndUpdate(
            { _id: id },
            { content },
            { new: true }
        )
        return userText
    },

    deleteMessage: async (_, { id }) => {
        await Message.findOneAndDelete({ _id: id })
        return true
    },
};
const Subscription = {
    newMessage: {
        subscribe: withFilter(
            () => pubsub.asyncIterator(MESSAGE_ADDED),
            (payload, variables = {}) => {
                const isAuthUserSenderOrReceiver = payload.newMessage.receiverId === variables.receiverId && payload.newMessage.senderId === variables.authId
                const isUserSenderOrReceiver = payload.newMessage.receiverId === variables.authId && payload.newMessage.senderId === variables.receiverId
                return isAuthUserSenderOrReceiver || isUserSenderOrReceiver
            }
        )
    },

    userTyping: {
        subscribe: () => pubsub.asyncIterator(USER_TYPING),
    },
};

const resolvers = {
    Query,
    Mutation,
    Subscription
}

module.exports = resolvers;