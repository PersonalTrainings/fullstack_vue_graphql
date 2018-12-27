const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require('./resolvers');

require('dotenv').config({ path: 'variables.env' });
const User = require('./models/User');
const Post = require('./models/Post');

// const MONGO_URI = 'mongodb://localhost:27017/fullstack-vue-graphql';
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => console.log('Connected to MongoLab instance.'))
  .catch((error) => console.log('Error connecting to MongoLab:', error));

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
