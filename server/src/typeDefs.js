const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Query {
        login(email: String!, password: String!): LoginPayload
        userAuth: User
        getAllUsers: [User]
        getUserById(id: String!): User
        messageByUser(receiverId: String!): [Message]
    }
    type Mutation {
        userSignUp(input: UserSignUpInput!): User
        userTyping(chatId: String!): Boolean!
        sendMessage(chatId: String! content: String! timestamp: Float!): Message!
        createNewChat(receiverId: String!): Chat!
        updateMessage(id: ID! content: String!): Message!
        deleteMessage(id: ID!): Boolean!
    }
    type Subscription {
        newMessage(chatId: String!): Message
        newUser: User
        isUserOnline(authUserId: ID!, userId: ID!): IsUserOnlinePayload
        userTyping (chatId: String!): String
    }
    
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        phoneNo: String
        password: String
        timestamp: Float!
    }
    
    type Message {
        id: ID!
        content: String!
        senderId: String!
        chatId: String!
        timestamp: Float!
    }
    
    type Chat {
        id: ID!
        users: [String]
    }
    
    type LoginPayload {
        user: User!
        token: String!
    }
    type IsUserOnlinePayload {
        userId: ID!
        isOnline: Boolean
    }
    
    input UserSignUpInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        phoneNo: String
    }
`;

module.exports = typeDefs;