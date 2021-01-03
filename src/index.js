import Request from './request';
import { cancel } from './middleware';

const request = new Request();
request.setOptions({
  headers: {
    'content-type': 'application/json',
  },
});

request.use(cancel());

export {
  Request,
  cancel,
};

export default request;
