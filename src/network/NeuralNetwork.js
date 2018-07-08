import React from "react";
import PropTypes from "prop-types";
import Layer from "./Layer";
import Squish from "./Squish";
import "./NeuralNetwork.css";

const propagation_threshold = 0.0001;

function random_gaussian() {
    let u, v;
    for (u = 0; u === 0; u = Math.random());
    for (v = 0; v === 0; v = Math.random());
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export default class NeuralNetwork extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "layers": [
                {
                    "activations": [ Math.random(), Math.random() ]
                },
                {
                    "activations": [ 0, 0, 0 ],
                    "weights": [ [ random_gaussian(), random_gaussian() ], [ random_gaussian(), random_gaussian() ], [ random_gaussian(), random_gaussian() ] ],
                    "weightActivations": [ [ 0, 0 ], [ 0, 0 ], [ 0, 0 ] ],
                    "biases": [ random_gaussian(), random_gaussian(), random_gaussian() ]
                },
                {
                    "activations": [ 0, 0 ],
                    "weights": [ [ random_gaussian(), random_gaussian(), random_gaussian() ], [ random_gaussian(), random_gaussian(), random_gaussian() ] ],
                    "weightActivations": [ [ 0, 0, 0 ], [ 0, 0, 0 ], [ 0, 0, 0 ] ],
                    "biases": [ random_gaussian(), random_gaussian() ]
                }
            ],
            "downType": null,
            "downIdx": null,
            "lastY": 0
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
                let sliced = false;
                let synapseSliced = false;
                for (let j = 0; j < layers[i].activations.length; ++j) {
                    let synapseSliced2 = false;
                    let z = layers[i].biases[j];
                    for (let k = 0; k < layers[i].weights[j].length; ++k) {
                        let zPart = layers[i - 1].activations[k] * layers[i].weights[j][k];
                        z += zPart;
                        let synapseActivation = Squish.function(zPart);
                        if (Math.abs(synapseActivation - layers[i].weightActivations[j][k]) > propagation_threshold) {
                            if (!synapseSliced2) {
                                if (!synapseSliced) {
                                    layers[i].weightActivations = layers[i].weightActivations.slice();
                                    synapseSliced = true;
                                }
                                layers[i].weightActivations[j] = layers[i].weightActivations[j].slice();
                                mod = synapseSliced2 = true;
                            }
                            layers[i].weightActivations[j][k] = synapseActivation;
                        }
                    }
                    let a = Squish.function(z);
                    if (Math.abs(a - layers[i].activations[j]) > propagation_threshold) {
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
                    "weightActivations": [],
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
                if (layers[i].weightActivations) {
                    layers[i].weightActivations = layers[i].weightActivations.slice();
                    layers[i].weightActivations.splice(this.props.shape[i]);
                }
                if (layers[i].biases) {
                    layers[i].biases = layers[i].biases.slice();
                    layers[i].biases.splice(this.props.shape[i]);
                }
                mod = true;
            } else if (layers[i].activations.length < this.props.shape[i]) {
                layers[i].activations = layers[i].activations.slice();
                while (layers[i].activations.length < this.props.shape[i]) {
                    layers[i].activations.push(i === 0 ? Math.random() : 0);
                }
                if (layers[i].weights) {
                    layers[i].weights = layers[i].weights.slice();
                    while (layers[i].weights.length < this.props.shape[i]) {
                        let weights = [];
                        for (let j = 0; j < layers[i - 1].activations.length; ++j) {
                            weights.push(random_gaussian());
                        }
                        layers[i].weights.push(weights);
                    }
                }
                if (layers[i].weightActivations) {
                    layers[i].weightActivations = layers[i].weightActivations.slice();
                    while (layers[i].weightActivations.length < this.props.shape[i]) {
                        let weightActivations = [];
                        for (let j = 0; j < layers[i - 1].activations.length; ++j) {
                            weightActivations.push(0);
                        }
                        layers[i].weightActivations.push(weightActivations);
                    }
                }
                if (layers[i].biases) {
                    layers[i].biases = layers[i].biases.slice();
                    while (layers[i].biases.length < this.props.shape[i]) {
                        layers[i].biases.push(random_gaussian());
                    }
                }
                mod = true;
            }
            if (layers[i].weights) {
                if (layers[i].weights[0].length > layers[i - 1].activations.length) {
                    layers[i].weights = layers[i].weights.slice();
                    for (let j = 0; j < layers[i].weights.length; ++j) {
                        layers[i].weights[j] = layers[i].weights[j].slice();
                        layers[i].weights[j].splice(layers[i - 1].activations.length);
                    }
                    mod = true;
                } else if (layers[i].weights[0].length < layers[i - 1].activations.length) {
                    layers[i].weights = layers[i].weights.slice();
                    for (let j = 0; j < layers[i].weights.length; ++j) {
                        layers[i].weights[j] = layers[i].weights[j].slice();
                        while (layers[i].weights[j].length < layers[i - 1].activations.length) {
                            layers[i].weights[j].push(random_gaussian());
                        }
                    }
                    mod = true;
                }
            }
            if (layers[i].weightActivations) {
                if (layers[i].weightActivations[0].length > layers[i - 1].activations.length) {
                    layers[i].weightActivations = layers[i].weightActivations.slice();
                    for (let j = 0; j < layers[i].weightActivations.length; ++j) {
                        layers[i].weightActivations[j] = layers[i].weightActivations[j].slice();
                        layers[i].weightActivations[j].splice(layers[i - 1].activations.length);
                    }
                    mod = true;
                } else if (layers[i].weightActivations[0].length < layers[i - 1].activations.length) {
                    layers[i].weightActivations = layers[i].weightActivations.slice();
                    for (let j = 0; j < layers[i].weightActivations.length; ++j) {
                        layers[i].weightActivations[j] = layers[i].weightActivations[j].slice();
                        while (layers[i].weightActivations[j].length < layers[i - 1].activations.length) {
                            layers[i].weightActivations[j].push(0);
                        }
                    }
                    mod = true;
                }
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
                layers[this.state.downIdx[0]].biases[this.state.downIdx[1]] += diff;
                break;
            case "synapse":
                let weights = layers[this.state.downIdx[0]].weights = layers[this.state.downIdx[0]].weights.slice();
                weights = weights[this.state.downIdx[1]] = weights[this.state.downIdx[1]].slice();
                weights[this.state.downIdx[2]] += diff;
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
            "downIdx": idx,
            "lastY": ev.clientY
        });
        ev.preventDefault();
    }

    handleBiasMouseDown(layerIdx, neuronIdx, ev) {
        this.setState({
            "downType": "bias",
            "downIdx": [ layerIdx, neuronIdx ],
            "lastY": ev.clientY
        });
        ev.preventDefault();
    }

    handleSynapseMouseDown(layerIdx, neuronIdx1, neuronIdx2, ev) {
        this.setState({
            "downType": "synapse",
            "downIdx": [ layerIdx, neuronIdx1, neuronIdx2 ],
            "lastY": ev.clientY
        });
        ev.preventDefault();
    }

    handleMouseUp(ev) {
        this.setState({
            "downType": null,
            "downIdx": null
        });
        ev.preventDefault();
    }

    handleMouseMove(ev) {
        if (this.state.downType) {
            this.updateDragValue((this.state.lastY - ev.clientY) / 100);
            this.setState({
                "lastY": ev.clientY
            });
            ev.preventDefault();
        }
    }

    render() {
        return (
            <div className="NeuralNetwork" onMouseUp={this.handleMouseUp} onMouseMove={this.handleMouseMove}>
                <div className="padding" />
                {this.state.layers.map((layer, idx) => (
                    <Layer key={`layer-${idx}`} activations={layer.activations} weights={layer.weights}
                        weightActivations={layer.weightActivations} biases={layer.biases}
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
