import { defineQueryModel, count, avg } from "@514labs/moose-lib";
import { amazonReviewsTable } from "../ingest/amazonReviews";

export const categoryStatsModel = defineQueryModel({
  name: "category_stats_benchmark",
  table: amazonReviewsTable,
  dimensions: {
    productCategory: { column: "product_category" },
  },
  metrics: {
    reviews: { agg: count(), as: "reviews" },
    avgRating: { agg: avg(amazonReviewsTable.columns.star_rating), as: "avg_rating" },
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
