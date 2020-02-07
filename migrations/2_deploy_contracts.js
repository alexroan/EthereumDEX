const MyERC20 = artifacts.require("MyERC20");
const SecondERC20 = artifacts.require("SecondERC20");
const Exchange = artifacts.require("Exchange");
const Pairs = artifacts.require("Pairs");

module.exports = async function(deployer) {
	const accounts = await web3.eth.getAccounts();
	const feeAccount = accounts[0];
	const feePercent = 10;
	let token = await deployer.deploy(MyERC20);
	let token2 = await deployer.deploy(SecondERC20);
	let pairs = await deployer.deploy(Pairs);
	await pairs.add(token.address);
	await pairs.add(token2.address);
	await deployer.deploy(Exchange, feeAccount, feePercent);
};