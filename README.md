# ts-rust

Typescript porting of Rust's [Option](https://doc.rust-lang.org/std/option/enum.Option.html) and [Result](https://doc.rust-lang.org/std/result/enum.Result.html)


## Peoject Goal
- Portaing all TypeScript implementable functions from Rust's Option and Result
- Not snake_case but camelCase
- Debug friendly
- No external dependency

## Prerequirements
- TypeScript target is ES6 or above

```json:tsconfig.json
{
  "compilerOptions": {
    "target": "es6"
  }
}
```

## Install

```
npm instal komasayuki/ts-rust
```


## Usage

### import
```
import {RustOption as Option, RustResult as Result} from 'ts-rust'
```


## Examples

### Option

```
$ npm run example-option
```

[example/option.ts](./src/examples/option.ts)

```
const something = Option.Some(123);
const nothing = Option.None;


console.log('Some.unwrap() = ', something.unwrap()); //123

console.log('Some.unwrapOr() = ', nothing.unwrapOr(456)); //123
console.log('None.unwrapOr() = ', nothing.unwrapOr(456)); //456

console.log('Some.isSome() = ', something.isSome()); //true
console.log('Some.isNone() = ', something.isNone()); //false

...
```

### Result
```
$ npm run example-result
```

[example/result.ts](./src/examples/result.ts)

```
const okay = Result.Ok(123);
const error = Result.Err('failed');


console.log('Ok.unwrap() = ', okay.unwrap()); //123

console.log('Ok.unwrapOr() = ', okay.unwrapOr(456)); //123
console.log('Err.unwrapOr() = ', error.unwrapOr(456)); //456

console.log('Ok.isOk() = ', okay.isOk()); //true
console.log('Ok.isErr() = ', okay.isErr()); //false
```


## unported functions

### Option
- as_deref
- as_deref_mut
- as_mut
- as_pin_mut
- as_pin_ref
- as_ref
- copied
- iter_mut
- unwrap_or_default

### Result
- as_ref
- as_mut
- iter_mut
- copied
- unwrap_or_default
- as_deref_ok
- as_deref_err
- as_deref
- as_deref_mut_ok
- as_deref_mut_err
- as_deref_mut
