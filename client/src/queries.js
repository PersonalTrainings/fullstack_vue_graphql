import { gql } from 'apollo-boost';

// Posts Queries
export const GET_POSTS = gql`
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

// Posts Mutations

// User Queries

// User Mutations
