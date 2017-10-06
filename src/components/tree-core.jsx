import React, { Component } from 'react';

import DefaultShader from './tree-shader.jsx';

export default class FlattenTreeviewCore extends Component {
    constructor(props) {
        super(props);

        this.scrollTop = 0;
        this.cooldownTimer = null;
        this.state = { visible: [], offset: 0 };

        this.offset = this.offset.bind(this);
        this.toggleNode = this.toggleNode.bind(this);

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
        
        tree.$level = tree.$level || 0;

        if(tree.children && tree.isExpanded) {
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

        return nodeList
                .slice(0, targetIndex)
                .concat(this.flatten(nodeList[targetIndex]))
                .concat(nodeList.slice(targetIndex + 1, nodeList.length));
    }

    toggleNode(node, index) {
        let visible = null; 

        if(node.isExpanded) {
            node.isExpanded = false;
            visible = this.clipChildren(this.state.visible, index);
        } else {
            node.isExpanded = true;
            visible = this.spliceChildren(this.state.visible, index);
        }
        this.setState({ visible });
    }

    offset(scrollTop) {
        const { config: { lineHeight }} = this.props;
        const offset = Math.floor(scrollTop / lineHeight);

        this.setState({ offset });

        if(scrollTop !== this.scrollTop) {
            this.cooldownTimer = setTimeout((me) => me.offset(me.scrollTop), 200, this);
        } else {
            this.cooldownTimer = null;
        }
    }

    onClick(evt) {
        const nodeIndex = parseInt(evt.currentTarget.dataset['index']);
        const node = this.state.visible[nodeIndex];

        this.toggleNode(node, nodeIndex);
    }

    onScroll(evt) {
        if(!this.cooldownTimer) {
            this.offset(evt.target.scrollTop);
        }

        this.scrollTop = evt.target.scrollTop;
    }

    scrollStyle = (lineHeight, totalLines) => ({'height': lineHeight * totalLines + 'px'});

    offsetStyle = (lineHeight, offset) => ({ 'top': lineHeight * offset + 'px' });

    indentStyle = (lineHeight, indent, level) => ({ 'height': lineHeight + 'px', 'paddingLeft': indent * level + 'px' });

    render() {
        const { shader, config: { lineHeight, indent, bufferSize } } = this.props;
        const { visible, offset } = this.state;
        const node = shader || DefaultShader;
        const slice = visible.slice(offset, offset + bufferSize);

        //console.error(offset, slice.length);

        return (
            <div className="f-tree_core" onScroll={this.onScroll}>
                <div className="f-tree_scroll-panel" style={this.scrollStyle(lineHeight, visible.length)} />
                <ul className="f-tree_render-panel" style={this.offsetStyle(lineHeight, offset)}>
                    { slice.map((item,index) => (
                        <li className="f-tree_node"
                            style={this.indentStyle(lineHeight, indent, item.$level)}
                            key={item.text}
                            data-index={offset + index}
                            onClick={this.onClick}>
                            { node(item) }
                        </li>
                    ))}
                </ul>
            </div> 
        );
    }
}
