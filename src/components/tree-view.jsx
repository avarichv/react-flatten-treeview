import React, { Component } from 'react';

import Core from './tree-core.jsx';

export default class FlattenTreeview extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        const { data, config } = this.props;

        return (
            <div className="f-tree">
                <Core data={data} 
                  config={config} />
            </div>
        );
    }
}