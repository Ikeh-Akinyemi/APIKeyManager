import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "./middlewares/auth";

const t = initTRPC.context<Context>().create();

const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;
  if (!ctx.sessionPayload) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "You are not logged in! Please log in to get access." });
  }

  return opts.next({
    ctx: {
      session: ctx.sessionPayload
    }
  });
});

const publicProcedure = t.procedure;
const router = t.router;

export {
  t,
  protectedProcedure,
  publicProcedure,
  router
};