import React from "react";
import PropTypes from "prop-types";
import Layer from "./Layer";
import Squish from "./Squish";
import "./NeuralNetwork.css";

export default class NeuralNetwork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "layers": [
                {
                    "activations": [ Math.random(), Math.random() ]
                },
                {
                    "activations": [ Math.random(), Math.random(), Math.random() ],
                    "weights": [ [ Math.random(), Math.random() ], [ Math.random(), Math.random() ], [ Math.random(), Math.random() ] ],
                    "biases": [ Math.random(), Math.random(), Math.random() ]
                },
                {
                    "activations": [ Math.random(), Math.random() ],
                    "weights": [ [ Math.random(), Math.random(), Math.random() ], [ Math.random(), Math.random(), Math.random() ] ],
                    "biases": [ Math.random(), Math.random() ]
                }
            ]
        };
        this.forwardPropagate(this.state.layers);
    }

    forwardPropagate(layers) {
        let mod = false;
        for (let i = 0; i < layers.length; ++i) {
            if (layers[i].weights && layers[i].biases) {
                for (let j = 0; j < layers[i].activations.length; ++j) {
                    let sliced = false;
                    let z = layers[i].biases[j];
                    for (let k = 0; k < layers[i].weights[j].length; ++k) {
                        z += layers[i - 1].activations[k] * layers[i].weights[j][k];
                    }
                    let a = Squish.function(z);
                    if (a !== layers[i].activations[j]) {
                        if (!sliced) {
                            layers[i].activations = layers[i].activations.slice();
                            mod = sliced = true;
                        }
                        layers[i].activations[j] = a;
                    }
                }
            }
        }
        return mod;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let layers = this.state.layers.slice();
        let mod = false;
        if (layers.length > this.props.shape.length) {
            layers.splice(this.props.shape.length);
            mod = true;
        } else while (layers.length < this.props.shape.length) {
            if (layers.length === 0) {
                layers.push({
                    "activations": []
                });
            } else {
                layers.push({
                    "activations": [],
                    "weights": [],
                    "biases": []
                });
            }
            mod = true;
        }
        for (let i = 0; i < layers.length; ++i) {
            if (layers[i].activations.length > this.props.shape[i]) {
                layers[i].activations = layers[i].activations.slice();
                layers[i].activations.splice(this.props.shape[i]);
                if (layers[i].weights) {
                    layers[i].weights = layers[i].weights.slice();
                    layers[i].weights.splice(this.props.shape[i]);
                }
                if (layers[i].biases) {
                    layers[i].biases = layers[i].biases.slice();
                    layers[i].biases.splice(this.props.shape[i]);
                }
                mod = true;
            } else if (layers[i].activations.length < this.props.shape[i]) {
                layers[i].activations = layers[i].activations.slice();
                while (layers[i].activations.length < this.props.shape[i]) {
                    layers[i].activations.push(Math.random());
                }
                if (layers[i].weights) {
                    layers[i].weights = layers[i].weights.slice();
                    while (layers[i].weights.length < this.props.shape[i]) {
                        let weights = [];
                        for (let j = 0; j < layers[i - 1].activations.length; ++j) {
                            weights.push(Math.random());
                        }
                        layers[i].weights.push(weights);
                    }
                }
                if (layers[i].biases) {
                    layers[i].biases = layers[i].biases.slice();
                    while (layers[i].biases.length < this.props.shape[i]) {
                        layers[i].biases.push(Math.random());
                    }
                }
                mod = true;
            }
        }
        if (this.forwardPropagate(layers) || mod) {
            this.setState({
                "layers": layers
            });
        }
    }

    render() {
        return (
            <div className="NeuralNetwork">
                <div className="padding" />
                {this.state.layers.map((layer, idx) => (
                    <Layer key={`layer-${idx}`} activations={layer.activations} weights={layer.weights}
                        biases={layer.biases} />
                ))}
                <div className="padding" />
            </div>
        );
    }
}
NeuralNetwork.propTypes = {
    "shape": PropTypes.arrayOf(PropTypes.number).isRequired
};
