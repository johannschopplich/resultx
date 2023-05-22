import { describe, expect, expectTypeOf, it } from 'vitest'
import { guardedInvoke } from '../src'

describe('generic tests', () => {
  it('returns a guarded result as object', async () => {
    const result = await guardedInvoke(Promise.resolve(1))
    expect(result.data).toBe(1)
    expect(result.error).toBe(null)
    expectTypeOf(result.data).toEqualTypeOf<number | null>()
    expectTypeOf(result.error).toEqualTypeOf<Error | null>()
  })

  it('returns a guarded result as object with error', async () => {
    const result = await guardedInvoke(Promise.reject(new Error('test')))
    expect(result.data).toBe(null)
    expect(result.error).toBeInstanceOf(Error)
    expect(result.error?.message).toBe('test')
    expectTypeOf(result.data).toEqualTypeOf<null>()
    expectTypeOf(result.error).toEqualTypeOf<Error | null>()
  })

  it('returns a guarded result as an tuple', async () => {
    const [data, error] = await guardedInvoke(Promise.resolve(1))
    expect(data).toBe(1)
    expect(error).toBe(null)
    expectTypeOf(data).toEqualTypeOf<number | null>()
  })

  it('returns a guarded result as an tuple with error', async () => {
    const [data, error] = await guardedInvoke(Promise.reject(new Error('test')))
    expect(data).toBe(null)
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('test')
    expectTypeOf(data).toEqualTypeOf<null>()
  })

  it('returns a error with a overrided type', async () => {
    class CustomError extends Error {}
    const [, error] = await guardedInvoke(
      Promise.reject(new CustomError('test')),
      CustomError,
    )
    expect(error).toBeInstanceOf(CustomError)
    expect(error?.message).toBe('test')
    expectTypeOf(error).toEqualTypeOf<CustomError | null>()
  })

  it('supports using a function instead of a promise', async () => {
    const [data, error] = await guardedInvoke(() => 1)
    expect(data).toBe(1)
    expect(error).toBe(null)
    expectTypeOf(data).toEqualTypeOf<number | null>()
  })

  it('supports using a function instead of a promise with error', async () => {
    const [data, error] = await guardedInvoke(() => {
      throw new Error('test')
    })
    expect(data).toBe(null)
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('test')
    expectTypeOf(data).toEqualTypeOf<null>()
  })

  it('supports using a function instead of a promise with overrided error type', async () => {
    class CustomError extends Error {}
    const [, error] = await guardedInvoke(() => {
      throw new CustomError('test')
    }, CustomError)
    expect(error).toBeInstanceOf(CustomError)
    expect(error?.message).toBe('test')
    expectTypeOf(error).toEqualTypeOf<CustomError | null>()
  })

  it('supports using a function that returns a promise', async () => {
    const [data, error] = await guardedInvoke(async () => 1)
    expect(data).toBe(1)
    expect(error).toBe(null)
    expectTypeOf(data).toEqualTypeOf<number | null>()
  })

  it('supports using a function that returns a promise with error', async () => {
    const [data, error] = await guardedInvoke(async () => {
      throw new Error('test')
    })
    expect(data).toBe(null)
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('test')
    expectTypeOf(data).toEqualTypeOf<null>()
  })

  it('supports using a function that returns a promise with overrided error type', async () => {
    class CustomError extends Error {}
    const [, error] = await guardedInvoke(async () => {
      throw new CustomError('test')
    }, CustomError)
    expect(error).toBeInstanceOf(CustomError)
    expect(error?.message).toBe('test')
    expectTypeOf(error).toEqualTypeOf<CustomError | null>()
  })
})

describe('miscellaneous tests', () => {
  it('parses json', async () => {
    const result = await guardedInvoke(() => {
      return JSON.parse('["test"]')
    })
    expect(result.data).toEqual(['test'])
    expect(result.error).toBe(null)
    if (!result.error)
      expectTypeOf(result.data).toEqualTypeOf<any>()
  })

  it('parses json with error', async () => {
    const result = await guardedInvoke(() => {
      return JSON.parse('[test]')
    })
    expect(result.data).toBe(null)
    expect(result.error).toBeInstanceOf(SyntaxError)
    expectTypeOf(result.data).toMatchTypeOf<null>()
  })

  it('enables type override', async () => {
    let result = await guardedInvoke<{ test: number }>(() => {
      return JSON.parse('[test]')
    }, SyntaxError)
    expect(result.data).toBe(null)
    expect(result.error).toBeInstanceOf(SyntaxError)
    if (result.data)
      expectTypeOf(result.data).toEqualTypeOf<{ test: number }>()
    else expectTypeOf(result.data).toMatchTypeOf<null>()

    result = await guardedInvoke<{ test: number }>(() => {
      return JSON.parse('["test"]')
    })
    expect(result.data).toEqual(['test'])
    expect(result.error).toBe(null)
    if (result.data)
      expectTypeOf(result.data).toEqualTypeOf<{ test: number }>()
    else expectTypeOf(result.data).toMatchTypeOf<null>()
  })

  it('enables go-like error handling', async () => {
    let [dataA, error] = await guardedInvoke(() => 1)
    expect(dataA).toBe(1)
    expect(error).toBe(null)
    expectTypeOf(dataA).toEqualTypeOf<number | null>()
    ;[, error] = await guardedInvoke<string>(() => {
      throw new Error('test')
    })
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('test')
  })
})
