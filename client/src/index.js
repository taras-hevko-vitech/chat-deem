import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { client } from "./graphql/ApolloClient";
import App from "./App";
import { ApolloProvider } from "@apollo/client";
import {RecoilRoot} from "recoil"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <RecoilRoot>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </RecoilRoot>
        </ApolloProvider>
    </React.StrictMode>
);
