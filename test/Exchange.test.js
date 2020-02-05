import {tokens, EVM_REVERT, ETHER_ADDRESS, ether} from './helpers';

const Exchange = artifacts.require('./Exchange');
const Token = artifacts.require('./MyERC20');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
    let exchange;
    let feePercent = 10;
    let token;

    beforeEach(async () => {
        exchange = await Exchange.new(feeAccount, feePercent);
        token = await Token.new();
        await token.transfer(user1, tokens(100), {from: deployer});
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
                let eventLog = result.logs[0];
                eventLog.event.should.equal('Deposit');
                let args = eventLog.args;
                args._token.should.equal(ETHER_ADDRESS);
                args._user.should.equal(user1);
                args._amount.toString().should.equal(amount.toString());
                args._balance.toString().should.equal(amount.toString());
            });

        });

        describe('failure', () => {
            //TODO
        });

    });

    describe('withdrawing ether', () => {
        let result;
        let amount;
        let balance;

        beforeEach(async () => {
            amount = ether(1);
            result = await exchange.depositEther({from: user1, value: amount});
        });

        describe('sucess', () => {

            beforeEach(async () => {
                result = await exchange.withdrawEther(amount, {from: user1});
            });

            it('allows withdrawal', async () => {
                balance = await exchange.tokens(ETHER_ADDRESS, user1);
                balance.toString().should.equal("0");
            });

            it('emits a withdraw event', async () => {
                it('emits a withdraw event', async () => {
                    let eventLog = result.logs[0];
                    eventLog.event.should.equal('Withdraw');
                    let args = eventLog.args;
                    args._token.should.equal(ETHER_ADDRESS);
                    args._user.should.equal(user1);
                    args._amount.toString().should.equal(amount.toString());
                    args._balance.toString().should.equal(amount.toString());
                });
            });

        });

        describe('failure', () => {
            it('rejects invalid amount', async () => {
                result = await exchange.withdrawEther(tokens(100), {from: user1})
                    .should.be.rejectedWith(EVM_REVERT);
            });
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

            it('returns the current balance', async () => {
                let balance = await exchange.balanceOf(token.address, user1);
                balance.toString().should.equal(amount.toString());
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

    describe('withdrawing tokens', () => {
        let result;
        let amount;
        let balance;

        beforeEach(async () => {
            amount = tokens(10);
                await token.approve(exchange.address, amount, {from: user1});
                result = await exchange.depositToken(token.address, amount, {from: user1});
        });

        describe('sucess', () => {

            beforeEach(async () => {
                result = await exchange.withdrawToken(token.address, amount, {from: user1});
            });

            it('allows withdrawal', async () => {
                balance = await exchange.tokens(token.address, user1);
                balance.toString().should.equal("0");
            });

            it('emits a withdraw event', async () => {
                it('emits a withdraw event', async () => {
                    let eventLog = result.logs[0];
                    eventLog.event.should.equal('Withdraw');
                    let args = eventLog.args;
                    args._token.should.equal(token.address);
                    args._user.should.equal(user1);
                    args._amount.toString().should.equal(amount.toString());
                    args._balance.toString().should.equal(amount.toString());
                });
            });

        });

        describe('failure', () => {
            it('rejects invalid amount', async () => {
                result = await exchange.withdrawToken(token.address, tokens(100), {from: user1})
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

    describe('make orders', () => {
        let result;
        let amountGet = tokens(1);
        let amountGive = ether(1);        

        beforeEach(async () => {
            result = await exchange.makeOrder(token.address, amountGet, ETHER_ADDRESS, amountGive,{from: user1});
        });

        it('creates the new order', async () => {
            const orderCount = await exchange.orderCount();
            orderCount.toString().should.equal("1");
            const order = await exchange.orders(orderCount);
            order.id.toString().should.equal("1", "id is correct");
            order.user.should.equal(user1, "user is correct");
            order.tokenGet.should.equal(token.address, "token get is correct");
            order.amountGet.toString().should.equal(amountGet.toString(), "amount get is correct");
            order.tokenGive.should.equal(ETHER_ADDRESS, "token give is correct");
            order.amountGive.toString().should.equal(amountGive.toString(), "amount give is correct");
        });

        it('emits an order event', async () => {
            let eventLog = result.logs[0];
            eventLog.event.should.equal('Order');
            let args = eventLog.args;
            args._id.toString().should.equal("1", "id is correct");
            args._user.should.equal(user1, "user is correct");
            args._tokenGet.should.equal(token.address, "token get is correct");
            args._amountGet.toString().should.equal(amountGet.toString(), "amount get is correct");
            args._tokenGive.should.equal(ETHER_ADDRESS, "token give is correct");
            args._amountGive.toString().should.equal(amountGive.toString(), "amount give is correct");
        });
    });

    describe('order actions', () => {
        let result;
        let amountGet = tokens(1);
        let amountGive = ether(1);
        beforeEach(async () => {
            //user 1 deposit either to exchange
            await exchange.depositEther({from: user1, value: ether(1)});
            //deployer give user2 100 tokens
            await token.transfer(user2, tokens(100), {from: deployer});
            //user2 approve and deposit 2 tokens to exchange
            await token.approve(exchange.address, tokens(2), {from: user2});
            await exchange.depositToken(token.address, tokens(2), {from: user2});
            //user1 make order
            await exchange.makeOrder(token.address, amountGet, ETHER_ADDRESS, amountGive, {from:user1});
        });

        describe('filling orders', () => {
            describe('success', () => {
                beforeEach(async () => {
                    result = await exchange.fillOrder(1, {from: user2});
                });

                it('executes the trade and charges fees', async () => {
                    let balance;
                    balance = await exchange.balanceOf(token.address, user1);
                    balance.toString().should.equal(tokens(1).toString(), 'user1 received tokens');
                    balance = await exchange.balanceOf(ETHER_ADDRESS, user2);
                    balance.toString().should.equal(ether(1).toString(), 'user2 received Ether');
                    balance = await exchange.balanceOf(ETHER_ADDRESS, user1);
                    balance.toString().should.equal('0', 'user1 Ether deducted');
                    balance = await exchange.balanceOf(token.address, user2);
                    balance.toString().should.equal(tokens(0.9).toString(), 'user2 tokens deducted with fee applied');
                    const feeAccount = await exchange.feeAccount();
                    balance = await exchange.balanceOf(token.address, feeAccount);
                    balance.toString().should.equal(tokens(0.1).toString(), 'feeAccount received fee');
                });

                it('updates filled orders', async () => {
                    const orderFilled = await exchange.orderFilled(1);
                    orderFilled.should.equal(true);
                });

                it('emits a trade event', async () => {
                    let eventLog = result.logs[0];
                    eventLog.event.should.equal('Trade');
                    let args = eventLog.args;
                    args._id.toString().should.equal("1", "id is correct");
                    args._user.should.equal(user1, "user is correct");
                    args._tokenGet.should.equal(token.address, "token get is correct");
                    args._amountGet.toString().should.equal(amountGet.toString(), "amount get is correct");
                    args._tokenGive.should.equal(ETHER_ADDRESS, "token give is correct");
                    args._amountGive.toString().should.equal(amountGive.toString(), "amount give is correct");
                    args._userFill.should.equal(user2, "Fill user is correct");
                });
            });
            describe('failure', () => {
                it('rejects invalid order ids', async () => {
                    await exchange.fillOrder(999).should.be.rejectedWith(EVM_REVERT);
                });

                it('rejects on cancelled orders', async () => {
                    await exchange.cancelOrder(1, {from: user1});
                    await exchange.fillOrder(1, {from: user2}).should.be.rejectedWith(EVM_REVERT);
                });

                it('rejects on orders already filled', async () => {
                    await exchange.fillOrder(1, {from: user2});
                    await exchange.fillOrder(1, {from: user2}).should.be.rejectedWith(EVM_REVERT);
                });
            });
        });

        describe('cancel an order', () => {
            describe('success', () => {
                beforeEach(async () => {
                    result = await exchange.cancelOrder(1, {from:user1});
                });
    
                it('updates cancelled orders', async () => {
                    const orderCancelled = await exchange.orderCancelled(1);
                    orderCancelled.should.equal(true);
                });
    
                it('emits an cancel event', async () => {
                    let eventLog = result.logs[0];
                    eventLog.event.should.equal('Cancel');
                    let args = eventLog.args;
                    args._id.toString().should.equal("1", "id is correct");
                    args._user.should.equal(user1, "user is correct");
                    args._tokenGet.should.equal(token.address, "token get is correct");
                    args._amountGet.toString().should.equal(amountGet.toString(), "amount get is correct");
                    args._tokenGive.should.equal(ETHER_ADDRESS, "token give is correct");
                    args._amountGive.toString().should.equal(amountGive.toString(), "amount give is correct");
                });
            });
    
            describe('failure', async () => {
                //TODO reject invalid user
                //TODO reject invalid order id
            });
        })
    });
});