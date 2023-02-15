const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { withFilter, PubSub } = require("graphql-subscriptions");
const { GraphQLError } = require("graphql");

const USER_ONLINE_STATUS = "userOnline";
const pubsub = new PubSub();

const updateAllUsers = async () => {
    const users = await User.find({});
    await pubsub.publish(USER_ONLINE_STATUS, { updateAllUsers: users });

    return users
}

const resolvers = {
    Query: {
        login: async (_, args) => {
            try {
                const { email, password } = args;
                const user = await User.findOne({ email });
                if (!user) {
                    throw new GraphQLError("User not found, please sign up");
                }
                const matchPassword = await bcrypt.compare(password, user.password);
                if (!matchPassword) {
                    throw new GraphQLError("Looks like Incorrect password");
                }
                const token = jwt.sign({
                        id: user.id,
                        email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    },
                    process.env.JWT_SECRET
                );
                return { user, token };
            } catch (e) {
                throw new GraphQLError(e);
            }
        },
        userAuth: async (_, __, { context }) => {
            const { user } = context;
            if (!user) {
                throw new GraphQLError("Authentication Failed, user not found");
            }
            try {
                const userInfo = await User.findById(user.id);
                if (userInfo) {
                    return userInfo;
                }
            } catch (e) {
                throw new GraphQLError(`Authentication Error, ${e}`);
            }
        },
        getUserById: async (_, { id }) => {
            try {
                const user = await User.findById(id);
                return user;
            } catch (e) {
                throw new GraphQLError(`Database Error, ${e}`);
            }
        }
    },

    Mutation: {
        userSignUp: async (_, { input }) => {
            try {
                const hashedPassword = bcrypt.hashSync(input.password);
                const newUser = new User({
                    ...input,
                    password: hashedPassword
                });
                await updateAllUsers()
                return await newUser.save();
            } catch (e) {
                throw new GraphQLError(e);
            }
        },
        removeOnlineStatus: async (_, __, { context }) => {
            const { user } = context;
            const updatedUser = await User.findOneAndUpdate(
                { _id: user.id },
                { $set: { isOnline: false } },
                { new: true }
            );

            await updateAllUsers()
            return updatedUser;
        },
        setIsUserOnline: async (_, __, { context }) => {
            const {user} = context;
            const updatedUser = await User.findOneAndUpdate(
                { _id: user.id },
                { $set: { isOnline: true, lastSeen: new Date() } },
                { new: true }
            );
            await updateAllUsers()

            return updatedUser
        },
    },

    Subscription: {
        updateAllUsers: {
            subscribe: () => pubsub.asyncIterator(USER_ONLINE_STATUS)
        },
    },
};


module.exports = resolvers;