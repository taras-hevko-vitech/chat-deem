const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type Query {
        login(email: String!, password: String!): LoginPayload
        userAuth: User
        getAllUsers: [User]
        messageByUser(receiverEmail: String!): [Message]
    }
    type Mutation {
        userSignUp(input: UserSignUpInput!): User
        deleteUser(username: String!): Boolean!
        userTyping(username: String! receiverEmail: String!): Boolean!
        sendMessage(receiverEmail: String! content: String! timestamp: Float!): Message!
        updateMessage(id: ID! content: String!): Message!
        deleteMessage(id: ID!): Boolean!
    }
    type Subscription {
        newMessage(receiverEmail: String!): Message
        newUser: User
        oldUser: String
        userTyping (receiverEmail: String!): String
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
        senderEmail: String!
        receiverEmail: String!
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