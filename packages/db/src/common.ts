import * as v from "valibot";

const IdParamsSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
});

const PaginationQuerySchema = v.object({
  limit: v.optional(
    v.pipe(v.string(), v.transform(Number), v.minValue(1), v.maxValue(100)),
    "10",
  ),
  offset: v.optional(
    v.pipe(v.string(), v.transform(Number), v.minValue(0)),
    "0",
  ),
});

const MetaSchema = v.object({
  total: v.number(),
  limit: v.number(),
  offset: v.number(),
});

export { IdParamsSchema, PaginationQuerySchema, MetaSchema };
