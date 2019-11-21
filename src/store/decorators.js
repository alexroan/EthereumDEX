import {ether, tokens, GREEN, RED, ETHER_ADDRESS} from '../helpers';
import moment from 'moment';
import {groupBy, maxBy, minBy} from 'lodash';

export const buildGraphData = (orders) => {
    orders = groupBy(orders, (o) => moment.unix(o._timestamp).startOf('hour').format());
    const hours = Object.keys(orders);
    
    const graphData = hours.map((hour) => {
        // calculate open, low, high, close
        const hourGroup = orders[hour];
        const open = hourGroup[0];
        const close = hourGroup[hourGroup.length-1];
        const high = maxBy(hourGroup, 'tokenPrice');
        const low = minBy(hourGroup, 'tokenPrice');
        return ({
            x: new Date(hour),
            y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
        });
    });
    return graphData;
}


//My Transactions
export const decorateMyFilledOrders = (orders, account) => {
    return(
        orders.map((order) => {
        order = decorateOrder(order)
        order = decorateMyFilledOrder(order, account)
        return(order)
        })
    )
}
//decorate orders depending on if they are buy or sell
const decorateMyFilledOrder = (order, account) => {
    const myOrder = order._user === account

    let orderType
    if(myOrder) {
        orderType = order._tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
    } else {
        orderType = order._tokenGive === ETHER_ADDRESS ? 'sell' : 'buy'
    }

    return({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderSign: (orderType === 'buy' ? '+' : '-')
    })
}
export const decorateMyOpenOrders = (orders, account) => {
    return(
        orders.map((order) => {
        order = decorateOrder(order)
        order = decorateMyOpenOrder(order, account)
        return(order)
        })
    )
}
const decorateMyOpenOrder = (order, account) => {
    let orderType = order._tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
  
    return({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED)
    })
}

//Order Book
export const decorateOrderBookOrders = (orders) => {
    return(
        orders.map((order) => {
            order = decorateOrder(order);
            order = decorateOrderBookOrder(order);
            return order;
        })
    )
}
const decorateOrderBookOrder = (order) => {
    const orderType = order._tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy') ? GREEN : RED,
        orderFillClass: (orderType === 'buy') ? 'sell' : 'buy'
    })
}


//Trades
export const decorateTrades = (orders) => {
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