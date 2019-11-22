import {get} from 'lodash';
import {createSelector} from 'reselect';
import {decorateFilledOrders} from './decorators/orders';
import {buildGraphData} from './decorators/priceChart';
import {filledOrdersLoaded, filledOrders} from './orders';

export const priceChartLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded);
export const priceChartSelector = createSelector(
    filledOrders,
    (orders) => {
        //ascending date, earliest to latest
        orders = orders.sort((a,b) => a._timestamp - b._timestamp);
        //decorate
        orders = decorateFilledOrders(orders);
        let lastOrder = orders[orders.length-1];
        let secondLastOrder = orders[orders.length-2];
        let lastPrice = get(lastOrder, 'tokenPrice', 0);
        let secondLastPrice = get(secondLastOrder, 'tokenPrice', 0);

        return ({
            lastPrice,
            lastPriceChange: (lastPrice >= secondLastPrice) ? '+' : '-',
            series: [{
                data: buildGraphData(orders)
            }]
        });
    }
)