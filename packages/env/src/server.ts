import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { pipe, string, url, picklist, minLength } from "valibot";

const nodeEnv = ["development", "production", "test"] as const;
export const env = createEnv({
  server: {
    DATABASE_URL: pipe(string(), url(), minLength(3)),
    BETTER_AUTH_SECRET: pipe(string(), minLength(32)),
    BETTER_AUTH_URL: pipe(string(), url()),
    CORS_ORIGIN: pipe(string(), url()),
    NODE_ENV: picklist(nodeEnv),
    GMAIL_USER: pipe(string(), minLength(3)),
    GMAIL_PASSWORD: pipe(string(), minLength(15)),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
