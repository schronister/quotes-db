var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = express();
var PORT = process.env.PORT || 3000;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + "/public"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");
console.log(process.env.JAWSDB_URL);

var connection; 
if (process.env.JAWSDB_URL){
  connection = mysql.createConnection(process.env.JAWSDB_URL);
  console.log("hit the jawsdb ");
} else{
  connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "quotes_db"
});
}



connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

app.get("/", function(req,res){
  connection.query("SELECT * FROM quotes", function(err, response){
    if (err) throw err;
    res.render("index", {quotes:response});
  })
})


app.get("/quotes/:id", function(req,res){
  connection.query("SELECT * FROM quotes WHERE id = ?", [req.params.id],function(err,response){
    if (err) throw err;
    res.render("single_quote", response[0]);
  })
})

app.post("/add", function(req,res){
  connection.query("INSERT INTO quotes(quote, author) VALUES(?, ?)", [req.body.quote, req.body.author], function(err,response){
    if (err) throw err;
    res.redirect("/");

  })
})

app.delete("/delete", function(req,res){
  connection.query("DELETE FROM quotes WHERE id = ?",[req.body.id],function(err,response){
    console.log("quote deleted");
    res.redirect("/");
  })
})

app.put("/update/:id", function(req,res){
  console.log(req.params.id);
  connection.query("UPDATE quotes SET quote = ?, author = ? WHERE id", [ req.body.quote, req.body.author, req.params.id], function(err,response){
    if (err) throw err;
    console.log("quote updated");
    res.redirect("/");
  })
})


// Express and MySQL code should go here.

app.listen(PORT, function() {
  console.log("Listening on PORT " + port);
});
