/**
 * Throw an error if the provided object is null or undefined.
 *
 * Note that we require the error to be provided so that we can preserve the
 * stack trace. Otherwise, the error would come from this file specifically and
 * not the file that called this function.
 *
 * @param obj The object to check
 * @param err The error to throw if the object is null or undefined
 */
export function throwIfNully<T = any>(obj: T, err: Error) {
  if (obj == null) {
    throw err;
  }

  return obj;
}

/**
 * This is a no-op function that is used to indicate that a value is being
 * returned from a scope. This is basically a lazy method to functionally
 * return something from the scope that isn't the result of the previous
 * function.
 *
 * @param obj The object to return
 */
export function fromScope<T = any>(obj: T) {
  return () => obj;
}

/**
 * A chaining function that discards whatever input it receives and returns a
 * void instead. Typically used at the end of a chain of mutations where we
 * don't care about the value, only if it rejected.
 */
export async function toVoid(): Promise<void> {
  return undefined;
}

/**
 * A chaining function that takes a promise and discards its result, returning
 * a void instead. Typically used at the end of a chain of mutations where we
 * don't care about the value, only if it rejected.
 *
 * @param promise The promise to invoke and then discard
 */
export async function asVoid(promise: Promise<any>): Promise<void> {
  return promise.then(toVoid);
}
