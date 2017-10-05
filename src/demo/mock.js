import mockData from './data.js';

const fetchMock = require('fetch-mock');

//fetchMock.mock('*', mockData.buildTree(null, [3,3,3,3,3]));
fetchMock.mock('*', mockData.getBrandsData());