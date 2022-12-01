import RouteParser from "npm:route-parser";

import type { Handler, Route } from "../types/mod.ts";

/**
 * Route table finder, register and matcher.
 */
class Router {
  private _table: Map<RouteParser, Route> = new Map();

  /**
   * The route table.
   */
  public get routes() {
    return this._table;
  }

  private _check(method: string, path: string): boolean {
    return this._table.has(new RouteParser(`${method}:${path}`));
  }

  private _bind(route: Route): void {
    if (!this._check(route.method, route.path)) {
      this._table.set(new RouteParser(`${route.method}:${route.path}`), route);
    } else {
      throw new Error(`Route ${route.method}:${route.path} is already exists`);
    }
  }

  /**
   * Find route by method and path by matching the route table. Support path parameters by default.
   */
  public find(method: string, path: string): Route | undefined {
    if (this._check(method, path)) {
      return this._table.get(new RouteParser(`${method}:${path}`));
    }

    for (const r of this._table.values()) {
      const route = new RouteParser(r.path);
      if (route.match(path)) {
        return r;
      }
    }
  }

  /**
   * Bind route to route table with `GET` method. Throw an error if it's already exists.
   */
  public get(path: string, handler: Handler): void {
    this._bind({ path, method: "GET", handler });
  }

  /**
   * Bind route to route table with `POST` method. Throw an error if it's already exists.
   */
  public post(path: string, handler: Handler): void {
    this._bind({ path, method: "POST", handler });
  }

  /**
   * Bind route to route table with `PUT` method. Throw an error if it's already exists.
   */
  public put(path: string, handler: Handler): void {
    this._bind({ path, method: "PUT", handler });
  }

  /**
   * Bind route to route table with `DELETE` method. Throw an error if it's already exists.
   */
  public delete(path: string, handler: Handler): void {
    this._bind({ path, method: "DELETE", handler });
  }
}

export default Router;
