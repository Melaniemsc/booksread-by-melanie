const mongoose = require ('mongoose')

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serie: { type: String, required: false },
    number: { type: Number, required: false },
    year: { type: Number, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
})

module.exports = mongoose.model('BooksRead', bookSchema)