import { config as dotenvConfig } from "dotenv";

export interface Configs {
  Env: string;
  ServerAddr: string;
  Port: number;
  DBURL: string;
  TokenSymmetricKey: string;
}

dotenvConfig({ path: "secrets.env" }); // Load environment variables from .env file

export const configs: Configs = {
	Env: process.env.ENVIRONMENT || "development",
	ServerAddr: process.env.SERVER_ADDRESS || "localhost:3000",
	Port: parseInt(process.env.PORT || "6789", 10),
	DBURL: process.env.DATABASE_URL || "./src/db/db.sqlite",
	TokenSymmetricKey: process.env.TOKEN_SYMMETRIC_KEY || "",
};