import prisma from "@solar-sales/db";
import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import * as v from "valibot";
import {
  CreateAppointmentsSchema,
  UpdateAppointmentsSchema,
} from "@solar-sales/db";
import { IdParamsSchema } from "@solar-sales/db/common";

const app = new Hono();

app.post(
  "/",
  describeRoute({
    tags: ["Appointments"],
    summary: "Create appointment from a lead",
    responses: {
      201: { description: "Appointment created" },
      404: { description: "Lead not found" },
    },
  }),
  validator("json", CreateAppointmentsSchema),
  async (c) => {
    const body = c.req.valid("json");

    const lead = await prisma.leads.findUnique({
      where: { id: body.leadId },
    });
    if (!lead) {
      return c.json({ message: "Lead not found" }, 404);
    }

    const appointment = await prisma.appointments.create({
      data: {
        leadId: body.leadId,
        scheduledAt: new Date(body.scheduledAt),
      },
    });

    await prisma.leads.update({
      where: { id: body.leadId },
      data: { status: "IN_PROGRESS" },
    });

    return c.json(appointment, 201);
  },
);

app.get(
  "/:id",
  describeRoute({
    tags: ["Appointments"],
    summary: "Get appointment by id",
    responses: {
      200: { description: "Success" },
      404: { description: "Not found" },
    },
  }),
  validator("param", IdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const appointment = await prisma.appointments.findUnique({
      where: { id },
    });
    if (!appointment) {
      return c.json({ message: "Not found" }, 404);
    }
    return c.json(appointment, 200);
  },
);

app.patch(
  "/:id/confirm",
  describeRoute({
    tags: ["Appointments"],
    summary: "Confirm appointment",
    responses: {
      200: { description: "Appointment confirmed" },
      404: { description: "Not found" },
    },
  }),
  validator("param", IdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const appointment = await prisma.appointments.findUnique({
      where: { id },
    });
    if (!appointment) {
      return c.json({ message: "Not found" }, 404);
    }
    const updated = await prisma.appointments.update({
      where: { id },
      data: { status: "CONFIRMED", confirmedAt: new Date() },
    });
    return c.json(updated, 200);
  },
);

app.patch(
  "/:id/cancel",
  describeRoute({
    tags: ["Appointments"],
    summary: "Cancel appointment",
    responses: {
      200: { description: "Appointment cancelled" },
      404: { description: "Not found" },
    },
  }),
  validator("param", IdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const appointment = await prisma.appointments.findUnique({
      where: { id },
    });
    if (!appointment) {
      return c.json({ message: "Not found" }, 404);
    }
    const updated = await prisma.appointments.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    return c.json(updated, 200);
  },
);

const AssignSalesmanSchema = v.object({
  salesmanId: v.pipe(v.string(), v.uuid()),
});

app.patch(
  "/:id/assign",
  describeRoute({
    tags: ["Appointments"],
    summary: "Assign salesman to appointment",
    responses: {
      200: { description: "Salesman assigned" },
      404: { description: "Not found" },
    },
  }),
  validator("param", IdParamsSchema),
  validator("json", AssignSalesmanSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const { salesmanId } = c.req.valid("json");

    const appointment = await prisma.appointments.findUnique({
      where: { id },
    });
    if (!appointment) {
      return c.json({ message: "Not found" }, 404);
    }

    const salesman = await prisma.users.findUnique({
      where: { id: salesmanId },
    });
    if (!salesman) {
      return c.json({ message: "Salesman not found" }, 404);
    }

    const updated = await prisma.appointments.update({
      where: { id },
      data: { assignedToId: salesmanId },
    });

    await prisma.leads.update({
      where: { id: appointment.leadId },
      data: { status: "ASSIGNED" },
    });

    return c.json(updated, 200);
  },
);

app.patch(
  "/:id",
  describeRoute({
    tags: ["Appointments"],
    summary: "Update appointment",
    responses: {
      200: { description: "Updated" },
      404: { description: "Not found" },
    },
  }),
  validator("param", IdParamsSchema),
  validator("json", UpdateAppointmentsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const existing = await prisma.appointments.findUnique({
      where: { id },
    });
    if (!existing) {
      return c.json({ message: "Not found" }, 404);
    }
    const updated = await prisma.appointments.update({
      where: { id },
      data: body,
    });
    return c.json(updated, 200);
  },
);

export default app;
