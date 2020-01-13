import { gql } from "apollo-server-express";

export default gql`
 
  extend type Mutation {
    createComment(postId : ID!  body : String) : Post!
    deleteComment(postId : ID!  commentId : ID!): Post!
    updateComment(postId : ID! commentId : ID! body : String!) : Post!
  }

  type Comment { 
      id : ID!
      body : String! 
      commentBy : String!
      userId : String!
      commentAt : String!
  }
`;
