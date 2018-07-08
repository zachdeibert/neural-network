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
            ],
            "downType": null,
            "downIdx": null
        };
        this.forwardPropagate(this.state.layers);
        this.handleInputMouseDown = this.handleInputMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
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

    updateDragValue(diff) {
        let layers = this.state.layers.slice();
        switch (this.state.downType) {
            case "input":
                layers[0].activations = layers[0].activations.slice();
                layers[0].activations[this.state.downIdx] += diff;
                if (layers[0].activations[this.state.downIdx] > 1) {
                    layers[0].activations[this.state.downIdx] = 1;
                } else if (layers[0].activations[this.state.downIdx] < 0) {
                    layers[0].activations[this.state.downIdx] = 0;
                }
                break;
            case "bias":
                layers[this.state.downIdx[0]].biases = layers[this.state.downIdx[0]].biases.slice();
                layers[this.state.downIdx[0]].biases[this.state.downIdx[1]] = diff;
                break;
            case "synapse":
                let weights = layers[this.state.downIdx[0]].weights = layers[this.state.downIdx[0]].weights.slice();
                weights = weights[this.state.downIdx[1]] = weights[this.state.downIdx[1]].slice();
                weights[this.state.downIdx[2]] = diff;
                break;
            default:
                return;
        }
        this.setState({
            "layers": layers
        });
    }

    handleInputMouseDown(idx, ev) {
        this.setState({
            "downType": "input",
            "downIdx": idx
        });
    }

    handleBiasMouseDown(layerIdx, neuronIdx, ev) {
        this.setState({
            "downType": "bias",
            "downIdx": [ layerIdx, neuronIdx ]
        });
    }

    handleSynapseMouseDown(layerIdx, neuronIdx1, neuronIdx2, ev) {
        this.setState({
            "downType": "synapse",
            "downIdx": [ layerIdx, neuronIdx1, neuronIdx2 ]
        });
    }

    handleMouseUp(ev) {
        this.setState({
            "downType": null,
            "downIdx": null
        });
    }

    handleMouseMove(ev) {
        if (this.state.downType) {
            this.updateDragValue(ev.movementY / 100);
        }
    }

    render() {
        return (
            <div className="NeuralNetwork" onMouseUp={this.handleMouseUp} onMouseMove={this.handleMouseMove}>
                <div className="padding" />
                {this.state.layers.map((layer, idx) => (
                    <Layer key={`layer-${idx}`} activations={layer.activations} weights={layer.weights}
                        biases={layer.biases}
                        onNeuronMouseDown={idx === 0 ? this.handleInputMouseDown : this.handleBiasMouseDown.bind(this, idx)}
                        onSynapseMouseDown={this.handleSynapseMouseDown.bind(this, idx)} />
                ))}
                <div className="padding" />
            </div>
        );
    }
}
NeuralNetwork.propTypes = {
    "shape": PropTypes.arrayOf(PropTypes.number).isRequired
};
