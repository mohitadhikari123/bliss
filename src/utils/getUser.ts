import jwt from "jsonwebtoken";
export const getUser = (token: string) => {
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};
