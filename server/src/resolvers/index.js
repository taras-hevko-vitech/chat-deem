const userResolver = require("./userResolver");
const messageResolver = require("./messageResolver");

module.exports = {
    Query: {
        ...userResolver.Query,
        ...messageResolver.Query
    },
    Mutation: {
        ...userResolver.Mutation,
        ...messageResolver.Mutation
    },
    Subscription: {
        ...messageResolver.Subscription,
        ...userResolver.Subscription
    }
};