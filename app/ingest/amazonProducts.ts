import {
  OlapTable,
  ClickHouseEngines,
  Float32,
  Int32,
} from "@514labs/moose-lib";

interface AmazonProduct {
  parent_asin: string;
  main_category: string;
  title: string;
  average_rating: Float32;
  rating_number: Int32;
  features: string[];
  description: string[];
  price?: number; // Nullable - many products have no listed price
  store: string;
  categories: string[];
  bought_together: string[];
}

export const amazonProductsTable = new OlapTable<AmazonProduct>(
  "AmazonProduct",
  {
    engine: ClickHouseEngines.MergeTree,
    orderByFields: ["main_category", "parent_asin"],
  },
);
