import { createMiddleware } from "hono/factory";
import { auth } from "@solar-sales/auth";

type AppVars = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

export const requireAuth = createMiddleware<AppVars>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.user) {
    return c.json({ error: "Unauthorized", message: "Login required" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);

  await next();
});

export const requireAdmin = createMiddleware<AppVars>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session?.user?.role) {
    return c.json({ error: "Forbidden", message: "Admin required" }, 403);
  }

  await next();
});

export const requireActiveOrg = createMiddleware<AppVars>(async (c, next) => {
  const session = c.get("session");

  // Optional: if requireActiveOrg is used alone, you might need to fetch session
  if (!session) {
    const s = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!s?.user) {
      return c.json({ error: "Unauthorized", message: "Login required" }, 401);
    }
    c.set("user", s.user);
    c.set("session", s.session);
  }

  const currentSession = c.get("session");

  if (!currentSession?.activeOrganizationId) {
    return c.json(
      {
        error: "Forbidden",
        message: "Active organization required to access this resource",
      },
      403,
    );
  }

  await next();
});
