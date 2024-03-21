import { publicProcedure, router, t } from "../trpc";
import { apiKeyRouter } from "./apiKey";
import { authRouter } from "./auth";
import { userRouter } from "./user";

export const appRouter = router({
  users: userRouter,
  auth: authRouter,
  apikeys: apiKeyRouter,
  healthcheck: publicProcedure.query(async () => {
    return {
      status: "success",
      message: "server is healthy"
    }
  }),
});

export type AppRouter = typeof appRouter;
