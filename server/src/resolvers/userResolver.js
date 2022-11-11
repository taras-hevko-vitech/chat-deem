const {User} = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const Query = {
    users: (_, args) => {
        return "STRING"
    },
    login: async (_, args) => {
        const {email, password} = args;
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error("Authentication Error, user not found")
        }
        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            throw new Error("Authentication Error, Incorrect password")
        }
        const token = jwt.sign({
            id: user.id,
            email,
            firstName: user.firstName,
            lastName: user.lastName
        },
            "JWT_SKEY_123",
            )
        return {user, token}
    },
    userAuth: async (_, __, context) => {
        const { user } = context
        try {
            if (!user) {
                throw new Error("Authentication Failed, try again later plz")
            }
            const userInfo = await User.findById(user.id)
            if (userInfo) {
                return userInfo
            }
        } catch (e) {
            throw new Error(`Authentication Error, ${e}`)
        }
    }
}

const Mutation = {
    userSignUp: async(_, {input}, context) => {
        try {
            const hashedPassword = bcrypt.hashSync(input.password)
            const newUser = new User({
                ...input,
                password: hashedPassword,
            });
            const user = await newUser.save()

            return user
        } catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = {
    Query,
    Mutation
}



//const typeDefs = gql`
//         type Query {
//             getMessages: String
//         }
//         type Mutation {
//             sendMessage(input: String): String
//         }
//         type Subscription {
//             newMessage: String
//         }
// `
//
// const resolvers = {
//     Query: {
//         getMessages() {
//             return "HI"
//         }
//     },
//     Mutation: {
//         sendMessage(_, {input}) {
//             pubsub.publish("NEW_MESSAGE", {newMessage: input});
//             return input;
//         }
//     },
//     Subscription: {
//         newMessage: {
//             subscribe: () => pubsub.asyncIterator(["NEW_MESSAGE"])
//         }
//     }
// }