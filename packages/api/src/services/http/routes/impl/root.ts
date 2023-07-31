import IRoute from '../IRoute';
import {Router} from 'express';

export default {
  root: '/',
  router(grid) {
    const router = Router();

    router.get('/', (req, res) => res.json({ok: true}));

    return router;
  },
} satisfies IRoute;
