const Token = artifacts.require('./Token')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', (accounts) => {
    describe('deployment', () => {
        it('gets the name', async () => {
            const token = await Token.new()
            const result = await token.name()
            result.should.equal("Token Name")
        })
    })
});