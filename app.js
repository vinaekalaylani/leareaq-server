if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const cors = require('cors')
const express = require("express");
const app = express();
const port = process.env.PORT || 3600
const routes = require('./routes/index')

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => res.send('SUCCESS'))
app.use('/', routes)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;