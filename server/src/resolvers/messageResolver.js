const { Message } = require("../models/Message");
const { Chat } = require("../models/Chat");
const { PubSub, withFilter } = require("graphql-subscriptions");
const { User } = require("../models/User");

const MESSAGE_ADDED = "newMessage";
const MESSAGE_NOTIFICATION = "messageNotification"
const MESSAGE_READ = "messageRead"
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
    },
    getUnreadMessages: async (_, args, {context}) => {
        const {user} = context;

        const userChats = await Chat.find({ users: { $in: [user.id] } });
        const unreadMessages = [];
            await Promise.all(userChats.map(async (chat) => {
            const message = await Message.find({
                chatId: chat.id,
                senderId: {$ne: user.id},
                isRead: false
            })
            if (message) {
                unreadMessages.push(message)
            }
        }))
        const unreadMessagesWithUserInfo = await Promise.all(unreadMessages[0].map(async (unreadMessage) => {
            const userInfo = await User.findById(unreadMessage.senderId)
            return {
                message: unreadMessage,
                user: userInfo
            }
        }))

        if (unreadMessagesWithUserInfo.length > 0) {
            return unreadMessagesWithUserInfo
        }
    },
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
            content,
            isRead: false
        });

        await message.save();

        await pubsub.publish(CHAT_ADDED, {
            newChat: chat,
            newMessage: message
        })
        await pubsub.publish(MESSAGE_ADDED, {
            newMessage: message
        });

        await pubsub.publish(MESSAGE_NOTIFICATION, {
            messageReceived: message,
            chat: chat,
            user: user
        })

        return message;
    },
    sendMessage: async (_, args, { context }) => {
        const { user } = context;
        const { chatId, content } = args;

        const currentChat = await Chat.findOne({ _id: chatId})
        const newMessage = new Message({
            senderId: user.id,
            chatId: chatId,
            content,
            isRead: false
        });
        await newMessage.save();
        await pubsub.publish(MESSAGE_NOTIFICATION, {
            messageReceived: newMessage,
            chat: currentChat,
            user: user
        })
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
    markMessagesAsRead: async (_, { chatId }, { context }) => {
        const {user} = context
        try {
            const chat = await Chat.findById(chatId);
            if (!chat || !chat.users.includes(user.id)) {
                throw new Error('Chat not found');
            }

            const messages = await Message.updateMany(
                {
                    chatId,
                    senderId: { $ne: user.id },
                    isRead: false,
                },
                {
                    isRead: true,
                }
            );
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
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

    messageReceived: {
        subscribe: withFilter(
            () => pubsub.asyncIterator(MESSAGE_NOTIFICATION),
            (payload, variables = {} ) => {
                return payload.chat.users.includes(variables.userId) && payload.messageReceived.senderId !== variables.userId
            }
        ),
        resolve: (payload) => {
            return {
                message: payload.messageReceived,
                user: payload.user
            }
        }
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