// deno-lint-ignore-file no-explicit-any
import { printf } from "https://deno.land/std@0.166.0/fmt/printf.ts";
import { serve } from "https://deno.land/std@0.166.0/http/server.ts";
import { Reflect } from "https://deno.land/x/deno_reflect@v0.2.1/mod.ts";
import {
  createError,
  HttpError,
} from "https://deno.land/x/http_errors@3.0.0/mod.ts";

import { metakey } from "../decorators/metakey.ts";
import type { Class, Controllers, Handler, Result } from "../types/mod.ts";
import { endpoint, params, querystr, response } from "../utils/mod.ts";

import Router from "./router.ts";

type _Props = {
  port?: number;
  hostname?: string;
  mode?: "http" | "https";
  router?: Router;
};

/**
 * Factory class for http server.
 *
 * ```ts
 * import { Application, register } from 'web_http';
 *
 * const app = new Application(await register('./web/controllers'));
 * app.start();
 * ```
 *
 * If you prefer the manual way.
 *
 * ```ts
 * import { Application } from 'web_http';
 *
 * const app = new Application();
 * app.get('/', (req, res) => {
 *  // ...
 * });
 * app.start();
 * ```
 */
class Application {
  constructor(_controllers?: Class[]);
  constructor(_controllers: Class[], _props: Readonly<_Props>);
  constructor(
    private readonly _controllers: Class[] = [],
    private _props: Readonly<_Props> = {
      mode: "http",
      hostname: "127.0.0.1",
      port: 8080,
      router: new Router(),
    },
  ) {
    for (const c of this._controllers) {
      const I = new c();
      const p: string = Reflect.getMetadata(metakey.controller.prefix, c);
      const rs: Controllers = Reflect.getMetadata(metakey.controller.routes, c);

      for (const r of rs) {
        (this._props.router as any)[r.method.toLowerCase()](
          endpoint(p + r.path),
          I[r.handler].bind(I),
        );
      }
    }
  }

  /**
   * Getter for port property. Defaults to `8080`.
   */
  public get port(): number {
    return this._props.port!;
  }

  /**
   * Getter for hostname property. Defaults to `127.0.0.1`
   */
  public get hostname(): string {
    return this._props.hostname!;
  }

  /**
   * Getter for mode property. Defaults to `http`.
   */
  public get mode(): "http" | "https" {
    return this._props.mode!;
  }

  /**
   * Start the http server.
   */
  public async start(): Promise<void> {
    try {
      await serve(
        (req) => {
          return this._handle(req);
        },
        {
          port: this._props.port,
          hostname: this._props.hostname,
          onListen({ hostname, port }) {
            printf("Server listening on http://%s:%d\n\n", hostname, port);
          },
        },
      );
    } catch (ex) {
      console.error(ex);
      Deno.exit(1);
    }
  }

  private async _handle(req: Request): Promise<Response> {
    try {
      const { pathname } = new URL(req.url);
      const rt = this._props.router?.find(req.method, pathname);

      if (rt) {
        const s = performance.now();

        // handle request
        const p = params(rt.path, pathname);
        const q = querystr(req.url);
        const rq = Object.assign(req, { params: p, query: q });

        // handle response
        const hd = new Headers();
        const hn = <Result> await rt.handler(rq, hd);
        const rs = hn
          ? response(hn.data, this._headers)
          : response(null, this._headers);
        hn?.headers.forEach((v, k) => rs.headers.set(k, v));

        const e = performance.now();
        const d = e - s;

        this._log(req, rs.status, d);

        return rs;
      } else {
        throw createError(404, "Not Found");
      }
    } catch (ex) {
      (ex as any)["statusCode"] === undefined && console.error(ex);

      const err = ex instanceof HttpError ? ex : createError(500, ex.message);

      this._log(req, err.statusCode, 0);

      const rs = Response.json({
        data: null,
        error: err.toJSON(),
        timestamp: new Date().toISOString(),
      }, { status: err.status, statusText: err.name });

      return rs;
    }
  }

  private get _headers(): Headers {
    const hd = new Headers();

    hd.set("Access-Control-Allow-Origin", "*");
    hd.set("Access-Control-Allow-Credentials", "true");
    hd.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    hd.set("Access-Control-Max-Age", "86400");
    hd.set("X-XSS-Protection", "1; mode=block");
    hd.set("X-Content-Type-Options", "nosniff");
    hd.set("X-Frame-Options", "DENY");
    hd.set("Referrer-Policy", "no-referrer");
    hd.set("X-Permitted-Cross-Domain-Policies", "none");
    hd.set(
      "Content-Security-Policy",
      "default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    );

    return hd;
  }

  private _log(req: Request, status: number, diff: number): void {
    printf(
      "%s %d %s - %2.2fms\n[ %s ]\n\n",
      req.method,
      status,
      req.url,
      diff,
      req.headers.get("User-Agent"),
    );
  }

  /**
   * Register a new route with the `GET` method without instantiate the router (already provided in class property).
   */
  public get<T>(path: string, handler: Handler<T>): void {
    this._props.router?.get(path, handler);
  }

  /**
   * Register a new route with the `POST` method without instantiate the router (already provided in class property).
   */
  public post<T>(path: string, handler: Handler<T>): void {
    this._props.router?.post(path, handler);
  }

  /**
   * Register a new route with the `PUT` method without instantiate the router (already provided in class property).
   */
  public put<T>(path: string, handler: Handler<T>): void {
    this._props.router?.put(path, handler);
  }

  /**
   * Register a new route with the `DELETE` method without instantiate the router (already provided in class property).
   */
  public delete<T>(path: string, handler: Handler<T>): void {
    this._props.router?.delete(path, handler);
  }
}

export default Application;
