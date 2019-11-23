import React, {Component} from 'react';
import {connect} from 'react-redux';
import Spinner from './Spinner';
import { exchangeSelector, tokenSelector, tokenBalanceSelector, exchangeEtherBalanceSelector, exchangeTokenBalanceSelector, balancesLoadingSelector } from '../store/selectors/contracts';
import { web3Selector, accountSelector, etherBalanceSelector } from '../store/selectors/web3';
import { loadBalances } from '../store/interactions/contracts';


class Balance extends Component {

    componentWillMount() {
        this.loadBlockchainData();
    }

    async loadBlockchainData() {
        console.log(this.props);
        const {dispatch, exchange, token, account, web3} = this.props;
        await loadBalances(web3, exchange, token, account, dispatch);
    }

    render() {
        return (
            <div className="card bg-dark text-white">
                <div className="card-header">
                    Balance
                </div>
                <div className="card-body">
                    
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {

    console.log({
        account: accountSelector(state),
        exchange: exchangeSelector(state),
        web3: web3Selector(state),
        token: tokenSelector(state),
        etherBalance: etherBalanceSelector(state),
        tokenBalance: tokenBalanceSelector(state),
        exchangeEtherBalance: exchangeEtherBalanceSelector(state),
        exchangeTokenBalance: exchangeTokenBalanceSelector(state),
        balancesLoading: balancesLoadingSelector(state)
    })
    return {
        account: accountSelector(state),
        exchange: exchangeSelector(state),
        web3: web3Selector(state),
        token: tokenSelector(state),
        etherBalance: etherBalanceSelector(state),
        tokenBalance: tokenBalanceSelector(state),
        exchangeEtherBalance: exchangeEtherBalanceSelector(state),
        exchangeTokenBalance: exchangeTokenBalanceSelector(state),
        balancesLoading: balancesLoadingSelector(state)
    }
}

export default connect(mapStateToProps)(Balance);