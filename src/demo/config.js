const lazyLoader = node => {
    return new Promise((resolve, reject) => {
        fetch("http://demo.io/lazy-load/" + node.id)
            .then(response => response.json())
            .then(result => setTimeout(resolve, 500, result));
    });
};

const config = {
    base: {
        lineHeight: 28,
        indent: 18,
        bufferSize: 50,
        showRoot: false,
        selectMode: 'navigate', // navigate / select
        lazyLoader: lazyLoader
    }
}

export default config;