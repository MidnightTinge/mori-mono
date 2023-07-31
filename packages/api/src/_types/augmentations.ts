// Express
import {Request as EReq, Response as ERes} from 'express';
import {ISession} from '../services/database/models/Session';
import {IUser} from '../services/database/models/User';

// overwrite Request to include our custom properties
declare module 'express' {
  interface Request {
    session: {
      session: ISession,
      user: IUser,
    };
  }

  interface Response {
    response: (ok: boolean, m: string, data: any) => void;
    ok: (m?: string | any, data?: any | never) => void;
    nok: (m?: string) => void;

    c404: (m?: string) => void;
    c500: (m?: string) => void;
    c400: (m?: string) => void;
    c401: (m?: string) => void;
    c403: (m?: string) => void;
    c405: (m?: string) => void;
    c409: (m?: string) => void;
    c429: (m?: string) => void;
    c503: (m?: string) => void;

    fromPromise: <T>(promise: Promise<T>, blankOrEmptyIsOk?: boolean) => void;
    fromNullablePromise: <T>(promise: Promise<T | null>) => void;
    fromVoidPromise: (promise: Promise<void>) => void;
  }
}
