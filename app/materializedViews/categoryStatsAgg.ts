import {
  OlapTable,
  ClickHouseEngines,
  MaterializedView,
  Aggregated,
} from "@514labs/moose-lib";
import { amazonReviewsTable } from "../ingest/amazonReviews";
import { UInt8 } from "@514labs/moose-lib";

interface CategoryStatsAgg {
  productCategory: string;
  reviews: number & Aggregated<"count">;
  avgRating: number & Aggregated<"avg", [UInt8]>;
}

export const categoryStatsAggTable = new OlapTable<CategoryStatsAgg>(
  "CategoryStatsAgg",
  {
    orderByFields: ["productCategory"],
    engine: ClickHouseEngines.AggregatingMergeTree,
  },
);

export const categoryStatsAggMV = new MaterializedView<CategoryStatsAgg>({
  materializedViewName: "CategoryStatsAggMV",
  targetTable: categoryStatsAggTable,
  selectStatement: `
    SELECT
      product_category AS productCategory,
      countState() AS reviews,
      avgState(star_rating) AS avgRating
    FROM AmazonReview
    GROUP BY product_category
  `,
  selectTables: [amazonReviewsTable],
});
