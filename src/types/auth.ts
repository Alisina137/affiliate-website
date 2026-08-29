// src/types/auth.ts

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
  }

  interface JWT {
    id: string;
    role: string;
  }
}

export {};
