const http = require("http");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { WebSocketServer } = require("ws");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const cors = require("cors");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { useServer } = require("graphql-ws/lib/use/ws");
const mongoose = require("mongoose");
const context = require("./middleware/auth");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 1000;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql"
});

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
    schema,
    context: context,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer })
    ],
    playground: {
        settings: {
            "editor.theme": "light"
        }
    }
});

(async () => {
    useServer({ schema }, wsServer);
    await server.start();
    server.applyMiddleware({ app });
    httpServer.listen({ port: PORT }, () => {
        console.log(`endpoint started at http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`);
    });
})();