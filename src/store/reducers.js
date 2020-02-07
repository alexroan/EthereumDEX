import {combineReducers} from 'redux';

function web3(state = {}, action) {
    switch (action.type) {
        case 'WEB3_LOADED':
            return { ...state, connection: action.connection };
        case 'WEB3_ACCOUNT_LOADED':
            return { ...state, account: action.account };
        case 'ETHER_BALANCE_LOADED':
                return { ...state, balance: action.balance };
        default:
            return state;
    }
}

function pairs(state = {}, action) {
    switch(action.type) {
        case 'PAIRS_LOADED':
            return { ...state, contract: action.pairs };
        case 'AVAILABLE_TOKENS_LOADING':
            return { ...state, loaded: false };
        case 'AVAILABLE_TOKENS_LOADED':
            return { ...state, loaded: true };
        case 'NUMBER_OF_TOKENS_LOADED':
            return { ...state, number: action.numberOfTokens };
        case 'TOKEN_PAIRS_LOADED':
            return { ...state, tokens: action.pairs};
        default:
            return state;
    }
}

function token(state = {}, action) {
    switch (action.type) {
        case 'TOKEN_LOADED':
            return { ...state, loaded: true, contract: action.token, name: action.name };
        case 'TOKEN_BALANCE_LOADED':
                return { ...state, balance: action.balance };
        default:
            return state;
    }
}

function exchange(state = {}, action) {
    let index, data;
    switch (action.type) {
        case 'EXCHANGE_LOADED':
            return { ...state, loaded: true, contract: action.exchange} ;
        case 'CANCELLED_ORDERS_LOADED':
            return { ...state, cancelledOrders: {loaded: true, data: action.cancelledOrders }};  
        case 'ORDERS_LOADED':
            return { ...state, orders: {loaded: true, data: action.orders }};      
        case 'TRADES_LOADED':
            return { ...state, trades: {loaded: true, data: action.trades }};
        case 'ORDER_CANCELLING':
            return { ...state, orderCancelling: true };
        case 'ORDER_CANCELLED':
            return { 
                ...state, 
                orderCancelling: false,
                cancelledOrders: {
                    ...state.cancelledOrders,
                    data: [
                        ...state.cancelledOrders.data,
                        action.order
                    ]
                }
            };
        case 'ORDER_FILLING':
            return { ...state, orderFilling: true };
        case 'ORDER_FILLED':
            //prevent duplicates in the redux store
            index = state.trades.data.findIndex(order => order._id === action.order._id);
            data = state.trades.data;
            //if it doesn't already exist, add to the store
            if (index === -1){
                data = [...state.trades.data, action.order];
            }
            return {
                ...state,
                orderFilling:false,
                trades: {
                    ...state.trades,
                    data
                }
            }
        case 'EXCHANGE_ETHER_BALANCE_LOADED':
            return { ...state, etherBalance: action.balance }
        case 'EXCHANGE_TOKEN_BALANCE_LOADED':
            return { ...state, tokenBalance: action.balance }
        case 'BALANCES_LOADING':
            return { ...state, balancesLoading: true }
        case 'BALANCES_LOADED':
            return { ...state, balancesLoading: false }
        case 'ETHER_DEPOSIT_AMOUNT_CHANGED':
            return { ...state, etherDepositAmount: action.amount}
        case 'ETHER_WITHDRAW_AMOUNT_CHANGED':
            return { ...state, etherWithdrawAmount: action.amount}
        case 'TOKEN_DEPOSIT_AMOUNT_CHANGED':
                return { ...state, tokenDepositAmount: action.amount}
        case 'TOKEN_WITHDRAW_AMOUNT_CHANGED':
            return { ...state, tokenWithdrawAmount: action.amount}
        case 'BUY_ORDER_AMOUNT_CHANGED':
            return { ...state, buyOrder: { ...state.buyOrder, amount: action.amount } }
        case 'BUY_ORDER_PRICE_CHANGED':
            return { ...state, buyOrder: { ...state.buyOrder, price: action.price } }
        case 'BUY_ORDER_MAKING':
            return { ...state, buyOrder: { ...state.buyOrder, amount: null, price: null, making: true} }
        case 'SELL_ORDER_AMOUNT_CHANGED':
            return { ...state, sellOrder: { ...state.sellOrder, amount: action.amount } }
        case 'SELL_ORDER_PRICE_CHANGED':
            return { ...state, sellOrder: { ...state.sellOrder, price: action.price } }
        case 'SELL_ORDER_MAKING':
            return { ...state, sellOrder: { ...state.sellOrder, amount: null, price: null, making: true} }
        case 'ORDER_MADE':
            //prevent duplicates in the redux store
            index = state.orders.data.findIndex(order => order._id === action.order._id);
            data = state.orders.data;
            if (index === -1){
                data = [...state.orders.data, action.order];
            }
            return {
                ...state,
                orders: {
                    ...state.orders,
                    data
                },
                buyOrder: {
                    ...state.buyOrder,
                    making:false
                },
                sellOrder: {
                    ...state.sellOrder,
                    making:false
                }
            }
        default:
            return state;
    }
}


const rootReducer = new combineReducers({
    web3,
    token,
    exchange,
    pairs
});

export default rootReducer;