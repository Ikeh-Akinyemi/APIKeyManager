import { APIKey, sequelize } from "../../db/seq/init";
import logger from "../../lib/logger/logger";
import { publicProcedure, router, t } from "../trpc";
import { apiKeyRouter } from "./apiKey";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { observable } from '@trpc/server/observable';
import { Op } from "sequelize";

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
  keyExpiryNotification: publicProcedure.subscription(async () => {
    return observable<{ id: number; name: string; websiteUrl: string }>((emit) => {
      const intervalTime = 200;
      const checkInterval = 10 * 60000;
      
      const timer = setInterval(async () => {
        try {
          const now = new Date();
          const tenMinsLater = new Date(now.getTime() + checkInterval);
  
          const expiringKeys = await APIKey.findAll({
            where: {
              expiryDate: {
                [Op.gt]: now,
                [Op.lt]: tenMinsLater
              }
            }
          });
  
          for (const key of expiringKeys) {
            const { id, name, websiteUrl } = key.get({ plain: true });
            emit.next({ id, name, websiteUrl });
          }
        } catch (error) {
          logger.error(`Error fetching expiring keys: ${error}`);
          emit.error(error);
        }
      }, intervalTime);
  
      return () => {
        clearInterval(timer);
      };
    });
  }),
});

export type AppRouter = typeof appRouter;
