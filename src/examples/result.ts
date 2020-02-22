import {RustResult as Result} from '../'

const okay = Result.Ok(123);
const error = Result.Err('failed');


console.log('Ok.unwrap() = ', okay.unwrap()); //123

console.log('Ok.unwrapOr() = ', okay.unwrapOr(456)); //123
console.log('Err.unwrapOr() = ', error.unwrapOr(456)); //456

console.log('Ok.isOk() = ', okay.isOk()); //true
console.log('Ok.isErr() = ', okay.isErr()); //false

console.log('Ok.contains() = ', okay.contains(123)); //true

console.log('Err.containsErr() = ', error.containsErr('failed')); //true

console.log('Ok.ok() = ', okay.ok().toString()); //Some(123)
console.log('Err.ok() = ', error.ok().toString()); //None

console.log('Ok.err() = ', okay.err().toString()); //None
console.log('Err.err() = ', error.err().toString()); //Some("failed")

console.log('Ok.map() = ', okay.map(v=>v*2).toString()); //Ok(246)
console.log('Err.map() = ', error.map(v=>v*2).toString()); //Err("failed")

console.log('Ok.mapOr() = ', okay.mapOr(999, v=>v*2)); //246
console.log('Err.mapOr() = ', error.mapOr(999, v=>v*2)); //999

console.log('Ok.mapOrElse() = ', okay.mapOrElse(()=>1, v=>v*2)); //246
console.log('Err.mapOrElse() = ', error.mapOrElse(()=>1, v=>v*2)); //1

console.log('Ok.mapErr() = ', okay.mapErr(v=>v+'_abc').toString()); //Ok(123)
console.log('Err.mapErr() = ', error.mapErr(v=>v+'_abc').toString()); //Err('failed_abc')

for(const v of okay.iter()){
    console.log('Ok.iter().next() = ', v.toString()); //Ok(123)
}

for(const v of error.iter()){
    console.log('Err.iter().next() = ', v.toString()); //Error("failed")
}

for(const v of okay){
    console.log('Ok iterator = ', v.toString()); //Ok(123)
}

for(const v of error){
    console.log('Err iterator = ', v.toString()); //None
}

const okay234 = Result.Ok(234);
console.log('Ok.and(Err) = ', okay.and(error).toString()); //Error("failed")
console.log('Ok.and(Ok) = ', okay.and(okay234).toString()); //Ok(234)
console.log('Err.and(Ok) = ', error.and(okay).toString()); //Error("failed")
console.log('Err.and(Err) = ', error.and(Result.Err('missed')).toString()); //Error("failed")

console.log('Ok.andThen() = ', okay.andThen(v=>Result.Ok(v-23)).toString()); //Ok(100)
console.log('Err.andThen() = ', error.andThen(v=>Result.Ok(v-23)).toString()); //Error("failed")

console.log('Ok.or(Err) = ', okay.or(error).toString()); //Ok(123)
console.log('Ok.or(Ok) = ', okay.or(okay234).toString()); //Ok(123)
console.log('Err.or(Ok) = ', error.or(okay).toString()); //Ok(123)
console.log('Err.or(Err) = ', error.or(Result.Err('missed')).toString()); //Error("missed")

console.log('Ok.orElse() = ', okay.orElse(()=>Result.Ok(333)).toString()); //Ok(123)
console.log('Err.orElse() = ', error.orElse(()=>Result.Ok(333)).toString()); //Ok(333)

console.log('Ok.unwrapOrElse() = ', okay.unwrapOrElse(()=>567)); //123
console.log('Err.unwrapOrElse() = ', error.unwrapOrElse(()=>567)); //567

try{
    console.log('Ok.expect() = ', okay.expect('failed')); //123
    console.log('Err.expect("missed") = ', error.expect('missed')); //never <- go to catch
}
catch(e){
    console.log('catch on Err.expect("missed") = ', e.message); //missed:  failed
}

try{
    console.log('Err.unwrapErr() = ', error.unwrapErr()); //failed
    console.log('Ok.unwrapErr() = ', okay.unwrapErr()); //never <- go to catch
}
catch(e){
    console.log('catch on Err.unwrapErr() = ', e.message); //Ok value: 123
}

try{
    console.log('Err.expectErr("missed") = ', error.expectErr('missed')); //failed
    console.log('Ok.expectErr() = ', okay.expectErr('missed')); //never <- go to catch
}
catch(e){
    console.log('catch on Ok.expectErr("missed") = ', e.message); //missed: 123
}

import {RustOption as Option} from '../'

const okNone = Result.Ok(Option.None);
const okSome = Result.Ok(Option.Some(123));

console.log('Err.transpose() = ', error.transpose().toString()); //Some(Err("failed"))
console.log('Ok(None).transpose() = ', okNone.transpose().toString()); //None
console.log('Ok(Some).transpose() = ', okSome.transpose().toString()); //Some(Ok(123))


const matchResultByFunc = okay.match({
    Ok: (v)=> v*10,
    Err: (_)=> 555
});
console.log('Ok.match() = ', matchResultByFunc); //1230

const matchResultByValue = error.match({
    Ok: 444,
    Err: 333
});
console.log('Err.match() = ', matchResultByValue); //333


const OkayA = Result.Ok(100);
const OkayB = Result.Ok(100);
console.log('Result::equals() = ', OkayA.equals(OkayB)); //true
console.log('Ok===Ok = ', OkayA === OkayB); //false
console.log('Ok==Ok = ', OkayA == OkayB); //false

