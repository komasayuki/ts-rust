import {RustOption as Option} from '../'

const something = Option.Some(123);
const nothing = Option.None;


console.log('Some.unwrap() = ', something.unwrap()); //123

console.log('Some.unwrapOr() = ', nothing.unwrapOr(456)); //123
console.log('None.unwrapOr() = ', nothing.unwrapOr(456)); //456

console.log('Some.isSome() = ', something.isSome()); //true
console.log('Some.isNone() = ', something.isNone()); //false

console.log('Some.contains() = ', something.contains(123)); //true

try{
    console.log('Some.expect() = ', something.expect('failed')); //123
    console.log('None.expect("failed") = ', nothing.expect('failed')); //never <- go to catch
}
catch(e){
    console.log('catch on None.expect("failed") = ', e.message); //failed
}

console.log('Some.unwrapOrElse() = ', nothing.unwrapOr(()=>567)); //123
console.log('None.unwrapOrElse() = ', nothing.unwrapOr(()=>567)); //567

console.log('Some.map() = ', something.map(v=>v*2).toString()); //Some(246)
console.log('None.map() = ', nothing.map(v=>v*2).toString()); //None

console.log('Some.mapOr() = ', something.mapOr(999, v=>v*2)); //246
console.log('None.mapOr() = ', nothing.mapOr(999, v=>v*2)); //999

console.log('Some.mapOrElse() = ', something.mapOrElse(()=>1, v=>v*2)); //246
console.log('None.mapOrElse() = ', nothing.mapOrElse(()=>1, v=>v*2)); //1

console.log('Some.okOr() = ', something.okOr(234).toString()); //Ok(123)
console.log('None.okOr() = ', nothing.okOr(234).toString()); //Err(234)

console.log('Some.okOrElse() = ', something.okOrElse(()=>234).toString()); //Ok(123)
console.log('None.okOrElse() = ', nothing.okOrElse(()=>234).toString()); //Err(234)

for(const v of something.iter()){
    console.log('Some.iter().next() = ', v.toString()); //Some(123)
}

for(const v of nothing.iter()){
    console.log('None.iter().next() = ', v.toString()); //None
}

for(const v of something){
    console.log('Some iterator = ', v.toString()); //Some(123)
}

for(const v of nothing){
    console.log('None iterator = ', v.toString()); //None
}

const something234 = Option.Some(234);
console.log('Some.and(None) = ', something.and(nothing).toString()); //None
console.log('Some.and(Some) = ', something.and(something234).toString()); //Some(234)
console.log('None.and(Some) = ', nothing.and(something).toString()); //None
console.log('None.and(Nothing) = ', nothing.and(Option.None).toString()); //None

console.log('Some.andThen() = ', something.andThen(v=>Option.Some(v-23)).toString()); //Some(100)
console.log('None.andThen() = ', nothing.andThen(v=>Option.Some(v-23)).toString()); //None

console.log('Some.filter() = ', something.filter(v=>v%2===0).toString()); //None
console.log('Some(234).filter() = ', something234.filter((v)=>v%2===0).toString()); //Some(234)
console.log('None.filter() = ', nothing.filter(v=>v%2===1).toString()); //None

console.log('Some.or(None) = ', something.or(nothing).toString()); //Some(123)
console.log('Some.or(Some) = ', something.or(something234).toString()); //Some(123)
console.log('None.or(Some) = ', nothing.or(something).toString()); //Some(123)
console.log('None.or(None) = ', nothing.or(Option.None).toString()); //None

console.log('Some.orElse() = ', something.orElse(()=>Option.Some(333)).toString()); //Some(123)
console.log('None.orElse() = ', nothing.orElse(()=>Option.Some(333)).toString()); //Some(333)

console.log('Some.xor(None) = ', something.xor(nothing).toString()); //Some(123)
console.log('Some.xor(Some) = ', something.xor(something234).toString()); //None
console.log('None.xor(Some) = ', nothing.xor(something).toString()); //Some(123)
console.log('None.xor(Nothing) = ', nothing.xor(Option.None).toString()); //None


