const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');

//bitcoin use secp256k1 - standard of efficient cryptography, p-prime number that is 256 bits
const ec = new EC('secp256k1');

const verifySignature = ({publicKey, data, signature})=>{
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

    return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = {ec, verifySignature, cryptoHash};