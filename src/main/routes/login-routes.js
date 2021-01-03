import LoginRouterComposer from "../composers/login-router-composer";
import ExpressRouterAdapter from "../adapters/express-router-adapter";

export default (router) => {
  router.post("/login", ExpressRouterAdapter.adapt(LoginRouterComposer.compose()));
};
