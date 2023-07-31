import IRoute from '../IRoute';
import {NextFunction, Request, Response, Router} from 'express';
import {RequireAuth} from '../../middleware/Authenticate';
import Forest from '../../../database/models/Forest';
import Database from '../../../database';

export default {
  root: '/admin',
  router(grid) {
    const router = Router();
    router.use(RequireAuth());

    router.get('/', (req, res: Response) => res.ok());

    return router;
  },
} satisfies IRoute;
