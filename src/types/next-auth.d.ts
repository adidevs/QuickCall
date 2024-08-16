import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    name?: string;
    email?: string;
    password?: string;
  }
  interface Session {
    user: {
      _id?: string;
      name?: string;
      email?: string;
    } & DefaultSession["user"];
  }
  interface JWT {
    user: {
      _id?: string;
      name?: string;
      email?: string;
    };
  }
}
