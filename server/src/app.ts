import express from "express";
import morgan from "morgan";
import { configs } from "./utils/configs";
import logger from "./lib/logger/logger";
import cors from 'cors';

import { sequelize } from "./db/seq/init";
import * as trpcExpress from "@trpc/server/adapters/express";
import { AppRouter, appRouter } from "./api/router/_app";
import { createContext } from "./api/trpc";

import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';

const app = express();
app.use(cors());

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

export const server = app.listen(configs.Port, () => {
  logger.info(`Server started on port ${configs.Port}`);
  sequelize.sync()
    .then(() => logger.info("DB migration successful"))
    .catch(reason => logger.error(`Error migrating DB: ${reason}`));
});


const wss = new ws.Server({ server });
const handler = applyWSSHandler<AppRouter>({ wss, router: appRouter, createContext });

wss.on('connection', (ws) => {
  logger.info(`➕➕ Connection (${wss.clients.size})`);
  ws.once('close', () => {
    logger.info(`➖➖ Connection (${wss.clients.size})`);
  });
});

// Handling graceful shutdown
const shutdown = async (): Promise<void> => {
  logger.info("Graceful shutdown of server started...");

  server.close(async () => {
    logger.info("closing db connection...");
    await sequelize.close();

    handler.broadcastReconnectNotification();
    wss.close();

    logger.info("Server shutdown completed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
