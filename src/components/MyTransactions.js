import React, {Component} from 'react';
import {connect} from 'react-redux';
import Spinner from './Spinner';
import {Tabs, Tab} from 'react-bootstrap';
import {myFilledOrdersSelector,
    myFilledOrdersLoadedSelector,
    myOpenOrdersLoadedSelector,
    myOpenOrdersSelector,
    orderCancellingSelector
} from '../store/selectors/orders';
import {exchangeSelector} from '../store/selectors/contracts';
import {accountSelector} from '../store/selectors/web3';
import {cancelOrder} from '../store/interactions/orders';

const showMyFilledOrders = (myFilledOrders) => {
    return (
        <tbody>
            {myFilledOrders.map((order) => {
                return (
                    <tr key={`filled-${order._id}`}>
                        <td className="text-muted">{order.formattedTimestamp}</td>
                        <td className={`text-${order.orderTypeClass}`}>{order.orderSign}{order.tokenAmount}</td>
                        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                    </tr>
                )
            })}
        </tbody>
    );
}

const showMyOpenOrders = (props) => {
    const {myOpenOrders, dispatch, exchange, account} = props
    return (
        <tbody>
            {myOpenOrders.map((order) => {
                return (
                    <tr key={`open-${order._id}`}>
                        <td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
                        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                        <td 
                            className="text-muted cancel-order"
                            onClick={(e) => {
                                cancelOrder(dispatch, exchange, order, account);
                            }}
                        >x</td>
                    </tr>
                )
            })}
        </tbody>
    );
}

class MyTransactions extends Component {
    render() {
        return (
            <div className="card bg-dark text-white">
                <div className="card-header">
                    My Transactions
                </div>
                <div className="card-body">
                    <Tabs defaultActiveKey="trades" className="bg-dark text-white">
                        <Tab eventKey="trades" title="Trades" className="bg-dark">
                            <table className="table table-dark table-sm small">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>DAPP</th>
                                        <th>DAPP/ETH</th>
                                    </tr>
                                </thead>
                                {this.props.showMyFilledOrders ? showMyFilledOrders(this.props.myFilledOrders) : <Spinner type="table" />}
                            </table>
                        </Tab>
                        <Tab eventKey="orders" title="Orders" className="bg-dark">
                            <table className="table table-dark table-sm small">
                                <thead>
                                    <tr>
                                        <th>Amount</th>
                                        <th>DAPP/ETH</th>
                                        <th>Cancel</th>
                                    </tr>
                                </thead>
                                {this.props.showMyOpenOrders ? showMyOpenOrders(this.props) : <Spinner type="table" />}
                            </table>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const openOrdersLoaded = myOpenOrdersLoadedSelector(state);
    const orderCancelling = orderCancellingSelector(state);

    return {
        myFilledOrders: myFilledOrdersSelector(state),
        showMyFilledOrders: myFilledOrdersLoadedSelector(state),
        myOpenOrders: myOpenOrdersSelector(state),
        showMyOpenOrders: openOrdersLoaded && !orderCancelling,
        exchange: exchangeSelector(state),
        account: accountSelector(state)
    };
}

export default connect(mapStateToProps)(MyTransactions);