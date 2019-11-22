import {tokenLoaded, exchangeLoaded} from '../actions';
import Token from '../../abis/Token.json';
import Exchange from '../../abis/Exchange.json';

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