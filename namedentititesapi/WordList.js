const express= require('express');
const bodyParser=require('body-parser');
const cors=require('cors');

const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var mysql = require('mysql');
 
// create a connection variable with the required details
var con = mysql.createConnection({
  host: "halifaxfoodie.caup3qijanqo.us-east-1.rds.amazonaws.com", // ip address of server running mysql
  user: "root", // user name to your mysql database
  password: "Group123", // corresponding password
  database: "halifaxfoodie" // use the specified database
});
 
// make to connection to the database.
con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM namedEntity", function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});



app.get('/wordList',(req,res)=>{
    con.query("SELECT * FROM namedEntity",(err, result) => {
        if(err) {
            console.log(err); 
            res.json({"error":true});
        }
        else { 
            console.log(result); 
            res.json(result); 
        }
    });
})

app.listen(3001,()=>{
  console.log("Port 3001");
})