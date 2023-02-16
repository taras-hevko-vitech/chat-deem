const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Query {
        login(email: String!, password: String!): LoginPayload
        userAuth: User
        getUserById(id: String!): User
        messageByUser(receiverId: String!): [Message]
        getUnreadMessages: [MessageWithUserPayload]
    }
    type Mutation {
        userSignUp(input: UserSignUpInput!): User
        setIsUserOnline: User
        removeOnlineStatus: User
        userTyping(chatId: String!): Boolean!
        sendMessage(chatId: String! content: String!): Message!
        sendFirstMessage(receiverId: String! content: String!): Message!
        markMessagesAsRead(chatId: String!): Boolean
        updateMessage(id: ID! content: String!): Message!
        deleteMessage(id: ID!): Boolean!
    }
    type Subscription {
        newMessage(chatId: String!): Message
        newMessageAndChat(userId: String!): Message
        messageReceived(userId: String!): MessageWithUserPayload
        newUser: User
        updateAllUsers: [User]
        userTyping (chatId: String!): String
    }
    
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        phoneNo: String
        password: String
        createdAt: String
        updatedAt: String
        isOnline: Boolean
        lastSeen: String
    }
    
    type MessageWithUserPayload {
        user: User
        message: Message
    }
    
    type Message {
        id: ID!
        content: String!
        senderId: String!
        chatId: String!
        isRead: Boolean
    }
    
    type LoginPayload {
        user: User!
        token: String!
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