const { Message } = require("../models/Message");
const { Chat } = require("../models/Chat");
const { PubSub, withFilter } = require("graphql-subscriptions");
const { GraphQLError } = require("graphql");

const MESSAGE_ADDED = "newMessage";
const USER_TYPING = "userTyping";
const pubsub = new PubSub();

const Query = {
    messageByUser: async (_, { receiverId }, { context }) => {
        const { user } = context;
        if (!user) throw new Error("You have to log in");
        const createdChatBefore = await Chat.findOne({ users: {$all: [user.id, receiverId] } });
        if (createdChatBefore) {
            const messages = await Message.find({ chatId: createdChatBefore.id });
            return messages;
        } else {
            return []
        }
    }
};
const Mutation = {
    sendMessage: async (_, args, { context }) => {
        const { user } = context;
        const { chatId, content, timestamp } = args;

        const newMessage = new Message({
            senderId: user.id,
            chatId: chatId,
            content,
            timestamp
        });
        await newMessage.save();

        await pubsub.publish(MESSAGE_ADDED, {
            newMessage: newMessage
        });
        return newMessage;
    },

    createNewChat: async (_, { receiverId }, { context }) => {
        const { user } = context;
        const newChat = new Chat({
            users: [user.id, receiverId]
        });
        await newChat.save();

        return newChat;
    },

    userTyping: async (_, { chatId }, { context }) => {
        const { user } = context;
        await pubsub.publish(USER_TYPING, { userTyping: user.id, chatId });
        return true;
    },
    updateMessage: async (_, { id, content }) => {
        const userText = await Message.findOneAndUpdate(
            { _id: id },
            { content },
            { new: true }
        );
        return userText;
    },

    deleteMessage: async (_, { id }) => {
        await Message.findOneAndDelete({ _id: id });
        return true;
    }
};
const Subscription = {
    newMessage: {
        subscribe: withFilter(
            () => pubsub.asyncIterator(MESSAGE_ADDED),
            (payload, variables = {}) => {
                return payload.newMessage.chatId === variables.chatId;
            }
        )
    },

    userTyping: {
        subscribe: withFilter(
            () => pubsub.asyncIterator(USER_TYPING),
            (payload, variables) => {
                return payload.chatId === variables.chatId;
            }
        )
    }
};

const resolvers = {
    Query,
    Mutation,
    Subscription
};

module.exports = resolvers;