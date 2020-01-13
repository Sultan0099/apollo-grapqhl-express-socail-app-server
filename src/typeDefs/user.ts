import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    me : User!
    user(id: ID!): User
    users: [User!]!
  }
  extend type Mutation {
    register(
      email: String!
      username: String!
      name: String!
      password: String!
    ): User
    signIn(email: String!, password: String!): User
    deleteUser(id: ID!): String!
  }

  

  type User {
    id: ID!
    email: String!
    username: String!
    name: String!
    createdAt: String!
    token : String
    posts : [Post]
  }
`;
