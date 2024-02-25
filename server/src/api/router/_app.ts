import { t } from "../trpc";
import { apiKeyRouter } from "./apiKey";
import { authRouter } from "./auth";
import { userRouter } from "./user";

export const appRouter = t.router({
  users: userRouter,
  auth: authRouter,
  apikeys: apiKeyRouter
});
export type AppRouter = typeof appRouter;