# resultx

A lightweight and simple `Result` type for TypeScript, inspired by Rust's Result type.

## Description

`resultx` provides a `Result` type that represents either success (`Ok`) or failure (`Err`). It helps to handle errors in a more explicit and type-safe way, without relying on exceptions.

For error handling in synchronous code, `resultx` provides a `trySafe` function that wraps a function that might throw an error. For asynchronous code, `trySafe` can also be used with promises.

## Key Features

- 🎭  Simple and intuitive `Result` type, wrapping `Ok` and `Err` values
- 🚀 Supports both synchronous and asynchronous operations
- 🛡️ Type-safe error handling
- 🧰 Zero dependencies
- 📦 Tiny bundle size (half a kilobyte minified)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)

## Installation

Installing `resultx` is as simple as running one of the following commands, depending on your package manager:

```bash
pnpm add -D resultx

# Or with npm
npm install -D resultx

# Or with yarn
yarn add -D resultx
```

## Usage

```ts
import { err, ok, trySafe } from 'resultx'

// Create `Ok` and `Err` results
const successResult = ok(42)
//                    ^? Ok<number>
const failureResult = err('Something went wrong')
//                    ^? Err<"Something went wrong">

// Use `trySafe` for error handling
const result = trySafe(() => {
  // Your code that might throw an error
  return JSON.parse('{"key": "value"}')
})

if (result.ok) {
  console.log('Parsed JSON:', result.value)
}
else {
  console.error('Failed to parse JSON:', result.error)
}
```

## API

### `Result`

The `Result` type represents either success (`Ok`) or failure (`Err`).

**Type Definition:**

```ts
type Result<T, E> = Ok<T> | Err<E>
```

#### `Ok`

The `Ok` type wraps a successful value.

**Type Definition:**

```ts
interface Ok<T> {
  readonly ok: true
  readonly value: T
}
```

### `Err`

The `Err` type wraps an error value.

**Type Definition:**

```ts
interface Err<E> {
  readonly ok: false
  readonly error: E
}
```

### `ok`

Shorthand function to create an `Ok` result. Use it to wrap a successful value.

**Type Definition:**

```ts
function ok<T>(value: T): Ok<T>
```

### `err`

Shorthand function to create an `Err` result. Use it to wrap an error value.

**Type Definition:**

```ts
function err<E extends string = string>(err: E): Err<E>
function err<E = unknown>(err: E): Err<E>
```

### `trySafe`

Wraps a function that might throw an error and returns a `Result` with the result of the function.

**Type Definition:**

```ts
function trySafe<T, E = unknown>(fn: () => T): Result<T, E>
function trySafe<T, E = unknown>(promise: Promise<T>): Promise<Result<T, E>>
```

### `unwrap`

Unwraps a `Result` and returns a tuple with the value and error: `{ value, error }`.

**Type Definition:**

```ts
function unwrap<T>(result: Ok<T>): { value: T, error: undefined }
function unwrap<E>(result: Err<E>): { value: undefined, error: E }
```

## Examples

### Basic Usage

A common use case for `Result` is error handling in functions that might fail. Here's an example of a function that divides two numbers and returns a `Result`:

```ts
import { err, ok } from 'resultx'

function divide(a: number, b: number) {
  if (b === 0) {
    return err('Division by zero')
  }
  return ok(a / b)
}

const result = divide(10, 2)
if (result.ok) {
  console.log('Result:', result.value)
}
else {
  console.error('Error:', result.error)
}
```

### Error Handling with `trySafe`

The `trySafe` function is useful for error handling in synchronous code. It wraps a function that might throw an error and returns a `Result`:

```ts
import { trySafe } from 'resultx'

const jsonResult = trySafe(() => JSON.parse('{"key": "value"}'))

if (jsonResult.ok) {
  console.log('Parsed JSON:', jsonResult.value)
}
else {
  console.error('Failed to parse JSON:', jsonResult.error)
}
```

### Async Operations with `trySafe`

For asynchronous operations, `trySafe` can also be used with promises. Here's an example of fetching data from an API:

```ts
import { trySafe } from 'resultx'

async function fetchData() {
  const result = await trySafe(fetch('https://api.example.com/data'))

  if (result.ok) {
    const data = await result.value.json()
    console.log('Fetched data:', data)
  }
  else {
    console.error('Failed to fetch data:', result.error)
  }
}

fetchData()
```

## License

[MIT](./LICENSE) License © 2023-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
