const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Token', (accounts) => {
    let token;
    beforeEach(async () => {
        token = await Token.new();
    });

    describe('deployment', () => {
        const name = "Token Name";
        const symbol = "TOK";
        const decimals = 18;
        const totalSupply = 1000000000000000000000000;

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
            const parseResult = parseInt(result);
            parseResult.should.equal(decimals);
        });

        it('tracks the total supply', async () => {
            const result = await token.totalSupply();
            const parseResult = parseInt(result);
            parseResult.should.equal(totalSupply);
        });
    });
});