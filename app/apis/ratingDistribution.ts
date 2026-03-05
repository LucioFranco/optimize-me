import { Api, sql } from "@514labs/moose-lib";

interface Params {
  category?: string;
}

interface Response {
  star_rating: number;
  reviews: number;
  percentage: number;
}

export default new Api<Params, Response>(
  "ratingDistribution",
  async ({ category }, { client }) => {
    const query = category
      ? sql`
        SELECT
          star_rating,
          count() as reviews,
          round(reviews / sum(reviews) OVER () * 100, 1) as percentage
        FROM AmazonReview
        WHERE product_category = ${category}
        GROUP BY star_rating
        ORDER BY star_rating
      `
      : sql`
        SELECT
          star_rating,
          count() as reviews,
          round(reviews / sum(reviews) OVER () * 100, 1) as percentage
        FROM AmazonReview
        GROUP BY star_rating
        ORDER BY star_rating
      `;
    const result = await client.query.execute<Response>(query);
    return result.toJSON();
  },
);
