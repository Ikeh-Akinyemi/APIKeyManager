import { TRPCError } from "@trpc/server";
import { hashPassword } from "../../lib/password/password";
import { protectedProcedure, publicProcedure, router } from "../trpc"
import { z } from "zod";
import { User } from "../../db/seq/init";
import { UniqueConstraintError } from "sequelize";
import logger from "../../lib/logger/logger";
import { sanitizeUser } from "./helpers";

`POST /users
GET /users/{userId}
PUT /users/{userId}
DELETE /users/{userId}

POST /apikeys/{apiKeyId}/permissions
GET /apikeys/{apiKeyId}/permissions
PUT /apikeys/{apiKeyId}/permissions
DELETE /apikeys/{apiKeyId}/permissions
`

export const userRouter = router({
  create: publicProcedure.input(z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  })).mutation(async (opts) => {
    const { input } = opts;
    if (input.confirmPassword != input.password) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "'confirm_password' is not same with 'password'" });
    }

    try {
      const hash = await hashPassword(input.password);
      const res = await User.create({
        username: input.username,
        email: input.email,
        passwordHash: hash,
      })

      const user = sanitizeUser(res);

      return {
        status: "success",
        message: "User created successfully",
        data: {
          user
        }
      }
    } catch (error: any) {
      if (error instanceof UniqueConstraintError) {
        const [dbErr] = error.errors;
        logger.error(`db error [${dbErr.type}]: ${dbErr.message} on value '${dbErr.value}'`);
        throw new TRPCError({ code: "CONFLICT", message: dbErr.message });
      } else {
        logger.error(error.message);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Internal server error" });
      }
    }
  }),
  getUser: protectedProcedure.query(async (opts) => {
    const { session } = opts.ctx;
    const res = await User.findByPk(session.userId)
    if (!res) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    const user = sanitizeUser(res);

    return {
      status: "success",
      message: "Found user",
      data: {
        user
      }
    }
  }),
  updateUser: protectedProcedure.input(z.object({
    username: z.optional(z.string()),
    email: z.optional(z.string())
  })).mutation(async (opts) => {
    const { session } = opts.ctx;

    let user = await User.findByPk(session.userId);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    if (opts.input.email) {
      user.set("email", opts.input.email)
    }
    if (opts.input.username) {
      user.set("username", opts.input.username)
    }

    user = await user.save();

    return {
      status: "success",
      message: "User updated successfully",
      data: {
        user: sanitizeUser(user)
      }
    };
  }),
  deleteUser: protectedProcedure.mutation(async (opts) => {
    const { session } = opts.ctx;

    const user = await User.findByPk(session.userId);
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    await user.destroy();

    return {
      status: "success",
      message: "User deleted successfully"
    };
  })
});

