const MyERC20 = artifacts.require("MyERC20");
const Exchange = artifacts.require("Exchange");
const Pairs = artifacts.require("Pairs");

module.exports = async function(deployer) {
	const accounts = await web3.eth.getAccounts();
	const feeAccount = accounts[0];
	const feePercent = 10;
	let token = await deployer.deploy(MyERC20);
	let pairs = await deployer.deploy(Pairs);
	await pairs.add(token.address);
	await deployer.deploy(Exchange, feeAccount, feePercent);
};