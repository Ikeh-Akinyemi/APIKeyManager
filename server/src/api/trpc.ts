import { TRPCError, initTRPC } from "@trpc/server";
import pasetoMaker, { Payload } from "../lib/paseto/paseto";
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';

export const createContext = async ({ req, res }: CreateHTTPContextOptions | CreateWSSContextFnOptions) => {
  let token: string = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    let authVals = req.headers.authorization.split(" ");
    
    if (authVals.length == 2) {
      token = authVals[1];
    }
  }

  if (token === "") {
    return { session: null };
  }

  let payload: Payload;
  try {
      payload = await pasetoMaker.verifyToken(token);
    } catch (error: any) {
      return { session: null };
  }

  return {
    session: payload
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

const protectedProcedure = t.procedure.use(t.middleware(async (opts) => {
  const { session } = opts.ctx;
  return opts.next({
    ctx: {
      session
    }
  });
}));

const publicProcedure = t.procedure;
const router = t.router;

export {
  t,
  protectedProcedure,
  publicProcedure,
  router
};