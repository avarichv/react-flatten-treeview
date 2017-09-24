class DemoData {
    buildNode() {
        return {
            text: 'Item', 
            children: [],  
            isExpanded: true,
            $level: 0
        }
    }

    buildTree(parent, pattern = [3,3,3]) {
        if(!pattern.length) { return; }
        parent = parent || this.buildNode();

        for(let i = 1; i <= pattern[0]; i++) {
            let node = this.buildNode();
            node.text = parent.text + '.' + i,
            parent.children.push(node);
        }

        parent.children.map(child => this.buildTree(child, pattern.slice(1)));

        if(parent.text == 'Item') {
            parent.text = 'root';
        }

        return parent;
    }
}

export default new DemoData();