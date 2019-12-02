import React, {Component} from 'react';
import {connect} from 'react-redux';
import {filledOrdersSelector, filledOrdersLoadedSelector} from '../store/selectors/orders';
import Spinner from './Spinner';
import { tokenNameSelector } from '../store/selectors/contracts';

const showFilledOrders = (filledOrders) => {
    return (
        <tbody>
            {filledOrders.map((order) => {
                return (
                    <tr className={`trade-${order._id}`} key={order._id}>
                        <td className="text-muted">{order.formattedTimestamp}</td>
                        <td>{order.tokenAmount}</td>
                        <td className={`text-${order.tokenPriceClass}`}>{order.tokenPrice}</td>
                    </tr>
                )
            })}
        </tbody>
    );
}

class Trades extends Component {

    render() {
        const {tokenName} = this.props;
        return (
            <div className="vertical">
                <div className="card bg-dark text-white">
                    <div className="card-header">
                        Trades
                    </div>
                    <div className="card-body">
                        <table className="table table-dark table-sm small">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>{tokenName}</th>
                                    <th>{tokenName}/Eth</th>
                                </tr>
                            </thead>
                            { this.props.filledOrdersLoaded ? showFilledOrders(this.props.filledOrders) : <Spinner type="table" />}
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        filledOrdersLoaded: filledOrdersLoadedSelector(state),
        filledOrders: filledOrdersSelector(state),
        tokenName: tokenNameSelector(state)
    };
}

export default connect(mapStateToProps)(Trades);