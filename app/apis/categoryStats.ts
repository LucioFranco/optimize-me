import { Api } from "@514labs/moose-lib";

interface Params {
  limit?: number;
}

interface Response {
  product_category: string;
  reviews: number;
  avg_rating: number;
}

export const categoryStats = new Api<Params, Response>(
  "categoryStats",
  async ({ limit = 20 }, { client, sql }) => {
    const result = await client.query.execute<Response>(sql`
      SELECT
        product_category,
        count() as reviews,
        avg(star_rating) as avg_rating
      FROM AmazonReview
      GROUP BY product_category
      ORDER BY reviews DESC
      LIMIT ${limit}
    `);
    return result.json();
  },
);
