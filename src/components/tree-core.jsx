import React, { Component } from 'react';

import DefaultShader from './tree-shader.jsx';
import StateKeyFrame from './state-key-frame.jsx';
import Trans from './transition-panel.jsx';

export default class FlattenTreeviewCore extends Component {
    constructor(props) {
        super(props);

        this.scrollTop = 0;
        this.cooldownTimer = null;
        this.state = { visible: [], offset: 0 };
        this.keyFrames = new StateKeyFrame(this);

        this.offsetByTop = this.offsetByTop.bind(this);
        this.toggleNode = this.toggleNode.bind(this);

        this.onClick = this.onClick.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    /* React ife cycle methods */

    componentDidMount() {
        this.setState({ 
            visible: this.flatten(this.props.data),
            offset: 0
        });
    }

    /* Private methods */

    flatten(tree, enforceExpand) {
        let list = [tree];
        
        tree.$level = tree.$level || 0;

        if(tree.children && tree.isExpanded || enforceExpand) {
            tree.children.map(child => {
                child.$level = tree.$level + 1;
                list = list.concat(this.flatten(child));
            });
        }

        return list;
    }

    flattenChildren(node) {
        return this.flatten(node, true).slice(1);
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
        node.isExpanded = !node.isExpanded;
        let children = this.flattenChildren(node);
        let visible = this.state.visible;

        if(!node.isExpanded) {
            visible = this.clipChildren(visible, index);
            this.keyFrames
                .set(keyFrames => keyFrames.play({ visible, transition: { index, children }}))
                .set(keyFrames => setTimeout(me => me.play({ transition: { index, children, collapse: true }}), 10, keyFrames))
                .set(keyFrames => setTimeout(me => me.play({ transition: null }), 200, keyFrames))
                .play();
        } else {
            visible = this.spliceChildren(visible, index);
            this.keyFrames
                .set(keyFrames => keyFrames.play({ transition: { index, children, isBusy: false, expand: true }}))
                .set(keyFrames => setTimeout(me => me.play({ visible, transition: null }), 200, keyFrames))
                .play();
        }
    }

    offsetByTop(scrollTop) {
        const { config: { lineHeight }} = this.props;
        const offset = Math.floor(scrollTop / lineHeight);

        this.setState({ offset });

        if(scrollTop !== this.scrollTop) {
            this.cooldownTimer = setTimeout(me => me.offsetByTop(me.scrollTop), 200, this);
        } else {
            this.cooldownTimer = null;
        }
    }

    /* Event handlers */

    onClick(evt) {
        const nodeIndex = parseInt(evt.currentTarget.dataset['index']);
        const node = this.state.visible[nodeIndex];

        this.toggleNode(node, nodeIndex);
    }

    onScroll(evt) {
        if(!this.cooldownTimer) {
            this.offsetByTop(evt.target.scrollTop);
        }

        this.scrollTop = evt.target.scrollTop;
    }

    /*Render section*/

    scrollStyle = (lineHeight, totalLines) => ({'height': lineHeight * totalLines + 'px'});

    offsetStyle = (lineHeight, offset) => ({ 'top': lineHeight * offset + 'px' });

    nodeStyle = (lineHeight, indent, level, index, transition) => {
        if(transition && transition.index === index && !transition.collapse) {
            lineHeight *= transition.children.length + 1;
        }

        return { 'paddingLeft': indent * level + 'px', 'height': lineHeight + 'px'};
    };

    nodeTransStyle = (transition, index) => {
        let className = '';

        if(transition && transition.index === index) {
            if(transition.expand) { className = ' -expand'; }
            if(transition.collapse) { className = ' -collapse'; } 
        }

        return className;
    }

    render() {
        const { shader, config: { lineHeight, indent, bufferSize } } = this.props;
        const { visible, offset, transition } = this.state;
        const node = shader || DefaultShader;
        const slice = visible.slice(offset, offset + bufferSize);

        return (
            <div className="f-tree_core" onScroll={this.onScroll}>
                <div className="f-tree_scroll-panel" style={this.scrollStyle(lineHeight, visible.length)} />
                <ul className="f-tree_render-panel" style={this.offsetStyle(lineHeight, offset)}>
                    { slice.map((item,index) => (
                        index += offset,
                        <li className={"f-tree_node" + this.nodeTransStyle(transition, index)}
                            style={this.nodeStyle(lineHeight, indent, item.$level, index, transition)}
                            key={item.text}
                            data-index={index}
                            onClick={this.onClick}>
                            { node(item) }
                            { transition && Trans(transition, index, indent, node) }
                        </li>
                    ))}
                </ul>
            </div> 
        );
    }
}
