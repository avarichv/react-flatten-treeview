import mockData from './data.js';

const fetchMock = require('fetch-mock');

//fetchMock.mock('*', mockData.buildTree(null, [3,3,3,3,3]));
fetchMock.mock('http://demo.io/entire-tree', mockData.getBrandsData());

fetchMock.mock('http://demo.io/root', mockData.getRoot());

fetchMock.mock('express:http://demo.io/lazy-load/:id', url => {
    const id = url.substr(url.lastIndexOf('/') + 1);
    return mockData.getChildrenById(id);
});