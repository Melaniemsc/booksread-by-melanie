const mongoose = require('mongoose');
require('dotenv').config();

const BooksRead = require('./models/booksRead.js');


async function seed() {
    console.log('Seeding has Begun!');
    mongoose.connect(process.env.MONGODB_URI)
    console.log('Connection successful');


    const silence = await BooksRead.create({
       
        name: "The House of Hades",
        serie: "The Heroes of Olympus",
        number: 4,
        year: 2014,
        author: "Rick Riordan",
        genre: "Fantasy",

    })
    console.log(silence);
    mongoose.disconnect()
}

seed()