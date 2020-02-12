import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { ApolloServer, ApolloError } from "apollo-server-express";
import mongoose, { Error } from "mongoose";
import bodyParser from "body-parser";

import typeDefs from "./typeDefs";
import resolvers from "./resolvers";
import keys from "./config/key";

import { IContext } from "./interfaces/appollo";

// db
mongoose
  .connect(keys.MONGO_URI || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err: Error) => console.log(err));

// Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Adding Context
  context: ({ req }: { req: express.Request }): IContext => ({ req })
});

const app: express.Application = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());

server.applyMiddleware({ app });

app.listen(PORT, () =>
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
);
