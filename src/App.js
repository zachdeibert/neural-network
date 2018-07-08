import React from "react";
import ShapeControl from "./controls/ShapeControl";
import "./App.css";

export default class App extends React.Component {
    render() {
        return (
            <div className="page">
                <div className="control-bar">
                    <div className="shape">
                        <ShapeControl />
                    </div>
                </div>
                <div className="network">

                </div>
            </div>
        );
    }
}
