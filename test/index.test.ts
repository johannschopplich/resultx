import { describe, expect, expectTypeOf, it } from 'vitest'
import { Err, Ok, err, ok, trySafe, unwrap } from '../src'
import type { Result } from '../src'

describe('result type tests', () => {
  it('creates an Ok result', () => {
    const result = ok(1)
    expect(result).toBeInstanceOf(Ok)
    expect(result.ok).toBe(true)
    expect(result.value).toBe(1)
    expectTypeOf(result).toMatchTypeOf<Ok<number>>()
  })

  it('creates an Err result', () => {
    const error = new Error('test')
    const result = err(error)
    expect(result).toBeInstanceOf(Err)
    expect(result.ok).toBe(false)
    expect(result.error).toBe(error)
    expectTypeOf(result).toMatchTypeOf<Err<Error>>()
  })

  it('handles successful synchronous operations', () => {
    const result = trySafe(() => 1)
    expect(result).toBeInstanceOf(Ok)
    assertOk(result)
    expect(result.value).toBe(1)
    expectTypeOf(result).toMatchTypeOf<Ok<number>>()
  })

  it('handles failed synchronous operations', () => {
    const result = trySafe<never, Error>(() => {
      throw new Error('test')
    })
    expect(result).toBeInstanceOf(Err)
    assertErr(result)
    expect(result.error).toBeInstanceOf(Error)
    expect(result.error.message).toBe('test')
    expectTypeOf(result).toMatchTypeOf<Err<unknown>>()
  })

  it('handles successful asynchronous operations', async () => {
    const result = await trySafe(Promise.resolve(1))
    expect(result).toBeInstanceOf(Ok)
    assertOk(result)
    expect(result.value).toBe(1)
    expectTypeOf(result).toMatchTypeOf<Ok<number>>()
  })

  it('handles failed asynchronous operations', async () => {
    const result = await trySafe<never, Error>(Promise.reject(new Error('test')))
    expect(result).toBeInstanceOf(Err)
    assertErr(result)
    expect(result.error).toBeInstanceOf(Error)
    expect(result.error.message).toBe('test')
    expectTypeOf(result).toMatchTypeOf<Err<unknown>>()
  })

  it('supports custom error types', () => {
    class CustomError extends Error {}
    const result = trySafe<number, CustomError>(() => {
      throw new CustomError('test')
    })
    expect(result).toBeInstanceOf(Err)
    assertErr(result)
    expect(result.error).toBeInstanceOf(CustomError)
    expectTypeOf(result).toMatchTypeOf<Result<number, CustomError>>()
  })

  it('allows JSON parsing with type inference', () => {
    const result = trySafe<{ test: number }>(() => JSON.parse('{"test": 1}'))
    expect(result).toBeInstanceOf(Ok)
    assertOk(result)
    expect(result.value).toEqual({ test: 1 })
    expectTypeOf(result).toMatchTypeOf<Ok<{ test: number }>>()
  })

  it('handles JSON parsing errors', () => {
    const result = trySafe(() => JSON.parse('{test: 1}'))
    expect(result).toBeInstanceOf(Err)
    assertErr(result)
    expect(result.error).toBeInstanceOf(SyntaxError)
    expectTypeOf(result).toMatchTypeOf<Err<unknown>>()
  })

  it('unwraps an Ok result', () => {
    const result = ok(1)
    const unwrapped = unwrap(result)
    expect(unwrapped).toEqual({ value: 1, error: undefined })
    expectTypeOf(unwrapped).toMatchTypeOf<{ value: number, error: undefined }>()
  })

  it('unwraps an Err result', () => {
    const error = new Error('test')
    const result = err(error)
    const unwrapped = unwrap(result)
    expect(unwrapped).toEqual({ value: undefined, error })
    expectTypeOf(unwrapped).toMatchTypeOf<{ value: undefined, error: Error }>()
  })

  it('unwraps a result with type inference', () => {
    const result = trySafe(() => 1)
    const unwrapped = unwrap(result)
    expect(unwrapped).toEqual({ value: 1, error: undefined })
    expectTypeOf(unwrapped).toMatchTypeOf<{ value: number | undefined, error: unknown }>()
  })
})

function assertOk<T, E>(result: Result<T, E>): asserts result is Ok<T> {
  if (!(result instanceof Ok)) {
    throw new TypeError('Expected Ok result')
  }
}

function assertErr<T, E>(result: Result<T, E>): asserts result is Err<E> {
  if (!(result instanceof Err)) {
    throw new TypeError('Expected Err result')
  }
}
