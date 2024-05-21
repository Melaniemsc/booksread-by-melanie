require('dotenv').config()
const express = require('express');
const app = express();

const mongoose = require('mongoose')
const methodOverride = require("method-override");
const morgan = require("morgan")

const authController = require("./controllers/auth.js");


const BooksRead = require('./models/booksRead')
const port = process.env.PORT ? process.env.PORT : 3000
const session = require('express-session');


mongoose.connect(process.env.MONGODB_URI)


const path = require("path");
const booksRead = require('./models/booksRead');
const MongoStore = require("connect-mongo");


mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", ()=>{
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
})


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:process.env.MONGODB_URI,
    })
  })
)
app.use("/auth", authController);
app.use(express.static(path.join(__dirname,"public")))


app.get('/', (req, res) => {
  
  res.render('./home.ejs',{user:req.session.user});
});


app.get('/booksRead', async (req, res) => {
  const books = await BooksRead.find()
  console.log(books);
  res.render('./booksRead.ejs', 
  { books: books,
    user:req.session.user,
   })
})

app.get('/new-book', (req, res) => {
  res.render('./new.ejs',{user:req.session.user})
})

app.get('/booksRead/:booksReadId', async (req, res) => {
  const book = await BooksRead.findById(req.params.booksReadId)

  res.render('./show.ejs', {
    book,
    user:req.session.user,
  })
})

app.get('/booksRead/:booksReadId/edit', async (req, res) => {
  const book = await BooksRead.findById(req.params.booksReadId)
  res.render('./edit.ejs', {
    book,
    user:req.session.user
  })
})

app.get('/search', async (req,res) =>{

  res.render('./search.ejs',{
    user:req.session.user
  })
}) 

// app.get('/searchResults', async (req,res) =>{
//   const booksResult = await BooksRead.find({name:})
//   console.log(req);
//   res.render('./searchResults.ejs', {
//     booksResult,
//   })
// })


app.post('/booksRead', async (req, res) => {
  const isDuplicate = await BooksRead.findOne({name: req.body.name})
  if (!isDuplicate){
    await BooksRead.create(req.body)
  }
  res.redirect('/booksRead')
})

app.delete('/booksRead/:booksReadId', async (req, res) => {
  await BooksRead.findByIdAndDelete(req.params.booksReadId)
  res.redirect('/booksRead')
})

app.put('/booksRead/:booksReadId', async (req, res) => {
  await BooksRead.findByIdAndUpdate(req.params.booksReadId, req.body)
  res.redirect('/booksRead')
})

app.listen(port, () => {
  console.log('Listening on port 3000');
});
