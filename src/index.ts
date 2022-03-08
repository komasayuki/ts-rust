/* eslint-disable @typescript-eslint/no-explicit-any */

function isUndefined(v:any): v is undefined{
    return v === undefined;
}

export interface OptionMatch<T, U> {
    Some: ((val: T) => U) | U
    None: (() => U) | U
}

export interface ResultMatch<T, E, U> {
    Ok: ((val: T) => U) | U
    Err: ((err:E) => U) | U
}



interface IteratorResult<T> {
    done: boolean;
    value: RustOption<T>;
}

interface Iterator<T> {
    next(): IteratorResult<T>;
    [Symbol.iterator](): Iterator<T>;
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
let advancedSome:any = null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let advancedOk:any = null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let advancedErr:any = null;



class OptionIterator<T> implements Iterator<T> {
    private value:T|undefined;
    private isDone = false;

    constructor(val: T|undefined) {
        this.value = val;
    }

    [Symbol.iterator](): Iterator<T> {
      return this;
    }

    next(): IteratorResult<T>{

        const result = {
            done: this.isDone,
            value: advancedSome(this.isDone ? undefined: this.value)
        };

        this.isDone = true;
        return result;
    }
}



// eslint-disable-next-line @typescript-eslint/ban-types
function isFunction(v:any): v is Function{
    return typeof v === 'function';
}


class RustOptionBase<T>{

    protected value:T|undefined;

    constructor(val:T|undefined){
        this.value = val;
    }

    valueOf():T|undefined{
        return this.value;
    }

}


export class RustOption<T> extends RustOptionBase<T>{
    
    static Some(val:any):RustOption<typeof val>{
        return new RustOption<typeof val>(val);
    }

    static get None():RustOption<any>{
        return new RustOption<any>(undefined);
    }

    private constructor(val:T|undefined){
        super(val);
    }

    isSome(): boolean {
        return this.value !== undefined;
    }

    isNone(): boolean {
        return this.value === undefined;
    }

    unwrap(): T {
        if(isUndefined(this.value)){
            throw new Error('Trying to unwrap None.');
        }
        
        return this.value;
    }

    unwrapOr(def: T): T {
        if(isUndefined(this.value)){
            return def;
        }
        
        return this.value;
    }


    unwrapOrElse(fn: ()=>T): T {
        if(isUndefined(this.value)){
            return fn();
        }
        
        return this.value;
    }


    map<U>(fn: (val: T) => U): RustOption<U> {
        if(isUndefined(this.value)){
            return new RustOption<U>(undefined);
        }
        return new RustOption<U>(fn(this.value));
    }

    mapOr<U>(def:U, fn: (val: T) => U): U {
        if(isUndefined(this.value)){
            return def;
        }
        return fn(this.value);
    }

    mapOrElse<U>(fnNone: () => U, fnSome: (val: T) => U): U {
        if(isUndefined(this.value)){
            return fnNone();
        }
        return fnSome(this.value);
    }


    match<U>(fn: OptionMatch<T, U>): U {
        if(isUndefined(this.value)){
            if(isFunction(fn.None)){
                return fn.None();
            }
            return fn.None;
        }

        if(isFunction(fn.Some)){
            return fn.Some(this.value);
        }
        return fn.Some;

    }

    contains(val: T): boolean{
        if(isUndefined(this.value)){
            return false;
        }
        return this.value === val;
    }

    expect(msg:string): T {
        if(isUndefined(this.value)){
            throw new Error(msg);
        }
        
        return this.value;
    }

    iter():Iterator<T>{
        return new OptionIterator<T>(this.value);
    }

    okOr<E>(err:E):RustResult<T,E>{
        if(isUndefined(this.value)){
            return advancedErr(err);
        }
        
        return advancedOk(this.value);
    }
    
    okOrElse<E>(err:()=>E):RustResult<T,E>{
        if(isUndefined(this.value)){
            return advancedErr(err());
        }
        
        return advancedOk(this.value);
    }


    

    and<U>(v: RustOption<U>): RustOption<U> {
        if(isUndefined(this.value)){
            return new RustOption<U>(undefined);
        }
        return v;
    }

    andThen<U>(fn: (val: T) => RustOption<U>): RustOption<U> {
        if(isUndefined(this.value)){
            return new RustOption<U>(undefined);
        }
        return fn(this.value);
    }


    or(v: RustOption<T>): RustOption<T> {
        if(isUndefined(this.value)){
            return v;
        }
        return this;
    }


    orElse(fn: () => RustOption<T>): RustOption<T> {
        if(isUndefined(this.value)){
            return fn();
        }
        return this;
    }


    xor(v: RustOption<T>): RustOption<T> {
        if(isUndefined(this.value)){

            if(isUndefined(v.value)){
                return new RustOption<T>(undefined); 
            }
            
            return v;
        }
        else{

            if(isUndefined(v.value)){
                 return this;
            }

            return new RustOption<T>(undefined);
        }
    }


