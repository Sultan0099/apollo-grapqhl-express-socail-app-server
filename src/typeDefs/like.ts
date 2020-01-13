import { gql } from "apollo-server-express";

export default gql`
  
  extend type Mutation {
   likePost(postId : ID!) : Post!
  }

  type Like { 
      id : ID!
      likedBy : String! 
      userId : ID
      likedAt : String!
  }
`;
