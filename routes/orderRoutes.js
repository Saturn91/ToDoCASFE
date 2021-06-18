import express from 'express';
import {taskStore} from '../services/taskStorage.js';

const router = express.Router();

router.get('/tasks/add', (req, res) => taskStore.add(JSON.parse(req.query.task), (err, newEntry) => {
    if (!err) {
        res.send(newEntry);
    } else {
        res.send(err);
    }
}));

router.get('/tasks/get', (req, res) => taskStore.get(req.query.id, (err, task) => {
    if (!err) {
        res.send(JSON.stringify(task));
    } else {
        res.send(err);
    }
}));

router.get('/tasks/del', (req, res) => taskStore.delete(req.query.id, (err, deletedEntry) => {
    if (!err) {
        res.send(JSON.stringify(deletedEntry));
    } else {
        res.send(err);
    }
}));

router.get('/tasks', (req, res) => taskStore.all((err, data) => {
    if (!err) {
        res.send(data);
    } else {
        res.send(err);
    }
}));

export const orderRoutes = router;