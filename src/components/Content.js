import React, {Component} from 'react';
import {connect} from 'react-redux';

class Content extends Component {

    render() {
        return (
            <div className="content">
                <div className="vertical-split">
                    <div className="card bg-dark text-white">
                        <div className="card-header">
                            Card Title
                        </div>
                        <div className="card-body">
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="/#" className="card-link">Card link</a>
                        </div>
                    </div>
                    <div className="card bg-dark text-white">
                        <div className="card-header">
                            Card Title
                        </div>
                        <div className="card-body">
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="/#" className="card-link">Card link</a>
                        </div>
                    </div>
                </div>
                <div className="vertical">
                    <div className="card bg-dark text-white">
                        <div className="card-header">
                            Card Title
                        </div>
                        <div className="card-body">
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="/#" className="card-link">Card link</a>
                        </div>
                    </div>
                </div>
                <div className="vertical-split">
                    <div className="card bg-dark text-white">
                        <div className="card-header">
                            Card Title
                        </div>
                        <div className="card-body">
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="/#" className="card-link">Card link</a>
                        </div>
                    </div>
                    <div className="card bg-dark text-white">
                        <div className="card-header">
                            Card Title
                        </div>
                        <div className="card-body">
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="/#" className="card-link">Card link</a>
                        </div>
                    </div>
                </div>
                <div className="vertical">
                    <div className="card bg-dark text-white">
                        <div className="card-header">
                            Card Title
                        </div>
                        <div className="card-body">
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="/#" className="card-link">Card link</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        
    }
}

export default connect(mapStateToProps)(Content);