import {orderCancelled, orderFilled, balancesLoaded, orderMade} from "../actions";

//Subscriptions
export const subscribeToEvents = async (dispatch, exchange) => {
    exchange.events.Cancel({}, (error, event) => {
        dispatch(orderCancelled(event.returnValues))
    });

    exchange.events.Trade({}, (error, event) => {
        dispatch(orderFilled(event.returnValues));
    });

    exchange.events.Deposit({}, (error, event) => {
        dispatch(balancesLoaded());
    });

    exchange.events.Withdraw({}, (error, event) => {
        dispatch(balancesLoaded());
    });

    exchange.events.Order({}, (error, event) => {
        dispatch(orderMade(event.returnValues));
    })
}