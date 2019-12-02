import {get} from 'lodash';
import {createSelector} from 'reselect';
import {formatBalance} from '../../helpers';


export const tokenLoaded = state => get(state, 'token.loaded', false);
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl);

const token = state => get(state, 'token.contract');
export const tokenSelector = createSelector(token, t => t);

const tokenName = state => get(state, 'token.name');
export const tokenNameSelector = createSelector(tokenName, tn => tn);

export const exchangeLoaded = state => get(state, 'exchange.loaded', false);
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el);

export const exchange = state => get(state, 'exchange.contract', false);
export const exchangeSelector = createSelector(exchange, e => e);

export const contractsLoadedSelector = createSelector(
    tokenLoaded, 
    exchangeLoaded, 
    (tl, el) => (tl && el)
);

const balancesLoading = state => get(state, 'exchange.balancesLoading', false);
export const balancesLoadingSelector = createSelector(balancesLoading, bl => bl);

const tokenBalance = state => get(state, 'token.balance');
export const tokenBalanceSelector = createSelector(tokenBalance, (balance) => {
    return formatBalance(balance);
});

const exchangeEtherBalance = state => get(state, 'exchange.etherBalance');
export const exchangeEtherBalanceSelector = createSelector(exchangeEtherBalance, (balance) => {
    return formatBalance(balance);
});

const exchangeTokenBalance = state => get(state, 'exchange.tokenBalance');
export const exchangeTokenBalanceSelector = createSelector(exchangeTokenBalance, (balance) => {
    return formatBalance(balance);
});

const etherDepositAmount = state => get(state, 'exchange.etherDepositAmount', 0);
export const etherDepositAmountSelector = createSelector(etherDepositAmount, eda => eda);

const etherWithdrawAmount = state => get(state, 'exchange.etherWithdrawAmount', 0);
export const etherWithdrawAmountSelector = createSelector(etherWithdrawAmount, ewa => ewa);


const tokenDepositAmount = state => get(state, 'exchange.tokenDepositAmount', 0);
export const tokenDepositAmountSelector = createSelector(tokenDepositAmount, tda => tda);

const tokenWithdrawAmount = state => get(state, 'exchange.tokenWithdrawAmount', 0);
export const tokenWithdrawAmountSelector = createSelector(tokenWithdrawAmount, twa => twa);