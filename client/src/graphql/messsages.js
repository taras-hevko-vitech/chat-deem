import { gql } from "@apollo/client";

const MESSAGE_FIELDS = gql`
    fragment messageFields on Message {
        senderId
        chatId
        content
        timestamp
    }
`;

const CHAT_FIELDS = gql`
    fragment chatFields on Chat {
        id
        users
    }
`;

export const GET_MESSAGES = gql`
    ${MESSAGE_FIELDS}
    query ($receiverId: String!) {
      messageByUser(receiverId: $receiverId) {
        ...messageFields
      }
    }   
`;

export const CREATE_NEW_CHAT = gql`
${CHAT_FIELDS}
    mutation createNewChat($receiverId: String!) {
      createNewChat(receiverId: $receiverId) {
        ...chatFields
    }
 }
`;

export const SEND_MESSAGE = gql`
    ${MESSAGE_FIELDS}
    mutation sendMessage(
      $chatId: String!
      $content: String!
      $timestamp: Float!
    ) {
      sendMessage(
        chatId: $chatId
        content: $content
        timestamp: $timestamp
      ) {
        ...messageFields
      }
    }
`;

export const USER_TYPING = gql`
  mutation userTyping($chatId: String!) {
     userTyping(chatId: $chatId)
  }
`;

export const NEW_MESSAGE_SUBSCRIBE = gql`
    ${MESSAGE_FIELDS}
    subscription($chatId: String!) {
      newMessage(chatId: $chatId) {
         ...messageFields
         }
    }
`;

export const USER_TYPING_SUBSCRIBE = gql`
    subscription($chatId: String!) {
        userTyping(chatId: $chatId) 
    }
`;