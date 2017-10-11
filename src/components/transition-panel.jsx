const transStyle = indent => ({'paddingLeft': indent + 'px'});
const indentStyle = (lineHeight, indent, level) => ({ 'height': lineHeight, 'paddingLeft': indent * level });
const busyIndicator = () => (
    <p className="f-tree_node-busy">
        <span className="f-tree_spinner icon icon-hour-glass"></span>
        <span className="f-tree_busy-msg">Loading...</span>
    </p>
);

const Trans = (data, nodeIndex, lineHeight, indent, shader) => {
    if(nodeIndex !== data.index) { return null; }
    
    const { index, children = [], busy, expand, collpase } = data;
    const level = children[0] ? children[0].$level : 0;

    return (
        <ul className="f-tree_trans" style={transStyle(indent)}>
            { children.map((item, index) => (
                <li className="f-tree_trans-node" 
                    style={indentStyle(lineHeight, indent, item.$level - level)}>
                    { shader(item) }
                </li>
            ))}
            { busy ? busyIndicator() : null }
        </ul>
    );
}

export default Trans;