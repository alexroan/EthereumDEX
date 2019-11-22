import {orderCancelled, orderFilled} from "../actions";

//Subscriptions
export const subscribeToEvents = async (dispatch, exchange) => {
    exchange.events.Cancel({}, (error, event) => {
        dispatch(orderCancelled(event.returnValues))
    });

    exchange.events.Trade({}, (error, event) => {
        dispatch(orderFilled(event.returnValues));
    })
}