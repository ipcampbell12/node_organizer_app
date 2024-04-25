const express = require('express');
const router = express.Router();
const { readData, readRowById, writeData, deleteRowById, updateRowById, deleteAllValues } = require('../networkCalls');
const networkDebugger = require('debug')('app:networkCalls')
const { validatetask } = require('../helper_functions/validate')





router.get('/', async (req, res) => {
    const tasks = await readData();
    res.send(tasks)
});

router.get('/:id', async (req, res) => {
    try {
        const task = await readRowById(req.params.id)
        console.log('task retrieved: ', task)
        res.send(task);
    } catch (err) {
        networkDebugger(err)
    }
});


router.post('/', async (req, res) => {
    try {
        console.log("Post endpoint called")
        // networkDebugger("This endpoint was called")
        // const { error } = validatetask(req.body);

        // if (error) return res.status(400).send(error.details[0].message);

        const task = req.body;
        const taskArr = Object.values(task)
        const tasks = await readData();
        const id = await tasks.length + 1;
        console.log(id)

        console.log("task: ", taskArr)
        writeData([[id, ...taskArr]])
        res.send(taskArr)
    } catch (err) {
        networkDebugger(err)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const task = await deleteRowById(req.params.id)
        res.send(task)
        networkDebugger('The following task was removed: ', task)
    } catch (err) {
        networkDebugger(err)
    }
});

router.delete('/', async (req, res) => {
    const tasks = await readData();
    const num = await tasks.length
    const result = await deleteAllValues(num);
    res.send(result);
})

router.put('/:id', async (req, res) => {
    try {

        const { error } = validateTask(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const task = {
            id: req.params.id,
            title: req.body.title,
            description: req.body.description,
            workHome: req.body.workHome,
            when: req.body.when,
            type: req.body.type,
            frequency: req.body.frequency,
            reminder: req.body.reminder,
            calEvent: req.body.calEvent
        }
        networkDebugger('Here is the task: ', task)

        const taskArr = Object.values(task)

        await updateRowById([taskArr], req.params.id)
        res.send(task)
        networkDebugger('The following task was udpated: ', task)
    } catch (err) {
        networkDebugger(err)
    }
});


module.exports = router;
