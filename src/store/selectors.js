import {get, reject, groupBy} from 'lodash';
import {createSelector} from 'reselect';
import {decorateTrades, decorateOrderBookOrders} from './decorators';

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

//Return order that have not been traded (filled) or cancelled
const openOrders = state => {
    const all = orders(state);
    const cancelled = cancelledOrders(state);
    const filled = trades(state);

    //reject the orders if they appear in filled or cancelled
    const openOrders = reject(all, (order) => {
        const orderFilled = filled.some((o) => o._id === order._id);
        const orderCancelled = cancelled.some((o) => o._id === order._id);
        return (orderFilled || orderCancelled);
    });
    return openOrders;
}

const orderBookLoaded = state => cancelledOrdersLoaded(state) && ordersLoaded(state) && tradesLoaded(state);
export const orderBookLoadedSelector = createSelector(orderBookLoaded, obl => obl);

export const orderBookSelector = createSelector(
    openOrders,
    (orders) => {
        //decorate
        orders = decorateOrderBookOrders(orders);
        //group by type
        orders = groupBy(orders, 'orderType');
        let buyOrders = get(orders, 'buy', []);
        let sellOrders = get(orders, 'sell', []);
        orders = {
            ...orders,
            buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice),
            sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
        }
        return orders;
    }
)