export default class ExpressRouterAdapter {
  static adapt (router) {
    return async (req, res) => {
      const httpRequest = { body: req.body };
      const httpResponse = await router.handle(httpRequest);

      res.status(httpResponse.statusCode).json(httpResponse.body);
    };
  }
}
