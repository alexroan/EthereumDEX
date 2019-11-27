import React, {Component} from 'react';
import {connect} from 'react-redux';
import { exchangeSelector } from '../store/selectors/contracts';
import { subscribeToEvents } from '../store/interactions/subscriptions';
import { loadAllOrders } from '../store/interactions/orders';
import Trades from './Trades';
import OrderBook from './OrderBook';
import MyTransactions from './MyTransactions';
import PriceChart from './PriceChart';
import Balance from './Balance';
import NewOrder from './NewOrder';

class Content extends Component {

	componentWillMount() {
		this.loadBlockchainData(this.props);
	}

	async loadBlockchainData(props) {
        const {exchange, dispatch} = props;
        await loadAllOrders(dispatch, exchange);
        await subscribeToEvents(dispatch, exchange);
	}

    render() {
        return (
            <div className="content">
                <div className="vertical-split">
                    <Balance />
                    <NewOrder />
                </div>
                <OrderBook />
                <div className="vertical-split">
                    <PriceChart />
                    <MyTransactions />
                </div>
                <Trades />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        exchange: exchangeSelector(state)
    }
}

export default connect(mapStateToProps)(Content);