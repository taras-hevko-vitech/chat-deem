const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { PubSub, withFilter } = require("graphql-subscriptions")
const { Message } = require("../models/Message")
const { User } = require("../models/User")

const pubsub = new PubSub()

const MESSAGE_ADDED = "newMessage"

const resolvers = {
    Query: {
        login: async (_, args) => {
            const { email, password } = args;
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("Authentication Error, user not found");
            }
            const matchPassword = await bcrypt.compare(password, user.password);
            if (!matchPassword) {
                throw new Error("Authentication Error, Incorrect password");
            }
            const token = jwt.sign({
                    id: user.id,
                    email,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                "JWT_SKEY_123"
            );
            return { user, token };
        },
        userAuth: async (_, __, { context }) => {
            const { user } = context
            if (!user) {
                throw new Error("Authentication Failed, user not found");
            }
            try {
                const userInfo = await User.findById(user.id);
                if (userInfo) {
                    return userInfo;
                }
            } catch (e) {
                throw new Error(`Authentication Error, ${e}`);
            }
        },
        getAllUsers: async () => {
            try {
                const users = await User.find({});
                return users;
            } catch (e) {
                throw new Error(`Database Error, ${e}`)
            }
        },
        getUserById: async (_, {id}) => {
            try {
                const user = await User.findById(id)
                return user
            } catch (e) {
                throw new Error(`Database Error, ${e}`)
            }
        },
        messageByUser: async (_, {receiverId}, {context}) => {
            const { user } = context
            if (!user) throw new Error("You have to log in")
            const messages = await Message.find({$or: [{senderId: receiverId, receiverId: user.id}, {senderId: user.id, receiverId: receiverId}]})
            return messages

        }
    },

    Message: {
        users: async ({ senderEmail }) => {
            return User.find({ email: senderEmail })
        },
    },

    Mutation: {
        deleteUser: async (_, { email }) => {
            await Promise.all([
                User.findOneAndDelete({ email }),
                Message.deleteMany({ senderEmail: email }),
            ])
            await pubsub.publish("oldUser", { oldUser: email })
            return true
        },

        userTyping: async (_, { email, receiverId }) => {
            await pubsub.publish("userTyping", {
                userTyping: email,
                receiverId,
            })
            return true
        },

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
                newMessage: userText,
                receiverId,
            })
            return userText
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
        userSignUp: async (_, { input }) => {
            try {
                const hashedPassword = bcrypt.hashSync(input.password);
                const newUser = new User({
                    ...input,
                    password: hashedPassword
                });
                return await newUser.save();
            } catch (e) {
                throw new Error(`Sign up error, ${e}`);
            }
        }
    },

    Subscription: {
        newMessage: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(MESSAGE_ADDED),
                (payload, variables) => {
                    return (
                        payload.receiverId === variables.receiverId
                    )
                }
            ),
        },

        newUser: {
            subscribe: (_, {}, { pubsub }) => {
                return pubsub.asyncIterator("newUser")
            },
        },

        oldUser: {
            subscribe: (_, {}, { pubsub }) => {
                return pubsub.asyncIterator("oldUser")
            },
        },

        userTyping: {
            subscribe: withFilter(
                () => pubsub.asyncIterator("userTyping"),
                (payload, variables) => {
                    return (
                        payload.receiverId === variables.receiverId
                    )
                }
            ),
        },
    },
}


module.exports = resolvers
