const transStyle = indent => ({'paddingLeft': indent + 'px'});
const indentStyle = (indent, level) => ({ 'paddingLeft': indent * level });
const busyIndicator = () => (
    <p className="f-tree_node-busy">
        <span className="f-tree_spinner icon icon-hour-glass"></span>
        <span className="f-tree_busy-msg">Loading...</span>
    </p>
);

const Trans = (data, nodeIndex, indent, shader) => {
    if(nodeIndex !== data.index) { return null; }
    
    const { index, children = [], busy, expand, collpase } = data;
    const level = children[0] ? children[0].$level : 0;

    return (
        <ul className="f-tree_trans" style={transStyle(indent)}>
            { children.map((item, index) => (
                <li className="f-tree_trans-node" 
                    style={indentStyle(indent, item.$level - level)}>
                    { shader(item) }
                </li>
            ))}
            { busy ? busyIndicator() : null }
        </ul>
    );
}

export default Trans;