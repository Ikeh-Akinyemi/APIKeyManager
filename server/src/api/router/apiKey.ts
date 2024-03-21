import { TRPCError } from "@trpc/server";
import { APIKey } from "../../db/seq/init";
import pasetoMaker from "../../lib/paseto/paseto";
import { sanitizeToken, truncate } from "../../utils/misc";
import { protectedProcedure, router } from "../trpc"
import logger from "../../lib/logger/logger";
import { z } from "zod";
import { observable } from '@trpc/server/observable';
import { Op } from "sequelize";

`
POST /apikeys
GET /apikeys
GET /apikeys/{apiKeyId}
PUT /apikeys/{apiKeyId}
DELETE /apikeys/{apiKeyId}
`

export const apiKeyRouter = router({
  createAPIKey: protectedProcedure.input(z.object({
    websiteUrl: z.string(),
    name: z.string()
  })).mutation(async (opts) => {
    const { session } = opts.ctx;

    try {
      const { token, payload } = await pasetoMaker.createToken(session.userId, session.email, 60 * 2, {});
      const apiKey = truncate(sanitizeToken(token));
      const res = await APIKey.create({
        userId: session.userId, token: apiKey,
        websiteUrl: opts.input.websiteUrl, name: opts.input.name,
        expiryDate: payload.expiredAt,
        permissions: `READ`
      });

      return {
        status: "success",
        message: "API Key created successfully",
        data: {
          apiKey: res
        }
      }
    } catch (error: any) {
      logger.error(error.message);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }
  }),
  getAPIKeys: protectedProcedure.query(async (opts) => {
    const { session } = opts.ctx;
    try {
      const res = await APIKey.findAll({ where: { userId: session.userId } });
      return {
        status: "success",
        message: "Found user API Keys",
        data: {
          size: res.length,
          apiKeys: res
        }
      }
    } catch (error: any) {
      logger.error(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }
  }),
  addPermission: protectedProcedure.input(z.object({
    permission: z.string(),
    apiKeyId: z.number()
  })).mutation(async (opts) => {
    const { session } = opts.ctx;

    try {
      const apiKey = await APIKey.findOne({ where: { userId: session.userId, id: opts.input.apiKeyId } });
      if (!apiKey) {
        throw new TRPCError({ code: "NOT_FOUND", message: "API Key not found" });
      }

      apiKey.set("permissions", opts.input.permission);
      await apiKey.save();

      return {
        status: "success",
        message: "API Key updated successfully",
        data: {
          apiKkey: apiKey
        }
      }
    } catch (error: any) {
      logger.error(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }
  }),
  updateAPIkey: protectedProcedure.input(z.object({
    name: z.string(),
    apiKeyId: z.number()
  })).mutation(async (opts) => {
    const { session } = opts.ctx;

    try {
      const apiKey = await APIKey.findOne({ where: { userId: session.userId, id: opts.input.apiKeyId } });
      if (!apiKey) {
        throw new TRPCError({ code: "NOT_FOUND", message: "API Key not found" });
      }

      apiKey.set("name", opts.input.name);
      await apiKey.save();

      return {
        status: "success",
        message: "API Key updated successfully",
        data: {
          apiKey: apiKey
        }
      }
    } catch (error: any) {
      logger.error(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }
  }),
  deleteAPIKey: protectedProcedure.input(z.object({
    apiKeyId: z.number()
  })).mutation(async (opts) => {
    const { session } = opts.ctx;

    try {
      const apiKey = await APIKey.findOne({ where: { userId: session.userId, id: opts.input.apiKeyId } });
      if (!apiKey) {
        throw new TRPCError({ code: "NOT_FOUND", message: "API Key not found" });
      }

      await apiKey.destroy();

      return {
        status: "success",
        message: "API Key deleted successfully"
      };
    } catch (error: any) {
      logger.error(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }
  }),
  keyExpiryNotification: protectedProcedure.subscription(async () => {
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
