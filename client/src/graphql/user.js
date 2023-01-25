import { gql } from "@apollo/client";

const USER_FIELDS = gql`
    fragment UserFields on User {
        id
        email
        firstName
        lastName
        phoneNo
    }
`;

export const USER_SIGNUP = gql`
    ${USER_FIELDS}
    mutation ($input: UserSignUpInput!) {
        userSignUp(input: $input) {
            ...UserFields
        }
    }
`;

export const LOGIN = gql`
    ${USER_FIELDS}
    query ($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          ...UserFields
        }
        token
      }
    }
`;

export const USER_AUTH = gql`
    ${USER_FIELDS}
    query userAuth {
        userAuth {
            ...UserFields
        }
    }
`;

export const GET_USERS = gql`
    ${USER_FIELDS}
    query {
      getAllUsers {
        ...UserFields
      }
    }
`;

export const GET_USER_BY_ID = gql`
    ${USER_FIELDS}
    query ($id: String!) {
        getUserById(id: $id) {
            ...UserFields
        }
    }
`;


export const USER_ONLINE_SUBSCRIPTION = gql`
    subscription Subscription($authUserId: ID!, $userId: ID!) {
      isUserOnline(authUserId: $authUserId, userId: $userId) {
        isOnline
        userId
      }
    }
`