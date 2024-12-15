import EasyExpressApp from "./modules/EasyExpressApp";
import Router from "./modules/Router";

export const EasyExpress = () => {
  return new EasyExpressApp();
}

EasyExpress.Router = () => {
  return new Router()
}