import React from "react";
import PropTypes from "prop-types";
import Neuron from "./Neuron";
import Synapse from "./Synapse";
import "./Layer.css";

export default class Layer extends React.Component {
    render() {
        return (
            <div className="Layer">
                {this.props.weights && (
                    <div className="synapses">
                        {this.props.weights.map((arr, idx1) => arr.map((weight, idx2) => (
                            <Synapse key={`synapse-${idx1}-${idx2}`} inputNeuronIdx={idx2} inputCount={arr.length}
                                outputNeuronIdx={idx1} outputCount={this.props.weights.length} weight={weight} />
                        )))}
                    </div>
                )}
                <div className="neurons">
                    <div className="padding" />
                    {this.props.activations.map((activation, idx) => (
                        <Neuron key={`neuron-${idx}`} activation={activation} bias={this.props.biases && this.props.biases[idx]} />
                    ))}
                    <div className="padding" />
                </div>
            </div>
        );
    }
}
Layer.propTypes = {
    "activations": PropTypes.arrayOf(PropTypes.number).isRequired,
    "weights": PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    "biases": PropTypes.arrayOf(PropTypes.number)
};
