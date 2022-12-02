const { Message } = require("../models/Message");
const { User } = require("../models/User");
const { PubSub, withFilter } = require("graphql-subscriptions");

const Query = {};
const Mutation = {};
const Subscription = {};
const pubsub = new PubSub();

module.exports = {
    Query,
    Mutation,
    Subscription
};