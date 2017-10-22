import React, { Component } from 'react';

import Core from './tree-core.jsx';

export default class FlattenTreeview extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <div className="f-tree">
                <Core {...this.props} />
            </div>
        );
    }
}