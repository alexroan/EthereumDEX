import {EVM_REVERT, ETHER_ADDRESS} from './helpers';

const Pairs = artifacts.require('./Pairs');
const Token = artifacts.require('./MyERC20');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Pairs', ([deployer]) => {
    let pairs, token, token2;

    beforeEach(async () => {
        token = await Token.new();
        token2 = await Token.new();
        pairs = await Pairs.new();
    });

    describe('deployment', () => {
        it('adds tokens', async () => {
            await pairs.add(token.address);
            await pairs.add(token2.address);
            let result = await pairs.addresses(0);
            result.should.equal(token.address);
            let result2 = await pairs.addresses(1);
            result2.should.equal(token2.address);
        });

        it('emits a NewAddress event', async () => {
            let result = await pairs.add(token.address);
            let eventLog = result.logs[0];
            eventLog.event.should.equal('NewAddress');
            let args = eventLog.args;
            args.tokenAddress.should.equal(token.address);
            args.symbol.should.equal(await token.symbol());
            args.user.should.equal(deployer);
        });

        it('does not add ether', async () => {
            await pairs.add(ETHER_ADDRESS).should.be.rejectedWith(EVM_REVERT);
        });
    });
});