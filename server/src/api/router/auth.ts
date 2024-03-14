import { z } from "zod"
import { protectedProcedure, publicProcedure, router } from "../trpc"
import { User } from "../../db/seq/init";
import { TRPCError } from "@trpc/server";
import { checkPassword } from "../../lib/password/password";
import pasetoMaker from "../../lib/paseto/paseto";
import { sanitizeUser } from "./helpers";

`
POST /auth/login
POST /auth/logout
`

export const authRouter = router({
  login: publicProcedure.input(z.object({
    username: z.string(),
    password: z.string()
  })).mutation(async (opts) => {
    const { input } = opts;

    const user = await User.findOne({ where: { username: input.username } })
    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    const isMatched = await checkPassword(input.password, user.getDataValue("passwordHash"));
    if (!isMatched) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
    }

    const { token, payload } = await pasetoMaker.createToken(user.getDataValue("id"), user.getDataValue("email"), 25, {});

    return {
      status: "success",
      message: "Login successfully",
      data: {
        user: sanitizeUser(user),
        accessToken: {
          token,
          expiryTime: payload.expiredAt
        },
      }
    }
  }),
  logout: protectedProcedure.mutation((opts) => {
    return  {
      status: "success",
      message: "Logout successfully"
    }
  })
})