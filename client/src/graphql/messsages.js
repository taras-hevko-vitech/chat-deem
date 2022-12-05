import { gql } from "@apollo/client";

const MESSAGE_FIELDS = gql`
    fragment messageFields on Message {
        senderId
        receiverId
        content
        timestamp
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
`

export const NEW_MESSAGE_SUBSCRIBE = gql`
    subscription($receiverId: String!) {
      newMessage(receiverId: $receiverId) {
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
`