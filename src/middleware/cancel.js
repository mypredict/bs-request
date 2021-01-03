function cancel() {
  const abortControllers = {};
  const timers = {};

  const abortFetch = (abortKey) => {
    if (abortControllers[abortKey]) {
      abortControllers[abortKey].abort();
    }
  };

  return async (ctx, next) => {
    const { stage, req } = ctx;
    const { url, options: { abort, abortId = '', method, timeout } } = req;
    const abortKey = `${abortId}/${method}/${url}`;

    if (timeout) {
      if (abort) {
        abortFetch(abortKey);
        clearTimeout(timers[abortKey]);
      }
      const controller = new AbortController();
      abortControllers[abortKey] = controller;
      ctx.req.options.signal = controller.signal;
      timers[abortKey] = setTimeout(() => {
        abortFetch(abortKey);
        delete abortControllers[abortKey];
      }, timeout);
    }

    if (stage === 'req' && abort) {
      abortFetch(abortKey);
      const controller = new AbortController();
      abortControllers[abortKey] = controller;
      ctx.req.options.signal = controller.signal;
    }

    if (stage === 'res' && abort) {
      delete abortControllers[abortKey];
    }

    next();
  };
}

export default cancel;
