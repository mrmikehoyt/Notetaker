// need express to interact with the front end
const express = require("express");
// need path for filename paths
const path = require("path");
// need fs to read and write to files
const fs = require("fs");

// creating an "express" server
const app = express();
// Sets an Initial port for listeners
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

// routes

// api call response for all the notes, and sends the results to the browser as an array of object

app.get("/api/notes", function(err, res) {
   // apiGetNotes  = fs.readFile('./db/db.json', function(err,res){
    fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.error(err)
            return
          }
         
            try {
                const customer = JSON.parse(jsonString)
                console.log(customer.title) // => "prints title field to console"
                console.log(customer.text)  // => "prints text field to console"
                return customer.title
            } catch(err) {
                console.log('Error parsing JSON text:', err)
                
    }
            })
            
    })



//})

app.post("/api/notes", function(req, res) {
    const reqBodyNote = req.body
    const savedNoteArray = []
    const savedNote = JSON.stringify(reqBodyNote)
    fs.writeFile('./db/db.json', savedNote, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
            return savedNote
        }
    })

})

app.get("/", function(err, res) {
    res.sendFile(path.join(__dirname, './public/assets/index.html'))
})

app.get("/notes", function(err, res) {
    res.sendFile(path.join(__dirname, './public/assets/notes.html'))
})

app.delete("/api/notes/:id", function(err, res) {
    //res.sendFile(path.join(__dirname, 'view.html'))
})

app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`))