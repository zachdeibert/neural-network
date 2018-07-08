import React from "react";
import PropTypes from "prop-types";
import "./ShapeControl.css";

class DimensionBox extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChangeInternal(val) {
        if (this.props.onChange && val && val >= 1 && val < 100000) {
            this.props.onChange(val);
        }
    }

    handleClick(delta) {
        this.handleChangeInternal(this.props.value + delta);
    }

    handleChange(ev) {
        let val = parseInt(ev.target.value, 10);
        this.handleChangeInternal(val);
    }

    render() {
        return (
            <div className="DimensionBox">
                <input type="text" value={this.props.value >= 0 ? this.props.value : ""} onChange={this.handleChange} />
                <div className="btns">
                    <div className="up" onClick={this.handleClick.bind(this, 1)} />
                    <div className="down" onClick={this.handleClick.bind(this, -1)} />
                    <div className="del" onClick={this.props.onRemove} />
                </div>
            </div>
        );
    }
}
DimensionBox.propTypes = {
    "value": PropTypes.number.isRequired,
    "onChange": PropTypes.func,
    "onRemove": PropTypes.func
};

export default class ShapeControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleDimensionAdded = this.handleDimensionAdded.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
    }

    handleDimensionChange(dimension, value) {
        if (this.props.onReshape) {
            let dims = this.props.shape.slice();
            dims[dimension] = value;
            this.props.onReshape(dims);
        }
    }

    handleDimensionAdded(val) {
        if (this.props.onReshape) {
            if (typeof(val) !== "number") {
                val = 1;
            }
            let dims = this.props.shape.slice();
            dims.push(val);
            this.props.onReshape(dims);
        }
    }

    handleDimensionRemoved(dimension) {
        if (this.props.onReshape) {
            let dims = this.props.shape.slice();
            dims.splice(dimension, 1);
            this.props.onReshape(dims);
        }
    }

    handleWheel(ev) {
        this.dimContainer.scrollLeft += ev.deltaY * 40;
        ev.preventDefault();
    }

    render() {
        return (
            <div className="ShapeControl">
                <label>Shape:</label>
                <div className="dimensions" onWheel={this.handleWheel} ref={el => this.dimContainer = el}>
                    {this.props.shape.map((size, idx) => (
                        <DimensionBox key={`dimension-${idx}`} value={size}
                            onChange={this.handleDimensionChange.bind(this, idx)}
                            onRemove={this.handleDimensionRemoved.bind(this, idx)} />
                    ))}
                    <div className="faded" onClick={this.handleDimensionAdded}>
                        <DimensionBox value={-1} onChange={this.handleDimensionAdded} />
                    </div>
                </div>
            </div>
        );
    }
}
ShapeControl.propTypes = {
    "shape": PropTypes.arrayOf(PropTypes.number),
    "onReshape": PropTypes.func
};
ShapeControl.defaultProps = {
    "shape": [ 2, 3, 2 ]
};
