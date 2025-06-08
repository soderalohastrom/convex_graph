/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as agent from "../agent.js";
import type * as auth from "../auth.js";
import type * as entities from "../entities.js";
import type * as http from "../http.js";
import type * as prompts from "../prompts.js";
import type * as router from "../router.js";
import type * as thoughts from "../thoughts.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  agent: typeof agent;
  auth: typeof auth;
  entities: typeof entities;
  http: typeof http;
  prompts: typeof prompts;
  router: typeof router;
  thoughts: typeof thoughts;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
