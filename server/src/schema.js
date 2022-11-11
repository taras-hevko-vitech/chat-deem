const {gql} = require("apollo-server-express")

const typeDefs = gql`
    type User {
        id: String!
        firstName: String!
        lastName: String!
        email: String!
        phoneNo: String
        password: String
    }
    
    type Query {
        users: String
        login(email: String!, password: String!): LoginPayload
        userAuth: User
    }
    
    type LoginPayload {
        user: User!
        token: String!
    }
    
    type Mutation {
        userSignUp(input: UserSignUpInput!): User
    }
    input UserSignUpInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        phoneNo: String
    }
`

module.exports = typeDefs;