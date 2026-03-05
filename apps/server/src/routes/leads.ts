import prisma from "@solar-sales/db";
import { Hono } from "hono";
import { describeRoute, validator, resolver } from "hono-openapi";
import * as v from "valibot";
import {
  LeadsSchema,
  CreateLeadsSchema,
  UpdateLeadsSchema,
} from "@solar-sales/db";

import {
  IdParamsSchema,
  PaginationQuerySchema,
  MetaSchema,
} from "@solar-sales/db/common";

const PaginatedSchema = v.object({
  data: LeadsSchema,
  meta: MetaSchema,
});

const app = new Hono();

app.get(
  "/",
  describeRoute({
    tags: ["Leads"],
    summary: "Get leads",
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: resolver(v.array(PaginatedSchema)),
          },
        },
      },
    },
  }),
  validator("query", PaginationQuerySchema),
  async (c) => {
    const { limit, offset } = c.req.valid("query");
    const leads = await prisma.leads.findMany({
      take: limit,
      skip: offset,
    });
    const total = await prisma.leads.count();
    return c.json({ data: leads, meta: { total, limit, offset } }, 200);
  },
);

app.get(
  "/:id",
  describeRoute({
    tags: ["Leads"],
    summary: "Get lead by id",
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: resolver(LeadsSchema),
          },
        },
      },
      404: {
        description: "Lead not found",
      },
    },
  }),
  validator("param", IdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const lead = await prisma.leads.findUnique({
      where: { id },
    });
    if (!lead) {
      return c.json({ message: "Not Found" }, 404);
    }
    return c.json(lead, 200);
  },
);

app.post(
  "/",
  describeRoute({
    tags: ["Leads"],
    summary: "Create lead",
    responses: {
      201: {
        description: "Success",
        content: {
          "application/json": {
            schema: resolver(LeadsSchema),
          },
        },
      },
    },
  }),
  validator("json", CreateLeadsSchema),
  async (c) => {
    const body = c.req.valid("json");
    const lead = await prisma.leads.create({
      data: body,
    });
    return c.json(lead, 201);
  },
);

app.delete(
  "/:id",
  describeRoute({
    tags: ["Leads"],
    summary: "Delete lead by id",
    responses: {
      204: {
        description: "Success",
      },
      404: {
        description: "Lead not found",
      },
    },
  }),
  validator("param", IdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const lead = await prisma.leads.findUnique({
      where: { id },
    });
    if (!lead) {
      return c.json({ message: "Not Found" }, 404);
    }
    await prisma.leads.delete({
      where: { id },
    });
    return c.json({ message: "Not found" }, 404);
  },
);

app.put(
  "/:id",
  describeRoute({
    tags: ["Leads"],
    summary: "Update lead by id",
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: resolver(LeadsSchema),
          },
        },
      },
      404: {
        description: "Lead not found",
      },
    },
  }),
  validator("param", IdParamsSchema),
  validator("json", UpdateLeadsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const lead = await prisma.leads.findUnique({
      where: { id },
    });
    if (!lead) {
      return c.json({ message: "Not Found" }, 404);
    }
    const updatedLead = await prisma.leads.update({
      where: { id },
      data: body,
    });
    return c.json(updatedLead, 200);
  },
);

export default app;
