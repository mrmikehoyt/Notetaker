// need express to interact with the front end
const express = require("express");
// need path for filename paths
const path = require("path");
// need fs to read and write to files
const fs = require("fs");
// need uuid for unique id's
const {
    v4: uuid
} = require("uuid")
// creating an "express" server
const app = express();
// Sets an Initial port for listeners
const PORT = process.env.PORT || 3000;
//for setting up node server
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, "./public")));


//for reading notes / information on notes page 
app.get("/api/notes", function (req, res) {
    //reads db.json file and in if try, catch statement it's read as jsonString
    fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
        if (err) {
            //console.error(err)
            return
        }

        try {
            //parses json string and stores in customer variable
            const customer = JSON.parse(jsonString)
            //sends the json response
            res.json(customer)
        } catch (err) {
            console.log('Error parsing JSON text:', err)

        }
    })



})



//for saving information to db.json file

app.post("/api/notes", function (req, res) {
    //stores whats in body (stores note)
    const reqBodyNote = req.body
    //uuid is library / required item that contains id. attaching that to variable reqBodyNote / variable reqbodynote.id
    reqBodyNote.id = uuid()
    //converts to jsonstring reqbodynote and stores in variable
    //const savedNote = JSON.stringify(reqBodyNote)
    //reads file json
    fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            //parses db.json file, jsonstring is read and stored in allnotes
            let allnotes = JSON.parse(jsonString)
            //pushes reqbodynote (new note to allnotes)
            allnotes.push(reqBodyNote)

            //converts allnotes to string and writes file to db.json
            fs.writeFile('./db/db.json', JSON.stringify(allnotes), (err) => {
                if (err) {
                    console.log('Error writing file', err)
                }

            })
        }
    })

})
//default root for index
app.get("/", function (err, res) {
    res.sendFile(path.join(__dirname, './public/assets/index.html'))
})
//default root for notes
app.get("/notes", function (err, res) {
    res.sendFile(path.join(__dirname, './public/assets/notes.html'))
})

//for deleting notes
app.delete("/api/notes/:id", function (req, res) {

    //gets url (id) and stores in const reqparamsid
    const reqparamsid = req.params.id

    //read's json file
    fs.readFile('./db/db.json', 'utf8', (err, jsonString) => {

        if (err) {
            console.log('Error writing file', err)
        } else {
            //reads and converts json to string
            let allnotes2 = JSON.parse(jsonString)
            //filters parsed json
            const allnotes3 = allnotes2.filter((onenote) => {
                //returns id thats not equal to id
                return onenote.id != reqparamsid
            })

            //update rewrite filtered file to json string format without id, because id above is returned and writes to db.json file     
            fs.writeFile('./db/db.json', JSON.stringify(allnotes3), (err) => {
                if (err) {
                    console.log('Error writing file', err)
                }
            })
        }

    })
})


//starts nodejs server and listens on port
app.listen(PORT, () => console.log(`Note taking server is listening on PORT ${PORT}`))