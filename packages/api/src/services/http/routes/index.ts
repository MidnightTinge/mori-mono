import IRoute from './IRoute';

import root from './impl/root';
import auth from './impl/auth';
import forest from './impl/forest';

export default [
  root,
  auth,
  forest,
] satisfies IRoute[]
