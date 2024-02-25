import express from "express";
import morgan from "morgan";
import { configs } from "./utils/configs";
import logger from "./lib/logger/logger";
import { sequelize } from "./db/seq/init";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./api/router/_app";
import { createContext } from "./api/middlewares/auth";

const app = express();

if (configs.Env == "development") {
  app.use(morgan("dev"));
}

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext
  })
)

const server = app.listen(configs.Port, () => {
  logger.info(`Server started on port ${configs.Port}`);
  sequelize.sync()
  .then(() => logger.info("DB migration successful"))
  .catch(reason => logger.error(`Error migrating DB: ${reason}`));
});

// Handling graceful shutdown
const shutdown = async (): Promise<void> => {
  logger.info("Graceful shutdown of server started...");

  server.close(async () => {
    logger.info("closing db connection...");
    await sequelize.close();

    logger.info("Server shutdown completed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);