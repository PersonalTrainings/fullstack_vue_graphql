<template>
  <v-container text-xs-center>
    <!-- Another way of getting data from query -->
    <!-- <ApolloQuery :query="getPostsQuery">
      <template slot-scope="{ result: { loading, error, data } }">
        <div v-if="loading">Loading...</div>
      
        <div v-else-if="error">Error! {{ error.message }}</div>
      
        <v-flex v-else-if="data && data.getPosts" xs12>
          <v-carousel v-bind="{ 'cycle': true }" interval="3000">
            <v-carousel-item
              v-for="post in data.getPosts"
              :key="post._id"
              :src="post.imageUrl"
            >
            <h1 id="carousel__title">{{ post.title }}</h1>
            </v-carousel-item>
          </v-carousel>
        </v-flex>
      </template>
    </ApolloQuery> -->

    <v-flex xs12>
      <v-carousel v-bind="{ 'cycle': true }" interval="3000">
        <v-carousel-item
          v-for="post in getPosts"
          :key="post._id"
          :src="post.imageUrl"
        >
        <h1 id="carousel__title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
import { gql } from "apollo-boost";

const getPostsQuery = gql`
        query {
          getPosts {
            _id
            title
            imageUrl
            description
            likes
          }
        }
      `;

export default {
  name: "home",
  data() {
    return {
      posts: [],
      getPostsQuery
    }
  },
  apollo: {
    getPosts: {
      query: getPostsQuery,
      result(args) {
        console.dir(args)
      }
    }
  }
};
</script>

<style>
#carousel__title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 5px 5px 0 0;
  padding: 0.5em;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
}
</style>

