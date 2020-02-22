import {RustOption as Option, RustResult as Result} from '../'


describe('Option', () => {

    it('isSome() should return true if the option is a Some value.', () => {

        const some = Option.Some(-3);
        expect(some.isSome()).toBeTruthy();

        const none = Option.None;
        expect(none.isSome()).toBeFalsy();

    });

    it('isNone() should return true if the option is a None value.', () => {

        const some = Option.Some(-3);
        expect(some.isNone()).toBeFalsy();

        const none = Option.None;
        expect(none.isNone()).toBeTruthy();

    });

    it('contains() should true if the option is a Some value containing the given value.', () => {

        const some2 = Option.Some(2);
        expect(some2.contains(2)).toBeTruthy();

        const some3 = Option.Some(3);
        expect(some3.contains(2)).toBeFalsy();

        const none = Option.None;
        expect(none.contains(2)).toBeFalsy();

    });


    it('expect() should unwrap an option, yielding the content of a Some.', () => {

        const some = Option.Some(-3);
        expect(some.expect('failed')).toBe(-3);

        const none = Option.None;
        expect(()=>none.expect('failed')).toThrow('failed');

    });


    it('unwrap() should move the value v out of the Option<T> if it is Some(v).', () => {

        const some = Option.Some(-3);
        expect(some.unwrap()).toBe(-3);

        const none = Option.None;
        expect(()=>none.unwrap()).toThrow('Trying to unwrap None.');

    });


    it('unwrapOr() should return the contained value or a default.', () => {

        const some = Option.Some(-3);
        expect(some.unwrapOr(5)).toBe(-3);

        const none = Option.None;
        expect(none.unwrapOr(5)).toBe(5);

    });

    it('unwrapOrElse() should return the contained value or computes it from a closure.', () => {

        const noneValue = 10;

        const some = Option.Some(-3);
        expect(some.unwrapOrElse(()=>noneValue)).toBe(-3);

        const none = Option.None;
        expect(none.unwrapOrElse(()=>noneValue)).toBe(10);

    });


    it('map() should map an Option<T> to Option<U> by applying a function to a contained value.', () => {

        const some = Option.Some(-3);
        expect(some.map(v=>v+1).equals(Option.Some(-2))).toBeTruthy();

        const none = Option.None;
        expect(none.map(v=>v+1).equals(none)).toBeTruthy();

    });


    it('mapOr() should applie a function to the contained value (if any), or returns the provided default (if not).', () => {

        const some = Option.Some(-3);
        expect(some.mapOr('default', v =>''+v)).toBe('-3');

        const none = Option.None;
        expect(none.mapOr('default', v =>''+v)).toBe('default');

    });


    it('mapOrElse() should apply a function to the contained value (if any), or computes a default (if not).', () => {

        const defaultValue = 'DEF';

        const some = Option.Some(-3);
        expect(some.mapOrElse(()=>defaultValue, v =>'Ok'+v)).toBe('Ok-3');

        const none = Option.None;
        expect(none.mapOrElse(()=>defaultValue, v =>'Ok'+v)).toBe('DEF');

    });



    it('okOr() should transform the Option<T> into a Result<T, E>, mapping Some(v) to Ok(v) and None to Err(err).', () => {

        const some = Option.Some(-3);
        expect(some.okOr('error').equals(Result.Ok(-3))).toBeTruthy();

        const none = Option.None;
        expect(none.okOr('error').equals(Result.Err('error'))).toBeTruthy();

    });


    it('okOrElse() should transform the Option<T> into a Result<T, E>, mapping Some(v) to Ok(v) and None to Err(err).', () => {

        const some = Option.Some(-3);
        expect(some.okOrElse(()=>'fail').equals(Result.Ok(-3))).toBeTruthy();

        const none = Option.None;
        expect(none.okOrElse(()=>'fail').equals(Result.Err('fail'))).toBeTruthy();

    });


    it('iter() should return an iterator over the possibly contained value. (Ok)', () => {

        expect.assertions(1)

        const some = Option.Some(-3);

        for(const v of some.iter()){
            expect(v.equals(Option.Some(-3))).toBeTruthy();
        }

    });


    it('iter() should return an iterator over the possibly contained value. (Ok and without iter())', () => {

        expect.assertions(1)

        const some = Option.Some(-3);

        for(const v of some){
            expect(v.equals(Option.Some(-3))).toBeTruthy();
        }

    });


    it('iter() should return an iterator over the possibly contained value. (Err)', () => {

        expect.assertions(1)

        const none = Option.None;

        for(const e of none.iter()){
            expect(e.equals(Option.None)).toBeTruthy();
        }

    });


    it('iter() should return an iterator over the possibly contained value. (Err and without iter())', () => {

        expect.assertions(1)

        const none = Option.None;

        for(const e of none){
            expect(e.equals(Option.None)).toBeTruthy();
        }

    });




    it('and() should return None if the option is None, otherwise returns optb.', () => {

        const none = Option.None;

        const some1 = Option.Some(1);
        expect(some1.and(none).equals(Option.None)).toBeTruthy();

        const some2 = Option.Some(2);
        expect(none.and(some2).equals(Option.None)).toBeTruthy();

        expect(none.and(none).equals(Option.None)).toBeTruthy();

        const some41 = Option.Some(41);
        const some42 = Option.Some(42);
        expect(some41.and(some42).equals(Option.Some(42))).toBeTruthy();

    });



    it('andThen() should None if the option is None, otherwise calls f with the wrapped value and returns the result.', () => {

        const sq = (x:number):Option<number>=>Option.Some(x*x);
        const err = (_:number):Option<number>=>Option.None;

        expect(Option.Some(2).andThen(sq).andThen(sq).equals(Option.Some(16))).toBeTruthy();
        expect(Option.Some(2).andThen(sq).andThen(err).equals(Option.None)).toBeTruthy();
        expect(Option.Some(2).andThen(err).andThen(sq).equals(Option.None)).toBeTruthy();
        expect(Option.None.andThen(sq).andThen(sq).equals(Option.None)).toBeTruthy();

    });




    it('filter() should return None if the option is None, otherwise calls predicate with the wrapped value and returns:\nSome(t) if predicate returns true (where t is the wrapped value), and\nNone if predicate returns false.', () => {

        const isEven = (n:number):boolean=>n%2 === 0;

        expect(Option.None.filter(isEven).equals(Option.None)).toBeTruthy();
        expect(Option.Some(3).filter(isEven).equals(Option.None)).toBeTruthy();
        expect(Option.Some(4).filter(isEven).equals(Option.Some(4))).toBeTruthy();

    });





    it('or() should return the option if it contains a value, otherwise returns optb.', () => {

        const none = Option.None;

        const some1 = Option.Some(1);
        expect(some1.or(none).equals(Option.Some(1))).toBeTruthy();


        const some2 = Option.Some(2);
        expect(none.or(some2).equals(Option.Some(2))).toBeTruthy();


        expect(none.or(none).equals(Option.None)).toBeTruthy();

        const some41 = Option.Some(41);
        const some42 = Option.Some('42');
        expect(some41.or(some42).equals(Option.Some(41))).toBeTruthy();

    });


    it('orElse() should return  the option if it contains a value, otherwise calls f and returns the result.', () => {

        const sq = ():Option<number>=>Option.Some(123);
        const err = ():Option<number>=>Option.None;

        expect(Option.Some(2).orElse(sq).equals(Option.Some(2))).toBeTruthy();
        expect(Option.None.orElse(sq).equals(Option.Some(123))).toBeTruthy();
        expect(Option.None.orElse(err).equals(Option.None)).toBeTruthy();

    });


    it('xor() should Some if exactly one of self, optb is Some, otherwise returns None.', () => {

        const none = Option.None;

        const some1 = Option.Some(1);
        expect(some1.xor(none).equals(Option.Some(1))).toBeTruthy();


        const some2 = Option.Some(2);
        expect(none.xor(some2).equals(Option.Some(2))).toBeTruthy();


        expect(none.xor(none).equals(Option.None)).toBeTruthy();

        const some41 = Option.Some(41);
        const some42 = Option.Some('42');
        expect(some41.xor(some42).equals(Option.None)).toBeTruthy();

    });




    it('getOrInsert() should insert v into the option if it is None, then returns a mutable reference to the contained value.', () => {

        const none = Option.None;

        const insertedValue = none.getOrInsert(5);
        expect(insertedValue).toBe(5);
        expect(none.equals(Option.Some(5))).toBeTruthy();

        const some = Option.Some(3);
        const insertedValue2 = some.getOrInsert(15);
        expect(insertedValue2).toBe(3);
        expect(some.equals(Option.Some(3))).toBeTruthy(); 

    });

    it('getOrInsertWith() should insert a value computed from f into the option if it is None, then returns a mutable reference to the contained value.', () => {

        const none = Option.None;

        const insertedValue = none.getOrInsertWith(()=>55);
        expect(insertedValue).toBe(55);
        expect(none.equals(Option.Some(55))).toBeTruthy();

        const some = Option.Some(3);
        const insertedValue2 = some.getOrInsertWith(()=>55);
        expect(insertedValue2).toBe(3);
        expect(some.equals(Option.Some(3))).toBeTruthy(); 

    });


    it('take() should take the value out of the option, leaving a None in its place.', () => {

        const some = Option.Some(-3);
        expect(some.take().equals(Option.Some(-3))).toBeTruthy();
        expect(some.equals(Option.None)).toBeTruthy();

        const none = Option.None;
        expect(none.take().equals(Option.None)).toBeTruthy();
        expect(none.equals(Option.None)).toBeTruthy();

    });


    it('replace() should replace the actual value in the option by the value given in parameter, returning the old value if present, leaving a Some in its place without deinitializing either one.', () => {

        const some = Option.Some(-3);
        expect(some.replace(5).equals(Option.Some(-3))).toBeTruthy();
        expect(some.equals(Option.Some(5))).toBeTruthy();

        const none = Option.None;
        expect(none.replace(5).equals(Option.None)).toBeTruthy();
        expect(none.equals(Option.Some(5))).toBeTruthy();

    });


    it('cloned() should map a Result<T, E> to a Result<T, E> by cloning the contents of the Ok part.', () => {

        const some = Option.Some(-3);
        const someCloned = some.cloned();

        expect(some.equals(someCloned)).toBeTruthy();


        const obj = {hoge:123}
        const some2 = Option.Some(obj);
        const someCloned2 = some2.cloned();
        obj.hoge = 234;

        expect(some2.equals(Option.Some({hoge:234}))).toBeTruthy();
        expect(someCloned2.equals(Option.Some({hoge:123}))).toBeTruthy();

        const none = Option.None;
        const noneCloned = none.cloned();
        expect(none.equals(noneCloned)).toBeTruthy();

    });




    it('expectNone() should unwrap an option, expecting None and returning nothing.', () => {

        const some = Option.Some(-3);
        expect(()=>some.expectNone('failed')).toThrow('failed');

        const none = Option.None;
        expect(()=>none.expectNone('failed'));

    });


    it('unwrapNone() should unwrap an option, expecting None and returning nothing.', () => {

        const some = Option.Some(-3);
        expect(()=>some.unwrapNone()).toThrow('called `Option::unwrapNone()` on a `Some` value: -3');

        const none = Option.None;
        expect(none.unwrapNone());

    });




    it('transpose() should transpose a Result of an Option into an Option of a Result.', () => {

        const someErr= Option.Some(Result.Err('failed'));
        expect(someErr.transpose().equals(Result.Err('failed'))).toBeTruthy();

        const okSome = Option.Some(Result.Ok(123));
        expect(okSome.transpose().equals(Result.Ok(Option.Some(123)))).toBeTruthy();

        const none = Option.None;
        expect(none.transpose().equals(Result.Ok(Option.None))).toBeTruthy();

        const some = Option.Some(123);
        expect(()=>some.transpose()).toThrowError('Cannot transpose:Some(123)');


    });

    it('flatten() should convert from Option<Option<T>> to Option<T>', () => {

        const someSome= Option.Some(Option.Some(123));
        expect(someSome.flatten().equals(Option.Some(123))).toBeTruthy();

        const someNone = Option.Some(Option.None);
        expect(someNone.flatten().equals(Option.None)).toBeTruthy();

        const none = Option.None;
        expect(none.flatten().equals(Option.None)).toBeTruthy();

        const some= Option.Some(234);
        expect(some.flatten().equals(Option.Some(234))).toBeTruthy();

    });


    it('match() should execute some or none function by the option value', () => {

        const some= Option.Some(1);
        const result = some.match({
            Some: (v)=>{
                return v+2;
            },
            None:()=>{
                return -2;
            }
        });

        expect(result).toBe(3);

        const some2= Option.Some(2);
        const result2 = some2.match({
            Some:3,
            None:4
        });

        expect(result2).toBe(3);


        const none= Option.None;
        const result3 = none.match({
            Some: (v)=>{
                return v+2;
            },
            None:()=>{
                return -2;
            }
        });

        expect(result3).toBe(-2);

        const result4 = none.match({
            Some: 5,
            None: 6
        });

        expect(result4).toBe(6);

    });


    it('should not change None', () => {

        const none1 = Option.None;
        const none2 = Option.None;

        none1.replace(10);

        expect(none1.equals(Option.Some(10))).toBeTruthy();
        expect(none2.equals(Option.None)).toBeTruthy();

        const none3 = Option.None;
        expect(Option.None.equals(none3)).toBeTruthy();


    });



    it('toString() should return type and JSON', () => {

        const some = Option.Some(123);
        expect(some.toString()).toBe('Some(123)');

        const none = Option.None;
        expect(none.toString()).toBe('None');

        const some2 = Option.Some({hello:234});
        expect(some2.toString()).toBe('Some({"hello":234})');

        const somenone = Option.Some(Option.None);
        expect(somenone.toString()).toBe('Some(None)');

        const somesome = Option.Some(Option.Some({hello:234}));
        expect(somesome.toString()).toBe('Some(Some({"hello":234}))');

        const someOk = Option.Some(Result.Ok({hello:234}));
        expect(someOk.toString()).toBe('Some(Ok({"hello":234}))');

        const someErr = Option.Some(Result.Err({hello:234}));
        expect(someErr.toString()).toBe('Some(Err({"hello":234}))');

    });

    it('toJSON() should return JSON', () => {

        const some = Option.Some(123);
        expect(some.toJSON()).toEqual({value: 123});

        const none = Option.None;
        expect(none.toJSON()).toEqual({});

        const some2 = Option.Some({hello:234});
        expect(some2.toJSON()).toEqual({value: {hello:234}});

    });

  
});