class DemoData {
    buildTree(parent, pattern = [3,3,3]) {
        if(!pattern.length) { return; }

        parent = parent || { text: 'item', children: [], $level: 0 };

        for(let i = 1; i <= pattern[0]; i++) {
            parent.children.push({
                text: parent.text + '.' + i,
                children: [],
                $level: 0
            });
        }

        parent.children.map(child => this.buildTree(child, pattern.slice(1)));

        if(parent.text == 'item') {
            parent.text = 'root';
        }

        return parent;
    }
}

export default new DemoData();