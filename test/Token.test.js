import {tokens, EVM_REVERT} from './helpers';

const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Token', ([deployer, receiver]) => {
    let token;
    const totalSupply = tokens(1000000).toString();

    beforeEach(async () => {
        token = await Token.new();
    });

    describe('deployment', () => {
        const name = "Token Name";
        const symbol = "TOK";
        const decimals = "18";
        

        it('tracks the name', async () => {
            const result = await token.name();
            result.should.equal(name);
        });

        it('tracks the symbol', async () => {
            const result = await token.symbol();
            result.should.equal(symbol);
        });

        it('tracks the decimals', async () => {
            const result = await token.decimals();
            const parseResult = result.toString();
            parseResult.should.equal(decimals);
        });

        it('tracks the total supply', async () => {
            const result = await token.totalSupply();
            const parseResult = result.toString();
            parseResult.should.equal(totalSupply);
        });

        it('gives the total supply to the sender', async () => {
            const result = await token.balanceOf(deployer);
            const parseResult = result.toString();
            parseResult.should.equal(totalSupply);
        });
    });

    describe('transfering tokens', () => {
        let result;
        let amount;
        let deployerBalance;

        describe('failure', async () => {
            it('rejects insufficient balances', async () => {
                let invalidAmount = tokens(100000000); //too much
                await token.transfer(receiver, invalidAmount, {from: deployer})
                    .should.be.rejectedWith(EVM_REVERT);

                invalidAmount = tokens(10); //too much
                await token.transfer(deployer, invalidAmount, {from: receiver})
                    .should.be.rejectedWith(EVM_REVERT);
            });

            it('rejects invalid recipients', async () => {
                amount = tokens(10);
                await token.transfer(0x0, amount, {from: deployer})
                    .should.be.rejected;
            });
        });

        describe('success', async () => {
            beforeEach(async () => {
                deployerBalance = await token.balanceOf(deployer);
                let receiverBalance = await token.balanceOf(receiver);
    
                deployerBalance.toString().should.equal(totalSupply);
                receiverBalance.toString().should.equal("0");
    
                amount = tokens(100);
                result = await token.transfer(receiver, amount, {from: deployer});
            });
    
            it('transfers balances', async () => {
                let deployerBalanceAfter = parseInt(await token.balanceOf(deployer));
                let receiverBalanceAfter = parseInt(await token.balanceOf(receiver));
    
                deployerBalanceAfter.should.equal(deployerBalance - amount);
                receiverBalanceAfter.toString().should.equal(amount.toString());
            });
    
            it('emits transfer event', async () => {
                let eventLog = result.logs[0];
                eventLog.event.should.equal('Transfer');
                let args = eventLog.args;
                args.from.should.equal(deployer);
                args.to.should.equal(receiver);
                args.value.toString().should.equal(amount.toString());
            });
        });
    });
});