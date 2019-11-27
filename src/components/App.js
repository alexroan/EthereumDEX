import React, {Component} from 'react';
import './App.css';
import Navbar from './Navbar';
import Content from './Content';
import {connect} from 'react-redux';
import {loadWeb3, loadAccount} from '../store/interactions/web3';
import {loadToken, loadExchange} from '../store/interactions/contracts';
import { contractsLoadedSelector } from '../store/selectors/contracts';


class App extends Component {

	componentWillMount() {
		//dispatch auto-included in props with redux in react
		this.loadBlockchainData(this.props.dispatch);
	}

	async loadBlockchainData(dispatch) {
		const web3 = loadWeb3(dispatch);
		if (!web3) {
			alert('Web3 unable to load');
			return;
		}
		const networkId = await web3.eth.net.getId();
		await loadAccount(dispatch);
		const token = await loadToken(web3, networkId, dispatch);
		if (!token) {
			alert('Token not loaded, please load a network with token');
		}
		const exchange = await loadExchange(web3, networkId, dispatch);
		if (!exchange) {
			alert('Exchange not loaded, please load a network with exchange');
		}
	}
	
	render() {
		return (
			<div>
				<Navbar />
				{this.props.contractsLoaded ? <Content /> : <div className="content"></div>}
			</div>
		);
	}
}

// Makes state vars accessible in props
function mapStateToProps(state){
	return {
		contractsLoaded: contractsLoadedSelector(state)
	}
}

export default connect(mapStateToProps)(App);
