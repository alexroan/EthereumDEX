import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Tabs, Tab} from 'react-bootstrap';
import {buyOrderSelector, sellOrderSelector} from '../store/selectors/orders';
import {web3Selector, accountSelector} from '../store/selectors/web3';
import {tokenSelector, exchangeSelector} from '../store/selectors/contracts';
import {makeBuyOrder, makeSellOrder} from '../store/interactions/orders';
import OrderForm from './OrderForm';
import {buyOrderAmountChanged, buyOrderPriceChanged, sellOrderAmountChanged, sellOrderPriceChanged} from '../store/actions';
import Spinner from './Spinner';
import {removeTrailingZeros} from '../helpers';


const showForm = (props) => {
    const {dispatch, web3, exchange, token, account, buyOrder, sellOrder, showBuyTotal, showSellTotal} = props;
    
    const buyOrderOnSubmit = (e) => {
        e.preventDefault();
        makeBuyOrder(dispatch, exchange, token, web3, buyOrder, account);
    }
    const buyAmountChanged = (e) => dispatch(buyOrderAmountChanged(e.target.value));
    const buyPriceChanged = (e) => dispatch(buyOrderPriceChanged(e.target.value));

    const sellOrderOnSubmit = (e) => {
        e.preventDefault();
        makeSellOrder(dispatch, exchange, token, web3, sellOrder, account);
    }
    const sellAmountChanged = (e) => dispatch(sellOrderAmountChanged(e.target.value));
    const sellPriceChanged = (e) => dispatch(sellOrderPriceChanged(e.target.value));

    return (
        <Tabs defaultActiveKey="buy" className="bg-dark text-white">
            <Tab className="bg-dark" title="Buy" eventKey="buy">
                <OrderForm
                    onSubmit={buyOrderOnSubmit}
                    amountOnChange={buyAmountChanged}
                    priceOnChange={buyPriceChanged}
                    buttonText={"Create Buy Order"}
                    buyOrSell={"Buy"}
                />
                { showBuyTotal ? <small>Total: {removeTrailingZeros((buyOrder.amount * buyOrder.price).toFixed(18))} ETH</small> : null }
            </Tab>
            <Tab className="bg-dark" title="Sell" eventKey="sell">
                <OrderForm
                    onSubmit={sellOrderOnSubmit}
                    amountOnChange={sellAmountChanged}
                    priceOnChange={sellPriceChanged}
                    buttonText={"Create Sell Order"}
                    buyOrSell={"Sell"}
                />
                { showSellTotal ? <small>Total: {removeTrailingZeros((sellOrder.amount * sellOrder.price).toFixed(18))} ETH</small> : null }
            </Tab>
        </Tabs>
    )
}

class NewOrder extends Component {

    render() {
        return (
            <div className="card bg-dark text-white">
                <div className="card-header">
                    New Order
                </div>
                <div className="card-body">
                    {showForm? showForm(this.props) : <Spinner type="div" />}
                </div>
            </div>
        );
    }

}

function mapStateToProps(state){
    const buyOrder = buyOrderSelector(state);
    const sellOrder = sellOrderSelector(state);

    return {
        account: accountSelector(state),
        exchange: exchangeSelector(state),
        web3: web3Selector(state),
        token: tokenSelector(state),
        buyOrder,
        sellOrder,
        showForm: !buyOrder.making && !sellOrder.making,
        showBuyTotal: buyOrder.amount && buyOrder.price,
        showSellTotal: sellOrder.amount && sellOrder.price
    }
}

export default connect(mapStateToProps)(NewOrder);