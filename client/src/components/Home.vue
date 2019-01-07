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

    <v-layout row>
      <v-dialog
        v-model="loading"
        fullscreen
        persistent
      >
        <v-container fill-height>
          <v-layout
            row
            justify-center
            align-center
          >
            <v-progress-circular
              indeterminate
              :size="70"
              :width="7"
              color="secondary"
            ></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <v-flex xs12>
      <v-carousel
        v-if="!loading && posts.length > 0"
        v-bind="{ 'cycle': true }"
        interval="3000"
      >
        <v-carousel-item
          v-for="post in posts"
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
import { GET_POSTS } from "../queries";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "home",
  computed: {
    ...mapGetters(["posts", "loading"])
  },
  data() {
    return {
      getPostsQuery: GET_POSTS
    };
  },
  methods: {
    ...mapActions(["getPosts"])
  },
  created() {
    this.getPosts();
  }
  // apollo: {
  //   getPosts: {
  //     query: GET_POSTS,
  //     result(args) {
  //       console.dir(args)
  //     }
  //   }
  // }
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

