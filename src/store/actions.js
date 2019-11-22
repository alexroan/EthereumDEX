export function web3Loaded(connection){
    return {
        type: 'WEB3_LOADED',
        connection
    }
}

export function web3AccountLoaded(account){
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account
    }
}

export function tokenLoaded(token){
    return {
        type: 'TOKEN_LOADED',
        token
    }
}

export function exchangeLoaded(exchange){
    return {
        type: 'EXCHANGE_LOADED',
        exchange
    }
}

export function cancelledOrdersLoaded(cancelledOrders){
    return {
        type: 'CANCELLED_ORDERS_LOADED',
        cancelledOrders
    }
}

export function ordersLoaded(orders){
    return {
        type: 'ORDERS_LOADED',
        orders
    }
}

export function tradesLoaded(trades){
    return {
        type: 'TRADES_LOADED',
        trades
    }
}

export function orderCancelling(){
    return {
        type: 'ORDER_CANCELLING',
    }
}

export function orderCancelled(order){
    return {
        type: 'ORDER_CANCELLED',
        order
    }
}