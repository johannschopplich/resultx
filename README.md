# unres

unres is a streamlined utility library that simplifies error handling by wrapping promises or functions and returning an object or tuple with `data` and `error` properties. This eliminates the necessity of using try/catch blocks, enhancing the readability and maintainability of your code:

<table>

<tr>
<th><p><strong>😮‍💨 Before</strong></p></th>
<th><p><strong>🙆‍♂️ After</strong></p></th>
</tr>

<tr>
<td>

```ts
let result

try {
  result = await client.getItems()
}
catch (error) {
  console.error(error)
}
```

</td>
<td>

```ts
import { safeGuard } from 'unres'

const { data, error } = await safeGuard(client.getItems())

if (error)
  console.error(error)
```

</td>
</tr>

</table>

> **Info:**
>
> If you prefer to use tuples instead of objects, you can also destructure the return value of `safeGuard` as a tuple:

```ts
import { safeGuard } from 'unres'

// Destructuring a tuple is also supported
const [data, error] = await safeGuard(client.getItems())
```


## Key Features

- 💆‍♂️ Returns an object or tuple with `data` and `error` properties
- 🛠️ Supports custom rejected Promise error types
- 🦾 Strongly typed

## Installation

Installing unres is as simple as running the following command:

```bash
pnpm add unres

# Or with npm
npm install unres

# Or with yarn
yarn add unres
```

## Usage

Once installed, you can import the `safeGuard` function from unres and use it to wrap promises or functions in your code. Below are some usage examples that illustrate the key functionalities of unres:

### Handling Errors in Async Functions

unres simplifies error handling in asynchronous functions using the `safeGuard` function. If an error occurs, it is assigned to the `error` property and can be handled accordingly.

```ts
import { safeGuard } from 'unres'

const { data, error } = await safeGuard(client.getItems())

if (error)
  console.error(error)
```

### Handling Errors in Functions

The `safeGuard` function can also be used with synchronous functions.

```ts
import { safeGuard } from 'unres'

const { data, error } = await safeGuard(() => {
  if (Math.random() > 0.5)
    return true
  else
    throw new Error('Something went wrong')
})

if (error)
  console.error(error)
```

### Using Tuples

In addition to returning objects, `safeGuard` can also return a tuple containing `data` and `error` values. This provides a neat, organized structure for error management:

```ts
import { safeGuard } from 'unres'

const [data, error] = await safeGuard(client.getItems())

if (error)
  console.error(error)
```

## Custom Error Handling

unres offers the flexibility to implement custom error handling strategies by overriding the default error type. This can be done by passing a custom error type as the second argument to the `safeGuard` function:

```ts
import { safeGuard } from 'unres'

class CustomError extends Error {}

const [data, error] = await safeGuard(() => {
  throw new CustomError('Something went wrong')
}, CustomError)

// The `error` variable will properly typed as `CustomError`
if (error) {
  console.log(error instanceof CustomError) // `true`
  console.error(error)
}
```

## Credits

- [Henrique Cunha](https://github.com/henrycunh) for his [resguard](https://github.com/henrycunh/resguard) library, which inspired this project.
- [Anthony Fu](https://github.com/antfu) for his post on [destructuring with object or array](https://antfu.me/posts/destructuring-with-object-or-array).

## License

[MIT](./LICENSE) License © 2023-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
