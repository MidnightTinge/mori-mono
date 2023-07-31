import {NextFunction, Request, Response} from 'express';

export default function addFromPromiseAugmentation() {
  return (req: Request, res: Response, next: NextFunction) => {
    res.fromPromise ??= function fromPromise<T>(promise: Promise<T>, blankOrEmptyIsOk = false) {
      return promise
        .then((data) => {
          if (blankOrEmptyIsOk) {
            return res.ok(data);
          } else {
            if (data == null || (Array.isArray(data) && data.length == 0)) {
              return res.status(404).nok('Not Found');
            }

            return res.ok(data);
          }
        })
        .catch((error) => res.nok(error));
    };

    res.fromNullablePromise ??= function fromNullablePromise<T>(promise: Promise<T | null>) {
      return res.fromPromise(promise, true);
    };

    res.fromVoidPromise ??= function fromVoidPromise(promise: Promise<void>) {
      return promise
        .then(() => res.ok())
        .catch((error) => res.nok(error));
    };

    next();
  };
}
