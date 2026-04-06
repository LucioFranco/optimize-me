import { buildQuery } from "@514labs/moose-lib";
import { defineBenchmark } from "./benchmark/core";
import { categoryStatsModel } from "../dist/app/index.js";

const ALL_DIMENSIONS = Object.keys(categoryStatsModel.dimensions ?? {}) as string[];
const ALL_METRICS = Object.keys(categoryStatsModel.metrics ?? {}) as string[];

const baseQuery = () =>
  buildQuery(categoryStatsModel).dimensions(ALL_DIMENSIONS).metrics(ALL_METRICS);

export const benchmark = defineBenchmark({
  baseQuery,
  scenarios: [
    {
      name: "category=Books",
      query: () => baseQuery().filter("productCategory", "eq", "Books"),
    },
  ],
  thresholds: {
    baselineP95Ms: 2000,
    scenarioRegressionRatio: 5.0,
  },
  sampling: {
    baselineRuns: 12,
    scenarioRuns: 6,
  },
});
