import {combineReducers} from 'redux';

function web3(state = {}, action) {
    switch (action.type) {
        case 'WEB3_LOADED':
            return { ...state, connection: action.connection};
        case 'WEB3_ACCOUNT_LOADED':
            return { ...state, account: action.account};
        case 'ETHER_BALANCE_LOADED':
                return { ...state, balance: action.balance }
        default:
            return state;
    }
}

function token(state = {}, action) {
    switch (action.type) {
        case 'TOKEN_LOADED':
            return { ...state, loaded: true, contract: action.token};  
        case 'TOKEN_BALANCE_LOADED':
                return { ...state, balance: action.balance }  
        default:
            return state;
    }
}

function exchange(state = {}, action) {
    switch (action.type) {
        case 'EXCHANGE_LOADED':
            return { ...state, loaded: true, contract: action.exchange};
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
            let index = state.trades.data.findIndex(order => order._id === action.order._id);
            let data = state.trades.data;
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
        default:
            return state;
    }
}


const rootReducer = new combineReducers({
    web3,
    token,
    exchange
});

export default rootReducer;