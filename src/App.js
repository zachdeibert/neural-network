import React from "react";
import ShapeControl from "./controls/ShapeControl";
import NeuralNetwork from "./network/NeuralNetwork";
import "./App.css";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "shape": [ 2, 3, 2 ]
        };
        this.handleReshape = this.handleReshape.bind(this);
    }

    handleReshape(newShape) {
        this.setState({
            "shape": newShape
        });
    }

    render() {
        return (
            <div className="page">
                <div className="control-bar">
                    <div className="shape">
                        <ShapeControl shape={this.state.shape} onReshape={this.handleReshape} />
                    </div>
                </div>
                <div className="network">
                    <NeuralNetwork shape={this.state.shape} />
                </div>
            </div>
        );
    }
}
