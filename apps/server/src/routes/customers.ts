import { Hono } from "hono";
import * as v from "valibot";
import prisma from "@solar-sales/db";
import { describeRoute, validator, resolver } from "hono-openapi";
import {
  CustomersSchema,
  CreateCustomersSchema,
  UpdateCustomersSchema,
} from "@solar-sales/db";
import {
  IdParamsSchema,
  PaginationQuerySchema,
  MetaSchema,
} from "@solar-sales/db/common";

const PaginatedCustomersSchema = v.object({
  data: v.array(CustomersSchema),
  meta: MetaSchema,
});

const app = new Hono();

app.get(
  "/",
  describeRoute({
    tags: ["Customers"],
    summary: "Get all customers",
    description: "Returns a paginated list of all customers in the system",
    responses: {
      200: {
        description: "Paginated list of customers",
        content: {
          "application/json": {
            schema: resolver(PaginatedCustomersSchema),
          },
        },
      },
    },
  }),
  validator("query", PaginationQuerySchema),
  async (c) => {
    const { limit, offset } = c.req.valid("query");

    const [customers, total] = await Promise.all([
      prisma.customers.findMany({
        take: limit,
        skip: offset,
      }),
      prisma.customers.count(),
    ]);

    return c.json(
      {
        data: customers,
        meta: {
          total,
          limit,
          offset,
        },
      },
      200,
    );
  },
);

app.get(
  "/:id",
  describeRoute({
    tags: ["Customers"],
    summary: "Get a customer",
    description: "Get a single customer by their UUID",
    responses: {
      200: {
        description: "Customer found",
        content: {
          "application/json": {
            schema: resolver(CustomersSchema),
          },
        },
      },
      404: {
        description: "Customer not found",
      },
    },
  }),
  validator("param", IdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const customer = await prisma.customers.findUnique({ where: { id } });
    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }
    return c.json(customer, 200);
  },
);

app.post(
  "/",
  describeRoute({
    tags: ["Customers"],
    summary: "Create a customer",
    description: "Add a new customer to the database",
    responses: {
      201: {
        description: "Customer created successfully",
        content: {
          "application/json": {
            schema: resolver(CustomersSchema),
          },
        },
      },
      400: {
        description: "Invalid input data",
      },
    },
  }),
  validator("json", CreateCustomersSchema),
  async (c) => {
    const data = c.req.valid("json");
    const customer = await prisma.customers.create({ data });
    return c.json(customer, 201);
  },
);

app.patch(
  "/:id",
  describeRoute({
    tags: ["Customers"],
    summary: "Update a customer",
    description: "Update existing customer information by ID",
    responses: {
      200: {
        description: "Customer updated successfully",
        content: {
          "application/json": {
            schema: resolver(CustomersSchema),
          },
        },
      },
      400: {
        description: "Invalid input data",
      },
      404: {
        description: "Customer not found",
      },
    },
  }),
  validator("param", IdParamsSchema),
  validator("json", UpdateCustomersSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");

    const exists = await prisma.customers.findUnique({ where: { id } });
    if (!exists) {
      return c.json({ error: "Customer not found" }, 404);
    }

    const customer = await prisma.customers.update({
      where: { id },
      data,
    });
    return c.json(customer, 200);
  },
);

app.delete(
  "/:id",
  describeRoute({
    tags: ["Customers"],
    summary: "Delete a customer",
    description: "Remove a customer from the system",
    responses: {
      200: {
        description: "Customer deleted successfully",
        content: {
          "application/json": {
            schema: resolver(CustomersSchema),
          },
        },
      },
      404: {
        description: "Customer not found",
      },
    },
  }),
  validator("param", IdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");

    const exists = await prisma.customers.findUnique({ where: { id } });
    if (!exists) {
      return c.json({ error: "Customer not found" }, 404);
    }

    const customer = await prisma.customers.delete({ where: { id } });
    return c.json(customer, 200);
  },
);

export default app;
