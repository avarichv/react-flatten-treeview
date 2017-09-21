import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//import Tree from 'react-flatten-treeview';
import Tree from './components/tree-view.jsx';

import config from './demo/config.js';
import mockup from './demo/data.js';

const data = mockup.buildTree();

ReactDOM.render(
    <Tree data={data}
          config={config.base} />,
    document.getElementById('root')
);

/*
    data={data}
    config={config}
    shader={shader}
    onSelect={onSelect}
    onChange={onChange}
    onAction={onAction}
*/