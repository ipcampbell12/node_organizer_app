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
        networkDebugger("This endpoint was called")
        const { error } = validatetask(req.body);

        if (error) return res.status(400).send(error.details[0].message);
        //networkDebugger("We got this far")
        const tasks = await readData();

        const tasksFromGoogle = await gettask(req.body.title, req.body.quantity)

        //console.log(tasksFromGoogle)

        const tasksWithIds = await Promise.all(tasksFromGoogle
            .map(
                (task, index) => ({ ...task, id: tasks.length + index }))
            .map(task => update(task)));

        writeData(tasksWithIds);
        //console.log({ title: tasksWithIds[0][1], summary: tasksWithIds[0][4] })
        sendMail("You've added another task",
            `Title: 
            ${tasksWithIds[0][1]}, 
            
            Summary: 
            ${tasksWithIds[0][4]}`)

        res.send(tasksWithIds)
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

        const { error } = validatetask(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const task = {
            id: req.params.id,
            title: req.body.title,
            author: req.body.author,
            pages: req.body.pages,
            summary: req.body.summary,
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
