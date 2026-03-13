import { createEnv } from "@t3-oss/env-nextjs";
import { pipe, string, url } from "valibot";
export const env = createEnv({
  client: {
    NEXT_PUBLIC_SERVER_URL: pipe(string(), url()),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },
  emptyStringAsUndefined: true,
});
