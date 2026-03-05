import { Hono } from "hono";
import {
  NotesSchema,
  UpdateNotesSchema,
  CreateNotesSchema,
} from "@solar-sales/db";
import { IdParamsSchema } from "@solar-sales/db/common";
import { validator, resolver, describeRoute } from "hono-openapi";
import prisma from "@solar-sales/db";

const app = new Hono();

//Retrieve a list of notes based on a lead's id
app.get(
  "/",
  describeRoute({
    tags: ["Notes"],
    summary: "Retrieve a list of notes",
    responses: {
      200: {
        description: "List of notes",
        content: {
          "application/json": {
            schema: resolver(NotesSchema),
          },
        },
      },
    },
  }),
);

app.post(
  "/",
  describeRoute({
    tags: ["Notes"],
    summary: "Create a note",
    requestBody: {
      content: {
        "application/json": {
          schema: CreateNotesSchema,
        },
      },
    },
    responses: {
      200: {
        description: "Note created",
        content: {
          "application/json": {
            schema: resolver(NotesSchema),
          },
        },
      },
    },
  }),
);

//Update a note based on its id
app.put(
  "/:id",
  describeRoute({
    tags: ["Notes"],
    summary: "Update a note",
    requestBody: {
      content: {
        "application/json": {
          schema: UpdateNotesSchema,
        },
      },
    },
    responses: {
      200: {
        description: "Note updated",
        content: {
          "application/json": {
            schema: resolver(NotesSchema),
          },
        },
      },
    },
  }),
);

//Delete a note based on its id
app.delete(
  "/:id",
  describeRoute({
    tags: ["Notes"],
    summary: "Delete a note",
    responses: {
      200: {
        description: "Note deleted",
      },
    },
  }),
  validator("param", IdParamsSchema),
  async (c) => {
    const id = c.req.param("id");
    const note = await prisma.notes.delete({ where: { id } });
    return c.json(note);
  },
);

export default app;
