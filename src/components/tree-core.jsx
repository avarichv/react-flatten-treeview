import React, { Component } from 'react';

import DefaultShader from './tree-shader.jsx';

export default class FlattenTreeviewCore extends Component {
    constructor(props) {
        super(props);

        this.state = { visible: [] };

        this.onClick = this.onClick.bind(this);
        this.onScroll = this.onScroll.bind(this);
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

    onScroll(evt) {
        const offset = Math.floor(evt.target.scrollTop / this.props.config.lineHieght);
        this.setState({ offset });

        //TODO: Add event cool down timer;
    }

    render() {
        const { shader, config: { lineHieght, indent, bufferSize } } = this.props;
        const { visible, offset } = this.state;
        const node = shader || DefaultShader;
        const slice = visible.slice(offset, offset + bufferSize);
        console.error(offset, slice);
        return (
            <div className="f-tree_core" onScroll={this.onScroll}>
                <div className="f-tree_scroll-panel" style={{ 'height': lineHieght * visible.length + 'px' }}></div>
                <ul className="f-tree_render-panel" style={{ 'top': lineHieght * offset + 'px' }}>
                    { slice.map((item,index) => (
                            <li className="f-tree_node" data-index={index} key={item.text} 
                                style={{ 'paddingLeft': indent * item.$level + 'px', 'height': lineHieght + 'px' }}
                                onClick={this.onClick}>
                                { node(item) }
                            </li>
                    ))}
                </ul>
            </div>
            
        );
    }
}
