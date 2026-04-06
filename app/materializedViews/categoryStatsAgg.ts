import {
  OlapTable,
  ClickHouseEngines,
  MaterializedView,
} from "@514labs/moose-lib";
import { amazonReviewsTable } from "../ingest/amazonReviews";

interface CategoryStatsAgg {
  productCategory: string;
  reviews: number;
  avgRating: number;
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
