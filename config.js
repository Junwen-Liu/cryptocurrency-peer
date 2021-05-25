const INITIAL_DIFICULTY = 3;
const MINE_RATE = 1000;

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '----------',
    hash: 'hash-one',
    data:[],
    difficulty: INITIAL_DIFICULTY,
    nonce:0
};

module.exports = {GENESIS_DATA, MINE_RATE};