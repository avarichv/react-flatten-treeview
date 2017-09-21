import React, { Component } from 'react';

import DefaultShader from './tree-shader.jsx';

export default class FlattenTreeviewCore extends Component {
    constructor(props) {
        super(props);

        this.state = { slice: [] };
    }

    componentDidMount() {
        this.setState({ slice: this.flatten(this.props.data) });
    }

    flatten(tree) {
        let list = [tree];

        tree.children.map(child => {
            child.$level = tree.$level + 1;
            list = list.concat(this.flatten(child));
        });

        return list;
    }

    render() {
        let { shader, config: { lineHieght, indent } } = this.props;
        let { slice } = this.state;

        shader = shader || DefaultShader;
        return (
            <div className="f-tree_core">
                <div className="f-tree_scroll-panel"></div>
                <ul className="f-tree_render-panel">
                    { slice.map(item => (
                        <li className="f-tree_node" 
                            key={item.text} >
                            { shader(item) }
                        </li>
                    ))}
                </ul>
            </div>
            
        );
    }
}