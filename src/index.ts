export type Result<T, E> = Ok<T> | Err<E>

export interface UnwrappedOk<T> { value: T, error: undefined }
export interface UnwrappedErr<E> { value: undefined, error: E }
export type UnwrappedResult<T, E> = UnwrappedOk<T> | UnwrappedErr<E>

export class Ok<T> {
  readonly ok = true
  constructor(readonly value: T) { }
}

export class Err<E> {
  readonly ok = false
  // eslint-disable-next-line node/handle-callback-err
  constructor(readonly error: E) { }
}

export function ok<T>(value: T): Ok<T> {
  return new Ok(value)
}

export function err<E extends string = string>(error: E): Err<E>
export function err<E = unknown>(error: E): Err<E>
export function err<E = unknown>(error: E): Err<E> {
  return new Err(error)
}

export function trySafe<T, E = unknown>(fn: () => T): Result<T, E>
export function trySafe<T, E = unknown>(promise: Promise<T>): Promise<Result<T, E>>
export function trySafe<T, E = unknown>(
  fnOrPromise: (() => T) | Promise<T>,
): Result<T, E> | Promise<Result<T, E>> {
  if (fnOrPromise instanceof Promise) {
    return fnOrPromise
      .then(value => new Ok(value))
      .catch(error => new Err(error as E))
  }

  try {
    return new Ok(fnOrPromise())
  }
  catch (error) {
    return new Err(error as E)
  }
}

export function unwrap<T>(result: Ok<T>): UnwrappedOk<T>
export function unwrap<E>(result: Err<E>): UnwrappedErr<E>
export function unwrap<T, E>(result: Result<T, E>): UnwrappedResult<T, E>
export function unwrap<T, E>(result: Result<T, E>): UnwrappedResult<T, E> {
  return result.ok
    ? { value: result.value, error: undefined }
    : { value: undefined, error: result.error }
}
