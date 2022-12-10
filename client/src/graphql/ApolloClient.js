import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
    uri: "http://localhost:1000/graphql"
});

const wsLink = new GraphQLWsLink(createClient({
    url: "ws://localhost:1000/graphql"
}));

const authLink = setContext(async (_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
        }
    };
});

const splitLink = split(({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    authLink.concat(httpLink)
);

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "no-cache",
            errorPolicy: "ignore"
        }
    }
});
