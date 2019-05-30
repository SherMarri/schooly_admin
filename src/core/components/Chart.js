import React from 'react';
import CanvasJSReact from '../../assets/js/canvasjs/canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class Chart extends React.Component {
    render() {
        const { options } = this.props;

        return (
            <CanvasJSChart options={options}
            /* onRef = {ref => this.chart = ref} */
            />
        );
    }
}

export default Chart;