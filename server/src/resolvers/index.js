const userResolver = require("./userResolver");
const messageResolver = require("./messageResolver");

module.exports = {
    Query: {
        ...userResolver.Query,
    },
    Mutation: {
        ...userResolver.Mutation,
    },
    Subscription: {
        ...userResolver.Subscription
    }
};