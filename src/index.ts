export interface Result<T, E> {
  data: T
  error: E
}

export type IsomorphicDestructurableResult<T, E> = Result<T, E> & readonly [T, E]

type CustomError = new (...args: any[]) => Error

export async function safeGuard<T, E extends CustomError = CustomError>(
  promiseOrFunction: Promise<T> | (() => T | Promise<T>),
  _errorType?: E,
): Promise<IsomorphicDestructurableResult<T | null, InstanceType<E> | null>> {
  try {
    const data = typeof promiseOrFunction === 'function'
      ? await promiseOrFunction()
      : await promiseOrFunction

    return createIsomorphicDestructurable(
      { data, error: null },
      [data, null] as const,
    )
  }
  catch (e) {
    return createIsomorphicDestructurable(
      { data: null, error: e as InstanceType<E> },
      [null, e as InstanceType<E>] as const,
    )
  }
}

function createIsomorphicDestructurable<
  T extends Record<string, unknown>,
  A extends readonly any[],
>(obj: T, arr: A): T & A {
  const clone = { ...obj }

  Object.defineProperty(clone, Symbol.iterator, {
    enumerable: false,
    value() {
      let index = 0
      return {
        next: () => ({
          value: arr[index++],
          done: index > arr.length,
        }),
      }
    },
  })

  return clone as T & A
}
