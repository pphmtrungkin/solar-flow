import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { pipe, string, url, minLength } from "valibot";

export const env = createEnv({
  server: {
    DATABASE_URL: pipe(string(), url(), minLength(3)),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
