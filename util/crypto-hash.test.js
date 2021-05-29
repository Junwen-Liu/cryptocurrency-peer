const { cryptoHash } = require('.');
const crytoHash = require('./crypto-hash');

describe('crytoHash()',()=>{

    it('generates a SHA-256 hashed output', ()=>{
        expect(crytoHash('foo')).toEqual('b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b');
    });

    it('produces the same hash with same input in any order', ()=>{
        expect(crytoHash('one', 'two', 'three')).toEqual(crytoHash('three', 'two', 'one'));
    });

    it('produces a unique hash when the properties have changed ona n input', ()=>{
        const foo = {};
        const orginalhash = cryptoHash(foo);
        foo['a'] = 'a';

        expect(cryptoHash(foo)).not.toEqual(orginalhash);
    })
});