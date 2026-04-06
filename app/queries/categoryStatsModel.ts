import { defineQueryModel, sql } from "@514labs/moose-lib";
import { categoryStatsAggTable } from "../materializedViews/categoryStatsAgg";

export const categoryStatsModel = defineQueryModel({
  name: "category_stats_benchmark",
  table: categoryStatsAggTable,
  dimensions: {
    productCategory: { column: "productCategory" },
  },
  metrics: {
    reviews: { agg: sql`countMerge(reviews)`, as: "reviews" },
    avgRating: { agg: sql`avgMerge(avgRating)`, as: "avg_rating" },
  },
  filters: {
    productCategory: {
      column: "productCategory",
      operators: ["eq", "in"] as const,
    },
  },
  sortable: ["reviews", "avg_rating"] as const,
  defaults: {
    orderBy: [["reviews", "DESC"]],
    limit: 20,
  },
});
