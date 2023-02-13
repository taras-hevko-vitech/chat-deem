const { Message } = require("../models/Message");
const { Chat } = require("../models/Chat");
const { PubSub, withFilter } = require("graphql-subscriptions");

const MESSAGE_ADDED = "newMessage";
const USER_TYPING = "userTyping";
const CHAT_ADDED = "newChat"
const pubsub = new PubSub();

const Query = {
    messageByUser: async (_, { receiverId }, { context }) => {
        const { user } = context;
        if (!user) throw new Error("You have to log in");
        const createdChatBefore = await Chat.findOne({ users: { $all: [user.id, receiverId] } });

        if (createdChatBefore) {
            const messages = await Message.find({ chatId: createdChatBefore.id });
            return messages;
        }
        return [];
    }
};
const Mutation = {
    sendFirstMessage: async (_, args, { context }) => {
        const { receiverId, content } = args;
        const { user } = context;

        let chat = await Chat.findOne({
            users: { $all: [user.id, receiverId] }
        });

        if (!chat) {
            chat = new Chat({
                users: [user.id, receiverId]
            });

            await chat.save();
        }

        const message = new Message({
            senderId: user.id,
            chatId: chat.id,
            content
        });

        await message.save();

        await pubsub.publish(CHAT_ADDED, {
            newChat: chat,
            newMessage: message
        })
        await pubsub.publish(MESSAGE_ADDED, {
            newMessage: message
        });

        return message;
    },
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
    newMessageAndChat: {
        subscribe: withFilter(
            () => pubsub.asyncIterator(CHAT_ADDED),
            (payload, variables = {}) => {
                return payload.newChat.users.includes(variables.userId) &&
                    payload.newChat.users.includes(payload.newMessage.senderId)
            }
        ),
        resolve: (payload) => {
            return payload.newMessage;
        },
    },
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