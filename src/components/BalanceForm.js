import React, {Component} from 'react';
import {connect} from 'react-redux';

class BalanceForm extends Component {
    render(){
        const {onSubmit, placeHolder, onChange, buttonText} = this.props;
        return (
            <form className="row" onSubmit={onSubmit}>
                <div className="col-12 col-sm pr-sm-2">
                    <input type="number" 
                        placeholder={placeHolder} 
                        onChange={onChange}
                        className="form-control form-control-sm bg-dark text-white"
                        required />
                </div>
                <div className="col-12 col-sm-auto pl-sm-0">
                    <button type="submit" className="btn btn-primary btn-block btn-sm">{buttonText}</button>
                </div>
            </form>
        );
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps)(BalanceForm);