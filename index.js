const Joi = require('joi')
const express = require('express')
const cors = require('cors')
const tasks = require('./routes/tasks')
const morgan = require('morgan')

const app = express()

app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(express.json());
app.use(morgan('tiny'));
app.use('/api/tasks', tasks);


const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});