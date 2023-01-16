import { gql } from "@apollo/client";

const MESSAGE_FIELDS = gql`
    fragment messageFields on Message {
        senderId
        receiverId
        content
        timestamp
    }
`;

export const GET_MESSAGES = gql`
    ${MESSAGE_FIELDS}
    query  ($receiverId: String!) {
      messageByUser(receiverId: $receiverId) {
        ...messageFields
      }
    }   
`;

export const SEND_MESSAGE = gql`
    ${MESSAGE_FIELDS}
    mutation sendMessage(
      $receiverId: String!
      $content: String!
      $timestamp: Float!
    ) {
      sendMessage(
        receiverId: $receiverId
        content: $content
        timestamp: $timestamp
      ) {
        ...messageFields
      }
    }
`;

export const USER_TYPING = gql`
  mutation userTyping($receiverId: String!) {
     userTyping(receiverId: $receiverId)
  }
`;

export const NEW_MESSAGE_SUBSCRIBE = gql`
    subscription($receiverId: String!, $authId: String!) {
      newMessage(receiverId: $receiverId, authId: $authId) {
        content
        senderId
        receiverId
        id
        timestamp
        users {
          email
          firstName
        }
      }
    }
`;

export const USER_TYPING_SUBSCRIBE = gql`
    subscription($receiverId: String!) {
        userTyping(receiverId: $receiverId) 
    }
`