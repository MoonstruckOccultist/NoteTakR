const nt = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { readAndAppend, writeToFile, readFromFile } = require('../helpers/fsUtils');

nt.get('/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

nt.post('/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const noteContents = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(noteContents, './db/db.json');

        const resObj = {
            status: 'All good, note saved',
            body: noteContents,
        };

        res.json(resObj);
    } else {
        res.json(`Error, title or text not recieved`);
    };
});

nt.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json('readfile error');
        }

        const notesArray = JSON.parse(data);

        const findNote = notesArray.findIndex((indvNote) => indvNote.id === noteId);

        if (findNote === -1) {
            return res.status(404).json
        }

        notesArray.splice(findNote, 1);

        fs.writeFile('./db/db.json', JSON.stringify(notesArray, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json('Writefile error');
            }

            res.json('note deleted succesfully');
        });
    });
});





module.exports = nt;