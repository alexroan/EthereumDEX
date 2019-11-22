import {get, reject, groupBy} from 'lodash';
import {createSelector} from 'reselect';
import {account} from './web3';
import {decorateFilledOrders, 
    decorateOrderBookOrders, 
    decorateMyFilledOrders,
    decorateMyOpenOrders
} from './decorators/orders';

export const cancelledOrdersLoaded = state => get(state, 'exchange.cancelledOrders.loaded', false);
export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, col => col);

export const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', []);
export const cancelledOrdersSelector = createSelector(cancelledOrders, co => co);

export const ordersLoaded = state => get(state, 'exchange.orders.loaded', false);
export const ordersLoadedSelector = createSelector(ordersLoaded, ol => ol);

export const orders = state => get(state, 'exchange.orders.data', []);
export const ordersSelector = createSelector(orders, o => o);

export const filledOrdersLoaded = state => get(state, 'exchange.orders.loaded', false);
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, ol => ol);

export const filledOrders = state => get(state, 'exchange.trades.data', []);    
export const filledOrdersSelector = createSelector(
    filledOrders, 
    (orders) => {
        //sort ascending for price comparison
        orders = orders.sort((a,b) => a._timestamp - b._timestamp);
        //decorate
        orders = decorateFilledOrders(orders);
        //sort descending for display
        orders = orders.sort((a,b) => b._timestamp - a._timestamp);
        return orders;
    } 
);

//Return order that have not been traded (filled) or cancelled
const openOrders = state => {
    const all = orders(state);
    const cancelled = cancelledOrders(state);
    const filled = filledOrders(state);

    //reject the orders if they appear in filled or cancelled
    const openOrders = reject(all, (order) => {
        const orderFilled = filled.some((o) => o._id === order._id);
        const orderCancelled = cancelled.some((o) => o._id === order._id);
        return (orderFilled || orderCancelled);
    });
    return openOrders;
}
const orderBookLoaded = state => cancelledOrdersLoaded(state) && filledOrdersLoaded(state) && ordersLoaded(state);
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

//If all trades loaded, the my trades are definitely loaded
export const myFilledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded);
export const myFilledOrdersSelector = createSelector(
    account,
    filledOrders,
    (account, orders) => {
        // Find our orders
        orders = orders.filter((o) => o._user === account || o._userFill === account);
        // Sort by date descending
        orders = orders.sort((a,b) => b._timestamp - a._timestamp);
        // Decorate orders - add display attributes
        orders = decorateMyFilledOrders(orders, account);
        return orders;
    }
)

//If the order book is loaded, my open orders are definitely loaded
export const myOpenOrdersLoadedSelector = createSelector(orderBookLoaded, loaded => loaded);
export const myOpenOrdersSelector = createSelector(
    account,
    openOrders,
    (account, orders) => {
        // Filter orders created by current account
        orders = orders.filter((o) => o._user === account);
        // Decorate orders - add display attributes
        orders = decorateMyOpenOrders(orders);
        // Sort orders by date descending
        orders = orders.sort((a,b) => b._timestamp - a._timestamp);
        return orders;
    }
)

const orderCancelling = state => get(state, 'exchange.orderCancelling', false);
export const orderCancellingSelector = createSelector(orderCancelling, oc => oc);

const orderFilling = state => get(state, 'exchange.orderFilling', false);
export const orderFillingSelector = createSelector(orderFilling, of => of);