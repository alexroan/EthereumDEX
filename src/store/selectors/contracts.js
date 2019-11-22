import {get} from 'lodash';
import {createSelector} from 'reselect';

export const tokenLoaded = state => get(state, 'token.loaded', false);
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl);

export const exchangeLoaded = state => get(state, 'exchange.loaded', false);
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el);

export const exchange = state => get(state, 'exchange.contract', false);
export const exchangeSelector = createSelector(exchange, e => e);

export const contractsLoadedSelector = createSelector(
    tokenLoaded, 
    exchangeLoaded, 
    (tl, el) => (tl && el)
);