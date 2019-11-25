import React, {Component} from 'react';
import {connect} from 'react-redux';

const tableRow = (tokenName, walletAmount, exchangeAmount) => {
    return (
        <tr>
            <th>{tokenName}</th>
            <th>{walletAmount}</th>
            <th>{exchangeAmount}</th>
        </tr>
    )
}

const tableHead = () => {
    return (
        <thead>
            <tr>
                <th>Token</th>
                <th>Wallet</th>
                <th>Exchange</th>
            </tr>
        </thead>
    );
}

class ExchangeTable extends Component {
    render() {
        const {hasHead, tokenName, walletAmount, exchangeAmount} = this.props;
        return (
            <table className="table table-dark table-sm small">
                {(hasHead) ? tableHead() : null}
                <tbody>
                    {tableRow(tokenName, walletAmount, exchangeAmount)}
                </tbody>
            </table>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps)(ExchangeTable);