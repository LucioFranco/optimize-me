#!/usr/bin/env bash
set -euo pipefail

S3_URL="https://datasets-documentation.s3.eu-west-3.amazonaws.com/amazon_reviews/amazon_reviews_*.snappy.parquet"

echo "Loading Amazon reviews from S3 parquet files..."
echo "Source: ${S3_URL}"
echo ""

514 clickhouse query "
  INSERT INTO AmazonReview
  SELECT *
  FROM s3('${S3_URL}')
"

echo "Done."
echo ""
echo "Review counts by category:"
514 clickhouse query "SELECT product_category, count() as reviews FROM AmazonReview GROUP BY product_category ORDER BY reviews DESC"
echo ""
echo "Total reviews:"
514 clickhouse query "SELECT count() as total FROM AmazonReview"