    filter(fn:(val:T)=>boolean): RustOption<T>{
        if(isUndefined(this.value)){
            return this;
        }
        
        if(fn(this.value)){
            return this;
        }

        return new RustOption<T>(undefined);
    }


    getOrInsert(val:T):T{
        if(isUndefined(this.value)){
            this.value = val;
            return this.value;
        }
        return this.value;
    }

    getOrInsertWith(fn:()=>T):T{
        if(isUndefined(this.value)){
            this.value = fn();
            return this.value;
        }
        return this.value;
    }

    take(): RustOption<T> {
        if(isUndefined(this.value)){
            return this;
        }
        const ret = new RustOption<T>(this.value);
        this.value = undefined;
        return ret;
    }

    replace(val:T): RustOption<T> {
        const oldValue = this.value;
        this.value = val;
        return new RustOption<T>(oldValue); 
    }



    cloned():  RustOption<T> {
        const ret = new RustOption<T>(undefined);
        
        if(!isUndefined(this.value)){
            ret.value = JSON.parse(JSON.stringify(this.value));
        }

        return ret;
    }


    expectNone(msg:string):void{
        if(!isUndefined(this.value)){
            throw new Error(msg);
        }
    }

    unwrapNone():void{
        if(!isUndefined(this.value)){
            throw new Error('called `Option::unwrapNone()` on a `Some` value: ' + this.value);
        }
    }

    flatten(): RustOption<T>{

        if(isUndefined(this.value)){
            return this;
        }

        if(this.value instanceof RustOption){
            return this.value as RustOption<T>;
        }

        return this;
    }

    [Symbol.iterator](): Iterator<T> {
        return new OptionIterator<T>(this.value);
    }

    toJSON(): object{
        if(isUndefined(this.value)){
            return {};
        }
        return {value: this.value};
    }

    equals(v:RustOption<T>):boolean{
        return JSON.stringify(this) === JSON.stringify(v);
    }

}


advancedSome = RustOption.Some;

























export class RustResult<T, E>{

    private value:T|undefined;
    private error:E|undefined;


    static Ok(val:any):RustResult<typeof val, any>{
        return new RustResult<typeof val, any>(val, undefined);
    }

    static Err(err:any):RustResult<any, typeof err>{
        return new RustResult<any, typeof err>(undefined, err);
    }

    private constructor(val:T|undefined, err:E|undefined){
        this.value = val;
        this.error = err;
    }

    isOk(): boolean {
        return this.value !== undefined;
    }

    isErr(): boolean {
        return this.value === undefined;
    }

    ok(): RustOption<T> {
        if(isUndefined(this.value)){
            return RustOption.None;
        }
        
        return RustOption.Some(this.value);
    }


    err(): RustOption<E> {
        if(isUndefined(this.value)){
            return RustOption.Some(this.error);
        }
        
        return RustOption.None;
    }


    unwrap(): T {
        if(isUndefined(this.value)){
            throw new Error(String(this.error));
        }
        
        return this.value;
    }


    unwrapErr(): E {
        if(!isUndefined(this.error)){
            return this.error;
        }
        
        throw new Error('Ok value: ' + String(this.value));
    }


    unwrapOr(def: T): T {
        if(isUndefined(this.value)){
            return def;
        }
        
        return this.value;
    }


    unwrapOrElse(fn: (err:E)=>T): T {
        if(!isUndefined(this.error)){
            return fn(this.error);
        }

        if(isUndefined(this.value)){
            //unreachable code
            throw new Error('Unexpected Result value:' + String(this.value) + ' error:' +String(this.error));
        }
        
        return this.value;
    }


    map<U>(fn: (val: T) => U): RustResult<U, E> {
        if(isUndefined(this.value)){
            return new RustResult<U, E>(this.value, this.error);
        }
        return new RustResult<U,E>(fn(this.value), undefined);
    }


    mapErr<U>(fn: (err: E) => U): RustResult<T, U> {
        if(!isUndefined(this.error)){
            return new RustResult<T, U>(undefined, fn(this.error));
        }
        return new RustResult<T, U>(this.value, this.error);
    }



    mapOr<U>(def:U, fn: (val: T) => U): U {
        if(isUndefined(this.value)){
            return def;
        }
        return fn(this.value);
    }

    mapOrElse<U>(fnErr: (err:E) => U, fnOk: (val: T) => U): U {
        if(!isUndefined(this.error)){
            return fnErr(this.error);
        }

        if(isUndefined(this.value)){
            //unreachable code
            throw new Error('Unexpected Result value:' + String(this.value) + ' error:' +String(this.error));
        }

        return fnOk(this.value);
    }


