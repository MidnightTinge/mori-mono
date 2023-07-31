import Grid from '../../../../Grid';
import IRoute from '../IRoute';
import Session from '../../../database/models/Session';
import User from '../../../database/models/User';
import crypto from 'crypto';
import sequelize from 'sequelize';
import {CookieOptions, Request, Response, Router} from 'express';
import {compare, hash} from 'bcrypt';

export default {
  root: '/auth',
  router(grid: Grid) {
    const logger = grid.makeLogger('route/auth');
    const router = Router();

    router.get('/', (req: Request, res: Response) => {
      if (!req.session?.session?.id) {
        return res.c401();
      }

      const {token, ...censoredSession} = req.session.session;
      const {password, ...censoredUser} = req.session.user;

      return res.ok(null, {session: censoredSession, user: censoredUser});
    });

    router.post('/register', async (req: Request, res: Response) => {
      if (!grid.config.siteSettings.auth.allowRegistration) {
        console.log(grid.config.siteSettings.auth)
        return res.c404();
      }

      if (!req.body) {
        return res.c400('No body');
      }

      const {username, password} = req.body;
      if (!username || !password) {
        return res.c400('Missing username or password');
      }

      try {
        const user = await grid.db.sql.transaction(async transaction => {
          const existing = await User.findOne({
            where: sequelize.where(sequelize.fn('lower', sequelize.col('username')), username.toLowerCase()),
            transaction,
          });

          if (existing) {
            throw new Error('User already exists');
          }

          const hashed = await hash(password, 10);
          return await User.create(
            {
              username: username,
              password: hashed,
            },
            {transaction},
          );
        });

        const {password: removedPassword, ...censoredUser} = user.dataValues;
        return res.ok(null, censoredUser);
      } catch (e) {
        logger.error(e);
        return res.c400(e.message);
      }
    });

    router.post('/login', async (req: Request, res: Response) => {
      if (!req.body) {
        return res.c400('No body');
      }

      const {username, password} = req.body;
      if (!username || !password) {
        return res.c400('Missing username or password');
      }

      const user = await User.findOne({
        where: sequelize.where(sequelize.fn('lower', sequelize.col('username')), username.toLowerCase()),
      });
      if (user) {
        const match = await compare(password, user.dataValues.password).catch(() => false);
        if (match) {
          const {password: removedPassword, ...censoredUser} = user.dataValues;

          let session: Session;
          try {
            session = await Session.create({
              owner: user.dataValues.id,
              token: crypto.randomBytes(64).toString('hex'),
              expires: new Date(Date.now() + grid.config.http.session.expiration),
            });

            res.cookie(grid.config.http.session.cookie_name, session.dataValues.token, buildCookie());
          } catch (e) {
            return res.c500('The server is currently unable to handle your request. Please try again in a minute.');
          }

          return res.ok(null, censoredUser);
        } else {
          return res.c401('Invalid password');
        }
      } else {
        return res.c401('Invalid password');
      }
    });

    function buildCookie(revoke = false): CookieOptions {
      return {
        expires: new Date(revoke ? 0 : Date.now() + grid.config.http.session.expiration),
        httpOnly: grid.config.http.session.cookie_http_only,
        secure: grid.config.http.session.cookie_secure,
        domain: grid.config.http.session.cookie_domain || undefined,
        path: grid.config.http.session.cookie_path,
        sameSite: 'strict',
      };
    }

    return router;
  },
} satisfies IRoute;

async function jwtBackup() {
  // const user = {} as any;
  // const grid = {} as any;
  //
  // // TODO: the JWT should include a `pin` field. This field should be
  // //       cryptographically secure as it will be used to "pin" a token
  // //       to a session. The value is then stored in a memcache
  // //       (e.g. Redis), and if it's ever revoked then we consider the
  // //       token invalidated. Pin invalidations would be done for the
  // //       basics like password changes, 2FA changes, etc.
  //
  // // const pin = grid.redis.generatePinFor(user.dataValues.id);
  //
  // // It's fine to use `dir` here, there's nothing sensitive in the
  // // token. The pin is purely informational and cannot be to manipulate,
  // // lookup, or otherwise perform actions on behalf of the user.
  // const token = await new EncryptJWT({
  //   uid: user.dataValues.id,
  //   username: user.dataValues.username,
  //   pin: 'soggy, we goofed.',
  // })
  //   .setProtectedHeader({alg: 'dir', enc: 'A256CBC-HS512'})
  //   .setIssuedAt()
  //   .setIssuer('agmk://svc/marilith')
  //   .setAudience('marilith://gateway')
  //   .setExpirationTime('1h')
  //   .encrypt(Buffer.from(grid.config.secrets.auth_jwt, 'hex'));
  //
  // //
  //
  // const jwt = await jwtDecrypt(token, Buffer.from(grid.config.secrets.auth_jwt, 'hex'), {
  //   issuer: 'agmk://svc/marilith',
  //   audience: 'marilith://gateway',
  // });
}
