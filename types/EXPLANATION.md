# Mathjs TypeScript types

The code base of Mathjs is written in JavaScript. The TypeScript definitions are maintained separately. 

## Library structure

The over all structure is:

- The library exports the core function `create` which creates a MathJS instance and returns `MathJsInstance`.
- Mathjs has a special function `chain`, which allows you to use the functions in a chained way, like `chain(2).add(3).done()`. The function `chain` returns an interface `MathJsChain`, which contains all mathjs functions and constants as a method. Unlike the static functions, these methods are defined with the chain instance `this` as first argument.
- The library exports collections with factory functions of all functions and their dependencies. To create an instance of the function `add`, one can do `create(addDependencies)` for example. To import all functions, one can do `create(all)`.
- The library also returns a static instance, which can directly be used like `import { add } from 'mathjs'`.

## Defining the types of a new function

Maintaining the TypeScript types is done manually. When adding a function, one has to create the following TypeScript definitions:

1. Add a normal definition inside `interface MathJsInstance {...}`
2. Add a chained definition inside `interface MathJsChain {...}`
3. Add a static definition inside `export const {...} : MathJsInstance`
4. Add a dependencies definition inside `export const {...} : Record<string, FactoryFunctionMap>`

For exampe for the function `add`, we can have the following definitions:

```ts 
// instance
export interface MathJsInstance extends MathJsFactory {
  //...
  add<T extends MathType>(x: T, y: T): T
  //...
}

// chain
export interface MathJsChain<TValue> {
  //...  
  add<T extends MathType>(this: MathJsChain<T>, y: T): MathJsChain<T>
  //...
}

// static
export const {
  // ...
  add,
  // ...
} : MathJsInstance


// dependencies
export const {
  // ...
  addDependencies,
  // ...
} : Record<string, FactoryFunctionMap>
```

## Testing the type definitions

The types are defined in `types/index.d.ts`.

The tests for the type definitions are located in `test/typescript-types/testTypes.ts`.

To run the tests for the type definitions:

```
npm run test:types
```
