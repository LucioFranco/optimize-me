import {
  OlapTable,
  ClickHouseEngines,
  MaterializedView,
} from "@514labs/moose-lib";
import { amazonReviewsTable } from "../ingest/amazonReviews";

interface CategoryStatsAgg {
  productCategory: string;
  reviews: number;
  totalRating: number;
}

export const categoryStatsAggTable = new OlapTable<CategoryStatsAgg>(
  "CategoryStatsAgg2",
  {
    orderByFields: ["productCategory"],
    engine: ClickHouseEngines.MergeTree,
  },
);

export const categoryStatsAggMV = new MaterializedView<CategoryStatsAgg>({
  materializedViewName: "CategoryStatsAggMV2",
  targetTable: categoryStatsAggTable,
  selectStatement: `
    SELECT
      product_category AS productCategory,
      count() AS reviews,
      sum(star_rating) AS totalRating
    FROM AmazonReview
    GROUP BY product_category
  `,
  selectTables: [amazonReviewsTable],
});
