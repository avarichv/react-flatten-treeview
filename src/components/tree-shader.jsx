const FlattenTreeviewShader = props => {
    const { text } = props;
    console.error(props);
    return (
        <p className="f-tree_node-shader">
            <span className="f-tree_toggle"></span>
            <span className="f-tree_icon"></span>
            <span className="f-tree_label">{text}</span>
        </p>
    );
}

export default FlattenTreeviewShader;