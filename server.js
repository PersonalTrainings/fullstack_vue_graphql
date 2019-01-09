const { ApolloServer, AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Import typeDefs and resolvers
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require('./resolvers');

// Import Environment Variables and mongoose Models
require('dotenv').config({ path: 'variables.env' });
const User = require('./models/User');
const Post = require('./models/Post');

// Connect to MLab Database

// Local URI
// const MONGO_URI = 'mongodb://localhost:27017/fullstack-vue-graphql';
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => console.log('Connected to MongoLab instance.'))
  .catch((error) => console.log('Error connecting to MongoLab:', error));

// Verify JWT Token passed from client
const getUser = async (token) => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (error) {
      throw new AuthenticationError('Your session has ended. Please sign in again.');
    }
  }
};

// Create Apollo/GraphQL Server using typeDefs, resolvers and context object
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => ({
    name: error.name,
    message: error.message.replace('Context creation failed:', '')
  }),
  context: async ({ req }) => {
    const token = req.headers['authorization'];
    return {
      User,
      Post,
      currentUser: await getUser(token)
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
