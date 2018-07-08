import React from "react";
import PropTypes from "prop-types";
import "./Synapse.css";

export default class Synapse extends React.Component {
    render() {
        let input = (this.props.inputNeuronIdx - (this.props.inputCount - 1) / 2) * 180;
        let output = (this.props.outputNeuronIdx - (this.props.outputCount - 1) / 2) * 180;
        let colorCode = Math.floor(256 * this.props.weight).toString(16).padStart(2, "0");
        return (
            <div className="Synapse" style={{
                "marginTop": `${input}px`,
                "transform": `rotate(${Math.atan2(output - input, 120)}rad)`,
                "width": `${Math.sqrt(Math.pow(output - input, 2) + 14400)}px`,
                "backgroundColor": `#${colorCode}${colorCode}${colorCode}`
            }}>
            </div>
        );
    }
}
Synapse.propTypes = {
    "inputNeuronIdx": PropTypes.number.isRequired,
    "inputCount": PropTypes.number.isRequired,
    "outputNeuronIdx": PropTypes.number.isRequired,
    "outputCount": PropTypes.number.isRequired,
    "weight": PropTypes.number.isRequired
};
