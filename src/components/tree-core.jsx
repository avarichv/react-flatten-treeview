import React, { Component } from 'react';

import DefaultShader from './tree-shader.jsx';
import StateKeyFrame from './state-key-frame.jsx';
import TransPanel from './transition-panel.jsx';

export default class FlattenTreeviewCore extends Component {
    constructor(props) {
        super(props);

        this.scrollTop = 0;
        this.cooldownTimer = null;
        this.state = { visible: [], offset: 0 };
        this.keyFrames = new StateKeyFrame(this);
        this.selection = new Set();

        this.offsetByTop = this.offsetByTop.bind(this);
        this.toggleNode = this.toggleNode.bind(this);
        this.selectNode = this.selectNode.bind(this);

        this.onClick = this.onClick.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    /* React ife cycle methods */

    componentDidMount() {
        const { config: { showRoot }} = this.props;
        let visible = this.flatten(this.props.data);

        if(!showRoot) {
            visible.shift();
            visible.forEach(item => item.$level--);
        }

        this.setState({ 
            visible,
            offset: 0
        });
    }

    /* Private methods */

    sortTermials(array) {
        const parents = [];
        const terminals = [];

        array.forEach(item => item.isTerminal ? terminals.push(item) : parents.push(item));
        return parents.concat(terminals);
    }

    flatten(tree, enforceExpand) {
        let list = [tree];
        
        tree.$level = tree.$level || 0;

        if(tree.children && tree.isExpanded || enforceExpand) {
            tree.children = this.sortTermials(tree.children);
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

        let flatten = this.flatten(nodeList[targetIndex]);

        return nodeList
                .slice(0, targetIndex)
                .concat(flatten)
                .concat(nodeList.slice(targetIndex + 1, nodeList.length));
    }

    toggleNode(node, index) {
        node.isExpanded = !node.isExpanded;
        let children = this.flattenChildren(node);
        let visible = this.state.visible;


        if(!node.isExpanded) {
            visible = this.clipChildren(visible, index);
            this.keyFrames.reset()
                .set(keyFrames => keyFrames.play({ visible, transition: { index, children }}))
                .set(keyFrames => setTimeout(me => me.play({ transition: { index, children, collapse: true }}), 10, keyFrames))
                .set(keyFrames => setTimeout(me => me.play({ transition: null }), 200, keyFrames))
                .play();
        } else {
            const { lazyLoader } = this.props.config;
            visible = this.spliceChildren(visible, index);

            this.keyFrames.reset();
            if(!node.isTerminal && node.children.length < node.childrenCount) {
                this.keyFrames
                    .set(keyFrames => keyFrames.play({ transition: { index, busy: true }}))
                    .set(keyFrames => {
                        if(typeof lazyLoader !== 'function') {
                            throw new Error("A lazyLoader callback is required."); 
                        }

                        lazyLoader(node).then(result => {
                            children = this.sortTermials(children.concat(result));
                            node.children = children;
                            visible = this.spliceChildren(visible, index);
                            keyFrames.play();
                        });
                    });
            }

            this.keyFrames
                .set(keyFrames => keyFrames.play({ transition: { index, children, expand: true }}))
                .set(keyFrames => setTimeout(me => me.play({ visible, transition: null }), 200, keyFrames))
                .play();
        }
    }

    selectNode(node, index) {
        if(node.isSelected) {
            this.selection.delete(node);
        } else {
            this.selection.add(node);
        }
        node.isSelected = !node.isSelected;

        if(typeof this.props.onSelect === 'function') {
            this.props.onSelect(Array.from(this.selection.values()));
        }

        this.setState({ visible: this.state.visible });
    }

    activateNode(node, index) {
        this.selection.forEach(p => p.isSelected = false);
        this.selection.clear();
        this.selection.add(node);

        node.isSelected = true;

        if(typeof this.props.onSelect === 'function') {
            this.props.onSelect(Array.from(this.selection.values()));
        }
        this.setState({ visible: this.state.visible });
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
        if(this.state.transition) { return; }

        const nodeIndex = parseInt(evt.currentTarget.dataset['index']);
        const node = this.state.visible[nodeIndex];
        const className = evt.target.className.split(' ')[0];
        const { config: { selectMode } } = this.props;

        switch(className) {
            case 'f-tree_label':
                selectMode === 'navigate' ? this.activateNode(node, nodeIndex) : this.selectNode(node, nodeIndex);
                break;
            case 'f-tree_toggle':
            case 'f-tree_icon':
                if(!node.isTerminal) {
                    this.toggleNode(node, nodeIndex);
                }
                break;
            default:
                break;
        }
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

    nodeStyle = (lineHeight, indent, level, nodeIndex, transition) => {
        const { index, busy, collapse } = transition || {};

        if(index === nodeIndex) {
            if(busy) {
                lineHeight *= 2;
            } else if(!collapse) {
                lineHeight *= transition.children.length + 1;
            }
        }

        return { 'paddingLeft': indent * level + 'px', 'height': lineHeight + 'px'};
    };

    nodeTransStyle = (transition, index) => {
        let className = '';

        if(transition && transition.index === index) {
            if(transition.expand) { className = ' -expand'; }
            if(transition.collapse) { className = ' -collapse'; }
            if(transition.busy) { className = ' -busy'; }
        }

        return className;
    };

    nodeSelectStyle = item => item.isSelected ? ' -selected' : '';

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
                        <li className={"f-tree_node" + this.nodeTransStyle(transition, index) + this.nodeSelectStyle(item)}
                            style={this.nodeStyle(lineHeight, indent, item.$level, index, transition)}
                            key={index + item.text}
                            data-index={index}
                            onClick={this.onClick}>
                            { node(item) }
                            { transition && TransPanel(transition, index, lineHeight, indent, node) }
                        </li>
                    ))}
                </ul>
            </div> 
        );
    }
}
