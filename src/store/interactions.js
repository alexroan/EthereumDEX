import { 
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    cancelledOrdersLoaded,
    ordersLoaded,
    tradesLoaded,
    orderCancelling,
    orderCancelled
} from "./actions";
import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';

export const loadWeb3 = (dispatch) => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    dispatch(web3Loaded(web3));
    return web3;
}

export const loadAccount = async (web3, dispatch) => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    dispatch(web3AccountLoaded(account));
    return account;
}

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

export const loadAllOrders = async (dispatch, exchange) => {
    try{
        // Cancelled
        const cancelStream = await exchange.getPastEvents("Cancel", {fromBlock: 0, toBlock: 'latest'});
        const cancelledOrders = cancelStream.map((event) => event.returnValues);
        dispatch(cancelledOrdersLoaded(cancelledOrders));
        // Trade events (filles)
        const tradeStream = await exchange.getPastEvents("Trade", {fromBlock: 0, toBlock: 'latest'});
        const trades = tradeStream.map((event) => event.returnValues);
        dispatch(tradesLoaded(trades));
        // Open orders
        const orderStream = await exchange.getPastEvents("Order", {fromBlock: 0, toBlock: 'latest'});
        const orders = orderStream.map((event) => event.returnValues);
        dispatch(ordersLoaded(orders));

    }
    catch(err){
        console.log(err);
    }
}

export const cancelOrder = (dispatch, exchange, order, account) => {
    exchange.methods.cancelOrder(order._id).send({from: account})
        //only dispatch the redux action once the hash has come back from the blockchain
        .on('transactionHash', (hash) => {
            dispatch(orderCancelling());
        })
        .on('error', (error) => {
            console.log(error);
            window.alert("There was an error");
        })
}

//Subscriptions
export const subscribeToEvents = async (dispatch, exchange) => {
    exchange.events.Cancel({}, (error, event) => {
        dispatch(orderCancelled(event.returnValues))
    });
}