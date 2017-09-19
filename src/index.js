import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//import Tree from 'react-flatten-treeview';
import Tree from './components/tree-view.jsx';

ReactDOM.render(
    <Tree />,
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