import {get} from 'lodash';
import {createSelector} from 'reselect';
import {ether, tokens, ETHER_ADDRESS, GREEN, RED} from '../helpers';
import moment from 'moment';

const account = state => get(state, 'web3.account');
export const accountSelector = createSelector(account, a => a);

const tokenLoaded = state => get(state, 'token.loaded', false);
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl);

const exchangeLoaded = state => get(state, 'exchange.loaded', false);
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el);

const exchange = state => get(state, 'exchange.contract', false);
export const exchangeSelector = createSelector(exchange, e => e);

const cancelledOrdersLoaded = state => get(state, 'exchange.cancelledOrders.loaded', false);
export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, col => col);

const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', []);
export const cancelledOrdersSelector = createSelector(cancelledOrders, co => co);

const ordersLoaded = state => get(state, 'exchange.orders.loaded', false);
export const ordersLoadedSelector = createSelector(ordersLoaded, ol => ol);

const orders = state => get(state, 'exchange.orders.data', []);
export const ordersSelector = createSelector(orders, o => o);

const tradesLoaded = state => get(state, 'exchange.orders.loaded', false);
export const tradesLoadedSelector = createSelector(tradesLoaded, ol => ol);

export const contractsLoadedSelector = createSelector(
    tokenLoaded, 
    exchangeLoaded, 
    (tl, el) => (tl && el)
);

const trades = state => get(state, 'exchange.trades.data', []);    
export const tradesSelector = createSelector(
    trades, 
    (orders) => {
        //sort ascending for price comparison
        orders = orders.sort((a,b) => a._timestamp - b._timestamp);
        //decorate
        orders = decorateTrades(orders);
        //sort descending for display
        orders = orders.sort((a,b) => b._timestamp - a._timestamp);
        console.log(orders);
        return orders;
    } 
);

const decorateTrades = (orders) => {
    let previousOrder = orders[0];
    return(orders.map((order) => {
        order = decorateOrder(order);
        order = decorateFilledOrder(order, previousOrder);
        previousOrder = order;
        return order;
    }));
}

//decorate objects to be readable from events
const decorateOrder = (order) => {
    let etherAmount, tokenAmount;
    if(order._tokenGive === "0x0000000000000000000000000000000000000000") {
        etherAmount = order._amountGive;
        tokenAmount = order._amountGet;
    }
    else{
        etherAmount = order._amountGet;
        tokenAmount = order._amountGive;
    }

    const precision = 100000;
    let tokenPrice = (etherAmount / tokenAmount);
    tokenPrice = Math.round(tokenPrice * precision) / precision;

    return({
        ...order,
        etherAmount: ether(etherAmount),
        tokenAmount: tokens(tokenAmount),
        tokenPrice,
        formattedTimestamp: moment.unix(order._timestamp).format('h:mm:ss a M/D')
    });
}

//Specific decorator for filled orders only
//If higher than previous = green, lower than previous = red
const decorateFilledOrder = (order, previousOrder) => {
    return ({
        ...order,
        tokenPriceClass: tokenPriceClass(order.tokenPrice, previousOrder)
    });
}

const tokenPriceClass = (price, previousOrder) => {
    return (previousOrder.tokenPrice > price) ? RED : GREEN;
}