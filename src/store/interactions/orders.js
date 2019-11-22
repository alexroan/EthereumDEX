import {
    cancelledOrdersLoaded,
    ordersLoaded,
    tradesLoaded,
    orderCancelling,
    orderFilling
} from "../actions";

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

export const fillOrder = (dispatch, exchange, order, account) => {
    exchange.methods.fillOrder(order._id).send({from: account})
        //only dispatch the redux action once the hash has come back from the blockchain
        .on('transactionHash', (hash) => {
            dispatch(orderFilling());
        })
        .on('error', (error) => {
            console.log(error);
            window.alert("There was an error");
        })
}