import { gql } from "@apollo/client";

const MESSAGE_FIELDS = gql`
    fragment messageFields on Message {
        senderEmail
        receiverEmail
        content
        timestamp
    }
`;


export const SEND_MESSAGE = gql`
    ${MESSAGE_FIELDS}
    mutation sendMessage(
      $receiverEmail: String!
      $content: String!
      $timestamp: Float!
    ) {
      sendMessage(
        receiverEmail: $receiverEmail
        content: $content
        timestamp: $timestamp
      ) {
        ...messageFields
      }
    }
`

export const NEW_MESSAGE_SUBSCRIBE = gql`
    subscription($receiverEmail: String!) {
      newMessage(receiverEmail: $receiverEmail) {
        content
        senderEmail
        receiverEmail
        id
        timestamp
        users {
          email
          firstName
        }
      }
    }
`