import React, {Component} from 'react';
import {connect} from 'react-redux';
import './App.css';
import { loadWeb3, loadAccount, loadToken, loadExchange} from '../store/intractions';
import Navbar from './Navbar';
import Content from './Content';
import { contractsLoadedSelector } from '../store/selectors';


class App extends Component {

	componentWillMount() {
		//dispatch auto-included in props with redux in react
		this.loadBlockchainData(this.props.dispatch);
	}

	async loadBlockchainData(dispatch) {
		const web3 = loadWeb3(dispatch)
		const networkId = await web3.eth.net.getId();
		const account = loadAccount(web3, dispatch);
		const token = loadToken(web3, networkId, dispatch);
		if (!token) {
			alert('Token not loaded, please load a network with token');
		}
		const exchange = loadExchange(web3, networkId, dispatch);
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
