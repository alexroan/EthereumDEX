const Token = artifacts.require("Token");
const MyERC20 = artifacts.require("MyERC20");
const Exchange = artifacts.require("Exchange");


module.exports = async function(deployer) {
	const accounts = await web3.eth.getAccounts();
	const feeAccount = accounts[0];
	const feePercent = 10;
	await deployer.deploy(MyERC20);
	await deployer.deploy(Token);
	await deployer.deploy(Exchange, feeAccount, feePercent);
};