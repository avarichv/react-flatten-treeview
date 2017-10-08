const transStyle = indent => ({'paddingLeft': indent + 'px'});
const indentStyle = (indent, level) => ({ 'paddingLeft': indent * level });

const Trans = (data, index, indent, shader) => {
    if(data.index !== index) { return null; }
    const level = data.children[0].$level;
    
    return (
        <ul className="f-tree_trans" style={transStyle(indent)}>
            { data.children.map((item, index) => (
                <li className="f-tree_trans-node" 
                    style={indentStyle(indent, item.$level - level)}>
                    { shader(item) }
                </li>
            ))}
        </ul>
    );
}

export default Trans;