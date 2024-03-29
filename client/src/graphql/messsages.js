import { gql } from "@apollo/client";

const MESSAGE_FIELDS = gql`
    fragment messageFields on Message {
        senderId
        chatId
        content
        isRead
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

export const GET_UNREAD_MESSAGES = gql`
${MESSAGE_FIELDS}
    query {
        getUnreadMessages {
           message {
            ...messageFields
           }
           user {
            firstName
            lastName
           }
        }
    }
`

export const UPDATE_MESSAGE_IS_READ = gql`
  mutation markMessagesAsRead($chatId: String!) {
    markMessagesAsRead(chatId: $chatId)
  }
`;

export const SEND_FIRST_MESSAGE = gql`
${MESSAGE_FIELDS}
    mutation sendFirstMessage($receiverId: String! $content: String!) {
      sendFirstMessage(receiverId: $receiverId content: $content) {
        ...messageFields
    }
 }
`;

export const SEND_MESSAGE = gql`
    ${MESSAGE_FIELDS}
    mutation sendMessage(
      $chatId: String!
      $content: String!
    ) {
      sendMessage(
        chatId: $chatId
        content: $content
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

export const NEW_CHAT_SUBSCRIBE = gql`
    ${MESSAGE_FIELDS}
    subscription($userId: String!) {
      newMessageAndChat(userId: $userId) {
         ...messageFields
         }
    }
`

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

export const MESSAGE_RECEIVED_SUBSCRIBE = gql`
${MESSAGE_FIELDS}
    subscription($userId: String!) {
        messageReceived(userId: $userId) {
            message {
                ...messageFields
            }
            user {
              email
              firstName
              lastName
            }
        }
    }
`;