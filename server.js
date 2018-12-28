const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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
const MONGO_URI = 'mongodb://localhost:27017/fullstack-vue-graphql';
mongoose
  .connect(
    MONGO_URI,
    { useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => console.log('Connected to MongoLab instance.'))
  .catch((error) => console.log('Error connecting to MongoLab:', error));

// Create Apollo/GraphQL Server using typeDefs, resolvers and context object
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Post
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
