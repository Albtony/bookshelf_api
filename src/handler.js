const { nanoid } = require('nanoid');
const books = require('./books');

const listEndpointsHandler = (request, h) => {
    const table = request.server.table();
    const endpoints = table.map(route => ({
        method: route.method,
        path: route.path
    }));

    return h.response(endpoints).code(200);
}

const addBookHandler = (request, h) => { 
    const nameIsValid = request.payload['name'] !== undefined && request.payload['name'] !== null;
    if(!nameIsValid) {
        const response = h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }

    const attributeIsValid = request.payload['readPage'] <= request.payload['pageCount']
    if(!attributeIsValid) {
        const response = h.response({
            "status": "fail",
            "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }

    // inserting books
    const { 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading 
    } = request.payload;
    const id = nanoid(16);
    const finished = pageCount == readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const newBook = {
        id, 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading, 
        finished, 
        insertedAt, 
        updatedAt,
    };
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    
    console.log(books)

    if (isSuccess) {
        const response = h.response({
            "status": "success",
            "message": "Buku berhasil ditambahkan",
            "data": {
                "bookId": id,
            }
        });
        response.code(201);
        return response;
    } else {
        const response = h.response({
            "status": "error",
            "message": "Terdapat error dalam server, mohon ulang dilain waktu",
        });
        response.code(500);
        return response;
    }
};

const getBookHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.find(book => book.id === bookId);

    if (book) {
        const response = h.response({
            "status": "success",
            "data": {
                "book": book
            },
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            "status": "fail",
            "message": "Buku tidak ditemukan"
        });
        response.code(404);
        return response;
    }
}

const getAllBookHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let filteredBooks = books.map(book => {
        const { id, name, publisher } = book;
        return { id, name, publisher };
    });

    const finishedBool = finished === '1';
    const readingBool = reading === '1';

    if (name !== undefined) {
        filteredBooks = filteredBooks.filter(book => book.name.includes(name));
      }
    
      if (finished !== undefined) {
        filteredBooks = filteredBooks.filter(book => book.finished === finishedBool);
      }
    
      if (reading !== undefined) {
        filteredBooks = filteredBooks.filter(book => book.reading === readingBool);
      }

    const response = h.response({
        "status": "success",
        data: {
            books: filteredBooks,
        },
    });
    response.code(200);
    return response;
}

const updateBookHandler = (request, h) => {
    const { bookId } = request.params;

    const nameIsValid = request.payload['name'] !== undefined && request.payload['name'] !== null;
    if(!nameIsValid) {
        const response = h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }

    const attributeIsValid = request.payload['readPage'] <= request.payload['pageCount']
    if(!attributeIsValid) {
        const response = h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    const bookIndex = books.findIndex(book => book.id === bookId);
    if(bookIndex !== -1) {
        books[bookIndex] = {
            ...books[bookIndex],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading
        };

        const response = h.response({
            "status": "success",
            "message": "Buku berhasil diperbarui"
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            "status": "fail",
            "message": "Gagal memperbarui buku. Id tidak ditemukan"
        });
        response.code(404);
        return response;
    }
}

const deleteBookHandler = (request, h) => {
    const { bookId } = request.params;
    const bookIndex = books.findIndex(book => book.id === bookId);

    if(bookIndex !== -1) {
        books.splice(bookIndex, 1);
        const response = h.response({
            "status": "success",
            "message": "Buku berhasil dihapus"
        });
        response.code(200);
        return response;    
    } else {
        const response = h.response({
            "status": "fail",
            "message": "Buku gagal dihapus. Id tidak ditemukan"
        });
        response.code(404);
        return response;    
    }
}


function nameIsValid(request) {
    return request.payload['name'] !== undefined && request.payload['name'] !== null;
}

function attributeIsValid(request) {
    return request.payload['readPage'] <= request.payload['pageCount']
}

module.exports = { listEndpointsHandler, addBookHandler, getBookHandler, updateBookHandler, deleteBookHandler, getAllBookHandler };