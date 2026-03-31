import { Api } from "@514labs/moose-lib";

interface Params {
  category?: string;
  limit?: number;
}

interface Response {
  product_id: string;
  product_title: string;
  reviews: number;
  avg_rating: number;
}

export const topProducts = new Api<Params, Response[]>(
  "topProducts",
  async ({ category, limit = 10 }, { client, sql }) => {
    const query = category
      ? sql`
        SELECT
          product_id,
          product_title,
          count() as reviews,
          avg(star_rating) as avg_rating
        FROM AmazonReview
        WHERE product_category = ${category}
        GROUP BY product_id, product_title
        ORDER BY reviews DESC
        LIMIT ${limit}
      `
      : sql`
        SELECT
          product_id,
          product_title,
          count() as reviews,
          avg(star_rating) as avg_rating
        FROM AmazonReview
        GROUP BY product_id, product_title
        ORDER BY reviews DESC
        LIMIT ${limit}
      `;
    const result = await client.query.execute<Response>(query);
    return result.json();
  },
);
