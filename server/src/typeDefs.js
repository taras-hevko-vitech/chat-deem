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
        userTyping(receiverId: String!): Boolean!
        sendMessage(receiverId: String! content: String! timestamp: Float!): Message!
        updateMessage(id: ID! content: String!): Message!
        deleteMessage(id: ID!): Boolean!
    }
    type Subscription {
        newMessage(receiverId: String! authId: String!): Message
        newUser: User
        userTyping (receiverId: String!): String
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
        receiverId: String!
        timestamp: Float!
        users: [User]
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