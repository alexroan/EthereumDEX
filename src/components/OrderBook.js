import React, {Component} from 'react';
import {connect} from 'react-redux';
import { orderBookLoadedSelector, orderBookSelector } from '../store/selectors/orders';
import Spinner from './Spinner';

const renderOrder = (order) => {
    return (
        <tr key={order._id}>
            <td>{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            <td>{order.etherAmount}</td>
        </tr>
    )
}

const showOrderBook = (props) => {
    //fetch key from props using ES6
    const {orderBook} = props;
    console.log(orderBook);
    return (
        <tbody>
            {orderBook.sellOrders.map((order) => renderOrder(order, props))}
            <tr>
                <th>DAPP</th>
                <th>DAPP/ETH</th>
                <th>ETH</th>
            </tr>
            {orderBook.buyOrders.map((order) => renderOrder(order, props))}
        </tbody>
    );
}

class OrderBook extends Component {
    render() {
        return (
            <div className="vertical">
                <div className="card bg-dark text-white">
                    <div className="card-header">
                        Order Book
                    </div>
                    <div className="card-body order-book">
                        <table className="table table-dark table-sm small">
                            {this.props.showOrderBook ? showOrderBook(this.props) : <Spinner type="table"/>}
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        orderBook: orderBookSelector(state),
        showOrderBook: orderBookLoadedSelector(state)
    }
}

export default connect(mapStateToProps)(OrderBook);