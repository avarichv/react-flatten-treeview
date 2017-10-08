const lazyLoader = node => {
    return new Promise((resolve, reject) => {
        fetch("http://demo.io/lazy-load/" + node.origin.id)
            .then(response => response.json())
            .then(result => setTimeout(resolve, 2000, result));
    });
};

const config = {
    base: {
        lineHeight: 28,
        indent: 18,
        bufferSize: 50,
        lazyLoader: lazyLoader
    }
}

export default config;