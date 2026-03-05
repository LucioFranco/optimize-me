import { Api, sql } from "@514labs/moose-lib";

interface Params {
  limit?: number;
}

interface Response {
  product_category: string;
  negative: number;
  positive: number;
  pct_positive: number;
}

export default new Api<Params, Response>(
  "sentimentByCategory",
  async ({ limit = 20 }, { client }) => {
    const result = await client.query.execute<Response>(sql`
      SELECT
        product_category,
        countIf(star_rating <= 2) as negative,
        countIf(star_rating >= 4) as positive,
        round(positive / (negative + positive) * 100, 1) as pct_positive
      FROM AmazonReview
      GROUP BY product_category
      ORDER BY pct_positive ASC
      LIMIT ${limit}
    `);
    return result.toJSON();
  },
);
