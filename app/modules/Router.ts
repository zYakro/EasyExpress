import Request from "./Request";
import Respond from "./Respond";
import Path from "./Path";

type Next = () => void

type routeCallback = (req: Request, res: Respond, next?: Next) => void

interface RouteHandler {
  path: string,
  method: string,
  callback: routeCallback
}

interface RouterHandler {
  basePath: string,
  router: Router
}

interface Middleware {
  path: string | null,
  callback: (req: Request, res: Respond, next?: Next) => void
}

export default class Router {
  public routes: RouteHandler[];
  public middlewares: Middleware[];
  public routers: RouterHandler[];

  constructor() {
    this.routes = []
    this.middlewares = []
    this.routers = []
  }

  get(path: string, callback: routeCallback) {
    this.routes.push({
      path,
      method: "GET",
      callback
    })
  }

  post(path: string, callback: routeCallback) {
    this.routes.push({
      path,
      method: "POST",
      callback
    })
  }

  delete(path: string, callback: routeCallback) {
    this.routes.push({
      path,
      method: "DELETE",
      callback
    })
  }

  put(path: string, callback: routeCallback) {
    this.routes.push({
      path,
      method: "PUT",
      callback
    })
  }

  use(pathOrHandler: string | routeCallback | Router, handler: routeCallback | Router) {
    if (typeof pathOrHandler === 'string') {
      const path = pathOrHandler

      if (handler && typeof handler === 'function') {
        this.middlewares.push({
          path,
          callback: handler
        })
      } else {
        this.routers.push({
          basePath: path,
          router: handler
        })
      }
    } else {
      if (handler && typeof handler === 'function') {
        this.middlewares.push({
          path: null,
          callback: handler
        })
      } else {
        this.routers.push({
          basePath: "",
          router: handler
        })
      }
    }
  }

  handle(req: Request, res: Respond, nextHandler?: Next) {
    let middlewareIndex = 0;
    let routeIndex = 0;
    let routerIndex = 0;

    const currentUrl = req.url;

    const next = () => {
      // Maps every middleware checking the route and executing the callback in the correct one
      if (middlewareIndex < this.middlewares.length) {
        const {path, callback }= this.middlewares[middlewareIndex++];

        if (this.isMiddlewareRouteMatched(path, currentUrl)) {
          if (path) {
            req.parseParams(path, currentUrl)
          }

          return callback(req, res, next);
        }
        return next();
      }

      // Check every router for the matching url, then executes the handler
      if (routerIndex < this.routers.length) {
        const {basePath, router} = this.routers[routerIndex++];

        if (currentUrl.startsWith(basePath)) {
          // Gets the path slicing the base path, /foo/bar -> /bar
          const trimmedUrl = currentUrl.slice(basePath.length);

          req.url = trimmedUrl

          return router.handle(req, res, next);
        }

        return next();
      }

      if (routeIndex < this.routes.length) {
        const { path, method, callback } = this.routes[routeIndex++];

        if (this.isRouteMatched(path, method, currentUrl, req.method)) {
          if (path) {
            req.parseParams(path, currentUrl)
          }

          return callback(req, res);
        }

        return next();
      }

      // If no more handlers in the current router, call the last router next handler
      if (nextHandler) {
        return nextHandler();
      }
    
      // If route doesn't have a handler, respond with 404
      res.sendStatus(404)
    };

    next();
  }

  private isMiddlewareRouteMatched(path: string | null, url: string): boolean {
    return !path || Path.compare(path, url);
  }

  private isRouteMatched(path: string | null, method: string, url: string, reqMethod: string): boolean {
    return !path || Path.compare(path, url) && method === reqMethod;
  }
}