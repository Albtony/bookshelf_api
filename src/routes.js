const { addBookHandler, getBookHandler, updateBookHandler, deleteBookHandler, listEndpointsHandler, getAllBookHandler } = require("./handler");

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: listEndpointsHandler,
    },
    {
        method: 'POST',
        path: '/books',
        handler: addBookHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBookHandler,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookHandler,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookHandler,
    }
];
 
module.exports = routes;