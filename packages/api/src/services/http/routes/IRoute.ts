import Grid from '../../../Grid';
import type {Router} from 'express';

export default interface IRoute {
  root: string;

  router(grid: Grid): Router;
}
