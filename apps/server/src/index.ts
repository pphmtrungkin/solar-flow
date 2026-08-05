import { auth } from "@solar-sales/auth";
import { env } from "@solar-sales/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { pinoLogger } from "hono-pino";
import { pino } from "pino";
import { notFound, onError } from "stoker/middlewares";
import { openAPIRouteHandler } from "hono-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import users from "./routes/users";
import leads from "./routes/leads";
import customers from "./routes/customers";
import notes from "./routes/notes";
import appointments from "./routes/appointments";
import installations from "./routes/installations";
import { requireAuth, requireActiveOrg } from "./middleware/auth";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

const logger = pinoLogger({
  pino: {
    base: null,
    transport: {
      target: "hono-pino/debug-log",
      options: {
        colorEnabled: true,
        prettyPrint: true,
      },
    },
    level: "trace",
    timestamp: pino.stdTimeFunctions.unixTime,
  },
});

app.use(logger);
app.notFound(notFound);
app.onError(onError);

app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Request-Id",
      "X-Visitor-Id",
      "X-Requested-With",
      "Accept",
    ],
    exposeHeaders: ["Content-Length"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.text("OK");
});

app.use("/users/*", requireAuth);
app.route("/users", users);

// Protect customers & leads & notes with both auth + active org
app.use("/customers/*", requireAuth, requireActiveOrg);
app.route("/customers", customers);

app.use("/leads/*", requireAuth, requireActiveOrg);
app.route("/leads", leads);

app.use("/notes/*", requireAuth, requireActiveOrg);
app.route("/notes", notes);

app.use("/appointments/*", requireAuth, requireActiveOrg);
app.route("/appointments", appointments);

app.use("/installations/*", requireAuth, requireActiveOrg);
app.route("/installations", installations);

app.get(
  "/doc",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: "Hono API",
        version: "1.0.0",
        description: "Greeting API",
      },
      servers: [{ url: "http://localhost:3000", description: "Local Server" }],
    },
  }),
);

app.get(
  "/scalar",
  Scalar({
    pageTitle: "API Docs (Scalar)",
    theme: "default",
    sources: [
      { url: "/doc", title: "API" },
      { url: "/api/auth/open-api/generate-schema", title: "Auth" },
    ],
  }),
);

export default app;
