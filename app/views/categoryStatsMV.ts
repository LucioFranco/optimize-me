import {
  OlapTable,
  ClickHouseEngines,
  MaterializedView,
  Aggregated,
  UInt8,
} from "@514labs/moose-lib";
import { amazonReviewsTable } from "../ingest/amazonReviews";

interface CategoryStatsTarget {
  product_category: string;
  review_count: number & Aggregated<"count", []>;
  avg_rating: number & Aggregated<"avg", [UInt8]>;
  negative_count: number & Aggregated<"countIf", [UInt8]>;
  positive_count: number & Aggregated<"countIf", [UInt8]>;
}

export const categoryStatsTargetTable = new OlapTable<CategoryStatsTarget>(
  "CategoryStatsTarget",
  {
    engine: ClickHouseEngines.AggregatingMergeTree,
    orderByFields: ["product_category"],
  },
);

export const categoryStatsMV = new MaterializedView<CategoryStatsTarget>({
  materializedViewName: "CategoryStatsMV",
  targetTable: categoryStatsTargetTable,
  selectTables: [amazonReviewsTable],
  selectStatement: `
    SELECT
      product_category,
      countState() as review_count,
      avgState(star_rating) as avg_rating,
      countIfState(star_rating <= 2) as negative_count,
      countIfState(star_rating >= 4) as positive_count
    FROM AmazonReview
    GROUP BY product_category
  `,
});
