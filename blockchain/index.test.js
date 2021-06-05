const BlockChain = require('./index');
const Block = require('./block');
const {cryptoHash} = require('../util');
const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

describe('Blockchain', ()=>{
    let blockchain, newChain, originalChain, errorMock;

    beforeEach(()=>{
        errorMock = jest.fn();
        blockchain = new BlockChain();
        newChain = new BlockChain();

        originalChain = blockchain.chain;
        global.console.error = errorMock;
    });

    it('contains a `chain` array instance', ()=>{
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('startsw ith a gensis block', ()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
     });

     it('add a new block to the chain', ()=>{
         const newData = 'foo bar';
         blockchain.addBlock({data: newData});

         expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
     });

     describe('isValidChain()', ()=>{
         describe('when the chain does not start with the genesis block', ()=>{
             it('returns false', ()=>{
                blockchain.chain[0] = {data: 'fake-genesis'};

                expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
             });
         });

         describe('when the chain starts wtih genesis block and has multiple blocks', ()=>{
             beforeEach(()=>{
                blockchain.addBlock({data:'Bears'});
                blockchain.addBlock({data:'Beets'});
                blockchain.addBlock({data:'Battlestar galactica'});
             });

             describe('and a lasthash reference has changed', ()=>{
                 it('return false', ()=>{
                   

                    blockchain.chain[2].lastHash = 'broken-lastHash';

                    expect(BlockChain.isValidChain(blockchain.chain)).toBe(false); 
                 });
             });

             describe('and the chain contains a block with an invalid field', ()=>{
                 it('returns false', ()=>{

                    blockchain.chain[2].data = 'bad-data';

                    expect(BlockChain.isValidChain(blockchain.chain)).toBe(false); 
                 });
             });

             describe('and the chain contains a block with a jumped difficulty', ()=>{
                 it('returns false', ()=>{
                     const lastBlock = blockchain.chain[blockchain.chain.length-1];
                     const lastHash = lastBlock.hash;
                     const timestamp = Date.now();
                     const nonce = 0;
                     const data = [];
                     const difficulty = lastBlock.difficulty -3;

                     const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

                     const badBlock = new Block({timestamp, lastHash, hash, nonce, difficulty, data});

                     blockchain.chain.push(badBlock);

                     expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
                 });;
             })

             describe('and chian does not contain any invalid block', ()=>{
                 it('returns true', ()=>{
                    expect(BlockChain.isValidChain(blockchain.chain)).toBe(true); 
                 });
             });
         });
     });

     describe('replaceChain()', ()=>{
         let  logMock;

         beforeEach(()=>{
             logMock = jest.fn();

             global.console.log = logMock;
         });

        describe('when the new chain is not longer', ()=>{
            beforeEach(()=>{
                newChain.chain[0] = {new:'chain'};

                blockchain.replaceChain(newChain.chain);
            });

            it('does not replace the chain', ()=>{

                expect(blockchain.chain).toEqual(originalChain);
            });

            it('logs an error', ()=>{
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('when the new chain is longer', ()=>{

            beforeEach(()=>{
                newChain.addBlock({data:'Bears'});
                newChain.addBlock({data:'Beets'});
                newChain.addBlock({data:'Battlestar galactica'});
             });
             
            describe('and the chain is invalid', ()=>{
                beforeEach(()=>{
                    newChain.chain[2].hash = 'fake-hash';

                    blockchain.replaceChain(newChain.chain);

               });

                it('does not replace the chain', ()=>{
                    expect(blockchain.chain).toEqual(originalChain);
                });

                it('logs an error', ()=>{
                    expect(errorMock).toHaveBeenCalled();
                });
            });
            
            describe('and the chain is valid', ()=>{
                beforeEach(()=>{
                    blockchain.replaceChain(newChain.chain);
                });

                it('replaces the chain', ()=>{
                
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it('logs about the chain replacement', ()=>{
                    expect(logMock).toHaveBeenCalled();
                })
            });
        });

        describe('and the validTransaction flag is ture', ()=>{
            it('calls validTransactionData()', ()=>{
                const validTransactionDataMock = jest.fn();

                blockchain.validTransactionData = validTransactionDataMock;

                newChain.addBlock({data: 'foo'});
                blockchain.replaceChain(newChain.chain, true);

                expect(validTransactionDataMock).toHaveBeenCalled();
            })
        })
     });

     describe('validTransactionData', ()=>{
         let transaction, rewardTransaction, wallet;

         beforeEach(()=>{
             wallet = new Wallet();
             transaction = wallet.createTransaction({
                 recipient: 'foo',
                 amount: 55
             });
             rewardTransaction = Transaction.rewardTransaction({minerWallet: wallet});
         });

         describe('and the transaction data is valid', ()=>{
             it('return true', ()=>{
                 newChain.addBlock({ data: [transaction, rewardTransaction]});

                 expect(blockchain.validTransactionData({chain: newChain.chain })
             ).toBe(true);
             expect(errorMock).not.toHaveBeenCalled();
            });
        });
        
        describe('and the transaction data has multiple reward', ()=>{
            it('reutrn false and log an error', ()=>{
                newChain.addBlock({data: [transaction, rewardTransaction, rewardTransaction]});

                expect(blockchain.validTransactionData({chain: newChain.chain })
                ).toBe(false);
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('and the transaction data has at least malformed outputMap', ()=>{
            describe('and the transaction is not a reward transaction', ()=>{
                it('reutrn false and log an error', ()=>{
                    transaction.outputMap[wallet.publicKey] = 99999;

                    newChain.addBlock({data: [transaction, rewardTransaction]});

                    expect(blockchain.validTransactionData({chain: newChain.chain })
                    ).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the transaction is a reward transaction', ()=>{
                it('reutrn false and log an error', ()=>{
                    rewardTransaction.outputMap[wallet.publicKey] = 99999;

                    newChain.addBlock({data: [transaction, rewardTransaction]});

                    expect(blockchain.validTransactionData({chain: newChain.chain })
                    ).toBe(false);
                    expect(errorMock).toHaveBeenCalled();
                });
            });
        });

        describe('and the transaction data has at least malformed input', ()=>{
            it('reutrn false and log an error', ()=>{
                wallet.balance = 9000;
                
                const evilOutputMap = {
                    [wallet.publicKey]: 8900,
                    fooRecipient: 100
                }

                const evilTransaction = {
                    input: {
                        timestamp: Date.now(),
                        amount: wallet.balance,
                        address: wallet.publicKey,
                        signature: wallet.sign(evilOutputMap)
                    },
                    outputMap: evilOutputMap
                }

                newChain.addBlock({data: [evilTransaction, rewardTransaction]});
                expect(blockchain.validTransactionData({chain: newChain.chain })
                ).toBe(false);
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('and a block contains multiple identifcal transactions', ()=>{
            it('reutrn false and log an error', ()=>{
                newChain.addBlock({
                    data: [transaction, transaction, transaction, rewardTransaction]
                });

                expect(blockchain.validTransactionData({chain: newChain.chain })
                ).toBe(false);
                expect(errorMock).toHaveBeenCalled();

            });
        })
    });
}); 