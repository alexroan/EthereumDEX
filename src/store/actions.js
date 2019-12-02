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

export function tokenLoaded(token, name){
    return {
        type: 'TOKEN_LOADED',
        token,
        name
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

export function etherDepositAmountChanged(amount){
    return {
        type: 'ETHER_DEPOSIT_AMOUNT_CHANGED',
        amount
    }
}

export function etherWithdrawAmountChanged(amount){
    return {
        type: 'ETHER_WITHDRAW_AMOUNT_CHANGED',
        amount
    }
}

export function tokenDepositAmountChanged(amount){
    return {
        type: 'TOKEN_DEPOSIT_AMOUNT_CHANGED',
        amount
    }
}

export function tokenWithdrawAmountChanged(amount){
    return {
        type: 'TOKEN_WITHDRAW_AMOUNT_CHANGED',
        amount
    }
}

export function buyOrderAmountChanged(amount) {
    return {
        type: 'BUY_ORDER_AMOUNT_CHANGED',
        amount
    }
}

export function buyOrderPriceChanged(price) {
    return {
        type: 'BUY_ORDER_PRICE_CHANGED',
        price
    }
}

export function buyOrderMaking(){
    return {
        type: 'BUY_ORDER_MAKING'
    }
}

export function sellOrderAmountChanged(amount) {
    return {
        type: 'SELL_ORDER_AMOUNT_CHANGED',
        amount
    }
}

export function sellOrderPriceChanged(price) {
    return {
        type: 'SELL_ORDER_PRICE_CHANGED',
        price
    }
}

export function sellOrderMaking(){
    return {
        type: 'SELL_ORDER_MAKING'
    }
}

export function orderMade(order){
    return {
        type: 'ORDER_MADE',
        order
    }
}