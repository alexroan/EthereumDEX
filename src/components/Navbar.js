import React, {Component} from 'react';
import {Dropdown} from 'react-bootstrap';
import {connect} from 'react-redux';
import {accountSelector} from '../store/selectors/web3';
import {tokenNameSelector, pairsTokensSelector} from '../store/selectors/contracts';

const renderMenuItem = (token) => {
    console.log(token);
    return (
        <Dropdown.Item key={token[0]} href="#">{token[1]}/ETH</Dropdown.Item>
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
                            {this.props.pairsTokens.map((token) => renderMenuItem(token))}
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
        pairsTokens: pairsTokensSelector(state)
    }
}

export default connect(mapStateToProps)(Navbar);