require('dotenv').config()
const express = require('express');

const mongoose = require('mongoose')
const BooksRead = require('./models/booksRead')
const port = 3000
const methodOverride = require("method-override");
const morgan = require("morgan")
const path = require("path")
const app = express();
mongoose.connect(process.env.MONGODB_URI)

app.get('/', (req, res) => {
  res.render('./home.ejs');
});

app.get('/booksRead', async (req, res) => {
  const books = await BooksRead.find()
  console.log(books);
  res.render('./booksRead.ejs', { books: books })
})

app.get('/new-book', (req, res) => {
  res.render('./new.ejs')
})

app.get('/booksRead/:booksReadId', async (req, res) => {
  const book = await BooksRead.findById(req.params.booksReadId)

  res.render('./show.ejs', {
    book,
  })
})

app.get('/booksRead/:booksReadId/edit', async (req, res) => {
  const book = await BooksRead.findById(req.params.booksReadId)
  res.render('./edit.ejs', {
    book,
  })
})


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname,"public")))


app.post('/booksRead', async (req, res) => {
  const book = await BooksRead.create(req.body)
  res.redirect('/booksRead')
})


app.delete('/booksRead/:booksReadId', async (req, res) => {
  const book = await BooksRead.findByIdAndDelete(req.params.booksReadId)
  console.log(book);
  res.redirect('/booksRead')
})

app.put('/booksRead/:booksReadId', async (req, res) => {
  const book = await BooksRead.findByIdAndUpdate(req.params.booksReadId, req.body)
  res.redirect(`/booksRead`)
})

app.listen(port, () => {
  console.log('Listening on port 3000');
  console.log(`your secret its ${process.env.SECRET_PASSWORD}`);
  console.log(`My mongo db url is ${process.env.MONGODB_URI}`);
});
