import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//import Tree from 'react-flatten-treeview';
import Tree from './components/tree-view.jsx';
import config from './demo/config.js';
import mockup from './demo/mock.js';

import './theme/icons/IcoMoon-Free.css';
import './theme/default.scss';

fetch("http://demo.io").then(function(response) {
    return response.json();
}).then(function(data) {
    ReactDOM.render(
        <Tree data={data}
              config={config.base} />,
        document.getElementById('root')
    );
});

/*
    data={data}
    config={config}
    shader={shader}
    onSelect={onSelect}
    onChange={onChange}
    onAction={onAction}
*/