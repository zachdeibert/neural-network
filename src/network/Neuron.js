import React from "react";
import PropTypes from "prop-types";
import "./Neuron.css";

export default class Neuron extends React.Component {
    render() {
        let colorCode = Math.floor(256 * this.props.activation).toString(16).padStart(2, "0");
        return (
            <div className="Neuron" style={{
                "backgroundColor": `#${colorCode}${colorCode}${colorCode}`
            }}>
            </div>
        );
    }
}
Neuron.propTypes = {
    "activation": PropTypes.number.isRequired,
    "bias": PropTypes.number
};
