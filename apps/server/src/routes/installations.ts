import prisma from "@solar-sales/db";
import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import * as v from "valibot";
import { CreateInstallationsSchema } from "@solar-sales/db";
import { IdParamsSchema } from "@solar-sales/db/common";

const app = new Hono();

app.post(
  "/",
  describeRoute({
    tags: ["Installations"],
    summary: "Create installation for a lead (sale confirmed)",
    responses: {
      201: { description: "Installation created" },
      404: { description: "Lead not found" },
    },
  }),
  validator("json", CreateInstallationsSchema),
  async (c) => {
    const body = c.req.valid("json");

    const lead = await prisma.leads.findUnique({
      where: { id: body.leadId },
    });
    if (!lead) {
      return c.json({ message: "Lead not found" }, 404);
    }

    const installation = await prisma.installations.create({
      data: {
        leadId: body.leadId,
        scheduledAt: new Date(body.scheduledAt),
      },
    });

    return c.json(installation, 201);
  },
);

app.get(
  "/:id",
  describeRoute({
    tags: ["Installations"],
    summary: "Get installation by id",
    responses: {
      200: { description: "Success" },
      404: { description: "Not found" },
    },
  }),
  validator("param", IdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const installation = await prisma.installations.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!installation) {
      return c.json({ message: "Not found" }, 404);
    }
    return c.json(installation, 200);
  },
);

app.patch(
  "/:id/status",
  describeRoute({
    tags: ["Installations"],
    summary: "Update installation status",
    responses: {
      200: { description: "Updated" },
      404: { description: "Not found" },
    },
  }),
  validator("param", IdParamsSchema),
  validator(
    "json",
    v.object({
      status: v.picklist(["PENDING", "IN_PROGRESS", "COMPLETED"]),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const { status } = c.req.valid("json");
    const existing = await prisma.installations.findUnique({
      where: { id },
    });
    if (!existing) {
      return c.json({ message: "Not found" }, 404);
    }
    const updated = await prisma.installations.update({
      where: { id },
      data: { status },
    });
    return c.json(updated, 200);
  },
);

const AddItemSchema = v.object({
  itemType: v.picklist(["SOLAR_PANELS", "BATTERY_STORAGE", "WIND_TURBINES"]),
});

app.post(
  "/:id/items",
  describeRoute({
    tags: ["Installations"],
    summary: "Add item to installation (max 2 same-type per day)",
    responses: {
      201: { description: "Item added" },
      400: { description: "Daily limit reached for this item type" },
      404: { description: "Installation not found" },
    },
  }),
  validator("param", IdParamsSchema),
  validator("json", AddItemSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { itemType } = c.req.valid("json");

    const installation = await prisma.installations.findUnique({
      where: { id },
    });
    if (!installation) {
      return c.json({ message: "Installation not found" }, 404);
    }

    const scheduledDate = new Date(installation.scheduledAt);
    const dayStart = new Date(scheduledDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(scheduledDate);
    dayEnd.setHours(23, 59, 59, 999);

    const sameTypeToday = await prisma.items.count({
      where: {
        itemType,
        installation: {
          scheduledAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      },
    });

    if (sameTypeToday >= 2) {
      return c.json(
        {
          message:
            "Daily limit reached: only 2 installations of this item type are allowed per day.",
        },
        400,
      );
    }

    const item = await prisma.items.create({
      data: {
        installationId: id,
        itemType,
      },
    });

    return c.json(item, 201);
  },
);

app.get(
  "/:id/items",
  describeRoute({
    tags: ["Installations"],
    summary: "List items for an installation",
    responses: {
      200: { description: "Success" },
      404: { description: "Not found" },
    },
  }),
  validator("param", IdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const items = await prisma.items.findMany({
      where: { installationId: id },
    });
    return c.json(items, 200);
  },
);

export default app;
