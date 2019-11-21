import React, {Component} from 'react';
import {connect} from 'react-redux';
import Spinner from './Spinner';
import Chart from 'react-apexcharts';
import {chartOptions} from './PriceChart.config';
import {priceChartLoadedSelector, priceChartSelector} from '../store/selectors';

const priceSymbol = (lastPriceChange) => {
    let output;
    if(lastPriceChange === '+') {
        output = <span className="text-success">&#9650;</span> // Green up tiangle
    } else {
        output = <span className="text-danger">&#9660;</span> // Red down triangle
    }
    return(output);
}

const showPriceChart = (priceChart) => {
    return (
        <div className="price-chart">
            <h4>DAPP/ETH &nbsp; {priceSymbol(priceChart.lastPriceChange)} &nbsp; {priceChart.lastPrice}</h4>
            <Chart options={chartOptions} series={priceChart.series} type="candlestick" width="100%" height="100%" />
        </div>
    );
}

class PriceChart extends Component {
    render() {
        return (
            <div className="card bg-dark text-white">
                <div className="card-header">
                    Graph
                </div>
                <div className="card-body">
                    {(this.props.showChart) ? showPriceChart(this.props.chartData) : <Spinner type="div" />}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        showChart: priceChartLoadedSelector(state),
        chartData: priceChartSelector(state)
    }
}

export default connect(mapStateToProps)(PriceChart);