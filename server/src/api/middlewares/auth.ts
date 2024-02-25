import * as trpcExpress from "@trpc/server/adapters/express";
import pasetoMaker, { Payload } from "../../lib/paseto/paseto";
import { TRPCError } from "@trpc/server";

export async function createContext({req, res }: trpcExpress.CreateExpressContextOptions) {
  let token: string = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token === "") {
    return { sessionPayload: null };
  }

  let payload: Payload;
  try {
    payload = await pasetoMaker.verifyToken(token);
  } catch (error: any) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: error.message });
  }

  return {
    sessionPayload: payload
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
