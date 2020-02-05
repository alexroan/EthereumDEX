import {tokenLoaded, exchangeLoaded, tokenBalanceLoaded, exchangeEtherBalanceLoaded, exchangeTokenBalanceLoaded, balancesLoaded, balancesLoading} from '../actions';
import MyERC20 from '../../abis/MyERC20.json';
import Token from '../../abis/Token.json';
import Exchange from '../../abis/Exchange.json';
import {ETHER_ADDRESS} from '../../helpers.js';
import {etherBalanceLoaded} from '../actions';

export const loadToken = async (web3, networkId, dispatch) => {
    try{
        const token = web3.eth.Contract(Token.abi, Token.networks[networkId].address);
        const name = await token.methods.symbol().call();
        dispatch(tokenLoaded(token, name));
        return token;
    }
    catch (err){
        window.alert("Contract not deployed to current network");
    }
    return null;
}

export const loadExchange = async (web3, networkId, dispatch) => {
    try{
        const exchange = web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address);
        dispatch(exchangeLoaded(exchange));
        return exchange;
    }
    catch (err){
        window.alert("Contract not deployed to current network");
    }
    return null;
}

export const loadEtherBalances = async (web3, exchange, account, dispatch) => {
    dispatch(balancesLoading());

    //ether balance
    const etherBalance = await web3.eth.getBalance(account);
    dispatch(etherBalanceLoaded(etherBalance));

    //balance of account on the smart contract
    const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
    dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance));

    dispatch(balancesLoaded());
}

export const loadTokenBalances = async (web3, exchange, token, account, dispatch) => {
    dispatch(balancesLoading());

    //token balance
    const tokenBalance = await token.methods.balanceOf(account).call();
    dispatch(tokenBalanceLoaded(tokenBalance));

    //token balance of account on the smart contract
    const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call();
    dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance));

    dispatch(balancesLoaded());
}

export const loadBalances = async (web3, exchange, token, account, dispatch) => {
    loadEtherBalances(web3, exchange, account, dispatch);
    loadTokenBalances(web3, exchange, token, account, dispatch);
}

export const depositEther = async (web3, exchange, account, etherDepositAmount, dispatch) => {
    const amount = web3.utils.toWei(etherDepositAmount, 'ether');
    exchange.methods.depositEther.send({from: account, value: amount})
        .on('transactionHash', (hash) => {
            dispatch(balancesLoading());
        })
        .on('receipt', (hash) => {
            console.log('receipt');
            loadEtherBalances(web3, exchange, account, dispatch);
        })
        .on('error', (err) => {
            console.log(err);
            window.alert("error depositing");
        });
}

export const withdrawEther = async (web3, exchange, account, etherWithdrawAmount, dispatch) => {
    const amount = web3.utils.toWei(etherWithdrawAmount, 'ether');
    exchange.methods.withdrawEther(amount).send({from: account})
        .on('transactionHash', (hash) => {
            dispatch(balancesLoading());
        })
        .on('receipt', (hash) => {
            console.log('receipt');
            loadEtherBalances(web3, exchange, account, dispatch);
        })
        .on('error', (err) => {
            console.log(err);
            window.alert("error withdrawing");
        });
}

export const depositToken = async (web3, exchange, token, account, etherWithdrawAmount, dispatch) => {
    const amount = web3.utils.toWei(etherWithdrawAmount, 'ether');
    console.log('starting');
    token.methods.approve(exchange.options.address, amount).send({from: account})
        .on('transactionHash', (hash) => {
            console.log('approved transaction');
            exchange.methods.depositToken(token.options.address, amount).send({from: account})
                .on('transactionHash', (hash) => {
                    console.log('transaction hash');
                    dispatch(balancesLoading());
                })
                .on('receipt', (hash) => {
                    console.log('receipt');
                    loadTokenBalances(web3, exchange, token, account, dispatch);
                })
                .on('error', (err) => {
                    console.log('erroring deposit');
                    console.log(err);
                    window.alert("error depositing token");
                });
        });
}

export const withdrawToken = async (web3, exchange, token, account, tokenWithdrawAmount, dispatch) => {
    const amount = web3.utils.toWei(tokenWithdrawAmount, 'ether');
    exchange.methods.withdrawToken(token.options.address, amount).send({from: account})
        .on('transactionHash', (hash) => {
            dispatch(balancesLoading());
        })
        .on('receipt', (hash) => {
            console.log('receipt');
            loadTokenBalances(web3, exchange, token, account, dispatch);
        })
        .on('error', (err) => {
            console.log(err);
            window.alert("error withdrawing");
        });
}