import { web3Loaded, web3AccountLoaded } from '../actions';
import Web3 from 'web3';

const ethereum = Web3.givenProvider

export const loadWeb3 = (dispatch) => {
    const web3 = new Web3(ethereum || 'http://localhost:7545');
    dispatch(web3Loaded(web3));
    return web3;
}

export const loadAccount = async (web3, dispatch) => {
    await ethereum.enable()
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    dispatch(web3AccountLoaded(account));
    return account;
}