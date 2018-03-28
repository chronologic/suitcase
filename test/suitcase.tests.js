const Suitcase = artifacts.require('./contracts/Suitcase.sol')
const SimpleToken = artifacts.require('./contracts/SimpleToken.sol')
const abi = require('ethereumjs-abi')

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised);
const assert = chai.assert;

contract('Suitecase', accounts => {
    let simpleToken, suitcase
    const value = 10 * 10 ** 18

    beforeEach(async () => {
        simpleToken = await SimpleToken.new()
        suitcase = await Suitcase.new()

        await fundSuitCase()
    })

    const fundSuitCase = async() => {
        await simpleToken.transfer(suitcase.address, value)
        assert.equal(await simpleToken.balanceOf(suitcase.address), value)
    }
    
    const assertTransfered = async() => {
        assert.equal(await simpleToken.balanceOf(suitcase.address), 0)
        assert.equal(await simpleToken.balanceOf(accounts[1]), value)
    }

    const assertNotTransfered = async() => {
        assert.equal(await simpleToken.balanceOf(suitcase.address), value)
        assert.equal(await simpleToken.balanceOf(accounts[1]), 0)
    }

    describe('using transfer() =>', async() => {
        it('should be able to transfer tokens', async () => {
            await suitcase.transfer(simpleToken.address, accounts[1], value)
            
            await assertTransfered()
        })

        it('should not able to transfer tokens when sale has been started', async () => {
            await suitcase.initiateSale(value, 0)
            assert.isRejected(suitcase.transfer(simpleToken.address, accounts[1], value))
    
            await assertNotTransfered()
        })

        it('should be able to transfer tokens after sale cancelled', async () => {
            await suitcase.initiateSale(value, 0)
            await suitcase.cancelSale()
    
            await suitcase.transfer(simpleToken.address, accounts[1], value)
            
            await assertTransfered()
        })
    })

    describe("using proxy() =>", async() => {
        it('should be able to transfer tokens', async () => {
            const data = abi.simpleEncode("transfer(address,uint256):(bool)", accounts[1], value.toString())
            await suitcase.proxy(simpleToken.address, `0x${data.toString('hex')}`)
            
            await assertTransfered()
        })      
    
        it('should not able to transfer tokens when sale has been started', async () => {
            await suitcase.initiateSale(value, 0)
            const data = abi.simpleEncode("transfer(address,uint256):(bool)", accounts[1], value.toString())
            assert.isRejected(suitcase.proxy(simpleToken.address, `0x${data.toString('hex')}`))
    
            await assertNotTransfered()
        })
    
        it('should be able to transfer tokens from the contract after sale cancelled', async () => {
            await suitcase.initiateSale(value, 0)
            await suitcase.cancelSale()
            
            const data = abi.simpleEncode("transfer(address,uint256):(bool)", accounts[1], value.toString())
            await suitcase.proxy(simpleToken.address, `0x${data.toString('hex')}`)
            
            await assertTransfered()
        })
    })

    describe('sellable =>', async() => {
        const buyer = accounts[2]
        const sellValue = 1000

        describe('sale started with specified buyer =>', async() => {
            beforeEach(async() => {
                await suitcase.initiateSale(sellValue, buyer)
            })

            it('buyer should be able to complete sale', async() => {
                suitcase.completeSale({from: buyer, value: sellValue})
                
                assert.isFalse(await suitcase.selling())
                assert.equal(await suitcase.owner(), buyer)
            })

            it('other buyers should not be able to complete sale', async() => {
                assert.isRejected(suitcase.completeSale({from: accounts[0], value: sellValue}))
                assert.isRejected(suitcase.completeSale({from: accounts[1], value: sellValue}))
            })
        })

        describe('sale started =>', async() => {
            beforeEach(async() => {
                await suitcase.initiateSale(sellValue, 0)
            })

            it('should not sell if value is lower than sell value', async() => {
                assert.isRejected(suitcase.completeSale({from: buyer, value: sellValue-1}))
            })

            it('should not sell if value is higher than sell value', async() => {
                assert.isRejected(suitcase.completeSale({from: buyer, value: sellValue+1}))
            })
        })

        describe('sale completed =>', async() => {
            beforeEach(async() => {
                await suitcase.initiateSale(sellValue, 0)
                await suitcase.completeSale({from: buyer, value: sellValue})
            })

            it('buyer should be able to transfer tokens', async() => {
                await suitcase.transfer(simpleToken.address, accounts[1], value, {from: buyer})
                await assertTransfered()
            })
    
            it('previous owner should not be able to transfer tokens', async() => {
                assert.isRejected(suitcase.transfer(simpleToken.address, accounts[1], value))
                await assertNotTransfered()
            })

            it('buyer should be able to start new sale', async() => {
                await suitcase.initiateSale(value, 0, {from: buyer})

                assert.isTrue(await suitcase.selling())
            })
        })
   })
})
