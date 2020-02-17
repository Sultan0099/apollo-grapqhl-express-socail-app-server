import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    posts: [Post]!
    paginatedPost(page: Int!, postLength: Int!): PaginatedPost!
    post(id: ID): Post
  }
  extend type Mutation {
    createPost(body: String!): Post
    deletePost(id: ID!): String!
    updatePost(id: ID!, body: String!): Post
  }

  type Post {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
    user: User!
    likes: [Like]
    comments: [Comment]
  }

  type PaginatedPost {
    posts: [Post]!
    hasMore: Boolean!
  }
`;
