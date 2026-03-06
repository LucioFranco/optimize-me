import {
  OlapTable,
  ClickHouseEngines,
  UInt8,
  UInt32,
  UInt64,
} from "@514labs/moose-lib";

interface AmazonReview {
  review_date: Date;
  marketplace: string;
  customer_id: UInt64;
  review_id: string;
  product_id: string;
  product_parent: UInt64;
  product_title: string;
  product_category: string;
  star_rating: UInt8;
  helpful_votes: UInt32;
  total_votes: UInt32;
  vine: boolean;
  verified_purchase: boolean;
  review_headline: string;
  review_body: string;
}

export const amazonReviewsTable = new OlapTable<AmazonReview>("AmazonReview", {
  engine: ClickHouseEngines.MergeTree,
  orderByFields: ["review_id", "customer_id"],
});