    match<U>(fn: ResultMatch<T, E, U>): U {
        if(!isUndefined(this.error)){
            if(isFunction(fn.Err)){
                return fn.Err(this.error);
            }
            return fn.Err;
        }

        if(!isUndefined(this.value)){
            if(isFunction(fn.Ok)){
                return fn.Ok(this.value);
            }
            return fn.Ok;
        }

        //unreachable code
        throw new Error('Unexpected Result value:' + String(this.value) + ' error:' +String(this.error));

    }

    contains(val: T): boolean{
        if(isUndefined(this.value)){
            return false;
        }
        return this.value === val;
    }


    containsErr(err: E): boolean{
        if(isUndefined(this.value)){
            return this.error === err;
        }
        return false;
    }

    expect(msg:string): T {
        if(isUndefined(this.value)){
            throw new Error(msg + ': ' + String(this.error));
        }
        
        return this.value;
    }


    expectErr(msg:string): E {
        if(!isUndefined(this.error)){
            return this.error;
            
        }
        
        throw new Error(msg + ': ' + String(this.value));
    }

    iter():Iterator<T>{
        return new OptionIterator<T>(this.value);
    }


    and<U>(v: RustResult<U,E>): RustResult<U,E> {
        if(isUndefined(this.value)){
            return new RustResult<U,E>(this.value, this.error);
        }
        return v;
    }



    andThen<U>(fn: (val: T) => RustResult<U,E>): RustResult<U,E> {
        if(isUndefined(this.value)){
            return new RustResult<U,E>(this.value, this.error);
        }
        return fn(this.value);
    }


    or<F>(v: RustResult<T,F>): RustResult<T,F> {
        if(isUndefined(this.value)){
            return v;
        }
        return new RustResult<T,F>(this.value, undefined);
    }


    orElse<F>(fn: (err:E) => RustResult<T,F>): RustResult<T,F> {
        if(!isUndefined(this.error)){
            return fn(this.error);
        }
        return new RustResult<T,F>(this.value, undefined);
    }


    cloned():  RustResult<T,E> {
        const ret = new RustResult<T,E>(undefined, undefined);
        
        if(!isUndefined(this.value)){
            ret.value = JSON.parse(JSON.stringify(this.value));
        }

        if(!isUndefined(this.error)){
            ret.error = JSON.parse(JSON.stringify(this.error));
        }

        return ret;
    }


    transpose(): RustOption<RustResult<T, E>>{

        if(this.value instanceof RustOption){

            const result = this.value as any;

            if(isUndefined(result.value)){
                return RustOption.None;
            }
            return RustOption.Some(new RustResult<T, E>(result.value, undefined));
        }

        if(isUndefined(this.value)){
            return RustOption.Some(new RustResult<T, E>(undefined, this.error));
        }

        throw new Error('Cannot transpose:' + this);

    }


    [Symbol.iterator](): Iterator<T> {
        return new OptionIterator<T>(this.value);
    }
  
    toString(): string{
        if(isUndefined(this.value)){
            
            if(this.error instanceof RustOption){
                const a = this.error as any;
                return `Err(${a.toString()})`;
            }
            
            if(this.error instanceof RustResult){
                const a = this.error as any;
                return `Err(${a.toString()})`;
            }

            return `Err(${JSON.stringify(this.error)})`;
        }

        if(this.value instanceof RustOption){
            const a = this.value as any;
            return `Ok(${a.toString()})`;
        }
        
        if(this.value instanceof RustResult){
            const a = this.value as any;
            return `Ok(${a.toString()})`;
        }

        return `Ok(${JSON.stringify(this.value)})`;
    }

    toJSON(): object{
        if(isUndefined(this.value)){
            return {error: this.error};
        }
        return {value: this.value};
    }

    equals(v:RustResult<T,E>):boolean{
        return JSON.stringify(this) === JSON.stringify(v);
    }

}



advancedOk = RustResult.Ok;
advancedErr = RustResult.Err;


//for making bi-directional dependency RustOption -> RustResult

interface RustOptionBase<T>{
    transpose:<E>() => RustResult<RustOption<T>, E>
    toString(): string
}


RustOptionBase.prototype.transpose = function<T,E>():RustResult<RustOption<T>, E>{

    const value = this.valueOf();

    if(isUndefined(value)){
        return RustResult.Ok(RustOption.None);
    }

    if(value instanceof RustResult){

        const result = value as any;

        if(isUndefined(result.value)){
            return RustResult.Err(result.error);
        }

        return RustResult.Ok(RustOption.Some(result.value));

    }

    throw new Error('Cannot transpose:' + this.toString());
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
RustOptionBase.prototype.toString = function<T>():string{

    const value = this.valueOf();

    if(isUndefined(value)){
        return 'None';
    }

    if(value instanceof RustOption){
        const a = value as any;
        return `Some(${a.toString()})`;
    }
    
    if(value instanceof RustResult){
        const a = value as any;
        return `Some(${a.toString()})`;
    }

    return `Some(${JSON.stringify(value)})`;

}