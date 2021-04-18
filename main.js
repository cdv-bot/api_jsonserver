const jsonServer = require('json-server')
const queryString = require('query-string');
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

router.render = (req, res) => {
  const header = res.getHeaders();
  const totalCountHeader = header['x-total-count'];
  if (req.method === 'GET' && totalCountHeader) {
    const queryParams = queryString.parse(req._parsedUrl.query);
    const result = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 7,
        _totalRows: Number.parseInt(totalCountHeader)

      }
    }
    return res.jsonp(result);
  }
  res.jsonp(res.locals.data);
}
// Use default router
const PORT = process.env.PORT || 3001;
server.use('/api', router)
server.listen(PORT, () => {
  console.log('JSON Server is running')
})