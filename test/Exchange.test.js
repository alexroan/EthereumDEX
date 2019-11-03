import {tokens, EVM_REVERT, ETHER_ADDRESS, ether} from './helpers';

const Exchange = artifacts.require('./Exchange');
const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Exchange', ([deployer, feeAccount, user1]) => {
    let exchange;
    let feePercent = 10;
    let token;

    beforeEach(async () => {
        exchange = await Exchange.new(feeAccount, feePercent);
        token = await Token.new();
        await token.transfer(user1, tokens(100), {from: deployer});
        // console.log((await token.balanceOf(user1)).toString());
    });

    describe('deployment', () => {
        it('tracks the fee account', async () => {
            const result = await exchange.feeAccount();
            result.should.equal(feeAccount);
        });

        it('tracks the fee percent', async () => {
            const result = await exchange.feePercent();
            result.toString().should.equal(feePercent.toString());
        });
    });

    describe('depositing ether', () => {
        let result;
        let amount;
        let balance;

        describe('sucess', () => {
            beforeEach(async () => {
                amount = ether(1);
                result = await exchange.depositEther({from: user1, value: amount});
            });

            it('tracks the ether deposit', async () => {
                balance = await exchange.tokens(ETHER_ADDRESS, user1);
                balance.toString().should.equal(amount.toString());
            });

            it('emits a deposit event', async () => {
                it('emits a deposit event', async () => {
                    let eventLog = result.logs[0];
                    eventLog.event.should.equal('Deposit');
                    let args = eventLog.args;
                    args._token.should.equal(ETHER_ADDRESS);
                    args._user.should.equal(user1);
                    args._amount.toString().should.equal(amount.toString());
                    args._balance.toString().should.equal(amount.toString());
                });
            });

        });

        describe('failure', () => {

        });

    });

    describe('depositing tokens', () => {
        let amount;
        let result;
        
        describe('sucess', () => {
            beforeEach(async () => {
                amount = tokens(10);
                await token.approve(exchange.address, amount, {from: user1});
                result = await exchange.depositToken(token.address, amount, {from: user1});
            });

            it('tracks the token deposit', async () => {
                //check token is transfered to exchange
                let balance = await token.balanceOf(exchange.address);
                balance.toString().should.equal(amount.toString());
                //check exchange correctly saves tokens
                balance = await exchange.tokens(token.address, user1);
                balance.toString().should.equal(amount.toString());
            });

            it('emits a deposit event', async () => {
                let eventLog = result.logs[0];
                eventLog.event.should.equal('Deposit');
                let args = eventLog.args;
                args._token.should.equal(token.address);
                args._user.should.equal(user1);
                args._amount.toString().should.equal(amount.toString());
                args._balance.toString().should.equal(amount.toString());
            });
        });

        describe('failure', () => {
            it('fails when no tokens are approved', async () => {
                result = await exchange.depositToken(token.address, amount, {from: user1})
                    .should.be.rejectedWith(EVM_REVERT);
            });

            it('rejects ether deposits', async () => {
                result = await exchange.depositToken(ETHER_ADDRESS, amount, {from: user1})
                    .should.be.rejectedWith(EVM_REVERT);
            });
        });

    });

    describe('fallback', () => {
        it('reverts when ether is sent', async () => {
            //send transaction is the fallback function in JS
            await exchange.sendTransaction({from: deployer, value:ether(1)})
                .should.be.rejectedWith(EVM_REVERT);
        });
    });
});