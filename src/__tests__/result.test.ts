import {RustOption as Option, RustResult as Result} from '../'

describe('Result', () => {

    it('isOk() should return true if the result is Ok.', () => {

        const ok = Result.Ok(-3);
        expect(ok.isOk()).toBeTruthy();

        const err = Result.Err('Some error message');
        expect(err.isOk()).toBeFalsy();

    });

    it('isErr() should return true if the result is Err.', () => {

        const ok = Result.Ok(-3);
        expect(ok.isErr()).toBeFalsy();

        const err = Result.Err('Some error message');
        expect(err.isErr()).toBeTruthy();

    });

    it('contains() should return true if the result is an Ok value containing the given value.', () => {

        const ok2 = Result.Ok(2);
        expect(ok2.contains(2)).toBeTruthy();

        const ok3 = Result.Ok(3);
        expect(ok3.contains(2)).toBeFalsy();

        const err = Result.Err('Some error message');
        expect(err.contains(2)).toBeFalsy();

    });

    it('containsErr() should return true if the result is an Err value containing the given value.', () => {

        const ok2 = Result.Ok(2);
        expect(ok2.containsErr('Some error message')).toBeFalsy();

        const ok3 = Result.Ok(3);
        expect(ok3.containsErr('Some error message')).toBeFalsy();

        const err = Result.Err('Some error message');
        expect(err.containsErr('Some error message')).toBeTruthy();

        const err2 = Result.Err('Some other error message');
        expect(err2.containsErr('Some error message')).toBeFalsy();

    });


    it('ok() should convert self into an Option<T>, consuming self, and discarding the error, if any.', () => {

        const ok = Result.Ok(-3);
        expect(ok.ok().equals(Option.Some(-3))).toBeTruthy();

        const err = Result.Err('Some error message');
        expect(err.ok().equals(Option.None)).toBeTruthy();

    });


    it('err() should convert self into an Option<E>, consuming self, and discarding the success value, if any.', () => {

        const ok = Result.Ok(-3);
        expect(ok.err().equals(Option.None));

        const err = Result.Err('Some error message');
        expect(err.err().equals(Option.Some('Some error message'))).toBeTruthy();

    });



    it('map() should map a Result<T, E> to Result<U, E> by applying a function to a contained Ok value, leaving an Err value untouched.', () => {

        const ok = Result.Ok(-3);
        expect(ok.map(v=>v+1).equals(Result.Ok(-2))).toBeTruthy();

        const err = Result.Err('Some error message');
        expect(err.map(v=>v+1).equals(err)).toBeTruthy();

    });


    it('mapOr() should apply a function to the contained value (if any), or returns the provided default (if not).', () => {

        const ok = Result.Ok(-3);
        expect(ok.mapOr('default', v =>''+v)).toBe('-3');

        const err = Result.Err('Some error message');
        expect(err.mapOr('default', v =>''+v)).toBe('default');

    });


    it('mapOrElse() should map a Result<T, E> to U by applying a function to a contained Ok value, or a fallback function to a contained Err value.', () => {

        const ok = Result.Ok(-3);
        expect(ok.mapOrElse(v=>'Err'+v, v =>'Ok'+v)).toBe('Ok-3');

        const err = Result.Err('Some error message');
        expect(err.mapOrElse(v=>'Err'+v, v =>'Ok'+v)).toBe('ErrSome error message');

    });

    it('mapErr() should map a Result<T, E> to Result<T, F> by applying a function to a contained Err value, leaving an Ok value untouched.', () => {

        const ok = Result.Ok(-3);
        expect(ok.mapErr(v =>'@'+v).equals(Result.Ok(-3))).toBeTruthy();

        const err = Result.Err('Some error message');
        expect(err.mapErr(v =>'@'+v).equals(Result.Err('@Some error message'))).toBeTruthy();

    });


    it('iter() should return an iterator over the possibly contained value. (Ok)', () => {

        expect.assertions(1)

        const ok = Result.Ok(-3);

        for(const v of ok.iter()){
            expect(v.equals(Option.Some(-3))).toBeTruthy();
        }

    });

    it('iter() should return an iterator over the possibly contained value. (Ok and without iter())', () => {

        expect.assertions(1)

        const ok = Result.Ok(-3);

        for(const v of ok){
            expect(v.equals(Option.Some(-3))).toBeTruthy();
        }

    });


    it('iter() should return an iterator over the possibly contained value. (Err)', () => {

        expect.assertions(1)

        const err = Result.Err('Some error message');

        for(const e of err.iter()){
            expect(e.equals(Option.None)).toBeTruthy();
        }

    });


    it('iter() should return an iterator over the possibly contained value. (Err and without iter())', () => {

        expect.assertions(1)

        const err = Result.Err('Some error message');

        for(const e of err){
            expect(e.equals(Option.None)).toBeTruthy();
        }

    });


    it('and() should return res if the result is Ok, otherwise returns the Err value of self.', () => {

        const ok1 = Result.Ok(1);
        const error1 = Result.Err('error_1');
        expect(ok1.and(error1).equals(Result.Err('error_1'))).toBeTruthy();


        const ok2 = Result.Ok(2);
        const error2 = Result.Err('error_2');
        expect(error2.and(ok2).equals(Result.Err('error_2'))).toBeTruthy();

        const err31 = Result.Err('error_31');
        const err32 = Result.Err('error_32');
        expect(err31.and(err32).equals(Result.Err('error_31'))).toBeTruthy();

        const ok41 = Result.Ok(41);
        const ok42 = Result.Ok('42');
        expect(ok41.and(ok42).equals(Result.Ok('42'))).toBeTruthy();

    });



    it('andThen() should call op if the result is Ok, otherwise returns the Err value of self.', () => {

        const sq = (x:number):Result<number, number>=>Result.Ok(x*x);
        const err = (x:number):Result<number, number>=>Result.Err(x);

        expect(Result.Ok(2).andThen(sq).andThen(sq).equals(Result.Ok(16))).toBeTruthy();
        expect(Result.Ok(2).andThen(sq).andThen(err).equals(Result.Err(4))).toBeTruthy();
        expect(Result.Ok(2).andThen(err).andThen(sq).equals(Result.Err(2))).toBeTruthy();
        expect(Result.Err(3).andThen(sq).andThen(sq).equals(Result.Err(3))).toBeTruthy();

    });



    it('or() should return res if the result is Err, otherwise returns the Ok value of self.', () => {

        const ok1 = Result.Ok(1);
        const error1 = Result.Err('error_1');
        expect(ok1.or(error1).equals(Result.Ok(1))).toBeTruthy();


        const ok2 = Result.Ok(2);
        const error2 = Result.Err('error_2');
        expect(error2.or(ok2).equals(Result.Ok(2))).toBeTruthy();

        const err31 = Result.Err('error_31');
        const err32 = Result.Err('error_32');
        expect(err31.or(err32).equals(Result.Err('error_32'))).toBeTruthy();

        const ok41 = Result.Ok(41);
        const ok42 = Result.Ok('42');
        expect(ok41.or(ok42).equals(Result.Ok(41))).toBeTruthy();

    });


    it('orElse() should call op if the result is Err, otherwise returns the Ok value of self.', () => {

        const sq = (x:number):Result<number, number>=>Result.Ok(x*x);
        const err = (x:number):Result<number, number>=>Result.Err(x);

        expect(Result.Ok(2).orElse(sq).orElse(sq).equals(Result.Ok(2))).toBeTruthy();
        expect(Result.Ok(2).orElse(sq).orElse(err).equals(Result.Ok(2))).toBeTruthy();
        expect(Result.Err(3).orElse(err).orElse(sq).equals(Result.Ok(9))).toBeTruthy();
        expect(Result.Err(3).orElse(err).orElse(err).equals(Result.Err(3))).toBeTruthy();

    });



    it('unwrapOr() should unwrap a result, yielding the content of an Ok. Else, it returns optb.', () => {

        const ok = Result.Ok(-3);
        expect(ok.unwrapOr(5)).toBe(-3);

        const err = Result.Err('Some error message');
        expect(err.unwrapOr(5)).toBe(5);

    });

    it('unwrapOrElse() should unwrap a result, yielding the content of an Ok. If the value is an Err then it calls op with its value.', () => {

        const ok = Result.Ok(-3);
        expect(ok.unwrapOrElse(v=>v+v)).toBe(-3);

        const err = Result.Err('Some error message');
        expect(err.unwrapOrElse(v=>v+v)).toBe('Some error messageSome error message');

    });


    it('cloned() should map a Result<T, E> to a Result<T, E> by cloning the contents of the Ok part.', () => {

        const ok = Result.Ok(-3);
        const okCloned = ok.cloned();

        expect(ok.equals(okCloned)).toBeTruthy();


        const obj = {hoge:123}
        const ok2 = Result.Ok(obj);
        const okCloned2 = ok2.cloned();
        obj.hoge = 234;

        expect(ok2.equals(Result.Ok({hoge:234}))).toBeTruthy();
        expect(okCloned2.equals(Result.Ok({hoge:123}))).toBeTruthy();

        const err = Result.Err('Some error message');
        const errCloned = err.cloned();
        expect(err.equals(errCloned)).toBeTruthy();

    });


    it('unwrap() should unwrap a result, yielding the content of an Ok.', () => {

        const ok = Result.Ok(-3);
        expect(ok.unwrap()).toBe(-3);

        const err = Result.Err('Some error message');
        expect(()=>err.unwrap()).toThrow('Some error message');

    });


    it('expect() should panic if the value is an Err, with a panic message including the passed message, and the content of the Err.', () => {

        const ok = Result.Ok(-3);
        expect(ok.expect('failed')).toBe(-3);

        const err = Result.Err('Some error message');
        expect(()=>err.expect('failed')).toThrow('failed: Some error message');

    });


    it('unwrapErr() should unwrap a result, yielding the content of an Err.', () => {

        const ok = Result.Ok(-3);
        expect(()=>ok.unwrapErr()).toThrow('-3');

        const err = Result.Err('Some error message');
        expect(err.unwrapErr()).toBe('Some error message');

    });

    it('expectErr() should panic if the value is an Err, with a panic message including the passed message, and the content of the Err.', () => {

        const ok = Result.Ok(-3);
        expect(()=>ok.expectErr('failed')).toThrow('failed: -3');

        const err = Result.Err('Some error message');
        expect(err.expectErr('failed')).toBe('Some error message');

    });

    it('transpose() should transpose a Result of an Option into an Option of a Result.', () => {

        const okNone = Result.Ok(Option.None);
        expect(okNone.transpose().equals(Option.None)).toBeTruthy();

        const okSome = Result.Ok(Option.Some(123));
        expect(okSome.transpose().equals(Option.Some(Result.Ok(123)))).toBeTruthy();

        const err = Result.Err('Some error message');
        expect(err.transpose().equals(Option.Some(Result.Err('Some error message')))).toBeTruthy();

        const err2 = Result.Err(Option.Some(3));
        expect(err2.transpose().equals(Option.Some(Result.Err(Option.Some(3))))).toBeTruthy();

        const err3 = Result.Err(Option.None);
        expect(err3.transpose().equals(Option.Some(Result.Err(Option.None)))).toBeTruthy();

        const ok = Result.Ok(123);
        expect(()=>ok.transpose()).toThrowError('Cannot transpose:Ok(123)');

    });


    it('match() should execute some or none function by the result value', () => {

        const ok= Result.Ok(1);
        const result = ok.match({
            Ok: (v)=>{
                return v+2;
            },
            Err:(e)=>{
                return -2;
            }
        });

        expect(result).toBe(3);


        const ok2= Result.Ok(2);
        const result2 = ok2.match({
            Ok:5,
            Err:6
        });

        expect(result2).toBe(5);

        
        const err= Result.Err('fail');
        const result3 = err.match({
            Ok: (v)=>{
                return v+2;
            },
            Err:(e)=>{
                return e;
            }
        });

        expect(result3).toBe('fail');

        const err2= Result.Err('fail2');
        const result4 = err2.match({
            Ok: 'ok',
            Err: 'miss'
        });

        expect(result4).toBe('miss');

    });

    it('toString() should return type and JSON', () => {

        const ok = Result.Ok(123);
        expect(ok.toString()).toBe('Ok(123)');

        const err = Result.Err('fail');
        expect(err.toString()).toBe('Err("fail")');

        const ok2 = Result.Ok({hello:234});
        expect(ok2.toString()).toBe('Ok({"hello":234})');

        const err2 = Result.Err({hello:234});
        expect(err2.toString()).toBe('Err({"hello":234})');

        const ok3 = Result.Ok(Result.Ok({hello:234}));
        expect(ok3.toString()).toBe('Ok(Ok({"hello":234}))');

        const err3 = Result.Err(Result.Err({hello:234}));
        expect(err3.toString()).toBe('Err(Err({"hello":234}))');

        const okErr = Result.Ok(Result.Err({hello:234}));
        expect(okErr.toString()).toBe('Ok(Err({"hello":234}))');

        const okSome = Result.Ok(Option.Some({hello:234}));
        expect(okSome.toString()).toBe('Ok(Some({"hello":234}))');

        const okNone = Result.Ok(Option.None);
        expect(okNone.toString()).toBe('Ok(None)');

        const errSome = Result.Err(Option.Some({hello:234}));
        expect(errSome.toString()).toBe('Err(Some({"hello":234}))');

        const errNone = Result.Err(Option.None);
        expect(errNone.toString()).toBe('Err(None)');

    });

    it('toJSON() should return JSON', () => {

        const ok = Result.Ok(123);
        expect(ok.toJSON()).toEqual({value: 123});

        const err = Result.Err('fail');
        expect(err.toJSON()).toEqual({error: 'fail'});

        const ok2 = Result.Ok({hello:234});
        expect(ok2.toJSON()).toEqual({value: {hello:234}});

        const err2 = Result.Err({hello:234});
        expect(err2.toJSON()).toEqual({error: {hello:234}});

    });
  
});