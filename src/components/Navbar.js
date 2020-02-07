import React, {Component} from 'react';
import {Dropdown} from 'react-bootstrap';
import {connect} from 'react-redux';
import {accountSelector, web3Selector} from '../store/selectors/web3';
import {tokenNameSelector, pairsTokensSelector, exchangeSelector} from '../store/selectors/contracts';
import { loadToken, loadBalances } from '../store/interactions/contracts';
import { loadAllOrders } from '../store/interactions/orders';
import { subscribeToEvents } from '../store/interactions/subscriptions';

const selectPairToken = async (tokenAddress, web3, exchange, account, dispatch) => {
    const token = await loadToken(web3, tokenAddress, dispatch);
    if (!token) {
        alert('Token not loaded, please load a network with token');
    }
    await loadAllOrders(dispatch, exchange, token);
    await subscribeToEvents(dispatch, exchange);
    await loadBalances(web3, exchange, token, account, dispatch);
}

const renderMenuItem = (token, props) => {
    const {web3, exchange, account, dispatch} = props;
    return (
        <Dropdown.Item key={token[0]} onClick={(e) => selectPairToken(token[0], web3, exchange, account, dispatch)} >{token[1]}/ETH</Dropdown.Item>
    )
}

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <a className="navbar-brand" href="/#">Ethereum Dex - (Kovan Network)</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                    <Dropdown>
                        <Dropdown.Toggle size="sm" id="dropdown-basic">
                            {this.props.tokenName}/ETH
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {this.props.pairsTokens.map((token) => renderMenuItem(token, this.props))}
                        </Dropdown.Menu>
                    </Dropdown>
                    </li>
                    <li className="nav-item">
                        <a 
                            className="nav-link small"
                            href={'https://etherscan.io/address/' + this.props.account}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {this.props.account}
                        </a>
                    </li>
                </ul>
            </nav>
        );
    }
}

function mapStateToProps(state){
    return {
        account: accountSelector(state),
        tokenName: tokenNameSelector(state),
        pairsTokens: pairsTokensSelector(state),
        exchange: exchangeSelector(state),
        web3: web3Selector(state)
    }
}

export default connect(mapStateToProps)(Navbar);