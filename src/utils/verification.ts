import jwt, { JwtHeader } from "jsonwebtoken";
import keys from "../config/key";
import express from "express";
import { AuthenticationError, UserInputError } from "apollo-server-express";
import { IUserPayload } from "../interfaces/user";
export const checkAuth = ({ req }: { req: express.Request }) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (token) {
            try {
                const userPayload = jwt.verify(token, keys.JWT_SECRET || "");
                if (typeof (userPayload) == "object") {
                    return userPayload
                }

            } catch (err) {
                throw new AuthenticationError("Invalid/Expired token")
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]'")
    }
    throw new Error("Authorization header must be required ")
}