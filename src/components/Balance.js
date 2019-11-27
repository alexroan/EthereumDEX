import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Tabs, Tab} from 'react-bootstrap';
import Spinner from './Spinner';
import { exchangeSelector, 
    tokenSelector, 
    tokenBalanceSelector, 
    exchangeEtherBalanceSelector, 
    exchangeTokenBalanceSelector, 
    balancesLoadingSelector, 
    etherDepositAmountSelector,
    etherWithdrawAmountSelector,
    tokenDepositAmountSelector,
    tokenWithdrawAmountSelector
} from '../store/selectors/contracts';
import { web3Selector, accountSelector, etherBalanceSelector } from '../store/selectors/web3';
import { loadBalances, depositEther, withdrawEther, depositToken, withdrawToken} from '../store/interactions/contracts';
import { etherDepositAmountChanged, etherWithdrawAmountChanged, tokenDepositAmountChanged, tokenWithdrawAmountChanged } from '../store/actions';
import BalanceForm from './BalanceForm';
import BalanceTable from './BalanceTable';


const showForm = (props) => {
    const {dispatch, etherBalance, tokenBalance, exchangeEtherBalance, exchangeTokenBalance, 
        etherDepositAmount, etherWithdrawAmount, tokenDepositAmount, tokenWithdrawAmount,
        web3, exchange, token, account
    } = props;

    const depositEtherSubmit = (e) => {
        e.preventDefault();
        depositEther(web3, exchange, account, etherDepositAmount, dispatch);
    }
    const depositEtherChange = (e) => dispatch(etherDepositAmountChanged(e.target.value));

    const depositTokenSubmit = (e) => {
        e.preventDefault();
        depositToken(web3, exchange, token, account, tokenDepositAmount, dispatch);
    }
    const depositTokenChange = (e) => dispatch(tokenDepositAmountChanged(e.target.value));

    const withdrawEtherSubmit = (e) => {
        e.preventDefault();
        withdrawEther(web3, exchange, account, etherWithdrawAmount, dispatch);
    }
    const withdrawEtherChange = (e) => dispatch(etherWithdrawAmountChanged(e.target.value));

    const withdrawTokenSubmit = (e) => {
        e.preventDefault();
        withdrawToken(web3, exchange, token, account, tokenWithdrawAmount, dispatch);
    }
    const withdrawTokenChange = (e) => dispatch(tokenWithdrawAmountChanged(e.target.value));

    return (
        <Tabs defaultActiveKey={"deposit"} className={"bg-dark text-white"}>
            <Tab eventKey={"deposit"} title={"Deposit"} className={"bg-dark"}>
                <BalanceTable hasHead={true} tokenName={"ETH"} walletAmount={etherBalance} exchangeAmount={exchangeEtherBalance} />
                <BalanceForm 
                    onSubmit={depositEtherSubmit} 
                    placeHolder={"ETH Amount"}
                    onChange={depositEtherChange}
                    buttonText={"Deposit"}
                />
                <BalanceTable hasHead={false} tokenName={"DAPP"} walletAmount={tokenBalance} exchangeAmount={exchangeTokenBalance} />
                <BalanceForm 
                    onSubmit={depositTokenSubmit} 
                    placeHolder={"Token Amount"} 
                    onChange={depositTokenChange}
                    buttonText={"Deposit"}  
                />
            </Tab>
            <Tab eventKey={"withdraw"} title={"Withdraw"} className={"bg-dark"}>
                <BalanceTable hasHead={true} tokenName={"ETH"} walletAmount={etherBalance} exchangeAmount={exchangeEtherBalance} />
                <BalanceForm 
                    onSubmit={withdrawEtherSubmit} 
                    placeHolder={"ETH Amount"} 
                    onChange={withdrawEtherChange}
                    buttonText={"Withdraw"}    
                />
                <BalanceTable hasHead={false} tokenName={"DAPP"} walletAmount={tokenBalance} exchangeAmount={exchangeTokenBalance} />
                <BalanceForm 
                    onSubmit={withdrawTokenSubmit} 
                    placeHolder={"Token Amount"} 
                    onChange={withdrawTokenChange}
                    buttonText={"Withdraw"}    
                />
            </Tab>
        </Tabs>
    )
}

class Balance extends Component {

    componentWillMount() {
        this.loadBlockchainData();
    }

    async loadBlockchainData() {
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
                    {this.props.showForm ? showForm(this.props) : <Spinner />}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const balancesLoading = balancesLoadingSelector(state)
    return {
        account: accountSelector(state),
        exchange: exchangeSelector(state),
        web3: web3Selector(state),
        token: tokenSelector(state),
        etherBalance: etherBalanceSelector(state),
        tokenBalance: tokenBalanceSelector(state),
        exchangeEtherBalance: exchangeEtherBalanceSelector(state),
        exchangeTokenBalance: exchangeTokenBalanceSelector(state),
        balancesLoading,
        showForm: !balancesLoading,
        etherDepositAmount: etherDepositAmountSelector(state),
        etherWithdrawAmount: etherWithdrawAmountSelector(state),
        tokenDepositAmount: tokenDepositAmountSelector(state),
        tokenWithdrawAmount: tokenWithdrawAmountSelector(state)
    }
}

export default connect(mapStateToProps)(Balance);