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