import React, {Component} from 'react';
import {connect} from 'react-redux';

class OrderForm extends Component {
    render(){
        const {onSubmit, amountOnChange, priceOnChange, buttonText, buyOrSell} = this.props;
        return (
            <form onSubmit={onSubmit}>
                <div className="form-group small">
                    <label>{`${buyOrSell} Amount (DApp)`}</label>
                    <div className="input-group">
                        <input type="number"
                            step="any"
                            min="0"
                            placeholder="amount"
                            onChange={amountOnChange}
                            className="form-control form-control-sm bg-dark text-white"
                            required />
                    </div>
                </div>
                <div className="form-group small">
                    <label>{`${buyOrSell} Price`}</label>
                    <div className="input-group">
                        <input type="text" 
                            step="any"
                            min="0"
                            placeholder="price"
                            onChange={priceOnChange}
                            className="form-control form-control-sm bg-dark text-white"
                            required />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm btn-block">{buttonText}</button>
            </form>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(OrderForm);