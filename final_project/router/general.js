const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

const axios = require('axios');

public_users.get('/', async function (req, res) {
  try {
        const response = await axios.get('https://unknowngamer-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/'); 
    
    const books = response.data;
    
    // Send the list of books as a response
    res.send(JSON.stringify(books, null, 4));
  } catch (error) {
    // Handle errors if the GET request fails
    console.error('Error fetching books:', error.message);
    res.status(500).send('Error fetching books');
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    
    if (book) {
      res.send(book);
    } else {
      res.status(404).send("Book not found");
    }
  });

//using async await
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      let isbn = req.params.isbn;
      let response = await axios.get(`https://example.com/books/${isbn}`);
      let book = response.data;
      if (book) {
        res.send(book);
      } else {
        res.status(404).send("Book not found");
      }
    } catch (error) {
      console.error('Error fetching book details:', error.message);
      res.status(500).send('Error fetching book details');
    }
  });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    let author = req.params.author;
    let foundBooks =[];
    for(let isbn in books)
    {
      let book = books[isbn];
      if (book.author==author) foundBooks.push(book);
    }
    
    if (foundBooks.length>0) {
      res.send(foundBooks);
    } else {
      res.status(404).send("Book not found");
    }
  });

//using async await
public_users.get('/author/:author', async function (req, res) {
    try {
      let author = req.params.author;
      let response = await axios.get(`https://example.com/books?author=${author}`);
      let foundBooks = response.data;
      if (foundBooks.length > 0) {
        res.send(foundBooks);
      } else {
        res.status(404).send("Book not found");
      }
    } catch (error) {
      console.error('Error fetching book details by author:', error.message);
      res.status(500).send('Error fetching book details by author');
    }
  });


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let foundBooks =[];
  for(let isbn in books)
  {
    let book = books[isbn];
    if (book.title==title) foundBooks.push(book);
  }
  
  if (foundBooks.length>0) {
    res.send(foundBooks);
  } else {
    res.status(404).send("Book not found");
}});

//using async await
public_users.get('/title/:title', async function (req, res) {
    try {
      let title = req.params.title;
      let response = await axios.get(`https://example.com/books?title=${title}`);
      let foundBooks = response.data;
      if (foundBooks.length > 0) {
        res.send(foundBooks);
      } else {
        res.status(404).send("Book not found");
      }
    } catch (error) {
      console.error('Error fetching book details by title:', error.message);
      res.status(500).send('Error fetching book details by title');
    }
  });
  
  
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book=books[isbn].reviews;
  res.send(book)
});

module.exports.general = public_users;
