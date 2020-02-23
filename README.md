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
$ npm install --save ts-rust
```


## Usage

### import
```
import {RustOption as Option, RustResult as Result} from 'ts-rust'
```

### types
```
const something:Option<number> = Option.Some(123);
const nothing:Option<number> = Option.None;

const okay:Result<number, string> = Result.Ok(222);
const error:Result<number, string> = Result.Err('failed');
```


## Examples

```
import {RustOption as Option, RustResult as Result} from 'ts-rust'

let latestTemperature:Option<number> = Option.None;
const temperatureHistory:number[] = [];

function setTemperature(value:number){
    latestTemperature = Option.Some(value);
    temperatureHistory.push(value);
}

function printLatestTemperature(){
    latestTemperature.match({
        Some: (v)=>console.log('latest temperature = '+ v),
        None: ()=>console.log('no data in history')
    });
}

function findMinusValues(){
    const minusTemperatures = temperatureHistory.filter(v=>v<0);
    if(minusTemperatures.length === 0){
        return Result.Err('no minus value in history')
    }
    else{
        return Result.Ok(minusTemperatures);
    }
}

setTemperature(12);
setTemperature(-3);
setTemperature(5);

printLatestTemperature(); //value=567

const result = findMinusValues();
result.map(v=>console.log('Too cold! temperature = ' + v)); //Too cold! temperature = -3
```



### Option

```
$ npm run example-option
```

[example/option.ts](./src/examples/option.ts)

```
const something = Option.Some(123);
const nothing = Option.None;


console.log('Some.unwrap() = ', something.unwrap()); //123

console.log('Some.unwrapOr() = ', something.unwrapOr(456)); //123
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


## Test & Coverage

```
$ npm run test
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
