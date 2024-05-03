import express from "express";
import fs from 'fs';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Read the contents of the 'queries.json' file into a variable
        const queriesData = fs.readFileSync('queries.json', 'utf8');        
        // If the read succeeds, return the data and status 200
        res.status(200).send(queriesData);
    } catch (error) {
        // If the read fails, log the error and return status 404
        console.error('Error reading queries file:', error);
        res.status(404).send("Queries file not found");
    }
});

router.post('/', async (req, res) => {
    const savedQueries = req.body;
    const savedQueriesString = JSON.stringify(savedQueries);
    try {
        fs.writeFileSync('queries.json', savedQueriesString);
        res.status(200).send("Query array saved");
    } catch (error) {
        console.error('Error saving query array:', error);
        res.status(500).send("Failed to save query array");
    }
});

export default router;
