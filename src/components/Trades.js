import React, {Component} from 'react';
import {connect} from 'react-redux';
import {tradesSelector, tradesLoadedSelector} from '../store/selectors';
import Spinner from './Spinner';

const showTrades = (trades) => {
    return (
        <tbody>
            {trades.map((trade) => {
                return (
                    <tr className={`trade-${trade._id}`} key={trade._id}>
                        <td className="text-muted">{trade.formattedTimestamp}</td>
                        <td>{trade.tokenAmount}</td>
                        <td className={`text-${trade.tokenPriceClass}`}>{trade.tokenPrice}</td>
                    </tr>
                )
            })}
        </tbody>
    );
}

class Trades extends Component {
    componentWillMount() {

    }

    render() {
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
                                    <th>DApp</th>
                                    <th>DApp/Eth</th>
                                </tr>
                            </thead>
                            { this.props.tradesLoaded ? showTrades(this.props.trades) : <Spinner type="table" />}
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        tradesLoaded: tradesLoadedSelector(state),
        trades: tradesSelector(state)
    };
}

export default connect(mapStateToProps)(Trades);