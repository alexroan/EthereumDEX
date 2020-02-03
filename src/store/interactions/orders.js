import {
    cancelledOrdersLoaded,
    ordersLoaded,
    tradesLoaded,
    orderCancelling,
    orderFilling,
    buyOrderMaking
} from "../actions";
import {ETHER_ADDRESS} from '../../helpers';
import { loadBalances } from "./contracts";

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

export const fillOrder = (dispatch, exchange, order, account, web3, token) => {
    exchange.methods.fillOrder(order._id).send({from: account})
        //only dispatch the redux action once the hash has come back from the blockchain
        .on('transactionHash', (hash) => {
            dispatch(orderFilling());
        })
        .on('receipt', (hash) => {
            loadBalances(web3, exchange, token, account, dispatch);
        })
        .on('error', (error) => {
            console.log(error);
            window.alert("There was an error");
        })
}

export const makeBuyOrder = (dispatch, exchange, token, web3, order, account) => {
    const tokenGet = token.options.address;
    const amountGet = web3.utils.toWei(order.amount, 'ether');
    const tokenGive = ETHER_ADDRESS;
    const amountGive = web3.utils.toWei((order.amount * order.price).toFixed(18), 'ether');

    exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({from: account})
        .on('transactionHash', (hash) => {
            dispatch(buyOrderMaking());
        })
        .on('error', (error) => {
            console.log(error);
            window.alert('Error with making order');
        });
}

export const makeSellOrder = (dispatch, exchange, token, web3, order, account) => {
    const tokenGet = ETHER_ADDRESS;
    const amountGet = web3.utils.toWei((order.amount * order.price).toFixed(18), 'ether');
    const tokenGive = token.options.address;
    const amountGive = web3.utils.toWei(order.amount, 'ether');

    exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({from: account})
        .on('transactionHash', (hash) => {
            dispatch(buyOrderMaking());
        })
        .on('error', (error) => {
            console.log(error);
            window.alert('Error with making order');
        });
}