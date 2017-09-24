import React, { Component } from 'react';

import DefaultShader from './tree-shader.jsx';

export default class FlattenTreeviewCore extends Component {
    constructor(props) {
        super(props);

        this.state = { visible: [] };

        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        this.setState({ 
            visible: this.flatten(this.props.data),
            offset: 0
        });
    }

    flatten(tree) {
        let list = [tree];
        
        if(tree.isExpanded) {
            tree.children.map(child => {
                child.$level = tree.$level + 1;
                list = list.concat(this.flatten(child));
            });
        }

        return list;
    }

    clipChildren(nodeList, targetIndex) {
        if(nodeList.length <= targetIndex) { return nodeList; }

        const level = nodeList[targetIndex].$level;
        let start, end;
        for(start = end = targetIndex + 1; nodeList[end].$level > level; end++) {
            if(end >= nodeList.length - 1) {
                end++;
                break;
            }
        }

        nodeList.splice(start, end - start);
        return nodeList;
    }

    spliceChildren(nodeList, targetIndex) {
        if(nodeList.length <= targetIndex) { return nodeList; }

        const head = nodeList.slice(0, targetIndex);
        const expansion = this.flatten(nodeList[targetIndex]);
        const tail = nodeList.slice(targetIndex + 1, nodeList.length);
        return head.concat(expansion).concat(tail);
    }

    onClick(evt) {
        const nodeIndex = parseInt(evt.currentTarget.dataset['index']) + this.state.offset;
        const node = this.state.visible[nodeIndex];
        let visible = null;

        if(node.isExpanded) {
            node.isExpanded = false;
            visible = this.clipChildren(this.state.visible, nodeIndex);
        } else {
            node.isExpanded = true;
            visible = this.spliceChildren(this.state.visible, nodeIndex);
        }
        this.setState({ visible });
    }

    render() {
        let { shader, config: { lineHieght, indent } } = this.props;
        let { visible } = this.state;

        shader = shader || DefaultShader;
        return (
            <div className="f-tree_core">
                <div className="f-tree_scroll-panel"></div>
                <ul className="f-tree_render-panel">
                    { visible.map((item,index) => {
                        const style = {
                            'paddingLeft': indent * item.$level + 'px',
                            'height': lineHieght + 'px'
                        }

                        return (
                            <li className="f-tree_node" 
                                data-index={index}
                                key={item.text} 
                                style={style}
                                onClick={this.onClick}>
                                { shader(item) }
                            </li>
                        );
                    })}
                </ul>
            </div>
            
        );
    }
}
