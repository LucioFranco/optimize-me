import { defineQueryModel, sql } from "@514labs/moose-lib";
import { categoryStatsTargetTable } from "../views/categoryStatsMV";

export const categoryStatsModel = defineQueryModel({
  name: "category_stats_benchmark",
  table: categoryStatsTargetTable,
  dimensions: {
    productCategory: { column: "product_category" },
  },
  metrics: {
    reviews: { agg: sql`countMerge(review_count)`, as: "reviews" },
    avgRating: { agg: sql`avgMerge(avg_rating)`, as: "avg_rating" },
  },
  filters: {
    productCategory: {
      column: "product_category",
      operators: ["eq", "in"] as const,
    },
  },
  sortable: ["reviews", "avg_rating"] as const,
  defaults: {
    orderBy: [["reviews", "DESC"]],
    limit: 20,
  },
});
