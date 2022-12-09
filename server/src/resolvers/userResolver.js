const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User")

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
                process.env.JWT_SECRET
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
                return await newUser.save();
            } catch (e) {
                throw new Error(`Sign up error, ${e}`);
            }
        }
    }
}


module.exports = resolvers
