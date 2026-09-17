import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      guestId?: number;
    } & DefaultSession["user"];
  }
}
