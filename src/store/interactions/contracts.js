import {tokenLoaded, exchangeLoaded, tokenBalanceLoaded, exchangeEtherBalanceLoaded, exchangeTokenBalanceLoaded, balancesLoaded} from '../actions';
import Token from '../../abis/Token.json';
import Exchange from '../../abis/Exchange.json';
import {ETHER_ADDRESS} from '../../helpers.js';
import {etherBalanceLoaded} from '../actions';

export const loadToken = async (web3, networkId, dispatch) => {
    try{
        const token = web3.eth.Contract(Token.abi, Token.networks[networkId].address);
        dispatch(tokenLoaded(token));
        return token;
    }
    catch (err){
        window.alert("Contract not deployed to current network");
    }
    return null;
}

export const loadExchange = async (web3, networkId, dispatch) => {
    try{
        const exchange = web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address);
        dispatch(exchangeLoaded(exchange));
        return exchange;
    }
    catch (err){
        window.alert("Contract not deployed to current network");
    }
    return null;
}

export const loadBalances = async (web3, exchange, token, account, dispatch) => {
    //ether balance
    const etherBalance = await web3.eth.getBalance(account);
    dispatch(etherBalanceLoaded(etherBalance));

    //token balance
    const tokenBalance = await token.methods.balanceOf(account).call();
    dispatch(tokenBalanceLoaded(tokenBalance));
    
    //balance of account on the smart contract
    const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
    dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance));

    //token balance of account on the smart contract
    const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call();
    dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance));

    dispatch(balancesLoaded());
}