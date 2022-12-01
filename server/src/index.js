const http = require("http");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { WebSocketServer } = require("ws");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { PubSub } = require("graphql-subscriptions");
const cors = require("cors");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { useServer } = require("graphql-ws/lib/use/ws");
const mongoose = require("mongoose");
const authMiddleware = require("./middleware/auth");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 4003;

mongoose.connect(`mongodb+srv://mostwanter:${process.env.DB_PASSWORD}@cluster0.tt5lljq.mongodb.net/?retryWrites=true&w=majority`);

const pubsub = new PubSub();

const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql"
});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const serverCleanup = useServer({ schema }, wsServer);


const server = new ApolloServer({
    schema,
    context: authMiddleware,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    }
                };
            }
        }
    ],
    playground: {
        settings: {
            "editor.theme": "light"
        }
    }
});

(async () => {
    await server.start();
    server.applyMiddleware({ app });
    httpServer.listen({ port: PORT }, () => {
        console.log(`endpoint started at http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`);
    });
})();