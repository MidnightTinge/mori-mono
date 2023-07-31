import Grid from '../../Grid';
import IService from '../IService';
import ResFromPromise from './middleware/ResFromPromise';
import ResResponse from './middleware/ResResponse';
import cookieParser from 'cookie-parser';
import express, {Response} from 'express';
import routes from './routes';
import type {Express} from 'express';
import Authenticate from './middleware/Authenticate';
import CodedError from '../../utils/CodedError';

export default class HTTP extends IService {
  #server: Express;

  constructor(grid: Grid) {
    super('http', grid);
  }

  async start() {
    this.#server = express();

    this.#server.use(express.json());
    this.#server.use(express.urlencoded({extended: true}));
    this.#server.use(express.text());
    this.#server.use(cookieParser());
    this.#server.use(ResResponse());
    this.#server.use(ResFromPromise());
    this.#server.use(Authenticate(this.grid));

    for (const route of routes) {
      this.#server.use(route.root, route.router(this.grid));
    }

    this.#server.use((err, req, res: Response, next) => {
      if (err && 'code' in err) {
        const coded = err as CodedError;
        switch (coded.code) {
          case CodedError.GENERIC.notFound: {
            return res.c404();
          }
        }
      }

      this.logger.error(err, 'Unhandled error in HTTP service');
      res.c500();
    });

    return new Promise<void>((res, rej) => {
      // this is being coerced to any due to a type issue in express.
      const handler: any = err => {
        if (err) return rej(err);
        this.logger.info(`HTTP up at http://${this.config.http.host}:${this.config.http.port}`);
        res();
      };

      this.#server.listen(this.config.http.port, this.config.http.host, handler);
    });
  }
}
