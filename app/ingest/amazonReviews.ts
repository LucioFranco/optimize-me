import {
  OlapTable,
  ClickHouseEngines,
  Float32,
  Int32,
  Int64,
} from "@514labs/moose-lib";

interface AmazonReview {
  asin: string;
  parent_asin: string;
  user_id: string;
  rating: Float32;
  title: string;
  text: string;
  sort_timestamp: Int64;
  verified_purchase: boolean;
  helpful_votes: Int32;
  category: string; // Not in source data - populated during INSERT
}

export const amazonReviewsTable = new OlapTable<AmazonReview>("AmazonReview", {
  engine: ClickHouseEngines.MergeTree,
  orderByFields: ["parent_asin", "sort_timestamp"],
  partitionBy: "toYYYYMM(fromUnixTimestamp64Milli(sort_timestamp))",
});
