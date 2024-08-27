```javascript

import httpRequestFactory from './httpRequestFactory';

const httpRequestsDebug = httpRequestFactory('debug'); // 返回 debug 环境的请求对象
const httpRequestsProduction = httpRequestFactory('production'); // 返回 production 环境的请求对象

// 使用 debug 环境的请求
httpRequestsDebug.get('/users')
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

// 使用 production 环境的请求
httpRequestsProduction.get('/users')
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```
