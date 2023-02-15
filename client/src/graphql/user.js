import { gql } from "@apollo/client";

const USER_FIELDS = gql`
    fragment UserFields on User {
        id
        email
        firstName
        lastName
        phoneNo
        createdAt
        updatedAt
        isOnline
        lastSeen
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

export const REMOVE_ONLINE_STATUS = gql`
    ${USER_FIELDS}
    mutation removeOnlineStatus {
      removeOnlineStatus {
        ...UserFields
      }
    }
`

export const UPDATE_ONLINE_STATUS = gql`
    ${USER_FIELDS}
    mutation setIsUserOnline($userId: String!) {
      setIsUserOnline(userId: $userId) {
        ...UserFields
      }
    }
`

export const USER_AUTH = gql`
    ${USER_FIELDS}
    query userAuth {
        userAuth {
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


export const UPDATE_USERS_SUBSCRIPTION = gql`
    ${USER_FIELDS}
    subscription {
      updateAllUsers {
        ...UserFields
      }
    }
`