const nt = require('express').Router();
const { readAndAppend, writeToFile, readFromFile } = require('../helpers/fsUtils');

nt.get('/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

nt.post('/notes', (req, res) => {
    const { title, text} = req.body;

    if (title && text) {
        const noteContents = {
            title,
            text,
        };

        readAndAppend(noteContents, './db/db.json');

        const resObj = {
            status: 'All good, note saved',
            body: noteContents
        };

        res.json(resObj);
    } else {
        res.json(`Error, title or text not recieved`);
    }
});

nt.delete('/notes/:id')





module.exports = nt;