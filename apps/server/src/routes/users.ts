import prisma from "@solar-sales/db";
import {
  UsersSchema,
  CreateUsersSchema,
  UpdateUsersSchema,
} from "@solar-sales/db";
import {
  IdParamsSchema,
  PaginationQuerySchema,
  MetaSchema,
} from "@solar-sales/db/common";
import { Hono } from "hono";
import { describeRoute, validator, resolver } from "hono-openapi";
import * as v from "valibot";

const PaginatedUsersSchema = v.object({
  data: v.array(UsersSchema),
  meta: MetaSchema,
});

const app = new Hono();

app.get(
  "/",
  describeRoute({
    tags: ["Users"],
    summary: "Get all users",
    responses: {
      200: {
        description: "Paginated list of users",
        content: {
          "application/json": { schema: resolver(PaginatedUsersSchema) },
        },
      },
    },
  }),
  validator("query", PaginationQuerySchema),
  async (c) => {
    const { limit, offset } = c.req.valid("query");

    const [data, total] = await Promise.all([
      prisma.users.findMany({
        take: limit as number,
        skip: offset as number,
        orderBy: { createdAt: "desc" },
      }),
      prisma.users.count(),
    ]);

    return c.json(
      {
        data,
        meta: {
          total,
          limit: limit as number,
          offset: offset as number,
        },
      },
      200,
    );
  },
);

app.get(
  "/:id",
  describeRoute({
    tags: ["Users"],
    summary: "Get user by id",
    responses: {
      200: {
        description: "User details",
        content: {
          "application/json": { schema: resolver(UsersSchema) },
        },
      },
      404: {
        description: "User not found",
      },
    },
  }),
  validator("param", IdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }
    return c.json(user, 200);
  },
);

app.post(
  "/",
  describeRoute({
    tags: ["Users"],
    summary: "Create a new user",
    responses: {
      201: {
        description: "User created",
        content: {
          "application/json": { schema: resolver(UsersSchema) },
        },
      },
      400: { description: "Invalid input" },
    },
  }),
  validator("json", CreateUsersSchema),
  async (c) => {
    const body = c.req.valid("json");
    const user = await prisma.users.create({ data: body as any });
    return c.json(user, 201);
  },
);

app.patch(
  "/:id",
  describeRoute({
    tags: ["Users"],
    summary: "Update a user",
    responses: {
      200: {
        description: "User updated",
        content: {
          "application/json": { schema: resolver(UsersSchema) },
        },
      },
      400: { description: "Invalid input" },
      404: {
        description: "User not found",
      },
    },
  }),
  validator("param", IdParamsSchema),
  validator("json", UpdateUsersSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    try {
      const user = await prisma.users.update({
        where: { id },
        data: body as any,
      });
      return c.json(user, 200);
    } catch (e) {
      return c.json({ message: "User not found" }, 404);
    }
  },
);

app.delete(
  "/:id",
  describeRoute({
    tags: ["Users"],
    summary: "Delete a user",
    responses: {
      204: { description: "User deleted" },
      404: {
        description: "User not found",
      },
    },
  }),
  validator("param", IdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    try {
      await prisma.users.delete({ where: { id } });
      return c.body(null, 204);
    } catch (e) {
      return c.json({ message: "User not found" }, 404);
    }
  },
);

export default app;
