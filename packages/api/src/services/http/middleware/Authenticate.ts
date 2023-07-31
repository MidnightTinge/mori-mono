import {NextFunction, Request, Response} from 'express';
import Grid from '../../../Grid';
import Session from '../../database/models/Session';

export default function Authenticate(bootstrap: Grid) {
  const logger = bootstrap.makeLogger('middleware/authenticate');

  return (req: Request, res: Response, next: NextFunction) => {
    req.session = {
      session: null,
      user: null,
    };

    if (!req.cookies?.[bootstrap.config.http.session.cookie_name]) {
      return next();
    }

    const cookie = req.cookies[bootstrap.config.http.session.cookie_name];
    Session.findOne({
      where: {
        token: cookie,
      },
    }).then(session => {
      if (session) {
        req.session = {
          session: session.dataValues,
          user: null,
        };

        return session.getUser().then(user => {
          req.session.user = user.dataValues;
        });
      }
    }).then(() => {
      next();
    }).catch(err => {
      logger.error(err, 'Failed to authenticate session');
      next();
    });
  };
}

export function RequireAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.session?.id) {
      return res.c401();
    }

    next();
  };
}
