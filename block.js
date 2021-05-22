const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
    //the advantaage of wrapping the arguments as key-value pair in {} and as object, is we don't need to remember the order of them
  constructor({timestamp, lastHash, hash, data}) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  static genesis() {
    return new Block(GENESIS_DATA);
  }

  static mineBlock({lastBlock, data}) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;

    return new this({
        timestamp,
        lastHash,
        data,
        hash: cryptoHash(timestamp, lastHash, data)
    });
  }
}



module.exports = Block;
