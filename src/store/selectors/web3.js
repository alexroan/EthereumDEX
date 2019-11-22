import {get} from 'lodash';
import {createSelector} from 'reselect';

export const account = state => get(state, 'web3.account');
export const accountSelector = createSelector(account, a => a);