const toggleIcon = (props) => {
    const { children, isExpanded } = props;
    let className = ' icon';

    if(!children || children.length === 0) {
        className += '';
    } else if(isExpanded) {
        className += ' icon-play3 -expanded';
    } else {
        className += ' icon-play3';
    }

    return className;
}

const typeIcon = (props) => {
    const { children, isExpanded } = props;
    let className = ' icon';

    if(!children || children.length === 0) {
        className += ' icon-file-text2';
    } else if(isExpanded) {
        className += ' icon-folder-open';
    } else {
        className += ' icon-folder';
    }

    return className;
}

const FlattenTreeviewShader = props => {
    const { text } = props;

    return (
        <p className="f-tree_node-shader">
            <span className={"f-tree_toggle" + toggleIcon(props)}></span>
            <span className={"f-tree_icon" + typeIcon(props)}></span>
            <span className="f-tree_label">{text}</span>
        </p>
    );
}

export default FlattenTreeviewShader;