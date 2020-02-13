// declare the express framework and mongodb database as variables
let express = require('express')
let mongodb = require('mongodb')

//pass the express as a method into a variable called app
let app = express()

/* declare a database db (uninitialized) variable as a global variable so 
that it can be access from anywhere in our code */

let db

app.use(express.static('public'))

//take data and add it to the body object for asynchronous requests
app.use(express.json())

//take the submitted form data and add it to the body object of the request
app.use( express.urlencoded({extended : false}))

//connect to the database via db url string

let connectionString= 'mongodb+srv://user:user100@cluster0-wvo6k.mongodb.net/TryMe?retryWrites=true&w=majority'

mongodb.connect(connectionString, {useUnifiedTopology: true , useNewUrlParser: true}, function(err, client){
    db = client.db()
    // connect to the server with port number:3000
    app.listen(3000)
})

// send a get request to display the html page and get
app.get('/', function(req, res){
  // fetch the items from the database and pass it into server response to user's get request
db.collection('items').find().toArray(function(err, items){
console.log(items)


//  a server response with the displayed html page after receiving the get request

res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App</h1>
    
    <div class="jumbotron p-3 shadow-sm">
      <form action="/createItem" method ="POST" >
        <div class="d-flex align-items-center">
          <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>
    
    <ul class="list-group pb-5">
      
${items.map(function(item){
return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
          <button data-id = "${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
          <button data-id = "${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
      </li>`
      
}).join('')}

    </ul>
    
  </div>

  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="browser.js" ></script>

  </body>
</html>`)

})

})

// post the items in the todo app into the database and get a server response

app.post('/createItem', function(req, res){

db.collection('items').insertOne({text: req.body.item}, function(){
//redirect the response after the server responds to the post request
    res.redirect('/')

})

})

// post the updated items in the todo app into the database and get a server response
app.post('/update-item', function(req, res){
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, 
    {$set: {text: req.body.text}}, function(){

      res.send("Success")
    })
  })  

  // post the request to delete items from the todo app into the database and get a server response
app.post('/delete-item', function(req, res){
  db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function(){

    res.send("Success")
  })
})  
