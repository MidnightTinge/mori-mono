import {NextFunction, Request, Response} from 'express';

export default function RequireBody(req: Request, res: Response, next: NextFunction) {
  if (!req?.body) {
    return res.c400();
  }

  next();
}
