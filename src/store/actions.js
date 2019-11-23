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

export function orderFilling(){
    return {
        type: 'ORDER_FILLING'
    }
}

export function orderFilled(order){
    return {
        type: 'ORDER_FILLED',
        order
    }
}

export function etherBalanceLoaded(balance){
    return {
        type: 'ETHER_BALANCE_LOADED',
        balance
    }
}

export function tokenBalanceLoaded(balance){
    return {
        type: 'TOKEN_BALANCE_LOADED',
        balance
    }
}

export function exchangeEtherBalanceLoaded(balance){
    return {
        type: 'EXCHANGE_ETHER_BALANCE_LOADED',
        balance
    }
}

export function exchangeTokenBalanceLoaded(balance){
    return {
        type: 'EXCHANGE_TOKEN_BALANCE_LOADED',
        balance
    }
}

export function balancesLoaded(){
    return {
        type: 'BALANCES_LOADED'
    }
}

export function balancesLoading(){
    return {
        type: 'BALANCES_LOADING'
    }
}