const Generic = _({
  notFound: 'misc/not-found',
});

export default class CodedError extends Error {
  constructor(public code: string, message?: string) {
    super(message);
  }

  static for(code: string, message?: string) {
    return new CodedError(code, message);
  }

  static get GENERIC() {
    return Generic;
  }

  static is(err: any, code: string) {
    return err && 'code' in err && err.code === code;
  }
}

function _<T>(o: T): Readonly<T> {
  return Object.freeze(o);
}
