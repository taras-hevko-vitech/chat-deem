import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

let httpLink = createHttpLink({
    uri: "http://localhost:1000/graphql"
});

const authLink = setContext(async(_, {headers}) => {
    const token = localStorage.getItem("token")
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
        }
    }
})

httpLink = authLink.concat(httpLink)

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "no-cache",
            errorPolicy: "ignore"
        }
    }
});