const something111 = Option.Some(111);
console.log('pre: Some.getOrInsert() = ', something111.toString()); //Some(111)
console.log('Some.getOrInsert() = ', something111.getOrInsert(333)); //111
console.log('post: Some.getOrInsert() = ', something111.toString()); //Some(111)

const nothingSpecial = Option.None
console.log('pre: None.getOrInsert() = ', nothingSpecial.toString()); //None
console.log('None.getOrInsert() = ', nothingSpecial.getOrInsert(333)); //333
console.log('post: None.getOrInsert() = ', nothingSpecial.toString()); //Some(333)



const something222 = Option.Some(222);
console.log('pre: Some.getOrInsertWith() = ', something222.toString()); //Some(222)
console.log('Some.getOrInsertWith() = ', something222.getOrInsertWith(()=>234)); //222
console.log('post: Some.getOrInsertWith() = ', something222.toString()); //Some(222)

const nothingSpecial2 = Option.None
console.log('pre: None.getOrInsertWith() = ', nothingSpecial2.toString()); //None
console.log('None.getOrInsertWith() = ', nothingSpecial2.getOrInsertWith(()=>234)); //234
console.log('post: None.getOrInsertWith() = ', nothingSpecial2.toString()); //Some(234)


const something345 = Option.Some(345);
console.log('Some.take() = ', something345.take().toString()); //Some(345)
console.log('post:Some.take() = ', something345.toString()); //None


console.log('None.take() = ', nothing.take()); //None
console.log('post:None.take() = ', nothing.toString()); //None


const something456 = Option.Some(456);
console.log('pre: Some.replace() = ', something456.toString()); //Some(456)
console.log('Some.replace() = ', something456.replace(567).toString()); //Some(456)
console.log('post: Some.replace() = ', something456.toString()); //Some(567)

const something567 = Option.Some(567);
const something567Copied = something567;
const something567Cloned = something567.cloned();

something567.take();
console.log('Option just copied = ', something567Copied.toString()); //None
console.log('Option.cloned() = ', something567Cloned.toString()); //Some(567)

try{
    console.log('None.expectNone("failed") = ', nothing.expectNone('failed')); //undefined <- no return value
    console.log('Some.expectNone() = ', something.expectNone('failed')); //never <- go to catch
}
catch(e){
    console.log('catch on Some.expectNone("failed") = ', e.message); //failed
}

try{
    console.log('None.unwrapNone() = ', nothing.unwrapNone()); //undefined <- no return value
    console.log('Some.unwrapNone() = ', something.unwrapNone()); //never <- go to catch
}
catch(e){
    console.log('catch on Some.unwrapNone() = ', e.message); //called `Option::unwrapNone()` on a `Some` value: 123.
}


import {RustResult as Result} from '../'

const someOk = Option.Some(Result.Ok(123));
const someErr = Option.Some(Result.Err('failed'));


console.log('None.transpose() = ', nothing.transpose().toString()); //Ok(None)
console.log('Some(Ok).transpose() = ', someOk.transpose().toString()); //Ok(Some(123))
console.log('Some(Err).transpose() = ', someErr.transpose().toString()); //Err("failed")


const someSome = Option.Some(Option.Some(123));
const someNone = Option.Some(Option.None);

console.log('Some(Some).flatten() = ', someSome.flatten().toString()); //Some(123)
console.log('Some(None).flatten() = ', someNone.flatten().toString()); //None
console.log('None.flatten() = ', nothing.flatten().toString()); //None

const matchResultByFunc = something.match({
    Some: (v)=> v*10,
    None: ()=> 555
});
console.log('Some.match() = ', matchResultByFunc); //1230

const matchResultByValue = nothing.match({
    Some: 444,
    None: 333
});
console.log('None.match() = ', matchResultByValue); //333


const SomeA = Option.Some(100);
const SomeB = Option.Some(100);
console.log('Option::equals() = ', SomeA.equals(SomeB)); //true
console.log('Some===Some = ', SomeA === SomeB); //false
console.log('Some==Some = ', SomeA == SomeB); //false
