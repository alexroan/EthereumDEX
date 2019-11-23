import {get} from 'lodash';
import {createSelector} from 'reselect';
import {formatBalance} from '../../helpers';

const web3 = state => get(state, 'web3.connection');
export const web3Selector = createSelector(web3, w => w);

export const account = state => get(state, 'web3.account');
export const accountSelector = createSelector(account, a => a);

const etherBalance = state => get(state, 'web3.balance');
export const etherBalanceSelector = createSelector(etherBalance, (balance) => {
    return formatBalance(balance);
});