import fetching from './fetching';
import compose from './compose';

function Request() {
  this._options = {};
  this._middlewares = [];
  this._fetch = fetching;

  const methods = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options', 'rpc'];
  methods.forEach((method) => {
    this[method] = async (url, options) => {
      return await this.run(url, { ...options, method });
    };
  });
}

Request.prototype.setOptions = function (options) {
  this._options = options;
}

Request.prototype.use = function (middleware) {
  this._middlewares.push(middleware);
};

Request.prototype.run = async function (url, options) {
  const ctx = {
    stage: 'req',
    req: {
      url,
      options: { ...this._options, ...options },
    },
  };

  try {
    await compose(this._middlewares, ctx);
    ctx.res = await this._fetch(ctx.req);
    ctx.stage = 'res';
    await compose(this._middlewares, ctx);
  } catch (err) {
    console.error(err);
  }

  return ctx;
};

Request.prototype.setFetch = function (fetching) {
  this._fetch = fetching;
}

export default Request;
