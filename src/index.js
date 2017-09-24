import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//import Tree from 'react-flatten-treeview';
import Tree from './components/tree-view.jsx';
import config from './demo/config.js';
import mockup from './demo/data.js';

import './theme/icons/IcoMoon-Free.css';
import './theme/default.scss';

const data = mockup.buildTree(null, [100,100 ]);

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