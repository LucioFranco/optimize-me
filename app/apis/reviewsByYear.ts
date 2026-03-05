import { Api, sql } from "@514labs/moose-lib";

interface Params {
  category?: string;
}

interface Response {
  year: number;
  reviews: number;
}

export default new Api<Params, Response>(
  "reviewsByYear",
  async ({ category }, { client }) => {
    const query = category
      ? sql`
        SELECT
          toYear(review_date) as year,
          count() as reviews
        FROM AmazonReview
        WHERE product_category = ${category}
        GROUP BY year
        ORDER BY year
      `
      : sql`
        SELECT
          toYear(review_date) as year,
          count() as reviews
        FROM AmazonReview
        GROUP BY year
        ORDER BY year
      `;
    const result = await client.query.execute<Response>(query);
    return result.toJSON();
  },
);
